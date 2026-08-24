#!/usr/bin/env node
/**
 * Claim up to N topics into artifacts/agent-jobs.json (never-idle producers).
 *
 * Order per free slot:
 *   1) unused named candidates (novel themes first) — never {theme}-update /
 *      concentration / geography sequels of the existing article base
 *   2) {theme}-research-{year} only when that theme has ZERO lifetime posts
 *   3) operator retry of parked infra jobs (cap OPERATOR_REQUEUE_MAX)
 *   4) more unused diversity candidates so producers stay busy
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
  getEligibleThemes,
  getDiversityBacklog,
  lifetimePostCount,
} from "../src/data/theme-registry.ts";

/** Banned sequel families — these made the archive a hall of mirrors. */
const SEQUEL_SLUG_RE =
  /-(update|concentration|geography|vs-prior-cycle|policy|who-pays|bottleneck|h1|h2|cycle\d+)-/i;

/** Post-format rotation — varies article shape across consecutive claims. */
const FORMATS = ["deep-dive", "brief", "data-story", "explainer", "field-note"];

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

/** Exact slug already used in posts, queue, or shipped/parked jobs. */
function slugTaken(data, claimedSlugs, slug) {
  if (!slug) return true;
  if (SEQUEL_SLUG_RE.test(slug)) return true;
  if (claimedSlugs.has(slug)) return true;
  for (const j of data.jobs || []) {
    if (j.slug === slug && !(j.status === "failed" && j.resolution)) return true;
  }
  return false;
}

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

function persistClaimResult(payload, dryRun) {
  try {
    const out = path.join(REPO_ROOT, "artifacts", "last-claim.json");
    fs.writeFileSync(out, `${JSON.stringify({ ...payload, dryRun: Boolean(dryRun) }, null, 2)}\n`);
  } catch {
    /* observability only */
  }
}

const WISHLIST_FILE = path.join(REPO_ROOT, "artifacts", "topic-wishlist.json");

function readWishlist() {
  try {
    const parsed = JSON.parse(fs.readFileSync(WISHLIST_FILE, "utf8"));
    return Array.isArray(parsed?.items) ? parsed.items : [];
  } catch {
    return [];
  }
}

/** First wishlist entry by priority whose stem is not already taken/blocked. */
function nextWishlistItem(data, claimedSlugs) {
  const items = [...readWishlist()].sort(
    (a, b) => (Number(b.priority) || 0) - (Number(a.priority) || 0),
  );
  for (const item of items) {
    if (!item?.stem || !item?.title) continue;
    const base = slugify(item.stem);
    if (!stemTakenLocal(data, claimedSlugs, base)) return item;
  }
  return null;
}

/**
 * Atomically remove one item from topic-wishlist.json
 * (write temp file + rename). Returns false when the item vanished.
 */
function popWishlistItem(item, dryRun) {
  if (dryRun) return true;
  try {
    const raw = JSON.parse(fs.readFileSync(WISHLIST_FILE, "utf8"));
    const before = Array.isArray(raw.items) ? raw.items.length : 0;
    raw.items = (raw.items || []).filter((i) => i?.stem !== item.stem);
    if (raw.items.length >= before) return false;
    const tmp = `${WISHLIST_FILE}.tmp`;
    fs.writeFileSync(tmp, `${JSON.stringify(raw, null, 2)}\n`);
    fs.renameSync(tmp, WISHLIST_FILE);
    return true;
  } catch {
    return false;
  }
}

/**
 * Read-modify-write of artifacts/last-claim.json preserving unrelated keys.
 * Returns the next format for this run's claims.
 */
function nextClaimFormat(jobsCount, dryRun) {
  const file = path.join(REPO_ROOT, "artifacts", "last-claim.json");
  let state = {};
  try {
    state = JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    /* first run or unreadable — initialize below */
  }

  let index;
  if (Number.isInteger(state.formatCycleIndex)) {
    index = (state.formatCycleIndex + 1) % FORMATS.length;
  } else {
    index = (jobsCount || 0) % FORMATS.length;
  }
  if (!dryRun) {
    try {
      fs.writeFileSync(
        file,
        `${JSON.stringify({ ...state, formatCycleIndex: index }, null, 2)}\n`,
      );
    } catch {
      /* observability only */
    }
  }
  return FORMATS[index];
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
    format: pick.format || null,
    status: "claimed",
    workerId: null,
    worktreePath: null,
    branch: `post/${pick.slug}`,
    attempts: 0,
    startedAt: null,
    heartbeat: null,
    activity: pick.generated
      ? `Claimed (novel ${pick.angle || "diversity"}) - awaiting worker`
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

  const skipped = [];
  const created = [];
  const retried = [];
  const now = new Date().toISOString();
  const retryableNow = listOperatorRetryJobs(data);
  const retryThemes = new Set(retryableNow.map((j) => j.themeId).filter(Boolean));
  const parkThemes = unresolvedManualReviewThemes(data);
  const deferThemes = new Set([...retryThemes, ...parkThemes]);
  const eligible = getEligibleThemes(pairs).filter((t) => !isThemeBlocked(data, t.id));

  const claimFormat = nextClaimFormat((data.jobs || []).length, args.dryRun);

  const takePick = (pick) => {
    pick.format = claimFormat;
    const job = pushJob(data, pick, now);
    created.push(job);
    claimedSlugs.add(pick.slug);
    if (pick.themeId) claimedThemes.add(pick.themeId);
    openSlots--;
  };

  // (0) Operator wishlist: highest-priority untaken item claims before backlog.
  while (openSlots > 0) {
    const wish = nextWishlistItem(data, claimedSlugs);
    if (!wish) break;
    const slug = `${slugify(wish.stem)}-${yearTag()}`.replace(/--+/g, "-");
    if (slugTaken(data, claimedSlugs, slug) || SEQUEL_SLUG_RE.test(slug)) {
      skipped.push({ stem: wish.stem, reason: "wishlist_slug_rejected" });
      if (!popWishlistItem(wish, args.dryRun)) break;
      continue;
    }
    takePick({
      themeId: null,
      category: wish.category || "Economics",
      slug,
      title: wish.title,
      coreQuestion: wish.coreQuestion || "",
      primarySources: Array.isArray(wish.primarySources)
        ? wish.primarySources
        : [],
      headlineStatHint: "",
      fromBacklog: false,
      generated: true,
      angle: "wishlist",
    });
    if (!popWishlistItem(wish, args.dryRun)) {
      skipped.push({ stem: wish.stem, reason: "wishlist_pop_failed" });
      break;
    }
  }

  const takeDiversityRow = (c) => {
    if (openSlots <= 0) return false;
    if (recoveryThemes.has(c.themeId)) {
      skipped.push({ themeId: c.themeId, reason: "theme_has_recoverable_failure" });
      return false;
    }
    if (deferThemes.has(c.themeId)) return false;
    if (claimedThemes.has(c.themeId) || isThemeBlocked(data, c.themeId)) {
      skipped.push({ themeId: c.themeId, reason: "theme_blocked_or_active" });
      return false;
    }
    const slug = (c.slugHint || `${slugify(c.title)}-${yearTag()}`).replace(/--+/g, "-");
    const base = slugify(c.title.replace(/^\[[^\]]+\]\s*/, ""));
    if (SEQUEL_SLUG_RE.test(slug)) {
      skipped.push({ themeId: c.themeId, slug, reason: "rejected_sequel_slug" });
      return false;
    }
    if (slugTaken(data, claimedSlugs, slug) || stemTakenLocal(data, claimedSlugs, base)) {
      skipped.push({ themeId: c.themeId, stem: base, reason: "stem_taken_or_flagged" });
      return false;
    }
    takePick({
      themeId: c.themeId,
      category: c.category || "Global Systems",
      slug,
      title: c.title,
      coreQuestion: c.coreQuestion,
      primarySources: c.primarySources || [],
      headlineStatHint: c.headlineStatHint || "",
      fromBacklog: true,
      generated: true,
      visualLane: c.visualLane,
      angle: "diversity",
    });
    return true;
  };

  // (1) Unused named candidates — novel themes (lifetime 0) first.
  const diversity = getDiversityBacklog(pairs, claimedSlugs);
  for (const c of diversity) {
    if (openSlots <= 0) break;
    takeDiversityRow(c);
  }

  // (1b) Brand-new theme research slug only if that theme has ZERO lifetime posts.
  for (const theme of eligible) {
    if (openSlots <= 0) break;
    if (recoveryThemes.has(theme.id) || claimedThemes.has(theme.id) || isThemeBlocked(data, theme.id)) {
      continue;
    }
    if (deferThemes.has(theme.id)) continue;
    if (lifetimePostCount(pairs, theme.id) > 0) {
      skipped.push({ themeId: theme.id, reason: "theme_already_has_posts_no_sequel" });
      continue;
    }
    const researchBase = `${slugify(theme.id)}-research`;
    if (stemTakenLocal(data, claimedSlugs, researchBase)) {
      skipped.push({ themeId: theme.id, stem: researchBase, reason: "research_stem_taken" });
      continue;
    }
    const slug = `${researchBase}-${yearTag()}`;
    if (slugTaken(data, claimedSlugs, slug) || SEQUEL_SLUG_RE.test(slug)) {
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

  // (2) Operator retry of parked infra (same slug, cap 2) — not a new sequel.
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

  // (3) Never-idle: more unused diversity candidates (refresh after claims).
  if (openSlots > 0) {
    const more = getDiversityBacklog(pairs, claimedSlugs);
    for (const c of more) {
      if (openSlots <= 0) break;
      takeDiversityRow(c);
    }
  }

  const result = {
    claimed: created.length,
    retried: retried.length,
    runId: data.runId,
    format: claimFormat,
    jobs: created.map((j) => ({
      id: j.id,
      slug: j.slug,
      themeId: j.themeId,
      format: j.format,
      generated: Boolean(j.activity?.includes("novel")),
    })),
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
