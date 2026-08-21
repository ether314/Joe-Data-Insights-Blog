#!/usr/bin/env node
/**
 * QA: claim-next-topics still mints unique follow-ups when *-research stems
 * are taken, and --dry-run does not mutate the live job queue.
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
const proc = spawnSync(
  process.execPath,
  [path.join(repo, "scripts", "claim-next-topics.mjs"), "--dry-run", "--force-slots", "2"],
  { cwd: repo, encoding: "utf8" },
);
assert(proc.status === 0, `dry-run claim exit 0 (got ${proc.status})`);
const after = fs.readFileSync(jobsFile, "utf8");
assert(before === after, "dry-run does not rewrite artifacts/agent-jobs.json");

let payload = {};
try {
  payload = JSON.parse(proc.stdout || "{}");
} catch {
  payload = {};
}
assert(
  (payload.claimed || 0) + (payload.retried || 0) >= 1,
  `force-slots dry-run fills work (claimed=${payload.claimed} retried=${payload.retried})`,
);
const slugs = (payload.jobs || []).map((j) => j.slug);
assert(
  slugs.every((s) => typeof s === "string" && s.length > 0),
  "minted slugs are non-empty",
);
assert(new Set(slugs).size === slugs.length, "minted slugs are unique");

if (failed) {
  console.error(`\n${failed} never-idle claim QA failure(s)`);
  process.exit(1);
}
console.log("\nAll never-idle claim QA checks passed.");
