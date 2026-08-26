#!/usr/bin/env node
/**
 * Custom Firebase Hosting publisher — sequential-ish uploads with bounded
 * concurrency, working around firebase-tools' unbounded connect fan-out
 * (ConnectTimeoutError under this network's DPI throttling).
 *
 * Usage: node scripts/deploy-hosting-rest.mjs [--site ether-data-insights-blog] [--dir out] [--message "text"]
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import os from "node:os";
import zlib from "node:zlib";
import { spawnSync } from "node:child_process";

const args = process.argv.slice(2);
function argOf(name, def) {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : def;
}
const SITE = argOf("--site", "ether-data-insights-blog");
const OUT_DIR = path.resolve(argOf("--dir", "out"));
const MESSAGE = argOf("--message", "rest deploy");

if (!fs.existsSync(path.join(OUT_DIR, "index.html"))) {
  console.error(`Missing build in ${OUT_DIR}`);
  process.exit(1);
}

// ---- auth: reuse firebase-tools stored refresh token -----------------------
function readRefreshToken() {
  const candidates = [
    path.join(os.homedir(), ".config", "configstore", "firebase-tools.json"),
    path.join(process.env.LOCALAPPDATA || path.join(os.homedir(), "AppData", "Local"), "configstore", "firebase-tools.json"),
    path.join(os.homedir(), ".firebase", "firebase-tools.json"),
  ];
  for (const p of candidates) {
    if (!fs.existsSync(p)) continue;
    const j = JSON.parse(fs.readFileSync(p, "utf8"));
    const t = j?.user?.tokens ?? j?.tokens ?? j;
    if (t?.refresh_token) return t.refresh_token;
    if (typeof t?.refreshToken === "string") return t.refreshToken;
  }
  return null;
}

let ACCESS_TOKEN = null;
async function withRetry(fn, label, maxAttempts = 10) {
  for (let i = 1; i <= maxAttempts; i++) {
    try {
      return await fn();
    } catch (e) {
      if (i === maxAttempts) throw e;
      const delay = Math.min(30000, 2000 * i * i);
      console.log(`[rest-deploy] ${label} attempt ${i} failed (${String(e.cause?.code || e.message).slice(0, 80)}); retry in ${delay / 1000}s`);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
}

async function accessToken() {
  if (ACCESS_TOKEN) return ACCESS_TOKEN;
  const rt = readRefreshToken();
  if (!rt) throw new Error("no firebase-tools refresh token found");
  ACCESS_TOKEN = await withRetry(async () => {
    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: "563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com",
        client_secret: "j9iVZfS8kkCEFUPaAeJV0sAi",
        refresh_token: rt,
        grant_type: "refresh_token",
      }),
    });
    const j = await res.json();
    if (!j.access_token) throw new Error(`token exchange failed: ${JSON.stringify(j).slice(0, 200)}`);
    return j.access_token;
  }, "token");
  return ACCESS_TOKEN;
}

async function api(url, opts = {}) {
  return withRetry(async () => {
    const tok = await accessToken();
    const res = await fetch(url, {
      ...opts,
      headers: { Authorization: `Bearer ${tok}`, ...(opts.headers || {}) },
    });
    const text = await res.text();
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}: ${text.slice(0, 300)}`);
    return text ? JSON.parse(text) : {};
  }, `api ${url.split("/").pop()}`);
}

// ---- collect files + hosting hash ------------------------------------------
function walk(dir, base = "") {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, e.name);
    const rel = path.posix.join(base, e.name.replace(/\\/g, "/"));
    if (e.isDirectory()) out.push(...walk(abs, rel));
    else if (e.isFile()) out.push({ rel, abs });
  }
  return out;
}
function hostingHash(gz) {
  return crypto.createHash("sha256").update(gz).digest("hex");
}

console.log("[rest-deploy] hashing (gzip level 9) files…");
const files = walk(OUT_DIR)
  .filter((f) => !f.rel.includes("$"))
  .map((f) => {
    const buf = fs.readFileSync(f.abs);
    const gz = zlib.gzipSync(buf, { level: 9 });
    return { ...f, gz, hash: hostingHash(gz) };
  });
console.log(`[rest-deploy] ${files.length} files`);

// ---- create version ---------------------------------------------------------
const version = await api(
  `https://firebasehosting.googleapis.com/v1beta1/sites/${SITE}/versions`,
  { method: "POST", body: JSON.stringify({ status: "CREATED" }) },
);
const versionName = version.name;
console.log(`[rest-deploy] version: ${versionName}`);

// ---- populate ----------------------------------------------------------------
const fileMap = {};
for (const f of files) fileMap[f.rel] = f.hash;
const pop = await api(`https://firebasehosting.googleapis.com/v1beta1/${versionName}:populateFiles`, {
  method: "POST",
  body: JSON.stringify({ files: Object.fromEntries(files.map((f) => [`/${f.rel}`, f.hash])) }),
});
const needed = new Set(pop.uploadRequiredHashes || []);
console.log(`[rest-deploy] ${needed.size} uploads required (${files.length - needed.size} already cached)`);

// ---- uploads with bounded concurrency ----------------------------------------
class Limiter {
  constructor(n) { this.n = n; this.q = []; this.run = 0; }
  async add(fn) {
    if (this.run >= this.n) await new Promise((r) => this.q.push(r));
    this.run++;
    try { return await fn(); } finally {
      this.run--;
      this.q.shift()?.();
    }
  }
}
const limiter = new Limiter(4);
let done = 0, failed = 0;
const byHash = new Map(files.map((f) => [f.hash, f]));

async function uploadOne(hash, attempt = 1) {
  const f = byHash.get(hash);
  const t0 = Date.now();
  try {
    const res = await fetch(`${pop.uploadUrl}/${encodeURIComponent(hash)}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${await accessToken()}`, "Content-Type": "application/octet-stream" },
      body: f.gz,
      signal: AbortSignal.timeout(120000),
    });
    if (!res.ok) throw new Error(`${res.status}: ${(await res.text()).slice(0, 150)}`);
    done++;
    if (done % 25 === 0 || done === needed.size)
      console.log(`[rest-deploy] uploaded ${done}/${needed.size} (+${((Date.now() - t0) / 1000).toFixed(1)}s)`);
  } catch (e) {
    if (attempt <= 120) {
      if (attempt % 5 === 0)
        console.log(`[rest-deploy] ${f.rel} retry ${attempt}/120 (${String(e.cause?.code || e.message).slice(0, 60)})`);
      await new Promise((r) => setTimeout(r, Math.min(30000, 1000 * attempt)));
      return uploadOne(hash, attempt + 1);
    }
    failed++;
    console.error(`[rest-deploy] FAILED ${f.rel}: ${String(e.cause?.code || e.message).slice(0, 120)}`);
  }
}
setInterval(() => {
  if (done < needed.size)
    console.log(`[heartbeat] ${done}/${needed.size} uploaded, ${Math.min(4, needed.size - done)} in flight`);
}, 60000).unref();
await Promise.all([...needed].map((h) => limiter.add(() => uploadOne(h))));
if (failed > 0) {
  console.error(`[rest-deploy] aborting release: ${failed} uploads failed`);
  process.exit(2);
}

// ---- finalize (with firebase.json hosting behavior) ----------------------------
const versionId = versionName.split("/").pop();
const fin = await api(
  `https://firebasehosting.googleapis.com/v1beta1/projects/-/sites/${SITE}/versions/${versionId}?updateMask=status,config`,
  {
    method: "PATCH",
    body: JSON.stringify({
      status: "FINALIZED",
      config: {
        cleanUrls: true,
        trailingSlashBehavior: "REMOVE",
        redirects: [
          { statusCode: 301, glob: "/politics/global-refugee-hosting-burden-2024", location: "/blog/global-refugee-hosting-burden-2024" },
          { statusCode: 301, glob: "/technology/ai-gpu-packaging-memory-bottleneck-2025", location: "/blog/ai-gpu-packaging-memory-bottleneck-2025" },
          { statusCode: 301, glob: "/technology/major-ai-brands-token-consumption-2022-2026", location: "/blog/major-ai-brands-token-consumption-2022-2026" },
          { statusCode: 301, glob: "/economics/deflationary-growth-economies-2025", location: "/blog/deflationary-growth-economies-2025" },
        ],
      },
    }),
  },
);
console.log(`[rest-deploy] version finalized`);

// ---- release to live channel ----------------------------------------------------
const relRes = await fetch(
  `https://firebasehosting.googleapis.com/v1beta1/projects/-/sites/${SITE}/channels/live/releases?versionName=${encodeURIComponent(versionName)}`,
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${await accessToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: MESSAGE }),
  },
);
if (!relRes.ok) {
  console.error(`[rest-deploy] release failed: ${relRes.status} ${(await relRes.text()).slice(0, 300)}`);
  process.exit(3);
}
const rel = await relRes.json();
console.log(`[rest-deploy] LIVE: https://${SITE}.web.app  (release ${rel.name})`);
