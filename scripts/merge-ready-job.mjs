#!/usr/bin/env node
/**
 * CLI: merge one ready worker branch into main with hardened stash/merge.
 *
 *   node scripts/merge-ready-job.mjs \
 *     --slug us-billion-dollar-weather-disasters-2026 \
 *     --branch post/us-billion-dollar-weather-disasters-2026-w4 \
 *     --worktree "E:/.../worker-4" \
 *     --worker-id 4
 *
 * Exit 0 on success, 2 on merge failure, 1 on usage/lock errors.
 */
import {
  mergeReadyJob,
  recoverOrphanedMergeStash,
  abortLeftoverMerge,
  runMergeSelfTest,
  filesOnBranchForPost,
  blockingPathsForPost,
  pathsTouchedByMerge,
} from "./lib/orch-merge.mjs";

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

const args = parseArgs(process.argv.slice(2));

if (args["self-test"]) {
  const r = runMergeSelfTest();
  console.log(JSON.stringify({ selfTest: true, ...r }, null, 2));
  process.exit(r.ok ? 0 : 1);
}

if (args.recover) {
  const r = recoverOrphanedMergeStash();
  console.log(JSON.stringify({ recover: true, ...r }, null, 2));
  process.exit(0);
}

if (args["abort-merge"]) {
  const r = abortLeftoverMerge();
  console.log(JSON.stringify({ abort: true, ...r }, null, 2));
  process.exit(0);
}

if (!args.slug) {
  console.error(
    "Usage: merge-ready-job.mjs --slug <slug> [--branch ...] [--worktree ...] [--worker-id N] [--dry-run]",
  );
  process.exit(1);
}

if (args["dry-run"]) {
  const branch = args.branch || `post/${args.slug}`;
  const allow = filesOnBranchForPost(".", branch, args.slug);
  const selective = blockingPathsForPost(".", branch, args.slug);
  const fullTouch = pathsTouchedByMerge(".", branch);
  console.log(
    JSON.stringify(
      {
        dryRun: true,
        slug: args.slug,
        branch,
        allowlistCount: allow.length,
        allowlist: allow,
        selectiveBlockers: selective,
        fullMergeWouldTouch: fullTouch.length,
        savings: Math.max(0, fullTouch.length - allow.length),
      },
      null,
      2,
    ),
  );
  process.exit(0);
}

const result = mergeReadyJob({
  slug: args.slug,
  branch: args.branch || null,
  worktreePath: args.worktree || null,
  workerId: args["worker-id"] || null,
});

console.log(JSON.stringify(result, null, 2));
process.exit(result.ok ? 0 : result.error === "merge_lock" ? 1 : 2);
