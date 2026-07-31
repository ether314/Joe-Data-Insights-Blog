/**
 * QA: global remittance corridors 2026.
 * viz-types: horizontal-bar, stacked-area, scatter, dumbbell, grouped-bar | layout: default
 * Usage: node scripts/qa-global-remittance-corridors-2026.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";

const root = process.cwd();
const slug = "global-remittance-corridors-2026";
const markers = [
  "Estimated bilateral corridors",
  "Remittances vs FDI and ODA",
  "LMIC remittance inflows by region",
  "Regional growth rates",
];

async function main() {
  const outDir = path.join(root, "out");
  if (!fs.existsSync(outDir)) {
    console.error("✗ Missing out/ — run npm run build first");
    process.exit(1);
  }
  const port = Number(process.env.SMOKE_PORT || 4181);
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
    await page.getByRole("button", { name: "Recipients" }).click();
    await page.waitForTimeout(250);
    await page.getByRole("button", { name: "GDP dependence" }).click();
    await page.waitForTimeout(250);
    await page.getByRole("button", { name: "Volume vs dependence" }).click();
    await page.waitForTimeout(250);
    await page.getByRole("button", { name: "Corridors" }).click();
    await page.waitForTimeout(200);
    await page.getByRole("button", { name: "US only" }).click();
    await page.waitForTimeout(200);
    await page.getByRole("button", { name: "Gulf only" }).click();
    await page.waitForTimeout(200);
    await page.getByRole("button", { name: "All sources" }).click();
    await page.waitForTimeout(200);
    const audit = await auditVizInteractions(page);
    if (audit.issues.length > 0) {
      console.error("✗ Viz interaction audit failed", audit);
      process.exit(1);
    }
    if (audit.warnings?.length) {
      console.log("warnings:", audit.warnings.join(" | "));
    }
    console.log(`✓ QA passed: ${slug}`);
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
