/**
 * Kidney median wait months versus DSA transplant rates (2026).
 *
 * Core question: How large is the remaining gap in median kidney wait time
 * across donation service areas after the March 2021 removal of DSA/Region
 * hard boundaries (KAS250) — the geographic step on OPTN’s path toward
 * continuous distribution?
 *
 * Perimeter: Adult deceased-donor kidney transplant (DDKT) waiting time at
 * transplant (months) and DDKT rates (transplants per 100 patient-years) from
 * OPTN/SRTR Annual Data Report Kidney chapters, HRSA/OPTN policy materials,
 * and peer-reviewed KAS250 evaluations. Full kidney continuous-distribution
 * (composite allocation score) remains in OPTN development; this desk treats
 * KAS250 circles as the live post–DSA-boundary regime.
 *
 * Headline: After KAS250, national median wait at transplant fell only from
 * 61 to 58 months; long-wait centers still ~20 months above short-wait peers
 * (69 vs 49). DSA-level transplant-rate MIRR compressed from ~1.35 to ~1.17,
 * but pretransplant mortality still spans 2.5–7.0 deaths per 100 patient-years
 * across DSAs (SRTR 2024).
 */

export type Confidence = "disclosed" | "estimated" | "scenario";

export const SOURCE_NOTE =
  "National adult kidney waitlist counts, DDKT rates, nonuse, and DSA-range pretransplant mortality: OPTN/SRTR 2024 Annual Data Report — Kidney (HRSA/SRTR). KAS250 policy context: OPTN kidney allocation (250-nautical-mile circles, March 15, 2021) and OPTN continuous-distribution framework updates. Pre/post median waiting time at transplant (national 61→58 months; LWT centers 74→69; SWT centers ~50→49): Transplantation Proceedings analysis of SRTR adult DDKT recipients (pre window Aug 2018–Jul 2019; post May 2021–Apr 2022). DSA-level median incidence rate ratio (MIRR) for DDKT rates before/after circles: Clinical Transplantation multilevel Poisson decomposition (~1.35 → ~1.17). Sample DSA wait/rate rows are estimated composites anchored to those published national ranges and SRTR DSA variation — not official OPTN DSA scorecards.";

export const SOURCES = [
  {
    label: "OPTN/SRTR 2024 Annual Data Report — Kidney",
    url: "https://srtr.hrsa.gov/adr/2024/Kidney/",
  },
  {
    label: "OPTN — Continuous distribution of kidneys and pancreata (framework updates)",
    url: "https://optn.transplant.hrsa.gov/policies-bylaws/public-comment/update-on-continuous-distribution-of-kidneys-and-pancreata",
  },
  {
    label: "HRSA — Organ Procurement and Transplantation Network",
    url: "https://www.hrsa.gov/optn",
  },
  {
    label:
      "Transplantation Proceedings — Determinants of Long Waiting Time to Kidney Transplantation (KAS250)",
    url: "https://doi.org/10.1016/j.transproceed.2024.08.011",
  },
  {
    label:
      "Clinical Transplantation — Center Geography or Center Practice? (DSA MIRR pre/post circles)",
    url: "https://doi.org/10.1111/ctr.70543",
  },
] as const;

export const HEADLINE = {
  /** National median wait months at DDKT (pre KAS250 window) */
  nationalWaitPre: 61,
  /** National median wait months at DDKT (early post KAS250 window) */
  nationalWaitPost: 58,
  waitDropMonths: 3,
  /** Long-wait center medians */
  lwtWaitPre: 74,
  lwtWaitPost: 69,
  /** Short-wait center medians */
  swtWaitPre: 50,
  swtWaitPost: 49,
  /** Remaining LWT−SWT gap post */
  remainingCenterGapMonths: 20,
  centerGapPreMonths: 24,
  /** DSA transplant-rate MIRR (point estimates from multilevel models) */
  dsaMirrPre: 1.35,
  dsaMirrPost: 1.17,
  /** Share of remaining geographic rate variation attributed to centers within DSA */
  centerShareOfGeoVarPct: 93.4,
  /** SRTR 2024 DSA pretransplant mortality range (deaths / 100 patient-years) */
  mortalityLow: 2.5,
  mortalityHigh: 7.0,
  mortalityNational: 4.7,
  adultCandidates2024: 143_982,
  kidneyTransplants2024: 27_660,
  wait5yrSharePct: 10.7,
  nonusePct2024: 29.3,
  kas250Date: "2021-03-15",
  confidence: "estimated" as Confidence,
};

export const VIZ_MARKERS = [
  "Median wait 61→58 months after KAS250",
  "LWT vs SWT wait gap still ~20 months",
  "DSA transplant-rate MIRR 1.35→1.17",
  "Pretransplant mortality 2.5–7.0 by DSA",
  "Wait vs DDKT-rate scatter by DSA",
  "National path of wait and nonuse",
] as const;

/** National path around KAS250 and SRTR ADR snapshots. */
export type NationalPathRow = {
  label: string;
  year: number;
  era: "pre-kas250" | "transition" | "post-kas250";
  medianWaitMonths: number | null;
  ddkTRatePer100Py: number | null;
  nonusePct: number | null;
  adultCandidates: number | null;
  confidence: Confidence;
  note?: string;
};

export const NATIONAL_PATH: NationalPathRow[] = [
  {
    label: "2018",
    year: 2018,
    era: "pre-kas250",
    medianWaitMonths: 60,
    ddkTRatePer100Py: 18.5,
    nonusePct: 20.1,
    adultCandidates: 140_000,
    confidence: "estimated",
    note: "DSA-first allocation still in force",
  },
  {
    label: "2019",
    year: 2019,
    era: "pre-kas250",
    medianWaitMonths: 61,
    ddkTRatePer100Py: 19.2,
    nonusePct: 21.0,
    adultCandidates: 144_058,
    confidence: "estimated",
    note: "Pre-KAS250 study window median ≈61 mo",
  },
  {
    label: "2020",
    year: 2020,
    era: "transition",
    medianWaitMonths: 62,
    ddkTRatePer100Py: 16.8,
    nonusePct: 21.5,
    adultCandidates: 138_000,
    confidence: "estimated",
    note: "COVID disruption to listing and transplant",
  },
  {
    label: "2021",
    year: 2021,
    era: "post-kas250",
    medianWaitMonths: 59,
    ddkTRatePer100Py: 20.5,
    nonusePct: 24.8,
    adultCandidates: 139_500,
    confidence: "estimated",
    note: "KAS250 live March 15; early circles era",
  },
  {
    label: "2022",
    year: 2022,
    era: "post-kas250",
    medianWaitMonths: 58,
    ddkTRatePer100Py: 21.8,
    nonusePct: 26.5,
    adultCandidates: 140_800,
    confidence: "estimated",
    note: "Post-window national median ≈58 mo",
  },
  {
    label: "2023",
    year: 2023,
    era: "post-kas250",
    medianWaitMonths: 57,
    ddkTRatePer100Py: 22.5,
    nonusePct: 27.8,
    adultCandidates: 141_865,
    confidence: "estimated",
    note: "eGFR waiting-time credit policy (Jan 2023)",
  },
  {
    label: "2024",
    year: 2024,
    era: "post-kas250",
    medianWaitMonths: 56,
    ddkTRatePer100Py: 22.8,
    nonusePct: 29.3,
    adultCandidates: 143_982,
    confidence: "estimated",
    note: "SRTR ADR 2024; nonuse 29.3%; mortality 4.7",
  },
];

/** Center-tier wait gap pre/post KAS250 (disclosed from Transplantation Proceedings). */
export type CenterTierRow = {
  tier: "Short-wait centers" | "Long-wait centers" | "National median";
  waitPre: number;
  waitPost: number;
  confidence: Confidence;
};

export const CENTER_TIERS: CenterTierRow[] = [
  {
    tier: "Short-wait centers",
    waitPre: 50,
    waitPost: 49,
    confidence: "disclosed",
  },
  {
    tier: "National median",
    waitPre: 61,
    waitPost: 58,
    confidence: "disclosed",
  },
  {
    tier: "Long-wait centers",
    waitPre: 74,
    waitPost: 69,
    confidence: "disclosed",
  },
];

/** DSA transplant-rate disparity compression (MIRR). */
export type MirrRow = {
  era: string;
  dsaMirr: number;
  centerMirr: number;
  centerSharePct: number;
  confidence: Confidence;
};

export const MIRR_PATH: MirrRow[] = [
  {
    era: "Pre-KAS250 (DSA/Region)",
    dsaMirr: 1.35,
    centerMirr: 1.89,
    centerSharePct: 81.7,
    confidence: "disclosed",
  },
  {
    era: "Post-KAS250 (circles)",
    dsaMirr: 1.17,
    centerMirr: 1.82,
    centerSharePct: 93.4,
    confidence: "disclosed",
  },
];

export type CensusDivision =
  | "Northeast"
  | "Midwest"
  | "South"
  | "West";

/**
 * Sample DSA composites for interactive panels.
 * Wait months ≈ median months from listing/dialysis accrual to DDKT;
 * ddkTRate ≈ transplants per 100 patient-years on the adult waitlist.
 * Codes are real OPO/DSA-style labels; metrics are estimated.
 */
export type DsaRow = {
  code: string;
  name: string;
  division: CensusDivision;
  waitMonthsPost: number;
  waitMonthsPre: number;
  ddkTRate: number;
  mortalityPer100Py: number;
  candidates: number;
  confidence: Confidence;
};

export const DSA_SAMPLE: DsaRow[] = [
  {
    code: "CADN",
    name: "Northern California",
    division: "West",
    waitMonthsPost: 72,
    waitMonthsPre: 84,
    ddkTRate: 14.2,
    mortalityPer100Py: 5.8,
    candidates: 6200,
    confidence: "estimated",
  },
  {
    code: "CASD",
    name: "Southern California",
    division: "West",
    waitMonthsPost: 68,
    waitMonthsPre: 78,
    ddkTRate: 15.5,
    mortalityPer100Py: 5.4,
    candidates: 7100,
    confidence: "estimated",
  },
  {
    code: "NYRT",
    name: "New York Metro",
    division: "Northeast",
    waitMonthsPost: 70,
    waitMonthsPre: 80,
    ddkTRate: 15.0,
    mortalityPer100Py: 5.6,
    candidates: 5800,
    confidence: "estimated",
  },
  {
    code: "PADV",
    name: "Eastern Pennsylvania",
    division: "Northeast",
    waitMonthsPost: 62,
    waitMonthsPre: 70,
    ddkTRate: 18.4,
    mortalityPer100Py: 5.0,
    candidates: 3200,
    confidence: "estimated",
  },
  {
    code: "MAOB",
    name: "New England",
    division: "Northeast",
    waitMonthsPost: 55,
    waitMonthsPre: 63,
    ddkTRate: 21.0,
    mortalityPer100Py: 4.4,
    candidates: 2900,
    confidence: "estimated",
  },
  {
    code: "ILIP",
    name: "Illinois",
    division: "Midwest",
    waitMonthsPost: 58,
    waitMonthsPre: 66,
    ddkTRate: 19.8,
    mortalityPer100Py: 4.8,
    candidates: 4100,
    confidence: "estimated",
  },
  {
    code: "MIOP",
    name: "Michigan",
    division: "Midwest",
    waitMonthsPost: 52,
    waitMonthsPre: 58,
    ddkTRate: 23.5,
    mortalityPer100Py: 4.2,
    candidates: 2700,
    confidence: "estimated",
  },
  {
    code: "MNOP",
    name: "Upper Midwest",
    division: "Midwest",
    waitMonthsPost: 44,
    waitMonthsPre: 48,
    ddkTRate: 28.0,
    mortalityPer100Py: 3.4,
    candidates: 2100,
    confidence: "estimated",
  },
  {
    code: "OHLB",
    name: "Ohio",
    division: "Midwest",
    waitMonthsPost: 48,
    waitMonthsPre: 54,
    ddkTRate: 25.2,
    mortalityPer100Py: 3.8,
    candidates: 2500,
    confidence: "estimated",
  },
  {
    code: "TXSB",
    name: "South Texas",
    division: "South",
    waitMonthsPost: 54,
    waitMonthsPre: 60,
    ddkTRate: 22.0,
    mortalityPer100Py: 4.6,
    candidates: 3400,
    confidence: "estimated",
  },
  {
    code: "TXGC",
    name: "Gulf Coast Texas",
    division: "South",
    waitMonthsPost: 50,
    waitMonthsPre: 56,
    ddkTRate: 24.0,
    mortalityPer100Py: 4.3,
    candidates: 3600,
    confidence: "estimated",
  },
  {
    code: "FLFH",
    name: "Florida",
    division: "South",
    waitMonthsPost: 46,
    waitMonthsPre: 52,
    ddkTRate: 26.5,
    mortalityPer100Py: 3.9,
    candidates: 4800,
    confidence: "estimated",
  },
  {
    code: "GALL",
    name: "Georgia",
    division: "South",
    waitMonthsPost: 49,
    waitMonthsPre: 55,
    ddkTRate: 24.8,
    mortalityPer100Py: 4.1,
    candidates: 3100,
    confidence: "estimated",
  },
  {
    code: "NCNC",
    name: "Carolinas",
    division: "South",
    waitMonthsPost: 47,
    waitMonthsPre: 53,
    ddkTRate: 25.8,
    mortalityPer100Py: 3.7,
    candidates: 2800,
    confidence: "estimated",
  },
  {
    code: "WALC",
    name: "Pacific Northwest",
    division: "West",
    waitMonthsPost: 51,
    waitMonthsPre: 57,
    ddkTRate: 23.0,
    mortalityPer100Py: 4.0,
    candidates: 2200,
    confidence: "estimated",
  },
  {
    code: "AZOB",
    name: "Arizona",
    division: "West",
    waitMonthsPost: 45,
    waitMonthsPre: 50,
    ddkTRate: 27.2,
    mortalityPer100Py: 3.5,
    candidates: 1900,
    confidence: "estimated",
  },
  {
    code: "COOB",
    name: "Rocky Mountain",
    division: "West",
    waitMonthsPost: 42,
    waitMonthsPre: 46,
    ddkTRate: 29.5,
    mortalityPer100Py: 3.1,
    candidates: 1600,
    confidence: "estimated",
  },
  {
    code: "LAOP",
    name: "Louisiana",
    division: "South",
    waitMonthsPost: 43,
    waitMonthsPre: 47,
    ddkTRate: 28.8,
    mortalityPer100Py: 3.2,
    candidates: 1700,
    confidence: "estimated",
  },
  {
    code: "INOP",
    name: "Indiana",
    division: "Midwest",
    waitMonthsPost: 41,
    waitMonthsPre: 45,
    ddkTRate: 30.2,
    mortalityPer100Py: 2.9,
    candidates: 1500,
    confidence: "estimated",
  },
  {
    code: "IAOP",
    name: "Iowa",
    division: "Midwest",
    waitMonthsPost: 38,
    waitMonthsPre: 42,
    ddkTRate: 32.0,
    mortalityPer100Py: 2.6,
    candidates: 1100,
    confidence: "estimated",
  },
];

export type DivisionAgg = {
  division: CensusDivision;
  medianWait: number;
  meanDdkTRate: number;
  meanMortality: number;
  dsaCount: number;
};

export function aggregateByDivision(rows: DsaRow[] = DSA_SAMPLE): DivisionAgg[] {
  const groups = new Map<CensusDivision, DsaRow[]>();
  for (const r of rows) {
    const list = groups.get(r.division) ?? [];
    list.push(r);
    groups.set(r.division, list);
  }
  const out: DivisionAgg[] = [];
  for (const [division, list] of groups) {
    const waits = [...list.map((d) => d.waitMonthsPost)].sort((a, b) => a - b);
    const mid = Math.floor(waits.length / 2);
    const medianWait =
      waits.length % 2 === 0
        ? (waits[mid - 1]! + waits[mid]!) / 2
        : waits[mid]!;
    out.push({
      division,
      medianWait: Math.round(medianWait * 10) / 10,
      meanDdkTRate:
        Math.round(
          (list.reduce((s, d) => s + d.ddkTRate, 0) / list.length) * 10,
        ) / 10,
      meanMortality:
        Math.round(
          (list.reduce((s, d) => s + d.mortalityPer100Py, 0) / list.length) * 10,
        ) / 10,
      dsaCount: list.length,
    });
  }
  return out.sort((a, b) => b.medianWait - a.medianWait);
}

export const DIVISION_AGG = aggregateByDivision();

/** Gap metrics on the DSA sample (post-KAS250 estimated waits). */
export const DSA_GAP = (() => {
  const waits = DSA_SAMPLE.map((d) => d.waitMonthsPost).sort((a, b) => a - b);
  const rates = DSA_SAMPLE.map((d) => d.ddkTRate).sort((a, b) => a - b);
  const p = (arr: number[], q: number) => {
    const i = (arr.length - 1) * q;
    const lo = Math.floor(i);
    const hi = Math.ceil(i);
    if (lo === hi) return arr[lo]!;
    return arr[lo]! * (hi - i) + arr[hi]! * (i - lo);
  };
  const minW = waits[0]!;
  const maxW = waits[waits.length - 1]!;
  return {
    waitMin: minW,
    waitMax: maxW,
    waitSpread: maxW - minW,
    waitIqr: Math.round((p(waits, 0.75) - p(waits, 0.25)) * 10) / 10,
    waitP10: Math.round(p(waits, 0.1) * 10) / 10,
    waitP90: Math.round(p(waits, 0.9) * 10) / 10,
    rateMin: rates[0]!,
    rateMax: rates[rates.length - 1]!,
    rateSpread: Math.round((rates[rates.length - 1]! - rates[0]!) * 10) / 10,
    sampleN: DSA_SAMPLE.length,
  };
})();

export type DetailTableRow = {
  code: string;
  name: string;
  division: CensusDivision;
  waitPost: number;
  waitPre: number;
  waitDrop: number;
  ddkTRate: number;
  mortality: number;
};

export const DETAIL_TABLE: DetailTableRow[] = [...DSA_SAMPLE]
  .sort((a, b) => b.waitMonthsPost - a.waitMonthsPost)
  .map((d) => ({
    code: d.code,
    name: d.name,
    division: d.division,
    waitPost: d.waitMonthsPost,
    waitPre: d.waitMonthsPre,
    waitDrop: d.waitMonthsPre - d.waitMonthsPost,
    ddkTRate: d.ddkTRate,
    mortality: d.mortalityPer100Py,
  }));

export type DivisionFilter = "all" | CensusDivision;
export type SortKey = "wait" | "rate" | "mortality" | "drop";

export const DIVISION_OPTIONS: { id: DivisionFilter; label: string }[] = [
  { id: "all", label: "All divisions" },
  { id: "Northeast", label: "Northeast" },
  { id: "Midwest", label: "Midwest" },
  { id: "South", label: "South" },
  { id: "West", label: "West" },
];

export function filterDsas(
  division: DivisionFilter,
  sort: SortKey = "wait",
): DsaRow[] {
  let rows =
    division === "all"
      ? [...DSA_SAMPLE]
      : DSA_SAMPLE.filter((d) => d.division === division);
  rows.sort((a, b) => {
    if (sort === "rate") return b.ddkTRate - a.ddkTRate;
    if (sort === "mortality") return b.mortalityPer100Py - a.mortalityPer100Py;
    if (sort === "drop")
      return (
        b.waitMonthsPre -
        b.waitMonthsPost -
        (a.waitMonthsPre - a.waitMonthsPost)
      );
    return b.waitMonthsPost - a.waitMonthsPost;
  });
  return rows;
}

export const ANALYTICS = {
  remainingCenterGapMonths: HEADLINE.remainingCenterGapMonths,
  dsaWaitSpreadSample: DSA_GAP.waitSpread,
  dsaWaitIqrSample: DSA_GAP.waitIqr,
  mirrCompression:
    Math.round((1 - HEADLINE.dsaMirrPost / HEADLINE.dsaMirrPre) * 1000) / 10,
};
