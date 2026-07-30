/**
 * Cross-agent lock for cron blog-post generation.
 * Lock state lives in artifacts/blog-post-generation.lock.json and is
 * published via git so overlapping Cloud Agent runs can skip safely.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = path.resolve(__dirname, "../..");
export const LOCK_PATH = path.join(
  REPO_ROOT,
  "artifacts/blog-post-generation.lock.json",
);

const DEFAULT_TTL_MS = 2 * 60 * 60 * 1000; // 2 hours

export function lockTtlMs() {
  const raw = process.env.BLOG_GEN_LOCK_TTL_MS;
  if (!raw) return DEFAULT_TTL_MS;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_TTL_MS;
}

export function readLock() {
  try {
    const raw = fs.readFileSync(LOCK_PATH, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    if (err && err.code === "ENOENT") return null;
    throw err;
  }
}

export function isLockActive(lock, now = Date.now()) {
  if (!lock || lock.status !== "active") return false;
  const expiresAt = Date.parse(lock.expiresAt ?? "");
  if (!Number.isFinite(expiresAt)) return true;
  return now < expiresAt;
}

export function describeLock(lock) {
  if (!lock) return "no lock file";
  const active = isLockActive(lock);
  return [
    `status=${lock.status ?? "unknown"}`,
    `active=${active}`,
    lock.runId ? `runId=${lock.runId}` : null,
    lock.acquiredAt ? `acquiredAt=${lock.acquiredAt}` : null,
    lock.expiresAt ? `expiresAt=${lock.expiresAt}` : null,
    lock.branch ? `branch=${lock.branch}` : null,
  ]
    .filter(Boolean)
    .join(" ");
}

function git(cmd, { allowFailure = false } = {}) {
  try {
    return execSync(cmd, {
      cwd: REPO_ROOT,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }).trim();
  } catch (err) {
    if (allowFailure) return null;
    const stderr = err.stderr?.toString?.() ?? "";
    throw new Error(`git command failed: ${cmd}\n${stderr}`);
  }
}

export function syncLockFromRemote() {
  git("git fetch origin", { allowFailure: true });
  const branch = git("git rev-parse --abbrev-ref HEAD", { allowFailure: true });
  if (branch) {
    git(`git pull --rebase origin ${branch}`, { allowFailure: true });
  }
}

function currentBranch() {
  return (
    process.env.CURSOR_AGENT_BRANCH_NAME ??
    git("git rev-parse --abbrev-ref HEAD", { allowFailure: true }) ??
    "unknown"
  );
}

function currentRunId() {
  return (
    process.env.CURSOR_AGENT_BC_ID ??
    process.env.CURSOR_CLOUD_AGENT_BC_ID ??
    `pid-${process.pid}`
  );
}

export function buildLockRecord(overrides = {}) {
  const acquiredAt = new Date();
  const expiresAt = new Date(acquiredAt.getTime() + lockTtlMs());
  return {
    status: "active",
    acquiredAt: acquiredAt.toISOString(),
    expiresAt: expiresAt.toISOString(),
    runId: currentRunId(),
    pid: process.pid,
    host: os.hostname(),
    branch: currentBranch(),
    automationId: process.env.CURSOR_AUTOMATION_ID ?? null,
    ...overrides,
  };
}

export function writeLock(record) {
  fs.mkdirSync(path.dirname(LOCK_PATH), { recursive: true });
  fs.writeFileSync(LOCK_PATH, `${JSON.stringify(record, null, 2)}\n`, "utf8");
}

export function removeLockFile() {
  try {
    fs.unlinkSync(LOCK_PATH);
  } catch (err) {
    if (err && err.code === "ENOENT") return;
    throw err;
  }
}

export function publishLockState(message) {
  if (fs.existsSync(LOCK_PATH)) {
    git("git add artifacts/blog-post-generation.lock.json");
  } else {
    git("git rm -f artifacts/blog-post-generation.lock.json", {
      allowFailure: true,
    });
    git("git add -u artifacts/blog-post-generation.lock.json", {
      allowFailure: true,
    });
  }
  const status = git("git status --porcelain artifacts/blog-post-generation.lock.json", {
    allowFailure: true,
  });
  if (!status) return false;
  const safeMessage = message.replace(/"/g, '\\"');
  git(`git commit -m "${safeMessage}"`);
  git("git push -u origin HEAD");
  return true;
}

/**
 * Read remote lock, skip when another run holds it, otherwise acquire + publish.
 * Returns { acquired: boolean, lock, reason? }.
 */
export function tryAcquireLock({ syncRemote = true } = {}) {
  if (syncRemote) syncLockFromRemote();

  const existing = readLock();
  if (isLockActive(existing)) {
    return {
      acquired: false,
      lock: existing,
      reason: "active",
    };
  }

  const record = buildLockRecord();
  writeLock(record);

  try {
    publishLockState("chore: acquire blog post generation lock");
  } catch (err) {
    removeLockFile();
    throw err;
  }

  return { acquired: true, lock: record };
}

export function releaseLock({ syncRemote = false, publish = true } = {}) {
  const lock = readLock();
  removeLockFile();

  if (publish) {
    try {
      if (syncRemote) syncLockFromRemote();
      publishLockState("chore: release blog post generation lock");
    } catch (err) {
      console.warn(
        `[blog-post-generation-lock] release publish failed: ${err.message}`,
      );
    }
  }

  return lock;
}

let releaseHookInstalled = false;

export function installReleaseOnStop() {
  if (releaseHookInstalled) return;
  releaseHookInstalled = true;

  const onStop = (signal) => {
    try {
      releaseLock({ publish: true });
      console.log(
        `[blog-post-generation-lock] released on ${signal ?? "exit"}`,
      );
    } catch (err) {
      console.warn(
        `[blog-post-generation-lock] release on stop failed: ${err.message}`,
      );
    }
  };

  process.once("SIGINT", () => {
    onStop("SIGINT");
    process.exit(130);
  });
  process.once("SIGTERM", () => {
    onStop("SIGTERM");
    process.exit(143);
  });
}
