import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});

await page.goto("http://127.0.0.1:4173/blog/global-ai-data-center-build-tracker", {
  waitUntil: "networkidle",
  timeout: 45000,
});
await new Promise((r) => setTimeout(r, 5000));

const body = await page.locator("body").innerText();
console.log("--- visible text (first 800 chars) ---");
console.log(body.slice(0, 800));
console.log("--- errors ---");
for (const e of errors) console.log(e.slice(0, 500));
console.log("loading visible:", body.includes("Loading interactive charts"));

await browser.close();
