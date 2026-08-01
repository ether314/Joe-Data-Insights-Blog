/**
 * In-process static file server for post-build smoke/QA scripts.
 * Avoids spawning `npx serve`, which leaves orphan child processes on Windows
 * and prevents Node from exiting with code 0 after tests pass.
 */
import fs from "node:fs";
import http from "node:http";
import path from "node:path";

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".txt": "text/plain; charset=utf-8",
};

function resolveStaticFile(rootDir, urlPath) {
  const decoded = decodeURIComponent((urlPath ?? "/").split("?")[0]);
  let rel = decoded.replace(/^\/+/, "");
  if (!rel) rel = "index.html";

  const candidates = [path.join(rootDir, rel)];
  if (!path.extname(rel)) {
    candidates.push(path.join(rootDir, `${rel}.html`));
    candidates.push(path.join(rootDir, rel, "index.html"));
  }

  const root = path.resolve(rootDir);
  for (const candidate of candidates) {
    const file = path.resolve(candidate);
    if (!file.startsWith(root)) continue;
    try {
      if (fs.statSync(file).isFile()) return file;
    } catch {
      /* try next candidate */
    }
  }
  return null;
}

function createStaticServer(rootDir) {
  const root = path.resolve(rootDir);
  return http.createServer((req, res) => {
    const file = resolveStaticFile(root, req.url);
    if (!file) {
      res.statusCode = 404;
      res.end("Not found");
      return;
    }
    res.setHeader("Content-Type", MIME[path.extname(file).toLowerCase()] ?? "application/octet-stream");
    const stream = fs.createReadStream(file);
    stream.on("error", () => {
      if (!res.headersSent) res.statusCode = 500;
      res.end();
    });
    stream.pipe(res);
  });
}

/**
 * Bind a static server, retrying nearby ports on EADDRINUSE so parallel workers
 * never share one Node listen port.
 *
 * @param {string} rootDir absolute or relative path to static export (e.g. out/)
 * @param {number} [preferredPort]
 * @param {string} [host]
 * @returns {Promise<{ server: import("node:http").Server, port: number, url: string }>}
 */
export async function startStaticServerBound(rootDir, preferredPort = 4173, host = "127.0.0.1") {
  const preferred = Number(preferredPort);
  const base = Number.isFinite(preferred) && preferred > 0 ? preferred : 4173;
  const candidates = [base];
  for (let i = 1; i <= 40; i++) candidates.push(base + i);
  // Last resort: ephemeral port
  candidates.push(0);

  let lastErr = null;
  for (const port of candidates) {
    const server = createStaticServer(rootDir);
    try {
      const bound = await new Promise((resolve, reject) => {
        const onError = (err) => {
          server.off("listening", onListening);
          reject(err);
        };
        const onListening = () => {
          server.off("error", onError);
          const addr = server.address();
          const actual = typeof addr === "object" && addr ? addr.port : port;
          resolve({ server, port: actual, url: `http://${host}:${actual}` });
        };
        server.once("error", onError);
        server.once("listening", onListening);
        server.listen(port, host);
      });
      if (bound.port !== base) {
        console.error(
          `static-server: preferred port ${base} busy; bound ${bound.port} instead`,
        );
      }
      return bound;
    } catch (err) {
      lastErr = err;
      try {
        server.close();
      } catch {
        /* ignore */
      }
      if (err && err.code === "EADDRINUSE") continue;
      throw err;
    }
  }
  throw lastErr || new Error(`Unable to bind static server near port ${base}`);
}

/**
 * @param {string} rootDir absolute or relative path to static export (e.g. out/)
 * @param {number} [port]
 * @param {string} [host]
 * @returns {Promise<import("node:http").Server>}
 */
export async function startStaticServer(rootDir, port = 4173, host = "127.0.0.1") {
  const bound = await startStaticServerBound(rootDir, port, host);
  return bound.server;
}

/** @param {import("node:http").Server | null | undefined} server */
export function stopStaticServer(server) {
  if (!server) return Promise.resolve();
  return new Promise((resolve, reject) => {
    server.close((err) => (err ? reject(err) : resolve()));
  });
}
