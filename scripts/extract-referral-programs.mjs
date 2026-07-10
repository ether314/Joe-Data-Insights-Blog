import fs from "fs";

const src = fs.readFileSync(
  "C:/Users/ether/.cursor/projects/empty-window/canvases/us-investing-referral-programs.canvas.tsx",
  "utf8",
);
const m = src.match(/const PROGRAMS: ReferralProgram\[\] = \[([\s\S]*?)\];\n\nconst CATEGORIES/);
if (!m) throw new Error("no match");

const header = `export type Status = "Active" | "Expired" | "Uncertain";

export type RewardType =
  | "Cash"
  | "Points"
  | "Miles"
  | "Gift card"
  | "Account credit"
  | "APY boost"
  | "Stock"
  | "Crypto"
  | "Fee discount"
  | "Subscription credit"
  | "Revenue share"
  | "Mixed"
  | "None"
  | "Other";

export type ReferralProgram = {
  id: string;
  company: string;
  category: string;
  categoryRaw: string;
  referrerGets: string;
  refereeGets: string;
  referrerGetsLow: string;
  referrerGetsHigh: string;
  refereeGetsLow: string;
  refereeGetsHigh: string;
  rewardType: RewardType;
  estReferrerValue: string;
  annualCost: string;
  annualCostUsd: number;
  costNotes: string;
  estNetValue: string;
  referrerCashUsd: number;
  refereeCashUsd: number;
  referrerCashUsdMin: number;
  referrerCashUsdMax: number;
  refereeCashUsdMin: number;
  refereeCashUsdMax: number;
  estNetUsd: number;
  depositTiers: string;
  refereeMust: string;
  referrerCap: string;
  status: Status;
};

export const PROGRAMS: ReferralProgram[] = [
${m[1]}];
`;

const footer = `
export const CATEGORIES = [
  "All",
  "Banks & credit unions",
  "Credit cards",
  "Investing & retirement",
  "Crypto",
  "Lending & mortgages",
  "Insurance",
  "Real estate & property",
  "Business & SMB finance",
  "Accounting & tax",
  "Credit & identity",
  "Benefits & pre-tax",
  "Family & education",
  "Cashback & apps",
  "Gig & creator",
  "Other",
] as const;

export type CategoryFilter = (typeof CATEGORIES)[number];

export const STATUSES = ["All", "Active", "Uncertain", "Expired"] as const;
export type StatusFilter = (typeof STATUSES)[number];

export const REWARD_TYPES = [
  "All",
  "Cash",
  "Points",
  "Miles",
  "Gift card",
  "Account credit",
  "APY boost",
  "Stock",
  "Crypto",
  "Mixed",
  "None",
  "Other",
] as const;

export type RewardTypeFilter = (typeof REWARD_TYPES)[number];

export type SortKey =
  | "company"
  | "youLow"
  | "youHigh"
  | "theyLow"
  | "theyHigh"
  | "cost"
  | "net"
  | "category"
  | "reward"
  | "tiers"
  | "must"
  | "cap"
  | "status";

export type SortDir = "asc" | "desc";

const TEXT_SORT_KEYS = new Set<SortKey>([
  "company",
  "category",
  "reward",
  "tiers",
  "must",
  "cap",
  "status",
]);

export function defaultSortDir(key: SortKey): SortDir {
  return TEXT_SORT_KEYS.has(key) ? "asc" : "desc";
}

export function comparePrograms(a: ReferralProgram, b: ReferralProgram, key: SortKey): number {
  switch (key) {
    case "company":
      return a.company.localeCompare(b.company);
    case "youLow":
      return a.referrerCashUsdMin - b.referrerCashUsdMin;
    case "youHigh":
      return a.referrerCashUsdMax - b.referrerCashUsdMax;
    case "theyLow":
      return a.refereeCashUsdMin - b.refereeCashUsdMin;
    case "theyHigh":
      return a.refereeCashUsdMax - b.refereeCashUsdMax;
    case "cost":
      return a.annualCostUsd - b.annualCostUsd;
    case "net":
      return a.estNetUsd - b.estNetUsd;
    case "category":
      return a.category.localeCompare(b.category);
    case "reward":
      return a.rewardType.localeCompare(b.rewardType);
    case "tiers":
      return a.depositTiers.localeCompare(b.depositTiers);
    case "must":
      return a.refereeMust.localeCompare(b.refereeMust);
    case "cap":
      return a.referrerCap.localeCompare(b.referrerCap);
    case "status":
      return a.status.localeCompare(b.status);
  }
}

export const STATS = {
  programCount: PROGRAMS.length,
  withReferrerPayout: PROGRAMS.filter(
    (p) => p.rewardType !== "None" && p.estReferrerValue !== "$0",
  ).length,
  activeWithPayout: PROGRAMS.filter(
    (p) =>
      p.status === "Active" &&
      p.rewardType !== "None" &&
      p.estReferrerValue !== "$0",
  ).length,
  categoryCount: CATEGORIES.length - 1,
  creditCardCount: PROGRAMS.filter((p) => p.category === "Credit cards").length,
};

export const CHART_COLORS = {
  referrer: "#06b6d4",
  referee: "#f59e0b",
  accent: "#6366f1",
  success: "#22c55e",
};
`;

fs.writeFileSync("src/data/referral-programs-data.ts", header + footer);
const count = (header + footer).match(/\{ id:/g)?.length ?? 0;
console.log("Extracted", count, "programs");
