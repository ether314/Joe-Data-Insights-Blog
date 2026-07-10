import fs from "fs";

const src = fs.readFileSync("src/data/ai-data-centers-data.ts", "utf8");
const sites = [...src.matchAll(/costUsd:\s*"([^"]+)"/g)].map((m) => m[1]);

function unitToBillions(n, unit) {
  const u = unit.toLowerCase();
  if (u === "t" || u === "trillion") return n * 1000;
  if (u === "m" || u === "mn" || u === "million") return n / 1000;
  if (u === "k") return n / 1_000_000;
  return n;
}

function extractCostAmountsBillions(costText) {
  const dashRange = costText.match(
    /(?:\$|€|£|c\$)\s*~?\s*([\d,]+(?:\.\d+)?)\s*([bBmMtT])?\s*[–\-]\s*(?:\$|€|£|c\$)?\s*([\d,]+(?:\.\d+)?)\s*([bBmMtT])?/i,
  );
  if (dashRange) {
    const u1 = (dashRange[2] || dashRange[4] || "b").toLowerCase();
    const u2 = (dashRange[4] || dashRange[2] || "b").toLowerCase();
    return [
      unitToBillions(Number(dashRange[1].replace(/,/g, "")), u1),
      unitToBillions(Number(dashRange[3].replace(/,/g, "")), u2),
    ];
  }

  const amounts = [];
  const re =
    /(?:\$|€|£|c\$|cad\s*\$)\s*~?\s*([\d,]+(?:\.\d+)?)\s*([bBmMtT]|bn|mn|trillion|billion|million)?/gi;
  let m;
  while ((m = re.exec(costText)) !== null) {
    const n = Number(m[1].replace(/,/g, ""));
    const unit = (m[2] || "b").toLowerCase();
    amounts.push(unitToBillions(n, unit));
  }
  return amounts;
}

function isUmbrellaProgramCost(costText) {
  const text = costText.toLowerCase();
  if (text.includes("part of")) return true;
  if (/~\$\d[\d,.]*\s*[bmt]?\s*program\b/.test(text)) return true;
  if (/\$\d[\d,.]*\s*[bmt]?\s*\(\s*program\s*\)/.test(text)) return true;
  if (/\d+\s*(?:mw|gw)\s+program/.test(text) && !/\$|€|£|c\$/.test(costText)) return true;
  return false;
}

function parsePhaseCostBillions(costText) {
  const phaseMatch = costText.match(
    /(?:\$|€|£|c\$)\s*~?\s*([\d,]+(?:\.\d+)?)\s*([bBmMtT])?\s*phase/i,
  );
  if (!phaseMatch) return null;
  const unit = (phaseMatch[2] || "b").toLowerCase();
  return unitToBillions(Number(phaseMatch[1].replace(/,/g, "")), unit);
}

function costEstimateBillions(costText) {
  const text = costText.toLowerCase();
  if (text.includes("tbd") || text.includes("undisclosed") || isUmbrellaProgramCost(costText)) {
    return { low: 0, base: 0, high: 0, known: false };
  }
  const phase = parsePhaseCostBillions(costText);
  if (phase !== null) {
    return { low: phase, base: phase, high: phase, known: true };
  }
  const amounts = extractCostAmountsBillions(costText);
  if (amounts.length === 0) return { low: 0, base: 0, high: 0, known: false };
  const lo = Math.min(...amounts);
  const hi = Math.max(...amounts);
  if (costText.includes("+") && amounts.length === 1) {
    const v = amounts[0];
    return { low: v, base: v * 1.15, high: v * 1.3, known: true };
  }
  const base = amounts.length === 1 ? amounts[0] : (lo + hi) / 2;
  return { low: lo, base, high: hi, known: true };
}

function fmtBillionsUsd(b) {
  if (b >= 1000) return `$${(b / 1000).toFixed(2)}T`;
  if (b >= 10) return `$${Math.round(b)}B`;
  if (b >= 1) return `$${b.toFixed(1)}B`;
  if (b >= 0.001) return `$${Math.round(b * 1000)}M`;
  return `$${b.toFixed(2)}B`;
}

const rollup = sites.reduce(
  (acc, costUsd) => {
    const e = costEstimateBillions(costUsd);
    if (!e.known) {
      acc.unknown += 1;
      return acc;
    }
    acc.low += e.low;
    acc.base += e.base;
    acc.high += e.high;
    acc.known += 1;
    acc.rows.push({ costUsd, ...e });
    return acc;
  },
  { low: 0, base: 0, high: 0, known: 0, unknown: 0, rows: [] },
);

console.log("Rollup:", {
  known: rollup.known,
  unknown: rollup.unknown,
  low: fmtBillionsUsd(rollup.low),
  base: fmtBillionsUsd(rollup.base),
  high: fmtBillionsUsd(rollup.high),
});

const top = [...rollup.rows].sort((a, b) => b.base - a.base).slice(0, 10);
console.log("\nTop 10 by base:");
for (const r of top) console.log(`  ${fmtBillionsUsd(r.base).padStart(8)}  ${r.costUsd}`);

// Test cases that were broken before
const tests = [
  "~$400B program",
  "$720M",
  "$8–10B (Phase 1)",
  "$295B (2026–2030)",
  "€75B (~$80B)",
  "$27B–$200B",
  "Part of €230B EOIs",
  "Undisclosed",
];
console.log("\nParser tests:");
for (const t of tests) {
  const e = costEstimateBillions(t);
  console.log(`  ${t.padEnd(28)} -> base=${e.known ? fmtBillionsUsd(e.base) : "excluded"}`);
}
