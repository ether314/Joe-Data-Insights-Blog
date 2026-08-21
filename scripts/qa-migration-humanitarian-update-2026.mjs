/**
 * QA: Migration & humanitarian vintage update — GT2025 vs research print.
 * // viz-types: dumbbell, dual-axis bar+line, diverging bars, return bars, scatter | layout: default
 */
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";

const root = process.cwd();
const slug = "migration-humanitarian-update-2026";
const markers = [
  "First decade decline — hosts still carry the ledger",
  "Prior research print → Global Trends 2025",
  "Displacement stock vs UNHCR funded %",
  "Host stock deltas by country",
  "Return corridors that cut the stock",
];

async function main() {
  const outDir = path.join(root, "out");
  if (!fs.existsSync(outDir)) {
    console.error("✗ Missing out/ — run npm run build first");
    process.exit(1);
  }
  const port = Number(process.env.SMOKE_PORT || 4188);
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
    await page.getByRole("button", { name: "Funding" }).click();
    await page.waitForTimeout(250);
    await page.getByRole("button", { name: "Largest Δ" }).click();
    await page.waitForTimeout(200);
    await page.getByRole("button", { name: "Africa" }).click();
    await page.waitForTimeout(250);
    await page.getByRole("button", { name: "People" }).click();
    await page.waitForTimeout(200);
    await page.getByRole("button", { name: "All" }).first().click();
    await page.waitForTimeout(200);
    const audit = await auditVizInteractions(page);
    if (audit.issues.length > 0) {
      console.error("✗ Viz interaction audit failed", audit);
      process.exit(1);
    }
    if (audit.warnings?.length) {
      console.log("warnings:", audit.warnings.join(" | "));
    }
    console.log("qa-migration-humanitarian-update-2026: PASS");
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
