import { chromium } from "playwright";
import { startStaticServerBound, stopStaticServer } from "../scripts/lib/static-server.mjs";

const bound = await startStaticServerBound("out", 4182);
const base = bound.url;

const browser = await chromium.launch();
const page = await browser.newPage();
const notFound = new Set();
page.on("response", (res) => {
  if (res.status() === 404 && res.url().includes("__next")) {
    notFound.add(res.url().replace(base, "").split("?")[0]);
  }
});

await page.goto(base + "/blog/us-share-of-global-source-plasma-2026", {
  waitUntil: "networkidle",
  timeout: 45000,
});
await page.waitForTimeout(2500);

const candidates = [
  'header a[href^="/blog/"]',
  'a[href="/blog/us-brokerage-fintech-investing-bonuses"]',
  'a[href^="/blog/"]',
];
let navOk = false;
for (const sel of candidates) {
  try {
    const href = await page.$eval(sel, (a) => a.getAttribute("href"));
    if (!href || href === "/blog/us-share-of-global-source-plasma-2026") continue;
    const before = notFound.size;
    await Promise.all([
      page.waitForURL((u) => u.pathname === href, { timeout: 20000 }),
      page.click(`${sel} >> nth=0`, { timeout: 8000 }),
    ]);
    await page.waitForTimeout(4000);
    console.log(`navigated via ${sel} -> ${href}`);
    console.log("new 404s during navigation:", notFound.size - before);
    navOk = true;
    break;
  } catch {
    continue;
  }
}
if (!navOk) console.log("no in-page blog link navigation succeeded");

console.log("== all __next 404s seen ==");
for (const u of [...notFound].sort()) console.log(" ", u);

await browser.close();
await stopStaticServer(bound.server).catch(() => {});
process.exit(0);
