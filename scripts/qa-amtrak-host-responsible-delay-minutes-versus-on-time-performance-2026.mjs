/**
 * QA: amtrak-host-responsible-delay-minutes-versus-on-time-performance-2026
 * // smoke-marker: Host share vs endpoint OTP
 * // viz-types: host-share vs OTP scatter, responsibility stacked bars,
 * // Class I host ladder bars, host-cause pie, quarterly dual-axis composed
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
  HOST_REPORT_CARD,
  QUARTER_TREND,
  ROUTE_PANEL,
  SERVICE_LINE_STACKS,
  VIZ_MARKERS,
  hostSharePct,
} from "../src/data/amtrak-host-responsible-delay-minutes-versus-on-time-performance-2026-data.ts";

assert.equal(ROUTE_PANEL.length, HEADLINE.routePanelN);
assert.equal(ROUTE_PANEL.length, 21);
assert.equal(DETAIL_TABLE.length, 21);
assert.equal(HOST_REPORT_CARD.length, HEADLINE.hostCardN);
assert.equal(HOST_REPORT_CARD.length, 6);
assert.ok(SERVICE_LINE_STACKS.length >= 9);
assert.ok(QUARTER_TREND.length >= 3);
assert.equal(HEADLINE.ldHostSharePct, 53.9);
assert.equal(HEADLINE.ssHostSharePct, 55.2);
assert.equal(HEADLINE.ldOtpPct, 49);
assert.equal(HEADLINE.ssOtpPct, 78);
assert.equal(HEADLINE.ldHostMin10k, 1065);
assert.equal(HEADLINE.ssHostMin10k, 951);
assert.equal(hostSharePct(SERVICE_LINE_STACKS[6]), 53.9);
assert.ok(VIZ_MARKERS.includes("Host share vs endpoint OTP"));

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

    await clickBtn(page, "Responsibility");
    await page
      .getByText("Responsibility stacked minutes", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "Host ladder");
    await page
      .getByText("Class I host report-card ladder", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "Host causes");
    await page
      .getByText("Host delay cause mix", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "Quarter path");
    await page
      .getByText("Host share of delay minutes vs OTP path", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "Long Distance");
    await clickBtn(page, "State Supported");
    await clickBtn(page, "LD + State");
    await clickBtn(page, "Below 80%");
    await clickBtn(page, "All OTP");
    await clickBtn(page, "FY24 Q3");
    await clickBtn(page, "FY25 Q3");
    await clickBtn(page, "Host vs OTP");
    console.log("✓ view + service + OTP + quarter controls");

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
