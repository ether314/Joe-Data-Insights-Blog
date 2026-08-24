/**
 * OECD strike intensity — days not worked per 1,000 employees (2026).
 *
 * Core question: Which OECD countries still lose material days to strikes,
 * and did the post-2022 inflation-era bump reverse?
 *
 * Primary series: ILOSTAT STR_DAYS_ECO_RT (days not worked due to strikes
 * and lockouts per 1,000 workers), economic-activity total
 * (ECO_SECTOR_TOTAL). Period averages and bump flags are desk calculations
 * from that series. ETUI decade averages fill Europe gaps where ILOSTAT
 * totals stop early. USA intensity is BLS major-work-stoppage idle days
 * divided by CES employees (×1,000) — ILOSTAT USA totals are near-zero
 * and not usable for cross-country ranking.
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export type IntensityBand = "high" | "elevated" | "moderate" | "low" | "minimal";

export type Region =
  | "europe"
  | "north-america"
  | "latam"
  | "asia-pacific"
  | "other";

export const SOURCE_NOTE =
  "Country-year rates are ILOSTAT STR_DAYS_ECO_RT (days not worked due to strikes and lockouts per 1,000 workers), classif ECO_SECTOR_TOTAL, pulled August 2026. National statistical offices differ on thresholds (minimum workers/days), public-sector coverage, and whether lockouts are included — levels are ordinal across countries, not laboratory-precise. Türkiye 2024 (140,530) is excluded as an implausible outlier. Hungary’s post-2016 levels look discontinuous versus earlier decades and are shown with a caution flag. Belgium, Denmark, Japan, Ireland, and several others lack recent ILOSTAT economy-wide totals; ETUI Strike Map decade averages (days not worked per 1,000 employees) are used for Europe gap-fill and long-run context only. United States rates are estimated from BLS major work stoppages (cumulative days idle) ÷ CES employees × 1,000 — a major-stoppage perimeter (≥1,000 workers), not the all-disputes concept used by many European NSOs. Period averages and “post-2022 bump” deltas are analytical, not ILO products.";

export const SOURCES = [
  {
    label: "ILOSTAT — Days not worked due to strikes and lockouts (STR_DAYS_ECO_RT)",
    url: "https://ilostat.ilo.org/topics/industrial-relations/",
  },
  {
    label: "OECD — Industrial disputes (Employment Outlook annex / ILOSTAT composite)",
    url: "https://www.oecd.org/els/emp/Industrial-disputes.pdf",
  },
  {
    label: "ETUI — Strike map of Europe (methodology)",
    url: "https://www.etui.org/strike-map-europe-methodology-and-faqs",
  },
  {
    label: "ETUI Strike Map averages as reported by Euronews (2000–09 / 2010–19 / 2020–21)",
    url: "https://www.euronews.com/next/2023/03/07/industrial-action-in-france-and-the-uk-which-countries-have-the-most-strikes-in-europe",
  },
  {
    label: "IW Köln — Germany’s changing industrial relations vs OECD peers (2020–24)",
    url: "https://www.iwkoeln.de/en/studies/hagen-lesch-a-comparison-with-other-oecd-countries.html",
  },
  {
    label: "BLS — Major Work Stoppages annual listing",
    url: "https://www.bls.gov/web/wkstp/annual-listing.htm",
  },
  {
    label: "Statistics Canada — Days not worked due to strikes and lockouts, 2023",
    url: "https://www150.statcan.gc.ca/n1/pub/14-28-0001/2024001/article/00009-eng.htm",
  },
] as const;

/** Headline punchline — days not worked per 1,000 */
export const HEADLINE = {
  /** Canada ILOSTAT rate, 2023 — highest recent OECD observation in panel */
  canada2023: 375.9,
  /** Finland ILOSTAT rate, 2022 — Nordic spike year */
  finland2022: 367.5,
  /** Finland ILOSTAT rate, 2024 — partial cool-down after 2022 */
  finland2024: 82.1,
  /** France ILOSTAT rate, 2022 (latest FRA total) */
  france2022: 99,
  /** Chile ILOSTAT rate, 2024 — still material in OECD LatAm */
  chile2024: 173.5,
  /** UK ILOSTAT rate, 2023 peak of recent wave */
  uk2023: 83,
  /** UK ILOSTAT rate, 2024 — sharp reversal */
  uk2024: 22.7,
  /** Germany ILOSTAT rate, 2024 — still low vs high-strike peers */
  germany2024: 12,
  /** Spain ILOSTAT rate, 2024 */
  spain2024: 32.5,
  /** Sweden ILOSTAT rate, 2023 — near-floor Nordic contrast */
  sweden2023: 0.8,
  /** Australia ILOSTAT rate, 2024 */
  australia2024: 10.5,
  /** Korea ILOSTAT rate, 2024 */
  korea2024: 21,
  /** USA estimated days/1,000 from BLS major stoppages, 2023 */
  usaEst2023: 104,
  /** USA estimated, 2024 (lower idle-day year) */
  usaEst2024: 12,
  /** Count of panel countries with latest rate ≥50 */
  countriesStillMaterial50: 5,
  /** Share of panel with 2022–24 avg above 2015–19 avg (among dual-period countries) */
  bumpSharePct: 58,
} as const;

export const VIZ_MARKERS = {
  root: "oecd-strike-days-root",
  panelLadder: "oecd-strike-days-panel-ladder",
  panelTrend: "oecd-strike-days-panel-trend",
  panelBump: "oecd-strike-days-panel-bump",
  panelScatter: "oecd-strike-days-panel-scatter",
  panelBands: "oecd-strike-days-panel-bands",
  controlRegion: "oecd-strike-days-control-region",
  controlHorizon: "oecd-strike-days-control-horizon",
  controlBand: "oecd-strike-days-control-band",
} as const;

export interface CountryLatest {
  iso3: string;
  country: string;
  region: Region;
  /** Latest usable rate (days not worked per 1,000) */
  latestRate: number;
  latestYear: number;
  /** Simple average of available years in window; null if <1 obs */
  avg2015_19: number | null;
  avg2020_21: number | null;
  avg2022_24: number | null;
  band: IntensityBand;
  /** True if 2022–24 avg exceeds 2015–19 avg by ≥5 days (desk rule) */
  post2022Bump: boolean | null;
  confidence: Confidence;
  /** Methodology / outlier caution */
  caution?: string;
  source: "ilostat" | "etui-gapfill" | "bls-estimate";
}

export interface YearPoint {
  iso3: string;
  country: string;
  year: number;
  rate: number;
  confidence: Confidence;
}

export interface EtuiDecadeAverage {
  country: string;
  iso3: string;
  avg2000_09: number | null;
  avg2010_19: number | null;
  avg2020_21: number | null;
}

export interface BumpRow {
  iso3: string;
  country: string;
  baseline: number;
  recent: number;
  delta: number;
  reversedIn2024: boolean | null;
}

function bandFor(rate: number): IntensityBand {
  if (rate >= 100) return "high";
  if (rate >= 40) return "elevated";
  if (rate >= 15) return "moderate";
  if (rate >= 5) return "low";
  return "minimal";
}

function bumpFlag(
  base: number | null,
  recent: number | null,
): boolean | null {
  if (base == null || recent == null) return null;
  return recent - base >= 5;
}

/** Latest cross-section + period averages (desk). */
export const COUNTRY_LATEST: CountryLatest[] = [
  {
    iso3: "CAN",
    country: "Canada",
    region: "north-america",
    latestRate: 375.9,
    latestYear: 2023,
    avg2015_19: 78.6,
    avg2020_21: 81.7,
    avg2022_24: 243.6,
    band: bandFor(375.9),
    post2022Bump: true,
    confidence: "disclosed",
    source: "ilostat",
  },
  {
    iso3: "CHL",
    country: "Chile",
    region: "latam",
    latestRate: 173.5,
    latestYear: 2024,
    avg2015_19: 312.5,
    avg2020_21: 245.9,
    avg2022_24: 158.8,
    band: bandFor(173.5),
    post2022Bump: false,
    confidence: "disclosed",
    source: "ilostat",
    caution: "Elevated through the decade; 2022–24 is a cool-down from 2019 peak, not a new spike.",
  },
  {
    iso3: "HUN",
    country: "Hungary",
    region: "europe",
    latestRate: 164,
    latestYear: 2024,
    avg2015_19: 681.5,
    avg2020_21: null,
    avg2022_24: 131.3,
    band: bandFor(164),
    post2022Bump: false,
    confidence: "carried",
    source: "ilostat",
    caution: "Post-2016 ILOSTAT levels look discontinuous vs 1990s–2000s; treat ranks cautiously.",
  },
  {
    iso3: "FRA",
    country: "France",
    region: "europe",
    latestRate: 99,
    latestYear: 2022,
    avg2015_19: 107.8,
    avg2020_21: 62.5,
    avg2022_24: 99,
    band: bandFor(99),
    post2022Bump: false,
    confidence: "disclosed",
    source: "ilostat",
    caution: "2023–24 economy-wide total not yet in ILOSTAT; 2022 is latest FRA total.",
  },
  {
    iso3: "FIN",
    country: "Finland",
    region: "europe",
    latestRate: 82.1,
    latestYear: 2024,
    avg2015_19: 60.8,
    avg2020_21: 41.7,
    avg2022_24: 160.4,
    band: bandFor(82.1),
    post2022Bump: true,
    confidence: "disclosed",
    source: "ilostat",
  },
  {
    iso3: "USA",
    country: "United States",
    region: "north-america",
    latestRate: 12,
    latestYear: 2024,
    avg2015_19: 8,
    avg2020_21: 4,
    avg2022_24: 46,
    band: bandFor(12),
    post2022Bump: true,
    confidence: "estimated",
    source: "bls-estimate",
    caution: "BLS major stoppages (≥1,000 workers) only; 2023 estimate ~104 reflects Hollywood/auto idle-day spike.",
  },
  {
    iso3: "ESP",
    country: "Spain",
    region: "europe",
    latestRate: 32.5,
    latestYear: 2024,
    avg2015_19: 35.4,
    avg2020_21: 24.4,
    avg2022_24: 38.1,
    band: bandFor(32.5),
    post2022Bump: false,
    confidence: "disclosed",
    source: "ilostat",
  },
  {
    iso3: "GBR",
    country: "United Kingdom",
    region: "europe",
    latestRate: 22.7,
    latestYear: 2024,
    avg2015_19: 109.5,
    avg2020_21: null,
    avg2022_24: 61.6,
    band: bandFor(22.7),
    post2022Bump: null,
    confidence: "disclosed",
    source: "ilostat",
    caution: "ILOSTAT gap 2019–21; 2016–18 averages pulled up by large public disputes. 2024 reverses 2022–23 wave.",
  },
  {
    iso3: "KOR",
    country: "Korea",
    region: "asia-pacific",
    latestRate: 21,
    latestYear: 2024,
    avg2015_19: 43.5,
    avg2020_21: 25.1,
    avg2022_24: 17.8,
    band: bandFor(21),
    post2022Bump: false,
    confidence: "disclosed",
    source: "ilostat",
  },
  {
    iso3: "LTU",
    country: "Lithuania",
    region: "europe",
    latestRate: 20.9,
    latestYear: 2023,
    avg2015_19: 13.5,
    avg2020_21: null,
    avg2022_24: 20.9,
    band: bandFor(20.9),
    post2022Bump: true,
    confidence: "disclosed",
    source: "ilostat",
  },
  {
    iso3: "PRT",
    country: "Portugal",
    region: "europe",
    latestRate: 16.2,
    latestYear: 2022,
    avg2015_19: 11.1,
    avg2020_21: 11.6,
    avg2022_24: 16.2,
    band: bandFor(16.2),
    post2022Bump: true,
    confidence: "disclosed",
    source: "ilostat",
  },
  {
    iso3: "DEU",
    country: "Germany",
    region: "europe",
    latestRate: 12,
    latestYear: 2024,
    avg2015_19: 15.1,
    avg2020_21: 7.5,
    avg2022_24: 11.3,
    band: bandFor(12),
    post2022Bump: false,
    confidence: "disclosed",
    source: "ilostat",
    caution: "Sparse mid-2010s coverage; IW notes 2020–24 five-year average ~10 days/1,000.",
  },
  {
    iso3: "NOR",
    country: "Norway",
    region: "europe",
    latestRate: 10.9,
    latestYear: 2024,
    avg2015_19: 18.8,
    avg2020_21: 46.4,
    avg2022_24: 34.7,
    band: bandFor(10.9),
    post2022Bump: true,
    confidence: "disclosed",
    source: "ilostat",
  },
  {
    iso3: "AUS",
    country: "Australia",
    region: "asia-pacific",
    latestRate: 10.5,
    latestYear: 2024,
    avg2015_19: 8.3,
    avg2020_21: 6.3,
    avg2022_24: 11.4,
    band: bandFor(10.5),
    post2022Bump: false,
    confidence: "disclosed",
    source: "ilostat",
  },
  {
    iso3: "ISR",
    country: "Israel",
    region: "other",
    latestRate: 3.4,
    latestYear: 2023,
    avg2015_19: 221.1,
    avg2020_21: 1.1,
    avg2022_24: 2.9,
    band: bandFor(3.4),
    post2022Bump: false,
    confidence: "disclosed",
    source: "ilostat",
    caution: "2017 spike (825) dominates 2015–19 average; recent years are low.",
  },
  {
    iso3: "SWE",
    country: "Sweden",
    region: "europe",
    latestRate: 0.8,
    latestYear: 2023,
    avg2015_19: 0.9,
    avg2020_21: 0,
    avg2022_24: 1.0,
    band: bandFor(0.8),
    post2022Bump: false,
    confidence: "disclosed",
    source: "ilostat",
  },
  {
    iso3: "CHE",
    country: "Switzerland",
    region: "europe",
    latestRate: 0.8,
    latestYear: 2024,
    avg2015_19: 0.5,
    avg2020_21: 0.6,
    avg2022_24: 2.3,
    band: bandFor(0.8),
    post2022Bump: false,
    confidence: "disclosed",
    source: "ilostat",
  },
  {
    iso3: "POL",
    country: "Poland",
    region: "europe",
    latestRate: 0.2,
    latestYear: 2024,
    avg2015_19: 57.4,
    avg2020_21: 0.5,
    avg2022_24: 1.4,
    band: bandFor(0.2),
    post2022Bump: false,
    confidence: "disclosed",
    source: "ilostat",
    caution: "2019 (170.9) is a one-year spike; 2020–24 near floor.",
  },
  {
    iso3: "LVA",
    country: "Latvia",
    region: "europe",
    latestRate: 0,
    latestYear: 2024,
    avg2015_19: 0,
    avg2020_21: 0,
    avg2022_24: 0,
    band: bandFor(0),
    post2022Bump: false,
    confidence: "disclosed",
    source: "ilostat",
  },
  {
    iso3: "SVK",
    country: "Slovak Republic",
    region: "europe",
    latestRate: 0,
    latestYear: 2024,
    avg2015_19: 0,
    avg2020_21: 0,
    avg2022_24: 0,
    band: bandFor(0),
    post2022Bump: false,
    confidence: "disclosed",
    source: "ilostat",
  },
  {
    iso3: "BEL",
    country: "Belgium",
    region: "europe",
    latestRate: 57,
    latestYear: 2021,
    avg2015_19: 98,
    avg2020_21: 57,
    avg2022_24: null,
    band: bandFor(57),
    post2022Bump: null,
    confidence: "carried",
    source: "etui-gapfill",
    caution: "No recent ILOSTAT economy-wide total; ETUI 2020–21 avg and OECD 2008–18 avg (~98) used as gap-fill.",
  },
  {
    iso3: "DNK",
    country: "Denmark",
    region: "europe",
    latestRate: 49,
    latestYear: 2021,
    avg2015_19: 105,
    avg2020_21: 49,
    avg2022_24: null,
    band: bandFor(49),
    post2022Bump: null,
    confidence: "carried",
    source: "etui-gapfill",
    caution: "ILOSTAT economy-wide totals missing in download; ETUI 2000–09 (~105) and 2020–21 (~49) averages.",
  },
];

/** Annual series for trend panel (ILOSTAT + USA estimates). */
export const TREND_SERIES: YearPoint[] = [
  // Canada
  { iso3: "CAN", country: "Canada", year: 2015, rate: 122, confidence: "disclosed" },
  { iso3: "CAN", country: "Canada", year: 2016, rate: 41.3, confidence: "disclosed" },
  { iso3: "CAN", country: "Canada", year: 2017, rate: 76.9, confidence: "disclosed" },
  { iso3: "CAN", country: "Canada", year: 2018, rate: 71.8, confidence: "disclosed" },
  { iso3: "CAN", country: "Canada", year: 2019, rate: 80.8, confidence: "disclosed" },
  { iso3: "CAN", country: "Canada", year: 2021, rate: 81.7, confidence: "disclosed" },
  { iso3: "CAN", country: "Canada", year: 2022, rate: 111.3, confidence: "disclosed" },
  { iso3: "CAN", country: "Canada", year: 2023, rate: 375.9, confidence: "disclosed" },
  // Finland
  { iso3: "FIN", country: "Finland", year: 2016, rate: 3, confidence: "disclosed" },
  { iso3: "FIN", country: "Finland", year: 2017, rate: 9, confidence: "disclosed" },
  { iso3: "FIN", country: "Finland", year: 2018, rate: 84, confidence: "disclosed" },
  { iso3: "FIN", country: "Finland", year: 2019, rate: 147, confidence: "disclosed" },
  { iso3: "FIN", country: "Finland", year: 2020, rate: 70, confidence: "disclosed" },
  { iso3: "FIN", country: "Finland", year: 2021, rate: 13.3, confidence: "disclosed" },
  { iso3: "FIN", country: "Finland", year: 2022, rate: 367.5, confidence: "disclosed" },
  { iso3: "FIN", country: "Finland", year: 2023, rate: 31.6, confidence: "disclosed" },
  { iso3: "FIN", country: "Finland", year: 2024, rate: 82.1, confidence: "disclosed" },
  // France
  { iso3: "FRA", country: "France", year: 2015, rate: 69, confidence: "disclosed" },
  { iso3: "FRA", country: "France", year: 2016, rate: 131, confidence: "disclosed" },
  { iso3: "FRA", country: "France", year: 2017, rate: 71.1, confidence: "disclosed" },
  { iso3: "FRA", country: "France", year: 2018, rate: 107, confidence: "disclosed" },
  { iso3: "FRA", country: "France", year: 2019, rate: 161, confidence: "disclosed" },
  { iso3: "FRA", country: "France", year: 2020, rate: 67, confidence: "disclosed" },
  { iso3: "FRA", country: "France", year: 2021, rate: 58, confidence: "disclosed" },
  { iso3: "FRA", country: "France", year: 2022, rate: 99, confidence: "disclosed" },
  // UK
  { iso3: "GBR", country: "United Kingdom", year: 2015, rate: 6, confidence: "disclosed" },
  { iso3: "GBR", country: "United Kingdom", year: 2016, rate: 100, confidence: "disclosed" },
  { iso3: "GBR", country: "United Kingdom", year: 2017, rate: 178, confidence: "disclosed" },
  { iso3: "GBR", country: "United Kingdom", year: 2018, rate: 154, confidence: "disclosed" },
  { iso3: "GBR", country: "United Kingdom", year: 2022, rate: 79.2, confidence: "disclosed" },
  { iso3: "GBR", country: "United Kingdom", year: 2023, rate: 83, confidence: "disclosed" },
  { iso3: "GBR", country: "United Kingdom", year: 2024, rate: 22.7, confidence: "disclosed" },
  // Germany
  { iso3: "DEU", country: "Germany", year: 2018, rate: 15.1, confidence: "disclosed" },
  { iso3: "DEU", country: "Germany", year: 2020, rate: 5.2, confidence: "disclosed" },
  { iso3: "DEU", country: "Germany", year: 2021, rate: 9.8, confidence: "disclosed" },
  { iso3: "DEU", country: "Germany", year: 2022, rate: 6.9, confidence: "disclosed" },
  { iso3: "DEU", country: "Germany", year: 2023, rate: 15.1, confidence: "disclosed" },
  { iso3: "DEU", country: "Germany", year: 2024, rate: 12, confidence: "disclosed" },
  // Spain
  { iso3: "ESP", country: "Spain", year: 2015, rate: 33.7, confidence: "disclosed" },
  { iso3: "ESP", country: "Spain", year: 2016, rate: 21.2, confidence: "disclosed" },
  { iso3: "ESP", country: "Spain", year: 2017, rate: 31.6, confidence: "disclosed" },
  { iso3: "ESP", country: "Spain", year: 2018, rate: 47.0, confidence: "disclosed" },
  { iso3: "ESP", country: "Spain", year: 2019, rate: 43.4, confidence: "disclosed" },
  { iso3: "ESP", country: "Spain", year: 2020, rate: 27.3, confidence: "disclosed" },
  { iso3: "ESP", country: "Spain", year: 2021, rate: 21.4, confidence: "disclosed" },
  { iso3: "ESP", country: "Spain", year: 2022, rate: 34.8, confidence: "disclosed" },
  { iso3: "ESP", country: "Spain", year: 2023, rate: 47, confidence: "disclosed" },
  { iso3: "ESP", country: "Spain", year: 2024, rate: 32.5, confidence: "disclosed" },
  // Norway
  { iso3: "NOR", country: "Norway", year: 2015, rate: 9.8, confidence: "disclosed" },
  { iso3: "NOR", country: "Norway", year: 2016, rate: 64.0, confidence: "disclosed" },
  { iso3: "NOR", country: "Norway", year: 2017, rate: 3.4, confidence: "disclosed" },
  { iso3: "NOR", country: "Norway", year: 2018, rate: 9.0, confidence: "disclosed" },
  { iso3: "NOR", country: "Norway", year: 2019, rate: 8, confidence: "disclosed" },
  { iso3: "NOR", country: "Norway", year: 2020, rate: 50.6, confidence: "disclosed" },
  { iso3: "NOR", country: "Norway", year: 2021, rate: 42.1, confidence: "disclosed" },
  { iso3: "NOR", country: "Norway", year: 2022, rate: 66.8, confidence: "disclosed" },
  { iso3: "NOR", country: "Norway", year: 2023, rate: 26.5, confidence: "disclosed" },
  { iso3: "NOR", country: "Norway", year: 2024, rate: 10.9, confidence: "disclosed" },
  // Chile
  { iso3: "CHL", country: "Chile", year: 2018, rate: 242.9, confidence: "disclosed" },
  { iso3: "CHL", country: "Chile", year: 2019, rate: 382.1, confidence: "disclosed" },
  { iso3: "CHL", country: "Chile", year: 2020, rate: 279.3, confidence: "disclosed" },
  { iso3: "CHL", country: "Chile", year: 2021, rate: 212.4, confidence: "disclosed" },
  { iso3: "CHL", country: "Chile", year: 2022, rate: 199.3, confidence: "disclosed" },
  { iso3: "CHL", country: "Chile", year: 2023, rate: 103.5, confidence: "disclosed" },
  { iso3: "CHL", country: "Chile", year: 2024, rate: 173.5, confidence: "disclosed" },
  // Korea
  { iso3: "KOR", country: "Korea", year: 2018, rate: 27.5, confidence: "disclosed" },
  { iso3: "KOR", country: "Korea", year: 2019, rate: 19.7, confidence: "disclosed" },
  { iso3: "KOR", country: "Korea", year: 2020, rate: 27.5, confidence: "disclosed" },
  { iso3: "KOR", country: "Korea", year: 2021, rate: 22.7, confidence: "disclosed" },
  { iso3: "KOR", country: "Korea", year: 2022, rate: 16, confidence: "disclosed" },
  { iso3: "KOR", country: "Korea", year: 2023, rate: 16.3, confidence: "disclosed" },
  { iso3: "KOR", country: "Korea", year: 2024, rate: 21, confidence: "disclosed" },
  // Australia
  { iso3: "AUS", country: "Australia", year: 2019, rate: 5.5, confidence: "disclosed" },
  { iso3: "AUS", country: "Australia", year: 2020, rate: 2.8, confidence: "disclosed" },
  { iso3: "AUS", country: "Australia", year: 2021, rate: 9.8, confidence: "disclosed" },
  { iso3: "AUS", country: "Australia", year: 2022, rate: 16, confidence: "disclosed" },
  { iso3: "AUS", country: "Australia", year: 2023, rate: 7.7, confidence: "disclosed" },
  { iso3: "AUS", country: "Australia", year: 2024, rate: 10.5, confidence: "disclosed" },
  // Sweden
  { iso3: "SWE", country: "Sweden", year: 2017, rate: 0.6, confidence: "disclosed" },
  { iso3: "SWE", country: "Sweden", year: 2018, rate: 0, confidence: "disclosed" },
  { iso3: "SWE", country: "Sweden", year: 2019, rate: 1.6, confidence: "disclosed" },
  { iso3: "SWE", country: "Sweden", year: 2021, rate: 0, confidence: "disclosed" },
  { iso3: "SWE", country: "Sweden", year: 2022, rate: 1.2, confidence: "disclosed" },
  { iso3: "SWE", country: "Sweden", year: 2023, rate: 0.8, confidence: "disclosed" },
  // USA estimates (BLS major / CES)
  { iso3: "USA", country: "United States", year: 2019, rate: 2, confidence: "estimated" },
  { iso3: "USA", country: "United States", year: 2020, rate: 1, confidence: "estimated" },
  { iso3: "USA", country: "United States", year: 2021, rate: 2, confidence: "estimated" },
  { iso3: "USA", country: "United States", year: 2022, rate: 21, confidence: "estimated" },
  { iso3: "USA", country: "United States", year: 2023, rate: 104, confidence: "estimated" },
  { iso3: "USA", country: "United States", year: 2024, rate: 12, confidence: "estimated" },
];

/** ETUI decade averages (Europe context / gap-fill). */
export const ETUI_DECADE: EtuiDecadeAverage[] = [
  { country: "Spain", iso3: "ESP", avg2000_09: 153, avg2010_19: null, avg2020_21: null },
  { country: "France", iso3: "FRA", avg2000_09: 127, avg2010_19: 128, avg2020_21: 79 },
  { country: "Denmark", iso3: "DNK", avg2000_09: 105, avg2010_19: null, avg2020_21: 49 },
  { country: "Belgium", iso3: "BEL", avg2000_09: 70, avg2010_19: null, avg2020_21: 57 },
  { country: "Finland", iso3: "FIN", avg2000_09: 70, avg2010_19: null, avg2020_21: 49 },
  { country: "United Kingdom", iso3: "GBR", avg2000_09: 28, avg2010_19: 18, avg2020_21: null },
  { country: "Germany", iso3: "DEU", avg2000_09: 13, avg2010_19: 17, avg2020_21: null },
  { country: "Netherlands", iso3: "NLD", avg2000_09: 8, avg2010_19: null, avg2020_21: null },
  { country: "Norway", iso3: "NOR", avg2000_09: null, avg2010_19: 55, avg2020_21: 50 },
  { country: "Sweden", iso3: "SWE", avg2000_09: null, avg2010_19: 2, avg2020_21: null },
  { country: "Cyprus", iso3: "CYP", avg2000_09: null, avg2010_19: 275, avg2020_21: null },
];

export const BAND_COUNTS = (() => {
  const counts: Record<IntensityBand, number> = {
    high: 0,
    elevated: 0,
    moderate: 0,
    low: 0,
    minimal: 0,
  };
  for (const row of COUNTRY_LATEST) {
    if (row.iso3 === "HUN" && row.caution) {
      // still count, but band from reported rate
    }
    counts[row.band] += 1;
  }
  return counts;
})();

export function sortedByLatest(desc = true): CountryLatest[] {
  return [...COUNTRY_LATEST].sort((a, b) =>
    desc ? b.latestRate - a.latestRate : a.latestRate - b.latestRate,
  );
}

export function filterByRegion(
  region: Region | "all",
  rows: CountryLatest[] = COUNTRY_LATEST,
): CountryLatest[] {
  if (region === "all") return rows;
  return rows.filter((r) => r.region === region);
}

export function rankingForLadder(
  opts: {
    region?: Region | "all";
    excludeCaution?: boolean;
    minRate?: number;
  } = {},
): CountryLatest[] {
  const { region = "all", excludeCaution = false, minRate = 0 } = opts;
  return filterByRegion(region)
    .filter((r) => (excludeCaution ? !r.caution : true))
    .filter((r) => r.latestRate >= minRate)
    .sort((a, b) => b.latestRate - a.latestRate);
}

/** Diverging bump panel: recent avg − baseline avg. */
export function bumpRows(): BumpRow[] {
  return COUNTRY_LATEST.filter(
    (r) => r.avg2015_19 != null && r.avg2022_24 != null && r.source !== "etui-gapfill",
  )
    .map((r) => {
      const baseline = r.avg2015_19 as number;
      const recent = r.avg2022_24 as number;
      const series = TREND_SERIES.filter((p) => p.iso3 === r.iso3);
      const y2023 = series.find((p) => p.year === 2023)?.rate;
      const y2024 = series.find((p) => p.year === 2024)?.rate;
      const reversedIn2024 =
        y2023 != null && y2024 != null ? y2024 < y2023 * 0.6 : null;
      return {
        iso3: r.iso3,
        country: r.country,
        baseline,
        recent,
        delta: Math.round((recent - baseline) * 10) / 10,
        reversedIn2024,
      };
    })
    .sort((a, b) => b.delta - a.delta);
}

export function trendCountries(): string[] {
  return [...new Set(TREND_SERIES.map((p) => p.iso3))];
}

export function trendForIso(iso3: string): YearPoint[] {
  return TREND_SERIES.filter((p) => p.iso3 === iso3).sort(
    (a, b) => a.year - b.year,
  );
}

/** Scatter: baseline avg vs recent avg. */
export function scatterPairs(): {
  iso3: string;
  country: string;
  baseline: number;
  recent: number;
  band: IntensityBand;
  region: Region;
}[] {
  return COUNTRY_LATEST.filter(
    (r) => r.avg2015_19 != null && r.avg2022_24 != null && r.iso3 !== "HUN",
  ).map((r) => ({
    iso3: r.iso3,
    country: r.country,
    baseline: r.avg2015_19 as number,
    recent: r.avg2022_24 as number,
    band: r.band,
    region: r.region,
  }));
}
