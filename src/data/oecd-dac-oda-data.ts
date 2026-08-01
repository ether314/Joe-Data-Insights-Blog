/**
 * OECD DAC Official Development Assistance 2024 (preliminary, grant-equivalent).
 * Source: OECD DCD(2025)6 — Preliminary official development assistance levels in 2024
 * (16 Apr 2025). Headline ODA is grant-equivalent basis.
 */

export type Confidence = "disclosed" | "estimated";

export const SOURCE_NOTE =
  "OECD Development Co-operation Directorate, Preliminary official development assistance levels in 2024 (DCD(2025)6, 16 Apr 2025). All country volumes and ODA/GNI ratios are preliminary grant-equivalent figures. Real-term % changes are OECD-reported. Composition shares for total DAC (grants, loan grant-equivalents, multilateral, PSI) from Table 1 totals. Final detailed figures due Dec 2025.";

export const SOURCES = [
  {
    label: "OECD — Preliminary ODA levels in 2024 (DCD(2025)6)",
    url: "https://www.oecd.org/en/about/news/press-releases/2025/04/official-development-assistance-2024-figures.html",
  },
  {
    label: "OECD DAC ODA statistics hub",
    url: "https://www.oecd.org/en/topics/oda-statistics-and-publications.html",
  },
] as const;

export const HEADLINE = {
  totalOdaBn: 212.1,
  dacGniPct: 0.33,
  realChangePct: -7.1,
  usBn: 63.3,
  usSharePct: 30,
  top5SharePct: 69,
  g7SharePct: 75,
  hit07Count: 4,
  unTargetPct: 0.7,
  above2019Pct: 23,
  outlookDropLowPct: 9,
  outlookDropHighPct: 17,
  inDonorRefugeeBn: 27.8,
  inDonorRefugeeSharePct: 13.1,
  humanitarianBn: 24.2,
  ukraineBilateralBn: 15.5,
} as const;

export type DonorGroup = "G7" | "Nordic" | "Other Europe" | "Asia-Pacific" | "Other";

export type DonorRow = {
  country: string;
  short: string;
  odaBn: number;
  odaGniPct: number;
  realChangePct: number | null;
  group: DonorGroup;
  hit07: boolean;
  confidence: Confidence;
};

/** Major DAC donors — volumes $bn grant-equivalent; ODA/GNI %; real-term change vs 2023 where disclosed. */
export const DONORS_2024: DonorRow[] = [
  { country: "United States", short: "US", odaBn: 63.3, odaGniPct: 0.22, realChangePct: -4.4, group: "G7", hit07: false, confidence: "disclosed" },
  { country: "Germany", short: "DE", odaBn: 32.4, odaGniPct: 0.67, realChangePct: -17.2, group: "G7", hit07: false, confidence: "disclosed" },
  { country: "United Kingdom", short: "UK", odaBn: 18.0, odaGniPct: 0.5, realChangePct: -10.8, group: "G7", hit07: false, confidence: "disclosed" },
  { country: "Japan", short: "JP", odaBn: 16.8, odaGniPct: 0.39, realChangePct: -10.3, group: "G7", hit07: false, confidence: "disclosed" },
  { country: "France", short: "FR", odaBn: 15.4, odaGniPct: 0.48, realChangePct: -0.02, group: "G7", hit07: false, confidence: "disclosed" },
  { country: "Netherlands", short: "NL", odaBn: 7.5, odaGniPct: 0.62, realChangePct: -2.8, group: "Other Europe", hit07: false, confidence: "disclosed" },
  { country: "Canada", short: "CA", odaBn: 7.4, odaGniPct: 0.34, realChangePct: -8.1, group: "G7", hit07: false, confidence: "disclosed" },
  { country: "Italy", short: "IT", odaBn: 6.7, odaGniPct: 0.28, realChangePct: 6.7, group: "G7", hit07: false, confidence: "disclosed" },
  { country: "Norway", short: "NO", odaBn: 5.2, odaGniPct: 1.02, realChangePct: -3.8, group: "Nordic", hit07: true, confidence: "disclosed" },
  { country: "Sweden", short: "SE", odaBn: 5.0, odaGniPct: 0.79, realChangePct: -13.4, group: "Nordic", hit07: true, confidence: "disclosed" },
  { country: "Switzerland", short: "CH", odaBn: 4.6, odaGniPct: 0.51, realChangePct: -14.9, group: "Other Europe", hit07: false, confidence: "disclosed" },
  { country: "Spain", short: "ES", odaBn: 4.4, odaGniPct: 0.25, realChangePct: 9.0, group: "Other Europe", hit07: false, confidence: "disclosed" },
  { country: "Korea", short: "KR", odaBn: 3.9, odaGniPct: 0.21, realChangePct: 24.8, group: "Asia-Pacific", hit07: false, confidence: "disclosed" },
  { country: "Australia", short: "AU", odaBn: 3.3, odaGniPct: 0.19, realChangePct: 0.3, group: "Asia-Pacific", hit07: false, confidence: "disclosed" },
  { country: "Belgium", short: "BE", odaBn: 3.2, odaGniPct: 0.48, realChangePct: 12.2, group: "Other Europe", hit07: false, confidence: "disclosed" },
  { country: "Denmark", short: "DK", odaBn: 3.2, odaGniPct: 0.71, realChangePct: 2.2, group: "Nordic", hit07: true, confidence: "disclosed" },
  { country: "Ireland", short: "IE", odaBn: 2.5, odaGniPct: 0.57, realChangePct: -14.0, group: "Other Europe", hit07: false, confidence: "disclosed" },
  { country: "Poland", short: "PL", odaBn: 2.1, odaGniPct: 0.24, realChangePct: -26.8, group: "Other Europe", hit07: false, confidence: "disclosed" },
  { country: "Austria", short: "AT", odaBn: 1.8, odaGniPct: 0.34, realChangePct: -9.5, group: "Other Europe", hit07: false, confidence: "disclosed" },
  { country: "Finland", short: "FI", odaBn: 1.4, odaGniPct: 0.47, realChangePct: -12.9, group: "Nordic", hit07: false, confidence: "disclosed" },
  { country: "New Zealand", short: "NZ", odaBn: 0.78, odaGniPct: 0.32, realChangePct: 0.5, group: "Asia-Pacific", hit07: false, confidence: "disclosed" },
  { country: "Luxembourg", short: "LU", odaBn: 0.6, odaGniPct: 1.0, realChangePct: -0.3, group: "Other Europe", hit07: true, confidence: "disclosed" },
];

/** DAC total ODA path — 2019–2024. 2020–2023 levels approximated from OECD narrative (+33% 2019→2023, −7.1% in 2024, still +23% vs 2019). 2019 and 2024 disclosed anchors. */
export const DAC_TOTAL_PATH = [
  { year: 2019, odaBn: 172.4, confidence: "estimated" as Confidence, note: "Back-solved: 2024 is +23% vs 2019" },
  { year: 2020, odaBn: 179.3, confidence: "estimated" as Confidence, note: "+4.0% real vs 2019 (OECD)" },
  { year: 2021, odaBn: 194.2, confidence: "estimated" as Confidence, note: "+8.3% real vs 2020 (OECD)" },
  { year: 2022, odaBn: 226.8, confidence: "estimated" as Confidence, note: "+16.8% real vs 2021 (OECD)" },
  { year: 2023, odaBn: 228.3, confidence: "estimated" as Confidence, note: "+1.2% real vs 2022; 2024 −7.1% from here" },
  { year: 2024, odaBn: 212.1, confidence: "disclosed" as Confidence, note: "Preliminary grant-equivalent total" },
];

/** Composition of 2024 DAC ODA from Table 1 totals ($bn). */
export const COMPOSITION_2024 = [
  { slice: "Bilateral grants", short: "Bilat. grants", bn: 143.6, confidence: "disclosed" as Confidence },
  { slice: "Multilateral (grants + capital)", short: "Multilateral", bn: 51.0, confidence: "disclosed" as Confidence },
  { slice: "Loan grant-equivalents", short: "Loan GE", bn: 13.4, confidence: "disclosed" as Confidence },
  { slice: "Private-sector instruments", short: "PSI", bn: 3.8, confidence: "disclosed" as Confidence },
  { slice: "Debt relief", short: "Debt relief", bn: 0.2, confidence: "disclosed" as Confidence },
].sort((a, b) => b.bn - a.bn);

/** Memo aggregates */
export const MEMO_BLOCKS = [
  { label: "G7 countries", bn: 160.0, gniPct: 0.32, sharePct: 75 },
  { label: "DAC-EU countries", bn: 88.7, gniPct: 0.47, sharePct: 42 },
  { label: "Non-G7 DAC", bn: 52.1, gniPct: 0.38, sharePct: 25 },
  { label: "EU Institutions (memo)", bn: 27.7, gniPct: null, sharePct: null },
].sort((a, b) => b.bn - a.bn);

export const PRESSURE_LINES = [
  { label: "In-donor refugee costs", bn: 27.8, sharePct: 13.1, realChangePct: -17.3 },
  { label: "Humanitarian aid", bn: 24.2, sharePct: 11.4, realChangePct: -9.6 },
  { label: "Bilateral ODA to Ukraine", bn: 15.5, sharePct: 7.4, realChangePct: -16.7 },
].sort((a, b) => b.bn - a.bn);

export function rankedByVolume(): DonorRow[] {
  return [...DONORS_2024].sort((a, b) => b.odaBn - a.odaBn);
}

export function rankedByIntensity(): DonorRow[] {
  return [...DONORS_2024].sort((a, b) => b.odaGniPct - a.odaGniPct);
}

export function fmtBn(n: number, digits = 1): string {
  if (n >= 100) return `$${n.toFixed(0)}B`;
  return `$${n.toFixed(digits)}B`;
}

export function fmtPct(n: number, digits = 2): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtSignedPct(n: number, digits = 1): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(digits)}%`;
}
