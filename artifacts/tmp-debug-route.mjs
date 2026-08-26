import fs from "node:fs";
import { chromium } from "playwright";
import { startStaticServerBound, stopStaticServer } from "../scripts/lib/static-server.mjs";

const target = process.argv[2] || "/blog/us-share-of-global-source-plasma-2026";
const bound = await startStaticServerBound("out", 4179);
const base = bound.url;
console.log("serving", base);

const browser = await chromium.launch();
const page = await browser.newPage();
const errors = [];
const failed404 = [];
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(msg.text().slice(0, 200));
});
page.on("response", (res) => {
  if (res.status() === 404) failed404.push(res.url().replace(base, ""));
});
page.on("pageerror", (err) => errors.push("PAGEERROR: " + String(err).slice(0, 200)));

await page.goto(base + target, { waitUntil: "networkidle", timeout: 45000 });
await page.waitForTimeout(6000);

const info = await page.evaluate(() => {
  const roots = [...document.querySelectorAll("[data-viz],[data-viz-dashboard]")];
  return {
    roots: roots.map((r) => r.getAttribute("data-viz")),
    hasLoadingText: document.body.innerText.includes("Loading interactive charts"),
  };
});
console.log(JSON.stringify(info));
const interesting = failed404.filter((u) => !u.includes("/images/") && !u.includes("google-analytics"));
console.log("404s (non-image, non-ga):", interesting.length ? [...new Set(interesting)] : "none");
console.log("console errors:", errors.length ? [...new Set(errors)] : "none");

await browser.close();
await stopStaticServer(bound.server);
process.exit(0);
