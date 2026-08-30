/**
 * QA: amtrak-host-responsible-delay-minutes-versus-on-time-performance-2026
 * // smoke-marker: Host vs Amtrak delay stack
 * // viz-types: stacked host/Amtrak/third delay, host-vs-OTP scatter,
 * // Class I cause mix bars, dual-axis OTP slope path
 * // | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  ALL_ROUTES,
  CLASS_I_HOSTS,
  DETAIL_TABLE,
  HEADLINE,
  LONG_DISTANCE_ROUTES,
  SERVICE_LINES,
  VIZ_MARKERS,
} from "../src/data/amtrak-host-responsible-delay-minutes-versus-on-time-performance-2026-data.ts";

assert.equal(LONG_DISTANCE_ROUTES.length, HEADLINE.panelN);
assert.equal(LONG_DISTANCE_ROUTES.length, 14);
assert.equal(DETAIL_TABLE.length, ALL_ROUTES.length);
assert.ok(SERVICE_LINES.length >= 3);
assert.ok(CLASS_I_HOSTS.length >= 6);
assert.equal(HEADLINE.ldHostDelayPer10k, 987);
assert.equal(HEADLINE.ldAmtrakDelayPer10k, 454);
assert.equal(HEADLINE.ldHostSharePct, 53.1);
assert.equal(HEADLINE.ldCustomerOtpPct, 58);
assert.equal(HEADLINE.ldRoutesMeeting80, 0);
assert.ok(VIZ_MARKERS.includes("Host vs Amtrak delay stack"));

const root = process.cwd();
const slug =
  "amtrak-host-responsible-delay-minutes-versus-on-time-performance-2026";
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

    await clickBtn(page, "Host minutes vs OTP scatter");
    await page
      .getByText("Host minutes vs OTP scatter", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "Class I delay-cause mix");
    await page
      .getByText("Class I delay-cause mix", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "Route OTP slope board");
    await page
      .getByText("Route OTP slope board", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "Long Distance");
    await clickBtn(page, "CSX");
    await clickBtn(page, "All routes");
    await clickBtn(page, "All hosts");
    await clickBtn(page, "Host vs Amtrak delay stack");
    console.log("✓ view + family + host controls");

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
