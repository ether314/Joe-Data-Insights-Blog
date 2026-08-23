/**
 * Veterinary antibiotic sales vs human use (2026).
 *
 * Core question: How does livestock antibiotic tonnage compare with human
 * consumption in the largest producing countries — and why do mg/PCU and
 * DDD refuse a single “who uses more” scoreboard?
 *
 * Perimeter: EMA ESVAC / ESUAvet sales for food-producing animals (EU/EEA);
 * FDA CVM ADUFA sales for medically important antimicrobials in US
 * food-producing animals; WOAH ANIMUSE global animal AMU; ECDC ESAC-Net
 * human DDD; ECDC–EFSA–EMA JIACRA biomass-aligned mg/kg for EU/EEA
 * human vs animal. Outside the EU/US, absolute tonnes for Brazil/India/
 * Australia lean on Mulchandani et al. (2023) modelled estimates calibrated
 * to WOAH regional intensity — not national open reports.
 *
 * Headline: In JIACRA IV (2019–2021), EU/EEA human AMC averaged 125.0 mg/kg
 * biomass vs 92.6 mg/kg in food-producing animals — animals lost the
 * biomass race in Europe, while global livestock still dominate absolute
 * tonnes and US sales still track in thousands of tonnes of active ingredient.
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "EU food-animal sales: EMA ESUAvet annual surveillance (2023–2024) and legacy ESVAC mg/PCU Farm-to-Fork tracking; country mg/kg from ESUAvet 2023 mandatory-scope antibacterials. US: FDA CVM Summary Report on Antimicrobials Sold or Distributed for Use in Food-Producing Animals (2023 medically important domestic sales). Global animal AMU: WOAH Annual Report on Antimicrobial Agents Intended for Use in Animals (2022 focus / 9th report). Human consumption: ECDC ESAC-Net 2023 (DDD per 1 000 inhabitants per day). Cross-sector EU/EEA: JIACRA IV (ECDC/EFSA/EMA) mg/kg biomass for 2021. China food-animal tonnes: MARA/IVDC via One Health Advances 2023 (2020). Brazil/India/Australia absolute tonnes: Mulchandani et al., PLOS Global Public Health 2023 modelled 2020 estimates (not open national ledgers). Metrics are not interchangeable — mg/PCU ≠ mg/kg biomass ≠ DDD.";

export const SOURCES = [
  {
    label: "EMA — ESUAvet / ESVAC veterinary antimicrobial sales",
    url: "https://www.ema.europa.eu/en/veterinary-regulatory-overview/antimicrobial-resistance-veterinary-medicine/european-sales-use-antimicrobials-veterinary-medicine-esuavet-annual-surveillance-reports",
  },
  {
    label: "FDA CVM — antimicrobials sold for food-producing animals",
    url: "https://www.fda.gov/animal-veterinary/cvm-updates/fda-releases-annual-summary-sales-and-distribution-antimicrobials-2023-use-food-producing-animals",
  },
  {
    label: "WOAH — antimicrobial agents intended for use in animals",
    url: "https://www.woah.org/en/what-we-do/global-initiatives/antimicrobial-resistance/",
  },
  {
    label: "ECDC — ESAC-Net antimicrobial consumption (humans)",
    url: "https://www.ecdc.europa.eu/en/publications-data/antimicrobial-consumption-eueea-esac-net-annual-epidemiological-report-2023",
  },
  {
    label: "JIACRA IV — human vs animal AMC (mg/kg biomass)",
    url: "https://www.efsa.europa.eu/en/efsajournal/pub/8589",
  },
  {
    label: "Mulchandani et al. 2023 — global livestock AMU 2020–2030",
    url: "https://journals.plos.org/globalpublichealth/article?id=10.1371/journal.pgph.0001305",
  },
] as const;

/** Headline punchline — metric clash + EU biomass flip */
export const HEADLINE = {
  /** JIACRA IV 2021 EU/EEA human AMC mg/kg estimated biomass */
  jiacraHumanMgPerKg: 125.0,
  /** JIACRA IV 2021 food-producing animals mg/kg */
  jiacraAnimalMgPerKg: 92.6,
  /** EU 2023 Farm-to-Fork tracker (ESVAC PCU method) mg/PCU */
  eu2023MgPcu: 88.5,
  /** 2018 Farm-to-Fork reference mg/PCU */
  eu2018RefMgPcu: 118.3,
  /** 2030 aspirational target mg/PCU */
  eu2030TargetMgPcu: 59.2,
  /** US 2023 medically important sales, tonnes active ingredient */
  us2023MedicallyImportantTonnes: 6100,
  /** WOAH 2022 reported animal AMU tonnes (participating countries) */
  woah2022ReportedTonnes: 70648,
  /** WOAH 2022 coverage-adjusted upper estimate tonnes */
  woah2022AdjustedTonnes: 74035,
  /** WOAH trend panel: mg/kg 2022 (85 consistent reporters) */
  woah2022MgPerKg: 97,
  /** ESAC-Net 2023 EU population-weighted total J01 DDD/1000 inhab/day */
  esacNet2023Ddd: 20.0,
  /** Mulchandani 2020 global modelled livestock AMU tonnes */
  mulchandani2020GlobalTonnes: 99502,
  confidence: "disclosed" as Confidence,
};

export type ProducerId =
  | "china"
  | "brazil"
  | "india"
  | "united_states"
  | "australia"
  | "eu27"
  | "spain"
  | "italy"
  | "poland"
  | "germany"
  | "france"
  | "netherlands";

export type AbsoluteTonnageRow = {
  id: ProducerId;
  label: string;
  /** Tonnes of antimicrobial active ingredient (food-animal / livestock scope) */
  tonnes: number;
  year: number;
  /** How the figure was obtained */
  basis: string;
  confidence: Confidence;
};

/**
 * Absolute livestock / food-animal antimicrobial mass for large producers.
 * Years differ by source — dashboard labels year; do not sum as a single census.
 */
export const ABSOLUTE_TONNAGE: AbsoluteTonnageRow[] = [
  {
    id: "china",
    label: "China",
    tonnes: 32776,
    year: 2020,
    basis: "MARA/IVDC food-animal sales (national report)",
    confidence: "disclosed",
  },
  {
    id: "brazil",
    label: "Brazil",
    tonnes: 10500,
    year: 2020,
    basis: "Mulchandani et al. 2023 model (WOAH-calibrated; no open national ledger)",
    confidence: "estimated",
  },
  {
    id: "india",
    label: "India",
    tonnes: 5700,
    year: 2020,
    basis: "Mulchandani et al. 2023 model (ranked #3 absolute; approximate bar read)",
    confidence: "estimated",
  },
  {
    id: "united_states",
    label: "United States",
    tonnes: 6100,
    year: 2023,
    basis: "FDA CVM medically important domestic sales (food-producing animals)",
    confidence: "disclosed",
  },
  {
    id: "australia",
    label: "Australia",
    tonnes: 3200,
    year: 2020,
    basis: "Mulchandani et al. 2023 model (extrapolated; last public national ~2010)",
    confidence: "estimated",
  },
  {
    id: "eu27",
    label: "EU-27",
    tonnes: 4381,
    year: 2023,
    basis: "ESUAvet mandatory-scope antibacterial VMP sales (food + other animals; ~98% food)",
    confidence: "disclosed",
  },
];

export type IntensityRow = {
  id: string;
  label: string;
  /** Population-adjusted intensity */
  value: number;
  unit: "mg/PCU" | "mg/kg" | "DDD/1000/day";
  sector: "animal" | "human" | "both";
  year: number;
  note: string;
  confidence: Confidence;
};

/** Intensity ladder — mixed units on purpose (the story is the unit clash). */
export const INTENSITY_LADDER: IntensityRow[] = [
  {
    id: "jiacra-human",
    label: "EU/EEA humans (JIACRA)",
    value: 125.0,
    unit: "mg/kg",
    sector: "human",
    year: 2021,
    note: "mg active substance / kg estimated human biomass",
    confidence: "disclosed",
  },
  {
    id: "jiacra-animal",
    label: "EU/EEA food animals (JIACRA)",
    value: 92.6,
    unit: "mg/kg",
    sector: "animal",
    year: 2021,
    note: "mg / kg estimated food-animal biomass",
    confidence: "disclosed",
  },
  {
    id: "woah-global",
    label: "WOAH global animal (trend set)",
    value: 97,
    unit: "mg/kg",
    sector: "animal",
    year: 2022,
    note: "85 consistent reporters; 62% of global animal biomass",
    confidence: "disclosed",
  },
  {
    id: "eu-pcu-2023",
    label: "EU Farm-to-Fork (PCU)",
    value: 88.5,
    unit: "mg/PCU",
    sector: "animal",
    year: 2023,
    note: "Legacy ESVAC PCU method for 2030 target tracking",
    confidence: "disclosed",
  },
  {
    id: "eu-biomass-2023",
    label: "EU ESUAvet biomass",
    value: 45.1,
    unit: "mg/kg",
    sector: "animal",
    year: 2023,
    note: "New mandatory biomass denominator (not comparable to PCU)",
    confidence: "disclosed",
  },
  {
    id: "esac-ddd",
    label: "EU humans (ESAC-Net)",
    value: 20.0,
    unit: "DDD/1000/day",
    sector: "human",
    year: 2023,
    note: "Population-weighted total J01 community+hospital",
    confidence: "disclosed",
  },
  {
    id: "mul-global-pcu",
    label: "Global livestock (Mulchandani)",
    value: 79.3,
    unit: "mg/PCU",
    sector: "animal",
    year: 2020,
    note: "Modelled global intensity across cattle/sheep/pig/chicken",
    confidence: "estimated",
  },
];

export type EuCountrySalesRow = {
  id: string;
  label: string;
  /** Tonnes antibacterial VMPs for food-producing animals, ESUAvet 2023 */
  tonnes: number;
  /** mg/kg animal biomass (ESUAvet 2023) */
  mgPerKg: number;
  /** Human J01 DDD/1000 inhab/day (ESAC-Net 2023 total) — approx country prints */
  humanDdd: number;
  confidence: Confidence;
};

/**
 * Large EU livestock markets — animal tonnes + mg/kg (ESUAvet 2023) paired with
 * ESAC-Net 2023 country total consumption (DDD). Human DDD are approximate
 * country-level prints from the 2023 AER range narrative / public tables.
 */
export const EU_COUNTRY_COMPARE: EuCountrySalesRow[] = [
  { id: "spain", label: "Spain", tonnes: 1175.3, mgPerKg: 87.9, humanDdd: 24.5, confidence: "disclosed" },
  { id: "poland", label: "Poland", tonnes: 688.4, mgPerKg: 68.8, humanDdd: 23.8, confidence: "disclosed" },
  { id: "italy", label: "Italy", tonnes: 651.2, mgPerKg: 104.7, humanDdd: 22.1, confidence: "disclosed" },
  { id: "germany", label: "Germany", tonnes: 520.2, mgPerKg: 37.4, humanDdd: 12.8, confidence: "disclosed" },
  { id: "france", label: "France", tonnes: 253.9, mgPerKg: 16.2, humanDdd: 22.4, confidence: "disclosed" },
  { id: "netherlands", label: "Netherlands", tonnes: 113.1, mgPerKg: 22.0, humanDdd: 9.6, confidence: "disclosed" },
  { id: "portugal", label: "Portugal", tonnes: 139.6, mgPerKg: 62.2, humanDdd: 18.9, confidence: "carried" },
  { id: "cyprus", label: "Cyprus", tonnes: 22.9, mgPerKg: 112.9, humanDdd: 28.5, confidence: "disclosed" },
];

export type EuTrendRow = {
  year: number;
  /** Aggregated EU sales intensity under ESVAC PCU method (Farm-to-Fork series) */
  mgPcu: number;
  /** Approximate EU antibacterial tonnes (ESVAC / ESUAvet path) */
  tonnes: number | null;
  note: string;
  confidence: Confidence;
};

/** Farm-to-Fork mg/PCU path + recent tonnes. */
export const EU_PCU_TREND: EuTrendRow[] = [
  { year: 2018, mgPcu: 118.3, tonnes: null, note: "F2F reference year", confidence: "disclosed" },
  { year: 2019, mgPcu: 105.0, tonnes: null, note: "ESVAC path (approx)", confidence: "carried" },
  { year: 2020, mgPcu: 91.0, tonnes: null, note: "ESVAC path (approx)", confidence: "carried" },
  { year: 2021, mgPcu: 84.0, tonnes: null, note: "ESVAC path (approx)", confidence: "carried" },
  { year: 2022, mgPcu: 73.0, tonnes: null, note: "ESVAC low watermark (approx)", confidence: "carried" },
  { year: 2023, mgPcu: 88.5, tonnes: 4381, note: "ESUAvet + PCU tracker", confidence: "disclosed" },
  { year: 2024, mgPcu: 89.6, tonnes: 4403, note: "ESUAvet 2024; second consecutive rise", confidence: "disclosed" },
];

export type UsSalesRow = {
  year: number;
  /** Medically important domestic sales, thousand kg (= tonnes) */
  medicallyImportantTonnes: number;
  /** Share of medically important among all antimicrobial sales (%) */
  medicallyImportantSharePct: number;
  confidence: Confidence;
};

/** FDA CVM medically important sales path (peak 2015 → 2023). */
export const US_SALES_TREND: UsSalesRow[] = [
  { year: 2015, medicallyImportantTonnes: 9700, medicallyImportantSharePct: 62, confidence: "carried" },
  { year: 2016, medicallyImportantTonnes: 8400, medicallyImportantSharePct: 60, confidence: "carried" },
  { year: 2017, medicallyImportantTonnes: 6100, medicallyImportantSharePct: 58, confidence: "carried" },
  { year: 2018, medicallyImportantTonnes: 6000, medicallyImportantSharePct: 57, confidence: "carried" },
  { year: 2019, medicallyImportantTonnes: 6200, medicallyImportantSharePct: 57, confidence: "carried" },
  { year: 2020, medicallyImportantTonnes: 6000, medicallyImportantSharePct: 56, confidence: "carried" },
  { year: 2021, medicallyImportantTonnes: 6000, medicallyImportantSharePct: 56, confidence: "carried" },
  { year: 2022, medicallyImportantTonnes: 6200, medicallyImportantSharePct: 56, confidence: "disclosed" },
  { year: 2023, medicallyImportantTonnes: 6100, medicallyImportantSharePct: 56, confidence: "disclosed" },
];

export type UsSpeciesShare = {
  species: string;
  sharePct: number;
  confidence: Confidence;
};

/** FDA 2023 medically important sales by major food-animal species. */
export const US_SPECIES_SHARE: UsSpeciesShare[] = [
  { species: "Swine", sharePct: 44, confidence: "disclosed" },
  { species: "Cattle", sharePct: 41, confidence: "disclosed" },
  { species: "Turkey", sharePct: 10, confidence: "disclosed" },
  { species: "Chicken", sharePct: 2, confidence: "disclosed" },
  { species: "Other", sharePct: 3, confidence: "disclosed" },
];

export type ClassShareRow = {
  region: "woah_global" | "us_fda" | "eu_esuavet";
  label: string;
  className: string;
  sharePct: number;
  confidence: Confidence;
};

/** Rough class mix — WOAH 2022 narrative + FDA tetracycline dominance. */
export const CLASS_SHARES: ClassShareRow[] = [
  { region: "woah_global", label: "WOAH global (2022)", className: "Tetracyclines", sharePct: 40, confidence: "carried" },
  { region: "woah_global", label: "WOAH global (2022)", className: "Penicillins", sharePct: 15, confidence: "carried" },
  { region: "woah_global", label: "WOAH global (2022)", className: "Macrolides", sharePct: 8, confidence: "carried" },
  { region: "woah_global", label: "WOAH global (2022)", className: "Other / HPCIA slice", sharePct: 37, confidence: "estimated" },
  { region: "us_fda", label: "US FDA MI (2023)", className: "Tetracyclines", sharePct: 67, confidence: "estimated" },
  { region: "us_fda", label: "US FDA MI (2023)", className: "Penicillins", sharePct: 10, confidence: "estimated" },
  { region: "us_fda", label: "US FDA MI (2023)", className: "Macrolides", sharePct: 9, confidence: "estimated" },
  { region: "us_fda", label: "US FDA MI (2023)", className: "Other MI classes", sharePct: 14, confidence: "estimated" },
];

export type MetricExplainer = {
  id: string;
  metric: string;
  sector: string;
  whatItCounts: string;
  denominator: string;
  trap: string;
};

export const METRIC_EXPLAINERS: MetricExplainer[] = [
  {
    id: "pcu",
    metric: "mg/PCU",
    sector: "Food-producing animals (ESVAC legacy)",
    whatItCounts: "Milligrams of antimicrobial active substance sold",
    denominator: "Population Correction Unit — standardised animal biomass proxy",
    trap: "PCU weights differ from ESUAvet biomass; series break in 2023+",
  },
  {
    id: "mgkg",
    metric: "mg/kg biomass",
    sector: "Animals (WOAH / ESUAvet) or humans (JIACRA)",
    whatItCounts: "Milligrams of active substance",
    denominator: "Estimated live biomass (kg) of the population at risk",
    trap: "Biomass recipes differ by agency; not a clinical dose",
  },
  {
    id: "ddd",
    metric: "DDD / 1 000 inhabitants / day",
    sector: "Humans (ESAC-Net)",
    whatItCounts: "Assumed average maintenance doses consumed",
    denominator: "Human population × time",
    trap: "Cannot be read as tonnes without converting every ATC code to mass",
  },
];

export type DualAxisCountry = {
  id: string;
  label: string;
  animalMgPerKg: number;
  humanDdd: number;
  animalTonnes: number;
};

export const DUAL_AXIS_EU: DualAxisCountry[] = EU_COUNTRY_COMPARE.map((r) => ({
  id: r.id,
  label: r.label,
  animalMgPerKg: r.mgPerKg,
  humanDdd: r.humanDdd,
  animalTonnes: r.tonnes,
}));

export const ANALYTICS = {
  /** Animals below humans on JIACRA biomass metric (EU/EEA 2021) */
  jiacraAnimalBelowHumanPct: Math.round(
    (1 - HEADLINE.jiacraAnimalMgPerKg / HEADLINE.jiacraHumanMgPerKg) * 100,
  ),
  /** Progress toward 50% F2F cut from 2018 reference to 2023 */
  f2fProgressPct: Math.round(
    ((HEADLINE.eu2018RefMgPcu - HEADLINE.eu2023MgPcu) /
      (HEADLINE.eu2018RefMgPcu - HEADLINE.eu2030TargetMgPcu)) *
      100,
  ),
  /** China share of Mulchandani 2020 global tonnes */
  chinaShareOfMulchandaniPct: Math.round(
    (32776 / HEADLINE.mulchandani2020GlobalTonnes) * 100,
  ),
  /** US 2023 vs 2015 peak decline */
  usDeclineFromPeakPct: 37,
};
