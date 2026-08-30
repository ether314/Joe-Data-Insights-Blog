/**
 * QA: us-pet-owning-households-versus-veterinary-cpi-2026
 * // viz-types: composed line, area gap, ownership line, radar, yoy bars, scatter | layout: default
 * // smoke-marker: Pet households vs veterinary CPI
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  ANALYTICS,
  CPI_ANNUAL,
  HEADLINE,
  OWNERSHIP_AVMA,
  SPECIES_2025,
  VIZ_MARKERS,
} from "../src/data/us-pet-owning-households-versus-veterinary-cpi-2026-data.ts";

assert.equal(HEADLINE.dogHhShare2025, 42.6);
assert.equal(HEADLINE.catHhShare2025, 32.6);
assert.equal(HEADLINE.anyPetHhShare2025, 58.6);
assert.equal(HEADLINE.vetCpi2025, 393.244);
assert.equal(HEADLINE.gap1997base2025, 192.7);
assert.equal(HEADLINE.gap2019base2025, 21.3);
assert.ok(CPI_ANNUAL.length >= 28);
assert.ok(OWNERSHIP_AVMA.length >= 6);
assert.equal(SPECIES_2025.length, 2);
assert.equal(ANALYTICS.smokeMarker, "Pet households vs veterinary CPI");
assert.ok(VIZ_MARKERS.includes("Pet households vs veterinary CPI"));

const root = process.cwd();
const slug = "us-pet-owning-households-versus-veterinary-cpi-2026";
const markers = [
  "Pet households vs veterinary CPI",
  "Economics · Pet households vs veterinary CPI",
];

async function clickBtn(page, name) {
  console.log(`→ click ${name}`);
  await page.locator("button", { hasText: name }).first().click({ timeout: 8000 });
  await page.waitForTimeout(200);
}

async function main() {
  const outDir = path.join(root, "out");
  const htmlCandidates = [
    path.join(outDir, "blog", `${slug}.html`),
    path.join(outDir, "blog", slug, "index.html"),
  ];
  const htmlPath = htmlCandidates.find((p) => fs.existsSync(p));
  assert.ok(htmlPath, `Missing built HTML for ${slug}`);

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
    await clickBtn(page, "Outrun gap");
    await clickBtn(page, "Ownership waves");
    await clickBtn(page, "Species radar");
    await clickBtn(page, "YoY inflation");
    await clickBtn(page, "Share vs price");
    await clickBtn(page, "2019 = 100");
    await clickBtn(page, "APPA");
    await clickBtn(page, "Dogs");
    await clickBtn(page, "1997 = 100");
    await clickBtn(page, "AVMA");
    await clickBtn(page, "Dog + cat");
    await clickBtn(page, "CPI race");
    await auditVizInteractions(page, { slug });
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
