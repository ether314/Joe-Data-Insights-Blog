#!/usr/bin/env node
/**
 * Local dashboard: live-stream blog production CLI logs via Server-Sent Events.
 * Usage: npm run stream
 * Open: http://127.0.0.1:4177
 */

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import {
  buildShipTable,
  persistShipHistory,
  loadPostMeta,
} from "./lib/production-ship-parser.mjs";
import { readJobs, listDashboardAgents, computeSystemHealth, ensureFailuresFlagged, writeJobs } from "./lib/agent-jobs.mjs";
import {
  formatAgentStreamLine,
  flushAgentStreamBuffer,
} from "./lib/agent-stream-cot.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const LOG_DIR = path.join(REPO_ROOT, "artifacts", "automation-logs");
const LOCK_FILE = path.join(REPO_ROOT, "artifacts", "blog-production-lock.json");
const PROD_PID_FILE = path.join(REPO_ROOT, "artifacts", "blog-production.pid");
const ORCH_PID_FILE = path.join(REPO_ROOT, "artifacts", "blog-orchestrator.pid");
const WATCHDOG_PID_FILE = path.join(REPO_ROOT, "artifacts", "cursor-watchdog-loop.pid");
const STREAM_PID_FILE = path.join(REPO_ROOT, "artifacts", "production-stream.pid");
const JOBS_FILE = path.join(REPO_ROOT, "artifacts", "agent-jobs.json");
const UI_FILE = path.join(__dirname, "production-stream-ui.html");
const SHIP_HISTORY_FILE = path.join(REPO_ROOT, "artifacts", "production-ship-history.json");
const POSTS_FILE = path.join(REPO_ROOT, "src", "data", "posts.ts");
const ATTEMPTS_FILE = path.join(REPO_ROOT, "artifacts", "agent-process-attempts.json");
const MERGE_LOCK_FILE = path.join(REPO_ROOT, "artifacts", "orch-merge.lock");
const STREAM_BOOT_AT = new Date().toISOString();

function readJobsForDashboard() {
  const jobs = readJobs();
  if (!jobs) return null;
  try {
    const n = ensureFailuresFlagged(jobs);
    if (n > 0) writeJobs(jobs);
  } catch {
    /* non-fatal */
  }
  // Keep resolved failures out of the live jobs strip (they clutter the dashboard).
  // Full history remains in artifacts/agent-jobs.json for audit.
  // Failure audit log is archived separately — never send it to the Open issues UI.
  const liveJobs = (jobs.jobs || []).filter(
    (j) => !(j.status === "failed" && j.resolution),
  );
  const flags = {
    ...(jobs.flags || {}),
    failures: [], // open-issues UI must not render the historical failure log
    blockedStems: jobs.flags?.blockedStems || [],
    blockedThemes: jobs.flags?.blockedThemes || [],
  };
  return { ...jobs, jobs: liveJobs, flags };
}

function buildHealthPayload() {
  const lock = readJsonSafe(LOCK_FILE);
  const productionPid = readPidSafe(PROD_PID_FILE);
  const orchPid = readPidSafe(ORCH_PID_FILE);
  const jobs = readJobsForDashboard() || { jobs: [], workers: {}, flags: {} };
  let mergeLockPresent = false;
  let mergeLockAgeMin = null;
  try {
    if (fs.existsSync(MERGE_LOCK_FILE)) {
      mergeLockPresent = true;
      const st = fs.statSync(MERGE_LOCK_FILE);
      mergeLockAgeMin = Math.round(((Date.now() - st.mtimeMs) / 60000) * 10) / 10;
    }
  } catch {
    /* ignore */
  }
  const health = computeSystemHealth(jobs, {
    lock,
    pids: {
      productionAlive: isPidAlive(productionPid),
      orchestratorAlive: isPidAlive(orchPid),
    },
    mergeLockPresent,
    mergeLockAgeMin,
  });
  return { ...health, lock, mergeLockPresent, mergeLockAgeMin };
}

const HOST = process.env.STREAM_HOST ?? "127.0.0.1";
const PORT = Number(process.env.STREAM_PORT ?? 4177);

/** Mixed worker CLI logs (.log) — excludes .cot.log / .ndjson sidecars. */
function isMixedWorkerLogName(name) {
  return /^worker-[1-5]-.+\.log$/i.test(name) && !/\.(cot\.log|ndjson)$/i.test(name);
}

/** Latest N log sessions per worker (oldest→newest list, take the tail). */
function listLatestWorkerLogs(perWorker = 3) {
  /** @type {Map<string, string[]>} */
  const byWorker = new Map();
  for (const filePath of listLogsByPattern(/^worker-([1-5])-.*\.log$/)) {
    const name = path.basename(filePath);
    if (!isMixedWorkerLogName(name)) continue;
    const m = name.match(/^worker-([1-5])-/);
    if (!m) continue;
    const id = m[1];
    if (!byWorker.has(id)) byWorker.set(id, []);
    byWorker.get(id).push(filePath);
  }
  const out = [];
  for (const files of byWorker.values()) {
    out.push(...files.slice(-perWorker));
  }
  return out.sort((a, b) => {
    try {
      return fs.statSync(a).mtimeMs - fs.statSync(b).mtimeMs;
    } catch {
      return 0;
    }
  });
}

/** Pure CoT files only (thought/tool) — never the mixed worker .log with git/harness. */
function listLatestCotLogs(perWorker = 4) {
  /** @type {Map<string, string[]>} */
  const byWorker = new Map();
  for (const filePath of listLogsByPattern(/^worker-([1-5])-.*\.cot\.log$/)) {
    const m = path.basename(filePath).match(/^worker-([1-5])-/);
    if (!m) continue;
    const id = m[1];
    if (!byWorker.has(id)) byWorker.set(id, []);
    byWorker.get(id).push(filePath);
  }
  // Fallback: extract [cot:] lines from recent worker .log if no sidecar yet
  for (let id = 1; id <= 5; id++) {
    const key = String(id);
    if ((byWorker.get(key) || []).length) continue;
    const fallback = listLogsByPattern(new RegExp(`^worker-${id}-.*\\.log$`))
      .filter((p) => isMixedWorkerLogName(path.basename(p)))
      .slice(-2);
    if (fallback.length) byWorker.set(key, fallback);
  }
  const out = [];
  for (const files of byWorker.values()) {
    out.push(...files.slice(-perWorker));
  }
  return out.sort((a, b) => {
    try {
      return fs.statSync(a).mtimeMs - fs.statSync(b).mtimeMs;
    } catch {
      return 0;
    }
  });
}

function streamWantsPureCot(streamKey) {
  return streamKey === "cot" || /^worker-[1-5]$/.test(String(streamKey || ""));
}

/** Thought/tool/user/system agent events only — exclude git, harness, transport. */
function isPureCotLine(text) {
  return /\[cot:(thought|tool|user|system)\]/i.test(String(text || ""));
}

function listCotPathsForWorker(workerId) {
  const cot = listLogsByPattern(new RegExp(`^worker-${workerId}-.*\\.cot\\.log$`)).slice(-5);
  if (cot.length) return cot;
  return listLogsByPattern(new RegExp(`^worker-${workerId}-.*\\.log$`))
    .filter((p) => isMixedWorkerLogName(path.basename(p)))
    .slice(-3);
}

function listAgentTranscriptFiles() {
  if (!fs.existsSync(LOG_DIR)) return [];
  return fs
    .readdirSync(LOG_DIR)
    .filter((n) => /^agent-transcript-.*\.(txt|log)$/i.test(n))
    .map((n) => path.join(LOG_DIR, n))
    .sort((a, b) => fs.statSync(a).mtimeMs - fs.statSync(b).mtimeMs)
    .slice(-8);
}

const STREAMS = {
  production: {
    label: "Production CLI",
    resolvePaths: () => listLogsByPattern(/^production-\d{4}-\d{2}-\d{2}.*\.log$/),
  },
  watchdog: {
    label: "Watchdog",
    resolvePaths: () => [path.join(LOG_DIR, "watchdog.log")].filter((p) => fs.existsSync(p)),
  },
  loop: {
    label: "Watchdog loop",
    resolvePaths: () =>
      [path.join(LOG_DIR, "cursor-watchdog-loop.log")].filter((p) => fs.existsSync(p)),
  },
  startup: {
    label: "Automation startup",
    resolvePaths: () =>
      [path.join(LOG_DIR, "automation-startup.log")].filter((p) => fs.existsSync(p)),
  },
  /** Pure agent CoT only (.cot.log sidecars) — never mixed CLI/git/harness logs. */
  cot: {
    label: "Chain of Thought",
    resolvePaths: () => [
      ...listLatestCotLogs(4),
      ...listLogsByPattern(/^cot-demo-.*\.cot\.log$/),
      ...listLogsByPattern(/^cot-demo-.*\.log$/),
    ],
  },
  "worker-1": {
    label: "W1 CoT",
    resolvePaths: () => listCotPathsForWorker(1),
  },
  "worker-2": {
    label: "W2 CoT",
    resolvePaths: () => listCotPathsForWorker(2),
  },
  "worker-3": {
    label: "W3 CoT",
    resolvePaths: () => listCotPathsForWorker(3),
  },
  "worker-4": {
    label: "W4 CoT",
    resolvePaths: () => listCotPathsForWorker(4),
  },
  "worker-5": {
    label: "W5 Recovery CoT",
    resolvePaths: () => listCotPathsForWorker(5),
  },
  all: {
    label: "All logs",
    resolvePaths: () => listAllLogFiles(),
  },
};

function readJsonSafe(filePath) {
  try {
    const raw = fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function readPidSafe(filePath) {
  try {
    const raw = fs.readFileSync(filePath, "utf8").trim().split(/\r?\n/)[0];
    const pid = Number(raw);
    return Number.isFinite(pid) && pid > 0 ? pid : null;
  } catch {
    return null;
  }
}

function isPidAlive(pid) {
  if (!pid) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function listLogsByPattern(pattern) {
  if (!fs.existsSync(LOG_DIR)) return [];
  return fs
    .readdirSync(LOG_DIR)
    .filter((name) => pattern.test(name))
    .map((name) => path.join(LOG_DIR, name))
    .sort((a, b) => fs.statSync(a).mtimeMs - fs.statSync(b).mtimeMs);
}

function listAllLogFiles() {
  if (!fs.existsSync(LOG_DIR)) return [];
  return fs
    .readdirSync(LOG_DIR)
    .filter((name) => name.endsWith(".log"))
    .map((name) => path.join(LOG_DIR, name))
    .sort((a, b) => fs.statSync(a).mtimeMs - fs.statSync(b).mtimeMs);
}

function findLatestLog(pattern) {
  const files = listLogsByPattern(pattern);
  return files.at(-1) ?? null;
}

function listLogFiles() {
  if (!fs.existsSync(LOG_DIR)) return [];
  return fs
    .readdirSync(LOG_DIR)
    .map((name) => {
      const full = path.join(LOG_DIR, name);
      const stat = fs.statSync(full);
      return { name, size: stat.size, mtime: stat.mtime.toISOString() };
    })
    .sort((a, b) => new Date(b.mtime) - new Date(a.mtime));
}

function parseLineTimestamp(line, fileMtimeMs) {
  const bracket = line.match(/^\[(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})\]/);
  if (bracket) {
    const parsed = Date.parse(bracket[1].replace(" ", "T"));
    if (Number.isFinite(parsed)) return parsed;
  }
  const iso = line.match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
  if (iso) {
    const parsed = Date.parse(iso[0]);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fileMtimeMs;
}

/** Expand a raw log/NDJSON line into dashboard text lines (pretty CoT for .ndjson). */
function expandLogLine(text, filePath, state) {
  if (!text) return [];
  const trimmed = text.trimStart();
  const isNdjson = String(filePath).endsWith(".ndjson");
  const looksLikeAgentEvent = trimmed.startsWith("{") && /"type"\s*:/.test(trimmed);
  if (isNdjson || looksLikeAgentEvent) {
    const { lines } = formatAgentStreamLine(text, state);
    return lines.length ? lines : [];
  }
  return [text];
}

function readFileLines(filePath, streamKey) {
  let stat;
  try {
    stat = fs.statSync(filePath);
  } catch {
    return [];
  }
  if (!stat.isFile() || stat.size === 0) return [];

  let content;
  try {
    content = fs.readFileSync(filePath, "utf8");
  } catch (err) {
    if (err && (err.code === "EBUSY" || err.code === "EPERM" || err.code === "EACCES")) {
      return [];
    }
    throw err;
  }
  const source = path.basename(filePath);
  const entries = [];
  const lines = content.split(/\r?\n/);
  const cotState = { buffer: { text: "" }, seenPartial: false };
  let seq = 0;
  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    if (!raw) continue;
    const expanded = expandLogLine(raw, filePath, cotState);
    const ts = parseLineTimestamp(raw, stat.mtimeMs);
    for (const text of expanded) {
      if (streamWantsPureCot(streamKey) && !isPureCotLine(text)) continue;
      entries.push({
        text,
        source,
        stream: streamKey,
        at: new Date(ts).toISOString(),
        sortKey: ts * 1_000_000 + seq++,
      });
    }
  }
  for (const text of flushAgentStreamBuffer(cotState)) {
    if (streamWantsPureCot(streamKey) && !isPureCotLine(text)) continue;
    entries.push({
      text,
      source,
      stream: streamKey,
      at: new Date(stat.mtimeMs).toISOString(),
      sortKey: stat.mtimeMs * 1_000_000 + seq++,
    });
  }
  return entries;
}

function collectHistory(streamKey, filePaths) {
  const entries = [];
  for (const filePath of filePaths) {
    entries.push(...readFileLines(filePath, streamKey));
  }
  entries.sort((a, b) => b.sortKey - a.sortKey);
  return entries;
}

/** Track repo slug additions while the stream server is running. */
let knownPostSlugs = new Set(loadPostMeta(POSTS_FILE).keys());
let lastRunStartMs = null;

function noteRunStartFromLogs() {
  const latest = findLatestLog(/^production-\d{4}-\d{2}-\d{2}.*\.log$/);
  if (!latest) return;
  try {
    const tail = fs.readFileSync(latest, "utf8").slice(-4000);
    const m = tail.match(/\[(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})\][^\n]*Starting local blog production run/);
    if (m) {
      const ms = Date.parse(m[1].replace(" ", "T"));
      if (Number.isFinite(ms)) lastRunStartMs = ms;
    }
  } catch {}
}

function refreshShipTable() {
  noteRunStartFromLogs();
  const lock = readJsonSafe(LOCK_FILE);
  const rows = buildShipTable({
    logDir: LOG_DIR,
    postsPath: POSTS_FILE,
    historyPath: SHIP_HISTORY_FILE,
    lock,
  });

  const postMeta = loadPostMeta(POSTS_FILE);
  const slugSet = new Set(postMeta.keys());
  for (const slug of slugSet) {
    if (!knownPostSlugs.has(slug) && knownPostSlugs.size > 0) {
      const exists = rows.some((r) => r.slug === slug);
      if (!exists) {
        const durationSec =
          lastRunStartMs != null
            ? Math.max(0, Math.round((Date.now() - lastRunStartMs) / 1000))
            : null;
        rows.unshift({
          slug,
          title: postMeta.get(slug)?.title ?? slug,
          shippedAt: new Date().toISOString(),
          shippedAtMs: Date.now(),
          durationSec,
          durationLabel:
            durationSec != null
              ? `${Math.floor(durationSec / 60)}m ${durationSec % 60}s`
              : "—",
          runId: lock?.runId ?? null,
          signal: "posts.ts",
          source: "repo",
          logFile: null,
          blogUrl: `https://ether-data-insights-blog.web.app/blog/${slug}`,
        });
      }
    }
  }
  knownPostSlugs = slugSet;

  rows.sort((a, b) => b.shippedAtMs - a.shippedAtMs);
  persistShipHistory(SHIP_HISTORY_FILE, rows);
  return rows;
}

function buildStatus() {
  const lock = readJsonSafe(LOCK_FILE);
  const productionPid = readPidSafe(PROD_PID_FILE);
  const orchPid = readPidSafe(ORCH_PID_FILE);
  const watchdogLoopPid = readPidSafe(WATCHDOG_PID_FILE);
  const streamPid = readPidSafe(STREAM_PID_FILE);
  const productionLog = findLatestLog(/^production-\d{4}-\d{2}-\d{2}.*\.log$/);
  const jobs = readJobsForDashboard();
  const health = buildHealthPayload();

  let heartbeatAgeMin = null;
  if (lock?.lastHeartbeat) {
    const age = (Date.now() - Date.parse(lock.lastHeartbeat)) / 60000;
    if (Number.isFinite(age)) heartbeatAgeMin = Math.round(age * 10) / 10;
  }

  return {
    at: new Date().toISOString(),
    lock,
    jobs,
    health,
    pids: {
      production: productionPid,
      productionAlive: isPidAlive(productionPid),
      orchestrator: orchPid,
      orchestratorAlive: isPidAlive(orchPid),
      watchdogLoop: watchdogLoopPid,
      watchdogLoopAlive: isPidAlive(watchdogLoopPid),
      stream: streamPid,
      streamAlive: isPidAlive(streamPid) || streamPid === process.pid,
    },
    logs: {
      production: productionLog ? path.basename(productionLog) : null,
      files: listLogFiles(),
      totalFiles: listLogFiles().length,
    },
    heartbeatAgeMin,
    agents: listRunningAgents(),
  };
}

/** @type {{ at: number, rows: any[] } | null} */
let processCache = null;

function listRelevantProcesses() {
  const now = Date.now();
  if (processCache && now - processCache.at < 2500) return processCache.rows;

  if (process.platform !== "win32") {
    processCache = { at: now, rows: [] };
    return [];
  }

  try {
    // Truncate CommandLine before ConvertTo-Json — agent CLI prompts contain
    // quotes/control chars that otherwise produce invalid JSON.
    const script = `
$ErrorActionPreference = 'SilentlyContinue'
Get-CimInstance Win32_Process |
  Where-Object {
    $_.CommandLine -and (
      $_.CommandLine -match 'run-blog-production-local\\.ps1' -or
      $_.CommandLine -match 'run-blog-orchestrator\\.ps1' -or
      $_.CommandLine -match 'run-blog-worker\\.ps1' -or
      $_.CommandLine -match 'cursor-watchdog-loop\\.ps1' -or
      $_.CommandLine -match 'watch-blog-production\\.ps1' -or
      $_.CommandLine -match 'production-stream-server\\.mjs' -or
      $_.CommandLine -match 'agent.*worker start' -or
      $_.CommandLine -match 'worker start.*--worker-dir' -or
      ($_.CommandLine -match 'cursor-agent' -and $_.CommandLine -match '-p --force') -or
      ($_.CommandLine -match 'index\\.js' -and $_.CommandLine -match '-p --force') -or
      $_.CommandLine -match 'npm run deploy' -or
      $_.CommandLine -match 'firebase-deploy-hosting\\.mjs' -or
      $_.CommandLine -match 'next build' -or
      $_.CommandLine -match 'firebase-tools.*deploy' -or
      ($_.CommandLine -match 'npm run build' -and $_.CommandLine -match 'smoke-test-viz-posts')
    ) -and (
      $_.CommandLine -notmatch 'Get-CimInstance Win32_Process'
    )
  } |
  ForEach-Object {
    $cmd = [string]$_.CommandLine
    if ($cmd.Length -gt 220) { $cmd = $cmd.Substring(0, 220) + '…' }
    $cmd = $cmd -replace '[\\u0000-\\u001F]', ' '
    [PSCustomObject]@{
      ProcessId = $_.ProcessId
      ParentProcessId = $_.ParentProcessId
      Name = $_.Name
      CommandLine = $cmd
      CreationDate = if ($_.CreationDate) { $_.CreationDate.ToString('yyyyMMddHHmmss') } else { $null }
    }
  } |
  ConvertTo-Json -Compress -Depth 4
`.trim();

    const raw = execFileSync(
      "powershell.exe",
      ["-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", script],
      {
        encoding: "utf8",
        timeout: 12000,
        windowsHide: true,
        maxBuffer: 8 * 1024 * 1024,
      },
    ).trim();

    if (!raw) {
      processCache = { at: now, rows: [] };
      return [];
    }

    const parsed = JSON.parse(raw);
    const rows = Array.isArray(parsed) ? parsed : [parsed];
    processCache = { at: now, rows };
    return rows;
  } catch {
    processCache = { at: now, rows: [] };
    return [];
  }
}

function classifyProcess(proc) {
  const cmd = proc.CommandLine || "";
  // Prefer specific matches; exclude agent CLI whose prompt mentions the script name.
  if (cmd.match(/-File\s+"?[^"]*run-blog-orchestrator\.ps1/i)) {
    return { id: "orchestrator-shell", role: "Orchestrator shell", kind: "orchestrator" };
  }
  if (cmd.match(/-File\s+"?[^"]*run-blog-worker\.ps1/i)) {
    const m = cmd.match(/-WorkerId\s+(\d+)/i);
    return {
      id: m ? `worker-shell-${m[1]}` : "worker-shell",
      role: m ? `Worker ${m[1]} shell` : "Worker shell",
      kind: "worker-slot",
    };
  }
  if (cmd.match(/-File\s+"?[^"]*run-blog-production-local\.ps1/i)) {
    return { id: "production-shell", role: "Production shell", kind: "shell" };
  }
  if (cmd.includes("cursor-watchdog-loop.ps1")) {
    return { id: "watchdog-loop", role: "Watchdog loop", kind: "watchdog" };
  }
  if (cmd.includes("watch-blog-production.ps1") && !cmd.includes("cursor-watchdog-loop")) {
    return { id: "watchdog-check", role: "Watchdog check", kind: "watchdog" };
  }
  if (cmd.includes("production-stream-server.mjs")) {
    return { id: "stream", role: "Stream dashboard", kind: "stream" };
  }
  if (/worker start/i.test(cmd) && (/agent/i.test(cmd) || /--worker-dir/i.test(cmd))) {
    return { id: "cursor-worker", role: "Cursor worker", kind: "worker" };
  }
  if (/-p --force/.test(cmd) && (/cursor-agent|index\.js/.test(cmd))) {
    return { id: "agent-cli", role: "Agent CLI (conveyor)", kind: "agent" };
  }
  if (
    /npm run deploy|firebase-deploy-hosting\.mjs|next build|firebase-tools.*deploy/i.test(cmd) ||
    (/npm run build/i.test(cmd) && /smoke-test-viz-posts/i.test(cmd))
  ) {
    return { id: "deploy", role: "Deploy / build", kind: "deploy" };
  }
  return null;
}

function readProductionLogTail(maxLines = 40) {
  const log = findLatestLog(/^production-\d{4}-\d{2}-\d{2}.*\.log$/);
  if (!log) return { file: null, lines: [], mtimeMs: null };
  try {
    const text = fs.readFileSync(log, "utf8");
    const lines = text.split(/\r?\n/).filter(Boolean);
    return {
      file: path.basename(log),
      lines: lines.slice(-maxLines),
      mtimeMs: fs.statSync(log).mtimeMs,
    };
  } catch {
    return { file: path.basename(log), lines: [], mtimeMs: null };
  }
}

function inferAgentStatus(kind, lock, logTail, logMtimeMs = null) {
  const joined = logTail.join("\n");
  const recent = logTail.slice(-12).join("\n");
  if (kind === "agent") {
    const blipFresh =
      logMtimeMs != null && Date.now() - logMtimeMs < 90_000;
    // CLI prints reconnect noise, then often recovers and goes quiet while
    // tooling (long deploys). Only show reconnecting while the log is still
    // being written with blip lines.
    if (
      blipFresh &&
      /Connection lost|Retry attempt/i.test(recent) &&
      !/Invoking agent session/i.test(recent.split(/Connection lost/i).pop() || "")
    ) {
      const m = recent.match(/attempt\s+(\d+)/i);
      return {
        state: "reconnecting",
        label: m ? `Reconnecting (attempt ${m[1]})` : "Reconnecting",
      };
    }
    const sessions = [...joined.matchAll(/Invoking agent session (\d+)\/(\d+)/g)];
    if (sessions.length) {
      const last = sessions[sessions.length - 1];
      return { state: "active", label: `Session ${last[1]}/${last[2]}` };
    }
    if (lock?.status === "running") {
      return { state: "active", label: lock.notes || "Running" };
    }
    return { state: "idle", label: "Idle" };
  }
  if (kind === "shell") {
    if (lock?.status === "running") return { state: "active", label: lock.notes || "Running" };
    if (lock?.status === "paused") return { state: "paused", label: "Paused" };
    return { state: "idle", label: lock?.status || "Idle" };
  }
  if (kind === "deploy") return { state: "busy", label: "Deploying" };
  if (kind === "stream") return { state: "active", label: "Serving :4177" };
  if (kind === "watchdog") return { state: "active", label: "Polling" };
  if (kind === "worker") return { state: "active", label: "Connected" };
  return { state: "active", label: "Running" };
}

function formatStartedAt(creationDate) {
  if (!creationDate) return null;
  // CIM datetime like 20260731125548.123456-240, or yyyyMMddHHmmss
  const m = String(creationDate).match(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/);
  if (!m) return null;
  const iso = `${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:${m[6]}`;
  const t = Date.parse(iso);
  return Number.isFinite(t) ? new Date(t).toISOString() : null;
}

function formatDuration(ms) {
  if (ms == null || !Number.isFinite(ms) || ms < 0) return "—";
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) return `${h}h ${String(m).padStart(2, "0")}m`;
  if (m > 0) return `${m}m ${String(s).padStart(2, "0")}s`;
  return `${s}s`;
}

function readTextTail(filePath, maxLines = 40) {
  if (!filePath || !fs.existsSync(filePath)) return { lines: [], mtimeMs: null };
  try {
    const text = fs.readFileSync(filePath, "utf8");
    const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
    return {
      lines: lines.slice(-maxLines),
      mtimeMs: fs.statSync(filePath).mtimeMs,
    };
  } catch {
    return { lines: [], mtimeMs: null };
  }
}

function findLatestTranscript(runId) {
  if (!fs.existsSync(LOG_DIR)) return null;
  const prefix = runId ? `agent-transcript-${runId}` : "agent-transcript-";
  const files = fs
    .readdirSync(LOG_DIR)
    .filter((n) => n.startsWith(prefix) && n.endsWith(".txt"))
    .map((n) => path.join(LOG_DIR, n))
    .sort((a, b) => fs.statSync(a).mtimeMs - fs.statSync(b).mtimeMs);
  return files.at(-1) ?? null;
}

function cleanActivityLine(line) {
  return String(line || "")
    .replace(/^\[[\d\- :]+\]\s*/, "")
    .replace(/\s+/g, " ")
    .trim();
}

function activityFromChildCommands(cmds) {
  const joined = (cmds || []).join("\n");
  if (!joined) return null;
  if (/firebase-deploy-hosting|firebase-tools.*deploy|firebase.*deploy --only hosting/i.test(joined)) {
    return "Deploying Firebase Hosting";
  }
  if (/smoke-test-viz-posts/i.test(joined)) return "Running viz smoke tests";
  if (/qa-homepage-and-fullscreen/i.test(joined)) return "Homepage / fullscreen QA";
  if (/test-all-costs/i.test(joined)) return "Running cost regression tests";
  if (/next build|npm run build/i.test(joined)) return "Building Next.js static export";
  if (/chrome-headless|playwright/i.test(joined)) return "Playwright browser automation";
  if (/firebase-tools.*\bmcp\b/i.test(joined)) return "Firebase MCP session open";
  if (/GenerateImage|generate.*hero/i.test(joined)) return "Generating hero image";
  return null;
}

function pickInterestingLogLine(lines) {
  const ranked = [];
  for (let i = lines.length - 1; i >= 0; i--) {
    const raw = lines[i];
    const c = cleanActivityLine(raw);
    if (!c || c.length < 6) continue;
    if (/^\*+|Windows PowerShell transcript|Start time:|Username:|PSVersion|Host Application|Process ID:|CLRVersion|BuildVersion|WSMan|Serialization|PSEdition|PSCompatible|Configuration Name|RunAs User|Machine:/i.test(c)) {
      continue;
    }
    let score = 1;
    if (/Shipped:/i.test(c)) score = 100;
    else if (/ERROR:|transport unhealthy/i.test(c)) score = 90;
    else if (/Invoking agent session|Starting fresh|Transport exhausted|Transport drop/i.test(c)) score = 80;
    else if (/Connection lost|Retry attempt|transport blip/i.test(c)) score = 70;
    else if (/deploy|smoke|build|Phase |Writing |Generating |npm run/i.test(c)) score = 60;
    else if (/WARN:|INFO:/i.test(c)) score = 40;
    ranked.push({ score, line: c.slice(0, 160), idx: i });
  }
  if (!ranked.length) return null;
  // Prefer the newest high-signal line (search from end with score threshold)
  for (const row of ranked) {
    if (row.score >= 60) return row.line;
  }
  return ranked[0].line;
}

/** @type {{ at: number, byParent: Map<number, string[]> } | null} */
let childCmdCache = null;

function listChildCommands(parentPids) {
  const ids = [...new Set(parentPids.filter((p) => Number.isFinite(p) && p > 0))];
  if (!ids.length || process.platform !== "win32") return [];

  const now = Date.now();
  if (childCmdCache && now - childCmdCache.at < 2500) {
    const out = [];
    for (const id of ids) {
      const rows = childCmdCache.byParent.get(id);
      if (rows) out.push(...rows);
    }
    return [...new Set(out)];
  }

  try {
    // One CIM scan: return parent->command pairs for all matching parents (+1 hop).
    const idList = ids.join(",");
    const script = `
$ErrorActionPreference = 'SilentlyContinue'
$roots = @(${idList}) | ForEach-Object { [int]$_ }
$want = New-Object 'System.Collections.Generic.HashSet[int]'
foreach ($r in $roots) { [void]$want.Add($r) }
$procs = @(Get-CimInstance Win32_Process | Where-Object { $_.CommandLine })
foreach ($p in $procs) {
  if ($p.ParentProcessId -and $want.Contains([int]$p.ParentProcessId)) {
    [void]$want.Add([int]$p.ProcessId)
  }
}
$out = foreach ($p in $procs) {
  if ($p.ParentProcessId -and $want.Contains([int]$p.ParentProcessId)) {
    $cmd = ([string]$p.CommandLine) -replace '\\s+', ' '
    if ($cmd.Length -gt 200) { $cmd = $cmd.Substring(0,200) + '…' }
    [PSCustomObject]@{ ParentProcessId = [int]$p.ParentProcessId; CommandLine = $cmd }
  }
}
$out | ConvertTo-Json -Compress -Depth 3
`.trim();
    const raw = execFileSync(
      "powershell.exe",
      ["-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", script],
      {
        encoding: "utf8",
        timeout: 10000,
        windowsHide: true,
        maxBuffer: 4 * 1024 * 1024,
      },
    ).trim();

    const byParent = new Map();
    if (raw) {
      const parsed = JSON.parse(raw);
      const rows = Array.isArray(parsed) ? parsed : [parsed];
      for (const row of rows) {
        const ppid = Number(row.ParentProcessId);
        const cmd = row.CommandLine;
        if (!ppid || !cmd) continue;
        if (!byParent.has(ppid)) byParent.set(ppid, []);
        byParent.get(ppid).push(cmd);
      }
    }
    childCmdCache = { at: now, byParent };

    const out = [];
    for (const id of ids) {
      // collect commands whose parent is id or whose parent is a child of id
      for (const [ppid, cmds] of byParent.entries()) {
        if (ppid === id || ids.includes(ppid)) out.push(...cmds);
      }
    }
    // Also include all cmds under the expanded want set for these roots
    for (const cmds of byParent.values()) out.push(...cmds);
    return [...new Set(out)];
  } catch {
    childCmdCache = { at: now, byParent: new Map() };
    return [];
  }
}


function inferJobActivity(kind, ctx) {
  const childAct = activityFromChildCommands(ctx.childCmds || []);
  if (kind === "deploy") {
    return childAct || activityFromChildCommands([ctx.command || ""]) || "Deploy pipeline running";
  }
  if (kind === "agent" || kind === "shell") {
    if (childAct) return childAct;
    const fromLog = pickInterestingLogLine(ctx.logTail || []);
    if (fromLog) return fromLog;
    const fromTx = pickInterestingLogLine(ctx.transcriptTail || []);
    if (fromTx) return fromTx;
    if (ctx.lock?.notes) return String(ctx.lock.notes).slice(0, 140);
    return "Waiting for agent output…";
  }
  if (kind === "watchdog") {
    const line = pickInterestingLogLine(ctx.watchdogTail || []);
    return line || "Idle between watchdog checks";
  }
  if (kind === "stream") {
    return `Serving dashboard - ${ctx.clientHint || "SSE"}`;
  }
  if (kind === "worker") return "Cursor self-hosted worker online";
  return "—";
}

function parseAgentSessionAttempts(logTail) {
  const joined = logTail.join("\n");
  const sessions = [...joined.matchAll(/Invoking agent session (\d+)\/(\d+)/g)];
  if (!sessions.length) return { attempt: null, attemptMax: null, reconnectAttempt: null };
  const last = sessions[sessions.length - 1];
  const recent = logTail.slice(-15).join("\n");
  let reconnectAttempt = null;
  const rm = recent.match(/(?:Connection lost|Retry attempt).*?attempt\s+(\d+)/i)
    || recent.match(/^Retry attempt\s+(\d+)/im);
  if (rm) reconnectAttempt = Number(rm[1]);
  return {
    attempt: Number(last[1]),
    attemptMax: Number(last[2]),
    reconnectAttempt,
  };
}

function loadAttemptTracker(runId) {
  const empty = { runId: runId || null, roles: {}, updatedAt: new Date().toISOString() };
  try {
    const raw = fs.readFileSync(ATTEMPTS_FILE, "utf8").replace(/^\uFEFF/, "");
    const data = JSON.parse(raw);
    if (!data || typeof data !== "object") return empty;
    if (runId && data.runId && data.runId !== runId) return empty;
    return {
      runId: data.runId || runId || null,
      roles: data.roles && typeof data.roles === "object" ? data.roles : {},
      updatedAt: data.updatedAt || empty.updatedAt,
    };
  } catch {
    return empty;
  }
}

function saveAttemptTracker(tracker) {
  try {
    fs.mkdirSync(path.dirname(ATTEMPTS_FILE), { recursive: true });
    tracker.updatedAt = new Date().toISOString();
    fs.writeFileSync(ATTEMPTS_FILE, `${JSON.stringify(tracker, null, 2)}\n`, "utf8");
  } catch {
    // non-fatal
  }
}

/**
 * Track how many times each role PID has been (re)started in this run.
 * Returns map id -> { attempts, firstSeenAt, pid }
 */
function updateAttemptTracker(runId, agents) {
  const tracker = loadAttemptTracker(runId);
  if (runId) tracker.runId = runId;
  const nowIso = new Date().toISOString();
  const seenIds = new Set();

  for (const a of agents) {
    const id = a.id;
    seenIds.add(id);
    const prev = tracker.roles[id];
    if (!prev) {
      tracker.roles[id] = {
        attempts: 1,
        pid: a.pid,
        firstSeenAt: a.startedAt || nowIso,
        lastPidStartedAt: a.startedAt || nowIso,
      };
      continue;
    }
    if (Number(prev.pid) !== Number(a.pid)) {
      tracker.roles[id] = {
        attempts: (Number(prev.attempts) || 1) + 1,
        pid: a.pid,
        firstSeenAt: prev.firstSeenAt || a.startedAt || nowIso,
        lastPidStartedAt: a.startedAt || nowIso,
      };
    } else {
      tracker.roles[id] = {
        ...prev,
        pid: a.pid,
        lastPidStartedAt: prev.lastPidStartedAt || a.startedAt || nowIso,
      };
    }
  }

  // Drop roles that disappeared this scan so a later restart counts fresh
  // (keep history of attempts for roles still in tracker until runId changes).
  saveAttemptTracker(tracker);
  return tracker;
}

function listRunningAgents() {
  const lock = readJsonSafe(LOCK_FILE);
  const { file: logFile, lines: logTail, mtimeMs: logMtimeMs } = readProductionLogTail(80);
  const sessionMeta = parseAgentSessionAttempts(logTail);
  const transcriptPath = findLatestTranscript(lock?.runId);
  const { lines: transcriptTail } = readTextTail(transcriptPath, 50);
  const { lines: watchdogTail } = readTextTail(path.join(LOG_DIR, "watchdog.log"), 30);
  const procs = listRelevantProcesses();
  const seen = new Set();
  /** @type {any[]} */
  const agents = [];

  for (const proc of procs) {
    const classified = classifyProcess(proc);
    if (!classified) continue;
    // Skip prompt-text false positives: agent CLI argv mentioning the production script
    if (
      classified.id === "production-shell" &&
      !/-File\s+"?[^"]*run-blog-production-local\.ps1/i.test(proc.CommandLine || "")
    ) {
      continue;
    }
    // Prefer the real node process over cmd.exe /c wrappers for the stream server
    if (classified.kind === "stream" && /^cmd(\.exe)?$/i.test(proc.Name || "")) {
      continue;
    }
    const key = `${classified.id}:${proc.ProcessId}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const status = inferAgentStatus(classified.kind, lock, logTail, logMtimeMs);
    const cmd = (proc.CommandLine || "").replace(/\s+/g, " ").trim();
    const startedAt = formatStartedAt(proc.CreationDate);
    agents.push({
      id: classified.id,
      role: classified.role,
      kind: classified.kind,
      pid: Number(proc.ProcessId),
      ppid: Number(proc.ParentProcessId) || null,
      name: proc.Name,
      state: status.state,
      statusLabel: status.label,
      startedAt,
      command: cmd.length > 180 ? `${cmd.slice(0, 177)}…` : cmd,
      runId: lock?.runId || null,
      lastSlug: lock?.lastSlug || null,
      lockStatus: lock?.status || null,
      logFile,
    });
  }

  // Always include self (stream server) even if process query missed it.
  if (!agents.some((a) => a.kind === "stream" && a.pid === process.pid)) {
    agents.push({
      id: "stream",
      role: "Stream dashboard",
      kind: "stream",
      pid: process.pid,
      ppid: process.ppid || null,
      name: "node",
      state: "active",
      statusLabel: `Serving :${PORT}`,
      startedAt: STREAM_BOOT_AT,
      command: `node scripts/production-stream-server.mjs`,
      runId: lock?.runId || null,
      lastSlug: lock?.lastSlug || null,
      lockStatus: lock?.status || null,
      logFile,
    });
  }

  // One row per role — prefer the newest PID when duplicates appear
  {
    const best = new Map();
    for (const a of agents) {
      const prev = best.get(a.id);
      if (!prev) {
        best.set(a.id, a);
        continue;
      }
      const aStart = a.startedAt ? Date.parse(a.startedAt) : 0;
      const pStart = prev.startedAt ? Date.parse(prev.startedAt) : 0;
      if (aStart >= pStart || a.pid > prev.pid) best.set(a.id, a);
    }
    agents.length = 0;
    agents.push(...best.values());
  }

  const tracker = updateAttemptTracker(lock?.runId || null, agents);
  const now = Date.now();
  // Prefer commands already discovered in the process scan (deploy / tooling)
  // plus log tails — avoid a second full CIM walk (that was timing out /api/agents).
  const toolingCmds = agents
    .filter((a) => a.kind === "deploy" || /firebase|npm run build|smoke-test|next build/i.test(a.command || ""))
    .map((a) => a.command);

  for (const a of agents) {
    const roleTrack = tracker.roles[a.id];
    let attempts = roleTrack?.attempts || 1;
    let attemptMax = null;
    let reconnectAttempt = null;

    if (a.kind === "agent" && sessionMeta.attempt != null) {
      attempts = sessionMeta.attempt;
      attemptMax = sessionMeta.attemptMax;
      reconnectAttempt = sessionMeta.reconnectAttempt;
    }

    const startedMs = a.startedAt ? Date.parse(a.startedAt) : NaN;
    const runningForMs = Number.isFinite(startedMs) ? Math.max(0, now - startedMs) : null;

    a.attempts = attempts;
    a.attemptMax = attemptMax;
    a.reconnectAttempt = reconnectAttempt;
    a.attemptsLabel =
      attemptMax != null
        ? `${attempts}/${attemptMax}`
        : `${attempts}x`;
    if (reconnectAttempt != null && a.state === "reconnecting") {
      a.attemptsLabel = `${a.attemptsLabel} · reconnect ${reconnectAttempt}`;
    }
    a.runningForMs = runningForMs;
    a.runningForLabel = formatDuration(runningForMs);

    const activity = inferJobActivity(a.kind, {
      lock,
      logTail,
      transcriptTail,
      watchdogTail,
      command: a.command,
      childCmds: a.kind === "agent" || a.kind === "shell" || a.kind === "deploy" ? toolingCmds : [],
      clientHint: "live process + log tail",
    });
    a.activity = activity;
    a.activityAt = new Date().toISOString();
  }

  // Prefer job-queue roster whenever parallel worktrees are configured
  const jobs = readJobs();
  const hasWorkerSlots = Boolean(jobs?.workers && Object.keys(jobs.workers).length > 0);
  const parallel =
    lock?.mode === "parallel-worktrees" ||
    lock?.mode === "docker-isolated-workers" ||
    jobs?.orchestrator?.status === "running" ||
    hasWorkerSlots ||
    (Array.isArray(jobs?.jobs) && jobs.jobs.some((j) => !["shipped", "failed"].includes(j.status)));

  if (parallel) {
    const roster = listDashboardAgents(jobs).map((a) => {
      const startedMs = a.startedAt ? Date.parse(a.startedAt) : NaN;
      const runningForMs = Number.isFinite(startedMs) ? Math.max(0, Date.now() - startedMs) : null;
      const orchHb = jobs.orchestrator?.heartbeat ? Date.parse(jobs.orchestrator.heartbeat) : NaN;
      const orchRun =
        a.kind === "orchestrator" && Number.isFinite(orchHb)
          ? Math.max(0, Date.now() - orchHb)
          : null;
      return {
        ...a,
        runId: jobs.runId || lock?.runId || null,
        lastSlug: lock?.lastSlug || null,
        lockStatus: lock?.status || null,
        logFile,
        runningForMs: runningForMs ?? orchRun,
        runningForLabel: formatDuration(runningForMs ?? orchRun),
        attempts: a.attemptsLabel?.includes("x")
          ? Number(String(a.attemptsLabel).replace(/x.*/, "")) || 1
          : 1,
        command: a.worktreePath || a.role,
      };
    });
    // Keep stream + watchdog process rows as extras
    const extras = agents.filter((a) => a.kind === "stream" || a.kind === "watchdog" || a.kind === "deploy");
    return [...roster, ...extras];
  }

  const order = { agent: 0, shell: 1, deploy: 2, worker: 3, watchdog: 4, stream: 5 };
  agents.sort((a, b) => (order[a.kind] ?? 9) - (order[b.kind] ?? 9) || a.pid - b.pid);
  return agents;
}

function sendSse(res, event, data) {
  res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
}

function sendHistoryBatches(res, streamKey, entries) {
  const BATCH = 250;
  sendSse(res, "history-start", {
    stream: streamKey,
    total: entries.length,
  });
  for (let i = 0; i < entries.length; i += BATCH) {
    sendSse(res, "history", {
      stream: streamKey,
      lines: entries.slice(i, i + BATCH),
    });
  }
  sendSse(res, "history-end", {
    stream: streamKey,
    total: entries.length,
  });
}

function tailStream(res, streamKey) {
  const config = STREAMS[streamKey];
  if (!config) {
    res.writeHead(404);
    res.end("Unknown stream");
    return;
  }

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "Access-Control-Allow-Origin": "*",
  });

  /** @type {Map<string, number>} */
  const positions = new Map();
  /** @type {Map<string, { buffer: { text: string }, seenPartial?: boolean }>} */
  const cotStates = new Map();
  let knownPaths = new Set();
  let pollTimer = null;
  let watcher = null;
  let closed = false;
  let historySent = false;

  const cleanup = () => {
    closed = true;
    if (pollTimer) clearInterval(pollTimer);
    if (watcher) watcher.close();
  };

  res.on("close", cleanup);

  const emitMeta = (filePaths) => {
    sendSse(res, "meta", {
      stream: streamKey,
      label: config.label,
      files: filePaths.map((p) => path.basename(p)),
      fileCount: filePaths.length,
      status: buildStatus(),
    });
  };

  const emitLine = (entry, live = false) => {
    sendSse(res, "line", {
      stream: streamKey,
      text: entry.text,
      source: entry.source,
      at: entry.at,
      live,
      prepend: true,
    });
  };

  const readNewBytes = (filePaths) => {
    if (closed) return [];
    const fresh = [];

    for (const filePath of filePaths) {
      let stat;
      try {
        stat = fs.statSync(filePath);
      } catch {
        positions.delete(filePath);
        continue;
      }

      let position = positions.get(filePath) ?? 0;
      if (stat.size < position) position = 0;
      if (stat.size === position) continue;

      const length = stat.size - position;
      let fd;
      try {
        fd = fs.openSync(filePath, "r");
      } catch (err) {
        // Windows often locks active worker logs (EBUSY/EPERM); retry next poll.
        if (err && (err.code === "EBUSY" || err.code === "EPERM" || err.code === "EACCES")) {
          continue;
        }
        throw err;
      }
      try {
        const buffer = Buffer.alloc(length);
        fs.readSync(fd, buffer, 0, length, position);
        positions.set(filePath, stat.size);

        const text = buffer.toString("utf8");
        const parts = text.split(/\r?\n/);
        const source = path.basename(filePath);
        const baseTs = stat.mtimeMs;
        if (!cotStates.has(filePath)) {
          cotStates.set(filePath, { buffer: { text: "" }, seenPartial: false });
        }
        const cotState = cotStates.get(filePath);
        let seq = 0;

        for (let i = 0; i < parts.length; i++) {
          const line = parts[i];
          if (!line) continue;
          const ts = parseLineTimestamp(line, baseTs);
          const expanded = expandLogLine(line, filePath, cotState);
          for (const pretty of expanded) {
            if (streamWantsPureCot(streamKey) && !isPureCotLine(pretty)) continue;
            fresh.push({
              text: pretty,
              source,
              stream: streamKey,
              at: new Date(ts).toISOString(),
              sortKey: ts * 1_000_000 + seq++,
            });
          }
        }
      } finally {
        fs.closeSync(fd);
      }
    }

    fresh.sort((a, b) => b.sortKey - a.sortKey);
    return fresh;
  };

  const sync = ({ sendFullHistory = false } = {}) => {
    const filePaths = config.resolvePaths();
    const pathSet = new Set(filePaths);

    if (!historySent || sendFullHistory) {
      const history = collectHistory(streamKey, filePaths);
      for (const filePath of filePaths) {
        try {
          positions.set(filePath, fs.statSync(filePath).size);
        } catch {
          positions.set(filePath, 0);
        }
      }
      sendHistoryBatches(res, streamKey, history);
      historySent = true;
      sendSse(res, "system", {
        stream: streamKey,
        text: `Loaded ${history.length.toLocaleString()} line(s) from ${filePaths.length} file(s), newest first.`,
      });
    } else {
      const addedPaths = filePaths.filter((p) => !knownPaths.has(p));
      if (addedPaths.length > 0) {
        const backfill = collectHistory(
          streamKey,
          addedPaths.filter((p) => {
            try {
              const size = fs.statSync(p).size;
              positions.set(p, size);
              return true;
            } catch {
              return false;
            }
          }),
        );
        for (const entry of backfill) emitLine(entry, false);
        sendSse(res, "system", {
          stream: streamKey,
          text: `New log file(s): ${addedPaths.map((p) => path.basename(p)).join(", ")}`,
        });
      }
    }

    knownPaths = pathSet;
    emitMeta(filePaths);

    const liveLines = readNewBytes(filePaths);
    for (const entry of liveLines) emitLine(entry, true);
  };

  const safeSync = (opts) => {
    try {
      sync(opts);
    } catch (err) {
      const code = err?.code ?? "";
      if (code === "EBUSY" || code === "EPERM" || code === "EACCES") return;
      console.error(`[stream ${streamKey}] sync error:`, err?.message ?? err);
    }
  };

  safeSync({ sendFullHistory: true });
  pollTimer = setInterval(() => safeSync(), 500);

  if (fs.existsSync(LOG_DIR)) {
    watcher = fs.watch(LOG_DIR, { persistent: false }, () => safeSync());
  }
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url ?? "/", `http://${HOST}:${PORT}`);

  if (req.method === "GET" && url.pathname === "/") {
    try {
      const html = fs.readFileSync(UI_FILE, "utf8");
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(html);
      return;
    } catch (err) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end(`Missing UI file: ${err.message}`);
      return;
    }
  }

  if (req.method === "GET" && url.pathname === "/api/status") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(buildStatus(), null, 2));
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/agents") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify(
        {
          at: new Date().toISOString(),
          agents: listRunningAgents(),
          lock: readJsonSafe(LOCK_FILE),
          jobs: readJobsForDashboard(),
          health: buildHealthPayload(),
        },
        null,
        2,
      ),
    );
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/jobs") {
    const jobs = readJobsForDashboard() || {};
    const health = buildHealthPayload();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify(
        {
          at: new Date().toISOString(),
          ...jobs,
          health,
          openIssues: health.openIssues,
          manualReview: health.manualReview,
        },
        null,
        2,
      ),
    );
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(buildHealthPayload(), null, 2));
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/ships") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ at: new Date().toISOString(), ships: refreshShipTable() }, null, 2));
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/cot") {
    // Live CoT roster: which worker log is active + current job slug.
    const jobs = readJobsForDashboard() || { workers: {}, jobs: [] };
    const workers = [];
    for (let id = 1; id <= 5; id++) {
      const w = jobs.workers?.[String(id)] || {};
      const job = (jobs.jobs || []).find((j) => j.id && j.id === w.jobId) || null;
      const latest =
        listLogsByPattern(new RegExp(`^worker-${id}-.*\\.cot\\.log$`)).at(-1) ||
        listLogsByPattern(new RegExp(`^worker-${id}-.*\\.log$`))
          .filter((p) => isMixedWorkerLogName(path.basename(p)))
          .at(-1) ||
        null;
      let logMtime = null;
      let logBytes = 0;
      if (latest) {
        try {
          const st = fs.statSync(latest);
          logMtime = st.mtime.toISOString();
          logBytes = st.size;
        } catch {
          /* ignore */
        }
      }
      workers.push({
        id: String(id),
        stream: `worker-${id}`,
        label: id === 5 ? "W5 Recovery" : `W${id}`,
        status: w.status || "idle",
        jobId: w.jobId || null,
        slug: job?.slug || null,
        themeId: job?.themeId || null,
        activity: job?.activity || null,
        logFile: latest ? path.basename(latest) : null,
        logMtime,
        logBytes,
        live: w.status === "busy" && Boolean(w.pid),
      });
    }
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify(
        {
          at: new Date().toISOString(),
          streams: Object.keys(STREAMS).filter((k) => k === "cot" || k.startsWith("worker-")),
          workers,
        },
        null,
        2,
      ),
    );
    return;
  }

  if (req.method === "GET" && url.pathname.startsWith("/api/stream/")) {
    const streamKey = url.pathname.slice("/api/stream/".length);
    tailStream(res, streamKey);
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not found");
});

server.listen(PORT, HOST, () => {
  try {
    fs.mkdirSync(path.dirname(STREAM_PID_FILE), { recursive: true });
    fs.writeFileSync(STREAM_PID_FILE, `${process.pid}\n`, "utf8");
  } catch (err) {
    console.warn(`Could not write stream PID file: ${err.message}`);
  }
  console.log(`Production stream dashboard: http://${HOST}:${PORT}`);
  console.log(`Tailing logs in ${LOG_DIR}`);
  refreshShipTable();
  setInterval(() => refreshShipTable(), 5000);
});

function clearStreamPid() {
  try {
    const existing = readPidSafe(STREAM_PID_FILE);
    if (existing === process.pid) fs.unlinkSync(STREAM_PID_FILE);
  } catch {}
}
process.on("exit", clearStreamPid);
process.on("SIGINT", () => {
  clearStreamPid();
  process.exit(0);
});
process.on("SIGTERM", () => {
  clearStreamPid();
  process.exit(0);
});
