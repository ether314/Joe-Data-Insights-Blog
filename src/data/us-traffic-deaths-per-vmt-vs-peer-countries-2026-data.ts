/**
 * US traffic deaths per VMT vs peer high-income countries.
 *
 * US series: NHTSA FARS / Traffic Safety Facts (deaths per 100M VMT).
 * Peer distance risk: OECD/ITF IRTAD (deaths per billion vehicle-km),
 * converted via 1 mi = 1.609344 km.
 * CDC MMWR 2022 supplies a 2019 multi-country ladder.
 */

export const KM_PER_MILE = 1.609344;
export const BILLION_VKM_PER_100M_VMT = 100 / (KM_PER_MILE * 10); // ≈ 6.2137

export function perBillionVkmToPer100mVmt(rate: number): number {
  return rate / BILLION_VKM_PER_100M_VMT;
}

export function per100mVmtToPerBillionVkm(rate: number): number {
  return rate * BILLION_VKM_PER_100M_VMT;
}

export const HEADLINE = {
  usRate2024: 1.19,
  usPeak2021: 1.38,
  usRate2019: 1.11,
  usIrtad2021PerBvkm: 8.5,
  norwayIrtad2021PerBvkm: 1.8,
  usVsNorwayMultiple2021: 4.7,
  us2024Vs2019Pct: 7.2,
  spikeUnwindSharePct: 70,
  peerAvg2019Per100mVmt: 0.92,
} as const;

export const SOURCES = [
  "NHTSA FARS / Traffic Safety Facts — fatalities & rate per 100M VMT (final + 2024 ARF)",
  "FHWA Highway Statistics — national VMT denominator",
  "OECD/ITF IRTAD Road Safety Annual Report 2022 — Table 4 fatality risk 2019–21 (per billion vkm)",
  "OECD/ITF IRTAD Road Safety Annual Report 2023 — 2021 distance-risk highlights (US 8.5, Norway 1.8, Korea 8.2, Czechia 9.9)",
  "CDC MMWR 71(26), 2022 — MVC deaths, US vs 28 high-income countries (2015 & 2019 distance rates)",
] as const;

export const SOURCE_NOTE =
  "Distance risk is the cleanest cross-country exposure metric, but VMT/vkm coverage is thinner than population rates. IRTAD and NHTSA use aligned 30-day fatality definitions for the US; peer VMT methodologies differ slightly. Conversions use the exact mile–kilometre factor; rounded chart labels may differ by ±0.01.";

export type PeerId =
  | "norway"
  | "iceland"
  | "sweden"
  | "denmark"
  | "germany"
  | "finland"
  | "canada"
  | "australia"
  | "france"
  | "slovenia"
  | "korea"
  | "united-states"
  | "czechia";

export type PeerRegion = "nordic" | "europe" | "anglo" | "asia" | "us";

export const PEER_META: Record<
  PeerId,
  { label: string; short: string; color: string; region: PeerRegion }
> = {
  norway: { label: "Norway", short: "NO", color: "#34d399", region: "nordic" },
  iceland: { label: "Iceland", short: "IS", color: "#6ee7b7", region: "nordic" },
  sweden: { label: "Sweden", short: "SE", color: "#2dd4bf", region: "nordic" },
  denmark: { label: "Denmark", short: "DK", color: "#67e8f9", region: "nordic" },
  germany: { label: "Germany", short: "DE", color: "#94a3b8", region: "europe" },
  finland: { label: "Finland", short: "FI", color: "#a5b4fc", region: "europe" },
  canada: { label: "Canada", short: "CA", color: "#fbbf24", region: "anglo" },
  australia: { label: "Australia", short: "AU", color: "#f59e0b", region: "anglo" },
  france: { label: "France", short: "FR", color: "#c084fc", region: "europe" },
  slovenia: { label: "Slovenia", short: "SI", color: "#e879f9", region: "europe" },
  korea: { label: "Korea", short: "KR", color: "#fb7185", region: "asia" },
  "united-states": {
    label: "United States",
    short: "US",
    color: "#f97316",
    region: "us",
  },
  czechia: { label: "Czechia", short: "CZ", color: "#ef4444", region: "europe" },
};

export type IrtadRiskRow = {
  id: PeerId;
  y2019: number | null;
  y2020: number | null;
  y2021: number | null;
};

/** IRTAD deaths per billion vkm — Table 4 (2022) + 2023 highlight adds */
export const IRTAD_PER_BILLION_VKM: IrtadRiskRow[] = [
  { id: "norway", y2019: 2.3, y2020: 2.1, y2021: 1.8 },
  { id: "iceland", y2019: 1.5, y2020: 2.1, y2021: 2.3 },
  { id: "sweden", y2019: 2.6, y2020: 2.6, y2021: 2.5 },
  { id: "denmark", y2019: null, y2020: null, y2021: 2.4 },
  { id: "germany", y2019: 4.0, y2020: 4.0, y2021: 3.7 },
  { id: "finland", y2019: 4.2, y2020: 4.6, y2021: 4.6 },
  { id: "canada", y2019: 4.3, y2020: 4.7, y2021: 4.4 },
  { id: "australia", y2019: 4.6, y2020: 4.4, y2021: 4.5 },
  { id: "france", y2019: 5.3, y2020: 4.8, y2021: 5.2 },
  { id: "slovenia", y2019: 4.5, y2020: 4.5, y2021: 5.9 },
  { id: "korea", y2019: null, y2020: null, y2021: 8.2 },
  { id: "united-states", y2019: null, y2020: null, y2021: 8.5 },
  { id: "czechia", y2019: 10.7, y2020: 9.9, y2021: 9.9 },
];

export type UsVmtRateRow = {
  year: number;
  fatalities: number;
  vmtBillions: number;
  ratePer100mVmt: number;
};

export const US_VMT_SERIES: UsVmtRateRow[] = [
  { year: 2010, fatalities: 32999, vmtBillions: 2967, ratePer100mVmt: 1.11 },
  { year: 2011, fatalities: 32479, vmtBillions: 2950, ratePer100mVmt: 1.1 },
  { year: 2012, fatalities: 33782, vmtBillions: 2969, ratePer100mVmt: 1.14 },
  { year: 2013, fatalities: 32893, vmtBillions: 2988, ratePer100mVmt: 1.1 },
  { year: 2014, fatalities: 32744, vmtBillions: 3026, ratePer100mVmt: 1.08 },
  { year: 2015, fatalities: 35484, vmtBillions: 3095, ratePer100mVmt: 1.15 },
  { year: 2016, fatalities: 37806, vmtBillions: 3174, ratePer100mVmt: 1.19 },
  { year: 2017, fatalities: 37473, vmtBillions: 3210, ratePer100mVmt: 1.17 },
  { year: 2018, fatalities: 36835, vmtBillions: 3240, ratePer100mVmt: 1.14 },
  { year: 2019, fatalities: 36355, vmtBillions: 3262, ratePer100mVmt: 1.11 },
  { year: 2020, fatalities: 39007, vmtBillions: 2904, ratePer100mVmt: 1.34 },
  { year: 2021, fatalities: 43230, vmtBillions: 3132, ratePer100mVmt: 1.38 },
  { year: 2022, fatalities: 42721, vmtBillions: 3196, ratePer100mVmt: 1.34 },
  { year: 2023, fatalities: 41025, vmtBillions: 3247, ratePer100mVmt: 1.26 },
  { year: 2024, fatalities: 39254, vmtBillions: 3294, ratePer100mVmt: 1.19 },
];

export type Mmwr2019Row = {
  id: string;
  label: string;
  ratePer100mVmt: number;
  highlight?: boolean;
};

export const MMWR_2019_LADDER: Mmwr2019Row[] = [
  { id: "norway", label: "Norway", ratePer100mVmt: 0.38 },
  { id: "sweden", label: "Sweden", ratePer100mVmt: 0.42 },
  { id: "switzerland", label: "Switzerland", ratePer100mVmt: 0.43 },
  { id: "uk", label: "United Kingdom", ratePer100mVmt: 0.45 },
  { id: "spain", label: "Spain", ratePer100mVmt: 0.48 },
  { id: "ireland", label: "Ireland", ratePer100mVmt: 0.48 },
  { id: "denmark", label: "Denmark", ratePer100mVmt: 0.58 },
  { id: "germany", label: "Germany", ratePer100mVmt: 0.65 },
  { id: "finland", label: "Finland", ratePer100mVmt: 0.67 },
  { id: "netherlands", label: "Netherlands", ratePer100mVmt: 0.67 },
  { id: "canada", label: "Canada", ratePer100mVmt: 0.71 },
  { id: "australia", label: "Australia", ratePer100mVmt: 0.73 },
  { id: "austria", label: "Austria", ratePer100mVmt: 0.79 },
  { id: "japan", label: "Japan", ratePer100mVmt: 0.85 },
  { id: "france", label: "France", ratePer100mVmt: 0.85 },
  { id: "israel", label: "Israel", ratePer100mVmt: 0.9 },
  { id: "peer-avg", label: "Peer avg (ex-US)", ratePer100mVmt: 0.92, highlight: true },
  { id: "united-states", label: "United States", ratePer100mVmt: 1.11, highlight: true },
  { id: "new-zealand", label: "New Zealand", ratePer100mVmt: 1.16 },
  { id: "korea", label: "South Korea", ratePer100mVmt: 1.64 },
  { id: "czechia", label: "Czechia", ratePer100mVmt: 1.73 },
  { id: "poland", label: "Poland", ratePer100mVmt: 1.88 },
  { id: "hungary", label: "Hungary", ratePer100mVmt: 2.05 },
];

export type PopRateRow = {
  id: string;
  label: string;
  rate2022: number;
};

export const POP_RATES_2022: PopRateRow[] = [
  { id: "norway", label: "Norway", rate2022: 2.1 },
  { id: "sweden", label: "Sweden", rate2022: 2.2 },
  { id: "japan", label: "Japan", rate2022: 2.6 },
  { id: "denmark", label: "Denmark", rate2022: 2.6 },
  { id: "uk", label: "United Kingdom", rate2022: 2.6 },
  { id: "switzerland", label: "Switzerland", rate2022: 2.8 },
  { id: "germany", label: "Germany", rate2022: 3.4 },
  { id: "australia", label: "Australia", rate2022: 4.5 },
  { id: "france", label: "France", rate2022: 4.8 },
  { id: "canada", label: "Canada", rate2022: 5.0 },
  { id: "united-states", label: "United States", rate2022: 12.8 },
];

export type UnitMode = "per100mVmt" | "perBillionVkm";

export function irtadLadder2021(unit: UnitMode = "per100mVmt") {
  return IRTAD_PER_BILLION_VKM.filter((r) => r.y2021 != null)
    .map((r) => {
      const perBvkm = r.y2021 as number;
      const rate =
        unit === "perBillionVkm" ? perBvkm : perBillionVkmToPer100mVmt(perBvkm);
      return {
        id: r.id,
        label: PEER_META[r.id].label,
        short: PEER_META[r.id].short,
        color: PEER_META[r.id].color,
        region: PEER_META[r.id].region,
        rate: Math.round(rate * 100) / 100,
        perBvkm,
      };
    })
    .sort((a, b) => a.rate - b.rate);
}

export function irtadMultiYear(unit: UnitMode = "per100mVmt") {
  const years = [2019, 2020, 2021] as const;
  return years.map((year) => {
    const row: Record<string, string | number | null> = { year: String(year) };
    for (const c of IRTAD_PER_BILLION_VKM) {
      const key = year === 2019 ? "y2019" : year === 2020 ? "y2020" : "y2021";
      const raw = c[key];
      if (raw == null) {
        row[c.id] = null;
      } else {
        row[c.id] =
          unit === "perBillionVkm"
            ? raw
            : Math.round(perBillionVkmToPer100mVmt(raw) * 100) / 100;
      }
    }
    return row;
  });
}

export function usSeriesWithPeerBands() {
  const norway2021 = perBillionVkmToPer100mVmt(1.8);
  const germany2021 = perBillionVkmToPer100mVmt(3.7);
  return US_VMT_SERIES.map((r) => ({
    year: r.year,
    us: r.ratePer100mVmt,
    fatalities: r.fatalities,
    vmtBillions: r.vmtBillions,
    norwayBand: Math.round(norway2021 * 100) / 100,
    germanyBand: Math.round(germany2021 * 100) / 100,
    peerAvg2019: HEADLINE.peerAvg2019Per100mVmt,
  }));
}

export function spikePathRows() {
  const pts = [
    { label: "2019", year: 2019, rate: 1.11 },
    { label: "2020", year: 2020, rate: 1.34 },
    { label: "2021 peak", year: 2021, rate: 1.38 },
    { label: "2022", year: 2022, rate: 1.34 },
    { label: "2023", year: 2023, rate: 1.26 },
    { label: "2024", year: 2024, rate: 1.19 },
  ];
  return pts.map((p) => ({
    ...p,
    vs2019Pct: Math.round((p.rate / 1.11 - 1) * 1000) / 10,
    vsNorway2021:
      Math.round((p.rate / perBillionVkmToPer100mVmt(1.8)) * 10) / 10,
  }));
}

export function gapScatter2019() {
  return MMWR_2019_LADDER.filter((r) => r.id !== "peer-avg").map((r) => ({
    id: r.id,
    label: r.label,
    rate: r.ratePer100mVmt,
    vsUs: Math.round((HEADLINE.usRate2019 / r.ratePer100mVmt) * 100) / 100,
    isUs: r.id === "united-states",
  }));
}

export function regionMeans2021(unit: UnitMode = "per100mVmt") {
  const ladder = irtadLadder2021(unit);
  const groups: Record<string, number[]> = {};
  for (const row of ladder) {
    if (!groups[row.region]) groups[row.region] = [];
    groups[row.region].push(row.rate);
  }
  const labels: Record<string, string> = {
    nordic: "Nordics",
    europe: "Other Europe",
    anglo: "Canada / Australia",
    asia: "Korea",
    us: "United States",
  };
  return Object.entries(groups).map(([region, rates]) => ({
    region,
    label: labels[region] ?? region,
    mean: Math.round((rates.reduce((a, b) => a + b, 0) / rates.length) * 100) / 100,
    n: rates.length,
  }));
}

export function dualLensRows() {
  const vmtMap = new Map(
    MMWR_2019_LADDER.map((r) => [r.id, r.ratePer100mVmt]),
  );
  return POP_RATES_2022.map((p) => ({
    id: p.id,
    label: p.label,
    pop: p.rate2022,
    vmt: vmtMap.get(p.id) ?? null,
    isUs: p.id === "united-states",
  })).filter((r): r is typeof r & { vmt: number } => r.vmt != null);
}
