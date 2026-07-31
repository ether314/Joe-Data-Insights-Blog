/**
 * Hyperscaler capex intensity (capex ÷ revenue) and reinvestment sustainability.
 * Capex: SEC 10-K / 10-Q purchases of PP&E (gross). Revenue: reported total.
 * FCF margin: (operating cash flow − capex) ÷ revenue — coverage of reinvestment.
 * Sector benchmarks: public company aggregates / industry reports (labeled estimated where noted).
 */

export const SOURCE_NOTE =
  "Capex ÷ revenue from SEC filings (gross PP&E purchases ÷ total revenue). Free-cash-flow margin = (operating cash flow − capex) ÷ revenue. Sector bands from FCC ARMIS telecom history, S&P Global energy peer medians, and foundry 10-K ratios. FY labels follow each company’s fiscal calendar.";

export type Confidence = "disclosed" | "estimated";

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

export type IntensityRow = {
  fiscalYear: string;
  company: CompanyId;
  intensityPct: number;
  capexBn: number;
  revenueBn: number;
  /** (OCF − capex) ÷ revenue, percent */
  fcfMarginPct: number;
  confidence: Confidence;
  fiscalEnd: string;
};

/** Capex intensity + FCF coverage, FY20–FY25 */
export const INTENSITY_SERIES: IntensityRow[] = [
  // Microsoft (June FY)
  { fiscalYear: "FY20", company: "Microsoft", intensityPct: 10.9, capexBn: 15.4, revenueBn: 143.0, fcfMarginPct: 32.1, confidence: "disclosed", fiscalEnd: "Jun 2020" },
  { fiscalYear: "FY21", company: "Microsoft", intensityPct: 12.3, capexBn: 20.6, revenueBn: 168.1, fcfMarginPct: 33.4, confidence: "disclosed", fiscalEnd: "Jun 2021" },
  { fiscalYear: "FY22", company: "Microsoft", intensityPct: 12.0, capexBn: 23.9, revenueBn: 198.3, fcfMarginPct: 32.8, confidence: "disclosed", fiscalEnd: "Jun 2022" },
  { fiscalYear: "FY23", company: "Microsoft", intensityPct: 13.3, capexBn: 28.1, revenueBn: 211.9, fcfMarginPct: 28.9, confidence: "disclosed", fiscalEnd: "Jun 2023" },
  { fiscalYear: "FY24", company: "Microsoft", intensityPct: 18.1, capexBn: 44.5, revenueBn: 245.1, fcfMarginPct: 29.7, confidence: "disclosed", fiscalEnd: "Jun 2024" },
  { fiscalYear: "FY25", company: "Microsoft", intensityPct: 22.9, capexBn: 64.6, revenueBn: 281.7, fcfMarginPct: 25.4, confidence: "disclosed", fiscalEnd: "Jun 2025" },
  // Amazon (Dec FY) — retail + AWS; FCF volatile
  { fiscalYear: "FY20", company: "Amazon", intensityPct: 10.8, capexBn: 24.0, revenueBn: 221.6, fcfMarginPct: 11.8, confidence: "disclosed", fiscalEnd: "Dec 2020" },
  { fiscalYear: "FY21", company: "Amazon", intensityPct: 13.0, capexBn: 61.1, revenueBn: 469.8, fcfMarginPct: -2.1, confidence: "disclosed", fiscalEnd: "Dec 2021" },
  { fiscalYear: "FY22", company: "Amazon", intensityPct: 12.4, capexBn: 63.6, revenueBn: 514.0, fcfMarginPct: -3.3, confidence: "disclosed", fiscalEnd: "Dec 2022" },
  { fiscalYear: "FY23", company: "Amazon", intensityPct: 9.2, capexBn: 52.7, revenueBn: 574.8, fcfMarginPct: 5.6, confidence: "disclosed", fiscalEnd: "Dec 2023" },
  { fiscalYear: "FY24", company: "Amazon", intensityPct: 13.0, capexBn: 77.7, revenueBn: 597.9, fcfMarginPct: 6.2, confidence: "disclosed", fiscalEnd: "Dec 2024" },
  { fiscalYear: "FY25", company: "Amazon", intensityPct: 18.4, capexBn: 131.8, revenueBn: 716.9, fcfMarginPct: 3.1, confidence: "disclosed", fiscalEnd: "Dec 2025" },
  // Alphabet (Dec FY)
  { fiscalYear: "FY20", company: "Alphabet", intensityPct: 12.2, capexBn: 22.3, revenueBn: 182.5, fcfMarginPct: 18.4, confidence: "disclosed", fiscalEnd: "Dec 2020" },
  { fiscalYear: "FY21", company: "Alphabet", intensityPct: 10.1, capexBn: 24.6, revenueBn: 257.6, fcfMarginPct: 26.1, confidence: "disclosed", fiscalEnd: "Dec 2021" },
  { fiscalYear: "FY22", company: "Alphabet", intensityPct: 11.0, capexBn: 31.5, revenueBn: 282.8, fcfMarginPct: 21.3, confidence: "disclosed", fiscalEnd: "Dec 2022" },
  { fiscalYear: "FY23", company: "Alphabet", intensityPct: 10.8, capexBn: 32.3, revenueBn: 307.4, fcfMarginPct: 22.9, confidence: "disclosed", fiscalEnd: "Dec 2023" },
  { fiscalYear: "FY24", company: "Alphabet", intensityPct: 14.9, capexBn: 52.5, revenueBn: 350.0, fcfMarginPct: 20.1, confidence: "disclosed", fiscalEnd: "Dec 2024" },
  { fiscalYear: "FY25", company: "Alphabet", intensityPct: 22.7, capexBn: 91.4, revenueBn: 403.0, fcfMarginPct: 14.8, confidence: "disclosed", fiscalEnd: "Dec 2025" },
  // Meta (Dec FY)
  { fiscalYear: "FY20", company: "Meta", intensityPct: 17.6, capexBn: 15.2, revenueBn: 86.0, fcfMarginPct: 25.2, confidence: "disclosed", fiscalEnd: "Dec 2020" },
  { fiscalYear: "FY21", company: "Meta", intensityPct: 16.6, capexBn: 18.7, revenueBn: 112.6, fcfMarginPct: 24.8, confidence: "disclosed", fiscalEnd: "Dec 2021" },
  { fiscalYear: "FY22", company: "Meta", intensityPct: 27.9, capexBn: 31.4, revenueBn: 116.6, fcfMarginPct: 5.4, confidence: "disclosed", fiscalEnd: "Dec 2022" },
  { fiscalYear: "FY23", company: "Meta", intensityPct: 20.5, capexBn: 27.0, revenueBn: 134.9, fcfMarginPct: 25.9, confidence: "disclosed", fiscalEnd: "Dec 2023" },
  { fiscalYear: "FY24", company: "Meta", intensityPct: 22.8, capexBn: 37.3, revenueBn: 164.5, fcfMarginPct: 26.4, confidence: "disclosed", fiscalEnd: "Dec 2024" },
  { fiscalYear: "FY25", company: "Meta", intensityPct: 34.7, capexBn: 69.7, revenueBn: 201.0, fcfMarginPct: 18.2, confidence: "disclosed", fiscalEnd: "Dec 2025" },
  // Oracle (May FY)
  { fiscalYear: "FY21", company: "Oracle", intensityPct: 15.0, capexBn: 6.1, revenueBn: 40.5, fcfMarginPct: 24.1, confidence: "disclosed", fiscalEnd: "May 2021" },
  { fiscalYear: "FY22", company: "Oracle", intensityPct: 16.0, capexBn: 7.6, revenueBn: 47.3, fcfMarginPct: 21.8, confidence: "disclosed", fiscalEnd: "May 2022" },
  { fiscalYear: "FY23", company: "Oracle", intensityPct: 17.0, capexBn: 8.7, revenueBn: 50.0, fcfMarginPct: 19.6, confidence: "disclosed", fiscalEnd: "May 2023" },
  { fiscalYear: "FY24", company: "Oracle", intensityPct: 13.0, capexBn: 6.9, revenueBn: 52.9, fcfMarginPct: 22.4, confidence: "disclosed", fiscalEnd: "May 2024" },
  { fiscalYear: "FY25", company: "Oracle", intensityPct: 37.0, capexBn: 21.2, revenueBn: 57.4, fcfMarginPct: 8.9, confidence: "estimated", fiscalEnd: "May 2025" },
];

export type SectorBenchmark = {
  id: string;
  label: string;
  intensityPct: number;
  note: string;
  confidence: Confidence;
  band: "low" | "mid" | "high";
};

/** Cross-industry capital intensity anchors for sustainability context */
export const SECTOR_BENCHMARKS: SectorBenchmark[] = [
  { id: "saas", label: "Mature SaaS median", intensityPct: 4, note: "Asset-light software peers", confidence: "estimated", band: "low" },
  { id: "cloud-norm", label: "Pre-AI hyperscale (2015–19)", intensityPct: 11, note: "MSFT/GOOG/AMZN avg", confidence: "estimated", band: "low" },
  { id: "telecom-norm", label: "Wireline telecom norm", intensityPct: 20, note: "FCC ARMIS large ILEC pre-boom", confidence: "disclosed", band: "mid" },
  { id: "energy", label: "Integrated oil & gas", intensityPct: 16, note: "S&P Global peer median ~2023–24", confidence: "estimated", band: "mid" },
  { id: "foundry", label: "Leading-edge foundry", intensityPct: 45, note: "TSMC-class PP&E / sales peak cycles", confidence: "estimated", band: "high" },
  { id: "dotcom", label: "Dot-com telecom peak", intensityPct: 35, note: "1999–2000 carrier peak range mid", confidence: "estimated", band: "high" },
];

export const SUSTAINABILITY_BANDS = {
  comfortable: { low: 0, high: 15, label: "Historical cloud range", fill: "#86efac" },
  stretched: { low: 15, high: 25, label: "Elevated reinvestment", fill: "#fde68a" },
  extreme: { low: 25, high: 45, label: "Telecom / foundry territory", fill: "#fecaca" },
} as const;

export const HEADLINE = {
  metaFy25: 34.7,
  oracleFy25: 37.0,
  bigFourAvgFy25: 24.7,
  weightedIntensityFy25: 21.8,
  metaFcfFy25: 18.2,
  amazonFcfFy25: 3.1,
  telecomNorm: 20,
  dotComPeak: 35,
  preAiCloud: 11,
};

export const FISCAL_YEARS = ["FY20", "FY21", "FY22", "FY23", "FY24", "FY25"] as const;

export type FiscalYear = (typeof FISCAL_YEARS)[number];

export function fmtPct(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtBn(n: number): string {
  return n >= 100 ? `$${n.toFixed(0)}B` : `$${n.toFixed(1)}B`;
}

/** Latest-year ranked intensity rows (highest → lowest) */
export function rankedIntensity(year: FiscalYear, companies: CompanyId[] = COMPANIES) {
  return INTENSITY_SERIES.filter((r) => r.fiscalYear === year && companies.includes(r.company))
    .map((r) => ({
      company: r.company,
      intensity: r.intensityPct,
      fcfMargin: r.fcfMarginPct,
      capexBn: r.capexBn,
      revenueBn: r.revenueBn,
      fill: COMPANY_COLORS[r.company],
    }))
    .sort((a, b) => b.intensity - a.intensity);
}

/** Scatter points for selected year */
export function scatterForYear(year: FiscalYear, companies: CompanyId[] = COMPANIES) {
  return INTENSITY_SERIES.filter((r) => r.fiscalYear === year && companies.includes(r.company)).map(
    (r) => ({
      company: r.company,
      intensity: r.intensityPct,
      fcfMargin: r.fcfMarginPct,
      capexBn: r.capexBn,
      fill: COMPANY_COLORS[r.company],
    }),
  );
}

/** Stacked absolute capex by year */
export function stackedCapex(companies: CompanyId[] = COMPANIES) {
  return FISCAL_YEARS.map((fy) => {
    const row: Record<string, string | number> = { year: fy };
    let total = 0;
    for (const c of companies) {
      const rec = INTENSITY_SERIES.find((r) => r.fiscalYear === fy && r.company === c);
      const v = rec?.capexBn ?? 0;
      row[c] = v;
      total += v;
    }
    row.total = total;
    return row;
  });
}

/** Multi-series intensity trajectory */
export function intensityTrajectory(companies: CompanyId[] = COMPANIES) {
  return FISCAL_YEARS.map((fy) => {
    const row: Record<string, string | number | null> = { year: fy };
    for (const c of companies) {
      const rec = INTENSITY_SERIES.find((r) => r.fiscalYear === fy && r.company === c);
      row[c] = rec?.intensityPct ?? null;
    }
    row.telecomNorm = HEADLINE.telecomNorm;
    row.preAiCloud = HEADLINE.preAiCloud;
    return row;
  });
}

export const SOURCES = [
  {
    label: "Microsoft 10-K / 10-Q",
    url: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0000789019&type=10-K",
  },
  {
    label: "Amazon 10-K",
    url: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001018724&type=10-K",
  },
  {
    label: "Alphabet 10-K",
    url: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001652044&type=10-K",
  },
  {
    label: "Meta 10-K",
    url: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001326801&type=10-K",
  },
  {
    label: "Oracle 10-K",
    url: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001341439&type=10-K",
  },
  {
    label: "TIA / FCC ARMIS capital intensity",
    url: "https://standards.tiaonline.org/gov_affairs/fcc_filings/documents/Nov13-2002_CapEx_QoS_Final.pdf",
  },
] as const;
