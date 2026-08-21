/**
 * QA: migration-humanitarian-update-2026q3
 * // viz-types: dumbbell, waterfall, dual stock×cash, diverging burden, UNHCR compose, host scatter, plan scatter | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  BURDEN_ROWS,
  GHO_CASH_PATH,
  HEADLINE,
  PLAN_COVERAGE,
  VINTAGE_METERS,
} from "../src/data/migration-humanitarian-update-2026q3-data.ts";

assert.equal(HEADLINE.ghoCoveragePriorPct, 24.4);
assert.equal(HEADLINE.ghoCoverageNewPct, 40.4);
assert.equal(HEADLINE.ghoCoverageDeltaPp, 16.0);
assert.equal(HEADLINE.ghoFundedNewBn, 14.08);
assert.equal(HEADLINE.ghoReqNewBn, 34.87);
assert.equal(HEADLINE.displacedNewM, 117.8);
assert.equal(HEADLINE.displacedDeltaM, 0);
assert.ok(HEADLINE.displacedCarried);
assert.equal(HEADLINE.unhcrBudget2026Bn, 8.505);
assert.ok(VINTAGE_METERS.length >= 6);
assert.ok(BURDEN_ROWS.length >= 6);
assert.ok(PLAN_COVERAGE.length >= 6);
assert.ok(GHO_CASH_PATH.length === 2);
assert.ok(HEADLINE.ghoCoverageNewPct > HEADLINE.ghoCoveragePriorPct);

const root = process.cwd();
const slug = "migration-humanitarian-update-2026q3";
const dashboardSrc = fs.readFileSync(
  path.join(
    root,
    "src/components/visualizations/MigrationHumanitarianUpdate2026q3Dashboard.tsx",
  ),
  "utf8",
);
const postsSrc = fs.readFileSync(path.join(root, "src/data/posts.ts"), "utf8");

const checks = [
  [
    "Dashboard wired",
    dashboardSrc.includes('data-viz="migration-humanitarian-update-2026q3"'),
  ],
  ["Post slug present", postsSrc.includes(`slug: "${slug}"`)],
  ["themeId wired", postsSrc.includes('themeId: "migration-humanitarian"')],
  [
    "Hero path",
    postsSrc.includes(
      "/images/politics-migration-humanitarian-update-2026q3-hero.png",
    ),
  ],
];
for (const [label, ok] of checks) {
  assert.ok(ok, label);
  console.log(`✓ ${label}`);
}

const markers = [
  "Coverage jumped +16pp — people stock still carried",
  "May Mid-Year Review → August FTS vintage meters",
  "How coverage rose (+16pp)",
  "People stock vs appeal coverage",
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
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`✓ ${m}`);
    }
    for (const label of [
      "Largest Δ",
      "Newest level",
      "A–Z",
      "Who bears it",
    ]) {
      const btn = page.getByRole("button", { name: label });
      if (await btn.count()) {
        await btn.first().click();
        await page.waitForTimeout(350);
      }
    }
    await page
      .getByText("Who bears migration & humanitarian costs", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    console.log("✓ Who bears migration & humanitarian costs");
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
    await page.getByRole("button", { name: "Cash ledger" }).first().click();
    await page.waitForTimeout(300);
    const audit = await auditVizInteractions(page);
    if (audit.issues.length > 0) {
      console.error("✗ Viz interaction audit failed", audit);
      process.exit(1);
    }
    if (audit.warnings?.length) {
      console.log("warnings:", audit.warnings.join(" | "));
    }
    console.log("qa-migration-humanitarian-update-2026q3: PASS");
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
