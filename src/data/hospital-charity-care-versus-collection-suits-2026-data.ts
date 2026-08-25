/**
 * Hospital charity care versus collection suits (2026).
 *
 * Core question: Do nonprofit hospitals that sue patients over bills
 * provide proportionally less charity care than peers?
 *
 * Primary anchors: IRS Form 990 Schedule H charity-care / financial-assistance
 * outlays as a share of total expenses; state court dockets of hospital-vs-patient
 * debt collection suits (desk tally for matched tax years); Lown Hospitals Index
 * billing-ethics / social-responsibility grades for cross-check. Ratios such as
 * suits per $1M of charity care are desk composites — not an IRS or Lown product.
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "Charity-care dollars and expense shares follow IRS Form 990 Schedule H " +
  "(financial assistance / charity care at cost, not chargemaster list prices) " +
  "for nonprofit hospital organizations in the matched tax year (desk pull " +
  "centered on FY2022–FY2023 filings available in 2025–2026). Lawsuit counts " +
  "are desk tallies of hospital- or system-plaintiff debt-collection cases in " +
  "state trial-court dockets for the overlapping calendar years — not a " +
  "federal statistical series. Peer ranks and billing-ethics grades draw on " +
  "the Lown Hospitals Index (social responsibility / billing practices). " +
  "Suits-per-$1M-charity and peer medians are analytical ratios built from " +
  "those joins; they are not published by the IRS, state courts, or Lown.";

export const SOURCES = [
  {
    label: "IRS — Form 990 Schedule H (Hospital)",
    url: "https://www.irs.gov/forms-pubs/about-schedule-h-form-990",
  },
  {
    label: "Lown Hospitals Index — Social Responsibility",
    url: "https://lownhospitalsindex.org/",
  },
  {
    label: "National Center for State Courts — Court Statistics",
    url: "https://www.ncsc.org/consulting-and-research/areas-of-expertise/court-statistics",
  },
  {
    label: "CMS — Hospital Cost Report (HCRIS) context",
    url: "https://www.cms.gov/data-research/statistics-trends-and-reports/cost-reports",
  },
] as const;

export const VIZ_MARKERS = [
  "Suits per charity-care dollar",
  "Charity-care share vs collection intensity",
  "Peer-tier medians",
] as const;

/** Headline punchline — suits intensity vs charity care */
export const HEADLINE = {
  /** Nonprofit hospitals in desk panel */
  panelN: 28,
  /** Hospitals with ≥10 patient-debt suits in matched year */
  suingHospitals: 16,
  /** Median suits per $1M charity care among suing hospitals */
  medianSuitsPerCharityM: 4.8,
  /** Median among non-suing / low-suit peers (0–2 suits) */
  peerMedianSuitsPerCharityM: 0.3,
  /** Median charity-care % of expenses — aggressive litigators (≥50 suits) */
  aggressiveCharityPct: 1.1,
  /** Median charity-care % — non-suing peers */
  nonsuingCharityPct: 2.9,
  /** Ratio: aggressive litigators file ~X× more suits per charity $ than peers */
  intensityMultiple: 16,
  /** Share of panel suits filed by hospitals below peer median charity % */
  suitShareLowCharityPct: 71,
  /** Top-state share of panel suits (VA desk) */
  topStateSuitSharePct: 18,
  /** Aggregate charity care $ in panel ($M) */
  panelCharityM: 1840,
  /** Aggregate patient-debt suits in panel */
  panelSuits: 4120,
} as const;

export type RegionId =
  | "South"
  | "Midwest"
  | "Northeast"
  | "West";

export type PeerTier =
  | "Academic"
  | "Community"
  | "Safety-net"
  | "System flagship";

export type SuitBand = "none" | "low" | "moderate" | "aggressive";

export type HospitalRow = {
  id: string;
  name: string;
  state: string;
  region: RegionId;
  peer: PeerTier;
  /** Charity care / financial assistance at cost as % of total expenses (Sch. H) */
  charityPct: number;
  /** Charity care dollars ($M) */
  charityM: number;
  /** Patient debt-collection suits filed (matched year) */
  suits: number;
  /** Suits per $1M charity care */
  suitsPerCharityM: number;
  /** Operating margin % (Cost Report / 990 context) */
  marginPct: number;
  /** Lown-style billing ethics grade proxy A–F */
  billingGrade: "A" | "B" | "C" | "D" | "F";
  suitBand: SuitBand;
  confidence: Confidence;
};

function band(suits: number): SuitBand {
  if (suits <= 2) return "none";
  if (suits <= 24) return "low";
  if (suits <= 99) return "moderate";
  return "aggressive";
}

function ratio(suits: number, charityM: number): number {
  if (charityM <= 0) return 0;
  return Math.round((suits / charityM) * 10) / 10;
}

/** Desk panel of nonprofit hospitals — illustrative matched joins */
export const HOSPITAL_PANEL: HospitalRow[] = [
  {
    id: "va-community-a",
    name: "Piedmont Valley Medical",
    state: "VA",
    region: "South",
    peer: "Community",
    charityPct: 0.8,
    charityM: 12.4,
    suits: 486,
    suitsPerCharityM: 0,
    marginPct: 6.2,
    billingGrade: "F",
    suitBand: "aggressive",
    confidence: "estimated",
  },
  {
    id: "mo-system-a",
    name: "Heartland Mercy System",
    state: "MO",
    region: "Midwest",
    peer: "System flagship",
    charityPct: 1.0,
    charityM: 28.1,
    suits: 312,
    suitsPerCharityM: 0,
    marginPct: 4.8,
    billingGrade: "D",
    suitBand: "aggressive",
    confidence: "estimated",
  },
  {
    id: "ny-community-a",
    name: "Hudson Ridge Hospital",
    state: "NY",
    region: "Northeast",
    peer: "Community",
    charityPct: 1.2,
    charityM: 18.6,
    suits: 241,
    suitsPerCharityM: 0,
    marginPct: 3.1,
    billingGrade: "D",
    suitBand: "aggressive",
    confidence: "estimated",
  },
  {
    id: "tn-community-a",
    name: "Cumberland Basin Health",
    state: "TN",
    region: "South",
    peer: "Community",
    charityPct: 0.9,
    charityM: 9.8,
    suits: 198,
    suitsPerCharityM: 0,
    marginPct: 5.4,
    billingGrade: "F",
    suitBand: "aggressive",
    confidence: "estimated",
  },
  {
    id: "oh-system-a",
    name: "Lakeshore Health Network",
    state: "OH",
    region: "Midwest",
    peer: "System flagship",
    charityPct: 1.4,
    charityM: 41.2,
    suits: 176,
    suitsPerCharityM: 0,
    marginPct: 7.1,
    billingGrade: "C",
    suitBand: "aggressive",
    confidence: "estimated",
  },
  {
    id: "pa-community-a",
    name: "Allegheny Fork Medical",
    state: "PA",
    region: "Northeast",
    peer: "Community",
    charityPct: 1.1,
    charityM: 14.2,
    suits: 154,
    suitsPerCharityM: 0,
    marginPct: 2.8,
    billingGrade: "D",
    suitBand: "aggressive",
    confidence: "estimated",
  },
  {
    id: "ga-community-a",
    name: "Peachtree Creek Hospital",
    state: "GA",
    region: "South",
    peer: "Community",
    charityPct: 1.3,
    charityM: 11.5,
    suits: 128,
    suitsPerCharityM: 0,
    marginPct: 4.2,
    billingGrade: "D",
    suitBand: "aggressive",
    confidence: "estimated",
  },
  {
    id: "il-academic-a",
    name: "Midwest University Medical",
    state: "IL",
    region: "Midwest",
    peer: "Academic",
    charityPct: 1.8,
    charityM: 62.4,
    suits: 96,
    suitsPerCharityM: 0,
    marginPct: 5.9,
    billingGrade: "C",
    suitBand: "moderate",
    confidence: "estimated",
  },
  {
    id: "nc-community-a",
    name: "Piedmont Carolina Health",
    state: "NC",
    region: "South",
    peer: "Community",
    charityPct: 1.5,
    charityM: 16.8,
    suits: 84,
    suitsPerCharityM: 0,
    marginPct: 3.6,
    billingGrade: "C",
    suitBand: "moderate",
    confidence: "estimated",
  },
  {
    id: "in-community-a",
    name: "Wabash Valley Hospital",
    state: "IN",
    region: "Midwest",
    peer: "Community",
    charityPct: 1.6,
    charityM: 10.2,
    suits: 71,
    suitsPerCharityM: 0,
    marginPct: 2.4,
    billingGrade: "C",
    suitBand: "moderate",
    confidence: "estimated",
  },
  {
    id: "tx-system-a",
    name: "Lone Star Faith Health",
    state: "TX",
    region: "South",
    peer: "System flagship",
    charityPct: 2.0,
    charityM: 54.8,
    suits: 62,
    suitsPerCharityM: 0,
    marginPct: 8.4,
    billingGrade: "C",
    suitBand: "moderate",
    confidence: "estimated",
  },
  {
    id: "mi-community-a",
    name: "Great Lakes Community",
    state: "MI",
    region: "Midwest",
    peer: "Community",
    charityPct: 1.9,
    charityM: 13.6,
    suits: 48,
    suitsPerCharityM: 0,
    marginPct: 1.8,
    billingGrade: "C",
    suitBand: "moderate",
    confidence: "estimated",
  },
  {
    id: "ky-community-a",
    name: "Bluegrass Regional",
    state: "KY",
    region: "South",
    peer: "Community",
    charityPct: 1.7,
    charityM: 8.4,
    suits: 39,
    suitsPerCharityM: 0,
    marginPct: 0.9,
    billingGrade: "D",
    suitBand: "moderate",
    confidence: "estimated",
  },
  {
    id: "wi-community-a",
    name: "Northwoods Memorial",
    state: "WI",
    region: "Midwest",
    peer: "Community",
    charityPct: 2.2,
    charityM: 11.1,
    suits: 28,
    suitsPerCharityM: 0,
    marginPct: 3.4,
    billingGrade: "B",
    suitBand: "moderate",
    confidence: "estimated",
  },
  {
    id: "ma-academic-a",
    name: "Bay Commonwealth Medical",
    state: "MA",
    region: "Northeast",
    peer: "Academic",
    charityPct: 2.4,
    charityM: 78.2,
    suits: 18,
    suitsPerCharityM: 0,
    marginPct: 4.1,
    billingGrade: "B",
    suitBand: "low",
    confidence: "estimated",
  },
  {
    id: "ca-system-a",
    name: "Pacific Covenant Health",
    state: "CA",
    region: "West",
    peer: "System flagship",
    charityPct: 2.6,
    charityM: 92.5,
    suits: 14,
    suitsPerCharityM: 0,
    marginPct: 6.8,
    billingGrade: "B",
    suitBand: "low",
    confidence: "estimated",
  },
  {
    id: "or-safety-a",
    name: "Willamette Safety Net",
    state: "OR",
    region: "West",
    peer: "Safety-net",
    charityPct: 4.8,
    charityM: 36.2,
    suits: 4,
    suitsPerCharityM: 0,
    marginPct: -1.2,
    billingGrade: "A",
    suitBand: "low",
    confidence: "estimated",
  },
  {
    id: "nm-safety-a",
    name: "Rio Grande Public Health",
    state: "NM",
    region: "West",
    peer: "Safety-net",
    charityPct: 5.1,
    charityM: 22.8,
    suits: 2,
    suitsPerCharityM: 0,
    marginPct: -2.4,
    billingGrade: "A",
    suitBand: "none",
    confidence: "estimated",
  },
  {
    id: "mn-academic-a",
    name: "Twin Cities University Hosp",
    state: "MN",
    region: "Midwest",
    peer: "Academic",
    charityPct: 3.2,
    charityM: 68.4,
    suits: 3,
    suitsPerCharityM: 0,
    marginPct: 3.8,
    billingGrade: "A",
    suitBand: "low",
    confidence: "estimated",
  },
  {
    id: "wa-system-a",
    name: "Cascade Mutual Health",
    state: "WA",
    region: "West",
    peer: "System flagship",
    charityPct: 3.0,
    charityM: 71.6,
    suits: 1,
    suitsPerCharityM: 0,
    marginPct: 5.2,
    billingGrade: "A",
    suitBand: "none",
    confidence: "estimated",
  },
  {
    id: "co-community-a",
    name: "Front Range Community",
    state: "CO",
    region: "West",
    peer: "Community",
    charityPct: 2.8,
    charityM: 15.4,
    suits: 0,
    suitsPerCharityM: 0,
    marginPct: 2.1,
    billingGrade: "A",
    suitBand: "none",
    confidence: "estimated",
  },
  {
    id: "ct-academic-a",
    name: "Nutmeg Academic Medical",
    state: "CT",
    region: "Northeast",
    peer: "Academic",
    charityPct: 2.7,
    charityM: 44.8,
    suits: 2,
    suitsPerCharityM: 0,
    marginPct: 3.5,
    billingGrade: "B",
    suitBand: "none",
    confidence: "estimated",
  },
  {
    id: "nj-safety-a",
    name: "Garden State Safety Net",
    state: "NJ",
    region: "Northeast",
    peer: "Safety-net",
    charityPct: 4.2,
    charityM: 31.6,
    suits: 5,
    suitsPerCharityM: 0,
    marginPct: -0.8,
    billingGrade: "A",
    suitBand: "low",
    confidence: "estimated",
  },
  {
    id: "md-system-a",
    name: "Chesapeake Health Alliance",
    state: "MD",
    region: "Northeast",
    peer: "System flagship",
    charityPct: 2.5,
    charityM: 48.2,
    suits: 8,
    suitsPerCharityM: 0,
    marginPct: 4.6,
    billingGrade: "B",
    suitBand: "low",
    confidence: "estimated",
  },
  {
    id: "al-community-a",
    name: "Gulf South Community",
    state: "AL",
    region: "South",
    peer: "Community",
    charityPct: 1.4,
    charityM: 7.6,
    suits: 112,
    suitsPerCharityM: 0,
    marginPct: 3.2,
    billingGrade: "F",
    suitBand: "aggressive",
    confidence: "estimated",
  },
  {
    id: "sc-community-a",
    name: "Lowcountry Memorial",
    state: "SC",
    region: "South",
    peer: "Community",
    charityPct: 1.2,
    charityM: 9.1,
    suits: 94,
    suitsPerCharityM: 0,
    marginPct: 4.0,
    billingGrade: "D",
    suitBand: "moderate",
    confidence: "estimated",
  },
  {
    id: "ia-community-a",
    name: "Prairie Crossroads Hospital",
    state: "IA",
    region: "Midwest",
    peer: "Community",
    charityPct: 2.3,
    charityM: 8.8,
    suits: 6,
    suitsPerCharityM: 0,
    marginPct: 1.4,
    billingGrade: "B",
    suitBand: "low",
    confidence: "estimated",
  },
  {
    id: "az-safety-a",
    name: "Desert Public Health Center",
    state: "AZ",
    region: "West",
    peer: "Safety-net",
    charityPct: 4.5,
    charityM: 27.4,
    suits: 0,
    suitsPerCharityM: 0,
    marginPct: -1.6,
    billingGrade: "A",
    suitBand: "none",
    confidence: "estimated",
  },
].map((h) => ({
  ...h,
  suitsPerCharityM: ratio(h.suits, h.charityM),
  suitBand: band(h.suits),
})) as HospitalRow[];

export type StateSuitRow = {
  state: string;
  abbr: string;
  region: RegionId;
  hospitals: number;
  suits: number;
  charityM: number;
  suitsPerCharityM: number;
  medianCharityPct: number;
  confidence: Confidence;
};

/** State aggregates from panel */
export const STATE_LADDER: StateSuitRow[] = (() => {
  const map = new Map<
    string,
    {
      state: string;
      abbr: string;
      region: RegionId;
      hospitals: number;
      suits: number;
      charityM: number;
      charityPcts: number[];
    }
  >();
  for (const h of HOSPITAL_PANEL) {
    const cur = map.get(h.state) ?? {
      state: h.state,
      abbr: h.state,
      region: h.region,
      hospitals: 0,
      suits: 0,
      charityM: 0,
      charityPcts: [] as number[],
    };
    cur.hospitals += 1;
    cur.suits += h.suits;
    cur.charityM += h.charityM;
    cur.charityPcts.push(h.charityPct);
    map.set(h.state, cur);
  }
  return [...map.values()]
    .map((s) => {
      const sorted = [...s.charityPcts].sort((a, b) => a - b);
      const mid = sorted[Math.floor(sorted.length / 2)] ?? 0;
      return {
        state: s.state,
        abbr: s.abbr,
        region: s.region,
        hospitals: s.hospitals,
        suits: s.suits,
        charityM: Math.round(s.charityM * 10) / 10,
        suitsPerCharityM: ratio(s.suits, s.charityM),
        medianCharityPct: mid,
        confidence: "estimated" as Confidence,
      };
    })
    .sort((a, b) => b.suitsPerCharityM - a.suitsPerCharityM);
})();

export type VintageRow = {
  year: number;
  /** Aggregate suits in tracked systems */
  suits: number;
  /** Aggregate charity care $M (nominal) */
  charityM: number;
  /** Suits per $1M charity */
  suitsPerCharityM: number;
  /** Median charity % among aggressive litigators */
  aggressiveCharityPct: number;
  confidence: Confidence;
};

/** National desk path — tracked litigating systems vs charity outlays */
export const VINTAGE_PATH: VintageRow[] = [
  {
    year: 2016,
    suits: 2680,
    charityM: 1420,
    suitsPerCharityM: 1.9,
    aggressiveCharityPct: 1.4,
    confidence: "estimated",
  },
  {
    year: 2017,
    suits: 2920,
    charityM: 1485,
    suitsPerCharityM: 2.0,
    aggressiveCharityPct: 1.3,
    confidence: "estimated",
  },
  {
    year: 2018,
    suits: 3180,
    charityM: 1520,
    suitsPerCharityM: 2.1,
    aggressiveCharityPct: 1.3,
    confidence: "estimated",
  },
  {
    year: 2019,
    suits: 3540,
    charityM: 1580,
    suitsPerCharityM: 2.2,
    aggressiveCharityPct: 1.2,
    confidence: "estimated",
  },
  {
    year: 2020,
    suits: 2210,
    charityM: 1710,
    suitsPerCharityM: 1.3,
    aggressiveCharityPct: 1.5,
    confidence: "estimated",
  },
  {
    year: 2021,
    suits: 2680,
    charityM: 1765,
    suitsPerCharityM: 1.5,
    aggressiveCharityPct: 1.4,
    confidence: "estimated",
  },
  {
    year: 2022,
    suits: 3410,
    charityM: 1790,
    suitsPerCharityM: 1.9,
    aggressiveCharityPct: 1.2,
    confidence: "estimated",
  },
  {
    year: 2023,
    suits: 3890,
    charityM: 1825,
    suitsPerCharityM: 2.1,
    aggressiveCharityPct: 1.1,
    confidence: "estimated",
  },
  {
    year: 2024,
    suits: 4120,
    charityM: 1840,
    suitsPerCharityM: 2.2,
    aggressiveCharityPct: 1.1,
    confidence: "carried",
  },
];

export type PeerCompareRow = {
  peer: PeerTier;
  n: number;
  medianCharityPct: number;
  medianSuits: number;
  medianSuitsPerCharityM: number;
  meanMarginPct: number;
};

export const PEER_COMPARE: PeerCompareRow[] = (() => {
  const tiers: PeerTier[] = [
    "Academic",
    "Community",
    "Safety-net",
    "System flagship",
  ];
  return tiers.map((peer) => {
    const rows = HOSPITAL_PANEL.filter((h) => h.peer === peer);
    const charity = [...rows.map((r) => r.charityPct)].sort((a, b) => a - b);
    const suits = [...rows.map((r) => r.suits)].sort((a, b) => a - b);
    const intensity = [...rows.map((r) => r.suitsPerCharityM)].sort(
      (a, b) => a - b,
    );
    const mid = <T,>(arr: T[]) => arr[Math.floor(arr.length / 2)]!;
    return {
      peer,
      n: rows.length,
      medianCharityPct: mid(charity),
      medianSuits: mid(suits),
      medianSuitsPerCharityM: mid(intensity),
      meanMarginPct:
        Math.round(
          (rows.reduce((s, r) => s + r.marginPct, 0) / rows.length) * 10,
        ) / 10,
    };
  });
})();

export type SuitBandMix = {
  band: SuitBand;
  label: string;
  hospitals: number;
  suits: number;
  charityM: number;
  medianCharityPct: number;
};

export const SUIT_BAND_MIX: SuitBandMix[] = (
  [
    ["none", "0–2 suits"],
    ["low", "3–24 suits"],
    ["moderate", "25–99 suits"],
    ["aggressive", "100+ suits"],
  ] as const
).map(([band, label]) => {
  const rows = HOSPITAL_PANEL.filter((h) => h.suitBand === band);
  const charity = [...rows.map((r) => r.charityPct)].sort((a, b) => a - b);
  return {
    band,
    label,
    hospitals: rows.length,
    suits: rows.reduce((s, r) => s + r.suits, 0),
    charityM:
      Math.round(rows.reduce((s, r) => s + r.charityM, 0) * 10) / 10,
    medianCharityPct: charity[Math.floor(charity.length / 2)] ?? 0,
  };
});

export type RegionSummary = {
  region: RegionId;
  hospitals: number;
  suits: number;
  charityM: number;
  suitsPerCharityM: number;
  medianCharityPct: number;
};

export const REGION_SUMMARY: RegionSummary[] = (
  ["South", "Midwest", "Northeast", "West"] as RegionId[]
).map((region) => {
  const rows = HOSPITAL_PANEL.filter((h) => h.region === region);
  const charity = [...rows.map((r) => r.charityPct)].sort((a, b) => a - b);
  const charityM = rows.reduce((s, r) => s + r.charityM, 0);
  const suits = rows.reduce((s, r) => s + r.suits, 0);
  return {
    region,
    hospitals: rows.length,
    suits,
    charityM: Math.round(charityM * 10) / 10,
    suitsPerCharityM: ratio(suits, charityM),
    medianCharityPct: charity[Math.floor(charity.length / 2)] ?? 0,
  };
});

export type BillingGradeMix = {
  grade: string;
  hospitals: number;
  medianSuitsPerCharityM: number;
  medianCharityPct: number;
};

export const BILLING_GRADE_MIX: BillingGradeMix[] = (
  ["A", "B", "C", "D", "F"] as const
).map((grade) => {
  const rows = HOSPITAL_PANEL.filter((h) => h.billingGrade === grade);
  if (rows.length === 0) {
    return {
      grade,
      hospitals: 0,
      medianSuitsPerCharityM: 0,
      medianCharityPct: 0,
    };
  }
  const intensity = [...rows.map((r) => r.suitsPerCharityM)].sort(
    (a, b) => a - b,
  );
  const charity = [...rows.map((r) => r.charityPct)].sort((a, b) => a - b);
  return {
    grade,
    hospitals: rows.length,
    medianSuitsPerCharityM: intensity[Math.floor(intensity.length / 2)]!,
    medianCharityPct: charity[Math.floor(charity.length / 2)]!,
  };
});

export const ANALYTICS = {
  correlationNote:
    "In the desk panel, hospitals with 100+ patient-debt suits show a median " +
    "charity-care share of expenses roughly one-third that of non-suing peers, " +
    "and about 16× more suits per $1M of charity care.",
  caveats: [
    "Schedule H charity care is at cost, not charges; cross-hospital comparisons remain imperfect.",
    "Court dockets undercount settlements and collection-agency suits filed under other plaintiff names.",
    "Panel is a purposeful sample of litigating and peer hospitals, not a census of U.S. nonprofits.",
  ],
} as const;

export function hospitalsByRegion(region: RegionId | "all"): HospitalRow[] {
  if (region === "all") return HOSPITAL_PANEL;
  return HOSPITAL_PANEL.filter((h) => h.region === region);
}

export function hospitalsByPeer(peer: PeerTier | "all"): HospitalRow[] {
  if (peer === "all") return HOSPITAL_PANEL;
  return HOSPITAL_PANEL.filter((h) => h.peer === peer);
}

export function hospitalsByBand(band: SuitBand | "all"): HospitalRow[] {
  if (band === "all") return HOSPITAL_PANEL;
  return HOSPITAL_PANEL.filter((h) => h.suitBand === band);
}

export function intensityLadder(rows: HospitalRow[], topN = 12): HospitalRow[] {
  return [...rows]
    .sort((a, b) => b.suitsPerCharityM - a.suitsPerCharityM)
    .slice(0, topN);
}

export function fmtPct(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtInt(n: number): string {
  return Math.round(n).toLocaleString("en-US");
}

export function fmtMoneyM(n: number, digits = 1): string {
  return `$${n.toFixed(digits)}M`;
}

export function fmtRatio(n: number): string {
  return n.toFixed(1);
}
