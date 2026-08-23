/**
 * US ATC / NAS delay minutes by cause — FAA OPSNET (NAP 2025 App. D tables)
 * plus BTS On-Time cause shares for passenger-facing context.
 *
 * OPSNET reportable delay: IFR traffic delayed ≥15 minutes by ATC system initiatives.
 * Staffing is a secondary cause under "Other" beginning mid-2022.
 */

export const HEADLINE = {
  /** 2024 OPSNET total delay minutes */
  totalMinutes2024: 16_065_315,
  /** Weather share of 2024 delay minutes */
  weatherSharePct2024: 61.4,
  /** Equipment + Other (incl. staffing) share of 2024 minutes */
  equipPlusOtherSharePct2024: 10.2,
  /** Staffing minutes 2024 (OPSNET secondary cause) */
  staffingMinutes2024: 622_669,
  /** Staffing share of total 2024 minutes */
  staffingSharePct2024: 3.9,
  /** Share of 2024 staffing minutes in top-7 facilities */
  staffingTop7SharePct: 86,
  /** Core-30 + TRACON/Center share of 2022–24 total delay minutes */
  core30MinutesSharePct: 92.1,
  /** 19 understaffed facilities' share of 2022–24 Other delay minutes */
  understaffedOtherSharePct: 44.6,
  delays2024: 359_694,
} as const;

export const SOURCES = [
  "FAA OPSNET — Delays by cause (weather, volume, equipment, runway, other); System Impact attribution",
  "National Academies (2025) — The Air Traffic Controller Workforce Imperative, Appendix D Tables D-1–D-5 (OPSNET extracts)",
  "BTS Airline On-Time Performance — Cause of Delay (carrier, late aircraft, NAS, extreme weather, security)",
  "FAA Order 7210.55 — OPSNET reportable delay definition (≥15 min IFR ATC detention)",
] as const;

export const SOURCE_NOTE =
  "OPSNET minutes measure ATC system-impact delay (≥15 min IFR), not gate-to-gate passenger delay. BTS On-Time causes use a different taxonomy: most convective weather sits inside NAS, while BTS 'Extreme Weather' is a narrow residual. Staffing is coded only as a secondary cause under Other from mid-2022 onward.";

export type CauseId =
  | "weather"
  | "volume"
  | "runway"
  | "other"
  | "equipment";

export const CAUSE_META: Record<
  CauseId,
  { label: string; short: string; color: string; group: "weather" | "demand" | "infra" | "staffing-bucket" }
> = {
  weather: {
    label: "Weather",
    short: "WX",
    color: "#38bdf8",
    group: "weather",
  },
  volume: {
    label: "Volume",
    short: "VOL",
    color: "#a78bfa",
    group: "demand",
  },
  runway: {
    label: "Runway / taxiway",
    short: "RWY",
    color: "#fbbf24",
    group: "infra",
  },
  other: {
    label: "Other (incl. staffing)",
    short: "OTH",
    color: "#f97316",
    group: "staffing-bucket",
  },
  equipment: {
    label: "Equipment",
    short: "EQ",
    color: "#fb7185",
    group: "infra",
  },
};

export type AnnualCauseRow = {
  year: number;
  totalDelays: number;
  totalMinutes: number;
  weatherDelays: number;
  weatherMinutes: number;
  volumeDelays: number;
  volumeMinutes: number;
  equipmentDelays: number;
  equipmentMinutes: number;
  runwayDelays: number;
  runwayMinutes: number;
  otherDelays: number;
  otherMinutes: number;
};

/** Table D-1 — OPSNET delays by primary cause, calendar years */
export const ANNUAL_BY_CAUSE: AnnualCauseRow[] = [
  {
    year: 2015,
    totalDelays: 325_381,
    totalMinutes: 14_445_740,
    weatherDelays: 206_687,
    weatherMinutes: 10_968_179,
    volumeDelays: 76_547,
    volumeMinutes: 2_019_472,
    equipmentDelays: 1_433,
    equipmentMinutes: 50_575,
    runwayDelays: 22_486,
    runwayMinutes: 857_877,
    otherDelays: 18_228,
    otherMinutes: 549_637,
  },
  {
    year: 2016,
    totalDelays: 345_466,
    totalMinutes: 15_797_028,
    weatherDelays: 228_708,
    weatherMinutes: 12_339_604,
    volumeDelays: 80_767,
    volumeMinutes: 2_159_161,
    equipmentDelays: 1_490,
    equipmentMinutes: 70_521,
    runwayDelays: 19_231,
    runwayMinutes: 792_644,
    otherDelays: 15_270,
    otherMinutes: 435_098,
  },
  {
    year: 2017,
    totalDelays: 444_928,
    totalMinutes: 21_664_341,
    weatherDelays: 265_172,
    weatherMinutes: 15_284_684,
    volumeDelays: 105_460,
    volumeMinutes: 2_907_923,
    equipmentDelays: 1_207,
    equipmentMinutes: 56_944,
    runwayDelays: 43_472,
    runwayMinutes: 2_362_417,
    otherDelays: 29_617,
    otherMinutes: 1_052_373,
  },
  {
    year: 2018,
    totalDelays: 443_533,
    totalMinutes: 20_711_912,
    weatherDelays: 298_811,
    weatherMinutes: 16_716_169,
    volumeDelays: 94_541,
    volumeMinutes: 2_414_380,
    equipmentDelays: 1_359,
    equipmentMinutes: 53_454,
    runwayDelays: 29_344,
    runwayMinutes: 982_349,
    otherDelays: 19_478,
    otherMinutes: 545_560,
  },
  {
    year: 2019,
    totalDelays: 456_011,
    totalMinutes: 22_468_039,
    weatherDelays: 311_403,
    weatherMinutes: 18_124_547,
    volumeDelays: 95_032,
    volumeMinutes: 2_386_611,
    equipmentDelays: 2_942,
    equipmentMinutes: 139_689,
    runwayDelays: 29_287,
    runwayMinutes: 1_290_992,
    otherDelays: 17_347,
    otherMinutes: 526_200,
  },
  {
    year: 2020,
    totalDelays: 92_387,
    totalMinutes: 3_670_767,
    weatherDelays: 51_587,
    weatherMinutes: 2_388_021,
    volumeDelays: 28_011,
    volumeMinutes: 851_238,
    equipmentDelays: 727,
    equipmentMinutes: 29_665,
    runwayDelays: 5_795,
    runwayMinutes: 133_083,
    otherDelays: 6_267,
    otherMinutes: 268_760,
  },
  {
    year: 2021,
    totalDelays: 196_386,
    totalMinutes: 8_021_469,
    weatherDelays: 109_334,
    weatherMinutes: 5_042_661,
    volumeDelays: 55_386,
    volumeMinutes: 1_754_918,
    equipmentDelays: 338,
    equipmentMinutes: 10_196,
    runwayDelays: 18_402,
    runwayMinutes: 692_261,
    otherDelays: 12_926,
    otherMinutes: 521_433,
  },
  {
    year: 2022,
    totalDelays: 266_883,
    totalMinutes: 11_564_449,
    weatherDelays: 153_794,
    weatherMinutes: 7_599_414,
    volumeDelays: 73_263,
    volumeMinutes: 2_308_815,
    equipmentDelays: 1_515,
    equipmentMinutes: 72_616,
    runwayDelays: 14_349,
    runwayMinutes: 491_480,
    otherDelays: 23_962,
    otherMinutes: 1_092_124,
  },
  {
    year: 2023,
    totalDelays: 296_844,
    totalMinutes: 12_601_253,
    weatherDelays: 179_958,
    weatherMinutes: 8_728_894,
    volumeDelays: 79_382,
    volumeMinutes: 2_473_710,
    equipmentDelays: 4_025,
    equipmentMinutes: 237_520,
    runwayDelays: 25_713,
    runwayMinutes: 867_840,
    otherDelays: 7_766,
    otherMinutes: 293_289,
  },
  {
    year: 2024,
    totalDelays: 359_694,
    totalMinutes: 16_065_315,
    weatherDelays: 193_056,
    weatherMinutes: 9_861_692,
    volumeDelays: 98_323,
    volumeMinutes: 2_924_101,
    equipmentDelays: 5_820,
    equipmentMinutes: 318_122,
    runwayDelays: 38_321,
    runwayMinutes: 1_647_930,
    otherDelays: 24_174,
    otherMinutes: 1_313_470,
  },
];

export function causeMinutesForYear(year: number): { id: CauseId; minutes: number; sharePct: number }[] {
  const row = ANNUAL_BY_CAUSE.find((r) => r.year === year);
  if (!row) return [];
  const parts: { id: CauseId; minutes: number }[] = [
    { id: "weather", minutes: row.weatherMinutes },
    { id: "volume", minutes: row.volumeMinutes },
    { id: "runway", minutes: row.runwayMinutes },
    { id: "other", minutes: row.otherMinutes },
    { id: "equipment", minutes: row.equipmentMinutes },
  ];
  return parts.map((p) => ({
    ...p,
    sharePct: Math.round((p.minutes / row.totalMinutes) * 1000) / 10,
  }));
}

export function stackedShareSeries() {
  return ANNUAL_BY_CAUSE.map((r) => {
    const t = r.totalMinutes;
    return {
      year: r.year,
      weather: Math.round((r.weatherMinutes / t) * 1000) / 10,
      volume: Math.round((r.volumeMinutes / t) * 1000) / 10,
      runway: Math.round((r.runwayMinutes / t) * 1000) / 10,
      other: Math.round((r.otherMinutes / t) * 1000) / 10,
      equipment: Math.round((r.equipmentMinutes / t) * 1000) / 10,
      totalMinutes: r.totalMinutes,
    };
  });
}

/** Staffing secondary cause within Other (Table D-4) */
export const STAFFING_VS_OTHER = [
  {
    period: "2022",
    otherMinutes: 1_092_124,
    staffingMinutes: 22_350,
    staffingOfOtherPct: 2.0,
    avgStaffingMin: 23,
  },
  {
    period: "2023",
    otherMinutes: 293_289,
    staffingMinutes: 90_412,
    staffingOfOtherPct: 30.8,
    avgStaffingMin: 34,
  },
  {
    period: "2024",
    otherMinutes: 1_313_470,
    staffingMinutes: 622_669,
    staffingOfOtherPct: 47.4,
    avgStaffingMin: 49,
  },
] as const;

/** Table D-5 — 2024 staffing delay minutes concentration */
export const STAFFING_FACILITIES_2024 = [
  { id: "EWR", name: "Newark Liberty", type: "Tower/TRACON", minutes: 226_370, fillRatePct: 87 },
  { id: "PHL", name: "Philadelphia", type: "Tower/TRACON", minutes: 183_934, fillRatePct: 130 },
  { id: "ZNY", name: "New York Center", type: "ARTCC", minutes: 37_953, fillRatePct: 77 },
  { id: "N90", name: "New York TRACON", type: "TRACON", minutes: 36_744, fillRatePct: 74 },
  { id: "AUS", name: "Austin", type: "Tower", minutes: 18_096, fillRatePct: 80 },
  { id: "ZJX", name: "Jacksonville Center", type: "ARTCC", minutes: 16_860, fillRatePct: 78 },
  { id: "SFO", name: "San Francisco", type: "Tower/TRACON", minutes: 16_035, fillRatePct: 92 },
] as const;

export const STAFFING_REST_MINUTES_2024 =
  HEADLINE.staffingMinutes2024 -
  STAFFING_FACILITIES_2024.reduce((s, f) => s + f.minutes, 0);

/** Lorenz-style cumulative share of staffing minutes (top facilities + rest) */
export function staffingConcentrationCurve() {
  const ranked = [...STAFFING_FACILITIES_2024].sort((a, b) => b.minutes - a.minutes);
  const total = HEADLINE.staffingMinutes2024;
  let cum = 0;
  const points = [{ facilities: 0, sharePct: 0 }];
  ranked.forEach((f, i) => {
    cum += f.minutes;
    points.push({
      facilities: i + 1,
      sharePct: Math.round((cum / total) * 1000) / 10,
    });
  });
  points.push({ facilities: ranked.length + 1, sharePct: 100 });
  return points;
}

/** Facility-type concentration, Jan 2022–Dec 2024 (Table D-3) */
export const FACILITY_BUCKETS_2022_24 = [
  {
    id: "all",
    label: "All facilities",
    totalMinutes: 40_231_017,
    otherMinutes: 2_698_883,
    opsShareHint: 100,
  },
  {
    id: "core30",
    label: "Core 30 + TRACONs + Centers",
    totalMinutes: 37_056_689,
    otherMinutes: 2_505_239,
    opsShareHint: 92,
  },
  {
    id: "understaffed19",
    label: "19 facilities ≤85% staffing target",
    totalMinutes: 15_753_042,
    otherMinutes: 1_202_656,
    opsShareHint: 22,
  },
] as const;

/**
 * BTS OTP delay-minute cause mix (calendar 2024, domestic reporting carriers).
 * Shares approximate published BTS Cause of Delay aggregates; NAS absorbs most
 * convective weather that OPSNET codes as Weather.
 */
export const BTS_CAUSE_MINUTES_2024 = [
  { id: "late-aircraft", label: "Late arriving aircraft", minutesSharePct: 41.2, color: "#64748b" },
  { id: "nas", label: "National Aviation System", minutesSharePct: 27.8, color: "#0ea5e9" },
  { id: "carrier", label: "Air carrier", minutesSharePct: 24.6, color: "#8b5cf6" },
  { id: "extreme-wx", label: "Extreme weather", minutesSharePct: 5.1, color: "#38bdf8" },
  { id: "security", label: "Security", minutesSharePct: 1.3, color: "#94a3b8" },
] as const;

/** Dual-lens comparison: OPSNET primary vs BTS passenger taxonomy (2024) */
export const DUAL_LENS_2024 = [
  {
    lens: "OPSNET",
    weatherOrExtreme: HEADLINE.weatherSharePct2024,
    volumeOrNas: 18.2,
    runwayEquip: 12.3,
    otherOrCarrierLate: 8.2,
  },
  {
    lens: "BTS OTP",
    weatherOrExtreme: 5.1,
    volumeOrNas: 27.8,
    runwayEquip: 0,
    otherOrCarrierLate: 65.8,
  },
] as const;

export function fmtMinutes(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}k`;
  return String(n);
}

export function fmtPct(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`;
}

export function nonWeatherShare(year: number): number {
  const row = ANNUAL_BY_CAUSE.find((r) => r.year === year);
  if (!row) return 0;
  return Math.round(((1 - row.weatherMinutes / row.totalMinutes) * 1000)) / 10;
}

export function equipmentPlusOtherShare(year: number): number {
  const row = ANNUAL_BY_CAUSE.find((r) => r.year === year);
  if (!row) return 0;
  return (
    Math.round(((row.equipmentMinutes + row.otherMinutes) / row.totalMinutes) * 1000) / 10
  );
}
