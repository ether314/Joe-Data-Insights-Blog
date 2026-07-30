import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";

const live = process.argv.includes("--live");
const slug = "ai-gpu-packaging-memory-bottleneck-2025";
const chartTitle = "CoWoS wafer demand vs capacity gap";
const baseUrl = live
  ? "https://ether-data-insights-blog.web.app"
  : `http://127.0.0.1:${process.env.SMOKE_PORT || 4175}`;
const pagePath = live ? `/blog/${slug}` : `/blog/${slug}.html`;
const root = process.cwd();

let server;
if (!live) {
  server = await startStaticServer(path.join(root, "out"), Number(process.env.SMOKE_PORT || 4175));
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.goto(`${baseUrl}${pagePath}`, { waitUntil: "networkidle", timeout: 45000 });
await page.getByText(chartTitle, { exact: true }).waitFor({ timeout: 25000 });

const titleBox = await page.getByText(chartTitle, { exact: true }).boundingBox();
const allDots = page.locator(".recharts-line-dots circle");
const n = await allDots.count();
const charts = [];
for (let i = 0; i < n; i++) {
  const box = await allDots.nth(i).boundingBox();
  if (!box || !titleBox) continue;
  const dy = Math.abs(box.y - titleBox.y);
  charts.push({ i, dy, box });
}
charts.sort((a, b) => a.dy - b.dy);

// Group dots belonging to demand chart: same chart has dots at similar y
const demandDots = [];
if (charts.length) {
  const anchorY = charts[0].box.y;
  for (const c of charts) {
    if (Math.abs(c.box.y - anchorY) < 8) demandDots.push(c.i);
  }
}

const tickTexts = await page
  .locator(".recharts-xAxis .recharts-cartesian-axis-tick text")
  .evaluateAll((els) => els.map((el) => el.textContent?.trim() || ""));

const tooltipValues = [];
for (const idx of demandDots) {
  const box = await allDots.nth(idx).boundingBox();
  if (!box) continue;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.waitForTimeout(500);
  const label = await page.locator(".recharts-tooltip-wrapper:visible .recharts-tooltip-label").textContent().catch(() => "");
  const value = await page.locator(".recharts-tooltip-wrapper:visible .recharts-tooltip-item-value").textContent().catch(() => "");
  tooltipValues.push({ index: idx, label: (label || "").trim(), value: (value || "").trim() });
}

const points2026 = tooltipValues.filter((p) => p.label === "2026");
console.log(
  JSON.stringify(
    {
      live,
      totalLineDotsOnPage: n,
      demandChartDotIndices: demandDots,
      demandChartDotCount: demandDots.length,
      allXAxisTicks: tickTexts,
      tooltipValues,
      points2026,
      duplicate2026: points2026.length >= 2,
    },
    null,
    2,
  ),
);

await browser.close();
await stopStaticServer(server);
