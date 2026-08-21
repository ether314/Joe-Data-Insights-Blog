/**
 * Adaptation economics — concentration lens (Top-1 / Top-3 / HHI).
 * Core question: How concentrated is residual climate-damage burden and
 * adaptation finance at the top of the distribution?
 *
 * Complements research (stock ledger), AGR/OECD/MDB vintage updates with a
 * distribution / market-share cut: who absorbs uninsured damage, where the
 * $424B protection gap sits, and how thin the adaptation-finance tip is.
 */

export type Confidence = "disclosed" | "estimated" | "constructed";

export const SOURCE_NOTE =
  "Residual bearer shares are a constructed incidence panel consistent with the theme’s August 202608 update (households/SMEs tip after a benign H1). Regional protection-gap dollars and resilience index ~27% follow Swiss Re sigma / Institute protection-gap framing used across theme posts. OECD adaptation provided/mobilised $34.7B (2024) and public loan/grant instrument mix from OECD May 2026 climate-finance assessment. MDB LMIC adaptation $35B (2025) from MDB Joint Summary (13 Jul 2026). UNEP AGR 2025 needs band $310–365B/yr by 2035 and intl public $26B (2023) unchanged. Donor country shares of OECD adaptation are estimated from published bilateral patterns and labeled estimated — not an official OECD country table extract.";

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
    label: "Theme — August MDB + H1 vintage update",
    url: "/blog/adaptation-economics-update-202608",
  },
  {
    label: "Theme — research stock ledger",
    url: "/blog/adaptation-economics-research-2026",
  },
];

export const HEADLINE = {
  /** Residual incidence — who absorbs uninsured / underfunded damage */
  top1BearerSharePct: 40,
  top1BearerLabel: "Uninsured households & SMEs",
  top3BearerSharePct: 87,
  top3BearerLabels: "Households + sovereign budgets + insurance",
  residualHhi: 2826,
  /** Regional protection-gap concentration ($424B Swiss Re-style stock) */
  protectionGapBn: 424,
  resilienceIndexPct: 27.3,
  top1GapRegionSharePct: 22.4,
  top1GapRegionLabel: "North America",
  top3GapRegionSharePct: 52.6,
  top3GapRegionLabels: "N. America + South Asia + LAC",
  gapRegionHhi: 1518,
  /** Adaptation finance tip (OECD provided/mobilised 2024) */
  oecdAdapt2024Bn: 34.7,
  oecdPublicAdapt2024Bn: 31.7,
  top1DonorSharePct: 18,
  top1DonorLabel: "Germany",
  top3DonorSharePct: 46,
  top3DonorLabels: "Germany + Japan + France",
  donorHhi: 1124,
  loanSharePublic2024Pct: 67,
  grantSharePublic2024Pct: 29,
  /** Needs vs flows — concentration of scarcity */
  needsLowBn: 310,
  needsHighBn: 365,
  needsMidBn: 337.5,
  mdbLmicAdapt2025Bn: 35,
  unepFlows2023Bn: 26,
  needsVsMdbMultipleMid: 9.6,
  /** Climate-finance use skew (CPI-style global track, 2023 vintage used in Q3) */
  cpiAdapt2023Bn: 65,
  cpiMitigationSharePct: 90,
  adaptShareOfClimatePct: 3.4,
  /** Insured vs economic — tip of covered losses */
  insuredFullYear2025Bn: 107,
  economicImplied2025Bn: 368,
  insuredShare2025Pct: 29.1,
  h1Insured2026Bn: 42,
  h1Economic2026Bn: 100,
  h1InsuredShare2026Pct: 42,
} as const;

/** Who still pays — residual incidence (constructed, theme-consistent). */
export type ResidualBearer = {
  id: string;
  label: string;
  shortLabel: string;
  sharePct: number;
  cumulativePct: number;
  mechanism: string;
  confidence: Confidence;
  fill: string;
};

export const RESIDUAL_BEARERS: ResidualBearer[] = [
  {
    id: "households",
    label: "Uninsured households & SMEs",
    shortLabel: "Households",
    sharePct: 40,
    cumulativePct: 40,
    mechanism: "Out-of-pocket rebuild, lost income, informal coping",
    confidence: "constructed",
    fill: "#f43f5e",
  },
  {
    id: "sovereigns",
    label: "National & local budgets",
    shortLabel: "Sovereigns",
    sharePct: 27,
    cumulativePct: 67,
    mechanism: "Emergency relief, reconstruction, contingent debt",
    confidence: "constructed",
    fill: "#0ea5e9",
  },
  {
    id: "insurers",
    label: "Insurers & reinsurers (covered share)",
    shortLabel: "Insurance",
    sharePct: 20,
    cumulativePct: 87,
    mechanism: "Claims within limits; global resilience still ~27%",
    confidence: "constructed",
    fill: "#14b8a6",
  },
  {
    id: "mdb",
    label: "MDB adaptation finance",
    shortLabel: "MDB adapt",
    sharePct: 9,
    cumulativePct: 96,
    mechanism: "LMIC MDB adapt $35B (2025) — largest institutional engine",
    confidence: "constructed",
    fill: "#f59e0b",
  },
  {
    id: "bilateral",
    label: "Bilateral / other public adaptation",
    shortLabel: "Bilateral+",
    sharePct: 4,
    cumulativePct: 100,
    mechanism: "OECD public adaptation residual beside MDB books",
    confidence: "constructed",
    fill: "#a78bfa",
  },
];

/** Lorenz-style curve for residual burden (equal-split diagonal reference). */
export type ConcentrationPoint = {
  rank: number;
  label: string;
  cumulativeSharePct: number;
  equalSharePct: number;
};

export const RESIDUAL_CONCENTRATION_CURVE: ConcentrationPoint[] = [
  { rank: 0, label: "0", cumulativeSharePct: 0, equalSharePct: 0 },
  ...RESIDUAL_BEARERS.map((b, i) => ({
    rank: i + 1,
    label: b.shortLabel,
    cumulativeSharePct: b.cumulativePct,
    equalSharePct: Math.round(((i + 1) / RESIDUAL_BEARERS.length) * 1000) / 10,
  })),
];

/** Regional protection-gap / resilience cross-section. */
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

/** OECD adaptation donor tip — estimated bilateral shares of provided/mobilised. */
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

/** Public adaptation instrument mix (OECD 2024). */
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

/** Finance ledgers vs needs — scarcity stack for ranked bars. */
export type FlowLedger = {
  id: string;
  label: string;
  shortLabel: string;
  bn: number;
  role: "needs" | "flow" | "gap";
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
    id: "gap-mdb",
    label: "Implied gap vs MDB LMIC 2025",
    shortLabel: "Gap vs MDB",
    bn: HEADLINE.needsMidBn - HEADLINE.mdbLmicAdapt2025Bn,
    role: "gap",
    fill: "#fb7185",
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
    id: "unep",
    label: "UNEP intl public adapt 2023",
    shortLabel: "UNEP '23",
    bn: HEADLINE.unepFlows2023Bn,
    role: "flow",
    fill: "#8b5cf6",
  },
  {
    id: "cpi",
    label: "CPI tracked global adaptation 2023",
    shortLabel: "CPI '23",
    bn: HEADLINE.cpiAdapt2023Bn,
    role: "flow",
    fill: "#a78bfa",
  },
];

/** Top-k ladder rows for the concentration table. */
export type TopKRow = {
  id: string;
  lens: string;
  top1Label: string;
  top1Pct: number;
  top3Label: string;
  top3Pct: number;
  hhi: number;
  unit: string;
  confidence: Confidence;
};

export const TOP_K_LADDER: TopKRow[] = [
  {
    id: "residual",
    lens: "Residual damage bearers",
    top1Label: HEADLINE.top1BearerLabel,
    top1Pct: HEADLINE.top1BearerSharePct,
    top3Label: HEADLINE.top3BearerLabels,
    top3Pct: HEADLINE.top3BearerSharePct,
    hhi: HEADLINE.residualHhi,
    unit: "incidence share",
    confidence: "constructed",
  },
  {
    id: "gap-region",
    lens: "Protection-gap geography",
    top1Label: HEADLINE.top1GapRegionLabel,
    top1Pct: HEADLINE.top1GapRegionSharePct,
    top3Label: HEADLINE.top3GapRegionLabels,
    top3Pct: HEADLINE.top3GapRegionSharePct,
    hhi: HEADLINE.gapRegionHhi,
    unit: "% of $424B gap",
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
    unit: "% of OECD adapt",
    confidence: "estimated",
  },
  {
    id: "instruments",
    lens: "Public adaptation instruments",
    top1Label: "Loans / debt-like",
    top1Pct: HEADLINE.loanSharePublic2024Pct,
    top3Label: "Loans + grants + other",
    top3Pct: 100,
    hhi: Math.round(
      HEADLINE.loanSharePublic2024Pct ** 2 +
        HEADLINE.grantSharePublic2024Pct ** 2 +
        (100 -
          HEADLINE.loanSharePublic2024Pct -
          HEADLINE.grantSharePublic2024Pct) **
          2,
    ),
    unit: "% of public adapt",
    confidence: "disclosed",
  },
];

export function fmtBn(n: number): string {
  if (Math.abs(n) >= 1000) return `$${(n / 1000).toFixed(2)}T`;
  const rounded = Math.round(n * 10) / 10;
  return Number.isInteger(rounded)
    ? `$${rounded.toLocaleString("en-US")}B`
    : `$${rounded.toLocaleString("en-US", { maximumFractionDigits: 1 })}B`;
}

export function fmtPct(n: number, digits = 0): string {
  const v = digits > 0 ? n.toFixed(digits) : String(Math.round(n));
  return `${v}%`;
}

export function fmtMultiple(n: number): string {
  return `${n.toFixed(1)}×`;
}

export function rankedRegionsBy(
  metric: "gap" | "resilience" | "share",
): RegionGap[] {
  const rows = [...REGION_GAPS];
  if (metric === "resilience") {
    return rows.sort((a, b) => a.resiliencePct - b.resiliencePct);
  }
  if (metric === "share") {
    return rows.sort((a, b) => b.gapSharePct - a.gapSharePct);
  }
  return rows.sort((a, b) => b.gapBn - a.gapBn);
}

export function flowLedgersFiltered(
  role: "all" | "needs" | "flow" | "gap" = "all",
): FlowLedger[] {
  if (role === "all") return FLOW_LEDGERS;
  return FLOW_LEDGERS.filter((r) => r.role === role);
}
