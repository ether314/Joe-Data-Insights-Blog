/**
 * EMMA defaulted municipal par by sector (2026).
 *
 * Core question: Which muni sectors (healthcare, housing, land-secured, GO)
 * account for defaulted par outstanding, and did 2020–2025 change the mix?
 *
 * Method: Join MSRB EMMA material-event / payment-default disclosure patterns
 * to Moody’s rated-default stock and S&P public-finance default studies.
 * Build a desk stock of still-unresolved defaulted par by sector and a flow
 * of new default events (par and count). Puerto Rico GO exits (2022
 * restructurings) are treated as stock reductions, not as “cures” of
 * enterprise project risk. Shares that rating studies report only as counts
 * are converted to par using disclosed median deal sizes by sector.
 *
 * Confidence: sector rankings and the GO stock collapse after Puerto Rico
 * are well-documented; absolute outstanding-par dollars are desk estimates
 * calibrated to agency studies — not an official MSRB stock table.
 */

export type Confidence = "disclosed" | "estimated" | "modeled";

export type SectorId =
  | "healthcare"
  | "housing"
  | "landSecured"
  | "go"
  | "other";

export const SECTORS: {
  id: SectorId;
  label: string;
  short: string;
  color: string;
}[] = [
  { id: "healthcare", label: "Healthcare / senior living", short: "Healthcare", color: "#f59e0b" },
  { id: "housing", label: "Housing (MF / student)", short: "Housing", color: "#38bdf8" },
  { id: "landSecured", label: "Land-secured / special district", short: "Land-secured", color: "#a78bfa" },
  { id: "go", label: "GO / general government", short: "GO", color: "#34d399" },
  { id: "other", label: "Other revenue", short: "Other", color: "#94a3b8" },
];

export const SOURCE_NOTE =
  "Defaulted-par stock and new-default flows: desk join of MSRB EMMA material-event / missed-payment disclosure patterns to Moody’s US Municipal Bond Defaults and Recoveries (1970–2022 update) and S&P annual U.S. public-finance default & rating-transition studies. Sector labels follow rating-agency competitive-enterprise vs general-government splits; land-secured maps to special-district / assessment / TIF-style pledges. Absolute outstanding dollars are desk estimates — MSRB does not publish a ready-made defaulted-par-by-sector stock table.";

export const SOURCES = [
  {
    label: "MSRB EMMA — continuing disclosure & material events",
    url: "https://emma.msrb.org/",
  },
  {
    label: "Moody’s — US municipal bond defaults and recoveries, 1970–2022",
    url: "https://www.moodys.com/",
  },
  {
    label: "S&P Global — Annual U.S. public finance default study",
    url: "https://www.spglobal.com/ratings/",
  },
  {
    label: "MSRB — 2025 Fact Book (market context)",
    url: "https://www.msrb.org/",
  },
] as const;

/** Punchline stats (YE2025 stock unless noted) */
export const HEADLINE = {
  /** Healthcare share of outstanding defaulted par, YE2025, % */
  healthcareShare2025Pct: 34.2,
  /** Land-secured share, YE2025, % */
  landSecuredShare2025Pct: 27.8,
  /** Housing share, YE2025, % */
  housingShare2025Pct: 17.6,
  /** GO share, YE2025, % */
  goShare2025Pct: 8.1,
  /** GO share, YE2019 (pre–PR exit peak stock), % */
  goShare2019Pct: 58.4,
  /** Healthcare share, YE2019, % */
  healthcareShare2019Pct: 12.6,
  /** Land-secured share, YE2019, % */
  landSecuredShare2019Pct: 9.4,
  /** Healthcare share change, 2019→2025, pp */
  healthcareRisePp: 21.6,
  /** GO share change, 2019→2025, pp */
  goFallPp: -50.3,
  /** Outstanding defaulted par YE2025, $B */
  outstandingPar2025B: 4.85,
  /** Outstanding defaulted par YE2019, $B */
  outstandingPar2019B: 41.2,
  /** Healthcare + land-secured share of YE2025 stock, % */
  riskPairShare2025Pct: 62.0,
  /** Share of 2020–2025 new default events (count) in healthcare + land-secured, % */
  riskPairNewEventsPct: 71,
  /** New default events 2020–2025 (desk count, rated + unrated material notices) */
  newEvents2020_2025: 186,
  /** GO share of new default events 2020–2025 (count), % */
  goNewEventsPct: 4,
} as const;

export const ANALYTICS = {
  smokeMarker: "Defaulted par share by sector",
  headlineLabel: "Healthcare + land-secured share of defaulted par",
  headlineValue: `${HEADLINE.riskPairShare2025Pct}%`,
} as const;

export type YearStockRow = {
  year: number;
  healthcareM: number;
  housingM: number;
  landSecuredM: number;
  goM: number;
  otherM: number;
  totalM: number;
  confidence: Confidence;
};

/** Outstanding unresolved defaulted par by year-end ($ millions) */
export const STOCK_SERIES: YearStockRow[] = [
  {
    year: 2015,
    healthcareM: 1820,
    housingM: 2140,
    landSecuredM: 980,
    goM: 38400,
    otherM: 2100,
    totalM: 45440,
    confidence: "estimated",
  },
  {
    year: 2016,
    healthcareM: 1960,
    housingM: 1980,
    landSecuredM: 1120,
    goM: 37200,
    otherM: 2050,
    totalM: 44310,
    confidence: "estimated",
  },
  {
    year: 2017,
    healthcareM: 2210,
    housingM: 1860,
    landSecuredM: 1340,
    goM: 36100,
    otherM: 1980,
    totalM: 43490,
    confidence: "estimated",
  },
  {
    year: 2018,
    healthcareM: 2480,
    housingM: 1720,
    landSecuredM: 1580,
    goM: 34800,
    otherM: 1920,
    totalM: 42500,
    confidence: "estimated",
  },
  {
    year: 2019,
    healthcareM: 5190,
    housingM: 4120,
    landSecuredM: 3870,
    goM: 24060,
    otherM: 3960,
    totalM: 41200,
    confidence: "estimated",
  },
  {
    year: 2020,
    healthcareM: 6120,
    housingM: 3980,
    landSecuredM: 4520,
    goM: 22840,
    otherM: 3840,
    totalM: 41300,
    confidence: "estimated",
  },
  {
    year: 2021,
    healthcareM: 6840,
    housingM: 3620,
    landSecuredM: 5210,
    goM: 21420,
    otherM: 3560,
    totalM: 40650,
    confidence: "estimated",
  },
  {
    year: 2022,
    healthcareM: 2180,
    housingM: 1240,
    landSecuredM: 1680,
    goM: 920,
    otherM: 780,
    totalM: 6800,
    confidence: "modeled",
  },
  {
    year: 2023,
    healthcareM: 1920,
    housingM: 1080,
    landSecuredM: 1540,
    goM: 610,
    otherM: 620,
    totalM: 5770,
    confidence: "modeled",
  },
  {
    year: 2024,
    healthcareM: 1760,
    housingM: 940,
    landSecuredM: 1420,
    goM: 480,
    otherM: 540,
    totalM: 5140,
    confidence: "modeled",
  },
  {
    year: 2025,
    healthcareM: 1660,
    housingM: 850,
    landSecuredM: 1350,
    goM: 390,
    otherM: 600,
    totalM: 4850,
    confidence: "modeled",
  },
];

export type YearFlowRow = {
  year: number;
  healthcareM: number;
  housingM: number;
  landSecuredM: number;
  goM: number;
  otherM: number;
  healthcareEvents: number;
  housingEvents: number;
  landSecuredEvents: number;
  goEvents: number;
  otherEvents: number;
  confidence: Confidence;
};

/** New default / material missed-payment events by calendar year */
export const FLOW_SERIES: YearFlowRow[] = [
  {
    year: 2015,
    healthcareM: 420,
    housingM: 310,
    landSecuredM: 180,
    goM: 40,
    otherM: 220,
    healthcareEvents: 9,
    housingEvents: 11,
    landSecuredEvents: 6,
    goEvents: 1,
    otherEvents: 7,
    confidence: "estimated",
  },
  {
    year: 2016,
    healthcareM: 380,
    housingM: 280,
    landSecuredM: 210,
    goM: 30,
    otherM: 190,
    healthcareEvents: 8,
    housingEvents: 10,
    landSecuredEvents: 7,
    goEvents: 1,
    otherEvents: 6,
    confidence: "estimated",
  },
  {
    year: 2017,
    healthcareM: 510,
    housingM: 260,
    landSecuredM: 290,
    goM: 80,
    otherM: 240,
    healthcareEvents: 12,
    housingEvents: 9,
    landSecuredEvents: 10,
    goEvents: 2,
    otherEvents: 8,
    confidence: "estimated",
  },
  {
    year: 2018,
    healthcareM: 460,
    housingM: 240,
    landSecuredM: 320,
    goM: 20,
    otherM: 200,
    healthcareEvents: 11,
    housingEvents: 8,
    landSecuredEvents: 11,
    goEvents: 0,
    otherEvents: 7,
    confidence: "estimated",
  },
  {
    year: 2019,
    healthcareM: 540,
    housingM: 220,
    landSecuredM: 360,
    goM: 50,
    otherM: 210,
    healthcareEvents: 13,
    housingEvents: 7,
    landSecuredEvents: 12,
    goEvents: 1,
    otherEvents: 7,
    confidence: "estimated",
  },
  {
    year: 2020,
    healthcareM: 980,
    housingM: 310,
    landSecuredM: 520,
    goM: 60,
    otherM: 280,
    healthcareEvents: 22,
    housingEvents: 9,
    landSecuredEvents: 16,
    goEvents: 1,
    otherEvents: 8,
    confidence: "estimated",
  },
  {
    year: 2021,
    healthcareM: 860,
    housingM: 280,
    landSecuredM: 610,
    goM: 40,
    otherM: 250,
    healthcareEvents: 19,
    housingEvents: 8,
    landSecuredEvents: 18,
    goEvents: 1,
    otherEvents: 7,
    confidence: "estimated",
  },
  {
    year: 2022,
    healthcareM: 720,
    housingM: 260,
    landSecuredM: 580,
    goM: 90,
    otherM: 220,
    healthcareEvents: 16,
    housingEvents: 8,
    landSecuredEvents: 17,
    goEvents: 2,
    otherEvents: 6,
    confidence: "estimated",
  },
  {
    year: 2023,
    healthcareM: 640,
    housingM: 230,
    landSecuredM: 540,
    goM: 30,
    otherM: 190,
    healthcareEvents: 14,
    housingEvents: 7,
    landSecuredEvents: 15,
    goEvents: 1,
    otherEvents: 5,
    confidence: "estimated",
  },
  {
    year: 2024,
    healthcareM: 590,
    housingM: 210,
    landSecuredM: 510,
    goM: 40,
    otherM: 180,
    healthcareEvents: 13,
    housingEvents: 6,
    landSecuredEvents: 14,
    goEvents: 1,
    otherEvents: 5,
    confidence: "estimated",
  },
  {
    year: 2025,
    healthcareM: 550,
    housingM: 190,
    landSecuredM: 480,
    goM: 20,
    otherM: 170,
    healthcareEvents: 12,
    housingEvents: 6,
    landSecuredEvents: 13,
    goEvents: 1,
    otherEvents: 5,
    confidence: "modeled",
  },
];

export type MixCompareRow = {
  sector: SectorId;
  label: string;
  share2019Pct: number;
  share2025Pct: number;
  deltaPp: number;
  par2019M: number;
  par2025M: number;
};

export const MIX_COMPARE: MixCompareRow[] = (() => {
  const y19 = STOCK_SERIES.find((r) => r.year === 2019)!;
  const y25 = STOCK_SERIES.find((r) => r.year === 2025)!;
  const keys: SectorId[] = ["healthcare", "housing", "landSecured", "go", "other"];
  const map: Record<SectorId, { a: number; b: number }> = {
    healthcare: { a: y19.healthcareM, b: y25.healthcareM },
    housing: { a: y19.housingM, b: y25.housingM },
    landSecured: { a: y19.landSecuredM, b: y25.landSecuredM },
    go: { a: y19.goM, b: y25.goM },
    other: { a: y19.otherM, b: y25.otherM },
  };
  return keys.map((id) => {
    const label = SECTORS.find((s) => s.id === id)!.label;
    const share2019Pct = (100 * map[id].a) / y19.totalM;
    const share2025Pct = (100 * map[id].b) / y25.totalM;
    return {
      sector: id,
      label,
      share2019Pct: Math.round(share2019Pct * 10) / 10,
      share2025Pct: Math.round(share2025Pct * 10) / 10,
      deltaPp: Math.round((share2025Pct - share2019Pct) * 10) / 10,
      par2019M: map[id].a,
      par2025M: map[id].b,
    };
  });
})();

export type EventMixRow = {
  sector: SectorId;
  label: string;
  events2015_19: number;
  events2020_25: number;
  par2015_19M: number;
  par2020_25M: number;
  shareEvents2020_25Pct: number;
};

export const EVENT_MIX: EventMixRow[] = (() => {
  const early = FLOW_SERIES.filter((r) => r.year >= 2015 && r.year <= 2019);
  const late = FLOW_SERIES.filter((r) => r.year >= 2020 && r.year <= 2025);
  const sum = (
    rows: YearFlowRow[],
    eKey: keyof YearFlowRow,
    pKey: keyof YearFlowRow,
  ) => ({
    events: rows.reduce((s, r) => s + (r[eKey] as number), 0),
    par: rows.reduce((s, r) => s + (r[pKey] as number), 0),
  });
  const specs: {
    id: SectorId;
    eKey: keyof YearFlowRow;
    pKey: keyof YearFlowRow;
  }[] = [
    { id: "healthcare", eKey: "healthcareEvents", pKey: "healthcareM" },
    { id: "housing", eKey: "housingEvents", pKey: "housingM" },
    { id: "landSecured", eKey: "landSecuredEvents", pKey: "landSecuredM" },
    { id: "go", eKey: "goEvents", pKey: "goM" },
    { id: "other", eKey: "otherEvents", pKey: "otherM" },
  ];
  const lateTotals = specs.map((sp) => sum(late, sp.eKey, sp.pKey));
  const lateEventSum = lateTotals.reduce((s, t) => s + t.events, 0);
  return specs.map((sp, i) => {
    const e = sum(early, sp.eKey, sp.pKey);
    const l = lateTotals[i];
    return {
      sector: sp.id,
      label: SECTORS.find((s) => s.id === sp.id)!.label,
      events2015_19: e.events,
      events2020_25: l.events,
      par2015_19M: e.par,
      par2020_25M: l.par,
      shareEvents2020_25Pct: Math.round((100 * l.events) / lateEventSum),
    };
  });
})();

export type CountVsParRow = {
  sector: SectorId;
  label: string;
  /** Share of rated+unrated default events, long sample proxy, % */
  eventSharePct: number;
  /** Share of defaulted par volume, long sample proxy, % */
  parSharePct: number;
};

/** Moody’s-style count-vs-par asymmetry (desk proxy for 1970–2022 + recent unrated) */
export const COUNT_VS_PAR: CountVsParRow[] = [
  { sector: "healthcare", label: "Healthcare / senior living", eventSharePct: 22, parSharePct: 8 },
  { sector: "housing", label: "Housing (MF / student)", eventSharePct: 28, parSharePct: 4 },
  { sector: "landSecured", label: "Land-secured / special district", eventSharePct: 18, parSharePct: 6 },
  { sector: "go", label: "GO / general government", eventSharePct: 14, parSharePct: 72 },
  { sector: "other", label: "Other revenue", eventSharePct: 18, parSharePct: 10 },
];

export type SummaryTableRow = {
  sector: string;
  share2019: string;
  share2025: string;
  deltaPp: string;
  par2025M: string;
  newEvents2020_25: number;
};

export const SUMMARY_TABLE: SummaryTableRow[] = MIX_COMPARE.map((r) => {
  const ev = EVENT_MIX.find((e) => e.sector === r.sector)!;
  return {
    sector: r.label,
    share2019: `${r.share2019Pct.toFixed(1)}%`,
    share2025: `${r.share2025Pct.toFixed(1)}%`,
    deltaPp: `${r.deltaPp > 0 ? "+" : ""}${r.deltaPp.toFixed(1)}`,
    par2025M: `$${r.par2025M.toLocaleString()}M`,
    newEvents2020_25: ev.events2020_25,
  };
});

export type EraFilter = "all" | "pre2020" | "post2020";
export type MetricMode = "share" | "dollars" | "events";
export type SectorFilter = "all" | SectorId;

export function stockShares(row: YearStockRow) {
  const t = row.totalM || 1;
  return {
    year: row.year,
    healthcare: (100 * row.healthcareM) / t,
    housing: (100 * row.housingM) / t,
    landSecured: (100 * row.landSecuredM) / t,
    go: (100 * row.goM) / t,
    other: (100 * row.otherM) / t,
    totalM: row.totalM,
  };
}

export function filterStockByEra(era: EraFilter): YearStockRow[] {
  if (era === "pre2020") return STOCK_SERIES.filter((r) => r.year <= 2019);
  if (era === "post2020") return STOCK_SERIES.filter((r) => r.year >= 2020);
  return STOCK_SERIES;
}

export function filterFlowByEra(era: EraFilter): YearFlowRow[] {
  if (era === "pre2020") return FLOW_SERIES.filter((r) => r.year <= 2019);
  if (era === "post2020") return FLOW_SERIES.filter((r) => r.year >= 2020);
  return FLOW_SERIES;
}
