import fs from "node:fs";
import path from "node:path";

const LINE_TS_RE = /^\[(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})\]/;
const RUN_START_RE = /Starting local blog production run \((local-\d{8}-\d{6})\)/;
const SHIP_RE = /^Shipped:\s*([a-z0-9-]+)/i;
const SHIP_RECORD_RE = /\[SHIP_RECORD\]\s+slug=([^\s]+)(?:\s+duration_sec=(\d+))?/i;
const DURATION_SEC_RE = /duration_sec=(\d+)/i;
const LAST_SLUG_RE = /lastSlug:\s*[`']?([a-z0-9-]+)/i;
const BLOG_URL_RE = /\/blog\/([a-z0-9-]+)/i;
const DEPLOY_COMPLETE_RE = /Deploy complete|release complete/i;
const CYCLE_START_RE = /^(Phase 0|Starting Phase 0|npm run deploy|Shipped:)/i;

/**
 * @param {string} line
 * @param {number} [fallbackMs]
 */
export function parseLineTimestamp(line, fallbackMs = Date.now()) {
  const m = line.match(LINE_TS_RE);
  if (m) {
    const parsed = Date.parse(m[1].replace(" ", "T"));
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallbackMs;
}

/**
 * @param {number | null | undefined} sec
 */
export function formatDuration(sec) {
  if (sec == null || !Number.isFinite(sec) || sec < 0) return "—";
  const total = Math.round(sec);
  if (total < 60) return `${total}s`;
  const m = Math.floor(total / 60);
  const s = total % 60;
  if (m < 60) return s > 0 ? `${m}m ${s}s` : `${m}m`;
  const h = Math.floor(m / 60);
  const rm = m % 60;
  return rm > 0 ? `${h}h ${rm}m` : `${h}h`;
}

/**
 * @param {string} postsPath
 */
export function loadPostMeta(postsPath) {
  /** @type {Map<string, { title: string, publishedAt?: string }>} */
  const map = new Map();
  if (!fs.existsSync(postsPath)) return map;
  const src = fs.readFileSync(postsPath, "utf8");
  const slugMatches = [...src.matchAll(/slug:\s*"([^"]+)"/g)];
  for (const match of slugMatches) {
    const slug = match[1];
    const idx = match.index ?? 0;
    const chunk = src.slice(idx, idx + 1200);
    const title =
      chunk.match(/title:\s*\n\s*"([^"]+)"/)?.[1] ||
      chunk.match(/title:\s*"([^"]+)"/)?.[1] ||
      slug;
    const publishedAt = chunk.match(/publishedAt:\s*"([^"]+)"/)?.[1];
    map.set(slug, { title, publishedAt });
  }
  return map;
}

/**
 * @param {string} logDir
 */
export function parseProductionLogFiles(logDir) {
  /** @type {Array<{ slug: string, shippedAtMs: number, durationSec: number | null, runId: string | null, source: string, signal: string, logFile: string }>} */
  const events = [];

  if (!fs.existsSync(logDir)) return events;

  const files = fs
    .readdirSync(logDir)
    .filter((n) => n.startsWith("production-") && n.endsWith(".log"))
    .sort();

  for (const name of files) {
    const full = path.join(logDir, name);
    let stat;
    try {
      stat = fs.statSync(full);
    } catch {
      continue;
    }

    const lines = fs.readFileSync(full, "utf8").split(/\r?\n/);
    let currentRunId = null;
    let cycleStartMs = stat.mtimeMs;
    let runStartMs = stat.mtimeMs;
    let pendingDeploySlug = null;
    let pendingDeployAt = null;

    for (const line of lines) {
      const ts = parseLineTimestamp(line, stat.mtimeMs);

      const runMatch = line.match(RUN_START_RE);
      if (runMatch) {
        currentRunId = runMatch[1];
        runStartMs = ts;
        cycleStartMs = ts;
        pendingDeploySlug = null;
        continue;
      }

      if (line.includes("Invoking agent") && cycleStartMs === stat.mtimeMs) {
        cycleStartMs = ts;
        runStartMs = ts;
      }

      const shipRecord = line.match(SHIP_RECORD_RE);
      if (shipRecord) {
        const slug = shipRecord[1];
        const durationSec = shipRecord[2]
          ? Number(shipRecord[2])
          : Math.max(0, Math.round((ts - cycleStartMs) / 1000));
        events.push({
          slug,
          shippedAtMs: ts,
          durationSec,
          runId: currentRunId,
          source: "log",
          signal: "SHIP_RECORD",
          logFile: name,
        });
        cycleStartMs = ts;
        pendingDeploySlug = null;
        continue;
      }

      const shipMatch = line.match(SHIP_RE);
      if (shipMatch) {
        const slug = shipMatch[1];
        const durMatch = line.match(DURATION_SEC_RE);
        const durationSec = durMatch
          ? Number(durMatch[1])
          : Math.max(0, Math.round((ts - cycleStartMs) / 1000));
        events.push({
          slug,
          shippedAtMs: ts,
          durationSec,
          runId: currentRunId,
          source: "log",
          signal: "Shipped:",
          logFile: name,
        });
        cycleStartMs = ts;
        pendingDeploySlug = null;
        continue;
      }

      const blogMatch = line.match(BLOG_URL_RE);
      if (blogMatch && DEPLOY_COMPLETE_RE.test(line)) {
        pendingDeploySlug = blogMatch[1];
        pendingDeployAt = ts;
        continue;
      }

      if (DEPLOY_COMPLETE_RE.test(line)) {
        if (pendingDeploySlug && pendingDeployAt) {
          const durationSec = Math.max(0, Math.round((pendingDeployAt - cycleStartMs) / 1000));
          events.push({
            slug: pendingDeploySlug,
            shippedAtMs: pendingDeployAt,
            durationSec,
            runId: currentRunId,
            source: "log",
            signal: "deploy",
            logFile: name,
          });
          cycleStartMs = pendingDeployAt;
        }
        pendingDeploySlug = null;
        continue;
      }

      if (blogMatch && line.toLowerCase().includes("verify")) {
        const slug = blogMatch[1];
        if (!events.some((e) => e.slug === slug && Math.abs(e.shippedAtMs - ts) < 120_000)) {
          events.push({
            slug,
            shippedAtMs: ts,
            durationSec: Math.max(0, Math.round((ts - cycleStartMs) / 1000)),
            runId: currentRunId,
            source: "log",
            signal: "verify",
            logFile: name,
          });
          cycleStartMs = ts;
        }
      }

      const lastSlug = line.match(LAST_SLUG_RE);
      if (lastSlug && line.includes("lastSlug")) {
        const slug = lastSlug[1];
        if (slug !== "null" && !events.some((e) => e.slug === slug && Math.abs(e.shippedAtMs - ts) < 300_000)) {
          events.push({
            slug,
            shippedAtMs: ts,
            durationSec: Math.max(0, Math.round((ts - runStartMs) / 1000)),
            runId: currentRunId,
            source: "log",
            signal: "lastSlug",
            logFile: name,
          });
        }
      }

      if (CYCLE_START_RE.test(line.replace(LINE_TS_RE, "").trim())) {
        cycleStartMs = ts;
      }
    }
  }

  return events;
}

/**
 * @param {Array<{ slug: string, shippedAtMs: number, durationSec: number | null, runId: string | null, source: string, signal: string, logFile?: string }>} events
 */
export function mergeShipEvents(events) {
  /** @type {Map<string, typeof events[0] & { shippedAt: string, durationLabel: string }>} */
  const bySlug = new Map();

  const ranked = [...events].sort((a, b) => a.shippedAtMs - b.shippedAtMs);

  for (const ev of ranked) {
    const prev = bySlug.get(ev.slug);
    const prefer =
      !prev ||
      (ev.durationSec != null && prev.durationSec == null) ||
      (ev.signal === "Shipped:" || ev.signal === "SHIP_RECORD") ||
      ev.shippedAtMs >= prev.shippedAtMs;

    if (prefer) {
      bySlug.set(ev.slug, {
        ...ev,
        shippedAt: new Date(ev.shippedAtMs).toISOString(),
        durationLabel: formatDuration(ev.durationSec),
      });
    }
  }

  return [...bySlug.values()].sort((a, b) => b.shippedAtMs - a.shippedAtMs);
}

/**
 * @param {object} opts
 * @param {string} opts.logDir
 * @param {string} opts.postsPath
 * @param {string} [opts.historyPath]
 * @param {object} [opts.lock]
 */
export function buildShipTable({ logDir, postsPath, historyPath, lock }) {
  const parsed = parseProductionLogFiles(logDir);
  let persisted = [];
  if (historyPath && fs.existsSync(historyPath)) {
    try {
      persisted = JSON.parse(fs.readFileSync(historyPath, "utf8"));
    } catch {
      persisted = [];
    }
  }

  const combined = [...persisted, ...parsed];

  if (lock?.lastSlug && lock.lastHeartbeat) {
    const ts = Date.parse(lock.lastHeartbeat);
    if (Number.isFinite(ts)) {
      combined.push({
        slug: lock.lastSlug,
        shippedAtMs: ts,
        durationSec: null,
        runId: lock.runId ?? null,
        source: "lock",
        signal: "heartbeat",
      });
    }
  }

  const merged = mergeShipEvents(combined);
  const postMeta = loadPostMeta(postsPath);

  return merged.map((row) => {
    const meta = postMeta.get(row.slug);
    return {
      slug: row.slug,
      title: meta?.title ?? row.slug,
      shippedAt: row.shippedAt,
      shippedAtMs: row.shippedAtMs,
      durationSec: row.durationSec,
      durationLabel: row.durationLabel,
      runId: row.runId,
      signal: row.signal,
      source: row.source,
      logFile: row.logFile ?? null,
      blogUrl: `https://ether-data-insights-blog.web.app/blog/${row.slug}`,
    };
  });
}

/**
 * @param {string} historyPath
 * @param {ReturnType<typeof buildShipTable>} rows
 */
export function persistShipHistory(historyPath, rows) {
  const dir = path.dirname(historyPath);
  fs.mkdirSync(dir, { recursive: true });
  const payload = rows.map((r) => ({
    slug: r.slug,
    shippedAtMs: r.shippedAtMs,
    durationSec: r.durationSec,
    runId: r.runId,
    source: r.source,
    signal: r.signal,
    logFile: r.logFile,
  }));
  fs.writeFileSync(historyPath, JSON.stringify(payload, null, 2), "utf8");
}
