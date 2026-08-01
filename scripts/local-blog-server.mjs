/**
 * Persistent local preview of the static export at http://127.0.0.1:4173/
 * Serves `out/` — refresh after `npm run build` / deploy to see newest posts.
 *
 * Usage: node scripts/local-blog-server.mjs
 *        npm run blog:local
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { startStaticServer } from "./lib/static-server.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(REPO_ROOT, "out");
const PORT = Number(process.env.BLOG_LOCAL_PORT || process.env.SMOKE_PORT || 4173);
const HOST = process.env.BLOG_LOCAL_HOST || "127.0.0.1";
const PID_FILE = path.join(REPO_ROOT, "artifacts", "local-blog-server.pid");

if (!fs.existsSync(OUT_DIR)) {
  console.error(`Missing ${OUT_DIR} — run npm run build first.`);
  process.exit(1);
}

const server = await startStaticServer(OUT_DIR, PORT, HOST);
if (server?.reused) {
  console.log(`Local blog already running at http://${HOST}:${PORT}/ (reusing existing listener)`);
  process.exit(0);
}

try {
  fs.mkdirSync(path.dirname(PID_FILE), { recursive: true });
  fs.writeFileSync(PID_FILE, `${process.pid}\n`, "utf8");
} catch (err) {
  console.warn(`Could not write PID file: ${err.message}`);
}

console.log(`Local blog preview: http://${HOST}:${PORT}/`);
console.log(`Serving ${OUT_DIR}`);

function clearPid() {
  try {
    const existing = fs.readFileSync(PID_FILE, "utf8").trim();
    if (existing === String(process.pid)) fs.unlinkSync(PID_FILE);
  } catch {}
}

process.on("exit", clearPid);
process.on("SIGINT", () => {
  clearPid();
  process.exit(0);
});
process.on("SIGTERM", () => {
  clearPid();
  process.exit(0);
});
