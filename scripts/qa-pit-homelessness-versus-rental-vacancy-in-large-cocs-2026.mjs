/**
 * QA: pit-homelessness-versus-rental-vacancy-in-large-cocs-2026
 * // viz-types: PIT×vacancy scatter, dual-rank bars, national vacancy area,
 * // vacancy-bin avg PIT, assisted-housing pie, regional dual metrics | layout: default
 * // smoke-marker: PIT count vs home-state rental vacancy
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  COCS,
  HEADLINE,
  NATIONAL_VACANCY_TREND,
  VIZ_MARKERS,
} from "../src/data/pit-homelessness-versus-rental-vacancy-in-large-cocs-2026-data.ts";

assert.equal(HEADLINE.topCoc, "New York City");
assert.equal(HEADLINE.topPit, 125683);
assert.equal(HEADLINE.caVacancyPct, 4.8);
assert.ok(COCS.length >= 20);
assert.ok(NATIONAL_VACANCY_TREND.length >= 12);
assert.ok(VIZ_MARKERS[0].includes("PIT count vs home-state rental vacancy"));

const root = process.cwd();
const slug = "pit-homelessness-versus-rental-vacancy-in-large-cocs-2026";
const markers = ["PIT count vs home-state rental vacancy"];

async function clickBtn(page, name) {
  console.log(`→ click ${name}`);
  await page.locator("button", { hasText: name }).first().click({ timeout: 8000 });
  await page.waitForTimeout(200);
}

async function main() {
  const outDir = path.join(root, "out");
  if (!fs.existsSync(outDir)) {
    console.error("✗ Missing out/ — run npm run build first");
    process.exit(1);
  }
  const port = Number(process.env.SMOKE_PORT || 4180);
  const server = await startStaticServer(outDir, port);
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  page.setDefaultTimeout(15000);
  try {
    await page.goto(`http://127.0.0.1:${port}/blog/${slug}.html`, {
      waitUntil: "domcontentloaded",
      timeout: 45000,
    });
    await page.waitForSelector(`[data-viz="${slug}"]`, { timeout: 20000 });
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({
        state: "attached",
        timeout: 20000,
      });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "PIT × vacancy");
    await clickBtn(page, "Dual ranks");
    await clickBtn(page, "National vacancy");
    await clickBtn(page, "Vacancy bins");
    await clickBtn(page, "Assisted mix");
    await clickBtn(page, "Regional avg");
    await clickBtn(page, "Sort by vacancy");
    await clickBtn(page, "West");
    await clickBtn(page, "NYC + LA on");
    await auditVizInteractions(page, { slug });
    console.log("✓ QA passed");
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error("✗ QA failed", err);
  process.exit(1);
});
