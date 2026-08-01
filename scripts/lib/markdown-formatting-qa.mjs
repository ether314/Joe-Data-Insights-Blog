/**
 * Smoke/QA helper: fail when markdown emphasis markers are left as plain text
 * (e.g. `*global*` or `**bold**`) instead of rendering as <em>/<strong>.
 */

/** Patterns that should never appear in rendered prose textContent. */
const UNRESOLVED_MARKERS = [
  {
    name: "bold",
    // **phrase** left literal
    re: /\*\*[^*\n]+?\*\*/g,
  },
  {
    name: "italic-star",
    // *phrase* but not **bold** leftovers
    re: /(?<!\*)\*(?!\*)([^*\n]+?)(?<!\*)\*(?!\*)/g,
  },
  {
    name: "italic-underscore",
    // _phrase_ with word boundaries (skip snake_case)
    re: /(?<![\w])_([^_\n]+?)_(?![\w])/g,
  },
];

/**
 * Scan rendered article prose for leftover markdown formatting symbols.
 * @param {import("playwright").Page} page
 * @returns {Promise<string[]>} sample unresolved snippets (empty = pass)
 */
export async function findUnresolvedMarkdownMarkers(page) {
  const prose = page.locator(".prose-content").first();
  if ((await prose.count()) === 0) return [];

  return prose.evaluate((el, patterns) => {
    const text = el.textContent || "";
    /** @type {string[]} */
    const hits = [];
    for (const { name, source, flags } of patterns) {
      const re = new RegExp(source, flags);
      for (const match of text.matchAll(re)) {
        hits.push(`${name}: ${match[0]}`);
        if (hits.length >= 12) return hits;
      }
    }
    return hits;
  }, UNRESOLVED_MARKERS.map(({ name, re }) => ({
    name,
    source: re.source,
    flags: re.flags,
  })));
}
