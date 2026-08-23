/**
 * Ransomware payments vs uninsured losses (2026).
 *
 * Core question: What share of reported ransomware economic loss is insured
 * versus paid from operating cash (SIRs, uncovered BI, uninsured victims)?
 *
 * Perimeter: Global on-chain ransom receipts (Chainalysis); U.S. IC3 ransomware
 * complaint losses; U.S. cyber insurance market (NAIC / Aon reading of the
 * Cyber Insurance Supplement); insured-book payout vs total incident cost
 * (NetDiligence Cyber Claims Study 2025); survey recovery costs excluding
 * ransom (Sophos State of Ransomware 2024–2025). Figures mix disclosed
 * regulator / analytics totals with survey means — treat composition shares
 * as estimates unless labeled disclosed.
 *
 * Headline: On insured ransomware books, carrier payouts cover only ~32% of
 * total incident cost; ~68% remains cash-funded (SIR + uncovered residual).
 * SME books recover ~69%; large-company books only ~27%.
 */

export type Confidence = "disclosed" | "estimated" | "modeled";

export const SOURCE_NOTE =
  "On-chain ransom receipts: Chainalysis Crypto Crime / ransomware blogs (2023 peak $1.25B; 2024 initial $813.55M, later revised toward ~$892M; 2025 >$820M provisional). IC3 ransomware adjusted losses and complaint counts: FBI Internet Crime Reports 2020–2024 (explicitly exclude most BI / remediation and undercount field-office-only reports). U.S. cyber DWP and loss ratios: NAIC Cyber Insurance Supplement via Aon 2024 U.S. Cyber Market Update and NAIC 2025 Report on the Cybersecurity Insurance Market (domestic DWP $7.08B in 2024; loss+DCC ratio 49%; total U.S. market incl. alien surplus ~$9.14B). Insured payout vs total incident cost: NetDiligence Cyber Claims Study 2025 (10,402 claims 2020–2024; payouts = 32% of total cost overall, 69% SME, 27% large). Recovery cost excl. ransom and median payments: Sophos State of Ransomware 2024–2025. Cost-stack shares are survey/claims estimates, not a census of every victim.";

export const SOURCES = [
  {
    label: "Chainalysis — Crypto ransomware / victim extortion updates",
    url: "https://www.chainalysis.com/blog/crypto-crime-ransomware-victim-extortion-2025/",
  },
  {
    label: "Chainalysis — Crypto ransomware 2026 Crypto Crime Report",
    url: "https://www.chainalysis.com/blog/crypto-ransomware-2026/",
  },
  {
    label: "FBI IC3 — 2023 Internet Crime Report (PDF)",
    url: "https://www.ic3.gov/AnnualReport/Reports/2023_IC3Report.pdf",
  },
  {
    label: "FBI IC3 — 2024 Internet Crime Report (PDF)",
    url: "https://www.ic3.gov/AnnualReport/Reports/2024_IC3Report.pdf",
  },
  {
    label: "NAIC — Report on the Cybersecurity Insurance Market (2025)",
    url: "https://content.naic.org/sites/default/files/inline-files/2025_Cybersecurity_Insurance%20Report.pdf",
  },
  {
    label: "Aon — 2024 U.S. Cyber Market Update (NAIC supplement reading)",
    url: "https://www.aon.com/getmedia/e8087f7c-d1c0-4d15-af60-f4e3fb72bbe0/2024-US-Cyber-Market-Update.pdf",
  },
  {
    label: "NetDiligence — Cyber Claims Study 2025 Report",
    url: "https://netdiligence.com/wp-content/uploads/2025/09/NetDiligence-Cyber-Claims-Study-2025-Report-.pdf",
  },
  {
    label: "Sophos — State of Ransomware 2025",
    url: "https://assets.sophos.com/X24WTUEQ/at/9brgj5n44hqvgsp5f5bqcps/sophos-state-of-ransomware-2025.pdf",
  },
] as const;

export const HEADLINE = {
  /** NetDiligence: insurer payout / total incident cost, all orgs, 2020–2024 book */
  insuredShareOfIncidentCostPct: 32,
  cashFundedSharePct: 68,
  smeInsuredSharePct: 69,
  largeInsuredSharePct: 27,
  /** Chainalysis peak year on-chain receipts */
  chainalysisPayments2023UsdB: 1.25,
  chainalysisPayments2024UsdM: 813.55,
  /** IC3 ransomware adjusted losses (artificially low by design) */
  ic3Losses2023UsdM: 59.6,
  ic3Losses2024UsdM: 12.5,
  /** Sophos 2025: median ransom paid vs mean recovery excl. ransom */
  sophosMedianRansom2025UsdM: 1.0,
  sophosRecoveryExRansom2025UsdM: 1.53,
  /** Implied cash-heavy stack when both apply (paying victims) */
  ransomShareOfPayingVictimStackPct: 39.5,
  recoveryShareOfPayingVictimStackPct: 60.5,
  confidence: "disclosed" as Confidence,
};

/** Annual meters: on-chain payments vs IC3 reported ransomware losses */
export type MeterYearRow = {
  year: number;
  chainalysisPaymentsUsdM: number | null;
  ic3LossesUsdM: number | null;
  ic3Complaints: number | null;
  confidence: Confidence;
};

export const ANNUAL_METERS: MeterYearRow[] = [
  {
    year: 2020,
    chainalysisPaymentsUsdM: 416,
    ic3LossesUsdM: 29.1,
    ic3Complaints: 2474,
    confidence: "estimated",
  },
  {
    year: 2021,
    chainalysisPaymentsUsdM: 765,
    ic3LossesUsdM: 49.2,
    ic3Complaints: 3729,
    confidence: "estimated",
  },
  {
    year: 2022,
    chainalysisPaymentsUsdM: 457,
    ic3LossesUsdM: 34.3,
    ic3Complaints: 2385,
    confidence: "estimated",
  },
  {
    year: 2023,
    chainalysisPaymentsUsdM: 1250,
    ic3LossesUsdM: 59.6,
    ic3Complaints: 2825,
    confidence: "disclosed",
  },
  {
    year: 2024,
    chainalysisPaymentsUsdM: 813.55,
    ic3LossesUsdM: 12.5,
    ic3Complaints: 3156,
    confidence: "disclosed",
  },
  {
    year: 2025,
    chainalysisPaymentsUsdM: 820,
    ic3LossesUsdM: null,
    ic3Complaints: null,
    confidence: "estimated",
  },
];

/** NetDiligence insured payout vs total incident cost by size band */
export type InsuredShareRow = {
  band: string;
  short: string;
  insuredPayoutSharePct: number;
  cashResidualSharePct: number;
  note: string;
  confidence: Confidence;
};

export const INSURED_SHARE_BANDS: InsuredShareRow[] = [
  {
    band: "All organizations (NetDiligence book)",
    short: "All orgs",
    insuredPayoutSharePct: 32,
    cashResidualSharePct: 68,
    note: "Carrier payout / total incident cost incl. SIR & uncovered",
    confidence: "disclosed",
  },
  {
    band: "SMEs (<$2B revenue)",
    short: "SMEs",
    insuredPayoutSharePct: 69,
    cashResidualSharePct: 31,
    note: "98% of claims; ~49% of aggregate incident dollars",
    confidence: "disclosed",
  },
  {
    band: "Large companies (≥$2B revenue)",
    short: "Large",
    insuredPayoutSharePct: 27,
    cashResidualSharePct: 73,
    note: "2% of claims; ~51% of aggregate incident dollars",
    confidence: "disclosed",
  },
];

/** Cost stack for a typical paying victim (Sophos 2025 means/medians) */
export type CostStackSlice = {
  id: string;
  label: string;
  usdM: number;
  sharePct: number;
  fundingHint: string;
  confidence: Confidence;
};

export const PAYING_VICTIM_STACK_2025: CostStackSlice[] = [
  {
    id: "ransom",
    label: "Median ransom paid",
    usdM: 1.0,
    sharePct: 39.5,
    fundingHint: "Often extortion sublimit; may be cash if denied/excluded",
    confidence: "disclosed",
  },
  {
    id: "recovery",
    label: "Mean recovery excl. ransom",
    usdM: 1.53,
    sharePct: 60.5,
    fundingHint: "BI, forensics, rebuild — frequently exceeds insurance recoveries",
    confidence: "disclosed",
  },
];

export type CostStackYear = {
  year: number;
  medianRansomUsdM: number;
  recoveryExRansomUsdM: number;
  ransomSharePct: number;
  confidence: Confidence;
};

export const SOPHOS_STACK_PATH: CostStackYear[] = [
  {
    year: 2023,
    medianRansomUsdM: 1.5,
    recoveryExRansomUsdM: 1.82,
    ransomSharePct: 45.2,
    confidence: "estimated",
  },
  {
    year: 2024,
    medianRansomUsdM: 2.0,
    recoveryExRansomUsdM: 2.73,
    ransomSharePct: 42.3,
    confidence: "disclosed",
  },
  {
    year: 2025,
    medianRansomUsdM: 1.0,
    recoveryExRansomUsdM: 1.53,
    ransomSharePct: 39.5,
    confidence: "disclosed",
  },
];

/** U.S. cyber insurance capacity vs claim pressure (NAIC / Aon) */
export type NaicYearRow = {
  year: number;
  domesticDwpUsdB: number;
  totalUsDwpUsdB: number | null;
  lossRatioPct: number | null;
  claimsApprox: number | null;
  confidence: Confidence;
};

export const NAIC_CYBER_MARKET: NaicYearRow[] = [
  {
    year: 2020,
    domesticDwpUsdB: 2.68,
    totalUsDwpUsdB: 3.0,
    lossRatioPct: null,
    claimsApprox: null,
    confidence: "estimated",
  },
  {
    year: 2021,
    domesticDwpUsdB: 4.0,
    totalUsDwpUsdB: 4.8,
    lossRatioPct: null,
    claimsApprox: null,
    confidence: "estimated",
  },
  {
    year: 2022,
    domesticDwpUsdB: 7.22,
    totalUsDwpUsdB: 7.2,
    lossRatioPct: null,
    claimsApprox: null,
    confidence: "estimated",
  },
  {
    year: 2023,
    domesticDwpUsdB: 7.25,
    totalUsDwpUsdB: 9.84,
    lossRatioPct: 42,
    claimsApprox: 36000,
    confidence: "disclosed",
  },
  {
    year: 2024,
    domesticDwpUsdB: 7.08,
    totalUsDwpUsdB: 9.14,
    lossRatioPct: 49,
    claimsApprox: 50000,
    confidence: "disclosed",
  },
];

/** Funding mix illustration for a ransomware incident dollar */
export type FundingMixRow = {
  channel: string;
  short: string;
  sharePct: number;
  definition: string;
  confidence: Confidence;
};

export const FUNDING_MIX_ILLUSTRATION: FundingMixRow[] = [
  {
    channel: "Cyber insurer payout",
    short: "Insured",
    sharePct: 32,
    definition: "NetDiligence all-org payout / total incident cost",
    confidence: "disclosed",
  },
  {
    channel: "Self-insured retention + uncovered residual",
    short: "Cash / SIR",
    sharePct: 68,
    definition: "Deductible/SIR plus excluded BI, sublimit gaps, soft costs",
    confidence: "disclosed",
  },
];

/** IC3 vs Chainalysis gap (underreporting illustration) */
export type ReportingGapRow = {
  year: number;
  chainalysisUsdM: number;
  ic3UsdM: number;
  gapMultiple: number;
  confidence: Confidence;
};

export const REPORTING_GAP: ReportingGapRow[] = ANNUAL_METERS.filter(
  (r): r is MeterYearRow & { chainalysisPaymentsUsdM: number; ic3LossesUsdM: number } =>
    r.chainalysisPaymentsUsdM != null && r.ic3LossesUsdM != null,
).map((r) => ({
  year: r.year,
  chainalysisUsdM: r.chainalysisPaymentsUsdM,
  ic3UsdM: r.ic3LossesUsdM,
  gapMultiple: Number((r.chainalysisPaymentsUsdM / r.ic3LossesUsdM).toFixed(1)),
  confidence: r.confidence,
}));

/** Scatter: firm size proxy vs insured share (band endpoints + mid) */
export type SizeSharePoint = {
  label: string;
  revenueProxyUsdB: number;
  insuredSharePct: number;
  claimWeightPct: number;
  confidence: Confidence;
};

export const SIZE_SHARE_SCATTER: SizeSharePoint[] = [
  {
    label: "SME book",
    revenueProxyUsdB: 0.11,
    insuredSharePct: 69,
    claimWeightPct: 98,
    confidence: "disclosed",
  },
  {
    label: "All-org blend",
    revenueProxyUsdB: 0.35,
    insuredSharePct: 32,
    claimWeightPct: 100,
    confidence: "modeled",
  },
  {
    label: "Large-company book",
    revenueProxyUsdB: 12.5,
    insuredSharePct: 27,
    claimWeightPct: 2,
    confidence: "disclosed",
  },
];

/** Sector-ish cost pressure cues (NetDiligence / industry notes) */
export type SectorPressureRow = {
  sector: string;
  short: string;
  biHeavy: boolean;
  relativeSeverity: number;
  note: string;
  confidence: Confidence;
};

export const SECTOR_PRESSURE: SectorPressureRow[] = [
  {
    sector: "Healthcare",
    short: "Health",
    biHeavy: true,
    relativeSeverity: 1.35,
    note: "Low downtime tolerance; BI dominates cash residual",
    confidence: "estimated",
  },
  {
    sector: "Manufacturing",
    short: "Mfg",
    biHeavy: true,
    relativeSeverity: 1.4,
    note: "OT interruption + large outlier BI claims in study years",
    confidence: "estimated",
  },
  {
    sector: "Financial services",
    short: "Fin",
    biHeavy: false,
    relativeSeverity: 1.05,
    note: "BEC + ransomware mix; higher control maturity on avg",
    confidence: "estimated",
  },
  {
    sector: "Retail / hospitality",
    short: "Retail",
    biHeavy: true,
    relativeSeverity: 1.1,
    note: "Payment friction + brand costs often outside limits",
    confidence: "estimated",
  },
  {
    sector: "Construction",
    short: "Const",
    biHeavy: false,
    relativeSeverity: 0.75,
    note: "Lower average incident cost; ransomware still top cause",
    confidence: "estimated",
  },
  {
    sector: "Public entities",
    short: "Public",
    biHeavy: true,
    relativeSeverity: 0.95,
    note: "Budget cash constraints; recovery slow even when insured",
    confidence: "estimated",
  },
];

export const ANALYTICS = {
  insuredShareOfIncidentCostPct: HEADLINE.insuredShareOfIncidentCostPct,
  cashFundedSharePct: HEADLINE.cashFundedSharePct,
  smeVsLargeInsuredGapPp: HEADLINE.smeInsuredSharePct - HEADLINE.largeInsuredSharePct,
  chainalysisPeakUsdB: HEADLINE.chainalysisPayments2023UsdB,
  ic3VsChainalysis2023Multiple: Number(
    (HEADLINE.chainalysisPayments2023UsdB * 1000 / HEADLINE.ic3Losses2023UsdM).toFixed(1),
  ),
  naicDomesticDwp2024UsdB: 7.08,
  naicLossRatio2024Pct: 49,
  recoveryDominatesPayingStack: true,
  meterYears: ANNUAL_METERS.length,
  bandCount: INSURED_SHARE_BANDS.length,
};
