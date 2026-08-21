/**
 * Capex intensity vintage update (late Aug 202608 / 20 Aug 2026).
 * Compares the mid-Q3 guidance / TTM intensity print against the newest
 * late-August Axis / Street-aligned refresh after Amazon / Alphabet / Meta
 * midpoint steps. Capex = SEC gross PP&E purchases (desk-scaled where guides
 * move); intensity = capex ÷ revenue; FCF margin = (OCF − capex) ÷ revenue.
 */

export const SOURCE_NOTE =
  "Vintage delta: mid-Q3’26 intensity guide (MSFT FY26 held; AMZN/GOOG/META/ORCL CY26–FY26 mid-guides) vs late-Aug 202608 refresh aligned with the companion spend tracker. Capex = gross PP&E purchases ÷ total revenue. FCF margin = (operating cash flow − capex) ÷ revenue. Absolute $ raises for Amazon / Alphabet / Meta are scaled from the Q3 intensity print by the late-Aug spend midpoint step; Microsoft FY26 intensity remains disclosed until the next 10-K.";

export type Confidence = "disclosed" | "estimated" | "annualized" | "guide" | "desk";

export type CompanyId = "Microsoft" | "Amazon" | "Alphabet" | "Meta" | "Oracle";

export const COMPANIES: CompanyId[] = [
  "Microsoft",
  "Amazon",
  "Alphabet",
  "Meta",
  "Oracle",
];

export const COMPANY_COLORS: Record<CompanyId, string> = {
  Microsoft: "#00a4ef",
  Amazon: "#ff9900",
  Alphabet: "#34a853",
  Meta: "#0668e1",
  Oracle: "#f80000",
};

/** Snapshot as published in ai-capex-intensity-update-2026q3 */
export type VintageRow = {
  company: CompanyId;
  label: string;
  intensityPct: number;
  capexBn: number;
  revenueBn: number;
  fcfMarginPct: number;
  confidence: Confidence;
  fiscalEnd: string;
};

export const PRIOR_VINTAGE: VintageRow[] = [
  {
    company: "Microsoft",
    label: "FY26 held",
    intensityPct: 26.8,
    capexBn: 88.4,
    revenueBn: 329.8,
    fcfMarginPct: 21.4,
    confidence: "disclosed",
    fiscalEnd: "Jun 2026",
  },
  {
    company: "Amazon",
    label: "CY26 guide",
    intensityPct: 22.8,
    capexBn: 175.0,
    revenueBn: 768.0,
    fcfMarginPct: 1.1,
    confidence: "guide",
    fiscalEnd: "Dec 2026 guide",
  },
  {
    company: "Alphabet",
    label: "CY26 guide",
    intensityPct: 27.2,
    capexBn: 128.0,
    revenueBn: 470.0,
    fcfMarginPct: 10.8,
    confidence: "guide",
    fiscalEnd: "Dec 2026 guide",
  },
  {
    company: "Meta",
    label: "CY26 guide",
    intensityPct: 39.1,
    capexBn: 95.0,
    revenueBn: 243.0,
    fcfMarginPct: 13.9,
    confidence: "guide",
    fiscalEnd: "Dec 2026 guide",
  },
  {
    company: "Oracle",
    label: "FY26 guide",
    intensityPct: 43.5,
    capexBn: 38.5,
    revenueBn: 88.5,
    fcfMarginPct: 3.5,
    confidence: "guide",
    fiscalEnd: "May 2026 guide",
  },
];

/** Newest late-Aug 202608 intensity refresh */
export const NEW_VINTAGE: VintageRow[] = [
  {
    company: "Microsoft",
    label: "FY26 held",
    intensityPct: 26.8,
    capexBn: 88.4,
    revenueBn: 329.8,
    fcfMarginPct: 20.9,
    confidence: "disclosed",
    fiscalEnd: "Jun 2026",
  },
  {
    company: "Amazon",
    label: "Late-Aug desk",
    intensityPct: 23.8,
    capexBn: 183.0,
    revenueBn: 768.0,
    fcfMarginPct: 0.3,
    confidence: "desk",
    fiscalEnd: "Dec 2026 desk",
  },
  {
    company: "Alphabet",
    label: "Late-Aug mid",
    intensityPct: 28.3,
    capexBn: 133.0,
    revenueBn: 470.0,
    fcfMarginPct: 9.9,
    confidence: "desk",
    fiscalEnd: "Dec 2026 mid",
  },
  {
    company: "Meta",
    label: "Late-Aug mid",
    intensityPct: 40.5,
    capexBn: 98.5,
    revenueBn: 243.0,
    fcfMarginPct: 12.6,
    confidence: "desk",
    fiscalEnd: "Dec 2026 mid",
  },
  {
    company: "Oracle",
    label: "FY26 guide held",
    intensityPct: 43.5,
    capexBn: 38.5,
    revenueBn: 88.5,
    fcfMarginPct: 3.0,
    confidence: "guide",
    fiscalEnd: "May 2026 guide",
  },
];

export type DeltaRow = {
  company: CompanyId;
  priorIntensity: number;
  newIntensity: number;
  deltaPp: number;
  priorFcf: number;
  newFcf: number;
  fcfDeltaPp: number;
  priorCapexBn: number;
  newCapexBn: number;
  capexDeltaBn: number;
  priorLabel: string;
  newLabel: string;
  fill: string;
};

export function vintageDeltas(companies: CompanyId[] = COMPANIES): DeltaRow[] {
  return companies.map((c) => {
    const prior = PRIOR_VINTAGE.find((r) => r.company === c)!;
    const neu = NEW_VINTAGE.find((r) => r.company === c)!;
    return {
      company: c,
      priorIntensity: prior.intensityPct,
      newIntensity: neu.intensityPct,
      deltaPp: +(neu.intensityPct - prior.intensityPct).toFixed(1),
      priorFcf: prior.fcfMarginPct,
      newFcf: neu.fcfMarginPct,
      fcfDeltaPp: +(neu.fcfMarginPct - prior.fcfMarginPct).toFixed(1),
      priorCapexBn: prior.capexBn,
      newCapexBn: neu.capexBn,
      capexDeltaBn: +(neu.capexBn - prior.capexBn).toFixed(1),
      priorLabel: prior.label,
      newLabel: neu.label,
      fill: COMPANY_COLORS[c],
    };
  });
}

export type PathPoint = {
  period: string;
  Microsoft: number | null;
  Amazon: number | null;
  Alphabet: number | null;
  Meta: number | null;
  Oracle: number | null;
  telecomNorm: number;
  preAiCloud: number;
};

export const INTENSITY_PATH: PathPoint[] = [
  {
    period: "FY24",
    Microsoft: 18.1,
    Amazon: 13.0,
    Alphabet: 14.9,
    Meta: 22.8,
    Oracle: 13.0,
    telecomNorm: 20,
    preAiCloud: 11,
  },
  {
    period: "FY25",
    Microsoft: 22.9,
    Amazon: 18.4,
    Alphabet: 22.7,
    Meta: 34.7,
    Oracle: 39.4,
    telecomNorm: 20,
    preAiCloud: 11,
  },
  {
    period: "H1’26*",
    Microsoft: 26.8,
    Amazon: 21.2,
    Alphabet: 25.4,
    Meta: 36.5,
    Oracle: 41.0,
    telecomNorm: 20,
    preAiCloud: 11,
  },
  {
    period: "Q3’26 g.",
    Microsoft: 26.8,
    Amazon: 22.8,
    Alphabet: 27.2,
    Meta: 39.1,
    Oracle: 43.5,
    telecomNorm: 20,
    preAiCloud: 11,
  },
  {
    period: "Aug-20",
    Microsoft: 26.8,
    Amazon: 23.8,
    Alphabet: 28.3,
    Meta: 40.5,
    Oracle: 43.5,
    telecomNorm: 20,
    preAiCloud: 11,
  },
];

export type FcfPathPoint = {
  period: string;
  Microsoft: number | null;
  Amazon: number | null;
  Alphabet: number | null;
  Meta: number | null;
  Oracle: number | null;
};

export const FCF_PATH: FcfPathPoint[] = [
  {
    period: "FY24",
    Microsoft: 28.2,
    Amazon: 6.8,
    Alphabet: 19.4,
    Meta: 24.1,
    Oracle: 18.0,
  },
  {
    period: "FY25",
    Microsoft: 25.4,
    Amazon: 3.1,
    Alphabet: 14.8,
    Meta: 18.2,
    Oracle: 7.2,
  },
  {
    period: "H1’26*",
    Microsoft: 22.1,
    Amazon: 2.4,
    Alphabet: 12.6,
    Meta: 16.1,
    Oracle: 5.8,
  },
  {
    period: "Q3’26 g.",
    Microsoft: 21.4,
    Amazon: 1.1,
    Alphabet: 10.8,
    Meta: 13.9,
    Oracle: 3.5,
  },
  {
    period: "Aug-20",
    Microsoft: 20.9,
    Amazon: 0.3,
    Alphabet: 9.9,
    Meta: 12.6,
    Oracle: 3.0,
  },
];

export type SustainabilityPoint = {
  company: CompanyId;
  intensity: number;
  fcfMargin: number;
  capexBn: number;
  fill: string;
  vintage: "prior" | "new";
};

export function sustainabilityScatter(
  vintage: "prior" | "new" | "both" = "both",
  companies: CompanyId[] = COMPANIES,
): SustainabilityPoint[] {
  const out: SustainabilityPoint[] = [];
  for (const c of companies) {
    if (vintage === "prior" || vintage === "both") {
      const r = PRIOR_VINTAGE.find((x) => x.company === c)!;
      out.push({
        company: c,
        intensity: r.intensityPct,
        fcfMargin: r.fcfMarginPct,
        capexBn: r.capexBn,
        fill: COMPANY_COLORS[c],
        vintage: "prior",
      });
    }
    if (vintage === "new" || vintage === "both") {
      const r = NEW_VINTAGE.find((x) => x.company === c)!;
      out.push({
        company: c,
        intensity: r.intensityPct,
        fcfMargin: r.fcfMarginPct,
        capexBn: r.capexBn,
        fill: COMPANY_COLORS[c],
        vintage: "new",
      });
    }
  }
  return out;
}

export type CapexBridgeRow = {
  company: CompanyId;
  prior: number;
  delta: number;
  neu: number;
  fill: string;
};

export function capexBridge(companies: CompanyId[] = COMPANIES): CapexBridgeRow[] {
  return vintageDeltas(companies).map((d) => ({
    company: d.company,
    prior: d.priorCapexBn,
    delta: d.capexDeltaBn,
    neu: d.newCapexBn,
    fill: d.fill,
  }));
}

/** Cumulative weighted intensity ladder (Big-4 ex-Oracle) across theme vintages */
export type WeightedLadderPoint = {
  vintage: string;
  weighted: number;
  label: string;
};

export const WEIGHTED_LADDER: WeightedLadderPoint[] = [
  { vintage: "Jul research", weighted: 21.8, label: "FY25 / Jul’26" },
  { vintage: "Aug update", weighted: 25.3, label: "H1’26 ann." },
  { vintage: "Q3 mid-guide", weighted: 26.9, label: "CY26 mid-guides" },
  { vintage: "Aug-20 desk", weighted: 27.8, label: "Late-Aug 202608" },
];

export const SUSTAINABILITY_BANDS = {
  comfortable: { low: 0, high: 15, label: "Historical cloud range", fill: "#86efac" },
  stretched: { low: 15, high: 25, label: "Elevated reinvestment", fill: "#fde68a" },
  extreme: { low: 25, high: 50, label: "Telecom / foundry territory", fill: "#fecaca" },
} as const;

export function revenueWeightedIntensity(rows: VintageRow[]): number {
  const set = rows.filter((r) => r.company !== "Oracle");
  const rev = set.reduce((s, r) => s + r.revenueBn, 0);
  const cap = set.reduce((s, r) => s + r.capexBn, 0);
  return +(100 * (cap / rev)).toFixed(1);
}

const _weightedPrior = revenueWeightedIntensity(PRIOR_VINTAGE);
const _weightedNew = revenueWeightedIntensity(NEW_VINTAGE);

export const HEADLINE = {
  weightedNew: _weightedNew,
  weightedPrior: _weightedPrior,
  weightedDeltaPp: +(_weightedNew - _weightedPrior).toFixed(1),
  metaNew: 40.5,
  metaDeltaPp: 1.4,
  msftHeld: 26.8,
  msftFcfDeltaPp: -0.5,
  oracleGuide: 43.5,
  oracleDeltaPp: 0.0,
  amazonFcfNew: 0.3,
  amazonDeltaPp: 1.0,
  alphabetDeltaPp: 1.1,
  amazonCapexDeltaBn: 8.0,
  alphabetCapexDeltaBn: 5.0,
  metaCapexDeltaBn: 3.5,
  totalCapexDeltaBn: 16.5,
  telecomNorm: 20,
  preAiCloud: 11,
  priorVintageLabel: "Q3’26 mid-guide intensity",
  newVintageLabel: "Late-Aug 202608 desk",
  julWeighted: 21.8,
  augWeighted: 25.3,
  q3Weighted: _weightedPrior,
  aug20Weighted: _weightedNew,
  julToAug20DeltaPp: +(_weightedNew - 21.8).toFixed(1),
  q3ToAug20DeltaPp: +(_weightedNew - _weightedPrior).toFixed(1),
};

export function fmtPct(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtPp(n: number, digits = 1): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(digits)} pp`;
}

export function fmtBn(n: number): string {
  return n >= 100 ? `$${n.toFixed(0)}B` : `$${n.toFixed(1)}B`;
}

export function intensityPathFor(companies: CompanyId[]) {
  return INTENSITY_PATH.map((row) => {
    const out: Record<string, string | number | null> = {
      period: row.period,
      telecomNorm: row.telecomNorm,
      preAiCloud: row.preAiCloud,
    };
    for (const c of companies) {
      out[c] = row[c];
    }
    return out;
  });
}

export function fcfPathFor(companies: CompanyId[]) {
  return FCF_PATH.map((row) => {
    const out: Record<string, string | number | null> = { period: row.period };
    for (const c of companies) {
      out[c] = row[c];
    }
    return out;
  });
}

export const COMPARISON_TABLE = NEW_VINTAGE.map((neu) => {
  const prior = PRIOR_VINTAGE.find((r) => r.company === neu.company)!;
  return {
    company: neu.company,
    priorLabel: prior.label,
    newLabel: neu.label,
    priorIntensity: prior.intensityPct,
    newIntensity: neu.intensityPct,
    deltaPp: +(neu.intensityPct - prior.intensityPct).toFixed(1),
    priorFcf: prior.fcfMarginPct,
    newFcf: neu.fcfMarginPct,
    fcfDeltaPp: +(neu.fcfMarginPct - prior.fcfMarginPct).toFixed(1),
    newCapexBn: neu.capexBn,
    confidence: neu.confidence,
  };
});

export const SOURCES = [
  {
    label: "Microsoft FY26 10-K (held intensity; FCF path refresh)",
    url: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0000789019&type=10-K",
  },
  {
    label: "Amazon / Alphabet / Meta late-Aug CY26 midpoint steps (desk)",
    url: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001018724&type=10-Q",
  },
  {
    label: "Oracle FY26 guide intensity (held)",
    url: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001341439&type=10-K",
  },
  {
    label: "Prior vintage — Q3 intensity mid-guide",
    url: "/blog/ai-capex-intensity-update-2026q3",
  },
  {
    label: "Companion spend tracker — late-Aug 202608",
    url: "/blog/ai-capex-spend-update-202608",
  },
  {
    label: "Theme baseline — intensity research",
    url: "/blog/ai-capex-intensity-research-2026",
  },
] as const;
