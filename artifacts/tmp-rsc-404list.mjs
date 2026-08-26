import fs from "node:fs";
import { chromium } from "playwright";
import { startStaticServerBound, stopStaticServer } from "../scripts/lib/static-server.mjs";

const bound = await startStaticServerBound("out", 4179);
const base = bound.url;

const browser = await chromium.launch();
const page = await browser.newPage();
const notFound = new Set();
page.on("response", async (res) => {
  if (res.status() === 404 && res.url().includes("__next")) {
    notFound.add(res.url().replace(base, "").split("?")[0]);
  }
});

await page.goto(base + "/blog/us-share-of-global-source-plasma-2026", {
  waitUntil: "networkidle",
  timeout: 45000,
});
await page.waitForTimeout(5000);

console.log("== __next 404s on blog post page ==");
for (const u of [...notFound].sort()) console.log(" ", u);

// Now click an internal link to trigger a real navigation
const links = await page.$$eval('a[href^="/blog/"]', (as) =>
  as.map((a) => a.getAttribute("href")).filter(Boolean),
);
if (links.length > 1) {
  const dest = links[links.length - 1];
  const before = notFound.size;
  try {
    await Promise.all([
      page.waitForURL("**" + dest + "**", { timeout: 15000 }),
      page.click(`a[href="${dest}"]`),
    ]);
    await page.waitForTimeout(4000);
    console.log("\n== navigated to", dest, "==");
    console.log("== additional __next 404s after client-side navigation ==");
    for (const u of [...notFound].sort().slice(before)) console.log(" ", u);
  } catch (e) {
    console.log("nav failed:", String(e).slice(0, 120));
  }
}

await browser.close();
await stopStaticServer(bound.server).catch(() => {});
process.exit(0);
