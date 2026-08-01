/**
 * US Social Security trust fund projections — SSA 2025 Trustees Report (intermediate assumptions).
 * Table IV.A3 (OASDI), IV.A2 (OASI), IV.A4 (DI). Reserves at beginning of calendar year.
 */

export const SOURCE_NOTE =
  "Social Security Administration, 2025 Annual Trustees Report (released June 18, 2025). Intermediate (best-estimate) assumptions. OASDI figures combine OASI and DI on a hypothetical basis — the funds are legally separate.";

export const SSA_TRUSTEES_URL = "https://www.ssa.gov/oact/TR/2025/";
export const SSA_SUMMARY_URL = "https://www.ssa.gov/oact/TRSUM/tr25summary.pdf";

export type Confidence = "disclosed" | "estimated";
export type FundKey = "combined" | "oasi" | "di";

export type AnnualProjection = {
  year: number;
  reservesBn: number;
  trustFundRatioPct: number;
  netChangeBn: number | null;
  confidence: Confidence;
};

export type DepletionScenario = {
  fund: FundKey;
  label: string;
  depletionYearIntermediate: number | null;
  depletionYearLowCost: number | null;
  depletionYearHighCost: number | null;
  payablePctAtDepletion: number | null;
  priorReportDepletionYear: number | null;
  confidence: Confidence;
};

export const HEADLINE = {
  combinedDepletionYear: 2034,
  priorCombinedDepletionYear: 2035,
  oasiDepletionYear: 2033,
  diDepletedIn75Years: false,
  reservesStart2025Bn: 2721.5,
  reservesStart2034Bn: 214.1,
  combinedPayablePct: 81,
  oasiPayablePct: 77,
  trustFundRatioStart2025Pct: 169,
  trustFundRatio2034Pct: 9,
  actuarialDeficitPctPayroll: 3.82,
  unfundedObligationTn: 25.1,
  decline2024Bn: 67.0,
};

/** Combined OASDI — Table IV.A3 intermediate */
export const OASDI_PROJECTIONS: AnnualProjection[] = [
  { year: 2025, reservesBn: 2721.5, trustFundRatioPct: 169, netChangeBn: -181.4, confidence: "disclosed" },
  { year: 2026, reservesBn: 2540.0, trustFundRatioPct: 149, netChangeBn: -184.6, confidence: "disclosed" },
  { year: 2027, reservesBn: 2355.4, trustFundRatioPct: 131, netChangeBn: -214.7, confidence: "disclosed" },
  { year: 2028, reservesBn: 2140.7, trustFundRatioPct: 113, netChangeBn: -241.6, confidence: "disclosed" },
  { year: 2029, reservesBn: 1899.1, trustFundRatioPct: 95, netChangeBn: -270.1, confidence: "disclosed" },
  { year: 2030, reservesBn: 1629.1, trustFundRatioPct: 78, netChangeBn: -301.6, confidence: "disclosed" },
  { year: 2031, reservesBn: 1327.4, trustFundRatioPct: 60, netChangeBn: -336.2, confidence: "disclosed" },
  { year: 2032, reservesBn: 991.2, trustFundRatioPct: 43, netChangeBn: -372.1, confidence: "disclosed" },
  { year: 2033, reservesBn: 619.2, trustFundRatioPct: 26, netChangeBn: -405.1, confidence: "disclosed" },
  { year: 2034, reservesBn: 214.1, trustFundRatioPct: 9, netChangeBn: null, confidence: "disclosed" },
];

/** OASI alone — Table IV.A2 intermediate */
export const OASI_PROJECTIONS: AnnualProjection[] = [
  { year: 2025, reservesBn: 2538.3, trustFundRatioPct: 176, netChangeBn: -209.3, confidence: "disclosed" },
  { year: 2026, reservesBn: 2329.0, trustFundRatioPct: 153, netChangeBn: -212.8, confidence: "disclosed" },
  { year: 2027, reservesBn: 2116.2, trustFundRatioPct: 132, netChangeBn: -244.7, confidence: "disclosed" },
  { year: 2028, reservesBn: 1871.5, trustFundRatioPct: 110, netChangeBn: -280.4, confidence: "disclosed" },
  { year: 2029, reservesBn: 1591.1, trustFundRatioPct: 89, netChangeBn: -318.2, confidence: "disclosed" },
  { year: 2030, reservesBn: 1272.8, trustFundRatioPct: 67, netChangeBn: -358.9, confidence: "disclosed" },
  { year: 2031, reservesBn: 914.0, trustFundRatioPct: 46, netChangeBn: -399.9, confidence: "disclosed" },
  { year: 2032, reservesBn: 514.0, trustFundRatioPct: 25, netChangeBn: -441.9, confidence: "disclosed" },
  { year: 2033, reservesBn: 72.2, trustFundRatioPct: 3, netChangeBn: null, confidence: "disclosed" },
];

/** DI alone — Table IV.A4 intermediate */
export const DI_PROJECTIONS: AnnualProjection[] = [
  { year: 2025, reservesBn: 183.2, trustFundRatioPct: 106, netChangeBn: 19.4, confidence: "disclosed" },
  { year: 2026, reservesBn: 202.5, trustFundRatioPct: 108, netChangeBn: 5.8, confidence: "disclosed" },
  { year: 2027, reservesBn: 208.4, trustFundRatioPct: 105, netChangeBn: 4.9, confidence: "disclosed" },
  { year: 2028, reservesBn: 213.3, trustFundRatioPct: 105, netChangeBn: 8.8, confidence: "disclosed" },
  { year: 2029, reservesBn: 222.0, trustFundRatioPct: 108, netChangeBn: 12.6, confidence: "disclosed" },
  { year: 2030, reservesBn: 234.6, trustFundRatioPct: 112, netChangeBn: 15.0, confidence: "disclosed" },
  { year: 2031, reservesBn: 249.6, trustFundRatioPct: 115, netChangeBn: 13.8, confidence: "disclosed" },
  { year: 2032, reservesBn: 263.4, trustFundRatioPct: 116, netChangeBn: 11.5, confidence: "disclosed" },
  { year: 2033, reservesBn: 274.9, trustFundRatioPct: 116, netChangeBn: 8.5, confidence: "disclosed" },
  { year: 2034, reservesBn: 283.4, trustFundRatioPct: 116, netChangeBn: 4.5, confidence: "disclosed" },
];

export const DEPLETION_SCENARIOS: DepletionScenario[] = [
  {
    fund: "combined",
    label: "Combined OASDI",
    depletionYearIntermediate: 2034,
    depletionYearLowCost: 2051,
    depletionYearHighCost: 2032,
    payablePctAtDepletion: 81,
    priorReportDepletionYear: 2035,
    confidence: "disclosed",
  },
  {
    fund: "oasi",
    label: "OASI (retirement & survivors)",
    depletionYearIntermediate: 2033,
    depletionYearLowCost: 2036,
    depletionYearHighCost: 2031,
    payablePctAtDepletion: 77,
    priorReportDepletionYear: 2033,
    confidence: "disclosed",
  },
  {
    fund: "di",
    label: "DI (disability)",
    depletionYearIntermediate: null,
    depletionYearLowCost: null,
    depletionYearHighCost: 2044,
    payablePctAtDepletion: 100,
    priorReportDepletionYear: null,
    confidence: "disclosed",
  },
];

/** Benefit payable % after depletion — intermediate path (summary) */
export const PAYABLE_AFTER_DEPLETION = [
  { year: 2034, combinedPct: 81, oasiPct: null as number | null },
  { year: 2040, combinedPct: 79, oasiPct: null },
  { year: 2050, combinedPct: 76, oasiPct: null },
  { year: 2099, combinedPct: 72, oasiPct: null },
];

export const FUND_COLORS: Record<FundKey, string> = {
  combined: "#0ea5e9",
  oasi: "#f59e0b",
  di: "#10b981",
};

export function getProjections(fund: FundKey): AnnualProjection[] {
  if (fund === "oasi") return OASI_PROJECTIONS;
  if (fund === "di") return DI_PROJECTIONS;
  return OASDI_PROJECTIONS;
}

export function fmtTn(bn: number, digits = 2): string {
  return `$${(bn / 1000).toFixed(digits)}T`;
}

export function fmtBn(bn: number, digits = 0): string {
  return `$${bn.toLocaleString("en-US", { maximumFractionDigits: digits })}B`;
}

export const SOURCES = [
  { label: "SSA 2025 Trustees Report", url: SSA_TRUSTEES_URL },
  { label: "2025 Trustees Summary", url: SSA_SUMMARY_URL },
];
