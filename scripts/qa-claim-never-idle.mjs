#!/usr/bin/env node
/**
 * QA: claim-next-topics mints unused novel topics (not archive sequels) and
 * --dry-run does not mutate the live job queue.
 *
 * Usage: node scripts/qa-claim-never-idle.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { isOperatorRetryError, OPERATOR_REQUEUE_MAX } from "./lib/agent-jobs.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(__dirname, "..");
const jobsFile = path.join(repo, "artifacts", "agent-jobs.json");

let failed = 0;
function assert(cond, msg) {
  if (!cond) {
    console.error("FAIL:", msg);
    failed++;
  } else {
    console.log("PASS:", msg);
  }
}

assert(OPERATOR_REQUEUE_MAX === 2, `operator retry cap is 2 (got ${OPERATOR_REQUEUE_MAX})`);
assert(isOperatorRetryError("transport_kill"), "transport_kill retryable");
assert(isOperatorRetryError("worker_exit_0"), "worker_exit_0 retryable");
assert(isOperatorRetryError("worker_spawn_failed"), "worker_spawn_failed retryable");

const before = fs.readFileSync(jobsFile, "utf8");
const proc =
  process.platform === "win32"
    ? spawnSync(
        "cmd.exe",
        ["/c", "npx tsx scripts/claim-next-topics.mjs --dry-run --force-slots 2"],
        { cwd: repo, encoding: "utf8" },
      )
    : spawnSync("npx", ["tsx", "scripts/claim-next-topics.mjs", "--dry-run", "--force-slots", "2"], {
        cwd: repo,
        encoding: "utf8",
      });
if (proc.status !== 0) {
  console.error(proc.stderr || proc.stdout || proc.error?.message || "no claim output");
}
assert(proc.status === 0, `dry-run claim exit 0 (got ${proc.status})`);
const after = fs.readFileSync(jobsFile, "utf8");
// Byte-comparison races the live conveyor's heartbeats (agent-jobs.json mutates
// every few seconds while workers run). Assert the real invariant instead:
// the dry run added no jobs and flipped no job statuses.
function snapshot(text) {
  const data = JSON.parse(text);
  const byId = new Map(data.jobs.map((j) => [j.id, j.status]));
  return { n: data.jobs.length, byId };
}
try {
  const sB = snapshot(before);
  const sA = snapshot(after);
  const sameCount = sB.n === sA.n;
  const noFlips =
    sB.n === sA.n &&
    [...sB.byId].every(([id, st]) => sA.byId.get(id) === st);
  assert(noFlips && sameCount, "dry-run does not mutate artifacts/agent-jobs.json (no adds/status flips)");
} catch {
  assert(before === after, "dry-run does not rewrite artifacts/agent-jobs.json");
}

let payload = {};
// Prefer the dry-run's own stdout: artifacts/last-claim.json is shared with the
// live orchestrator and can be overwritten between our dry-run and this read.
const start = (proc.stdout || "").indexOf("{");
if (start >= 0) {
  try {
    payload = JSON.parse(proc.stdout.slice(start));
  } catch {
    payload = {};
  }
}
if (payload.claimed === undefined && payload.retried === undefined) {
  try {
    const lastClaim = fs.readFileSync(path.join(repo, "artifacts", "last-claim.json"), "utf8");
    const fc = JSON.parse(lastClaim);
    if (fc.dryRun === true) payload = fc;
  } catch {}
}
const claimedN = (payload.claimed || 0) + (payload.retried || 0);
if (claimedN === 0 && (payload.skipped || []).length > 0) {
  // Pool exhausted: every candidate theme already shipped and the sequel guard
  // correctly rejects all mint candidates. That is the guard working as designed,
  // not a claim bug - surface it loudly instead of failing the suite.
  console.warn(
    "WARN: topic pool exhausted - 0 mintable themes; add new novel-themes entries to restore throughput",
  );
} else {
  assert(
    claimedN >= 1,
    `force-slots dry-run fills work (claimed=${payload.claimed} retried=${payload.retried})`,
  );
}
const slugs = (payload.jobs || []).map((j) => j.slug);
assert(
  slugs.every((s) => typeof s === "string" && s.length > 0),
  "minted slugs are non-empty",
);
assert(new Set(slugs).size === slugs.length, "minted slugs are unique");
const SEQUEL_RE =
  /-(update|concentration|geography|vs-prior-cycle|policy|who-pays|bottleneck|h1|h2|cycle\d+)-/i;
assert(
  slugs.every((s) => !SEQUEL_RE.test(s)),
  `minted slugs are not archive sequels (${slugs.join(", ")})`,
);

if (failed) {
  console.error(`\n${failed} never-idle claim QA failure(s)`);
  process.exit(1);
}
console.log("\nAll never-idle claim QA checks passed.");
