/**
 * Shared paths for Docker-isolated blog workers.
 * Default clones live under %LOCALAPPDATA% so Docker Desktop can bind-mount
 * them without depending on the main E: checkout.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const LAYOUT_REPO_ROOT = path.resolve(
  process.env.BLOG_REPO_ROOT || path.resolve(__dirname, "../.."),
);

export const WORKER_SLOT_IDS = [1, 2, 3, 4, 5];
export const WORKER_COMPOSE_SERVICES = WORKER_SLOT_IDS.map((id) => `worker-${id}`);

export function defaultWorkerRoot() {
  const override = String(process.env.BLOG_WORKTREE_ROOT || "").trim();
  if (override) return path.resolve(override);
  const local = process.env.LOCALAPPDATA || process.env.HOME || os.homedir();
  if (local) return path.join(local, "data-insights-blog-workers");
  return path.resolve(LAYOUT_REPO_ROOT, "..", "data-insights-blog-workers");
}

export function workerClonePath(workerId, root = defaultWorkerRoot()) {
  return path.join(root, `worker-${workerId}`);
}

export function workerContainerName(workerId) {
  return `blog-worker-${workerId}`;
}

export function toDockerBindPath(winPath) {
  return String(winPath || "")
    .replace(/\\/g, "/")
    .replace(/\/+$/, "");
}

/** Independent git clone (own .git dir) vs a linked git worktree (.git file). */
export function isIndependentClone(dir) {
  if (!dir) return false;
  try {
    return fs.statSync(path.join(dir, ".git")).isDirectory();
  } catch {
    return false;
  }
}

export function mainBranchName(repoRoot = LAYOUT_REPO_ROOT) {
  try {
    const raw = fs.readFileSync(path.join(repoRoot, ".git", "HEAD"), "utf8");
    const m = raw.match(/^ref:\s*refs\/heads\/(\S+)/);
    if (m) return m[1];
  } catch {
    /* fall through */
  }
  return "master";
}

/** Process-local git env: GitHub Desktop git on PATH + safe.directory (no git config writes). */
export function gitSpawnEnv(base = process.env) {
  const env = { ...base };
  const dirs = [];
  const local = process.env.LOCALAPPDATA;
  if (local) {
    const gd = path.join(local, "GitHubDesktop");
    try {
      const apps = fs
        .readdirSync(gd)
        .filter((n) => n.startsWith("app-"))
        .sort()
        .reverse();
      for (const a of apps) {
        dirs.push(path.join(gd, a, "resources", "app", "git", "cmd"));
      }
    } catch {
      /* ignore */
    }
  }
  dirs.push("C:\\Program Files\\Git\\cmd", "C:\\Program Files (x86)\\Git\\cmd");
  const found = dirs.filter((d) => fs.existsSync(path.join(d, "git.exe")));
  if (found.length) {
    env.PATH = `${found.join(path.delimiter)}${path.delimiter}${env.PATH || ""}`;
  }
  if (!env.GIT_CONFIG_COUNT) {
    env.GIT_CONFIG_COUNT = "1";
    env.GIT_CONFIG_KEY_0 = "safe.directory";
    env.GIT_CONFIG_VALUE_0 = "*";
  }
  return env;
}
