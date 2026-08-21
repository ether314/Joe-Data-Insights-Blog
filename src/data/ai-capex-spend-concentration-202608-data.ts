/**
 * AI capex & spend concentration — late-Aug 202608 vintage.
 * Top-1 / top-3 shares, HHI, cumulative ladder, and Q3→202608 raise
 * concentration across Big-5 hyperscaler gross programs (~$858B).
 */

export type Confidence =
  | "actual"
  | "guidance"
  | "midpoint"
  | "desk"
  | "net-of-prepay"
  | "call";

export const SOURCE_NOTE =
  "Concentration lens on Big-5 hyperscaler gross capex — late-Aug 202608 desk vintage. Amazon ~$240B, Alphabet mid $218B, Microsoft ~$175B CY (lease reclass), Meta mid $150B, Oracle ~$75B net → Big-5 sum ~$858B. Prior mid-Q3 print ~$835B; Aug post-Q2 ~$802.5B; Jul research ~$760B. AI-attributed factor ≈75% of gross (CreditSights convention). Shares and HHI are within the Big-5 perimeter, not the entire global IT capex universe.";

export const SOURCES = [
  {
    label: "Late-Aug 202608 spend update",
    url: "/blog/ai-capex-spend-update-202608",
  },
  {
    label: "Mid-Q3 spend update",
    url: "/blog/ai-capex-spend-update-2026q3",
  },
  {
    label: "Q3 concentration companion",
    url: "/blog/ai-capex-spend-concentration-2026q3",
  },
  {
    label: "Theme baseline — AI capex spend research",
    url: "/blog/ai-capex-spend-research-2026",
  },
  {
    label: "Goldman Sachs Global Institute — Tracking Trillions",
    url: "https://www.goldmansachs.com/insights/articles/tracking-trillions-the-assumptions-shaping-scale-of-the-ai-build-out",
  },
] as const;

export const HEADLINE = {
  /** Late-Aug 202608 Big-5 midpoints */
  big5TotalBn: 858,
  top1SharePct: 28.0,
  top1Label: "Amazon",
  top1Bn: 240,
  top3SharePct: 73.8,
  top3Bn: 633,
  top3Labels: "Amazon + Alphabet + Microsoft",
  hhi: 2227,
  equalShareHhi: 2000,
  aiShareOfGross: 0.75,
  aiSliceBn: 644,
  /** Jul → Aug → Q3 → 202608 path */
  julBig5: 760,
  augBig5: 802.5,
  q3Big5: 835,
  aug20Big5: 858,
  q3ToAug20DeltaBn: 23,
  julToAug20DeltaBn: 98,
  /** Share of positive Q3→202608 dollar raises from Amazon+Alphabet */
  top2RaiseSharePct: 78.3,
  amazonRaiseBn: 10,
  alphabetRaiseBn: 8,
  metaRaiseBn: 5,
  /** Top-1 share path */
  top1Share2024Pct: 32.5,
  top1Share2025Pct: 30.2,
  top1ShareJul2026Pct: 26.3,
  top1ShareAug2026Pct: 27.4,
  top1ShareQ3Pct: 27.5,
  top1ShareAug20Pct: 28.0,
  /** Top-3 share path */
  top3Share2024Pct: 79.2,
  top3Share2025Pct: 76.7,
  top3ShareJul2026Pct: 75.6,
  top3ShareAug2026Pct: 74.1,
  top3ShareQ3Pct: 73.6,
  top3ShareAug20Pct: 73.8,
} as const;

export const HYPERSCALERS = [
  "Amazon",
  "Alphabet",
  "Microsoft",
  "Meta",
  "Oracle",
] as const;

export type Hyperscaler = (typeof HYPERSCALERS)[number];

export const COMPANY_COLORS: Record<Hyperscaler, string> = {
  Amazon: "#ff9900",
  Alphabet: "#34a853",
  Microsoft: "#00a4ef",
  Meta: "#0668e1",
  Oracle: "#f80000",
};

export type ShareRow = {
  company: Hyperscaler;
  bn: number;
  sharePct: number;
  cumulativeSharePct: number;
  confidence: Confidence;
  fill: string;
  note: string;
};

/** Ranked late-Aug 202608 share ladder (descending) */
export const SHARE_LADDER_202608: ShareRow[] = [
  {
    company: "Amazon",
    bn: 240,
    sharePct: 28.0,
    cumulativeSharePct: 28.0,
    confidence: "desk",
    fill: COMPANY_COLORS.Amazon,
    note: "Largest program; +$10B Q3→202608 on AWS / capacity commentary",
  },
  {
    company: "Alphabet",
    bn: 218,
    sharePct: 25.4,
    cumulativeSharePct: 53.4,
    confidence: "midpoint",
    fill: COMPANY_COLORS.Alphabet,
    note: "Fourth raise of the year; $210–225 midpoint $218B",
  },
  {
    company: "Microsoft",
    bn: 175,
    sharePct: 20.4,
    cumulativeSharePct: 73.8,
    confidence: "call",
    fill: COMPANY_COLORS.Microsoft,
    note: "Accounting CY flat; economic build nearer ~$190B if lease reclass reversed",
  },
  {
    company: "Meta",
    bn: 150,
    sharePct: 17.5,
    cumulativeSharePct: 91.3,
    confidence: "midpoint",
    fill: COMPANY_COLORS.Meta,
    note: "$145–155 mid; finance-lease principal still in stack",
  },
  {
    company: "Oracle",
    bn: 75,
    sharePct: 8.7,
    cumulativeSharePct: 100.0,
    confidence: "net-of-prepay",
    fill: COMPANY_COLORS.Oracle,
    note: "Net of customer prepayments; gross nearer $95–100B",
  },
];

export type CapexYearKey =
  | "2024"
  | "2025"
  | "2026-jul"
  | "2026-aug"
  | "2026-q3"
  | "2026-202608";

/** Gross company capex by vintage (USD bn) */
export const GROSS_BY_YEAR: Record<
  CapexYearKey,
  Record<Hyperscaler, number>
> = {
  "2024": { Amazon: 75, Alphabet: 52, Microsoft: 56, Meta: 39, Oracle: 9 },
  "2025": { Amazon: 104, Alphabet: 80, Microsoft: 80, Meta: 60, Oracle: 20 },
  "2026-jul": {
    Amazon: 200,
    Alphabet: 185,
    Microsoft: 190,
    Meta: 135,
    Oracle: 50,
  },
  "2026-aug": {
    Amazon: 220,
    Alphabet: 200,
    Microsoft: 175,
    Meta: 137.5,
    Oracle: 70,
  },
  "2026-q3": {
    Amazon: 230,
    Alphabet: 210,
    Microsoft: 175,
    Meta: 145,
    Oracle: 75,
  },
  "2026-202608": {
    Amazon: 240,
    Alphabet: 218,
    Microsoft: 175,
    Meta: 150,
    Oracle: 75,
  },
};

export const YEAR_LABELS: Record<CapexYearKey, string> = {
  "2024": "2024 actual",
  "2025": "2025 actual",
  "2026-jul": "2026 Jul research",
  "2026-aug": "2026 Aug post-Q2",
  "2026-q3": "2026 mid-Q3",
  "2026-202608": "2026 late-Aug 202608",
};

export function yearTotal(year: CapexYearKey, aiOnly: boolean): number {
  const row = GROSS_BY_YEAR[year];
  const gross = HYPERSCALERS.reduce((s, c) => s + row[c], 0);
  return aiOnly ? Math.round(gross * HEADLINE.aiShareOfGross) : gross;
}

export function companyShares(
  year: CapexYearKey,
  aiOnly: boolean,
): Array<{
  company: Hyperscaler;
  bn: number;
  sharePct: number;
  fill: string;
}> {
  const row = GROSS_BY_YEAR[year];
  const total = yearTotal(year, false);
  return [...HYPERSCALERS]
    .map((company) => {
      const gross = row[company];
      const bn = aiOnly ? Math.round(gross * HEADLINE.aiShareOfGross) : gross;
      return {
        company,
        bn,
        sharePct: Math.round((gross / total) * 1000) / 10,
        fill: COMPANY_COLORS[company],
      };
    })
    .sort((a, b) => b.bn - a.bn);
}

export function concentrationMetrics(year: CapexYearKey) {
  const ranked = companyShares(year, false);
  const top1 = ranked[0].sharePct;
  const top3 =
    Math.round(
      ranked.slice(0, 3).reduce((s, r) => s + r.sharePct, 0) * 10,
    ) / 10;
  const hhi = Math.round(
    ranked.reduce((s, r) => s + r.sharePct * r.sharePct, 0),
  );
  return {
    top1,
    top1Label: ranked[0].company,
    top3,
    hhi,
    total: yearTotal(year, false),
    ranked,
  };
}

/** Lorenz / cumulative concentration curve */
export function concentrationCurve(year: CapexYearKey) {
  const ranked = companyShares(year, false);
  const points: Array<{
    rank: number;
    label: string;
    cumulativeSharePct: number;
    equalPct: number;
  }> = [{ rank: 0, label: "0", cumulativeSharePct: 0, equalPct: 0 }];
  let cum = 0;
  ranked.forEach((r, i) => {
    cum += r.sharePct;
    points.push({
      rank: i + 1,
      label: r.company,
      cumulativeSharePct: Math.round(cum * 10) / 10,
      equalPct: Math.round(((i + 1) / ranked.length) * 1000) / 10,
    });
  });
  return points;
}

/** Multi-year top-1 / top-3 / HHI path */
export const CONCENTRATION_PATH = (
  [
    "2024",
    "2025",
    "2026-jul",
    "2026-aug",
    "2026-q3",
    "2026-202608",
  ] as CapexYearKey[]
).map((year) => {
  const m = concentrationMetrics(year);
  return {
    year,
    label: YEAR_LABELS[year],
    top1Pct: m.top1,
    top3Pct: m.top3,
    hhi: m.hhi,
    totalBn: m.total,
    top1Label: m.top1Label,
  };
});

/** Mid-Q3 → late-Aug 202608 company deltas (raise concentration) */
export type RaiseRow = {
  company: Hyperscaler;
  priorBn: number;
  newBn: number;
  deltaBn: number;
  fill: string;
  note: string;
};

export const RAISE_ROWS: RaiseRow[] = [
  {
    company: "Amazon",
    priorBn: 230,
    newBn: 240,
    deltaBn: 10,
    fill: COMPANY_COLORS.Amazon,
    note: "Largest absolute Q3→202608 raise again",
  },
  {
    company: "Alphabet",
    priorBn: 210,
    newBn: 218,
    deltaBn: 8,
    fill: COMPANY_COLORS.Alphabet,
    note: "Fourth raise of the year; ceiling stepped",
  },
  {
    company: "Meta",
    priorBn: 145,
    newBn: 150,
    deltaBn: 5,
    fill: COMPANY_COLORS.Meta,
    note: "Ceiling stepped; floor held",
  },
  {
    company: "Oracle",
    priorBn: 75,
    newBn: 75,
    deltaBn: 0,
    fill: COMPANY_COLORS.Oracle,
    note: "Net-of-prepay flat; gross still higher",
  },
  {
    company: "Microsoft",
    priorBn: 175,
    newBn: 175,
    deltaBn: 0,
    fill: COMPANY_COLORS.Microsoft,
    note: "Accounting print flat — lease reclass still the economic story",
  },
];

/** Positive-only raise shares for donut */
export const POSITIVE_RAISE_SLICES = RAISE_ROWS.filter((r) => r.deltaBn > 0).map(
  (r) => {
    const positiveSum = RAISE_ROWS.filter((x) => x.deltaBn > 0).reduce(
      (s, x) => s + x.deltaBn,
      0,
    );
    return {
      company: r.company,
      deltaBn: r.deltaBn,
      sharePct: Math.round((r.deltaBn / positiveSum) * 1000) / 10,
      fill: r.fill,
    };
  },
);

/** Scenario / perimeter comparison */
export type PerimeterRow = {
  id: string;
  label: string;
  scope: string;
  bn2026: number;
  color: string;
  note: string;
};

export const PERIMETER_STACKS: PerimeterRow[] = [
  {
    id: "big5-202608",
    label: "Big-5 late-Aug 202608",
    scope: "Hyperscaler gross midpoints",
    bn2026: 858,
    color: "#f59e0b",
    note: "Concentration lens perimeter",
  },
  {
    id: "street",
    label: "Street ~2026",
    scope: "Hyperscaler consensus band",
    bn2026: 845,
    color: "#8b5cf6",
    note: "Catch-up still trailing desk midpoints",
  },
  {
    id: "credit",
    label: "CreditSights",
    scope: "Hyperscaler credit-desk aggregate",
    bn2026: 850,
    color: "#06b6d4",
    note: "Near Big-5 sum; AI haircut separate",
  },
  {
    id: "gs-gi",
    label: "GS Global Institute",
    scope: "All-in AI infra (compute + DC + power)",
    bn2026: 765,
    color: "#0ea5e9",
    note: "Different perimeter — not company-shareable",
  },
  {
    id: "gs-ir",
    label: "GS IR hyperscaler",
    scope: "Investment Research hyperscaler path",
    bn2026: 815,
    color: "#f43f5e",
    note: "2026 IR vintage; 2027 base still $1.14T",
  },
];

/** Economic vs accounting Microsoft sensitivity on concentration */
export const MSFT_SENSITIVITY = [
  {
    id: "accounting",
    label: "Accounting CY ($175B)",
    msftBn: 175,
    big5: 858,
    top1Pct: 28.0,
    top3Pct: 73.8,
    hhi: 2227,
  },
  {
    id: "economic",
    label: "Economic CY (~$190B)",
    msftBn: 190,
    big5: 873,
    top1Pct: 27.5,
    top3Pct: 74.2,
    hhi: 2210,
  },
] as const;

export function fmtBn(n: number): string {
  if (Math.abs(n) >= 1000) return `$${(n / 1000).toFixed(2)}T`;
  return `$${n.toFixed(n % 1 === 0 ? 0 : 1)}B`;
}

export function fmtPct(n: number): string {
  return `${n % 1 === 0 ? n.toFixed(0) : n.toFixed(1)}%`;
}

export function fmtHhi(n: number): string {
  return n.toLocaleString("en-US");
}
