/**
 * Drain-only / backlog-only conveyor mode.
 *
 * When set, claimer must not mint unused named candidates, {theme}-research-*
 * topics, wishlist rows, or spawn novel-theme refill. Operator retries of
 * parked infra jobs and the existing pipeline still run.
 *
 * Honored via any of:
 *   --backlog-only
 *   BLOG_CLAIM_BACKLOG_ONLY=1
 *   artifacts/blog-drain-only.flag
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = path.resolve(
  process.env.BLOG_REPO_ROOT || path.resolve(__dirname, "../.."),
);
export const DRAIN_FLAG_FILE = path.join(
  REPO_ROOT,
  "artifacts",
  "blog-drain-only.flag",
);

function truthyEnv(value) {
  const v = String(value || "").trim().toLowerCase();
  return v === "1" || v === "true" || v === "yes";
}

export function envSaysDrain(env = process.env) {
  return truthyEnv(env.BLOG_CLAIM_BACKLOG_ONLY);
}

export function drainFlagPresent() {
  try {
    return fs.existsSync(DRAIN_FLAG_FILE);
  } catch {
    return false;
  }
}

export function isDrainOnly(argv = process.argv.slice(2), env = process.env) {
  if ((argv || []).includes("--backlog-only")) return true;
  if (envSaysDrain(env)) return true;
  return drainFlagPresent();
}

export function writeDrainFlag(reason = "backlog-only") {
  fs.mkdirSync(path.dirname(DRAIN_FLAG_FILE), { recursive: true });
  const payload = {
    drainOnly: true,
    backlogOnly: true,
    reason,
    setAt: new Date().toISOString(),
  };
  fs.writeFileSync(DRAIN_FLAG_FILE, `${JSON.stringify(payload, null, 2)}\n`);
  return DRAIN_FLAG_FILE;
}

export function clearDrainFlag() {
  try {
    fs.unlinkSync(DRAIN_FLAG_FILE);
    return true;
  } catch {
    return false;
  }
}
