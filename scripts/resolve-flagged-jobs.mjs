#!/usr/bin/env node
/**
 * Resolve flagged/failed jobs that no longer need recovery:
 * - stem already shipped on main → resolution: shipped_elsewhere
 * - superseded/deferred park rows → resolution: superseded
 * - empty-branch infra fails with recoveryExhausted → resolution: abandoned_infra
 * Rebuilds blockedStems to only stems not yet represented on main.
 *
 * Usage: node scripts/resolve-flagged-jobs.mjs [--dry-run]
 */
import fs from "node:fs";
import path from "node:path";
import {
  REPO_ROOT,
  readJobs,
  writeJobs,
  topicStem,
  topicFamilyStem,
  isInfraFailure,
  rebuildFlagBlocks,
} from "./lib/agent-jobs.mjs";

const dryRun = process.argv.includes("--dry-run");
const selfTest = process.argv.includes("--self-test");
const postsSrc = fs.readFileSync(path.join(REPO_ROOT, "src/data/posts.ts"), "utf8");
const shippedSlugs = [...postsSrc.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);

function stemCoveredByShipped(slug) {
  const stem = topicStem(slug);
  if (!stem) return null;
  if (shippedSlugs.includes(slug)) return slug;
  const bare = stem.replace(/-research$/, "");
  const family = topicFamilyStem(slug);
  for (const s of shippedSlugs) {
    const t = topicStem(s);
    const tb = t.replace(/-research$/, "");
    if (t === stem || tb === bare) return s;
    // msXXXX remints of a shipped family
    if (s === bare || s.startsWith(`${bare}-`) || stem.startsWith(`${tb}-`)) return s;
    // geography vs concentration (etc.) remints of the same dataset story
    if (family && family.length >= 16 && topicFamilyStem(s) === family) return s;
    if (bare.length > 12 && (s.includes(bare.slice(0, 24)) || bare.includes(tb.slice(0, 24)))) {
      // cautious: only if shared long prefix
      const pref = bare.slice(0, Math.min(28, bare.length));
      if (s.startsWith(pref) || t.startsWith(pref)) return s;
    }
  }
  return null;
}

function runSelfTest() {
  let failed = 0;
  const aircraft = stemCoveredByShipped(
    "commercial-aircraft-final-assembly-geography-2026",
  );
  const aircraftOk = aircraft === "commercial-aircraft-final-assembly-2025";
  console.log(
    aircraftOk ? "PASS" : "FAIL",
    "aircraft geography remint →",
    aircraft,
  );
  if (!aircraftOk) failed++;

  const famOk =
    topicFamilyStem("copper-mine-vs-refinery-geography-2026") ===
    topicFamilyStem("copper-mine-vs-refinery-concentration-2024");
  console.log(famOk ? "PASS" : "FAIL", "copper geography/concentration family stem");
  if (!famOk) failed++;

  // adaptation research is a new theme research slug — must NOT auto-cover via disasters post
  const adaptation = stemCoveredByShipped("adaptation-economics-research-2026");
  const adaptOk = !adaptation;
  console.log(
    adaptOk ? "PASS" : "FAIL",
    "adaptation-economics-research-2026 not auto-covered",
    adaptation || "(none)",
  );
  if (!adaptOk) failed++;
  if (failed) {
    console.error(`self-test: ${failed} failure(s)`);
    process.exit(1);
  }
  console.log("self-test: ok");
}

function main() {
  const data = readJobs();
  const now = new Date().toISOString();
  const summary = {
    shippedElsewhere: [],
    superseded: [],
    abandonedInfra: [],
    leftOpen: [],
  };

  for (const job of data.jobs || []) {
    if (job.status !== "failed" && !job.flagged) continue;
    if (job.resolution && job.flagged === false) continue;

    const err = String(job.lastError || job.flagReason || "");
    const covered = stemCoveredByShipped(job.slug);

    let resolution = null;
    if (covered) {
      resolution = "shipped_elsewhere";
      summary.shippedElsewhere.push({ slug: job.slug, via: covered });
    } else if (/superseded_by_recovery_queue|deferred_for_recovery_queue/.test(err)) {
      resolution = "superseded";
      summary.superseded.push(job.slug);
    } else if (isInfraFailure(err) && (job.recoveryExhausted || (job.recoveryAttempts || 0) >= 2)) {
      // Keep open if we might still merge WIP — caller can exclude by not marking
      // Empty exhausted infra without a live recovery path
      resolution = "abandoned_infra";
      summary.abandonedInfra.push(job.slug);
    } else {
      summary.leftOpen.push({
        slug: job.slug,
        err,
        exhausted: !!job.recoveryExhausted,
        attempts: job.recoveryAttempts || 0,
      });
      continue;
    }

    if (dryRun) continue;

    Object.assign(job, {
      flagged: false,
      resolution,
      resolvedAt: now,
      recoveryExhausted: true,
      activity: `Resolved: ${resolution}${covered ? ` (shipped as ${covered})` : ""}`,
      updatedAt: now,
    });
  }

  if (!dryRun) {
    const flags = data.flags || { blockedStems: [], blockedThemes: [], failures: [] };
    const resolvedById = new Map(
      (data.jobs || []).filter((j) => j.resolution).map((j) => [j.id, j.resolution]),
    );
    // Mark historical failure rows so rebuildFlagBlocks cannot resurrect stem blocks
    for (const row of flags.failures || []) {
      const res = row.jobId ? resolvedById.get(row.jobId) : null;
      if (res) {
        row.resolved = true;
        row.resolution = res;
      } else if (stemCoveredByShipped(row.slug || row.stem || "")) {
        row.resolved = true;
        row.resolution = "shipped_elsewhere";
      }
    }
    flags.blockedThemes = [];
    flags.blockedStems = [];
    data.flags = flags;
    rebuildFlagBlocks(data);
    // After rebuild, force-drop any stem already represented on main
    data.flags.blockedStems = (data.flags.blockedStems || []).filter((stem) => {
      const bare = stem.replace(/-research$/, "");
      const family = topicFamilyStem(stem);
      return !shippedSlugs.some((s) => {
        const t = topicStem(s).replace(/-research$/, "");
        if (t === bare || s.startsWith(bare + "-") || bare.startsWith(t)) return true;
        return family && family.length >= 16 && topicFamilyStem(s) === family;
      });
    });
    writeJobs(data);
  }

  console.log(JSON.stringify({ dryRun, ...summary, remainingBlockedStems: data.flags?.blockedStems }, null, 2));
}

if (selfTest) {
  runSelfTest();
} else {
  main();
}
