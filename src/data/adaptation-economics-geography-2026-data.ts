/**
 * Adaptation economics — geography lens (2026).
 * Core question: Where does activity, risk, or capacity concentrate geographically?
 * Who pays for climate damage and adaptation before policy catches up?
 *
 * Complements concentration (Top-k / HHI bearers), research stock ledger, and
 * August/Q3 vintage updates with maps that disagree: protection-gap dollars,
 * MDB recipient geography, donor-origin blocs, economic-loss sleeves, and
 * resilience×gap mismatch.
 *
 * Primary sources (theme-consistent):
 * - Swiss Re Institute sigma / protection-gap framing (~$424B; resilience ~27%)
 * - MDB Joint Summary (13 Jul 2026) — LMIC adaptation $35B (2025)
 * - OECD climate finance provided/mobilised 2013–2024 (May 2026) — adapt $34.7B
 * - UNEP Adaptation Gap Report 2025 — needs $310–365B/yr by 2035
 */

export type Confidence = "disclosed" | "estimated" | "constructed";

export const SOURCE_NOTE =
  "Protection-gap regional dollars are estimated allocations of the Swiss Re-style $424B stock used across theme posts — not a country extract. MDB recipient-region shares of the $35B LMIC adaptation tip are estimated from published MDB climate-finance regional patterns and labeled estimated. Donor-origin blocs roll estimated OECD bilateral donor shares into host geography. Economic-loss regional sleeves are constructed incidence consistent with FY 2025 ~$368B economic / ~$107B insured framing. Do not splice OECD, UNEP, CPI, MDB, and Swiss Re ledgers into one total.";

export const PRIOR_RESEARCH_PATH = "/blog/adaptation-economics-research-2026";
export const PRIOR_CONCENTRATION_PATH =
  "/blog/adaptation-economics-concentration-2026";
export const PRIOR_CONC_Q3_PATH =
  "/blog/adaptation-economics-concentration-2026q3";
export const PRIOR_CONC_608_PATH =
  "/blog/adaptation-economics-concentration-202608";
export const PRIOR_UPDATE_608_PATH = "/blog/adaptation-economics-update-202608";
export const PRIOR_UPDATE_PATH = "/blog/adaptation-economics-update-2026";

export const SOURCES = [
  {
    label: "MDB — 2025 Joint Summary Report on Climate Finance (13 Jul 2026)",
    url: "https://www.eib.org/en/publications/20260117-2025-joint-summary-report-on-mdbs-climate-finance",
  },
  {
    label: "OECD — Climate Finance Provided and Mobilised 2013–2024 (May 2026)",
    url: "https://www.oecd.org/en/publications/climate-finance-provided-and-mobilised-by-developed-countries-in-2013-2024_353d5864-en.html",
  },
  {
    label: "UNEP — Adaptation Gap Report 2025",
    url: "https://www.unep.org/resources/adaptation-gap-report-2025",
  },
  {
    label: "Swiss Re Institute — sigma / protection gap framing",
    url: "https://www.swissre.com/institute.html",
  },
  {
    label: "Theme — concentration lens (FY)",
    url: PRIOR_CONCENTRATION_PATH,
  },
  {
    label: "Theme — August concentration lock",
    url: PRIOR_CONC_608_PATH,
  },
];

export const HEADLINE = {
  /** Protection-gap geography ($424B Swiss Re-style stock) */
  protectionGapBn: 424,
  resilienceIndexPct: 27.3,
  top1GapRegionSharePct: 22.4,
  top1GapRegionLabel: "North America",
  top1GapRegionBn: 95,
  top3GapRegionSharePct: 52.6,
  top3GapRegionLabel: "N. America · South Asia · LAC",
  gapRegionHhi: 1518,
  /** MDB LMIC adaptation recipient geography ($35B 2025) */
  mdbLmicAdapt2025Bn: 35,
  top1FlowRegionSharePct: 28,
  top1FlowRegionLabel: "Sub-Saharan Africa",
  top1FlowRegionBn: 9.8,
  top3FlowRegionSharePct: 68,
  top3FlowRegionLabel: "SSA · South Asia · LAC",
  /** Donor-origin bloc of OECD adapt $34.7B */
  oecdAdapt2024Bn: 34.7,
  top1DonorBlocSharePct: 52,
  top1DonorBlocLabel: "Western Europe",
  /** Economic loss geography (FY 2025 framing) */
  economicLoss2025Bn: 368,
  insuredLoss2025Bn: 107,
  insuredShare2025Pct: 29.1,
  top1LossRegionSharePct: 34,
  top1LossRegionLabel: "North America",
  /** Scarcity / needs */
  needsMidBn: 337.5,
  needsVsMdbMultipleMid: 9.6,
  /** Mismatch punchline */
  naGapSharePct: 22.4,
  naFlowSharePct: 4,
  ssaGapSharePct: 13.7,
  ssaFlowSharePct: 28,
} as const;

export type RegionGap = {
  id: string;
  region: string;
  short: string;
  gapBn: number;
  gapSharePct: number;
  cumulativeSharePct: number;
  resiliencePct: number;
  income: "advanced" | "emerging" | "developing";
  confidence: Confidence;
  fill: string;
  note?: string;
};

/** Estimated regional allocation of Swiss Re-style $424B protection-gap stock. */
export const REGION_GAPS: RegionGap[] = [
  {
    id: "na",
    region: "North America",
    short: "N. America",
    gapBn: 95,
    gapSharePct: 22.4,
    cumulativeSharePct: 22.4,
    resiliencePct: 42,
    income: "advanced",
    confidence: "estimated",
    fill: "#0ea5e9",
    note: "Largest absolute gap $; highest resilience of the set",
  },
  {
    id: "sa",
    region: "South Asia",
    short: "South Asia",
    gapBn: 66,
    gapSharePct: 15.6,
    cumulativeSharePct: 38.0,
    resiliencePct: 8,
    income: "developing",
    confidence: "estimated",
    fill: "#f43f5e",
    note: "High absolute gap + thin insurance penetration",
  },
  {
    id: "lac",
    region: "Latin America & Caribbean",
    short: "LAC",
    gapBn: 62,
    gapSharePct: 14.6,
    cumulativeSharePct: 52.6,
    resiliencePct: 18,
    income: "emerging",
    confidence: "estimated",
    fill: "#f59e0b",
  },
  {
    id: "ssa",
    region: "Sub-Saharan Africa",
    short: "SSA",
    gapBn: 58,
    gapSharePct: 13.7,
    cumulativeSharePct: 66.3,
    resiliencePct: 6,
    income: "developing",
    confidence: "estimated",
    fill: "#8b5cf6",
    note: "Lowest resilience; largest MDB recipient share",
  },
  {
    id: "eu",
    region: "Western Europe",
    short: "W. Europe",
    gapBn: 55,
    gapSharePct: 13.0,
    cumulativeSharePct: 79.3,
    resiliencePct: 38,
    income: "advanced",
    confidence: "estimated",
    fill: "#14b8a6",
  },
  {
    id: "apac",
    region: "Advanced Asia-Pacific",
    short: "Adv. APAC",
    gapBn: 48,
    gapSharePct: 11.3,
    cumulativeSharePct: 90.6,
    resiliencePct: 30,
    income: "advanced",
    confidence: "estimated",
    fill: "#64748b",
  },
  {
    id: "mena",
    region: "Middle East & N. Africa",
    short: "MENA",
    gapBn: 40,
    gapSharePct: 9.4,
    cumulativeSharePct: 100,
    resiliencePct: 14,
    income: "emerging",
    confidence: "estimated",
    fill: "#ec4899",
  },
];

export type FlowRecipient = {
  id: string;
  region: string;
  short: string;
  amountBn: number;
  sharePct: number;
  cumulativeSharePct: number;
  gapSharePct: number;
  flowMinusGapPp: number;
  confidence: Confidence;
  fill: string;
  note?: string;
};

/**
 * Estimated destination-region shares of MDB LMIC adaptation $35B (2025).
 * Closes to 100%; labeled estimated — not an official Joint Summary region table.
 */
export const FLOW_RECIPIENTS: FlowRecipient[] = [
  {
    id: "ssa",
    region: "Sub-Saharan Africa",
    short: "SSA",
    amountBn: 9.8,
    sharePct: 28.0,
    cumulativeSharePct: 28.0,
    gapSharePct: 13.7,
    flowMinusGapPp: 14.3,
    confidence: "estimated",
    fill: "#8b5cf6",
    note: "Largest MDB adaptation sleeve vs moderate gap $ share",
  },
  {
    id: "sa",
    region: "South Asia",
    short: "South Asia",
    amountBn: 7.7,
    sharePct: 22.0,
    cumulativeSharePct: 50.0,
    gapSharePct: 15.6,
    flowMinusGapPp: 6.4,
    confidence: "estimated",
    fill: "#f43f5e",
  },
  {
    id: "lac",
    region: "Latin America & Caribbean",
    short: "LAC",
    amountBn: 6.3,
    sharePct: 18.0,
    cumulativeSharePct: 68.0,
    gapSharePct: 14.6,
    flowMinusGapPp: 3.4,
    confidence: "estimated",
    fill: "#f59e0b",
  },
  {
    id: "eap",
    region: "Developing East Asia & Pacific",
    short: "Dev. EAP",
    amountBn: 4.9,
    sharePct: 14.0,
    cumulativeSharePct: 82.0,
    gapSharePct: 11.3,
    flowMinusGapPp: 2.7,
    confidence: "estimated",
    fill: "#64748b",
    note: "EAP developing sleeve; Adv. APAC sits mostly outside LMIC tip",
  },
  {
    id: "mena",
    region: "Middle East & N. Africa",
    short: "MENA",
    amountBn: 3.5,
    sharePct: 10.0,
    cumulativeSharePct: 92.0,
    gapSharePct: 9.4,
    flowMinusGapPp: 0.6,
    confidence: "estimated",
    fill: "#ec4899",
  },
  {
    id: "eca",
    region: "Europe & Central Asia (LMIC)",
    short: "ECA LMIC",
    amountBn: 2.8,
    sharePct: 8.0,
    cumulativeSharePct: 100,
    gapSharePct: 13.0,
    flowMinusGapPp: -5.0,
    confidence: "estimated",
    fill: "#14b8a6",
    note: "Small LMIC sleeve; W. Europe gap sits outside MDB LMIC perimeter",
  },
];

export type DonorBloc = {
  id: string;
  bloc: string;
  short: string;
  sharePct: number;
  amountBn: number;
  cumulativeSharePct: number;
  topDonor: string;
  confidence: Confidence;
  fill: string;
};

/** Origin geography of OECD adaptation provided/mobilised ($34.7B, 2024). */
export const DONOR_BLOCS: DonorBloc[] = [
  {
    id: "eu",
    bloc: "Western Europe",
    short: "W. Europe",
    sharePct: 52,
    amountBn: 18.0,
    cumulativeSharePct: 52,
    topDonor: "Germany",
    confidence: "estimated",
    fill: "#14b8a6",
  },
  {
    id: "jp",
    bloc: "Japan & advanced APAC donors",
    short: "Adv. APAC",
    sharePct: 18,
    amountBn: 6.2,
    cumulativeSharePct: 70,
    topDonor: "Japan",
    confidence: "estimated",
    fill: "#f43f5e",
  },
  {
    id: "na",
    bloc: "North America",
    short: "N. America",
    sharePct: 14,
    amountBn: 4.9,
    cumulativeSharePct: 84,
    topDonor: "United States",
    confidence: "estimated",
    fill: "#0ea5e9",
  },
  {
    id: "other",
    bloc: "Other developed providers",
    short: "Other",
    sharePct: 16,
    amountBn: 5.6,
    cumulativeSharePct: 100,
    topDonor: "—",
    confidence: "estimated",
    fill: "#64748b",
  },
];

export type LossRegion = {
  id: string;
  region: string;
  short: string;
  economicSharePct: number;
  insuredSharePct: number;
  economicBn: number;
  insuredBn: number;
  uninsuredBn: number;
  confidence: Confidence;
  fill: string;
};

/**
 * Constructed regional sleeves of FY 2025 economic (~$368B) and insured (~$107B)
 * loss framing — geography of who gets hit vs who gets a cheque.
 */
export const LOSS_REGIONS: LossRegion[] = [
  {
    id: "na",
    region: "North America",
    short: "N. America",
    economicSharePct: 34,
    insuredSharePct: 48,
    economicBn: 125.1,
    insuredBn: 51.4,
    uninsuredBn: 73.7,
    confidence: "constructed",
    fill: "#0ea5e9",
  },
  {
    id: "apac",
    region: "Asia-Pacific",
    short: "APAC",
    economicSharePct: 28,
    insuredSharePct: 18,
    economicBn: 103.0,
    insuredBn: 19.3,
    uninsuredBn: 83.7,
    confidence: "constructed",
    fill: "#f43f5e",
  },
  {
    id: "eu",
    region: "Europe",
    short: "Europe",
    economicSharePct: 22,
    insuredSharePct: 26,
    economicBn: 81.0,
    insuredBn: 27.8,
    uninsuredBn: 53.2,
    confidence: "constructed",
    fill: "#14b8a6",
  },
  {
    id: "lac",
    region: "Latin America & Caribbean",
    short: "LAC",
    economicSharePct: 9,
    insuredSharePct: 5,
    economicBn: 33.1,
    insuredBn: 5.4,
    uninsuredBn: 27.7,
    confidence: "constructed",
    fill: "#f59e0b",
  },
  {
    id: "mena-ssa",
    region: "MENA & Sub-Saharan Africa",
    short: "MENA+SSA",
    economicSharePct: 7,
    insuredSharePct: 3,
    economicBn: 25.8,
    insuredBn: 3.2,
    uninsuredBn: 22.6,
    confidence: "constructed",
    fill: "#8b5cf6",
  },
];

export type HazardRegionStack = {
  region: string;
  short: string;
  storm: number;
  flood: number;
  drought: number;
  wildfire: number;
  fill: string;
};

/** Constructed hazard-mix shares within each region's uninsured residual (sums ~100). */
export const HAZARD_BY_REGION: HazardRegionStack[] = [
  {
    region: "North America",
    short: "N. America",
    storm: 38,
    flood: 22,
    drought: 18,
    wildfire: 22,
    fill: "#0ea5e9",
  },
  {
    region: "South Asia",
    short: "South Asia",
    storm: 18,
    flood: 42,
    drought: 32,
    wildfire: 8,
    fill: "#f43f5e",
  },
  {
    region: "Latin America & Caribbean",
    short: "LAC",
    storm: 28,
    flood: 36,
    drought: 24,
    wildfire: 12,
    fill: "#f59e0b",
  },
  {
    region: "Sub-Saharan Africa",
    short: "SSA",
    storm: 12,
    flood: 28,
    drought: 52,
    wildfire: 8,
    fill: "#8b5cf6",
  },
  {
    region: "Western Europe",
    short: "W. Europe",
    storm: 32,
    flood: 34,
    drought: 18,
    wildfire: 16,
    fill: "#14b8a6",
  },
];

export type MeterRow = {
  id: string;
  label: string;
  valuePct: number;
  detail: string;
  fill: string;
};

export const METER_COMPARE: MeterRow[] = [
  {
    id: "gap-top1",
    label: "Gap Top-1 (N. America)",
    valuePct: HEADLINE.top1GapRegionSharePct,
    detail: `$${HEADLINE.top1GapRegionBn}B of $${HEADLINE.protectionGapBn}B`,
    fill: "#0ea5e9",
  },
  {
    id: "gap-top3",
    label: "Gap Top-3 regions",
    valuePct: HEADLINE.top3GapRegionSharePct,
    detail: HEADLINE.top3GapRegionLabel,
    fill: "#38bdf8",
  },
  {
    id: "flow-top1",
    label: "MDB flow Top-1 (SSA)",
    valuePct: HEADLINE.top1FlowRegionSharePct,
    detail: `$${HEADLINE.top1FlowRegionBn}B of $${HEADLINE.mdbLmicAdapt2025Bn}B`,
    fill: "#8b5cf6",
  },
  {
    id: "donor-eu",
    label: "Donor origin (W. Europe)",
    valuePct: HEADLINE.top1DonorBlocSharePct,
    detail: `of OECD adapt $${HEADLINE.oecdAdapt2024Bn}B`,
    fill: "#14b8a6",
  },
  {
    id: "loss-na",
    label: "Economic loss (N. America)",
    valuePct: HEADLINE.top1LossRegionSharePct,
    detail: `of FY $${HEADLINE.economicLoss2025Bn}B framing`,
    fill: "#f59e0b",
  },
  {
    id: "insured",
    label: "Global insured share",
    valuePct: HEADLINE.insuredShare2025Pct,
    detail: `$${HEADLINE.insuredLoss2025Bn}B / $${HEADLINE.economicLoss2025Bn}B`,
    fill: "#f43f5e",
  },
];

export type MismatchPoint = {
  id: string;
  region: string;
  short: string;
  gapSharePct: number;
  flowSharePct: number;
  resiliencePct: number;
  gapBn: number;
  fill: string;
};

/** Paired gap-share vs MDB-flow-share for mismatch scatter (aligned regions). */
export const MISMATCH_POINTS: MismatchPoint[] = [
  {
    id: "na",
    region: "North America",
    short: "N. America",
    gapSharePct: 22.4,
    flowSharePct: 4,
    resiliencePct: 42,
    gapBn: 95,
    fill: "#0ea5e9",
  },
  {
    id: "sa",
    region: "South Asia",
    short: "South Asia",
    gapSharePct: 15.6,
    flowSharePct: 22,
    resiliencePct: 8,
    gapBn: 66,
    fill: "#f43f5e",
  },
  {
    id: "lac",
    region: "Latin America & Caribbean",
    short: "LAC",
    gapSharePct: 14.6,
    flowSharePct: 18,
    resiliencePct: 18,
    gapBn: 62,
    fill: "#f59e0b",
  },
  {
    id: "ssa",
    region: "Sub-Saharan Africa",
    short: "SSA",
    gapSharePct: 13.7,
    flowSharePct: 28,
    resiliencePct: 6,
    gapBn: 58,
    fill: "#8b5cf6",
  },
  {
    id: "eu",
    region: "Western Europe",
    short: "W. Europe",
    gapSharePct: 13.0,
    flowSharePct: 3,
    resiliencePct: 38,
    gapBn: 55,
    fill: "#14b8a6",
  },
  {
    id: "mena",
    region: "Middle East & N. Africa",
    short: "MENA",
    gapSharePct: 9.4,
    flowSharePct: 10,
    resiliencePct: 14,
    gapBn: 40,
    fill: "#ec4899",
  },
];

export function fmtBn(n: number): string {
  const rounded = Math.round(n * 10) / 10;
  return Number.isInteger(rounded)
    ? `$${rounded.toLocaleString("en-US")}B`
    : `$${rounded.toLocaleString("en-US", { maximumFractionDigits: 1 })}B`;
}

export function fmtPct(n: number, digits = 0): string {
  const v = digits > 0 ? n.toFixed(digits) : String(Math.round(n));
  return `${v}%`;
}

export function rankedGapsBy(
  metric: "gapBn" | "gapSharePct" | "resiliencePct",
): RegionGap[] {
  const rows = [...REGION_GAPS];
  if (metric === "resiliencePct") {
    return rows.sort((a, b) => a.resiliencePct - b.resiliencePct);
  }
  if (metric === "gapSharePct") {
    return rows.sort((a, b) => b.gapSharePct - a.gapSharePct);
  }
  return rows.sort((a, b) => b.gapBn - a.gapBn);
}

export function mismatchScatter(): Array<
  MismatchPoint & { x: number; y: number; z: number }
> {
  return MISMATCH_POINTS.map((p) => ({
    ...p,
    x: p.gapSharePct,
    y: p.flowSharePct,
    z: Math.max(40, p.gapBn),
  }));
}

export function resilienceGapScatter(): Array<
  RegionGap & { x: number; y: number; z: number }
> {
  return REGION_GAPS.map((r) => ({
    ...r,
    x: r.resiliencePct,
    y: r.gapBn,
    z: Math.max(40, r.gapSharePct * 4),
  }));
}
