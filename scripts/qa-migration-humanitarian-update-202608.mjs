/**
 * QA: migration-humanitarian-update-202608
 * // viz-types: donor ladder, cumulative area, heal waterfall, vintage meters, asymmetry bars, stock×cash compose, plan scatter | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  BURDEN_ROWS,
  DONOR_LADDER,
  HEADLINE,
  PLAN_COVERAGE,
  VINTAGE_METERS,
} from "../src/data/migration-humanitarian-update-202608-data.ts";

assert.equal(HEADLINE.ftsTop1SharePct, 23.1);
assert.equal(HEADLINE.ftsTop3SharePct, 44.7);
assert.equal(HEADLINE.ghoCoverageNewPct, 40.4);
assert.equal(HEADLINE.ghoCoverageDeltaPp, 0);
assert.equal(HEADLINE.ghoFundedNewBn, 14.08);
assert.equal(HEADLINE.displacedNewM, 117.8);
assert.ok(HEADLINE.displacedCarried);
assert.equal(HEADLINE.lmicHostPct, 68);
assert.ok(VINTAGE_METERS.length >= 6);
assert.ok(BURDEN_ROWS.length >= 6);
assert.ok(PLAN_COVERAGE.length >= 6);
assert.ok(DONOR_LADDER.length >= 8);
assert.ok(HEADLINE.ftsTop1SharePct < HEADLINE.ftsTop3SharePct);
assert.ok(HEADLINE.lmicHostPct > HEADLINE.ftsTop3SharePct);

const root = process.cwd();
const slug = "migration-humanitarian-update-202608";
const dashboardSrc = fs.readFileSync(
  path.join(
    root,
    "src/components/visualizations/MigrationHumanitarianUpdate202608Dashboard.tsx",
  ),
  "utf8",
);
const postsSrc = fs.readFileSync(path.join(root, "src/data/posts.ts"), "utf8");

const checks = [
  [
    "Dashboard wired",
    dashboardSrc.includes('data-viz="migration-humanitarian-update-202608"'),
  ],
  ["Post slug present", postsSrc.includes(`slug: "${slug}"`)],
  ["themeId wired", postsSrc.includes('themeId: "migration-humanitarian"')],
  [
    "Hero path",
    postsSrc.includes(
      "/images/politics-migration-humanitarian-update-202608-hero.png",
    ),
  ],
];
for (const [label, ok] of checks) {
  assert.ok(ok, label);
  console.log(`✓ ${label}`);
}

const markers = [
  "FTS Top-1 is 23% — hosts still hold 68%",
  "FTS 2026 donor ladder (Top-10)",
  "Cumulative donor concentration",
  "Hosts still carry people — donors concentrate cash",
];

async function main() {
  const outDir = path.join(root, "out");
  if (!fs.existsSync(outDir)) {
    console.error("✗ Missing out/ — run npm run build first");
    process.exit(1);
  }
  const port = Number(process.env.SMOKE_PORT || 4186);
  const server = await startStaticServer(outDir, port);
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  try {
    await page.goto(`http://127.0.0.1:${port}/blog/${slug}.html`, {
      waitUntil: "networkidle",
      timeout: 45000,
    });
    for (const m of markers.slice(0, 2)) {
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`✓ ${m}`);
    }
    for (const label of ["Share / level", "Largest Δ", "A–Z", "Hosts vs cash"]) {
      const btn = page.getByRole("button", { name: label });
      if (await btn.count()) {
        await btn.first().click();
        await page.waitForTimeout(350);
      }
    }
    await page
      .getByText("Hosts still carry people — donors concentrate cash", {
        exact: false,
      })
      .first()
      .waitFor({ timeout: 10000 });
    console.log("✓ Hosts still carry people — donors concentrate cash");
    await page.getByRole("button", { name: "Donors" }).first().click();
    await page.waitForTimeout(300);
    await page.getByRole("button", { name: "Hosts" }).first().click();
    await page.waitForTimeout(300);
    await page.getByRole("button", { name: "Crisis plans" }).first().click();
    await page
      .getByText("Crisis-plan coverage scatter", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    console.log("✓ Crisis-plan coverage scatter");
    await page.getByRole("button", { name: "Donor ladder" }).first().click();
    await page.waitForTimeout(300);
    await page
      .getByText("Cumulative donor concentration", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    console.log("✓ Cumulative donor concentration");
    const audit = await auditVizInteractions(page);
    if (audit.issues.length > 0) {
      console.error("✗ Viz interaction audit failed", audit);
      process.exit(1);
    }
    if (audit.warnings?.length) {
      console.log("warnings:", audit.warnings.join(" | "));
    }
    console.log("qa-migration-humanitarian-update-202608: PASS");
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
