/**
 * Adaptation economics — August 2026 (202608) concentration / market-share lens.
 *
 * Core question: How concentrated is this system at the top of the distribution?
 * (Who pays for climate damage and adaptation before policy catches up?)
 *
 * Aug vintage locks the Q3 concentration print against three scenario frames:
 * (1) FY residual tip (Top-1 ~40%) vs H1-adjusted (~38%) vs annualized rebound (~39.5%),
 * (2) MDB LMIC adaptation bank tip after Joint Summary ($35B; WBG ~34% / Top-3 ~68%),
 * (3) protection-gap geography still ~53% Top-3 of the $424B stock,
 * (4) OECD donor + loan-instrument concentration on the $34.7B tip,
 * (5) scarcity multiples (needs mid ≈ 9.6× MDB LMIC adapt) as unmet-demand concentration,
 * (6) vintage slope Research → Conc '26 → Q3 conc → Aug 608 lock.
 */

export type Confidence = "disclosed" | "estimated" | "constructed";

export const SOURCE_NOTE =
  "August 202608 concentration lock after MDB Joint Summary (13 Jul 2026) and Swiss Re H1 2026 (11 Aug). Residual bearer shares are a constructed incidence panel under three scenarios: FY framing (Top-1 ~40%), H1-adjusted (~38%), and annualized rebound (~39.5%) if H2 reverts toward the FY insurance ratio. Regional protection-gap dollars and resilience ~27% follow Swiss Re sigma / Institute framing ($424B stock). OECD adaptation provided/mobilised $34.7B (2024) from OECD May 2026. MDB LMIC adaptation $35B (2025) from MDB Joint Summary. MDB bank shares of LMIC adaptation are estimated from published MDB climate-finance patterns and labeled estimated — not an official bank-by-bank adaptation extract. FRLD ~$449M delivered of ~$822M pledged is a constructed micro-concentration meter. Donor country shares of OECD adaptation remain estimated.";

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
    label: "Swiss Re Institute — H1 2026 insured catastrophe losses (11 Aug 2026)",
    url: "https://www.swissre.com/institute/research/topics-and-risk-dialogues/climate-and-natural-catastrophe-risk/first-half-2026-insured-catastrophe-losses.html",
  },
  {
    label: "UNEP — Adaptation Gap Report 2025",
    url: "https://www.unep.org/resources/adaptation-gap-report-2025",
  },
  {
    label: "Q3 concentration lens",
    url: "/blog/adaptation-economics-concentration-2026q3",
  },
  {
    label: "August MDB + H1 vintage update",
    url: "/blog/adaptation-economics-update-202608",
  },
] as const;

export const PRIOR_CONCENTRATION_PATH =
  "/blog/adaptation-economics-concentration-2026";
export const PRIOR_Q3_CONC_PATH =
  "/blog/adaptation-economics-concentration-2026q3";
export const PRIOR_RESEARCH_PATH = "/blog/adaptation-economics-research-2026";
export const PRIOR_AUG608_PATH = "/blog/adaptation-economics-update-202608";

/** Headline punchline — Top-1 / Top-3 under Aug 608 lock */
export const HEADLINE = {
  /** Primary lock = H1-adjusted residual (matches Q3 punchline; Aug asks durability) */
  top1BearerSharePct: 38,
  top1BearerLabel: "Uninsured households & SMEs",
  top3BearerSharePct: 86,
  top3BearerLabels: "Households + sovereigns + insurance",
  residualHhi: 2684,
  fyTop1BearerSharePct: 40,
  fyTop3BearerSharePct: 87,
  fyResidualHhi: 2826,
  reboundTop1BearerSharePct: 39.5,
  reboundTop3BearerSharePct: 86.5,
  reboundResidualHhi: 2750,
  priorQ3Top1Pct: 38,
  deltaVsFyPp: -2,
  reboundDeltaVsH1Pp: 1.5,

  /** Regional protection-gap concentration ($424B) */
  protectionGapBn: 424,
  resilienceIndexPct: 27.3,
  top1GapRegionSharePct: 22.4,
  top1GapRegionLabel: "North America",
  top3GapRegionSharePct: 52.6,
  top3GapRegionLabels: "N. America + South Asia + LAC",
  gapRegionHhi: 1518,

  /** OECD adaptation donors */
  oecdAdapt2024Bn: 34.7,
  oecdPublicAdapt2024Bn: 31.7,
  top1DonorSharePct: 18,
  top1DonorLabel: "Germany",
  top3DonorSharePct: 46,
  top3DonorLabels: "Germany + Japan + France",
  donorHhi: 1124,
  loanSharePublic2024Pct: 67,
  grantSharePublic2024Pct: 29,

  /** MDB LMIC adaptation bank tip */
  mdbLmicAdapt2025Bn: 35,
  mdbLmicAdapt2024Bn: 26.7,
  mdbAdaptYoYPct: 31,
  top1MdbSharePct: 34,
  top1MdbLabel: "World Bank Group",
  top3MdbSharePct: 68,
  top3MdbLabels: "WBG + ADB + IDB",
  mdbBankHhi: 1986,
  mdbAllAdapt2025Bn: 42,
  mdb2030LmicAdaptBn: 42,
  mdb2030ShortfallBn: 7,

  /** Needs vs flows */
  needsLowBn: 310,
  needsHighBn: 365,
  needsMidBn: 337.5,
  unepFlows2023Bn: 26,
  needsVsMdbMultipleMid: 9.6,
  cpiAdapt2023Bn: 65,
  cpiMitigationSharePct: 90,
  adaptShareOfClimatePct: 3.4,

  /** Insured tip — FY vs benign H1 */
  insuredFullYear2025Bn: 107,
  economicImplied2025Bn: 368,
  insuredShare2025Pct: 29.1,
  h1Insured2026Bn: 42,
  h1Economic2026Bn: 100,
  h1InsuredShare2026Pct: 42,
  h1InsuredPrior2025Bn: 91,

  /** FRLD micro-ledger */
  frldPledgedBn: 0.822,
  frldDeliveredBn: 0.449,
  frldDeliveryPct: 54.6,
  frldTop1PledgeSharePct: 28,
  frldTop1Label: "UAE / host pledges",
  frldTop3PledgeSharePct: 61,
} as const;

export type ScenarioId = "fy" | "h1" | "rebound";

export type ResidualBearer = {
  id: string;
  label: string;
  shortLabel: string;
  sharePct: number;
  fySharePct: number;
  reboundSharePct: number;
  cumulativePct: number;
  mechanism: string;
  confidence: Confidence;
  fill: string;
};

/** Primary residual ladder = H1-adjusted (Aug lock default). */
export const RESIDUAL_BEARERS: ResidualBearer[] = [
  {
    id: "households",
    label: "Uninsured households & SMEs",
    shortLabel: "Households",
    sharePct: 38,
    fySharePct: 40,
    reboundSharePct: 39.5,
    cumulativePct: 38,
    mechanism: "Out-of-pocket rebuild; H1 lift trims tip 2 pp vs FY; rebound +1.5 pp",
    confidence: "constructed",
    fill: "#f43f5e",
  },
  {
    id: "sovereigns",
    label: "National & local budgets",
    shortLabel: "Sovereigns",
    sharePct: 26,
    fySharePct: 27,
    reboundSharePct: 26.5,
    cumulativePct: 64,
    mechanism: "Emergency relief, reconstruction, contingent debt",
    confidence: "constructed",
    fill: "#0ea5e9",
  },
  {
    id: "insurers",
    label: "Insurers & reinsurers (covered share)",
    shortLabel: "Insurance",
    sharePct: 22,
    fySharePct: 20,
    reboundSharePct: 20.5,
    cumulativePct: 86,
    mechanism: "H1 2026 insured ratio 42% vs FY 2025 ~29% — temporary lift",
    confidence: "constructed",
    fill: "#14b8a6",
  },
  {
    id: "mdb",
    label: "MDB adaptation finance",
    shortLabel: "MDB adapt",
    sharePct: 10,
    fySharePct: 9,
    reboundSharePct: 9.5,
    cumulativePct: 96,
    mechanism: "LMIC MDB adapt $35B (2025) — +31% YoY institutional engine",
    confidence: "constructed",
    fill: "#f59e0b",
  },
  {
    id: "bilateral",
    label: "Bilateral / other public adaptation",
    shortLabel: "Bilateral+",
    sharePct: 4,
    fySharePct: 4,
    reboundSharePct: 4,
    cumulativePct: 100,
    mechanism: "OECD public adaptation residual + FRLD sub-billion tip",
    confidence: "constructed",
    fill: "#a78bfa",
  },
];

export function residualShareFor(
  b: ResidualBearer,
  scenario: ScenarioId,
): number {
  if (scenario === "fy") return b.fySharePct;
  if (scenario === "rebound") return b.reboundSharePct;
  return b.sharePct;
}

export function residualScenarioMeta(scenario: ScenarioId) {
  if (scenario === "fy") {
    return {
      top1: HEADLINE.fyTop1BearerSharePct,
      top3: HEADLINE.fyTop3BearerSharePct,
      hhi: HEADLINE.fyResidualHhi,
      label: "FY framing",
    };
  }
  if (scenario === "rebound") {
    return {
      top1: HEADLINE.reboundTop1BearerSharePct,
      top3: HEADLINE.reboundTop3BearerSharePct,
      hhi: HEADLINE.reboundResidualHhi,
      label: "Annualized rebound",
    };
  }
  return {
    top1: HEADLINE.top1BearerSharePct,
    top3: HEADLINE.top3BearerSharePct,
    hhi: HEADLINE.residualHhi,
    label: "H1-adjusted lock",
  };
}

export type ConcentrationPoint = {
  rank: number;
  label: string;
  cumulativeSharePct: number;
  equalSharePct: number;
};

export function residualCurveFor(scenario: ScenarioId): ConcentrationPoint[] {
  let cum = 0;
  const pts: ConcentrationPoint[] = [
    { rank: 0, label: "0", cumulativeSharePct: 0, equalSharePct: 0 },
  ];
  RESIDUAL_BEARERS.forEach((b, i) => {
    cum += residualShareFor(b, scenario);
    pts.push({
      rank: i + 1,
      label: b.shortLabel,
      cumulativeSharePct: Math.round(cum * 10) / 10,
      equalSharePct: Math.round(((i + 1) / RESIDUAL_BEARERS.length) * 1000) / 10,
    });
  });
  return pts;
}

export const RESIDUAL_CONCENTRATION_CURVE = residualCurveFor("h1");

/** Scenario scoreboard rows for bar compare. */
export const SCENARIO_SCOREBOARD = [
  {
    id: "fy" as const,
    label: "FY framing",
    shortLabel: "FY",
    top1Pct: HEADLINE.fyTop1BearerSharePct,
    top3Pct: HEADLINE.fyTop3BearerSharePct,
    hhi: HEADLINE.fyResidualHhi,
    fill: "#64748b",
  },
  {
    id: "h1" as const,
    label: "H1-adjusted lock",
    shortLabel: "H1 lock",
    top1Pct: HEADLINE.top1BearerSharePct,
    top3Pct: HEADLINE.top3BearerSharePct,
    hhi: HEADLINE.residualHhi,
    fill: "#14b8a6",
  },
  {
    id: "rebound" as const,
    label: "Annualized rebound",
    shortLabel: "Rebound",
    top1Pct: HEADLINE.reboundTop1BearerSharePct,
    top3Pct: HEADLINE.reboundTop3BearerSharePct,
    hhi: HEADLINE.reboundResidualHhi,
    fill: "#f43f5e",
  },
];

/** Hazard-type residual burden (constructed shares of uninsured tip). */
export type HazardBurden = {
  id: string;
  hazard: string;
  shortLabel: string;
  householdSharePct: number;
  sovereignSharePct: number;
  insuranceSharePct: number;
  fill: string;
  confidence: Confidence;
};

export const HAZARD_BURDENS: HazardBurden[] = [
  {
    id: "flood",
    hazard: "Flood / convective",
    shortLabel: "Flood",
    householdSharePct: 44,
    sovereignSharePct: 28,
    insuranceSharePct: 28,
    fill: "#0ea5e9",
    confidence: "constructed",
  },
  {
    id: "storm",
    hazard: "Tropical cyclone / wind",
    shortLabel: "Storm",
    householdSharePct: 36,
    sovereignSharePct: 24,
    insuranceSharePct: 40,
    fill: "#14b8a6",
    confidence: "constructed",
  },
  {
    id: "wildfire",
    hazard: "Wildfire",
    shortLabel: "Wildfire",
    householdSharePct: 41,
    sovereignSharePct: 22,
    insuranceSharePct: 37,
    fill: "#f59e0b",
    confidence: "constructed",
  },
  {
    id: "drought",
    hazard: "Drought / heat / crop",
    shortLabel: "Drought",
    householdSharePct: 52,
    sovereignSharePct: 35,
    insuranceSharePct: 13,
    fill: "#f43f5e",
    confidence: "constructed",
  },
  {
    id: "quake",
    hazard: "Earthquake (secondary)",
    shortLabel: "Quake",
    householdSharePct: 30,
    sovereignSharePct: 25,
    insuranceSharePct: 45,
    fill: "#8b5cf6",
    confidence: "constructed",
  },
];

export type RegionGap = {
  id: string;
  region: string;
  shortLabel: string;
  gapBn: number;
  gapSharePct: number;
  resiliencePct: number;
  income: "advanced" | "emerging" | "developing";
  confidence: Confidence;
  fill: string;
};

export const REGION_GAPS: RegionGap[] = [
  {
    id: "na",
    region: "North America",
    shortLabel: "N. America",
    gapBn: 95,
    gapSharePct: 22.4,
    resiliencePct: 42,
    income: "advanced",
    confidence: "estimated",
    fill: "#0ea5e9",
  },
  {
    id: "sa",
    region: "South Asia",
    shortLabel: "South Asia",
    gapBn: 66,
    gapSharePct: 15.6,
    resiliencePct: 8,
    income: "developing",
    confidence: "estimated",
    fill: "#f43f5e",
  },
  {
    id: "lac",
    region: "Latin America & Caribbean",
    shortLabel: "LAC",
    gapBn: 62,
    gapSharePct: 14.6,
    resiliencePct: 18,
    income: "emerging",
    confidence: "estimated",
    fill: "#f59e0b",
  },
  {
    id: "ssa",
    region: "Sub-Saharan Africa",
    shortLabel: "SSA",
    gapBn: 58,
    gapSharePct: 13.7,
    resiliencePct: 6,
    income: "developing",
    confidence: "estimated",
    fill: "#8b5cf6",
  },
  {
    id: "eu",
    region: "Western Europe",
    shortLabel: "W. Europe",
    gapBn: 55,
    gapSharePct: 13.0,
    resiliencePct: 38,
    income: "advanced",
    confidence: "estimated",
    fill: "#14b8a6",
  },
  {
    id: "apac",
    region: "Advanced Asia-Pacific",
    shortLabel: "Adv. APAC",
    gapBn: 48,
    gapSharePct: 11.3,
    resiliencePct: 30,
    income: "advanced",
    confidence: "estimated",
    fill: "#64748b",
  },
  {
    id: "mena",
    region: "Middle East & N. Africa",
    shortLabel: "MENA",
    gapBn: 40,
    gapSharePct: 9.4,
    resiliencePct: 14,
    income: "emerging",
    confidence: "estimated",
    fill: "#ec4899",
  },
];

export type DonorShare = {
  id: string;
  donor: string;
  shortLabel: string;
  sharePct: number;
  cumulativePct: number;
  approxBn: number;
  confidence: Confidence;
  fill: string;
};

export const DONOR_SHARES: DonorShare[] = [
  {
    id: "de",
    donor: "Germany",
    shortLabel: "Germany",
    sharePct: 18,
    cumulativePct: 18,
    approxBn: 6.2,
    confidence: "estimated",
    fill: "#0ea5e9",
  },
  {
    id: "jp",
    donor: "Japan",
    shortLabel: "Japan",
    sharePct: 16,
    cumulativePct: 34,
    approxBn: 5.6,
    confidence: "estimated",
    fill: "#f43f5e",
  },
  {
    id: "fr",
    donor: "France",
    shortLabel: "France",
    sharePct: 12,
    cumulativePct: 46,
    approxBn: 4.2,
    confidence: "estimated",
    fill: "#8b5cf6",
  },
  {
    id: "us",
    donor: "United States",
    shortLabel: "US",
    sharePct: 11,
    cumulativePct: 57,
    approxBn: 3.8,
    confidence: "estimated",
    fill: "#14b8a6",
  },
  {
    id: "uk",
    donor: "United Kingdom",
    shortLabel: "UK",
    sharePct: 8,
    cumulativePct: 65,
    approxBn: 2.8,
    confidence: "estimated",
    fill: "#f59e0b",
  },
  {
    id: "nl",
    donor: "Netherlands",
    shortLabel: "Netherlands",
    sharePct: 6,
    cumulativePct: 71,
    approxBn: 2.1,
    confidence: "estimated",
    fill: "#ec4899",
  },
  {
    id: "row",
    donor: "Other developed providers",
    shortLabel: "Other",
    sharePct: 29,
    cumulativePct: 100,
    approxBn: 10.0,
    confidence: "estimated",
    fill: "#64748b",
  },
];

export type MdbBankShare = {
  id: string;
  bank: string;
  shortLabel: string;
  sharePct: number;
  cumulativePct: number;
  approxBn: number;
  confidence: Confidence;
  fill: string;
};

export const MDB_BANK_SHARES: MdbBankShare[] = [
  {
    id: "wbg",
    bank: "World Bank Group",
    shortLabel: "WBG",
    sharePct: 34,
    cumulativePct: 34,
    approxBn: 11.9,
    confidence: "estimated",
    fill: "#0ea5e9",
  },
  {
    id: "adb",
    bank: "Asian Development Bank",
    shortLabel: "ADB",
    sharePct: 20,
    cumulativePct: 54,
    approxBn: 7.0,
    confidence: "estimated",
    fill: "#f43f5e",
  },
  {
    id: "idb",
    bank: "Inter-American Development Bank",
    shortLabel: "IDB",
    sharePct: 14,
    cumulativePct: 68,
    approxBn: 4.9,
    confidence: "estimated",
    fill: "#f59e0b",
  },
  {
    id: "afdb",
    bank: "African Development Bank",
    shortLabel: "AfDB",
    sharePct: 11,
    cumulativePct: 79,
    approxBn: 3.9,
    confidence: "estimated",
    fill: "#8b5cf6",
  },
  {
    id: "eib",
    bank: "European Investment Bank (LMIC)",
    shortLabel: "EIB",
    sharePct: 9,
    cumulativePct: 88,
    approxBn: 3.2,
    confidence: "estimated",
    fill: "#14b8a6",
  },
  {
    id: "other",
    bank: "Other MDBs",
    shortLabel: "Other",
    sharePct: 12,
    cumulativePct: 100,
    approxBn: 4.2,
    confidence: "estimated",
    fill: "#64748b",
  },
];

export type InstrumentSlice = {
  id: string;
  label: string;
  sharePct: number;
  fill: string;
};

export const INSTRUMENT_MIX: InstrumentSlice[] = [
  {
    id: "loans",
    label: "Loans / debt-like",
    sharePct: HEADLINE.loanSharePublic2024Pct,
    fill: "#f59e0b",
  },
  {
    id: "grants",
    label: "Grants",
    sharePct: HEADLINE.grantSharePublic2024Pct,
    fill: "#14b8a6",
  },
  {
    id: "other",
    label: "Equity / other",
    sharePct:
      100 - HEADLINE.loanSharePublic2024Pct - HEADLINE.grantSharePublic2024Pct,
    fill: "#64748b",
  },
];

export type HhiLens = {
  id: string;
  label: string;
  shortLabel: string;
  hhi: number;
  top1Pct: number;
  top3Pct: number;
  band: "extreme" | "high" | "moderate" | "plural";
  fill: string;
};

function hhiBand(hhi: number): HhiLens["band"] {
  if (hhi >= 5000) return "extreme";
  if (hhi >= 2500) return "high";
  if (hhi >= 1500) return "moderate";
  return "plural";
}

const instrumentHhi = Math.round(
  HEADLINE.loanSharePublic2024Pct ** 2 +
    HEADLINE.grantSharePublic2024Pct ** 2 +
    (100 -
      HEADLINE.loanSharePublic2024Pct -
      HEADLINE.grantSharePublic2024Pct) **
      2,
);

export const HHI_BY_LENS: HhiLens[] = [
  {
    id: "residual",
    label: "Residual damage bearers (H1 lock)",
    shortLabel: "Residual",
    hhi: HEADLINE.residualHhi,
    top1Pct: HEADLINE.top1BearerSharePct,
    top3Pct: HEADLINE.top3BearerSharePct,
    band: hhiBand(HEADLINE.residualHhi),
    fill: "#f43f5e",
  },
  {
    id: "mdb-banks",
    label: "MDB LMIC adaptation banks",
    shortLabel: "MDB banks",
    hhi: HEADLINE.mdbBankHhi,
    top1Pct: HEADLINE.top1MdbSharePct,
    top3Pct: HEADLINE.top3MdbSharePct,
    band: hhiBand(HEADLINE.mdbBankHhi),
    fill: "#f59e0b",
  },
  {
    id: "gap-region",
    label: "Protection-gap geography",
    shortLabel: "Gap geo",
    hhi: HEADLINE.gapRegionHhi,
    top1Pct: HEADLINE.top1GapRegionSharePct,
    top3Pct: HEADLINE.top3GapRegionSharePct,
    band: hhiBand(HEADLINE.gapRegionHhi),
    fill: "#0ea5e9",
  },
  {
    id: "donors",
    label: "OECD adaptation donors",
    shortLabel: "Donors",
    hhi: HEADLINE.donorHhi,
    top1Pct: HEADLINE.top1DonorSharePct,
    top3Pct: HEADLINE.top3DonorSharePct,
    band: hhiBand(HEADLINE.donorHhi),
    fill: "#14b8a6",
  },
  {
    id: "instruments",
    label: "Public adaptation instruments",
    shortLabel: "Instruments",
    hhi: instrumentHhi,
    top1Pct: HEADLINE.loanSharePublic2024Pct,
    top3Pct: 100,
    band: hhiBand(instrumentHhi),
    fill: "#8b5cf6",
  },
];

export type VintageSlopeRow = {
  vintage: string;
  shortLabel: string;
  residualTop1Pct: number;
  residualTop3Pct: number;
  residualHhi: number;
  mdbTop1Pct: number | null;
  gapTop3Pct: number;
  note: string;
};

export const VINTAGE_SLOPE: VintageSlopeRow[] = [
  {
    vintage: "Research 2026",
    shortLabel: "Research",
    residualTop1Pct: 42,
    residualTop3Pct: 88,
    residualHhi: 3010,
    mdbTop1Pct: null,
    gapTop3Pct: 54,
    note: "Pre-MDB Joint Summary; FY insurance framing",
  },
  {
    vintage: "Concentration 2026",
    shortLabel: "Conc '26",
    residualTop1Pct: 40,
    residualTop3Pct: 87,
    residualHhi: 2826,
    mdbTop1Pct: 32,
    gapTop3Pct: 52.6,
    note: "First Top-1/Top-3 cut; MDB tip inferred",
  },
  {
    vintage: "Q3 concentration",
    shortLabel: "Q3 conc",
    residualTop1Pct: 38,
    residualTop3Pct: 86,
    residualHhi: 2684,
    mdbTop1Pct: 34,
    gapTop3Pct: 52.6,
    note: "H1 insurance lift + WBG share of $35B",
  },
  {
    vintage: "Aug 608 lock",
    shortLabel: "Aug 608",
    residualTop1Pct: 38,
    residualTop3Pct: 86,
    residualHhi: 2684,
    mdbTop1Pct: 34,
    gapTop3Pct: 52.6,
    note: "Same H1 lock; rebound scenario +1.5 pp Top-1 risk",
  },
];

export type FlowLedger = {
  id: string;
  label: string;
  shortLabel: string;
  bn: number;
  role: "needs" | "flow" | "gap" | "micro";
  fill: string;
  note?: string;
};

export const FLOW_LEDGERS: FlowLedger[] = [
  {
    id: "needs-mid",
    label: "AGR needs mid (by 2035)",
    shortLabel: "Needs mid",
    bn: HEADLINE.needsMidBn,
    role: "needs",
    fill: "#f43f5e",
    note: "$310–365B band midpoint",
  },
  {
    id: "protect",
    label: "Swiss Re protection gap",
    shortLabel: "Protect. gap",
    bn: HEADLINE.protectionGapBn,
    role: "gap",
    fill: "#f59e0b",
  },
  {
    id: "gap-mdb",
    label: "Implied gap vs MDB LMIC 2025",
    shortLabel: "Gap vs MDB",
    bn: HEADLINE.needsMidBn - HEADLINE.mdbLmicAdapt2025Bn,
    role: "gap",
    fill: "#fb7185",
  },
  {
    id: "mdb",
    label: "MDB LMIC adaptation 2025",
    shortLabel: "MDB '25",
    bn: HEADLINE.mdbLmicAdapt2025Bn,
    role: "flow",
    fill: "#0ea5e9",
  },
  {
    id: "oecd",
    label: "OECD adapt provided/mobilised 2024",
    shortLabel: "OECD '24",
    bn: HEADLINE.oecdAdapt2024Bn,
    role: "flow",
    fill: "#14b8a6",
  },
  {
    id: "cpi",
    label: "CPI tracked global adaptation 2023",
    shortLabel: "CPI '23",
    bn: HEADLINE.cpiAdapt2023Bn,
    role: "flow",
    fill: "#a78bfa",
  },
  {
    id: "unep",
    label: "UNEP intl public adapt 2023",
    shortLabel: "UNEP '23",
    bn: HEADLINE.unepFlows2023Bn,
    role: "flow",
    fill: "#8b5cf6",
  },
  {
    id: "frld",
    label: "FRLD delivered (pledged $0.82B)",
    shortLabel: "FRLD deliv.",
    bn: HEADLINE.frldDeliveredBn,
    role: "micro",
    fill: "#64748b",
    note: "Sub-billion residual window",
  },
];

export type ScarcityMultiple = {
  id: string;
  label: string;
  shortLabel: string;
  multiple: number;
  fill: string;
};

export const SCARCITY_MULTIPLES: ScarcityMultiple[] = [
  {
    id: "needs-mdb",
    label: "Needs mid ÷ MDB LMIC adapt",
    shortLabel: "Needs/MDB",
    multiple: HEADLINE.needsVsMdbMultipleMid,
    fill: "#f43f5e",
  },
  {
    id: "needs-oecd",
    label: "Needs mid ÷ OECD adapt tip",
    shortLabel: "Needs/OECD",
    multiple: Math.round((HEADLINE.needsMidBn / HEADLINE.oecdAdapt2024Bn) * 10) / 10,
    fill: "#f59e0b",
  },
  {
    id: "gap-mdb",
    label: "Protection gap ÷ MDB LMIC",
    shortLabel: "Gap/MDB",
    multiple: Math.round((HEADLINE.protectionGapBn / HEADLINE.mdbLmicAdapt2025Bn) * 10) / 10,
    fill: "#0ea5e9",
  },
  {
    id: "needs-unep",
    label: "Needs mid ÷ UNEP intl public",
    shortLabel: "Needs/UNEP",
    multiple: Math.round((HEADLINE.needsMidBn / HEADLINE.unepFlows2023Bn) * 10) / 10,
    fill: "#8b5cf6",
  },
];

export type InsuredVintage = {
  id: string;
  label: string;
  shortLabel: string;
  insuredBn: number;
  economicBn: number;
  insuredSharePct: number;
  fill: string;
};

export const INSURED_VINTAGE: InsuredVintage[] = [
  {
    id: "fy25",
    label: "FY 2025 (sigma)",
    shortLabel: "FY '25",
    insuredBn: HEADLINE.insuredFullYear2025Bn,
    economicBn: HEADLINE.economicImplied2025Bn,
    insuredSharePct: HEADLINE.insuredShare2025Pct,
    fill: "#64748b",
  },
  {
    id: "h1-25",
    label: "H1 2025",
    shortLabel: "H1 '25",
    insuredBn: HEADLINE.h1InsuredPrior2025Bn,
    economicBn: 152,
    insuredSharePct: Math.round((91 / 152) * 1000) / 10,
    fill: "#f43f5e",
  },
  {
    id: "h1-26",
    label: "H1 2026 (benign)",
    shortLabel: "H1 '26",
    insuredBn: HEADLINE.h1Insured2026Bn,
    economicBn: HEADLINE.h1Economic2026Bn,
    insuredSharePct: HEADLINE.h1InsuredShare2026Pct,
    fill: "#14b8a6",
  },
];

export type TopKRow = {
  id: string;
  lens: string;
  top1Label: string;
  top1Pct: number;
  top3Label: string;
  top3Pct: number;
  hhi: number;
  deltaTop1Pp: number | null;
  unit: string;
  confidence: Confidence;
};

export const TOP_K_LADDER: TopKRow[] = [
  {
    id: "residual",
    lens: "Residual bearers (H1 lock)",
    top1Label: HEADLINE.top1BearerLabel,
    top1Pct: HEADLINE.top1BearerSharePct,
    top3Label: HEADLINE.top3BearerLabels,
    top3Pct: HEADLINE.top3BearerSharePct,
    hhi: HEADLINE.residualHhi,
    deltaTop1Pp: HEADLINE.deltaVsFyPp,
    unit: "% of residual incidence",
    confidence: "constructed",
  },
  {
    id: "mdb",
    lens: "MDB LMIC adaptation banks",
    top1Label: HEADLINE.top1MdbLabel,
    top1Pct: HEADLINE.top1MdbSharePct,
    top3Label: HEADLINE.top3MdbLabels,
    top3Pct: HEADLINE.top3MdbSharePct,
    hhi: HEADLINE.mdbBankHhi,
    deltaTop1Pp: 2,
    unit: `% of $${HEADLINE.mdbLmicAdapt2025Bn}B tip`,
    confidence: "estimated",
  },
  {
    id: "gap",
    lens: "Protection-gap geography",
    top1Label: HEADLINE.top1GapRegionLabel,
    top1Pct: HEADLINE.top1GapRegionSharePct,
    top3Label: HEADLINE.top3GapRegionLabels,
    top3Pct: HEADLINE.top3GapRegionSharePct,
    hhi: HEADLINE.gapRegionHhi,
    deltaTop1Pp: 0,
    unit: `% of $${HEADLINE.protectionGapBn}B stock`,
    confidence: "estimated",
  },
  {
    id: "donors",
    lens: "OECD adaptation donors",
    top1Label: HEADLINE.top1DonorLabel,
    top1Pct: HEADLINE.top1DonorSharePct,
    top3Label: HEADLINE.top3DonorLabels,
    top3Pct: HEADLINE.top3DonorSharePct,
    hhi: HEADLINE.donorHhi,
    deltaTop1Pp: 0,
    unit: `% of $${HEADLINE.oecdAdapt2024Bn}B tip`,
    confidence: "estimated",
  },
  {
    id: "instruments",
    lens: "Public adaptation instruments",
    top1Label: "Loans / debt-like",
    top1Pct: HEADLINE.loanSharePublic2024Pct,
    top3Label: "Loans + grants + other",
    top3Pct: 100,
    hhi: instrumentHhi,
    deltaTop1Pp: null,
    unit: "% of public adaptation",
    confidence: "disclosed",
  },
];

export function rankedRegionsBy(
  sortKey: "gap" | "share" | "resilience",
): RegionGap[] {
  const rows = [...REGION_GAPS];
  if (sortKey === "resilience") {
    return rows.sort((a, b) => b.resiliencePct - a.resiliencePct);
  }
  if (sortKey === "share") {
    return rows.sort((a, b) => b.gapSharePct - a.gapSharePct);
  }
  return rows.sort((a, b) => b.gapBn - a.gapBn);
}

export function fmtPct(n: number, digits = 0): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtBn(n: number, digits = 1): string {
  if (n >= 100) return `$${Math.round(n)}B`;
  return `$${n.toFixed(digits)}B`;
}

export function fmtHhi(n: number): string {
  return n.toLocaleString("en-US");
}

export function fmtMultiple(n: number, digits = 1): string {
  return `${n.toFixed(digits)}×`;
}
