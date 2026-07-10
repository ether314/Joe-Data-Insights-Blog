import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { chromium } from "playwright";

const root = process.cwd();
const slug = "global-ai-data-center-build-tracker";
const htmlPath = path.join(root, "out", "blog", `${slug}.html`);
const dataPath = path.join(root, "src", "data", "ai-data-centers-data.ts");
const dashboardPath = path.join(root, "src", "components", "visualizations", "AiDataCentersDashboard.tsx");

function findInChunks(needle) {
  const chunksDir = path.join(root, "out", "_next", "static", "chunks");
  if (!fs.existsSync(chunksDir)) return false;
  for (const file of fs.readdirSync(chunksDir)) {
    if (!file.endsWith(".js")) continue;
    if (fs.readFileSync(path.join(chunksDir, file), "utf8").includes(needle)) return true;
  }
  return false;
}

function fmtBeforeDisplayInBundle() {
  const chunksDir = path.join(root, "out", "_next", "static", "chunks");
  for (const file of fs.readdirSync(chunksDir)) {
    if (!file.endsWith(".js")) continue;
    const content = fs.readFileSync(path.join(chunksDir, file), "utf8");
    if (!content.includes("sortBillions")) continue;
    const fmtIdx = content.indexOf("function y(e){return e>=1e3");
    const displayIdx = content.indexOf('if(o.includes("part of"))');
    if (fmtIdx < 0 || displayIdx < 0) continue;
    return fmtIdx < displayIdx;
  }
  return false;
}

function startServer(port) {
  return new Promise((resolve, reject) => {
    const proc = spawn(
      process.platform === "win32" ? "npx.cmd" : "npx",
      ["--yes", "serve", "out", "-l", String(port)],
      { cwd: root, stdio: "pipe", shell: true },
    );
    let ready = false;
    const timer = setTimeout(() => {
      if (!ready) reject(new Error("Static server did not start in time"));
    }, 15000);
    proc.stdout.on("data", (buf) => {
      const text = buf.toString();
      if (text.includes("Accepting") || text.includes("http://")) {
        ready = true;
        clearTimeout(timer);
        resolve(proc);
      }
    });
    proc.stderr.on("data", (buf) => {
      const text = buf.toString();
      if (text.includes("Accepting") || text.includes("http://")) {
        ready = true;
        clearTimeout(timer);
        resolve(proc);
      }
    });
    proc.on("error", reject);
  });
}

async function browserSmoke(port) {
  const url = `http://127.0.0.1:${port}/blog/${slug}`;
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const consoleErrors = [];
  const pageErrors = [];

  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("pageerror", (err) => pageErrors.push(String(err)));

  await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
  await page.getByText("Tracked sites", { exact: false }).waitFor({ timeout: 20000 });
  await page.getByText("Stargate Abilene", { exact: false }).waitFor({ timeout: 5000 });

  const stuckLoading = await page.getByText("Loading interactive charts…").isVisible().catch(() => false);
  await browser.close();

  return { consoleErrors, pageErrors, stuckLoading };
}

const dataSrc = fs.readFileSync(dataPath, "utf8");
const dashboardSrc = fs.readFileSync(dashboardPath, "utf8");

const staticChecks = [
  ["AI DC post HTML exists", fs.existsSync(htmlPath)],
  ["Has loading fallback", fs.readFileSync(htmlPath, "utf8").includes("Loading interactive charts")],
  ["formatCostDisplay exported", dataSrc.includes("export function formatCostDisplay")],
  ["fmtBillionsUsd defined before formatCostDisplay", dataSrc.indexOf("export function fmtBillionsUsd") < dataSrc.indexOf("export function formatCostDisplay")],
  ["CostCell uses formatCostDisplay", dashboardSrc.includes("formatCostDisplay") && dashboardSrc.includes("CostCell")],
  ["Dashboard bundled", findInChunks("Tracked sites") || findInChunks("sortBillions")],
  ["fmtBillionsUsd before formatCostDisplay in bundle", fmtBeforeDisplayInBundle()],
];

let failed = 0;
for (const [name, ok] of staticChecks) {
  console.log(ok ? "✓" : "✗", name);
  if (!ok) failed++;
}

if (failed > 0) {
  process.exit(1);
}

const port = 4173;
let server;
try {
  server = await startServer(port);
  const { consoleErrors, pageErrors, stuckLoading } = await browserSmoke(port);

  if (stuckLoading) {
    console.log("✗ Dashboard stuck on loading state");
    failed++;
  } else {
    console.log("✓ Dashboard renders (not stuck loading)");
  }

  if (pageErrors.length) {
    console.log("✗ Page errors:");
    for (const e of pageErrors) console.log("  ", e);
    failed++;
  } else {
    console.log("✓ No page errors");
  }

  if (consoleErrors.length) {
    console.log("✗ Console errors:");
    for (const e of consoleErrors) console.log("  ", e);
    failed++;
  } else {
    console.log("✓ No console errors");
  }
} finally {
  server?.kill("SIGTERM");
}

if (failed > 0) process.exit(1);
console.log("\nAll AI data center QA checks passed.");
