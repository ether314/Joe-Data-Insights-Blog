#!/usr/bin/env node
/**
 * Merge all orphan post/* branches into main via path-selective orch-merge.
 *
 *   node scripts/merge-orphan-branches.mjs [--dry-run] [--include-on-main]
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import {
  mergeReadyJob,
  filesOnBranchForPost,
  recoverOrphanedMergeStash,
  releaseMergeLock,
} from "./lib/orch-merge.mjs";
import { readJobs, writeJobs, REPO_ROOT } from "./lib/agent-jobs.mjs";

const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run");
const includeOnMain = args.has("--include-on-main");

function git(cmd) {
  return execSync(cmd, {
    cwd: REPO_ROOT,
    encoding: "utf8",
    windowsHide: true,
  }).trim();
}

function listPostBranches() {
  const out = git('git branch --list "post/*"');
  return out
    .split(/\r?\n/)
    .map((s) => s.replace(/^[*+ ]+/, "").trim())
    .filter(Boolean);
}

function slugFromBranch(branch) {
  return branch.replace(/^post\//, "").replace(/-w\d+$/, "");
}

function aheadCount(branch) {
  try {
    return Number(git(`git rev-list --count HEAD..${branch}`));
  } catch {
    return -1;
  }
}

function slugOnMain(slug) {
  const posts = fs.readFileSync(path.join(REPO_ROOT, "src/data/posts.ts"), "utf8");
  return (
    posts.includes(`slug: '${slug}'`) ||
    posts.includes(`slug: "${slug}"`)
  );
}

function pickBestBranch(branchesForSlug) {
  // Prefer worker -wN branches with more ahead commits and more allowlist files
  const scored = branchesForSlug.map((branch) => {
    const slug = slugFromBranch(branch);
    const ahead = aheadCount(branch);
    const allow = filesOnBranchForPost(REPO_ROOT, branch, slug);
    const hasData = allow.some(
      (f) =>
        f.startsWith("src/data/") &&
        f !== "src/data/posts.ts" &&
        f !== "src/data/theme-registry.ts",
    );
    const hasViz = allow.some((f) => f.includes("/visualizations/"));
    const isWorker = /-w\d+$/.test(branch);
    const score =
      (hasData ? 1000 : 0) +
      (hasViz ? 500 : 0) +
      ahead * 10 +
      allow.length +
      (isWorker ? 5 : 0);
    return { branch, slug, ahead, allow, hasData, hasViz, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored[0];
}

function markJobShipped(slug, branch) {
  const data = readJobs();
  let updated = 0;
  for (const job of data.jobs || []) {
    if (job.slug !== slug) continue;
    if (!["ready", "merging", "claimed", "assigned", "in_progress"].includes(job.status)) {
      continue;
    }
    // Prefer matching branch; otherwise any active job for slug
    if (job.branch && job.branch !== branch && job.branch !== `post/${slug}`) {
      continue;
    }
    job.status = "shipped";
    job.activity = `Shipped via merge-orphan-branches (${branch})`;
    job.updatedAt = new Date().toISOString();
    updated++;
  }
  // Also mark ready jobs for this slug even if branch differs (dedupe)
  for (const job of data.jobs || []) {
    if (job.slug === slug && job.status === "ready") {
      job.status = "shipped";
      job.activity = `Shipped via merge-orphan-branches (${branch})`;
      job.updatedAt = new Date().toISOString();
      updated++;
    }
  }
  if (updated) writeJobs(data);
  return updated;
}

function markJobFailed(slug, branch, err) {
  const data = readJobs();
  let updated = 0;
  for (const job of data.jobs || []) {
    if (job.slug !== slug || job.status !== "ready") continue;
    job.status = "failed";
    job.error = String(err || "merge_failed").slice(0, 120);
    job.activity = `Failed orphan merge: ${err}`.slice(0, 240);
    job.updatedAt = new Date().toISOString();
    updated++;
  }
  if (updated) writeJobs(data);
  return updated;
}

const branches = listPostBranches();
const bySlug = new Map();
for (const b of branches) {
  const slug = slugFromBranch(b);
  if (!bySlug.has(slug)) bySlug.set(slug, []);
  bySlug.get(slug).push(b);
}

const plan = [];
for (const [slug, list] of [...bySlug.entries()].sort((a, b) =>
  a[0].localeCompare(b[0]),
)) {
  const best = pickBestBranch(list);
  const onMain = slugOnMain(slug);
  plan.push({
    slug,
    branch: best.branch,
    ahead: best.ahead,
    allowCount: best.allow.length,
    hasData: best.hasData,
    hasViz: best.hasViz,
    onMain,
    skip:
      (!includeOnMain && onMain) ||
      best.ahead <= 0 ||
      best.allow.length === 0 ||
      (!best.hasData && !best.hasViz && !best.allow.includes("src/data/posts.ts")),
    skipReason: onMain && !includeOnMain
      ? "already_on_main"
      : best.ahead <= 0
        ? "not_ahead"
        : best.allow.length === 0
          ? "empty_allowlist"
          : !best.hasData && !best.hasViz
            ? "no_post_payload"
            : null,
    candidates: list,
  });
}

console.log(
  JSON.stringify(
    {
      dryRun,
      branchCount: branches.length,
      uniqueSlugs: plan.length,
      toMerge: plan.filter((p) => !p.skip).map((p) => ({
        slug: p.slug,
        branch: p.branch,
        ahead: p.ahead,
        allowCount: p.allowCount,
      })),
      skipped: plan.filter((p) => p.skip).map((p) => ({
        slug: p.slug,
        branch: p.branch,
        reason: p.skipReason,
        onMain: p.onMain,
        ahead: p.ahead,
      })),
    },
    null,
    2,
  ),
);

if (dryRun) process.exit(0);

releaseMergeLock();
recoverOrphanedMergeStash();

const results = [];
for (const item of plan.filter((p) => !p.skip)) {
  console.error(`\n=== merging ${item.slug} from ${item.branch} ===`);
  const result = mergeReadyJob({
    slug: item.slug,
    branch: item.branch,
    worktreePath: null,
    workerId: "orphan",
  });
  console.error(JSON.stringify({ ok: result.ok, error: result.error, log: result.log }, null, 2));
  if (result.ok) {
    markJobShipped(item.slug, item.branch);
  } else if (result.error && result.error !== "merge_lock") {
    markJobFailed(item.slug, item.branch, result.error);
  }
  results.push({
    slug: item.slug,
    branch: item.branch,
    ok: result.ok,
    error: result.error || null,
    detail: result.detail ? String(result.detail).slice(0, 300) : null,
  });
}

const okN = results.filter((r) => r.ok).length;
console.log(JSON.stringify({ merged: okN, total: results.length, results }, null, 2));
process.exit(okN === results.length ? 0 : 2);
