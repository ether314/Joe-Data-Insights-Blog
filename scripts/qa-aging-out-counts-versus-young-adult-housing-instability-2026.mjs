/**
 * QA: aging-out-counts-versus-young-adult-housing-instability-2026
 * // viz-types: dual-axis emancipation volume+share, dual-line housing vs work, radar NYTD profile, area exposure ladder, horizontal gap bars, outcomes table | layout: default
 * // smoke-marker: Headline — 15,379 aged out in FY2024; 26% of NYTD 21-year-olds reported homelessness in the prior two years
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  EMANCIPATION_SERIES,
  HEADLINE,
  NYTD_CUMULATIVE_HOMELESS,
  NYTD_OUTCOMES,
} from "../src/data/aging-out-counts-versus-young-adult-housing-instability-2026-data.ts";

assert.equal(HEADLINE.emancipationFy2024, 15_379);
assert.equal(HEADLINE.emancipationFy2019, 20_445);
assert.equal(HEADLINE.nytdHomelessAge21Past2YrsPct, 26);
assert.equal(HEADLINE.nytdEmployedAge21Pct, 55);
assert.equal(NYTD_CUMULATIVE_HOMELESS.anyHomelessBy21Pct, 44);
assert.ok(EMANCIPATION_SERIES.length >= 6);
assert.ok(NYTD_OUTCOMES.length === 3);

const root = process.cwd();
const slug = "aging-out-counts-versus-young-adult-housing-instability-2026";
const markers = [
  "Headline — 15,379 aged out in FY2024; 26% of NYTD 21-year-olds reported homelessness in the prior two years",
  "Emancipation volume",
];

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
  const port = Number(process.env.SMOKE_PORT || 4186);
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
    await clickBtn(page, "Housing vs work");
    await clickBtn(page, "NYTD profile radar");
    await clickBtn(page, "Housing-risk exposure");
    await clickBtn(page, "Outcome gaps");
    await clickBtn(page, "Outcomes table");
    await clickBtn(page, "Emancipation volume");
    await clickBtn(page, "FY2022–FY2024");
    await clickBtn(page, "FY2019–FY2024");
    await clickBtn(page, "Age 19");
    await clickBtn(page, "Age 21");
    await clickBtn(page, "Age 17");
    await clickBtn(page, "Outcome gaps");
    await clickBtn(page, "Employed F/T or P/T");
    await clickBtn(page, "Homeless experience");
    await auditVizInteractions(page, slug);
    console.log(`✓ ${slug} QA passed`);
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
