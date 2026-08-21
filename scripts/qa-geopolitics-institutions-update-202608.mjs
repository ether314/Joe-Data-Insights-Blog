/**
 * QA: geopolitics-institutions-update-202608
 * // viz-types: dual-axis clock+consent, flat vintage bars, Diriyah radar, stacked gap, IMF↔IBRD scatter, IBRD concentration, lever bars | layout: default
 */
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";

const root = process.cwd();
const slug = "geopolitics-institutions-update-202608";
const htmlPathFlat = path.join(root, "out", "blog", `${slug}.html`);
const htmlPathNested = path.join(root, "out", "blog", slug, "index.html");
const htmlPath = fs.existsSync(htmlPathFlat)
  ? htmlPathFlat
  : fs.existsSync(htmlPathNested)
    ? htmlPathNested
    : htmlPathFlat;
const dataPath = path.join(
  root,
  "src",
  "data",
  "geopolitics-institutions-update-202608-data.ts",
);
const dashboardPath = path.join(
  root,
  "src",
  "components",
  "visualizations",
  "GeopoliticsInstitutionsUpdate202608Dashboard.tsx",
);
const heroPath = path.join(
  root,
  "public",
  "images",
  "politics-geopolitics-institutions-update-202608-hero.png",
);

const markers = [
  "August vintage delta — Apr 2026",
  "Consent clock: days remaining to Nov 15",
  "Q3 → Aug consent levels (flat)",
  "Diriyah principles radar",
  "Shortfall closed vs remaining",
  "IMF vs IBRD vote−GDP gaps",
  "What moved vs stuck since Q3",
];

function findInChunks(needle) {
  const chunksDir = path.join(root, "out", "_next", "static", "chunks");
  if (!fs.existsSync(chunksDir)) return false;
  for (const file of fs.readdirSync(chunksDir)) {
    if (!file.endsWith(".js")) continue;
    if (fs.readFileSync(path.join(chunksDir, file), "utf8").includes(needle)) return true;
  }
  return false;
}

const dataSrc = fs.existsSync(dataPath) ? fs.readFileSync(dataPath, "utf8") : "";
const dashboardSrc = fs.existsSync(dashboardPath)
  ? fs.readFileSync(dashboardPath, "utf8")
  : "";
const postsSrc = fs.readFileSync(path.join(root, "src", "data", "posts.ts"), "utf8");

const wordCount = (() => {
  const start = postsSrc.indexOf('id: "geopolitics-institutions-update-202608"');
  if (start < 0) return 0;
  const contentStart = postsSrc.indexOf("content: `", start);
  if (contentStart < 0) return 0;
  const after = postsSrc.slice(contentStart + 10);
  const endMatch = after.match(/`,\r?\n\s*category:/);
  if (!endMatch || endMatch.index == null) return 0;
  const body = after.slice(0, endMatch.index);
  return body.trim().split(/\s+/).filter(Boolean).length;
})();

const h2Count = (() => {
  const start = postsSrc.indexOf('id: "geopolitics-institutions-update-202608"');
  if (start < 0) return 0;
  const contentStart = postsSrc.indexOf("content: `", start);
  if (contentStart < 0) return 0;
  const after = postsSrc.slice(contentStart + 10);
  const endMatch = after.match(/`,\r?\n\s*category:/);
  if (!endMatch || endMatch.index == null) return 0;
  const body = after.slice(0, endMatch.index);
  return (body.match(/^## /gm) || []).length;
})();

const staticChecks = [
  ["Post HTML exists", fs.existsSync(htmlPath)],
  [
    "Has loading fallback",
    fs.existsSync(htmlPath) &&
      fs.readFileSync(htmlPath, "utf8").includes("Loading interactive charts"),
  ],
  ["Data module exists", fs.existsSync(dataPath)],
  ["quotaConsentPct 76.66", dataSrc.includes("quotaConsentPct: 76.66")],
  ["quotaDeltaPp 0", dataSrc.includes("quotaDeltaPp: 0")],
  ["daysRemaining 87", dataSrc.includes("daysRemaining: 87")],
  ["Dashboard exists", fs.existsSync(dashboardPath)],
  [
    "Dashboard wired",
    dashboardSrc.includes('data-viz="geopolitics-institutions-update-202608"'),
  ],
  ["Hero PNG exists", fs.existsSync(heroPath)],
  ["Word count >= 1200", wordCount >= 1200],
  ["H2 count >= 6", h2Count >= 6],
  [
    "Dashboard bundled",
    findInChunks("August vintage delta — Apr 2026") ||
      findInChunks("Consent clock: days remaining to Nov 15"),
  ],
];

let failed = 0;
for (const [name, ok] of staticChecks) {
  console.log(
    ok ? "✓" : "✗",
    name,
    name.includes("Word") ? `(${wordCount})` : name.includes("H2") ? `(${h2Count})` : "",
  );
  if (!ok) failed++;
}

if (failed > 0) {
  process.exit(1);
}

const port = Number(process.env.SMOKE_PORT || 4180);
let server;
try {
  server = await startStaticServer(path.join(root, "out"), port);
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const consoleErrors = [];
  const pageErrors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("pageerror", (err) => pageErrors.push(String(err)));

  const blogUrl = fs.existsSync(htmlPathFlat)
    ? `http://127.0.0.1:${port}/blog/${slug}.html`
    : `http://127.0.0.1:${port}/blog/${slug}/`;

  await page.goto(blogUrl, {
    waitUntil: "networkidle",
    timeout: 45000,
  });

  for (const m of markers) {
    await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
    console.log(`✓ Marker: ${m}`);
  }

  const stuckLoading = await page
    .getByText("Loading interactive charts…")
    .isVisible()
    .catch(() => false);
  if (stuckLoading) {
    console.log("✗ Dashboard stuck on loading state");
    failed++;
  } else {
    console.log("✓ Dashboard renders (not stuck loading)");
  }

  const audit = await auditVizInteractions(page, { slug });
  if (audit.issues?.length) {
    console.error("✗ Viz interaction audit failed", audit);
    failed++;
  } else {
    console.log("✓ Viz interaction audit passed", audit.stats);
    if (audit.warnings?.length) {
      for (const w of audit.warnings) console.log("  ⚠", w);
    }
  }

  await page.goto(`http://127.0.0.1:${port}/category/politics`, {
    waitUntil: "networkidle",
    timeout: 30000,
  });
  const heroVisible = await page
    .locator('img[src*="politics-geopolitics-institutions-update-202608-hero"]')
    .first()
    .isVisible()
    .catch(() => false);
  if (heroVisible) {
    console.log("✓ Hero PNG visible on Politics listing card");
  } else {
    console.log("✗ Hero PNG not visible on listing card");
    failed++;
  }

  const relevantConsole = consoleErrors.filter(
    (e) =>
      !e.includes("404") &&
      !e.includes("Failed to load resource") &&
      !e.includes("metamask") &&
      !e.includes("ObjectMultiplex"),
  );
  if (pageErrors.length) {
    console.log("✗ Page errors:", pageErrors);
    failed++;
  } else {
    console.log("✓ No page errors");
  }
  if (relevantConsole.length) {
    console.log("✗ Console errors:", relevantConsole);
    failed++;
  } else {
    console.log("✓ No console errors");
  }

  await browser.close();
} finally {
  await stopStaticServer(server);
}

if (failed > 0) process.exit(1);
console.log(`\nAll QA checks passed: ${slug}`);
