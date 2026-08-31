/**
 * Spawn the novel-theme refill agent once when the claimer is out of
 * unused named candidates. Shared pid + cooldown so the orchestrator's
 * 5s idle poll cannot fork a fleet of agents.
 *
 * LOCAL-ONLY: no Firebase, no git push, no docker compose down.
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = path.resolve(__dirname, "../..");
export const REFILL_PID_FILE = path.join(REPO_ROOT, "artifacts", "novel-theme-refill.pid");
export const REFILL_STAMP_FILE = path.join(REPO_ROOT, "artifacts", "novel-theme-refill.stamp.json");
export const REFILL_LOG = path.join(REPO_ROOT, "artifacts", "automation-logs", "novel-theme-refill.log");
export const LOCK_FILE = path.join(REPO_ROOT, "artifacts", "blog-production-lock.json");
export const REFILL_COOLDOWN_MS = Number(process.env.BLOG_NOVEL_REFILL_COOLDOWN_MS || 15 * 60 * 1000);
const WATCH_SCRIPT = path.join(REPO_ROOT, "scripts", "watch-blog-idle-hourly.ps1");

function logLine(message) {
  const line = `[${new Date().toISOString()}] ${message}\n`;
  try {
    fs.mkdirSync(path.dirname(REFILL_LOG), { recursive: true });
    fs.appendFileSync(REFILL_LOG, line);
  } catch {
    /* observability only */
  }
}

function readJson(file) {
  try {
    const raw = fs.readFileSync(file, "utf8").replace(/^\uFEFF/, "");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function pidAlive(pid) {
  const n = Number(pid);
  if (!Number.isInteger(n) || n <= 0) return false;
  try {
    process.kill(n, 0);
    return true;
  } catch {
    return false;
  }
}

function readPidFile() {
  try {
    const raw = fs.readFileSync(REFILL_PID_FILE, "utf8").trim();
    const n = Number(raw.split(/\s+/)[0]);
    return Number.isInteger(n) ? n : 0;
  } catch {
    return 0;
  }
}

function lockIsPaused() {
  const lock = readJson(LOCK_FILE);
  return lock && String(lock.status || "") === "paused";
}

function withinCooldown() {
  const stamp = readJson(REFILL_STAMP_FILE);
  const last = Date.parse(stamp?.lastSpawnAt || "");
  if (!Number.isFinite(last)) return false;
  return Date.now() - last < REFILL_COOLDOWN_MS;
}

function writeStamp(extra) {
  const prev = readJson(REFILL_STAMP_FILE) || {};
  const next = {
    ...prev,
    ...extra,
    updatedAt: new Date().toISOString(),
  };
  try {
    fs.mkdirSync(path.dirname(REFILL_STAMP_FILE), { recursive: true });
    fs.writeFileSync(REFILL_STAMP_FILE, `${JSON.stringify(next, null, 2)}\n`);
  } catch {
    /* observability only */
  }
}

/**
 * @param {{ source?: string, dryRun?: boolean }} [opts]
 * @returns {{ skipped?: string, spawned?: boolean, pid?: number }}
 */
export function spawnNovelThemeRefill(opts = {}) {
  const source = opts.source || "unknown";
  try {
    if (opts.dryRun) {
      return { skipped: "dry-run" };
    }
    if (process.platform !== "win32") {
      logLine(`skip source=${source}: not windows`);
      return { skipped: "not-windows" };
    }
    if (lockIsPaused()) {
      logLine(`skip source=${source}: lock paused`);
      return { skipped: "paused" };
    }
    const existing = readPidFile();
    if (pidAlive(existing)) {
      logLine(`skip source=${source}: refill already running pid=${existing}`);
      return { skipped: "already-running", pid: existing };
    }
    if (existing) {
      try {
        fs.unlinkSync(REFILL_PID_FILE);
      } catch {
        /* stale pid */
      }
    }
    if (withinCooldown()) {
      logLine(`skip source=${source}: cooldown ${REFILL_COOLDOWN_MS}ms`);
      return { skipped: "cooldown" };
    }
    if (!fs.existsSync(WATCH_SCRIPT)) {
      logLine(`skip source=${source}: missing ${WATCH_SCRIPT}`);
      return { skipped: "script-missing" };
    }

    const psExe = path.join(
      process.env.SystemRoot || "C:\\Windows",
      "System32",
      "WindowsPowerShell",
      "v1.0",
      "powershell.exe",
    );
    const args = [
      "-NoProfile",
      "-ExecutionPolicy",
      "Bypass",
      "-WindowStyle",
      "Hidden",
      "-File",
      WATCH_SCRIPT,
      "-SpawnAgent",
    ];
    const child = spawn(psExe, args, {
      cwd: REPO_ROOT,
      detached: true,
      stdio: "ignore",
      windowsHide: true,
      env: process.env,
    });
    const pid = child.pid || 0;
    child.unref();
    if (pid > 0) {
      fs.mkdirSync(path.dirname(REFILL_PID_FILE), { recursive: true });
      fs.writeFileSync(REFILL_PID_FILE, `${pid}\n`);
    }
    writeStamp({
      lastSpawnAt: new Date().toISOString(),
      source,
      pid,
    });
    logLine(`spawned source=${source} pid=${pid} (hidden powershell -SpawnAgent)`);
    return { spawned: true, pid };
  } catch (err) {
    const msg = err && err.message ? err.message : String(err);
    logLine(`ERROR source=${source}: ${msg}`);
    return { skipped: "error", error: msg };
  }
}
