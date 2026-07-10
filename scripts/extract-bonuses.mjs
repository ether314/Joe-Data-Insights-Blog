import fs from "fs";

const src = fs.readFileSync(
  "C:/Users/ether/.cursor/projects/empty-window/canvases/us-brokerage-investing-bonuses.canvas.tsx",
  "utf8",
);
const m = src.match(/const OFFERS: Offer\[\] = \[([\s\S]*?)\];\n\nconst CATEGORIES/);
if (!m) throw new Error("no match");

const footer = `
export const CATEGORIES = ["All", "Traditional", "Fintech", "Robo-advisor", "Micro-invest"] as const;
export type CategoryFilter = (typeof CATEGORIES)[number];

export function parseMoneyMax(s: string): number {
  if (!s || s === "None" || s === "—" || s.startsWith("—")) return 0;
  const amounts: number[] = [];
  for (const match of s.matchAll(/\\$([\\d,]+(?:\\.\\d+)?)(?:\\s*([kKmM])(?![a-zA-Z]))?/gi)) {
    let n = Number(match[1].replace(/,/g, ""));
    const suffix = (match[2] || "").toLowerCase();
    if (suffix === "k") n *= 1000;
    if (suffix === "m") n *= 1_000_000;
    amounts.push(n);
  }
  return amounts.length ? Math.max(...amounts) : 0;
}

export function hasReferrerPayout(o: Offer): boolean {
  return (
    o.maxReferrer !== "None" &&
    !o.maxReferrer.startsWith("—") &&
    o.maxReferrer !== "Varies" &&
    o.maxReferrer !== "Puzzle pieces" &&
    o.maxReferrer !== "Occasional free stocks"
  );
}

export function enrichOffer(o: Offer) {
  return {
    ...o,
    maxNewUserNum: parseMoneyMax(o.maxNewUser),
    maxReferrerNum: parseMoneyMax(o.maxReferrer),
    minDepositNum: parseMoneyMax(o.minDeposit),
    hasActiveBonus: o.tiers.length > 0,
    hasReferrerPayout: hasReferrerPayout(o),
  };
}

export type EnrichedOffer = ReturnType<typeof enrichOffer>;

export const ENRICHED_OFFERS = OFFERS.map(enrichOffer);

export const STATS = {
  platformCount: OFFERS.length,
  activeBonusCount: ENRICHED_OFFERS.filter((o) => o.hasActiveBonus).length,
  bothSideCount: ENRICHED_OFFERS.filter((o) => o.hasReferrerPayout).length,
  highestBonus: ENRICHED_OFFERS.reduce((best, o) =>
    o.maxNewUserNum > best.maxNewUserNum ? o : best,
  ENRICHED_OFFERS[0]),
};

export const CATEGORY_COLORS: Record<OfferCategory, string> = {
  Traditional: "#3b82f6",
  Fintech: "#06b6d4",
  "Robo-advisor": "#6366f1",
  "Micro-invest": "#22c55e",
};

export const CHART_COLORS = {
  newUser: "#f59e0b",
  referrer: "#06b6d4",
  accent: "#6366f1",
};

export function fmtUsd(n: number): string {
  if (n >= 1_000_000) return "$" + (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1000) return "$" + (n / 1000).toFixed(0) + "k";
  if (n > 0) return "$" + n.toLocaleString();
  return "—";
}
`;

const header = `export type BonusTier = { deposit: string; newUser: string; referrer: string };

export type OfferCategory = "Traditional" | "Fintech" | "Robo-advisor" | "Micro-invest";
export type OfferType = "Signup" | "Referral" | "Both";

export type Offer = {
  id: string;
  company: string;
  category: OfferCategory;
  offerType: OfferType;
  maxNewUser: string;
  maxReferrer: string;
  minDeposit: string;
  holdPeriod: string;
  expires: string;
  tiers: BonusTier[];
  referrerNotes: string;
  caveats: string;
  source: string;
};

export const OFFERS: Offer[] = [
${m[1]}];
`;

fs.writeFileSync("src/data/brokerage-bonuses-data.ts", header + footer);
console.log("OK", (header + footer).length);
