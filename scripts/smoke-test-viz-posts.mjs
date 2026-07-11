/**
 * Post-build smoke test: every visualization post must render (not stuck on loading).
 * Usage:
 *   node scripts/smoke-test-viz-posts.mjs           # test local `out/` via serve
 *   node scripts/smoke-test-viz-posts.mjs --live    # test production after deploy
 */
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
const live = process.argv.includes("--live");
const baseUrl = live
  ? process.env.SMOKE_BASE_URL || "https://ether-data-insights-blog.web.app"
  : `http://127.0.0.1:${process.env.SMOKE_PORT || 4173}`;

const POSTS = [
  {
    slug: "china-fiscal-revenue-all-budgets-2024",
    marker: "Granular Revenue by Line Item",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "global-ai-data-center-build-tracker",
    marker: "Tracked sites",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "china-us-india-gdp-30-years",
    marker: "The Great Divergence",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "us-industrial-subsidies-vs-tariffs-30-years",
    marker: "Total market support vs customs duties",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "us-brokerage-fintech-investing-bonuses",
    marker: "programs",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "ccp-nomenklatura-hierarchy-2026",
    marker: "Politburo",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "global-electricity-generation-mix-2024",
    marker: "Generation mix by source",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "global-refugee-hosting-burden-2024",
    marker: "Hosting burden by country",
    forbidden: "Loading interactive charts",
  },
];

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
    }, 20000);
    const onData = (buf) => {
      const text = buf.toString();
      if (text.includes("Accepting") || text.includes("http://")) {
        ready = true;
        clearTimeout(timer);
        resolve(proc);
      }
    };
    proc.stdout.on("data", onData);
    proc.stderr.on("data", onData);
    proc.on("error", reject);
  });
}

async function smokePost(page, { slug, marker, forbidden }) {
  const path = live ? `/blog/${slug}` : `/blog/${slug}.html`;
  const url = `${baseUrl}${path}`;
  const consoleErrors = [];
  const pageErrors = [];

  page.removeAllListeners("console");
  page.removeAllListeners("pageerror");
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("pageerror", (err) => pageErrors.push(String(err)));

  await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
  await page.getByText(marker, { exact: false }).first().waitFor({ timeout: 25000 });

  const stuck = await page.getByText(forbidden, { exact: false }).isVisible().catch(() => false);

  const relevantConsole = consoleErrors.filter(
    (e) =>
      !e.includes("404") &&
      !e.includes("Failed to load resource") &&
      !e.includes("metamask") &&
      !e.includes("ObjectMultiplex"),
  );

  return { slug, url, stuck, pageErrors, consoleErrors: relevantConsole };
}

async function main() {
  if (!live) {
    const outDir = path.join(root, "out");
    if (!fs.existsSync(outDir)) {
      console.error("✗ Missing out/ — run npm run build first");
      process.exit(1);
    }
  }

  let server;
  if (!live) {
    const port = Number(process.env.SMOKE_PORT || 4173);
    server = await startServer(port);
  }

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  let failed = 0;
  try {
    for (const post of POSTS) {
      const result = await smokePost(page, post);
      const ok =
        !result.stuck && result.pageErrors.length === 0 && result.consoleErrors.length === 0;

      console.log(ok ? "✓" : "✗", post.slug);
      if (result.stuck) {
        console.log("  Dashboard stuck on loading spinner");
        failed++;
      }
      if (result.pageErrors.length) {
        console.log("  Page errors:");
        for (const e of result.pageErrors) console.log("   ", e.slice(0, 300));
        failed++;
      }
      if (result.consoleErrors.length) {
        console.log("  Console errors:");
        for (const e of result.consoleErrors) console.log("   ", e.slice(0, 300));
        failed++;
      }
    }
  } finally {
    await browser.close();
    await stopServer(server);
  }

  if (failed > 0) {
    console.error(`\n${failed} smoke test failure(s).`);
    process.exit(1);
  }
  console.log(`\nAll ${POSTS.length} visualization posts passed smoke test (${live ? "live" : "local"}).`);
}

main().catch((err) => {
  if (String(err).includes("Executable doesn't exist")) {
    console.error("Playwright browsers missing. Run: npx playwright install chromium");
  } else if (err.name === "TimeoutError") {
    console.error("Smoke test timed out — dashboard likely stuck on loading or JS error.");
    console.error("Debug: npx tsx scripts/test-all-costs.ts && node scripts/debug-smoke.mjs");
    console.error(err.message);
  } else {
    console.error(err);
  }
  process.exit(1);
});
