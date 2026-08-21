#!/usr/bin/env node
/**
 * E2E QA: prove parallel workers get isolated Node static-server ports, and that
 * the failure modes from 2026-08-01 (worker_exit_-1 / exit_0 / process_gone / stale)
 * remap + soft-requeue instead of parking as open dashboard issues.
 *
 * Usage: node scripts/qa-worker-isolation-requeue.mjs [--requeue]
 *
 * --requeue reopens live Manual Review infra parks via operator retry (same slug,
 * cap BLOG_OPERATOR_REQUEUE_MAX). It does not use a hardcoded slug list.
 */
import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { startStaticServerBound, stopStaticServer } from "./lib/static-server.mjs";
import { remapWorkerExit } from "./lib/worker-exit-remap.mjs";
import {
  isSoftRequeueError,
  maybeSoftRequeueTransportKill,
  listOpenIssues,
  listOperatorRetryJobs,
  listManualReview,
  readJobs,
  writeJobs,
  rebuildFlagBlocks,
  reopenJobForOperatorRetry,
  TRANSPORT_REQUEUE_MAX,
} from "./lib/agent-jobs.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, "..");
const doRequeue = process.argv.includes("--requeue");

let failed = 0;
function assert(cond, msg) {
  if (!cond) {
    console.error("FAIL:", msg);
    failed++;
  } else {
    console.log("PASS:", msg);
  }
}

// --- 1) Exit remap: reproduce the exact 08/01 failure signatures ---
const silenceLog = `
Connection lost, reconnecting to https://api2.cursor.sh (attempt 10)...
[silence-watchdog] worker parent=29624 job=job-x logAge=0.8m hbAge=35.1m - killing agent children
`;
const silence = remapWorkerExit(-1, silenceLog);
assert(silence.error === "silence_kill", `silence-watchdog + exit -1 → silence_kill (got ${silence.error})`);
assert(silence.code === 76, "silence_kill uses exit 76");

const stormLog = `
Connection lost, reconnecting to https://api2.cursor.sh (attempt 8)...
Retry attempt 8...
Connection lost, reconnecting to https://api2.cursor.sh (attempt 9)...
`;
const storm = remapWorkerExit(-1, stormLog);
assert(storm.error === "transport_kill", `reconnect storm + exit -1 → transport_kill (got ${storm.error})`);

const retriable = remapWorkerExit(1, "RetriableError: Connection failed repeatedly\n");
assert(retriable.error === "transport_kill", "RetriableError → transport_kill");

const clean = remapWorkerExit(0, "WorkerReady: shipped ok\n");
assert(clean.error === null && clean.code === 0, "clean exit 0 stays 0");

// --- 2) Fail-once policy: classified as soft-requeueable for stem-skip, but NO auto-rerun ---
assert(TRANSPORT_REQUEUE_MAX === 0, "default TRANSPORT_REQUEUE_MAX is 0 (manual review)");
for (const err of [
  "worker_process_gone",
  "worker_exit_0",
  "worker_exit_-1",
  "stale_40.1285922833333m",
  "stale_worker_jobHb=41m",
  "transport_kill",
  "silence_kill",
]) {
  assert(isSoftRequeueError(err), `${err} is classified for stem-skip / infra`);
  const rq = maybeSoftRequeueTransportKill(
    {
      id: `job-qa-${err}`,
      slug: "adaptation-economics-research-2026",
      status: "failed",
      recovery: false,
      transportRequeues: 0,
    },
    err,
  );
  assert(rq === null, `${err} refuses auto-rerun (manual review)`);
}

// --- 3) Per-worker ports are unique (W1..W5) ---
const ports = [];
for (let id = 1; id <= 5; id++) {
  const smoke = 4180 + (id - 1) * 2;
  const qa = smoke + 1;
  ports.push(smoke, qa);
}
assert(new Set(ports).size === ports.length, `worker ports unique: ${ports.join(",")}`);

const workerPs1 = fs.readFileSync(path.join(REPO, "scripts/run-blog-worker.ps1"), "utf8");
assert(workerPs1.includes("SMOKE_QA_PORT"), "worker sets SMOKE_QA_PORT");
assert(workerPs1.includes("worker-exit-remap.mjs"), "worker calls exit remap CLI");
assert(workerPs1.includes("* 2)"), "worker uses spaced per-agent port pairs");

const workerPrompt = fs.readFileSync(path.join(REPO, "scripts/prompts/worker.txt"), "utf8");
assert(workerPrompt.includes("SMOKE_QA_PORT"), "worker prompt requires SMOKE_QA_PORT");

// --- 4) Concurrent Node static servers (simulates 5 agents in QA) ---
const tmpRoot = path.join(REPO, "artifacts", "_qa-static-isolation");
fs.mkdirSync(path.join(tmpRoot, "a"), { recursive: true });
fs.writeFileSync(path.join(tmpRoot, "a", "index.html"), "<html>ok-a</html>");

async function probe(url) {
  return new Promise((resolve, reject) => {
    http
      .get(url, (res) => {
        let body = "";
        res.on("data", (c) => (body += c));
        res.on("end", () => resolve({ status: res.statusCode, body }));
      })
      .on("error", reject);
  });
}

const servers = [];
try {
  // Intentionally request the SAME preferred port for all five — bound helper must fan out.
  const preferred = 43173;
  for (let i = 0; i < 5; i++) {
    servers.push(await startStaticServerBound(path.join(tmpRoot, "a"), preferred));
  }
  const boundPorts = servers.map((s) => s.port);
  assert(new Set(boundPorts).size === 5, `5 concurrent binds got unique ports: ${boundPorts.join(",")}`);
  for (const s of servers) {
    const r = await probe(`${s.url}/`);
    assert(r.status === 200 && r.body.includes("ok-a"), `server on ${s.port} serves content`);
  }
  console.log("PASS: concurrent Node static servers isolated:", boundPorts.join(", "));
} finally {
  for (const s of servers) {
    await stopStaticServer(s.server);
  }
}

// --- 5) Replay remap against real failure logs if present ---
const logDir = path.join(REPO, "artifacts", "automation-logs");
const samples = [
  ["worker-2-2026-08-01_00-31-28.log", -1, "silence_kill"],
  ["worker-5-2026-08-01_00-40-34.log", -1, "transport_kill"],
  ["worker-4-2026-08-01_00-59-28.log", -1, "transport_kill"],
];
for (const [name, exit, expect] of samples) {
  const p = path.join(logDir, name);
  if (!fs.existsSync(p)) {
    console.log("SKIP: missing log", name);
    continue;
  }
  const r = remapWorkerExit(exit, fs.readFileSync(p, "utf8"));
  assert(r.error === expect, `real log ${name} exit ${exit} → ${expect} (got ${r.error})`);
}

// CLI remap smoke
const cliLog = path.join(tmpRoot, "cli-remap.log");
fs.writeFileSync(cliLog, silenceLog, "utf8");
const cli = spawnSync(
  process.execPath,
  [path.join(REPO, "scripts/lib/worker-exit-remap.mjs"), "--exit", "-1", "--log", cliLog],
  { encoding: "utf8" },
);
assert(cli.status === 0, "remap CLI exits 0");
const cliJson = JSON.parse(cli.stdout || "{}");
assert(cliJson.error === "silence_kill", "remap CLI returns silence_kill");

// --- 6) Optionally operator-retry live Manual Review infra parks ---
if (doRequeue) {
  const data = readJobs();
  const parked = listManualReview(data);
  const eligible = listOperatorRetryJobs(data);
  let n = 0;
  for (const job of eligible) {
    const err = String(job.lastError || job.manualReviewReason || job.flagReason || "");
    const reopened = reopenJobForOperatorRetry(data, job.id);
    if (!reopened) continue;
    n++;
    console.log(`REQUEUE: ${reopened.id} ${reopened.slug} (was ${err}, retry ${reopened.operatorRequeues})`);
  }
  const skipped = parked.filter(
    (p) => !eligible.some((j) => j.id === p.id),
  );
  for (const p of skipped) {
    console.log(
      `SKIP MR: ${p.id} ${p.slug} (${p.error}) — not operator-retryable or retry cap exhausted`,
    );
  }

  rebuildFlagBlocks(data);
  writeJobs(data);
  const stillOpen = listOpenIssues(data);
  assert(Array.isArray(stillOpen), "open issues listable after requeue");
  console.log(`Requeued ${n} job(s); skipped ${skipped.length} parked MR(s)`);
} else {
  const parked = listManualReview();
  console.log(
    `NOTE: pass --requeue to operator-retry live Manual Review infra parks (${parked.length} parked now)`,
  );
}

// Unit tests from transport QA still matter
const transportQa = spawnSync(
  process.execPath,
  [path.join(REPO, "scripts/qa-worker-transport-exit.mjs")],
  { encoding: "utf8", cwd: REPO },
);
if (transportQa.stdout) process.stdout.write(transportQa.stdout);
if (transportQa.stderr) process.stderr.write(transportQa.stderr);
assert(transportQa.status === 0, "qa-worker-transport-exit.mjs still passes");

if (failed) {
  console.error(`\n${failed} isolation/requeue QA failure(s)`);
  process.exit(1);
}
console.log("\nAll worker isolation + requeue QA checks passed.");
