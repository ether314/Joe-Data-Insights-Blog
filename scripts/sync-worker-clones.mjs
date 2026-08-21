#!/usr/bin/env node
/**
 * After an orchestrator-blessed merge, refresh every worker clone from main
 * and rebase in-progress job branches so workers never overwrite each other.
 *
 *   node scripts/sync-worker-clones.mjs [--exclude N] [--merged-branch post/slug-wN]
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { REPO_ROOT } from "./lib/agent-jobs.mjs";
import {
  WORKER_SLOT_IDS,
  defaultWorkerRoot,
  gitSpawnEnv,
  isIndependentClone,
  mainBranchName,
  workerClonePath,
} from "./lib/worker-layout.mjs";

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("--")) continue;
    const key = a.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) out[key] = true;
    else {
      out[key] = next;
      i++;
    }
  }
  return out;
}

function git(cwd, args) {
  const res = spawnSync("git", args, {
    cwd,
    encoding: "utf8",
    maxBuffer: 16 * 1024 * 1024,
    windowsHide: true,
    env: gitSpawnEnv(),
  });
  return {
    code: res.status == null ? 1 : res.status,
    stdout: (res.stdout || "").trim(),
    stderr: (res.stderr || "").trim(),
    output: [(res.stdout || "").trim(), (res.stderr || "").trim()].filter(Boolean).join("\n"),
  };
}

function currentBranch(cwd) {
  const r = git(cwd, ["rev-parse", "--abbrev-ref", "HEAD"]);
  if (r.code !== 0) return null;
  const name = r.stdout.trim();
  if (!name || name === "HEAD") return null;
  return name;
}

function originRef(cwd, main) {
  for (const cand of [`origin/${main}`, `origin/master`, `origin/main`]) {
    if (git(cwd, ["rev-parse", "--verify", cand]).code === 0) return cand;
  }
  return `origin/${main}`;
}

function syncOne({ id, excludeId, mergedBranch, main }) {
  const dir = workerClonePath(id);
  const result = { id, path: dir, ok: true, action: "skip", detail: null };
  if (!fs.existsSync(dir)) {
    result.ok = true;
    result.action = "missing";
    return result;
  }
  if (!isIndependentClone(dir)) {
    // Linked worktree shares main .git — fetch is a no-op; reset parking branch.
    const parking = `worktree/worker-${id}`;
    git(dir, ["fetch", "origin"]).code;
    const on = currentBranch(dir);
    if (on && on !== parking && on !== main && mergedBranch && on === mergedBranch) {
      git(dir, ["checkout", "--detach", "HEAD"]);
      git(dir, ["branch", "-D", mergedBranch]);
      result.action = "detached-shipped-worktree";
      return result;
    }
    result.action = "shared-worktree";
    result.detail = "skip rebase (shared git dir)";
    return result;
  }

  const fetch = git(dir, ["fetch", "origin"]);
  if (fetch.code !== 0) {
    result.ok = false;
    result.action = "fetch_failed";
    result.detail = fetch.output;
    return result;
  }
  const tip = originRef(dir, main);
  const dirty = git(dir, ["status", "--porcelain"]).stdout.trim();
  const on = currentBranch(dir);
  const parking = `worktree/worker-${id}`;

  if (dirty) {
    result.action = "fetch-only-dirty";
    result.detail = "in-progress clone has local changes; rebase deferred";
    return result;
  }

  if (mergedBranch && on === mergedBranch) {
    git(dir, ["checkout", "-B", parking, tip]);
    git(dir, ["branch", "-D", mergedBranch]);
    result.action = "reset-shipped";
    return result;
  }

  if (on && (on.startsWith("post/") || on.startsWith("job/"))) {
    const rebase = git(dir, ["rebase", tip]);
    if (rebase.code !== 0) {
      git(dir, ["rebase", "--abort"]);
      result.ok = false;
      result.action = "rebase_conflict";
      result.detail = rebase.output.slice(0, 800);
      return result;
    }
    result.action = `rebased ${on}`;
    return result;
  }

  const co = git(dir, ["checkout", "-B", parking, tip]);
  if (co.code !== 0) {
    result.ok = false;
    result.action = "reset_failed";
    result.detail = co.output;
    return result;
  }
  result.action = Number(id) === Number(excludeId) ? "reset-excluded" : "reset-parking";
  return result;
}

const args = parseArgs(process.argv.slice(2));
const excludeId = args.exclude && args.exclude !== true ? String(args.exclude) : null;
const mergedBranch =
  args["merged-branch"] && args["merged-branch"] !== true
    ? String(args["merged-branch"])
    : null;
const main = mainBranchName(REPO_ROOT);
const workers = [];

for (const id of WORKER_SLOT_IDS) {
  workers.push(
    syncOne({
      id,
      excludeId,
      mergedBranch,
      main,
    }),
  );
}

const ok = workers.every((w) => w.ok);
console.log(
  JSON.stringify(
    {
      ok,
      workerRoot: defaultWorkerRoot(),
      main,
      excludeId,
      mergedBranch,
      workers,
    },
    null,
    2,
  ),
);
process.exit(ok ? 0 : 2);
