import fs from "node:fs";
import { chromium } from "playwright";
import { startStaticServerBound, stopStaticServer } from "../scripts/lib/static-server.mjs";

const bound = await startStaticServerBound("out", 4184);
const base = bound.url;

const browser = await chromium.launch();
const page = await browser.newPage();
const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text().slice(0, 250)));
page.on("pageerror", (e) => errors.push("PAGEERROR: " + String(e).slice(0, 250)));

await page.goto(base + "/blog/employer-coverage-of-glp-1-weight-loss-drugs-2026", {
  waitUntil: "networkidle",
  timeout: 45000,
});
await page.waitForTimeout(8000);

const info = await page.evaluate(() => {
  const roots = [...document.querySelectorAll("[data-viz],[data-viz-dashboard]")];
  return {
    roots: roots.map((r) => r.getAttribute("data-viz")),
    hasMarker: document.body.innerText.includes("GLP-1 employer coverage"),
    loadingText: document.body.innerText.includes("Loading interactive charts"),
    title: document.title,
  };
});
console.log(JSON.stringify(info, null, 2));
console.log("console errors:", errors.length ? [...new Set(errors)] : "none");

await browser.close();
await stopStaticServer(bound.server).catch(() => {});
process.exit(0);
