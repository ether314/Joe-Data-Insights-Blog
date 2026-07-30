/**
 * Scans src/data/posts.ts for GFM markdown table blocks.
 * Emits artifacts/blog-table-audit.json.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const postsPath = join(root, "src/data/posts.ts");
const source = readFileSync(postsPath, "utf8");

const GFM_SEPARATOR = /^\|[\s:|-]+\|$/;

function parsePosts(sourceText) {
  const posts = [];
  const blockRe =
    /\{\s*id:\s*"([^"]+)"[\s\S]*?slug:\s*"([^"]+)"[\s\S]*?content:\s*`([\s\S]*?)`[\s\S]*?\}/g;
  let match;
  while ((match = blockRe.exec(sourceText)) !== null) {
    posts.push({ postId: match[1], slug: match[2], content: match[3] });
  }
  return posts;
}

function findTables(content) {
  const lines = content.split(/\r?\n/);
  const tables = [];
  let currentHeading = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const headingMatch = line.match(/^##\s+(.+?)\s*$/);
    if (headingMatch) {
      currentHeading = headingMatch[1].trim();
    }

    if (!GFM_SEPARATOR.test(line.trim())) continue;

    const headerLine = lines[i - 1]?.trim() ?? "";
    if (!headerLine.startsWith("|")) continue;

    const dataRows = [];
    for (let j = i + 1; j < lines.length; j++) {
      const row = lines[j].trim();
      if (!row.startsWith("|")) break;
      dataRows.push(row);
    }

    const sampleFirstRow = dataRows[0]
      ? dataRows[0]
          .replace(/^\|/, "")
          .replace(/\|$/, "")
          .split("|")
          .map((c) => c.trim())
          .join(" | ")
      : null;

    tables.push({
      sectionHeading: currentHeading,
      rowCount: dataRows.length,
      sampleFirstRow,
      headerLine: headerLine
        .replace(/^\|/, "")
        .replace(/\|$/, "")
        .split("|")
        .map((c) => c.trim())
        .join(" | "),
    });
  }

  return tables;
}

const posts = parsePosts(source);
const hits = [];

for (const post of posts) {
  const tables = findTables(post.content);
  if (tables.length === 0) continue;

  for (const table of tables) {
    hits.push({
      slug: post.slug,
      postId: post.postId,
      sectionHeading: table.sectionHeading,
      rowCount: table.rowCount,
      sampleFirstRow: table.sampleFirstRow,
      headerLine: table.headerLine,
    });
  }
}

const affectedSlugs = [...new Set(hits.map((h) => h.slug))].sort();

const audit = {
  generatedAt: new Date().toISOString(),
  sourceFile: "src/data/posts.ts",
  scanCriteria:
    "GFM table separator line (pipe-delimited row followed by |---| or |:---| style separator)",
  totalPostsScanned: posts.length,
  affectedSlugCount: affectedSlugs.length,
  affectedSlugs,
  hits,
};

const outPath = join(root, "artifacts/blog-table-audit.json");
writeFileSync(outPath, JSON.stringify(audit, null, 2) + "\n");

console.log(JSON.stringify({ affectedSlugCount: affectedSlugs.length, affectedSlugs, hits }, null, 2));
