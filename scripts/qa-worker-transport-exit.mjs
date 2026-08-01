#!/usr/bin/env node
/**
 * QA: Cursor "Connection failed repeatedly" (exit 1) must soft-requeue as
 * transport_kill, not park as open worker_exit_1. Also verifies remint stems
 * resolve against shipped cousins.
 *
 * Usage: node scripts/qa-worker-transport-exit.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import {
  maybeSoftRequeueTransportKill,
  isSoftRequeueError,
  isInfraFailure,
  topicFamilyStem,
  listOpenIssues,
  TRANSPORT_REQUEUE_MAX,
} from "./lib/agent-jobs.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let failed = 0;
function assert(cond, msg) {
  if (!cond) {
    console.error("FAIL:", msg);
    failed++;
  } else {
    console.log("PASS:", msg);
  }
}

assert(isSoftRequeueError("transport_kill"), "transport_kill is classified infra/soft");
assert(isSoftRequeueError("silence_kill"), "silence_kill is classified infra/soft");
assert(isSoftRequeueError("worker_spawn_failed"), "worker_spawn_failed is classified infra/soft");
assert(
  !isSoftRequeueError("worker_exit_1"),
  "raw worker_exit_1 is NOT soft-requeueable (must remap first)",
);
assert(isInfraFailure("worker_exit_1"), "worker_exit_1 counts as infra");
assert(isInfraFailure("worker_spawn_failed"), "worker_spawn_failed counts as infra");
assert(TRANSPORT_REQUEUE_MAX === 0, "default auto-rerun budget is 0 (manual review)");

const job = {
  id: "job-qa-transport",
  slug: "adaptation-economics-research-2026",
  status: "failed",
  recovery: false,
  transportRequeues: 0,
};
const requeued = maybeSoftRequeueTransportKill({ ...job }, "transport_kill");
assert(requeued === null, "transport_kill refuses auto-rerun → Manual Review");

const recoveryBlocked = maybeSoftRequeueTransportKill(
  { ...job, recovery: true },
  "transport_kill",
);
assert(recoveryBlocked === null, "recovery jobs do not soft-requeue via producer path");

assert(
  topicFamilyStem("copper-mine-vs-refinery-geography-2026") ===
    topicFamilyStem("copper-mine-vs-refinery-concentration-2024"),
  "copper geography/concentration share family stem",
);

const pattern =
  /RetriableError:\s*Connection failed|Connection failed repeatedly/i;
const sampleLog = `
[00:51:43] WARN: transport blip cliAttempt=1 (raw=10) elapsed=0s
Retry attempt 10...
RetriableError: Connection failed repeatedly
`;
assert(pattern.test(sampleLog), "log pattern matches Cursor RetriableError");
assert(!pattern.test("WorkerReady: shipped ok\nexit 0\n"), "pattern ignores clean exit");

const workerPs1 = fs.readFileSync(path.join(__dirname, "run-blog-worker.ps1"), "utf8");
assert(
  workerPs1.includes("remapping exit") &&
    workerPs1.includes("Connection failed repeatedly"),
  "run-blog-worker.ps1 remaps Cursor connection deaths to transport_kill",
);

const resolve = spawnSync(
  process.execPath,
  [path.join(__dirname, "resolve-flagged-jobs.mjs"), "--self-test"],
  { encoding: "utf8" },
);
assert(resolve.status === 0, `resolve-flagged --self-test exit 0 (got ${resolve.status})`);
if (resolve.stdout) process.stdout.write(resolve.stdout);
if (resolve.stderr) process.stderr.write(resolve.stderr);

const open = listOpenIssues({
  jobs: [
    {
      id: "a",
      slug: "adaptation-economics-research-2026",
      status: "failed",
      lastError: "worker_exit_1",
      resolution: "soft_requeued",
    },
    {
      id: "b",
      slug: "still-open",
      status: "failed",
      lastError: "worker_exit_1",
    },
  ],
  flags: { failures: [], blockedStems: [], blockedThemes: [] },
});
assert(open.length === 1 && open[0].slug === "still-open", "listOpenIssues skips resolved jobs");

if (failed) {
  console.error(`\n${failed} QA failure(s)`);
  process.exit(1);
}
console.log("\nAll worker transport-exit QA checks passed.");
