#!/usr/bin/env node
/**
 * Hand-built articles live as ready-made HTML in public/blog/<slug>.html. Those files link the
 * hashed font and stylesheet files of whichever build they were captured from, and every rebuild
 * renames them (content hashes). After `next build`, point each static article at the font and
 * stylesheet files the fresh build actually ships, using a generated post page as the reference
 * (matched by order). Runs after fix-segment-payloads.mjs; safe to run more than once.
 */
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const outBlog = path.join(root, "out", "blog");
const staticDir = path.join(root, "public", "blog");

const staticFiles = fs.existsSync(staticDir)
  ? fs.readdirSync(staticDir).filter((f) => f.endsWith(".html"))
  : [];
if (staticFiles.length === 0) {
  console.log("sync-static-article-assets: no hand-built articles, nothing to do");
  process.exit(0);
}

const refFile = fs
  .readdirSync(outBlog)
  .find((f) => f.endsWith(".html") && !staticFiles.includes(f));
if (!refFile) throw new Error("sync-static-article-assets: no generated post page to use as reference");
const refHtml = fs.readFileSync(path.join(outBlog, refFile), "utf8");

const FONT_RE = /<link[^>]*href="(\/_next\/static\/media\/[^"]+\.woff2)"[^>]*>/g;
const CSS_RE = /<link[^>]*rel="stylesheet"[^>]*href="(\/_next\/static\/chunks\/[^"]+\.css)"[^>]*>/g;
const hrefs = (html, re) => [...html.matchAll(re)].map((m) => m[1]);

const refFonts = hrefs(refHtml, FONT_RE);
const refCss = hrefs(refHtml, CSS_RE);

for (const file of staticFiles) {
  const target = path.join(outBlog, file);
  let html = fs.readFileSync(target, "utf8");
  let changed = 0;
  for (const [re, refs, label] of [
    [FONT_RE, refFonts, "font"],
    [CSS_RE, refCss, "stylesheet"],
  ]) {
    const own = hrefs(html, re);
    if (own.length !== refs.length) {
      throw new Error(
        `sync-static-article-assets: ${file} has ${own.length} ${label} links, reference page has ${refs.length}`,
      );
    }
    own.forEach((href, i) => {
      if (href !== refs[i]) {
        html = html.split(href).join(refs[i]);
        changed++;
      }
    });
  }
  fs.writeFileSync(target, html);
  for (const href of [...hrefs(html, FONT_RE), ...hrefs(html, CSS_RE)]) {
    if (!fs.existsSync(path.join(root, "out", href))) {
      throw new Error(`sync-static-article-assets: ${file} still references missing ${href}`);
    }
  }
  console.log(`sync-static-article-assets: ${file}: repointed ${changed} link(s) to the current build`);
}
