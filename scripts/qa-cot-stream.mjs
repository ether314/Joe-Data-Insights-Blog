#!/usr/bin/env node
/**
 * Smoke test: Chain of Thought stream shows formatted agent reasoning,
 * not just transport reconnect noise.
 *
 * Usage: node scripts/qa-cot-stream.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn, spawnSync } from "node:child_process";
import {
  formatAgentStreamLine,
  flushAgentStreamBuffer,
  shouldFlushThought,
} from "./lib/agent-stream-cot.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, "..");
const LOG_DIR = path.join(REPO, "artifacts", "automation-logs");
const BASE = process.env.SMOKE_BASE_URL || "http://127.0.0.1:4177";

let failed = 0;
function assert(cond, msg) {
  if (!cond) {
    console.error("FAIL:", msg);
    failed++;
  } else {
    console.log("PASS:", msg);
  }
}

// --- Unit: formatter turns stream-json into [cot:*] lines ---
const state = { buffer: { text: "" }, seenPartial: false };
const sampleEvents = [
  JSON.stringify({
    type: "system",
    subtype: "init",
    model: "test-model",
    cwd: "/tmp/ws",
    session_id: "s1",
  }),
  JSON.stringify({
    type: "assistant",
    message: {
      role: "assistant",
      content: [{ type: "text", text: "I will inspect the posts registry next." }],
    },
    session_id: "s1",
  }),
  JSON.stringify({
    type: "tool_call",
    subtype: "started",
    call_id: "t1",
    tool_call: { readToolCall: { args: { path: "src/data/posts.ts" } } },
    session_id: "s1",
  }),
  JSON.stringify({
    type: "tool_call",
    subtype: "completed",
    call_id: "t1",
    tool_call: {
      readToolCall: {
        args: { path: "src/data/posts.ts" },
        result: { success: { totalLines: 10 } },
      },
    },
    session_id: "s1",
  }),
  JSON.stringify({
    type: "assistant",
    timestamp_ms: Date.now(),
    message: {
      role: "assistant",
      content: [{ type: "text", text: "Overlap looks low; proceeding to data model." }],
    },
    session_id: "s1",
  }),
  JSON.stringify({
    type: "result",
    subtype: "success",
    is_error: false,
    duration_ms: 1200,
    result: "Done with Phase 0.",
    session_id: "s1",
  }),
];

const pretty = [];
for (const ev of sampleEvents) {
  pretty.push(...formatAgentStreamLine(ev, state).lines);
}
pretty.push(...flushAgentStreamBuffer(state));

assert(pretty.some((l) => l.includes("[cot:system] session")), "formats system init");
assert(pretty.some((l) => l.includes("[cot:thought]") && l.includes("posts registry")), "formats assistant thought");
assert(pretty.some((l) => l.includes("[cot:tool] start read src/data/posts.ts")), "formats tool start");
assert(pretty.some((l) => l.includes("[cot:tool] done")), "formats tool done");
assert(pretty.some((l) => l.includes("[cot:system] result ok")), "formats result");

// --- Thought compression: tiny partials coalesce into fewer rows ---
assert(!shouldFlushThought("instrument mixes"), "short fragment does not flush");
assert(
  shouldFlushThought(
    "The dashboard will use a regional scatter, an instrument mix, and a yardstick comparing mitigation.",
  ),
  "sentence-ended thought >=80 chars flushes",
);
assert(
  !shouldFlushThought("Controls will toggle panels, normalize metrics, and filter"),
  "mid-clause under soft cap does not flush",
);

const coalesceState = { buffer: { text: "" }, seenPartial: false };
const fragments = [
  "instrument mixes. ",
  "regional scatter, an instrument mix, and a yardstick comparing mitigation, adaptation, and needs. ",
  "Controls will toggle panels, normalize metrics, and filter regions. ",
  "The post will contain at least 1200 words, six H2 sections, a table, caveats, and two internal links.",
];
const coalesced = [];
for (const frag of fragments) {
  const ev = JSON.stringify({
    type: "assistant",
    timestamp_ms: Date.now(),
    message: { role: "assistant", content: [{ type: "text", text: frag }] },
    session_id: "coalesce",
  });
  coalesced.push(...formatAgentStreamLine(ev, coalesceState).lines);
}
coalesced.push(...flushAgentStreamBuffer(coalesceState));
const thoughtRows = coalesced.filter((l) => l.includes("[cot:thought]"));
assert(
  thoughtRows.length <= 2,
  `fragmented plan coalesces to <=2 thought rows (got ${thoughtRows.length})`,
);
assert(
  thoughtRows.some((l) => /1200 words|instrument mix|yardstick/i.test(l)),
  "coalesced thought keeps key plan phrases",
);

// --- Seed a pure CoT sidecar (separate from mixed worker .log) ---
fs.mkdirSync(LOG_DIR, { recursive: true });
const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
const demoLog = path.join(LOG_DIR, `cot-demo-${stamp}.cot.log`);
const ts = new Date().toISOString().replace("T", " ").slice(0, 19);
const demoBody = [
  // Deliberately mix in git/harness noise — server must strip these from CoT stream
  `[${ts}] git: Creating post/demo-branch`,
  `[${ts}] Worker 1 Invoking agent`,
  ...pretty.map((l) => `[${ts}] ${l}`),
  `[${ts}] transport blip cliAttempt=1 (raw=1) elapsed=2s`,
  "",
].join("\n");
fs.writeFileSync(demoLog, demoBody, "utf8");
assert(fs.existsSync(demoLog), `wrote pure CoT demo ${path.basename(demoLog)}`);

// --- Ensure stream server is up; restart if needed ---
async function pingCot() {
  try {
    const r = await fetch(`${BASE}/api/cot`, { signal: AbortSignal.timeout(2000) });
    return r.ok;
  } catch {
    return false;
  }
}

async function ensureStreamServer({ restart = false } = {}) {
  if (!restart && (await pingCot())) return true;

  if (restart) {
    spawnSync(
      "powershell",
      [
        "-NoProfile",
        "-Command",
        `Get-CimInstance Win32_Process -Filter "Name='node.exe'" | Where-Object { $_.CommandLine -match 'production-stream-server' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }`,
      ],
      { encoding: "utf8" },
    );
    await new Promise((r) => setTimeout(r, 800));
  }

  if (await pingCot()) return true;

  console.log("Starting production-stream-server…");
  const script = path.join(__dirname, "production-stream-server.mjs");
  const outPath = path.join(LOG_DIR, "production-stream-server.out");
  const errPath = path.join(LOG_DIR, "production-stream-server.err");
  const outFd = fs.openSync(outPath, "a");
  const errFd = fs.openSync(errPath, "a");
  const child = spawn(process.execPath, [script], {
    cwd: REPO,
    detached: true,
    stdio: ["ignore", outFd, errFd],
  });
  child.unref();
  fs.closeSync(outFd);
  fs.closeSync(errFd);

  for (let i = 0; i < 40; i++) {
    await new Promise((r) => setTimeout(r, 250));
    if (await pingCot()) return true;
  }
  try {
    const errTail = fs.readFileSync(errPath, "utf8").slice(-500);
    if (errTail.trim()) console.error("stream server stderr:\n", errTail);
  } catch {
    /* ignore */
  }
  return false;
}

function readSseSample(streamId, ms = 3500) {
  return new Promise((resolve, reject) => {
    const ac = new AbortController();
    const t = setTimeout(() => ac.abort(), ms);
    fetch(`${BASE}/api/stream/${streamId}`, {
      signal: ac.signal,
      headers: { Accept: "text/event-stream" },
    })
      .then(async (r) => {
        if (!r.ok) throw new Error(`stream ${streamId} HTTP ${r.status}`);
        const reader = r.body.getReader();
        const dec = new TextDecoder();
        let buf = "";
        const texts = [];
        while (texts.length < 40) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += dec.decode(value, { stream: true });
          while (buf.includes("\n\n")) {
            const i = buf.indexOf("\n\n");
            const chunk = buf.slice(0, i);
            buf = buf.slice(i + 2);
            const dataLine = chunk.split("\n").find((l) => l.startsWith("data: "));
            if (!dataLine) continue;
            try {
              const payload = JSON.parse(dataLine.slice(6));
              if (payload.text) texts.push(payload.text);
              if (Array.isArray(payload.lines)) {
                for (const row of payload.lines) {
                  if (row.text) texts.push(row.text);
                }
              }
            } catch {
              /* ignore */
            }
          }
        }
        clearTimeout(t);
        ac.abort();
        resolve(texts);
      })
      .catch((e) => {
        clearTimeout(t);
        if (e.name === "AbortError") resolve([]);
        else reject(e);
      });
  });
}

// Worker script must request stream-json
const workerPs1 = fs.readFileSync(path.join(__dirname, "run-blog-worker.ps1"), "utf8");
assert(
  workerPs1.includes("stream-json") && workerPs1.includes("stream-partial-output"),
  "run-blog-worker.ps1 enables stream-json + stream-partial-output",
);
assert(workerPs1.includes("agent-stream-cot.mjs"), "worker tees through CoT formatter");

// Restart so the server loads latest UI/stream code and the demo log.
assert(await ensureStreamServer({ restart: true }), `stream server reachable at ${BASE}`);

const ui = await (await fetch(`${BASE}/`)).text();
assert(ui.includes("Chain of Thought"), "UI has Chain of Thought tab");
assert(ui.includes('id="cotBody"') || ui.includes("id=\"cotBody\""), "UI has dedicated CoT table body");
assert(ui.includes("cot-panel") && ui.includes("Separate stream"), "UI documents separate CoT stream");
assert(ui.includes("parsePureCot") || ui.includes("isPureCotText"), "UI parses pure CoT only");
assert(!ui.includes("classifyCotLine"), "UI no longer mixes git/harness via classifyCotLine");
assert(ui.includes('id="cotKindChips"') && ui.includes("cotKindFilter"), "UI has Kind filter chips");
assert(ui.includes('data-kind="thought"') || ui.includes('id: "thought"'), "UI can filter to thought only");

const serverSrc = fs.readFileSync(path.join(__dirname, "production-stream-server.mjs"), "utf8");
assert(serverSrc.includes("streamWantsPureCot") && serverSrc.includes(".cot.log"), "server has pure CoT sidecar path");
assert(serverSrc.includes("isPureCotLine"), "server filters non-CoT lines");

const workerPs1Full = workerPs1;
assert(workerPs1Full.includes(".cot.log"), "worker writes .cot.log sidecar");

const cotMeta = await (await fetch(`${BASE}/api/cot`)).json();
assert(Array.isArray(cotMeta.streams) && cotMeta.streams.includes("cot"), "/api/cot lists cot stream");

const texts = await readSseSample("cot", 4000);
assert(texts.length > 0, `cot SSE emitted lines (got ${texts.length})`);
const joined = texts.join("\n");
assert(
  /\[cot:thought\]|posts registry|Overlap looks low/i.test(joined),
  "cot SSE contains thought content from demo",
);
assert(/\[cot:tool\]|read src\/data\/posts\.ts/i.test(joined), "cot SSE contains tool content from demo");

// Hard separation: git / harness / transport must never appear on CoT stream
assert(!/Creating post\/|git:/i.test(joined), "cot SSE excludes git lines");
assert(!/Invoking agent|Worker \d/i.test(joined), "cot SSE excludes harness lines");
assert(!/transport blip|Connection lost|Retry attempt/i.test(joined), "cot SSE excludes transport noise");
const nonCot = texts.filter(
  (t) =>
    t &&
    !/\[cot:(thought|tool|user|system)\]/i.test(t) &&
    !/loaded|loading|history ready|disconnected|stream /i.test(t),
);
assert(nonCot.length === 0, `cot SSE is pure [cot:*] only (strays: ${nonCot.slice(0, 3).join(" | ") || "none"})`);

console.log("\nSample CoT lines:");
for (const t of texts.filter((x) => /\[cot:/.test(x)).slice(0, 8)) {
  console.log(" ", t.slice(0, 140));
}

if (failed) {
  console.error(`\n${failed} CoT smoke failure(s)`);
  process.exit(1);
}
console.log("\nAll CoT stream smoke checks passed.");
console.log(`Open ${BASE} → Chain of Thought (demo: ${path.basename(demoLog)})`);
console.log("Note: live workers must be respawned to write .cot.log sidecars.");
