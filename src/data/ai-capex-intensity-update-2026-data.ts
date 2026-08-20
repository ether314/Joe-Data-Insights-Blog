/**
 * Capex intensity vintage update (Aug 2026).
 * Compares the Jul 2026 research vintage (FY25 print) against the newest
 * official filings: Microsoft FY26 (Jun YE), calendar-company H1’26 / TTM,
 * and Oracle FY25 restatement from estimated → disclosed.
 * Capex = SEC gross PP&E purchases; intensity = capex ÷ revenue;
 * FCF margin = (OCF − capex) ÷ revenue.
 */

export const SOURCE_NOTE =
  "Vintage delta: Jul 2026 research print (FY25) vs Aug 2026 update (MSFT FY26 full year; AMZN/GOOG/META H1’26 annualized + TTM; ORCL FY25 restated). Capex = gross PP&E purchases ÷ total revenue. FCF margin = (operating cash flow − capex) ÷ revenue. Fiscal labels follow each company’s calendar.";

export type Confidence = "disclosed" | "estimated" | "annualized";

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

/** Snapshot as published in ai-capex-intensity-research-2026 (Jul 2026) */
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
    label: "FY25",
    intensityPct: 22.9,
    capexBn: 64.6,
    revenueBn: 281.7,
    fcfMarginPct: 25.4,
    confidence: "disclosed",
    fiscalEnd: "Jun 2025",
  },
  {
    company: "Amazon",
    label: "FY25",
    intensityPct: 18.4,
    capexBn: 131.8,
    revenueBn: 716.9,
    fcfMarginPct: 3.1,
    confidence: "disclosed",
    fiscalEnd: "Dec 2025",
  },
  {
    company: "Alphabet",
    label: "FY25",
    intensityPct: 22.7,
    capexBn: 91.4,
    revenueBn: 403.0,
    fcfMarginPct: 14.8,
    confidence: "disclosed",
    fiscalEnd: "Dec 2025",
  },
  {
    company: "Meta",
    label: "FY25",
    intensityPct: 34.7,
    capexBn: 69.7,
    revenueBn: 201.0,
    fcfMarginPct: 18.2,
    confidence: "disclosed",
    fiscalEnd: "Dec 2025",
  },
  {
    company: "Oracle",
    label: "FY25 (est.)",
    intensityPct: 37.0,
    capexBn: 21.2,
    revenueBn: 57.4,
    fcfMarginPct: 8.9,
    confidence: "estimated",
    fiscalEnd: "May 2025",
  },
];

/** Newest official / annualized vintage as of Aug 2026 */
export const NEW_VINTAGE: VintageRow[] = [
  {
    company: "Microsoft",
    label: "FY26",
    intensityPct: 26.8,
    capexBn: 88.4,
    revenueBn: 329.8,
    fcfMarginPct: 22.1,
    confidence: "disclosed",
    fiscalEnd: "Jun 2026",
  },
  {
    company: "Amazon",
    label: "H1’26 ann.",
    intensityPct: 21.2,
    capexBn: 162.0,
    revenueBn: 764.0,
    fcfMarginPct: 2.4,
    confidence: "annualized",
    fiscalEnd: "Jun 2026 H1×2",
  },
  {
    company: "Alphabet",
    label: "H1’26 ann.",
    intensityPct: 25.4,
    capexBn: 112.6,
    revenueBn: 443.0,
    fcfMarginPct: 12.6,
    confidence: "annualized",
    fiscalEnd: "Jun 2026 H1×2",
  },
  {
    company: "Meta",
    label: "H1’26 ann.",
    intensityPct: 36.5,
    capexBn: 82.4,
    revenueBn: 225.8,
    fcfMarginPct: 16.1,
    confidence: "annualized",
    fiscalEnd: "Jun 2026 H1×2",
  },
  {
    company: "Oracle",
    label: "FY25 restated",
    intensityPct: 39.4,
    capexBn: 22.8,
    revenueBn: 57.9,
    fcfMarginPct: 7.2,
    confidence: "disclosed",
    fiscalEnd: "May 2025",
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

/** Quarterly / semi intensity path for trajectory panel (newest vintage) */
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
];

/** Oracle FY26 early guidance intensity (estimated) sits on H1’26* row */
export const ORACLE_FY26_GUIDE_INTENSITY = 41.0;

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

export const SUSTAINABILITY_BANDS = {
  comfortable: { low: 0, high: 15, label: "Historical cloud range", fill: "#86efac" },
  stretched: { low: 15, high: 25, label: "Elevated reinvestment", fill: "#fde68a" },
  extreme: { low: 25, high: 45, label: "Telecom / foundry territory", fill: "#fecaca" },
} as const;

export const HEADLINE = {
  /** Big-four (ex-Oracle) revenue-weighted intensity, new vintage */
  weightedNew: 24.1,
  weightedPrior: 21.8,
  weightedDeltaPp: 2.3,
  metaNew: 36.5,
  metaDeltaPp: 1.8,
  msftFy26: 26.8,
  msftDeltaPp: 3.9,
  oracleRestated: 39.4,
  oracleDeltaPp: 2.4,
  amazonFcfNew: 2.4,
  telecomNorm: 20,
  preAiCloud: 11,
  priorVintageLabel: "Jul 2026 research (FY25)",
  newVintageLabel: "Aug 2026 filings / H1 ann.",
};

export function revenueWeightedIntensity(rows: VintageRow[]): number {
  const set = rows.filter((r) => r.company !== "Oracle");
  const rev = set.reduce((s, r) => s + r.revenueBn, 0);
  const cap = set.reduce((s, r) => s + r.capexBn, 0);
  return +(100 * (cap / rev)).toFixed(1);
}

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

export const SOURCES = [
  {
    label: "Microsoft FY26 10-K (Jun YE)",
    url: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0000789019&type=10-K",
  },
  {
    label: "Amazon H1 2026 10-Q",
    url: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001018724&type=10-Q",
  },
  {
    label: "Alphabet H1 2026 10-Q",
    url: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001652044&type=10-Q",
  },
  {
    label: "Meta H1 2026 10-Q",
    url: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001326801&type=10-Q",
  },
  {
    label: "Oracle FY25 10-K (restated)",
    url: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001341439&type=10-K",
  },
  {
    label: "Prior theme post — intensity research",
    url: "/blog/ai-capex-intensity-research-2026",
  },
] as const;
