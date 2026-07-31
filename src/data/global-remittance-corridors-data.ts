/**
 * Global remittance corridors — World Bank Migration and Development Brief 41 (Dec 2024)
 * and KNOMAD bilateral remittance matrix (2021 estimates). LMIC inflows are WB disclosed
 * estimates; bilateral corridor splits use KNOMAD Ratha–Shaw methodology (estimated).
 */

export const SOURCE_NOTE =
  "Officially recorded remittances to low- and middle-income countries (LMICs) from World Bank Migration and Development Brief 41 (December 2024). Top recipient totals and GDP-share leaders from the same release. Bilateral corridor flows are KNOMAD/World Bank model estimates for 2021 (Ratha & Shaw, 2007) — allocated by migrant stocks and PPP incomes, not transaction-level reporting. Regional history through 2023 from Brief 40; 2024 regional totals scaled to the disclosed $685B LMIC total using published regional growth rates.";

export const WB_BRIEF_41_URL =
  "https://blogs.worldbank.org/en/peoplemove/in-2024--remittance-flows-to-low--and-middle-income-countries-ar";

export const KNOMAD_BILATERAL_URL =
  "https://blogs.worldbank.org/en/peoplemove/bilateral-remittance-matrix-new";

export type Confidence = "disclosed" | "estimated";

export type TopRecipient = {
  country: string;
  iso: string;
  inflowBn: number;
  shareOfLmicPct: number;
  confidence: Confidence;
  note?: string;
};

/** Top five LMIC recipients — Brief 41, 2024e */
export const TOP_RECIPIENTS_2024: TopRecipient[] = [
  {
    country: "India",
    iso: "IN",
    inflowBn: 129,
    shareOfLmicPct: 18.8,
    confidence: "disclosed",
    note: "Largest recipient since 2008",
  },
  {
    country: "Mexico",
    iso: "MX",
    inflowBn: 68,
    shareOfLmicPct: 9.9,
    confidence: "disclosed",
  },
  {
    country: "China",
    iso: "CN",
    inflowBn: 48,
    shareOfLmicPct: 7.0,
    confidence: "disclosed",
  },
  {
    country: "Philippines",
    iso: "PH",
    inflowBn: 40,
    shareOfLmicPct: 5.8,
    confidence: "disclosed",
  },
  {
    country: "Pakistan",
    iso: "PK",
    inflowBn: 33,
    shareOfLmicPct: 4.8,
    confidence: "disclosed",
  },
];

export type GdpDependenceLeader = {
  country: string;
  iso: string;
  remittanceShareOfGdpPct: number;
  confidence: Confidence;
  inflowBn?: number;
};

/** Remittance share of GDP — Brief 41 figure 2 leaders */
export const GDP_DEPENDENCE_LEADERS: GdpDependenceLeader[] = [
  { country: "Tajikistan", iso: "TJ", remittanceShareOfGdpPct: 45, confidence: "disclosed" },
  { country: "Tonga", iso: "TO", remittanceShareOfGdpPct: 38, confidence: "disclosed" },
  { country: "Nicaragua", iso: "NI", remittanceShareOfGdpPct: 27, confidence: "disclosed" },
  { country: "Lebanon", iso: "LB", remittanceShareOfGdpPct: 27, confidence: "disclosed" },
  { country: "Samoa", iso: "WS", remittanceShareOfGdpPct: 26, confidence: "disclosed" },
  { country: "Honduras", iso: "HN", remittanceShareOfGdpPct: 24, confidence: "disclosed" },
  { country: "Kyrgyzstan", iso: "KG", remittanceShareOfGdpPct: 23, confidence: "disclosed" },
  { country: "Gambia", iso: "GM", remittanceShareOfGdpPct: 22, confidence: "disclosed" },
  { country: "Haiti", iso: "HT", remittanceShareOfGdpPct: 21, confidence: "disclosed" },
  { country: "El Salvador", iso: "SV", remittanceShareOfGdpPct: 20, confidence: "disclosed" },
];

export type BilateralCorridor = {
  id: string;
  source: string;
  sourceIso: string;
  destination: string;
  destinationIso: string;
  flowBn: number;
  year: number;
  confidence: Confidence;
  rank: number;
  note?: string;
};

/** KNOMAD bilateral matrix 2021 — model estimates, not official bilateral reporting */
export const BILATERAL_CORRIDORS: BilateralCorridor[] = [
  {
    id: "us-mx",
    source: "United States",
    sourceIso: "US",
    destination: "Mexico",
    destinationIso: "MX",
    flowBn: 52,
    year: 2021,
    confidence: "estimated",
    rank: 1,
    note: "Largest bilateral corridor globally in KNOMAD 2021 matrix",
  },
  {
    id: "uae-in",
    source: "United Arab Emirates",
    sourceIso: "AE",
    destination: "India",
    destinationIso: "IN",
    flowBn: 20,
    year: 2021,
    confidence: "estimated",
    rank: 2,
    note: "GCC corridor; dirham–rupee interlink boosted formal flows from 2023",
  },
  {
    id: "sa-in",
    source: "Saudi Arabia",
    sourceIso: "SA",
    destination: "India",
    destinationIso: "IN",
    flowBn: 13,
    year: 2021,
    confidence: "estimated",
    rank: 3,
  },
  {
    id: "us-ph",
    source: "United States",
    sourceIso: "US",
    destination: "Philippines",
    destinationIso: "PH",
    flowBn: 14.8,
    year: 2021,
    confidence: "estimated",
    rank: 4,
    note: "~40% of Philippines inflows per Brief 36; KNOMAD allocation",
  },
  {
    id: "us-in",
    source: "United States",
    sourceIso: "US",
    destination: "India",
    destinationIso: "IN",
    flowBn: 6,
    year: 2021,
    confidence: "estimated",
    rank: 5,
    note: "KNOMAD 2021 model; US share of India inflows rose sharply by FY25 RBI data",
  },
];

export type RegionalYear = {
  year: number;
  southAsia: number;
  eastAsiaPacific: number;
  europeCentralAsia: number;
  latinAmericaCaribbean: number;
  middleEastNorthAfrica: number;
  subSaharanAfrica: number;
  total: number;
  confidence: Confidence;
};

/** Billion USD — Brief 40 table through 2023; 2024 scaled to $685B total */
export const REGIONAL_HISTORY: RegionalYear[] = [
  {
    year: 2019,
    southAsia: 115,
    eastAsiaPacific: 148,
    europeCentralAsia: 56,
    latinAmericaCaribbean: 96,
    middleEastNorthAfrica: 62,
    subSaharanAfrica: 48,
    total: 553,
    confidence: "disclosed",
  },
  {
    year: 2020,
    southAsia: 115,
    eastAsiaPacific: 137,
    europeCentralAsia: 56,
    latinAmericaCaribbean: 96,
    middleEastNorthAfrica: 62,
    subSaharanAfrica: 48,
    total: 558,
    confidence: "disclosed",
  },
  {
    year: 2021,
    southAsia: 150,
    eastAsiaPacific: 133,
    europeCentralAsia: 66,
    latinAmericaCaribbean: 117,
    middleEastNorthAfrica: 65,
    subSaharanAfrica: 52,
    total: 605,
    confidence: "disclosed",
  },
  {
    year: 2022,
    southAsia: 163,
    eastAsiaPacific: 133,
    europeCentralAsia: 72,
    latinAmericaCaribbean: 130,
    middleEastNorthAfrica: 64,
    subSaharanAfrica: 53,
    total: 630,
    confidence: "disclosed",
  },
  {
    year: 2023,
    southAsia: 177,
    eastAsiaPacific: 133,
    europeCentralAsia: 78,
    latinAmericaCaribbean: 145,
    middleEastNorthAfrica: 64,
    subSaharanAfrica: 54,
    total: 656,
    confidence: "disclosed",
  },
  {
    year: 2024,
    southAsia: 199,
    eastAsiaPacific: 136,
    europeCentralAsia: 82,
    latinAmericaCaribbean: 152,
    middleEastNorthAfrica: 67,
    subSaharanAfrica: 57,
    total: 685,
    confidence: "estimated",
  },
];

export type RegionalGrowth2024 = {
  region: string;
  growthPct2023: number;
  growthPct2024: number;
  confidence: Confidence;
};

/** 2023 growth from Brief 40 narrative; 2024 from Brief 41 */
export const REGIONAL_GROWTH_2024: RegionalGrowth2024[] = [
  { region: "South Asia", growthPct2023: 5.2, growthPct2024: 11.8, confidence: "disclosed" },
  {
    region: "Latin America & Caribbean",
    growthPct2023: 7.5,
    growthPct2024: 4.8,
    confidence: "estimated",
  },
  {
    region: "Europe & Central Asia",
    growthPct2023: 1.9,
    growthPct2024: 3.5,
    confidence: "estimated",
  },
  {
    region: "Middle East & Africa",
    growthPct2023: -3.0,
    growthPct2024: 5.4,
    confidence: "disclosed",
  },
  {
    region: "East Asia & Pacific",
    growthPct2023: -2.0,
    growthPct2024: 2.3,
    confidence: "estimated",
  },
];

export type ExternalFlowCompare = {
  label: string;
  amountBn: number;
  confidence: Confidence;
};

/** Brief 41 scale comparison — remittances vs other external finance to LMICs */
export const EXTERNAL_FLOWS_2024: ExternalFlowCompare[] = [
  { label: "Remittances", amountBn: 685, confidence: "disclosed" },
  { label: "FDI", amountBn: 470, confidence: "estimated" },
  { label: "ODA", amountBn: 210, confidence: "estimated" },
];

export const HEADLINE = {
  lmicTotalBn: 685,
  growthPct2024: 5.8,
  growthPct2023: 1.2,
  indiaInflowBn: 129,
  mexicoInflowBn: 68,
  philippinesInflowBn: 40,
  indiaPlusPhilippinesBn: 169,
  indiaVsMexicoPlusPhilippinesGapBn: 129 - (68 + 40),
  topRecipientShareOfLmicPct: 18.8,
  tajikistanGdpSharePct: 45,
  tongaGdpSharePct: 38,
  usMexicoCorridorBn: 52,
  uaeIndiaCorridorBn: 20,
  southAsiaGrowthPct2024: 11.8,
  fdiToLmicBn2024: 470,
  odaToLmicBn2024: 210,
};

export const RECIPIENT_COLORS: Record<string, string> = {
  India: "#f59e0b",
  Mexico: "#0ea5e9",
  China: "#ef4444",
  Philippines: "#8b5cf6",
  Pakistan: "#10b981",
};

export const REGION_COLORS = {
  southAsia: "#f59e0b",
  eastAsiaPacific: "#0ea5e9",
  europeCentralAsia: "#8b5cf6",
  latinAmericaCaribbean: "#10b981",
  middleEastNorthAfrica: "#ef4444",
  subSaharanAfrica: "#64748b",
};

export const CORRIDOR_COLORS: Record<string, string> = {
  "us-mx": "#0ea5e9",
  "uae-in": "#f59e0b",
  "sa-in": "#10b981",
  "us-ph": "#8b5cf6",
  "us-in": "#ef4444",
};

export function fmtBn(n: number, digits = 0): string {
  if (digits === 0) return `$${Math.round(n)}B`;
  return `$${n.toFixed(digits)}B`;
}

export function fmtPct(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`;
}

export const SOURCES = [
  { label: "World Bank — Migration and Development Brief 41 (Dec 2024)", url: WB_BRIEF_41_URL },
  { label: "World Bank — KNOMAD bilateral remittance matrix (2021)", url: KNOMAD_BILATERAL_URL },
  {
    label: "World Bank — Migration and Development Brief 40 (2023 regional totals)",
    url: "https://www.knomad.org/publications/migration-and-development-brief-40",
  },
];
