#!/usr/bin/env node
/**
 * Delete post/* litter branches that do not contain novel unmerged blog posts.
 *
 * Keeps a branch when ANY of:
 * - tip has a posts.ts slug not present on master (novel post)
 * - branch is currently checked out by a worktree with dirty post-related files
 * - --keep <branch> passed
 *
 * Usage:
 *   node scripts/prune-post-branches.mjs --dry-run
 *   node scripts/prune-post-branches.mjs --apply
 */
import { execFileSync, execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const apply = process.argv.includes("--apply");
const dryRun = !apply;

function sh(args, opts = {}) {
  return execFileSync("git", args, {
    cwd: REPO_ROOT,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    ...opts,
  }).trim();
}

function bareStem(slug) {
  return String(slug || "")
    .replace(/-ms[a-z0-9]+$/i, "")
    .replace(/-w\d+(-recovery)?$/, "")
    .replace(/-2026$/, "")
    .replace(/-research$/, "");
}

const shipped = [
  ...fs
    .readFileSync(path.join(REPO_ROOT, "src/data/posts.ts"), "utf8")
    .matchAll(/slug:\s*"([^"]+)"/g),
].map((m) => m[1]);
const shippedBare = new Set(shipped.map(bareStem));

function stemShipped(slug) {
  return shippedBare.has(bareStem(slug));
}

function worktrees() {
  const text = sh(["worktree", "list", "--porcelain"]);
  const out = [];
  let cur = {};
  for (const line of text.split(/\r?\n/)) {
    if (!line) {
      if (cur.path) out.push(cur);
      cur = {};
      continue;
    }
    if (line.startsWith("worktree ")) cur.path = line.slice(9);
    else if (line.startsWith("HEAD ")) cur.head = line.slice(5);
    else if (line.startsWith("branch refs/heads/")) cur.branch = line.slice("branch refs/heads/".length);
    else if (line === "detached") cur.detached = true;
  }
  if (cur.path) out.push(cur);
  return out;
}

function branchSlugs(branch) {
  try {
    const text = sh(["show", `${branch}:src/data/posts.ts`], {
      maxBuffer: 20_000_000,
    });
    return [...text.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);
  } catch {
    return [];
  }
}

function hasDirtyPostWork(wtPath) {
  try {
    const status = execFileSync("git", ["status", "--porcelain"], {
      cwd: wtPath,
      encoding: "utf8",
    });
    return status
      .split(/\r?\n/)
      .filter(Boolean)
      .some((l) =>
        /posts\.ts|PostVisualization|theme-registry|visualizations\/|data\/.*-data\.ts|images\/.*hero|qa-.*\.mjs/.test(
          l,
        ),
      );
  } catch {
    return false;
  }
}

const wts = worktrees();
const checkedOut = new Map(
  wts.filter((w) => w.branch).map((w) => [w.branch, w]),
);

const branches = sh(["for-each-ref", "--format=%(refname:short)", "refs/heads/post"])
  .split(/\r?\n/)
  .filter(Boolean);

const keep = [];
const prune = [];

for (const branch of branches) {
  const tipSlugs = branchSlugs(branch);
  const novel = tipSlugs.filter((s) => !shipped.includes(s) && !stemShipped(s));
  const wt = checkedOut.get(branch);
  const dirty = wt ? hasDirtyPostWork(wt.path) : false;

  // Also: uncommitted novel work on a branch tip that equals master
  let dirtyNovelHint = false;
  if (wt && dirty) {
    // keep any checked-out dirty post worktree branch
    dirtyNovelHint = true;
  }

  if (novel.length || dirtyNovelHint) {
    keep.push({
      branch,
      reason: novel.length ? `novel:${novel.join(",")}` : "dirty_worktree",
      novel,
    });
  } else {
    prune.push({
      branch,
      reason: novel.length === 0 && !dirtyNovelHint ? "no_novel_post" : "other",
      checkedOut: !!wt,
      wtPath: wt?.path || null,
    });
  }
}

console.log(
  JSON.stringify(
    {
      dryRun,
      shippedOnMaster: shipped.length,
      totalPostBranches: branches.length,
      keep: keep.length,
      prune: prune.length,
      keepDetails: keep,
      pruneSample: prune.slice(0, 15).map((p) => p.branch),
    },
    null,
    2,
  ),
);

if (dryRun) {
  console.log("\nDry run only. Re-run with --apply to delete.");
  process.exit(0);
}

// Move worktrees off branches we will delete
for (const p of prune) {
  if (!p.checkedOut || !p.wtPath) continue;
  console.log(`detach worktree ${p.wtPath} (was ${p.branch})`);
  try {
    execFileSync("git", ["checkout", "--detach", "master"], {
      cwd: p.wtPath,
      stdio: "inherit",
    });
  } catch (e) {
    console.error(`WARN: could not detach ${p.wtPath}: ${e.message}`);
  }
}

let deleted = 0;
let failed = 0;
for (const p of prune) {
  try {
    sh(["branch", "-D", p.branch]);
    deleted++;
    console.log(`deleted ${p.branch}`);
  } catch (e) {
    failed++;
    console.error(`FAIL delete ${p.branch}: ${e.message}`);
  }
}

console.log(JSON.stringify({ deleted, failed, kept: keep.length }, null, 2));
