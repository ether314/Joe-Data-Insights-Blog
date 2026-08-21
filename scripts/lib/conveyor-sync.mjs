#!/usr/bin/env node
/**
 * Orchestrator bless/pause/sync gate.
 *
 *   node scripts/lib/conveyor-sync.mjs --set-phase pausing --job <id> --exclude 3
 *   node scripts/lib/conveyor-sync.mjs --set-phase idle
 *   node scripts/lib/conveyor-sync.mjs --wait-idle --timeout 180
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { REPO_ROOT } from "./agent-jobs.mjs";

export const SYNC_FILE = path.join(REPO_ROOT, "artifacts", "conveyor-sync.json");
export const PAUSE_PHASES = new Set(["pausing", "merging", "syncing"]);

export function emptySync() {
  return {
    version: 1,
    phase: "idle",
    generation: 0,
    blessedJobId: null,
    blessedSlug: null,
    blessedBranch: null,
    excludeWorkerId: null,
    pausedAt: null,
    mergedAt: null,
    syncedAt: null,
    notes: null,
    acks: {},
  };
}

export function readSync() {
  try {
    const raw = fs.readFileSync(SYNC_FILE, "utf8").replace(/^\uFEFF/, "");
    const data = JSON.parse(raw);
    return { ...emptySync(), ...data };
  } catch {
    return emptySync();
  }
}

export function writeSync(patch) {
  const prev = readSync();
  const next = { ...prev, ...patch, updatedAt: new Date().toISOString() };
  if (patch.phase && patch.phase !== prev.phase) {
    next.generation = (Number(prev.generation) || 0) + 1;
  }
  fs.mkdirSync(path.dirname(SYNC_FILE), { recursive: true });
  const tmp = `${SYNC_FILE}.tmp`;
  fs.writeFileSync(tmp, `${JSON.stringify(next, null, 2)}\n`);
  fs.renameSync(tmp, SYNC_FILE);
  return next;
}

export function isPausePhase(sync = readSync()) {
  return PAUSE_PHASES.has(String(sync?.phase || "idle"));
}

export function ackPause(workerId) {
  const sync = readSync();
  const acks = { ...(sync.acks || {}) };
  acks[String(workerId)] = {
    status: "paused",
    at: new Date().toISOString(),
  };
  return writeSync({ acks });
}

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

function sleep(ms) {
  const start = Date.now();
  while (Date.now() - start < ms) {
    /* spin */
  }
}

const isMain =
  Boolean(process.argv[1]) &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  const args = parseArgs(process.argv.slice(2));
  if (args["wait-idle"]) {
    const timeout = Number(args.timeout || 180);
    const start = Date.now();
    while ((Date.now() - start) / 1000 < timeout) {
      const s = readSync();
      if (!isPausePhase(s)) {
        console.log(JSON.stringify({ ok: true, phase: s.phase }));
        process.exit(0);
      }
      sleep(1000);
    }
    console.log(JSON.stringify({ ok: false, error: "timeout", phase: readSync().phase }));
    process.exit(2);
  }

  if (args.ack) {
    const next = ackPause(args.ack);
    console.log(JSON.stringify({ ok: true, acks: next.acks }));
    process.exit(0);
  }

  if (args["set-phase"]) {
    const phase = String(args["set-phase"]);
    const now = new Date().toISOString();
    const patch = {
      phase,
      notes: args.notes || null,
    };
    if (args.job && args.job !== true) patch.blessedJobId = String(args.job);
    if (args.slug && args.slug !== true) patch.blessedSlug = String(args.slug);
    if (args.branch && args.branch !== true) patch.blessedBranch = String(args.branch);
    if (args.exclude != null && args.exclude !== true) {
      patch.excludeWorkerId = String(args.exclude);
    }
    if (phase === "pausing") {
      patch.pausedAt = now;
      patch.acks = {};
      patch.mergedAt = null;
      patch.syncedAt = null;
    }
    if (phase === "merging") patch.mergedAt = now;
    if (phase === "syncing") patch.syncedAt = now;
    if (phase === "idle") {
      patch.blessedJobId = null;
      patch.blessedSlug = null;
      patch.blessedBranch = null;
      patch.excludeWorkerId = null;
      patch.acks = {};
      patch.notes = args.notes || "idle";
    }
    const next = writeSync(patch);
    console.log(JSON.stringify({ ok: true, phase: next.phase, generation: next.generation }));
    process.exit(0);
  }

  console.log(JSON.stringify(readSync(), null, 2));
}
