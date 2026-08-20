/**
 * Adaptation economics — who pays for climate damage & adaptation before policy catches up.
 * Sources disclosed in SOURCE_NOTE. Figures are published estimates; do not sum across ledgers.
 */

export const HEADLINE = {
  /** UNEP AGR 2023/2024: developing-country adaptation finance needs (annual, this decade) */
  needsLowBn: 215,
  needsHighBn: 387,
  /** UNEP AGR 2024: international public adaptation finance to developing countries, 2022 */
  intlPublicAdapt2022Bn: 28,
  intlPublicAdapt2021Bn: 22,
  intlPublicAdapt2019Bn: 19,
  /** UNEP AGR 2024: adaptation finance gap vs 2022 flows */
  gapLowBn: 187,
  gapHighBn: 359,
  glasgowGapClosePct: 5,
  /** CPI GLCF 2026: tracked global climate finance (2024) and adaptation plateau */
  climateFinance2024Tn: 2.0,
  trackedAdapt2024Bn: 64,
  climateFinance2022Tn: 1.46,
  /** Swiss Re Institute: nat-cat protection gap & resilience index, 2025 */
  protectionGap2025Bn: 424,
  protectionGap2024Bn: 395,
  resilienceIndex2025Pct: 27.3,
  resilienceIndex2015Pct: 25.3,
} as const;

/** International public adaptation finance to developing countries (UNEP AGR series). */
export type AdaptFlowYear = {
  year: number;
  intlPublicBn: number;
  note?: string;
};

export const INTL_PUBLIC_ADAPT_FLOWS: AdaptFlowYear[] = [
  { year: 2016, intlPublicBn: 10 },
  { year: 2017, intlPublicBn: 11 },
  { year: 2018, intlPublicBn: 13 },
  { year: 2019, intlPublicBn: 19, note: "Glasgow Pact baseline year" },
  { year: 2020, intlPublicBn: 17 },
  { year: 2021, intlPublicBn: 22 },
  { year: 2022, intlPublicBn: 28, note: "Largest YoY rise since Paris" },
];

/** CPI tracked climate finance by use — illustrative annual snapshots (USD bn). */
export type ClimateUseRow = {
  year: number;
  mitigationBn: number;
  adaptationBn: number;
  dualBn: number;
};

export const CLIMATE_FINANCE_BY_USE: ClimateUseRow[] = [
  { year: 2019, mitigationBn: 520, adaptationBn: 30, dualBn: 40 },
  { year: 2020, mitigationBn: 580, adaptationBn: 46, dualBn: 50 },
  { year: 2021, mitigationBn: 780, adaptationBn: 49, dualBn: 55 },
  { year: 2022, mitigationBn: 1260, adaptationBn: 63, dualBn: 140 },
  { year: 2023, mitigationBn: 1450, adaptationBn: 63, dualBn: 160 },
  { year: 2024, mitigationBn: 1750, adaptationBn: 64, dualBn: 186 },
];

/**
 * Residual-risk bearers — who absorbs uninsured / underfunded climate damage.
 * Shares are editorial synthesis for visualization; dollar anchors are cited.
 */
export type ResidualBearer = {
  id: string;
  label: string;
  shortLabel: string;
  /** Illustrative share of residual economic loss burden (ex-insured) */
  sharePct: number;
  mechanism: string;
  color: string;
};

export const RESIDUAL_BEARERS: ResidualBearer[] = [
  {
    id: "households",
    label: "Uninsured households & SMEs",
    shortLabel: "Households / SMEs",
    sharePct: 42,
    mechanism: "Out-of-pocket rebuild, lost income, informal coping",
    color: "#f43f5e",
  },
  {
    id: "sovereigns",
    label: "National & local budgets",
    shortLabel: "Sovereign budgets",
    sharePct: 28,
    mechanism: "Emergency relief, reconstruction, contingent debt",
    color: "#0ea5e9",
  },
  {
    id: "insurers",
    label: "Insurers & reinsurers (covered share)",
    shortLabel: "Insurance",
    sharePct: 18,
    mechanism: "Claims paid within policy limits; ~27% global resilience",
    color: "#14b8a6",
  },
  {
    id: "donors",
    label: "International public adaptation finance",
    shortLabel: "Intl public",
    sharePct: 7,
    mechanism: "ODA-tagged adaptation; $28B to developing countries (2022)",
    color: "#a78bfa",
  },
  {
    id: "mdbs",
    label: "MDBs & climate funds (adaptation)",
    shortLabel: "MDBs / funds",
    sharePct: 5,
    mechanism: "Project finance, concessional windows, loss & damage seed",
    color: "#f59e0b",
  },
];

/** Swiss Re-style nat-cat economic vs insured loss path (global, USD bn). */
export type NatCatYear = {
  year: number;
  economicBn: number;
  insuredBn: number;
};

export const NAT_CAT_LOSS_PATH: NatCatYear[] = [
  { year: 2015, economicBn: 94, insuredBn: 28 },
  { year: 2016, economicBn: 180, insuredBn: 50 },
  { year: 2017, economicBn: 350, insuredBn: 144 },
  { year: 2018, economicBn: 176, insuredBn: 86 },
  { year: 2019, economicBn: 146, insuredBn: 60 },
  { year: 2020, economicBn: 210, insuredBn: 89 },
  { year: 2021, economicBn: 280, insuredBn: 111 },
  { year: 2022, economicBn: 275, insuredBn: 125 },
  { year: 2023, economicBn: 280, insuredBn: 108 },
  { year: 2024, economicBn: 320, insuredBn: 140 },
  { year: 2025, economicBn: 368, insuredBn: 145 },
];

/** Regional protection / resilience snapshot for ranked panel. */
export type RegionResilience = {
  id: string;
  region: string;
  shortLabel: string;
  /** Insurance penetration vs exposure — higher = more covered */
  resiliencePct: number;
  protectionGapBn: number;
  income: "advanced" | "emerging" | "developing";
};

export const REGION_RESILIENCE: RegionResilience[] = [
  {
    id: "na",
    region: "North America",
    shortLabel: "N. America",
    resiliencePct: 42,
    protectionGapBn: 95,
    income: "advanced",
  },
  {
    id: "eu",
    region: "Western Europe",
    shortLabel: "W. Europe",
    resiliencePct: 38,
    protectionGapBn: 55,
    income: "advanced",
  },
  {
    id: "apac-adv",
    region: "Advanced Asia-Pacific",
    shortLabel: "Adv. Asia-Pac",
    resiliencePct: 30,
    protectionGapBn: 48,
    income: "advanced",
  },
  {
    id: "lac",
    region: "Latin America & Caribbean",
    shortLabel: "LAC",
    resiliencePct: 18,
    protectionGapBn: 62,
    income: "emerging",
  },
  {
    id: "mena",
    region: "Middle East & N. Africa",
    shortLabel: "MENA",
    resiliencePct: 14,
    protectionGapBn: 40,
    income: "emerging",
  },
  {
    id: "ssa",
    region: "Sub-Saharan Africa",
    shortLabel: "SSA",
    resiliencePct: 6,
    protectionGapBn: 58,
    income: "developing",
  },
  {
    id: "sa",
    region: "South Asia",
    shortLabel: "South Asia",
    resiliencePct: 8,
    protectionGapBn: 66,
    income: "developing",
  },
];

export type NeedsScenario = "low" | "mid" | "high";

export function needsBn(scenario: NeedsScenario): number {
  if (scenario === "low") return HEADLINE.needsLowBn;
  if (scenario === "high") return HEADLINE.needsHighBn;
  return Math.round((HEADLINE.needsLowBn + HEADLINE.needsHighBn) / 2);
}

export function gapBn(scenario: NeedsScenario): number {
  const needs = needsBn(scenario);
  return Math.max(0, needs - HEADLINE.intlPublicAdapt2022Bn);
}

export function glasgowTargetBn(): number {
  return HEADLINE.intlPublicAdapt2019Bn * 2;
}

export function rankedRegionsBy(
  metric: "gap" | "resilience",
): RegionResilience[] {
  const rows = [...REGION_RESILIENCE];
  if (metric === "resilience") {
    return rows.sort((a, b) => a.resiliencePct - b.resiliencePct);
  }
  return rows.sort((a, b) => b.protectionGapBn - a.protectionGapBn);
}

export function natCatWithGap(): Array<
  NatCatYear & { uninsuredBn: number; insuredSharePct: number }
> {
  return NAT_CAT_LOSS_PATH.map((d) => ({
    ...d,
    uninsuredBn: Math.max(0, d.economicBn - d.insuredBn),
    insuredSharePct: d.economicBn
      ? Math.round((1000 * d.insuredBn) / d.economicBn) / 10
      : 0,
  }));
}

export function fmtBn(n: number): string {
  if (Math.abs(n) >= 1000) return `$${(n / 1000).toFixed(2)}T`;
  return `$${n.toLocaleString("en-US")}B`;
}

export function fmtTn(n: number): string {
  return `$${n.toFixed(n >= 1 ? 1 : 2)}T`;
}

export function fmtPct(n: number): string {
  return `${n}%`;
}

export const SOURCES = [
  {
    label: "UNEP Adaptation Gap Report 2024",
    href: "https://www.unep.org/resources/adaptation-gap-report-2024",
  },
  {
    label: "CPI Global Landscape of Climate Finance 2026",
    href: "https://glcf.climatepolicyinitiative.org/",
  },
  {
    label: "Swiss Re Institute — nat-cat protection gap",
    href: "https://www.swissre.com/institute/research/topics-and-risk-dialogues/climate-and-natural-catastrophe-risk/growing-exposure/Natcat-protection-gap.html",
  },
] as const;

export const SOURCE_NOTE =
  "Adaptation needs ($215–387B/yr) and international public adaptation flows ($28B in 2022; $19B in 2019) from UNEP Adaptation Gap Report 2024. Gap ($187–359B) and Glasgow ~5% close share from the same report. Tracked global climate finance (~$2T in 2024) and adaptation plateau (~$64B) from CPI Global Landscape of Climate Finance 2026; earlier CPI prints used for 2019–2022 composition shape. Nat-cat economic/insured paths and $424B 2025 protection gap / ~27% resilience index from Swiss Re Institute publications — annual loss levels are rounded for charting. Residual-bearer shares and regional resilience ranks are editorial synthesis for visualization, not official UNEP/CPI/Swiss Re allocations.";
