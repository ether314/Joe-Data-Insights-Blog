#!/usr/bin/env node
/**
 * Claim up to N topics into artifacts/agent-jobs.json (never-idle producers).
 *
 * Order per free slot:
 *   1) unique NEW slug (backlog, {theme}-research-{year} if that family is free,
 *      otherwise follow-up / adjacent / dated variant — never the same slug)
 *   2) operator retry of parked infra jobs (transport_kill, worker_exit_0,
 *      spawn/dispatch) — cap OPERATOR_REQUEUE_MAX (default 2)
 *   3) next-cycle mint from remaining catalog so producers stay busy
 *
 * *-research stem already taken does NOT empty the queue — mint a new slug.
 *
 * Usage: node scripts/claim-next-topics.mjs [--max 4] [--run-id local-...]
 *        [--include-recovery-idle] [--force-slots N] [--dry-run]
 */
import fs from "node:fs";
import path from "node:path";
import {
  REPO_ROOT,
  readJobs,
  writeJobs,
  activeJobs,
  freeWorkers,
  freeRecoveryWorker,
  unassignedClaimedJobs,
  slugify,
  PRODUCTION_WORKER_COUNT,
  seedFlagsFromHistory,
  isStemBlocked,
  isThemeBlocked,
  topicStem,
  listRecoverableFailures,
  isManualReviewJob,
  listOperatorRetryJobs,
  reopenJobForOperatorRetry,
  unresolvedManualReviewThemes,
} from "./lib/agent-jobs.mjs";
import {
  THEME_REGISTRY,
  getEligibleThemes,
  getBacklogFromEligibleThemes,
} from "../src/data/theme-registry.ts";

/** Finite follow-up catalog: 9 angles × ~20 themes × year/quarter/month variants. */
const FOLLOWUP_ANGLES = [
  {
    slug: "update",
    title: "Latest data update",
    question: "What changed in the newest official vintage versus the last post on this theme?",
    hint: "YoY or vintage delta",
  },
  {
    slug: "concentration",
    title: "Concentration and market share",
    question: "How concentrated is this system at the top of the distribution?",
    hint: "Top-1 / top-3 share",
  },
  {
    slug: "geography",
    title: "Geographic split",
    question: "Where does activity, risk, or capacity concentrate geographically?",
    hint: "Regional or country share",
  },
  {
    slug: "vs-prior-cycle",
    title: "Vs prior cycle",
    question: "How does the current cycle compare with the last comparable period?",
    hint: "Cycle-over-cycle change",
  },
  {
    slug: "policy",
    title: "Policy overlay",
    question: "Which policy levers most bind this market or system right now?",
    hint: "Rule, subsidy, or mandate that moves the series",
  },
  {
    slug: "who-pays",
    title: "Incidence: who pays",
    question: "Who bears the cost, risk, or subsidy in this system?",
    hint: "Payer vs beneficiary split",
  },
  {
    slug: "bottleneck",
    title: "Bottleneck map",
    question: "Where is the binding physical or financial constraint?",
    hint: "Constraint metric",
  },
  {
    slug: "h1",
    title: "H1 vintage",
    question: "What does first-half data show versus the full-year narrative?",
    hint: "H1 print",
  },
  {
    slug: "h2",
    title: "H2 vintage",
    question: "What does the back half of the year change about the full-year picture?",
    hint: "H2 print",
  },
];

function parseArgs(argv) {
  const out = {
    max: PRODUCTION_WORKER_COUNT,
    runId: null,
    includeRecoveryIdle: false,
    forceSlots: null,
    dryRun: false,
  };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--max") out.max = Number(argv[++i]) || PRODUCTION_WORKER_COUNT;
    if (argv[i] === "--run-id") out.runId = argv[++i];
    if (argv[i] === "--include-recovery-idle") out.includeRecoveryIdle = true;
    if (argv[i] === "--force-slots") out.forceSlots = Number(argv[++i]) || 0;
    if (argv[i] === "--dry-run") out.dryRun = true;
  }
  return out;
}

function loadSlugThemePairs() {
  const postsSrc = fs.readFileSync(path.join(REPO_ROOT, "src/data/posts.ts"), "utf8");
  const blocks = postsSrc.split(/\n\s*},\s*\n\s*{/);
  const pairs = [];
  for (const block of blocks) {
    const slug = block.match(/slug:\s*"([^"]+)"/)?.[1];
    if (!slug) continue;
    const themeId = block.match(/themeId:\s*"([^"]+)"/)?.[1];
    pairs.push({ slug, themeId });
  }
  return pairs;
}

function yearTag() {
  return String(new Date().getFullYear());
}

function monthTag() {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${d.getFullYear()}${m}`;
}

function quarterTag() {
  const d = new Date();
  const q = Math.floor(d.getMonth() / 3) + 1;
  return `${d.getFullYear()}q${q}`;
}

/** Exact slug already used in posts, queue, or shipped/parked jobs. */
function slugTaken(data, claimedSlugs, slug) {
  if (!slug) return true;
  if (claimedSlugs.has(slug)) return true;
  for (const j of data.jobs || []) {
    if (j.slug === slug && !(j.status === "failed" && j.resolution)) return true;
  }
  return false;
}

/**
 * True when this exact research/backlog stem is reserved (in-flight, parked, or
 * shipped under that family). Follow-up slugs should NOT use this — they mint a
 * different stem.
 */
function stemTakenLocal(data, claimedSlugs, base) {
  if (!base) return true;
  if (isStemBlocked(data, base)) return true;
  if (claimedSlugs.has(base)) return true;
  for (const s of claimedSlugs) {
    if (s === base || s.startsWith(`${base}-`) || topicStem(s) === topicStem(base)) {
      return true;
    }
  }
  for (const j of data.jobs || []) {
    if (!j.slug) continue;
    if (j.status === "shipped") continue;
    if (j.status === "failed") {
      if (j.resolution) continue;
    }
    if (j.slug === base || j.slug.startsWith(`${base}-`) || topicStem(j.slug) === topicStem(base)) {
      return true;
    }
  }
  return false;
}

function followupSlugCandidates(themeId, angleSlug) {
  const y = yearTag();
  const q = quarterTag();
  const ym = monthTag();
  return [
    `${themeId}-${angleSlug}-${y}`,
    `${themeId}-${angleSlug}-${q}`,
    `${themeId}-${angleSlug}-${ym}`,
  ].map((s) => s.replace(/--+/g, "-"));
}

function mintFollowup(theme, data, claimedSlugs) {
  for (const angle of FOLLOWUP_ANGLES) {
    for (const slug of followupSlugCandidates(theme.id, angle.slug)) {
      if (slugTaken(data, claimedSlugs, slug)) continue;
      const stem = topicStem(slug);
      // Exact stem park only — do not inherit *-research family blocks.
      if ((data.flags?.blockedStems || []).includes(stem)) continue;
      return {
        themeId: theme.id,
        category: theme.category,
        slug,
        title: `${angle.title}: ${theme.label}`,
        coreQuestion: `${angle.question} (${theme.metaQuestion})`,
        primarySources: [],
        headlineStatHint: angle.hint,
        fromBacklog: false,
        generated: true,
        visualLane: theme.visualLane,
        angle: angle.slug,
      };
    }
  }
  return null;
}

/** Last-resort unique slug when the finite follow-up catalog is exhausted. */
function mintNextCycle(theme, data, claimedSlugs) {
  const y = yearTag();
  const ym = monthTag();
  for (let n = 2; n <= 24; n++) {
    for (const slug of [`${theme.id}-cycle${n}-${y}`, `${theme.id}-cycle${n}-${ym}`]) {
      if (slugTaken(data, claimedSlugs, slug)) continue;
      const stem = topicStem(slug);
      if ((data.flags?.blockedStems || []).includes(stem)) continue;
      return {
        themeId: theme.id,
        category: theme.category,
        slug,
        title: `Cycle ${n}: ${theme.label}`,
        coreQuestion: `What does the next data cycle show for this theme? (${theme.metaQuestion})`,
        primarySources: [],
        headlineStatHint: "Cycle-over-cycle change",
        fromBacklog: false,
        generated: true,
        visualLane: theme.visualLane,
        angle: `cycle${n}`,
      };
    }
  }
  return null;
}

function themeLoad(data, themeId) {
  if (!themeId) return 0;
  return activeJobs(data).filter((j) => j.themeId === themeId).length;
}

function persistClaimResult(payload, dryRun) {
  try {
    const out = path.join(REPO_ROOT, "artifacts", "last-claim.json");
    fs.writeFileSync(out, `${JSON.stringify({ ...payload, dryRun: Boolean(dryRun) }, null, 2)}\n`);
  } catch {
    /* observability only */
  }
}

function pushJob(data, pick, now) {
  const id = `job-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
  const job = {
    id,
    slug: pick.slug,
    themeId: pick.themeId,
    category: pick.category,
    title: pick.title,
    coreQuestion: pick.coreQuestion,
    primarySources: pick.primarySources,
    headlineStatHint: pick.headlineStatHint,
    visualLane: pick.visualLane || null,
    status: "claimed",
    workerId: null,
    worktreePath: null,
    branch: `post/${pick.slug}`,
    attempts: 0,
    startedAt: null,
    heartbeat: null,
    activity: pick.generated
      ? `Claimed (generated ${pick.angle || "follow-up"}) - awaiting worker`
      : "Claimed - awaiting worker",
    lastError: null,
    headlineStat: null,
    flagged: false,
    createdAt: now,
    updatedAt: now,
  };
  data.jobs.unshift(job);
  return job;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const data = readJobs();
  if (args.runId) data.runId = args.runId;

  seedFlagsFromHistory(data);

  const pairs = loadSlugThemePairs();
  const parkedJobs = (data.jobs || []).filter(
    (j) => j.status === "failed" && !j.resolution && (isManualReviewJob(j) || j.flagged),
  );
  const claimedSlugs = new Set([
    ...pairs.map((p) => p.slug),
    ...activeJobs(data).map((j) => j.slug),
    ...data.jobs.filter((j) => j.status === "shipped").map((j) => j.slug),
    ...parkedJobs.map((j) => j.slug).filter(Boolean),
  ]);

  const recoveryThemes = new Set(
    listRecoverableFailures(data)
      .map((j) => j.themeId)
      .filter(Boolean),
  );
  const claimedThemes = new Set([
    ...activeJobs(data).map((j) => j.themeId).filter(Boolean),
    ...(data.flags?.blockedThemes || []),
    ...recoveryThemes,
  ]);

  const free = freeWorkers(data).length + (args.includeRecoveryIdle && freeRecoveryWorker(data) ? 1 : 0);
  const waiting = unassignedClaimedJobs(data).length;
  let openSlots =
    args.forceSlots != null && args.forceSlots > 0
      ? args.forceSlots
      : Math.max(0, Math.min(args.max, free - waiting));
  const emptyPayload = {
    claimed: 0,
    reason: free === 0 ? "no free workers" : "claimed jobs already waiting",
    free,
    waiting,
    active: activeJobs(data).length,
    blockedStems: data.flags?.blockedStems?.length || 0,
    blockedThemes: data.flags?.blockedThemes?.length || 0,
    recoveryThemes: [...recoveryThemes],
  };
  if (openSlots === 0) {
    console.log(JSON.stringify(emptyPayload, null, 2));
    persistClaimResult(emptyPayload, args.dryRun);
    if (!args.dryRun) writeJobs(data);
    return;
  }

  const backlog = getBacklogFromEligibleThemes(pairs);
  const eligible = getEligibleThemes(pairs).filter((t) => !isThemeBlocked(data, t.id));
  const allActiveThemes = THEME_REGISTRY.filter(
    (t) => t.status === "active" && !isThemeBlocked(data, t.id),
  ).sort((a, b) => themeLoad(data, a.id) - themeLoad(data, b.id));
  const skipped = [];
  const created = [];
  const retried = [];
  const now = new Date().toISOString();
  const retryableNow = listOperatorRetryJobs(data);
  const retryThemes = new Set(retryableNow.map((j) => j.themeId).filter(Boolean));
  // Unresolved MR parks (including retry-exhausted) must not mint follow-up
  // siblings — that was the spawn-fail incinerator (update → q3 → 202608).
  const parkThemes = unresolvedManualReviewThemes(data);
  const deferThemes = new Set([...retryThemes, ...parkThemes]);

  const takePick = (pick) => {
    const job = pushJob(data, pick, now);
    created.push(job);
    claimedSlugs.add(pick.slug);
    if (pick.themeId) claimedThemes.add(pick.themeId);
    openSlots--;
  };

  const catalog = [...eligible, ...allActiveThemes.filter((t) => !eligible.some((e) => e.id === t.id))];

  // (1) Unique NEW slugs — backlog, then research family if free, then follow-ups.
  // Do not remint *-research; stem taken → adjacent angle. Skip themes parked for retry
  // so we reopen that job in (2) instead of minting a sibling (spawn-fail incinerator).
  for (const c of backlog) {
    if (openSlots <= 0) break;
    if (recoveryThemes.has(c.themeId)) {
      skipped.push({ themeId: c.themeId, reason: "theme_has_recoverable_failure" });
      continue;
    }
    if (deferThemes.has(c.themeId)) continue;
    if (claimedThemes.has(c.themeId) || isThemeBlocked(data, c.themeId)) {
      skipped.push({ themeId: c.themeId, reason: "theme_blocked_or_active" });
      continue;
    }
    const base = slugify(c.title.replace(/^\[[^\]]+\]\s*/, ""));
    const slug = `${base}-${yearTag()}`.replace(/--+/g, "-");
    if (slugTaken(data, claimedSlugs, slug) || stemTakenLocal(data, claimedSlugs, base)) {
      skipped.push({ themeId: c.themeId, stem: base, reason: "stem_taken_or_flagged" });
      continue;
    }
    takePick({
      themeId: c.themeId,
      category: eligible.find((t) => t.id === c.themeId)?.category || "Global Systems",
      slug,
      title: c.title,
      coreQuestion: c.coreQuestion,
      primarySources: c.primarySources || [],
      headlineStatHint: c.headlineStatHint || "",
      fromBacklog: true,
    });
  }

  for (const theme of eligible) {
    if (openSlots <= 0) break;
    if (recoveryThemes.has(theme.id) || claimedThemes.has(theme.id) || isThemeBlocked(data, theme.id)) {
      continue;
    }
    if (deferThemes.has(theme.id)) continue;
    const researchBase = `${slugify(theme.id)}-research`;
    if (stemTakenLocal(data, claimedSlugs, researchBase)) {
      skipped.push({ themeId: theme.id, stem: researchBase, reason: "research_stem_taken_will_followup" });
      continue;
    }
    const slug = `${researchBase}-${yearTag()}`;
    if (slugTaken(data, claimedSlugs, slug)) {
      skipped.push({ themeId: theme.id, stem: researchBase, reason: "research_slug_taken" });
      continue;
    }
    takePick({
      themeId: theme.id,
      category: theme.category,
      slug,
      title: `Research and ship: ${theme.label}`,
      coreQuestion: theme.metaQuestion,
      primarySources: [],
      headlineStatHint: "",
      fromBacklog: false,
      visualLane: theme.visualLane,
    });
  }

  const seenTheme = new Set();
  for (const theme of catalog) {
    if (openSlots <= 0) break;
    if (seenTheme.has(theme.id)) continue;
    seenTheme.add(theme.id);
    if (recoveryThemes.has(theme.id) || isThemeBlocked(data, theme.id)) continue;
    if (deferThemes.has(theme.id)) {
      skipped.push({
        themeId: theme.id,
        reason: parkThemes.has(theme.id)
          ? "defer_followup_for_unresolved_manual_review"
          : "defer_followup_for_operator_retry",
      });
      continue;
    }
    if (claimedThemes.has(theme.id)) continue;
    const pick = mintFollowup(theme, data, claimedSlugs) || mintNextCycle(theme, data, claimedSlugs);
    if (!pick) {
      skipped.push({ themeId: theme.id, reason: "followup_catalog_exhausted" });
      continue;
    }
    takePick(pick);
  }

  // (2) Operator retry of parked infra (same slug, cap 2)
  if (openSlots > 0) {
    for (const failed of listOperatorRetryJobs(data)) {
      if (openSlots <= 0) break;
      if (
        failed.themeId &&
        activeJobs(data).some((j) => j.themeId === failed.themeId && j.id !== failed.id)
      ) {
        skipped.push({ themeId: failed.themeId, slug: failed.slug, reason: "theme_already_active" });
        continue;
      }
      const reopened = reopenJobForOperatorRetry(data, failed.id);
      if (!reopened) continue;
      retried.push({ id: reopened.id, slug: reopened.slug, operatorRequeues: reopened.operatorRequeues });
      if (reopened.themeId) claimedThemes.add(reopened.themeId);
      if (reopened.slug) claimedSlugs.add(reopened.slug);
      openSlots--;
    }
  }

  // (3) Next cycle / extra angle so leftover slots never idle (may share a theme).
  // Still never mint a sibling of an unresolved Manual Review park.
  if (openSlots > 0) {
    for (const theme of allActiveThemes) {
      if (openSlots <= 0) break;
      if (recoveryThemes.has(theme.id) || isThemeBlocked(data, theme.id)) continue;
      if (deferThemes.has(theme.id)) continue;
      const pick = mintFollowup(theme, data, claimedSlugs) || mintNextCycle(theme, data, claimedSlugs);
      if (!pick) continue;
      takePick(pick);
    }
  }

  const result = {
    claimed: created.length,
    retried: retried.length,
    runId: data.runId,
    jobs: created.map((j) => ({ id: j.id, slug: j.slug, themeId: j.themeId, generated: Boolean(j.activity?.includes("generated")) })),
    retries: retried,
    skipped: skipped.slice(0, 24),
    remainingSlots: openSlots,
    blockedStems: data.flags?.blockedStems || [],
    blockedThemes: data.flags?.blockedThemes || [],
  };
  if (!args.dryRun) writeJobs(data);
  persistClaimResult(result, args.dryRun);
  console.log(JSON.stringify(result, null, 2));
}

main();
