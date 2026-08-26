import { chromium } from "playwright";
import { startStaticServerBound, stopStaticServer } from "../scripts/lib/static-server.mjs";

const bound = await startStaticServerBound("out", 4183);
const base = bound.url;

const browser = await chromium.launch();
const page = await browser.newPage();
const notFound = new Set();
page.on("response", (res) => {
  if (res.status() === 404 && res.url().includes("__next")) {
    notFound.add(res.url().replace(base, "").split("?")[0]);
  }
});

// Check three representative routes
for (const route of [
  "/blog/us-share-of-global-source-plasma-2026",
  "/blog/chokepoint-commodities-research-2026",
  "/blog",
]) {
  await page.goto(base + route, { waitUntil: "networkidle", timeout: 45000 });
  await page.waitForTimeout(3000);
}

console.log("__next 404s across 3 routes:", notFound.size ? [...notFound] : "NONE");

await browser.close();
await stopStaticServer(bound.server).catch(() => {});
process.exit(0);
