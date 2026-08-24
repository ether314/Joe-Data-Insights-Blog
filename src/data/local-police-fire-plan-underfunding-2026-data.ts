/**
 * Local police/fire plan underfunding vs state teacher/employee plans (2026 desk).
 *
 * Core question: Are local public-safety plans systematically worse funded than
 * state teacher / employee plans?
 *
 * Primary anchors: Equable Institute State of Pensions 2025 (FY 2024 reported
 * type splits + plan rankings); Equable State of Pensions 2024 (FY 2023 type
 * splits for path); Boston College CRR Public Plans Database / SLP series for
 * local-vs-state structure; Pew Charitable Trusts state pension funding-gap
 * briefs for contribution-policy context.
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export type PlanCohort =
  | "muni-public-safety"
  | "state-public-safety"
  | "teacher"
  | "state-employee"
  | "muni-civilian";

export type AdminLevel = "municipal" | "statewide";

export const SOURCE_NOTE =
  "Liability-weighted funded ratios and unfunded liabilities by plan type are Equable Institute State of Pensions 2025 (FY 2024 reported market-valued assets / total pension liability) for classifiable statewide and municipally managed systems with ≥$1B liabilities. FY 2023 type splits are Equable State of Pensions 2024. Equal-weight medians and left-tail shares use a desk sample of large plans with disclosed Equable rankings / CAFRs — not a census of all local police/fire trusts. Teacher cohort follows Equable’s standalone teacher / school-employee definition (excludes blended statewide systems such as Florida). Public-safety cohort includes police-only, firefighter-only, and combined public-safety plans valued separately. CRR Public Plans Database and Pew funding-gap briefs supply structural and contribution context, not the FY 2024 type averages.";

export const SOURCES = [
  {
    label: "Equable — State of Pensions 2025",
    url: "https://equable.org/wp-content/uploads/2026/05/Equable-Institute_State-of-Pensions-2025_Final.pdf",
  },
  {
    label: "Equable — State of Pensions 2024",
    url: "https://equable.org/wp-content/uploads/2024/07/Equable-Institute_State-of-Pensions-2024_FINAL.pdf",
  },
  {
    label: "Equable — Pension plan funded ratio rankings 2025",
    url: "https://equable.org/news/pension-plan-funded-ratio-rankings-2025/",
  },
  {
    label: "Boston College CRR — The Funded Status of Local Pensions (SLP 58)",
    url: "https://crr.bc.edu/wp-content/uploads/2018/01/slp58.pdf",
  },
  {
    label: "Boston College CRR — An Introduction to Police and Fire Pensions (SLP 69)",
    url: "https://crr.bc.edu/wp-content/uploads/2020/02/SLP69.pdf",
  },
  {
    label: "Public Plans Database (CRR / MissionSquare / NASRA / GFOA)",
    url: "https://publicplansdata.org/",
  },
  {
    label: "Pew Charitable Trusts — The State Pension Funding Gap",
    url: "https://www.pew.org/en/research-and-analysis/issue-briefs/2019/06/the-state-pension-funding-gap-2017",
  },
] as const;

/** Headline punchline — median / weighted gaps */
export const HEADLINE = {
  /** Equable FY 2024 liability-weighted funded % — municipally managed public safety */
  muniPsWeightedPct: 76.7,
  /** Equable FY 2024 — statewide public safety only */
  statePsWeightedPct: 82.1,
  /** Equable FY 2024 — teacher / school-employee systems */
  teacherWeightedPct: 76.4,
  /** Equable FY 2024 — state-employee-only systems */
  stateEmployeeWeightedPct: 65.7,
  /** Weighted gap: muni PS − teachers (pp); positive = PS better funded */
  weightedGapMuniPsVsTeacherPp: 0.3,
  /** Weighted gap: statewide PS − teachers (pp) */
  weightedGapStatePsVsTeacherPp: 5.7,
  /** Weighted gap: muni PS − state employees (pp) */
  weightedGapMuniPsVsStateEmpPp: 11.0,
  /** Desk equal-weight median: combined public-safety sample (muni + state) */
  samplePsMedianPct: 92.0,
  /** Desk equal-weight median: teacher sample */
  sampleTeacherMedianPct: 62.0,
  /** Median gap: PS − teachers (pp); positive = PS better */
  medianGapPsVsTeacherPp: 30.0,
  /** Share of sample muni PS plans below 60% funded */
  muniPsDistressedSharePct: 44.4,
  /** Share of sample teacher plans below 60% funded */
  teacherDistressedSharePct: 41.7,
  /** Equable FY 2024 UAAL $B — teachers */
  teacherUaalB: 578.8,
  /** Equable FY 2024 UAAL $B — muni public safety */
  muniPsUaalB: 43.9,
  /** Equable FY 2024 UAAL $B — statewide public safety */
  statePsUaalB: 55.7,
  /** Equable FY 2024 plan counts */
  teacherPlanCount: 51,
  statePsPlanCount: 42,
  muniPsPlanCount: 22,
  stateEmployeePlanCount: 22,
  /** Chicago Firefighters FY 2024 funded % (local left tail) */
  chicagoFireFundedPct: 23.7,
  /** LA Fire and Police FY 2024 funded % (local right tail) */
  laFirePoliceFundedPct: 101.0,
} as const;

export type TypeSplitRow = {
  id: string;
  label: string;
  cohort: PlanCohort;
  admin: AdminLevel | "mixed";
  year: 2023 | 2024;
  planCount: number;
  uaalB: number;
  fundedPct: number;
  confidence: Confidence;
};

/** Equable liability-weighted type splits (SOP 2024 = FY 2023; SOP 2025 = FY 2024). */
export const TYPE_SPLITS: TypeSplitRow[] = [
  {
    id: "teacher-2023",
    label: "Teachers / school employees",
    cohort: "teacher",
    admin: "mixed",
    year: 2023,
    planCount: 51,
    uaalB: 633.2,
    fundedPct: 73.1,
    confidence: "disclosed",
  },
  {
    id: "state-ps-2023",
    label: "Statewide public safety",
    cohort: "state-public-safety",
    admin: "statewide",
    year: 2023,
    planCount: 41,
    uaalB: 57.5,
    fundedPct: 75.3,
    confidence: "disclosed",
  },
  {
    id: "muni-ps-2023",
    label: "Municipal public safety",
    cohort: "muni-public-safety",
    admin: "municipal",
    year: 2023,
    planCount: 20,
    uaalB: 43.0,
    fundedPct: 75.3,
    confidence: "disclosed",
  },
  {
    id: "state-emp-2023",
    label: "State employees only",
    cohort: "state-employee",
    admin: "statewide",
    year: 2023,
    planCount: 20,
    uaalB: 187.7,
    fundedPct: 63.3,
    confidence: "disclosed",
  },
  {
    id: "muni-civ-2023",
    label: "Municipal civilian",
    cohort: "muni-civilian",
    admin: "municipal",
    year: 2023,
    planCount: 46,
    uaalB: 129.6,
    fundedPct: 76.6,
    confidence: "disclosed",
  },
  {
    id: "teacher-2024",
    label: "Teachers / school employees",
    cohort: "teacher",
    admin: "mixed",
    year: 2024,
    planCount: 51,
    uaalB: 578.8,
    fundedPct: 76.4,
    confidence: "disclosed",
  },
  {
    id: "state-ps-2024",
    label: "Statewide public safety",
    cohort: "state-public-safety",
    admin: "statewide",
    year: 2024,
    planCount: 42,
    uaalB: 55.7,
    fundedPct: 82.1,
    confidence: "disclosed",
  },
  {
    id: "muni-ps-2024",
    label: "Municipal public safety",
    cohort: "muni-public-safety",
    admin: "municipal",
    year: 2024,
    planCount: 22,
    uaalB: 43.9,
    fundedPct: 76.7,
    confidence: "disclosed",
  },
  {
    id: "state-emp-2024",
    label: "State employees only",
    cohort: "state-employee",
    admin: "statewide",
    year: 2024,
    planCount: 22,
    uaalB: 182.5,
    fundedPct: 65.7,
    confidence: "disclosed",
  },
  {
    id: "muni-civ-2024",
    label: "Municipal civilian",
    cohort: "muni-civilian",
    admin: "municipal",
    year: 2024,
    planCount: 49,
    uaalB: 124.9,
    fundedPct: 78.6,
    confidence: "disclosed",
  },
  {
    id: "state-muni-civ-2024",
    label: "Statewide municipal civilian",
    cohort: "muni-civilian",
    admin: "statewide",
    year: 2024,
    planCount: 21,
    uaalB: 51.7,
    fundedPct: 86.2,
    confidence: "disclosed",
  },
];

export type PlanRow = {
  id: string;
  label: string;
  cityOrState: string;
  cohort: PlanCohort;
  admin: AdminLevel;
  fundedPct: number;
  /** Approximate accrued liabilities $B when disclosed; else null */
  liabilitiesB: number | null;
  band: "resilient" | "fragile" | "distressed";
  confidence: Confidence;
};

function bandOf(fundedPct: number): PlanRow["band"] {
  if (fundedPct >= 90) return "resilient";
  if (fundedPct >= 60) return "fragile";
  return "distressed";
}

/**
 * Desk sample of large plans with Equable SOP 2025 (FY 2024) disclosed rankings
 * or closely adjacent CAFR/AV figures. Equal-weight medians answer the brief’s
 * median-gap question; liability-weighted Equable type splits answer the
 * aggregate question.
 */
export const PLAN_SAMPLE: PlanRow[] = (
  [
    // Municipal public safety
    ["la-fp", "Los Angeles Fire and Police", "Los Angeles", "muni-public-safety", "municipal", 101.0, 28.0],
    ["houston-ff", "Houston Firefighters", "Houston", "muni-public-safety", "municipal", 100.0, 5.5],
    ["houston-pd", "Houston Police", "Houston", "muni-public-safety", "municipal", 95.4, 8.0],
    ["wichita-pf", "Wichita Police and Fire", "Wichita", "muni-public-safety", "municipal", 92.0, 1.2],
    ["detroit-pf1", "Detroit Police & Fire Plan 1", "Detroit", "muni-public-safety", "municipal", 107.1, 3.5],
    ["jax-pf", "Jacksonville Police & Fire", "Jacksonville", "muni-public-safety", "municipal", 47.2, 4.0],
    ["dallas-pf", "Dallas Police and Firefighters", "Dallas", "muni-public-safety", "municipal", 36.7, 6.5],
    ["chicago-pd", "Chicago Police", "Chicago", "muni-public-safety", "municipal", 28.5, 18.0],
    ["chicago-ff", "Chicago Firefighters", "Chicago", "muni-public-safety", "municipal", 23.7, 6.0],
    // Statewide public safety
    ["dc-pf", "DC Police & Fire", "District of Columbia", "state-public-safety", "statewide", 115.2, 5.0],
    ["utah-ff", "Utah Firefighters", "Utah", "state-public-safety", "statewide", 110.9, 1.5],
    ["tx-lecos", "Texas Law Enforcement (LECOS)", "Texas", "state-public-safety", "statewide", 106.2, 2.0],
    ["nj-sprs", "New Jersey State Police", "New Jersey", "state-public-safety", "statewide", 51.1, 4.5],
    ["ohio-pf", "Ohio Police & Fire", "Ohio", "state-public-safety", "statewide", 70.0, 22.0],
    ["colo-fppa", "Colorado Fire and Police (FPPA)", "Colorado", "state-public-safety", "statewide", 88.0, 8.0],
    // Teachers
    ["tn-tchr", "Tennessee Teacher Plans", "Tennessee", "teacher", "statewide", 104.5, 18.0],
    ["il-trs", "Illinois Teachers (TRS)", "Illinois", "teacher", "statewide", 45.4, 150.0],
    ["nj-tpaf", "New Jersey Teachers (TPAF)", "New Jersey", "teacher", "statewide", 38.0, 90.0],
    ["chi-tchr", "Chicago Teachers", "Chicago", "teacher", "municipal", 44.6, 35.0],
    ["la-trs", "Louisiana Teachers", "Louisiana", "teacher", "statewide", 48.0, 25.0],
    ["ky-trs", "Kentucky Teachers (TRS)", "Kentucky", "teacher", "statewide", 58.0, 35.0],
    ["tx-trs", "Texas Teachers (TRS)", "Texas", "teacher", "statewide", 72.0, 280.0],
    ["pa-psers", "Pennsylvania PSERS", "Pennsylvania", "teacher", "statewide", 64.0, 110.0],
    ["calstrs", "California Teachers (CalSTRS)", "California", "teacher", "statewide", 87.0, 350.0],
    ["oh-strs", "Ohio State Teachers (STRS)", "Ohio", "teacher", "statewide", 82.0, 100.0],
    ["ga-trs", "Georgia Teachers (TRS)", "Georgia", "teacher", "statewide", 80.0, 110.0],
    ["ct-trs", "Connecticut Teachers", "Connecticut", "teacher", "statewide", 60.0, 40.0],
    // State employees (comparison arm)
    ["il-sers", "Illinois State Employees", "Illinois", "state-employee", "statewide", 43.0, 55.0],
    ["nj-pers-s", "New Jersey PERS (state)", "New Jersey", "state-employee", "statewide", 48.4, 40.0],
    ["ky-ers-nh", "Kentucky ERS Non-Hazardous", "Kentucky", "state-employee", "statewide", 31.2, 20.0],
    ["tx-ers", "Texas Employees (ERS)", "Texas", "state-employee", "statewide", 72.8, 45.0],
    ["hi-ers", "Hawaii ERS", "Hawaii", "state-employee", "statewide", 63.0, 22.0],
  ] as const
).map(([id, label, cityOrState, cohort, admin, fundedPct, liabilitiesB]) => ({
  id,
  label,
  cityOrState,
  cohort,
  admin,
  fundedPct,
  liabilitiesB,
  band: bandOf(fundedPct),
  confidence:
    fundedPct === 70.0 || fundedPct === 88.0 || fundedPct === 72.0 || fundedPct === 64.0 || fundedPct === 87.0 || fundedPct === 82.0 || fundedPct === 80.0 || fundedPct === 60.0 || fundedPct === 58.0 || fundedPct === 43.0 || fundedPct === 63.0
      ? ("estimated" as const)
      : ("disclosed" as const),
}));

export type GapPathRow = {
  year: number;
  muniPsPct: number;
  statePsPct: number;
  teacherPct: number;
  stateEmpPct: number;
  confidence: Confidence;
};

/** Two-point Equable path + desk interpolation marker for viz. */
export const WEIGHTED_GAP_PATH: GapPathRow[] = [
  {
    year: 2023,
    muniPsPct: 75.3,
    statePsPct: 75.3,
    teacherPct: 73.1,
    stateEmpPct: 63.3,
    confidence: "disclosed",
  },
  {
    year: 2024,
    muniPsPct: 76.7,
    statePsPct: 82.1,
    teacherPct: 76.4,
    stateEmpPct: 65.7,
    confidence: "disclosed",
  },
];

export type DistBin = {
  id: string;
  label: string;
  minPct: number;
  maxPct: number;
};

export const FUNDED_BINS: DistBin[] = [
  { id: "lt60", label: "<60%", minPct: 0, maxPct: 60 },
  { id: "60-75", label: "60–75%", minPct: 60, maxPct: 75 },
  { id: "75-90", label: "75–90%", minPct: 75, maxPct: 90 },
  { id: "ge90", label: "≥90%", minPct: 90, maxPct: 200 },
];

export function plansByCohort(cohort: PlanCohort | "all-public-safety" | "all"): PlanRow[] {
  if (cohort === "all") return PLAN_SAMPLE;
  if (cohort === "all-public-safety") {
    return PLAN_SAMPLE.filter(
      (p) =>
        p.cohort === "muni-public-safety" || p.cohort === "state-public-safety",
    );
  }
  return PLAN_SAMPLE.filter((p) => p.cohort === cohort);
}

export function medianFunded(rows: PlanRow[]): number {
  if (rows.length === 0) return 0;
  const sorted = [...rows].map((r) => r.fundedPct).sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return Math.round(((sorted[mid - 1]! + sorted[mid]!) / 2) * 10) / 10;
  }
  return sorted[mid]!;
}

export function binCounts(rows: PlanRow[]): { bin: string; label: string; count: number; sharePct: number }[] {
  const n = rows.length || 1;
  return FUNDED_BINS.map((b) => {
    const count = rows.filter(
      (r) => r.fundedPct >= b.minPct && r.fundedPct < b.maxPct,
    ).length;
    return {
      bin: b.id,
      label: b.label,
      count,
      sharePct: Math.round((count / n) * 1000) / 10,
    };
  });
}

export function typeSplitsForYear(year: 2023 | 2024): TypeSplitRow[] {
  return TYPE_SPLITS.filter((r) => r.year === year);
}

export function weightedGapBars(year: 2023 | 2024) {
  const rows = typeSplitsForYear(year);
  const teacher = rows.find((r) => r.cohort === "teacher")?.fundedPct ?? 0;
  return rows
    .filter((r) => r.cohort !== "teacher")
    .map((r) => ({
      id: r.id,
      label: r.label,
      fundedPct: r.fundedPct,
      gapVsTeacherPp: Math.round((r.fundedPct - teacher) * 10) / 10,
      uaalB: r.uaalB,
      planCount: r.planCount,
      cohort: r.cohort,
    }));
}

export function scatterPoints(cohort: PlanCohort | "all-public-safety" | "all") {
  return plansByCohort(cohort)
    .filter((p) => p.liabilitiesB != null && p.liabilitiesB > 0)
    .map((p) => ({
      id: p.id,
      label: p.label,
      fundedPct: p.fundedPct,
      liabilitiesB: p.liabilitiesB as number,
      cohort: p.cohort,
      admin: p.admin,
      band: p.band,
    }));
}

export function cohortMedianLadder() {
  const cohorts: { id: PlanCohort | "all-public-safety"; label: string }[] = [
    { id: "all-public-safety", label: "Public safety (sample)" },
    { id: "muni-public-safety", label: "Muni public safety" },
    { id: "state-public-safety", label: "State public safety" },
    { id: "teacher", label: "Teachers" },
    { id: "state-employee", label: "State employees" },
  ];
  return cohorts.map((c) => {
    const rows = plansByCohort(c.id);
    return {
      id: c.id,
      label: c.label,
      medianPct: medianFunded(rows),
      n: rows.length,
      distressedSharePct:
        Math.round(
          (rows.filter((r) => r.band === "distressed").length / (rows.length || 1)) *
            1000,
        ) / 10,
    };
  });
}

export function fmt1(n: number): string {
  return n.toFixed(1);
}

export function fmtPct(n: number): string {
  return `${n.toFixed(1)}%`;
}

export function fmtB(n: number): string {
  return `$${n.toFixed(1)}B`;
}

export function fmtPp(n: number): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(1)} pp`;
}
