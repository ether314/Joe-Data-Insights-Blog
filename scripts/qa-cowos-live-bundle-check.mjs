import { chromium } from "playwright";

const url = "https://ether-data-insights-blog.web.app/blog/ai-gpu-packaging-memory-bottleneck-2025";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const scripts = [];
page.on("response", async (res) => {
  const u = res.url();
  if (u.includes("/_next/static/chunks/") && u.endsWith(".js")) {
    const body = await res.text().catch(() => "");
    scripts.push({ url: u, hasOld: body.includes('includes("CoWoS wafer demand")'), hasNew: body.includes('startsWith("cowos-demand-")') });
  }
});
await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
await page.getByText("CoWoS wafer demand vs capacity gap").waitFor({ timeout: 25000 });
const dotCount = await page.locator(".recharts-line-dots circle").count();
console.log(JSON.stringify({ dotCount, scripts: scripts.filter((s) => s.hasOld || s.hasNew) }, null, 2));
await browser.close();
