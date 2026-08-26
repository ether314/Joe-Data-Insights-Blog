/**
 * QA: us-spent-fuel-in-wet-pools-versus-dry-cask-inventory-2026
 * // smoke-marker: Pool 42,037 vs dry 48,926 MTiHM
 * // viz-types: dual-area mode history, state stacked bars, NRC region stacks,
 * // site-group scatter, national pie split
 * // | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  DETAIL_TABLE,
  HEADLINE,
  MODE_HISTORY,
  MODE_SPLIT,
  NRC_REGIONS,
  SITE_GROUPS,
  STATE_INVENTORY,
  VIZ_MARKERS,
} from "../src/data/us-spent-fuel-in-wet-pools-versus-dry-cask-inventory-2026-data.ts";

assert.equal(HEADLINE.poolMtihm, 42037);
assert.equal(HEADLINE.dryMtihm, 48926);
assert.equal(HEADLINE.totalMtihm, 90963);
assert.equal(HEADLINE.dryCasks, 3862);
assert.equal(HEADLINE.crossoverYear, 2021);
assert.ok(MODE_SPLIT.length === 2);
assert.ok(MODE_HISTORY.length >= 5);
assert.ok(NRC_REGIONS.length === 4);
assert.ok(SITE_GROUPS.length === 4);
assert.ok(STATE_INVENTORY.length >= 30);
assert.ok(DETAIL_TABLE.length >= 30);
assert.ok(VIZ_MARKERS.includes("Pool 42,037 vs dry 48,926 MTiHM"));
assert.ok(VIZ_MARKERS.includes("Site-group pool vs dry scatter"));

const root = process.cwd();
const slug = "us-spent-fuel-in-wet-pools-versus-dry-cask-inventory-2026";
const markers = [...VIZ_MARKERS];

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
  const port = Number(process.env.SMOKE_PORT || 4184);
  const server = await startStaticServer(outDir, port);
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  page.setDefaultTimeout(15000);
  try {
    const candidates = [
      `http://127.0.0.1:${port}/blog/${slug}/`,
      `http://127.0.0.1:${port}/blog/${slug}.html`,
    ];
    let loaded = false;
    for (const url of candidates) {
      const res = await page.goto(url, {
        waitUntil: "domcontentloaded",
        timeout: 45000,
      });
      if (res && res.ok()) {
        loaded = true;
        break;
      }
    }
    assert.ok(loaded, "post HTML not found");

    await page.waitForSelector(`[data-viz="${slug}"]`, { timeout: 20000 }).catch(() => null);
    for (const m of markers.slice(0, 2)) {
      await page.getByText(m, { exact: false }).first().waitFor({
        state: "attached",
        timeout: 20000,
      });
      console.log(`✓ ${m}`);
    }

    await clickBtn(page, "State split");
    await page
      .getByText("State pool vs dry MTiHM", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "NRC regions");
    await page
      .getByText("NRC region stacked inventory", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "Site groups");
    await page
      .getByText("Site-group pool vs dry scatter", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "National share");
    await page
      .getByText("National mass share", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "Crossover path");
    console.log("✓ view controls");

    await auditVizInteractions(page, { slug });
    console.log(`✓ ${slug} QA passed`);
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error("✗ QA failed:", err);
  process.exit(1);
});
