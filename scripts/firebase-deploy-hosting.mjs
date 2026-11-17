#!/usr/bin/env node
/**
 * Resilient Firebase Hosting publisher (REST, not a full CLI re-run).
 *
 * Why this exists: `firebase deploy --only hosting` fans out many parallel
 * uploads to upload-firebasehosting.googleapis.com. On flaky links
 * (MTU/tether/VPN / Happy Eyeballs IPv6 stall) that queue hangs at 0–2%
 * and the CLI retries the whole version. Hosting already stores uploaded
 * gzip+sha256 blobs, so we:
 *   1. populateFiles in 1000-file chunks
 *   2. upload only unmatched hashes
 *   3. small batches, low concurrency (default 2)
 *   4. per-file timeout + retry (never restart the version for one timeout)
 *   5. small HTML/JSON/JS first, images last
 *   6. IPv4-first DNS; IPv4-only sockets for the upload host
 *
 * Extra (not required): if large POSTs still black-hole, lower the NIC MTU
 * (e.g. netsh interface ipv4 set subinterface "Wi-Fi" mtu=1400).
 *
 * Env:
 *   FIREBASE_HOSTING_UPLOAD_CONCURRENCY  default 2  (1–3 recommended)
 *   FIREBASE_HOSTING_UPLOAD_BATCH        default 8
 *   FIREBASE_HOSTING_UPLOAD_RETRIES      default 8 per file
 *   HTTP_TIMEOUT                         hard cap ms per file (optional)
 *   FIREBASE_TOKEN                        CLI refresh token override
 *
 * Usage: node --dns-result-order=ipv4first scripts/firebase-deploy-hosting.mjs
 *        node ... --cli     (fallback: firebase-tools with concurrency=1)
 */
import { spawnSync } from "node:child_process";
import crypto from "node:crypto";
import dns from "node:dns";
import fs from "node:fs";
import https from "node:https";
import net from "node:net";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import zlib from "node:zlib";

dns.setDefaultResultOrder("ipv4first");
if (typeof net.setDefaultAutoSelectFamily === "function") {
  net.setDefaultAutoSelectFamily(false);
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const useCli = args.includes("--cli");
const SITE =
  argOf("--site") ||
  JSON.parse(fs.readFileSync(path.join(root, ".firebaserc"), "utf8")).projects?.default ||
  "ether-data-insights-blog";
const firebaseJson = JSON.parse(fs.readFileSync(path.join(root, "firebase.json"), "utf8"));
const publicDirName = firebaseJson.hosting?.public || "out";
const OUT_DIR = path.resolve(root, argOf("--dir") || publicDirName);
const MESSAGE =
  argOf("--message") ||
  process.env.FIREBASE_DEPLOY_MESSAGE ||
  `chunked rest deploy ${new Date().toISOString()}`;

const CONCURRENCY = clampInt(process.env.FIREBASE_HOSTING_UPLOAD_CONCURRENCY, 2, 1, 8);
const BATCH_SIZE = clampInt(process.env.FIREBASE_HOSTING_UPLOAD_BATCH, 8, 1, 50);
const FILE_RETRIES = clampInt(process.env.FIREBASE_HOSTING_UPLOAD_RETRIES, 8, 1, 40);
const POPULATE_BATCH = 1000;
const GZIP_LEVEL = 9;
const MIN_TIMEOUT_MS = 90_000;
const MAX_TIMEOUT_MS = 10 * 60_000;
const API_ORIGIN = "https://firebasehosting.googleapis.com/v1beta1";
const FIREBASE_CLI_OAUTH = {
  // Public firebase-tools CLI OAuth client (same as the official CLI).
  client_id: "563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com",
  client_secret: "j9iVZfS8kkCEFUPaAeJV0sAi",
};

const SMALL_EXT = new Set([
  ".html",
  ".htm",
  ".json",
  ".txt",
  ".xml",
  ".css",
  ".js",
  ".mjs",
  ".cjs",
  ".map",
  ".svg",
  ".ico",
  ".webmanifest",
  ".woff",
  ".woff2",
]);
const IMAGE_EXT = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".avif", ".bmp"]);

const uploadAgent = new https.Agent({
  keepAlive: false,
  maxSockets: Math.max(CONCURRENCY, 2),
  family: 4,
  timeout: 30_000,
});

let cachedToken = "";
let tokenExpiresAt = 0;

function argOf(name) {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : "";
}

function clampInt(raw, fallback, min, max) {
  const n = Number.parseInt(String(raw ?? ""), 10);
  if (!Number.isFinite(n) || n < min) return fallback;
  return Math.min(max, n);
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function isIgnored(rel, patterns) {
  const p = rel.replace(/\\/g, "/");
  const segs = p.split("/");
  for (const pat of patterns) {
    if (pat === "**/.*" || pat === ".*") {
      if (segs.some((s) => s.startsWith("."))) return true;
      continue;
    }
    if (pat === "**/node_modules/**" || pat === "node_modules/**") {
      if (segs.includes("node_modules")) return true;
      continue;
    }
    if (pat === "firebase.json" && (p === "firebase.json" || p.endsWith("/firebase.json"))) {
      return true;
    }
    if (matchGlob(p, pat)) return true;
  }
  return false;
}

function matchGlob(rel, glob) {
  const g = String(glob).replace(/\\/g, "/");
  if (g === rel) return true;
  let re = "";
  for (let i = 0; i < g.length; i++) {
    const c = g[i];
    if (c === "*" && g[i + 1] === "*") {
      re += ".*";
      i++;
      if (g[i + 1] === "/") i++;
    } else if (c === "*") re += "[^/]*";
    else if (c === "?") re += "[^/]";
    else if ("\\^$+{}()|[]".includes(c)) re += `\\${c}`;
    else re += c;
  }
  return new RegExp(`^${re}$`).test(rel);
}

function walkFiles(dir, base = "") {
  const out = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, ent.name);
    const rel = base ? `${base}/${ent.name}` : ent.name;
    if (ent.isDirectory()) out.push(...walkFiles(abs, rel));
    else if (ent.isFile()) out.push({ rel: rel.replace(/\\/g, "/"), abs });
  }
  return out;
}

function servingConfig(hosting) {
  const config = {};
  if (hosting.cleanUrls) config.cleanUrls = true;
  if (hosting.trailingSlash === false) config.trailingSlashBehavior = "REMOVE";
  else if (hosting.trailingSlash === true) config.trailingSlashBehavior = "ADD";
  if (hosting.appAssociation) config.appAssociation = hosting.appAssociation;
  if (Array.isArray(hosting.redirects) && hosting.redirects.length) {
    config.redirects = hosting.redirects.map((r) => {
      const rule = {
        statusCode: r.type || r.statusCode || 301,
        location: r.destination || r.location,
      };
      if (r.regex) rule.regex = r.regex;
      else rule.glob = r.source || r.glob;
      return rule;
    });
  }
  if (Array.isArray(hosting.rewrites) && hosting.rewrites.length) {
    config.rewrites = hosting.rewrites.map((r) => {
      const rule = {};
      if (r.regex) rule.regex = r.regex;
      else rule.glob = r.source || r.glob;
      if (r.destination) rule.path = r.destination;
      else if (r.function) rule.function = r.function;
      else if (r.run) rule.run = r.run;
      return rule;
    });
  }
  if (Array.isArray(hosting.headers) && hosting.headers.length) {
    config.headers = hosting.headers.map((h) => {
      const rule = { headers: Object.fromEntries((h.headers || []).map((x) => [x.key, x.value])) };
      if (h.regex) rule.regex = h.regex;
      else rule.glob = h.source || h.glob;
      return rule;
    });
  }
  return config;
}

function uploadPriority(rel) {
  const ext = path.posix.extname(rel).toLowerCase();
  if (SMALL_EXT.has(ext)) return 0;
  if (IMAGE_EXT.has(ext)) return 2;
  return 1;
}

function fileTimeoutMs(bytes) {
  const cap = Number.parseInt(process.env.HTTP_TIMEOUT || "", 10);
  const sized = Math.round((bytes / 1000) * 40) + MIN_TIMEOUT_MS; // 40s per MB + floor
  const computed = Math.min(MAX_TIMEOUT_MS, Math.max(MIN_TIMEOUT_MS, sized));
  return Number.isFinite(cap) && cap > 0 ? Math.min(cap, computed) : computed;
}

function gzipFile(abs) {
  const raw = fs.readFileSync(abs);
  const gz = zlib.gzipSync(raw, { level: GZIP_LEVEL });
  return {
    hash: crypto.createHash("sha256").update(gz).digest("hex"),
    size: raw.length,
    gzSize: gz.length,
    gz,
  };
}

async function mapPool(items, concurrency, fn) {
  let i = 0;
  const n = Math.max(1, Math.min(concurrency, items.length || 1));
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      await fn(items[idx], idx);
    }
  }
  await Promise.all(Array.from({ length: n }, () => worker()));
}

function readRefreshToken() {
  if (process.env.FIREBASE_TOKEN) return process.env.FIREBASE_TOKEN;
  const candidates = [
    path.join(os.homedir(), ".config", "configstore", "firebase-tools.json"),
    path.join(process.env.APPDATA || "", "configstore", "firebase-tools.json"),
    path.join(process.env.LOCALAPPDATA || "", "configstore", "firebase-tools.json"),
    path.join(os.homedir(), ".firebase", "firebase-tools.json"),
  ].filter(Boolean);
  for (const p of candidates) {
    if (!fs.existsSync(p)) continue;
    try {
      const j = JSON.parse(fs.readFileSync(p, "utf8"));
      const t = j?.tokens ?? j?.user?.tokens ?? j;
      if (typeof t?.refresh_token === "string") return t.refresh_token;
      if (typeof t?.refreshToken === "string") return t.refreshToken;
    } catch {
      /* skip unreadable store */
    }
  }
  return null;
}

async function accessToken(force = false) {
  if (!force && cachedToken && Date.now() < tokenExpiresAt - 60_000) return cachedToken;
  if (process.env.GOOGLE_ACCESS_TOKEN) {
    cachedToken = process.env.GOOGLE_ACCESS_TOKEN;
    tokenExpiresAt = Date.now() + 50 * 60_000;
    return cachedToken;
  }
  const rt = readRefreshToken();
  if (!rt) {
    throw new Error(
      "No Firebase credentials. Run `npx firebase-tools@latest login` or set FIREBASE_TOKEN.",
    );
  }
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      ...FIREBASE_CLI_OAUTH,
      refresh_token: rt,
      grant_type: "refresh_token",
    }),
    signal: AbortSignal.timeout(30_000),
  });
  const j = await res.json();
  if (!j.access_token) {
    throw new Error(`token exchange failed: ${JSON.stringify(j).slice(0, 240)}`);
  }
  cachedToken = j.access_token;
  tokenExpiresAt = Date.now() + Number(j.expires_in || 3600) * 1000;
  return cachedToken;
}

async function api(pathname, { method = "GET", body, label } = {}, attempt = 1) {
  const url = pathname.startsWith("http") ? pathname : `${API_ORIGIN}/${pathname.replace(/^\//, "")}`;
  const tok = await accessToken(attempt > 1 && attempt % 3 === 0);
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${tok}`,
      Accept: "application/json",
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(120_000),
  });
  const text = await res.text();
  if (res.status === 401 && attempt < 4) {
    cachedToken = "";
    tokenExpiresAt = 0;
    await sleep(1000);
    return api(pathname, { method, body, label }, attempt + 1);
  }
  if (!res.ok) {
    const err = new Error(`${res.status} ${res.statusText}: ${text.slice(0, 400)}`);
    if (attempt < 6 && (res.status >= 500 || res.status === 429)) {
      const delay = Math.min(30_000, 1500 * attempt * attempt);
      console.log(`[deploy] ${label || method} ${res.status}; retry in ${delay / 1000}s`);
      await sleep(delay);
      return api(pathname, { method, body, label }, attempt + 1);
    }
    throw err;
  }
  return text ? JSON.parse(text) : {};
}

function uploadGzip({ uploadUrl, hash, body, token, timeoutMs }) {
  return new Promise((resolve, reject) => {
    const base = uploadUrl.replace(/\/$/, "");
    const url = new URL(`${base}/${hash}`);
    let settled = false;
    const finish = (err, val) => {
      if (settled) return;
      settled = true;
      clearTimeout(hard);
      if (err) reject(err);
      else resolve(val);
    };
    const hard = setTimeout(() => {
      req.destroy(new Error(`upload hard timeout after ${timeoutMs}ms`));
    }, timeoutMs);
    const req = https.request(
      {
        protocol: url.protocol,
        hostname: url.hostname,
        port: url.port || 443,
        path: url.pathname + url.search,
        method: "POST",
        family: 4,
        agent: uploadAgent,
        timeout: timeoutMs,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/octet-stream",
          "Content-Length": body.length,
        },
      },
      (res) => {
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => {
          const text = Buffer.concat(chunks).toString("utf8");
          if (res.statusCode === 200) finish(null, text);
          else finish(new Error(`HTTP ${res.statusCode}: ${text.slice(0, 240)}`));
        });
      },
    );
    req.on("timeout", () => req.destroy(new Error(`socket timeout after ${timeoutMs}ms`)));
    req.on("error", (err) => finish(err));
    req.write(body);
    req.end();
  });
}

async function uploadOne(uploadUrl, file, attempt) {
  const timeoutMs = fileTimeoutMs(file.gzSize || file.size);
  const t0 = Date.now();
  try {
    const token = await accessToken();
    const gz = file.gz || gzipFile(file.abs).gz;
    file.gz = gz;
    file.gzSize = gz.length;
    await uploadGzip({ uploadUrl, hash: file.hash, body: gz, token, timeoutMs });
    return { ok: true, ms: Date.now() - t0, attempt };
  } catch (e) {
    const msg = e?.cause?.code || e?.message || String(e);
    if (String(msg).includes("401") || String(msg).includes("UNAUTHENTICATED")) {
      cachedToken = "";
      tokenExpiresAt = 0;
    }
    if (attempt < FILE_RETRIES) {
      const delay = Math.min(45_000, 1500 * attempt * attempt);
      console.log(
        `[deploy] retry ${attempt}/${FILE_RETRIES} ${file.rel} (${(file.gzSize / 1024).toFixed(0)}KB gz) ${String(msg).slice(0, 90)} in ${delay / 1000}s`,
      );
      await sleep(delay);
      return uploadOne(uploadUrl, file, attempt + 1);
    }
    return { ok: false, ms: Date.now() - t0, attempt, error: msg };
  }
}

async function main() {
  const ignore = firebaseJson.hosting?.ignore || ["firebase.json", "**/.*", "**/node_modules/**"];
  console.log(
    `[deploy] REST uploader site=${SITE} dir=${path.relative(root, OUT_DIR) || "."} concurrency=${CONCURRENCY} batch=${BATCH_SIZE} ipv4first retries=${FILE_RETRIES}/file`,
  );

  const walked = walkFiles(OUT_DIR).filter((f) => !isIgnored(f.rel, ignore));
  console.log(`[deploy] hashing ${walked.length} files (gzip-${GZIP_LEVEL} + sha256)…`);
  const files = [];
  let hashed = 0;
  await mapPool(walked, 8, async (f) => {
    const h = gzipFile(f.abs);
    files.push({
      rel: f.rel,
      abs: f.abs,
      hash: h.hash,
      size: h.size,
      gzSize: h.gzSize,
    });
    hashed++;
    if (hashed % 500 === 0) console.log(`[deploy] hashed ${hashed}/${walked.length}`);
  });
  const totalGz = files.reduce((s, f) => s + f.gzSize, 0);
  console.log(
    `[deploy] ${files.length} files, ${(totalGz / 1024 / 1024).toFixed(1)}MB gzip payload if all were new`,
  );

  const version = await api(`sites/${SITE}/versions`, {
    method: "POST",
    body: { status: "CREATED" },
    label: "versions.create",
  });
  const versionName = version.name;
  console.log(`[deploy] version ${versionName}`);

  const manifestEntries = files.map((f) => [`/${f.rel}`, f.hash]);
  const needed = new Set();
  let uploadUrl = "";
  const populateChunks = chunk(manifestEntries, POPULATE_BATCH);
  for (let i = 0; i < populateChunks.length; i++) {
    const filesMap = Object.fromEntries(populateChunks[i]);
    const pop = await api(`${versionName}:populateFiles`, {
      method: "POST",
      body: { files: filesMap },
      label: `populateFiles ${i + 1}/${populateChunks.length}`,
    });
    if (pop.uploadUrl) uploadUrl = pop.uploadUrl;
    for (const h of pop.uploadRequiredHashes || []) needed.add(h);
    console.log(
      `[deploy] populate ${i + 1}/${populateChunks.length}: +${(pop.uploadRequiredHashes || []).length} required (running ${needed.size})`,
    );
  }
  console.log(
    `[deploy] ${needed.size} hashes to upload, ${files.length - needed.size} already on Hosting`,
  );

  const byHash = new Map();
  for (const f of files) {
    if (!byHash.has(f.hash)) byHash.set(f.hash, f);
  }
  const toUpload = [...needed]
    .map((hash) => byHash.get(hash))
    .filter(Boolean)
    .sort((a, b) => {
      const pd = uploadPriority(a.rel) - uploadPriority(b.rel);
      if (pd) return pd;
      return a.gzSize - b.gzSize;
    });
  const missing = [...needed].filter((h) => !byHash.has(h));
  if (missing.length) {
    throw new Error(`Hosting asked for ${missing.length} hashes not in the local manifest`);
  }
  if (toUpload.length && !uploadUrl) {
    throw new Error("populateFiles did not return uploadUrl");
  }
  let uploadBytes = 0;
  for (const f of toUpload) {
    const packed = gzipFile(f.abs);
    f.gz = packed.gz;
    f.gzSize = packed.gzSize;
    uploadBytes += packed.gzSize;
  }
  console.log(
    `[deploy] gzipped ${toUpload.length} unmatched files (${(uploadBytes / 1024 / 1024).toFixed(1)}MB) small-files-first`,
  );

  let uploaded = 0;
  let failed = [];
  const batches = chunk(toUpload, BATCH_SIZE);
  for (let b = 0; b < batches.length; b++) {
    const batch = batches[b];
    console.log(
      `[deploy] batch ${b + 1}/${batches.length} (${batch.length} files, ${batch.map((f) => f.rel).join(", ").slice(0, 180)})`,
    );
    await mapPool(batch, CONCURRENCY, async (file) => {
      console.log(
        `[deploy]   → ${file.rel}  ${(file.gzSize / 1024).toFixed(0)}KB gz  timeout=${Math.round(fileTimeoutMs(file.gzSize || file.size) / 1000)}s`,
      );
      const result = await uploadOne(uploadUrl, file, 1);
      if (result.ok) {
        uploaded++;
        delete file.gz;
        console.log(
          `[deploy]   ✓ ${file.rel}  ${(result.ms / 1000).toFixed(1)}s  (${uploaded}/${toUpload.length})`,
        );
      } else {
        failed.push(file);
        console.error(`[deploy]   ✗ ${file.rel} after ${FILE_RETRIES} tries: ${String(result.error).slice(0, 120)}`);
      }
    });
  }

  if (failed.length) {
    console.log(`[deploy] ${failed.length} files still failing — re-populate to skip any that actually landed, then retry`);
    const pop = await api(`${versionName}:populateFiles`, {
      method: "POST",
      body: { files: Object.fromEntries(files.map((f) => [`/${f.rel}`, f.hash])) },
      label: "populateFiles resume",
    });
    if (pop.uploadUrl) uploadUrl = pop.uploadUrl;
    const still = new Set(pop.uploadRequiredHashes || []);
    const retryList = failed.filter((f) => still.has(f.hash));
    console.log(`[deploy] resume: ${still.size} hashes still required, retrying ${retryList.length}`);
    failed = [];
    await mapPool(retryList, 1, async (file) => {
      console.log(`[deploy]   serial retry ${file.rel}`);
      const result = await uploadOne(uploadUrl, file, 1);
      if (result.ok) {
        uploaded++;
        console.log(`[deploy]   ✓ ${file.rel}  ${(result.ms / 1000).toFixed(1)}s`);
      } else {
        failed.push(file);
        console.error(`[deploy]   ✗ ${file.rel}: ${String(result.error).slice(0, 120)}`);
      }
    });
  }

  if (failed.length) {
    console.error(`[deploy] aborting finalize: ${failed.length} uploads failed`);
    for (const f of failed) console.error(`  - ${f.rel}`);
    console.error("[deploy] next lever: FIREBASE_HOSTING_UPLOAD_CONCURRENCY=1, or lower NIC MTU to 1400.");
    process.exit(2);
  }

  const versionId = versionName.split("/").pop();
  const config = servingConfig(firebaseJson.hosting || {});
  await api(`projects/-/sites/${SITE}/versions/${versionId}?updateMask=status,config`, {
    method: "PATCH",
    body: { status: "FINALIZED", config },
    label: "versions.patch FINALIZED",
  });
  console.log("[deploy] version FINALIZED");

  const release = await api(
    `projects/-/sites/${SITE}/channels/live/releases?versionName=${encodeURIComponent(versionName)}`,
    { method: "POST", body: { message: MESSAGE }, label: "releases.create" },
  );
  console.log(`[deploy] LIVE https://${SITE}.web.app  (and custom domains on this site)`);
  if (release.name) console.log(`[deploy] release ${release.name}`);
}

function deployViaCli() {
  const env = { ...process.env };
  env.FIREBASE_HOSTING_UPLOAD_CONCURRENCY = String(CONCURRENCY || 1);
  const extra = "--dns-result-order=ipv4first";
  env.NODE_OPTIONS = env.NODE_OPTIONS?.includes("--dns-result-order")
    ? env.NODE_OPTIONS
    : `${env.NODE_OPTIONS || ""} ${extra}`.trim();
  const maxAttempts = 3;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    console.log(
      `[deploy] CLI fallback attempt ${attempt}/${maxAttempts} concurrency=${env.FIREBASE_HOSTING_UPLOAD_CONCURRENCY}`,
    );
const result = spawnSync(
  "npx",
  ["firebase-tools@latest", "deploy", "--only", "hosting", "--non-interactive"],
      { cwd: root, stdio: "inherit", shell: true, env },
    );
    const status = result.status ?? 1;
    if (status === 0) return 0;
    if (attempt < maxAttempts) {
      const delayMs = 15_000 * attempt;
      console.log(`[deploy] CLI exit ${status}; retry in ${delayMs / 1000}s (hashes already uploaded are skipped)`);
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, delayMs);
    } else {
      return status;
    }
  }
  return 1;
}

if (!fs.existsSync(path.join(OUT_DIR, "index.html"))) {
  console.error("Missing out/index.html — run npm run build first.");
  process.exit(1);
}

if (useCli) {
  process.exit(deployViaCli());
}

try {
  await main();
} catch (err) {
  console.error("[deploy] failed:", err?.stack || err);
  process.exit(1);
}
