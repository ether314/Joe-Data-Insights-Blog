#!/usr/bin/env node
/**
 * Deploy the static `out/` export to Firebase Hosting.
 * Retries on failure; forces IPv4-first DNS so large file uploads avoid
 * stalled IPv6 paths (small requests succeed but big POSTs hang).
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "out");

if (!fs.existsSync(outDir)) {
  console.error("Missing out/ — run npm run build first.");
  process.exit(1);
}

const maxAttempts = 3;
let status = 1;
for (let attempt = 1; attempt <= maxAttempts; attempt++) {
  const env = { ...process.env };
  const extra = ["--dns-result-order=ipv4first"];
  if (env.NODE_OPTIONS) {
    if (!env.NODE_OPTIONS.includes("--dns-result-order")) {
      env.NODE_OPTIONS = `${env.NODE_OPTIONS} ${extra.join(" ")}`;
    }
  } else {
    env.NODE_OPTIONS = extra.join(" ");
  }
  console.log(`[deploy] hosting publish attempt ${attempt}/${maxAttempts}`);
  const result = spawnSync(
    "npx",
    ["firebase-tools@latest", "deploy", "--only", "hosting", "--non-interactive"],
    {
      cwd: root,
      stdio: "inherit",
      shell: true,
      env,
    },
  );
  status = result.status ?? 1;
  if (status === 0) break;
  if (attempt < maxAttempts) {
    const delayMs = 15_000 * attempt;
    console.log(`[deploy] attempt ${attempt} failed (exit ${status}) - retrying in ${delayMs / 1000}s`);
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, delayMs);
  }
}

process.exit(status);
