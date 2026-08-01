#!/usr/bin/env node
/**
 * Claim up to N topics from eligible themes into artifacts/agent-jobs.json.
 * Usage: node scripts/claim-next-topics.mjs [--max 4] [--run-id local-...]
 *
 * Failed topic stems/themes are flagged and never re-minted as msXXXX clones.
 */
import fs from "node:fs";
import path from "node:path";
import {
  REPO_ROOT,
  readJobs,
  writeJobs,
  activeJobs,
  freeWorkers,
  unassignedClaimedJobs,
  slugify,
  PRODUCTION_WORKER_COUNT,
  seedFlagsFromHistory,
  isStemBlocked,
  isThemeBlocked,
  topicStem,
  listRecoverableFailures,
  isManualReviewJob,
} from "./lib/agent-jobs.mjs";
import {
  getEligibleThemes,
  getBacklogFromEligibleThemes,
} from "../src/data/theme-registry.ts";

function parseArgs(argv) {
  const out = { max: PRODUCTION_WORKER_COUNT, runId: null };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--max") out.max = Number(argv[++i]) || PRODUCTION_WORKER_COUNT;
    if (argv[i] === "--run-id") out.runId = argv[++i];
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

function stemTakenLocal(data, claimedSlugs, base) {
  if (!base) return true;
  if (isStemBlocked(data, base)) return true;
  if (claimedSlugs.has(base)) return true;
  for (const s of claimedSlugs) {
    if (s === base || s.startsWith(`${base}-`) || topicStem(s) === topicStem(base)) {
      return true;
    }
  }
  // In-flight / queued jobs reserve a stem. Unresolved failed + Manual Review
  // also reserve (fail-once park must not remint under a new job id).
  // Failed+resolved and shipped do not permanently starve producers.
  for (const j of data.jobs || []) {
    if (!j.slug) continue;
    if (j.status === "shipped") continue;
    if (j.status === "failed") {
      if (j.resolution) continue;
      // unresolved failed / manualReview → reserve
    }
    if (j.slug === base || j.slug.startsWith(`${base}-`) || topicStem(j.slug) === topicStem(base)) {
      return true;
    }
  }
  return false;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const data = readJobs();
  if (args.runId) data.runId = args.runId;

  // Backfill flags from historical failures so claim stops the loop immediately.
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

  // Themes already in-flight OR flagged blocked must not be re-claimed.
  // Themes with recoverable Failed-before-merge jobs belong to Worker 5 — do not
  // mint a fresh "*-research-YYYY" restart (seen: fiscal-plumbing after many infra fails).
  // Manual Review parks reserve STEM/slug only (not whole theme) so sibling topics can proceed.
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

  const free = freeWorkers(data).length;
  const waiting = unassignedClaimedJobs(data).length;
  const openSlots = Math.max(0, Math.min(args.max, free - waiting));
  if (openSlots === 0) {
    console.log(
      JSON.stringify(
        {
          claimed: 0,
          reason: free === 0 ? "no free workers" : "claimed jobs already waiting",
          free,
          waiting,
          active: activeJobs(data).length,
          blockedStems: data.flags?.blockedStems?.length || 0,
          blockedThemes: data.flags?.blockedThemes?.length || 0,
          recoveryThemes: [...recoveryThemes],
        },
        null,
        2,
      ),
    );
    writeJobs(data);
    return;
  }

  const backlog = getBacklogFromEligibleThemes(pairs);
  const eligible = getEligibleThemes(pairs).filter((t) => !isThemeBlocked(data, t.id));
  const picks = [];
  const skipped = [];

  for (const c of backlog) {
    if (picks.length >= openSlots) break;
    if (recoveryThemes.has(c.themeId)) {
      skipped.push({ themeId: c.themeId, reason: "theme_has_recoverable_failure" });
      continue;
    }
    if (claimedThemes.has(c.themeId) || isThemeBlocked(data, c.themeId)) {
      skipped.push({ themeId: c.themeId, reason: "theme_blocked_or_active" });
      continue;
    }
    const base = slugify(c.title.replace(/^\[[^\]]+\]\s*/, ""));
    if (stemTakenLocal(data, claimedSlugs, base)) {
      skipped.push({ themeId: c.themeId, stem: base, reason: "stem_taken_or_flagged" });
      continue;
    }
    const slug = `${base}-${yearTag()}`.replace(/--+/g, "-");
    if (claimedSlugs.has(slug) || stemTakenLocal(data, claimedSlugs, base)) {
      skipped.push({ themeId: c.themeId, stem: base, reason: "slug_taken" });
      continue;
    }
    picks.push({
      themeId: c.themeId,
      category: eligible.find((t) => t.id === c.themeId)?.category || "Global Systems",
      slug,
      title: c.title,
      coreQuestion: c.coreQuestion,
      primarySources: c.primarySources || [],
      headlineStatHint: c.headlineStatHint || "",
      fromBacklog: true,
    });
    claimedSlugs.add(slug);
    claimedThemes.add(c.themeId);
  }

  // Fill remaining slots with eligible themes that have empty candidates
  for (const theme of eligible) {
    if (picks.length >= openSlots) break;
    if (recoveryThemes.has(theme.id)) {
      skipped.push({ themeId: theme.id, reason: "theme_has_recoverable_failure" });
      continue;
    }
    if (claimedThemes.has(theme.id) || isThemeBlocked(data, theme.id)) continue;
    const researchBase = `${slugify(theme.id)}-research`;
    if (stemTakenLocal(data, claimedSlugs, researchBase)) {
      skipped.push({ themeId: theme.id, stem: researchBase, reason: "research_stem_flagged" });
      continue;
    }
    const slug = `${researchBase}-${yearTag()}`;
    if (claimedSlugs.has(slug) || stemTakenLocal(data, claimedSlugs, researchBase)) {
      skipped.push({ themeId: theme.id, stem: researchBase, reason: "research_slug_taken" });
      continue;
    }
    picks.push({
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
    claimedSlugs.add(slug);
    claimedThemes.add(theme.id);
  }

  const now = new Date().toISOString();
  const created = [];
  for (const pick of picks) {
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
      activity: "Claimed - awaiting worker",
      lastError: null,
      headlineStat: null,
      flagged: false,
      createdAt: now,
      updatedAt: now,
    };
    data.jobs.unshift(job);
    created.push(job);
  }

  writeJobs(data);
  console.log(
    JSON.stringify(
      {
        claimed: created.length,
        runId: data.runId,
        jobs: created.map((j) => ({ id: j.id, slug: j.slug, themeId: j.themeId })),
        skipped: skipped.slice(0, 20),
        blockedStems: data.flags?.blockedStems || [],
        blockedThemes: data.flags?.blockedThemes || [],
      },
      null,
      2,
    ),
  );
}

main();
