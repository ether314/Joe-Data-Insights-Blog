import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { chromium } from "playwright";

function killProcessTree(proc) {
  if (!proc || proc.exitCode !== null) return;
  if (process.platform === "win32") {
    spawn("taskkill", ["/PID", String(proc.pid), "/T", "/F"], {
      stdio: "ignore",
      windowsHide: true,
    });
    return;
  }
  try {
    proc.kill("SIGTERM");
  } catch {
    // already exited
  }
}

async function stopServer(proc) {
  if (!proc) return;
  killProcessTree(proc);
  proc.stdout?.destroy();
  proc.stderr?.destroy();
  await new Promise((resolve) => {
    if (proc.exitCode !== null) {
      resolve();
      return;
    }
    proc.once("exit", resolve);
    setTimeout(resolve, 3000);
  });
}

const root = process.cwd();
const slug = "global-electricity-generation-mix-2024";
const htmlPath = path.join(root, "out", "blog", `${slug}.html`);
const dataPath = path.join(root, "src", "data", "electricity-generation-mix-data.ts");
const dashboardPath = path.join(
  root,
  "src",
  "components",
  "visualizations",
  "ElectricityGenerationMixDashboard.tsx",
);

function findInChunks(needle) {
  const chunksDir = path.join(root, "out", "_next", "static", "chunks");
  if (!fs.existsSync(chunksDir)) return false;
  for (const file of fs.readdirSync(chunksDir)) {
    if (!file.endsWith(".js")) continue;
    if (fs.readFileSync(path.join(chunksDir, file), "utf8").includes(needle)) return true;
  }
  return false;
}

function startServer(port) {
  return new Promise((resolve, reject) => {
    const proc = spawn(
      process.platform === "win32" ? "npx.cmd" : "npx",
      ["--yes", "serve", "out", "-l", String(port)],
      { cwd: root, stdio: "pipe", shell: true, windowsHide: true },
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
  const url = `http://127.0.0.1:${port}/blog/${slug}.html`;
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const consoleErrors = [];
  const pageErrors = [];

  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("pageerror", (err) => pageErrors.push(String(err)));

  await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
  await page.getByText("World generation", { exact: false }).waitFor({ timeout: 20000 });
  await page.getByText("Generation mix by source", { exact: false }).waitFor({ timeout: 5000 });

  const stuckLoading = await page.getByText("Loading interactive charts…").isVisible().catch(() => false);
  await browser.close();

  const relevantConsole = consoleErrors.filter(
    (e) =>
      !e.includes("404") &&
      !e.includes("Failed to load resource") &&
      !e.includes("metamask") &&
      !e.includes("ObjectMultiplex"),
  );

  return { consoleErrors: relevantConsole, pageErrors, stuckLoading };
}

const dataSrc = fs.readFileSync(dataPath, "utf8");
const dashboardSrc = fs.readFileSync(dashboardPath, "utf8");

const staticChecks = [
  ["Electricity mix post HTML exists", fs.existsSync(htmlPath)],
  ["Has loading fallback", fs.readFileSync(htmlPath, "utf8").includes("Loading interactive charts")],
  ["fmtTwh exported", dataSrc.includes("export function fmtTwh")],
  ["fmtPct exported", dataSrc.includes("export function fmtPct")],
  ["ELECTRICITY_MIX exported", dataSrc.includes("export const ELECTRICITY_MIX")],
  ["DATA_YEAR is 2024", dataSrc.includes("export const DATA_YEAR = 2024")],
  ["Dashboard wired to electricity-generation-mix", dashboardSrc.includes('data-viz="electricity-generation-mix"')],
  ["Dashboard uses fmtTwh", dashboardSrc.includes("fmtTwh")],
  ["Dashboard bundled", findInChunks("Generation mix by source") || findInChunks("World generation")],
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
  await stopServer(server);
}

if (failed > 0) process.exit(1);
console.log("\nAll electricity generation mix QA checks passed.");
