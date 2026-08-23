/**
 * Instant domestic rails vs SWIFT for retail — 2026 desk synthesis.
 * Core question: What share of retail cross-border value still clears on
 * correspondent banking versus PIX/UPI/FedNow-style instant rails?
 *
 * Anchors: BIS CPMI cross-border payments monitoring surveys (2024–2025),
 * CPMI Brief on FPS interlinking, World Bank GPSS / Remittance Prices Worldwide,
 * central-bank FPS disclosures (PIX, UPI, FedNow, Faster Payments, TIPS).
 * Global *value* shares are desk-estimated: CPMI publishes system capability
 * and arrangement type, not a unified retail-FX value ledger by rail.
 */

export type Confidence = "disclosed" | "estimated" | "carried";

export const SOURCE_NOTE =
  "CPMI 2024–2025 monitoring surveys disclose the share of FPS/RTGS that can process cross-border legs and how those legs are arranged (correspondent vs interlink vs multi-jurisdictional). World Bank RPW/GPSS frame remittance cost and speed. Global retail cross-border *value* shares by rail, corridor ladders, and 2027 projections are desk-estimated order-of-magnitude allocations consistent with those surveys plus public remittance and FPS volumes — they are not a CPMI or SWIFT extract of retail FX value.";

export const SOURCES = [
  {
    label: "BIS CPMI — Enhancing cross-border payments (2025 monitoring survey)",
    url: "https://www.bis.org/cpmi/publ/brief13.htm",
  },
  {
    label: "BIS CPMI — Moving on up (2024 monitoring survey)",
    url: "https://www.bis.org/cpmi/publ/brief10.pdf",
  },
  {
    label: "BIS CPMI — Interlinking fast payment systems (Brief 7)",
    url: "https://www.bis.org/cpmi/publ/brief7.pdf",
  },
  {
    label: "FSB — G20 roadmap consolidated progress report 2025",
    url: "https://www.fsb.org/uploads/P091025-1.pdf",
  },
  {
    label: "World Bank — Remittance Prices Worldwide / GPSS",
    url: "https://remittanceprices.worldbank.org/",
  },
] as const;

export const HEADLINE = {
  asOfPublished: "CPMI monitoring surveys 2024–2025 · RPW/GPSS",
  asOfDesk: "Desk retail-FX rail lens · Aug 2026",
  /** Desk est.: share of global retail CB value still on correspondent/SWIFT messaging */
  correspondentValueSharePct: 74,
  /** Desk est.: FPS interlink + multi-jurisdictional FPS share of retail CB value */
  instantRailValueSharePct: 9,
  /** Desk est.: closed-loop / nonbank wallets + card-acquired retail CB */
  closedLoopValueSharePct: 14,
  /** Desk est.: other (crypto on/off-ramp, cash courier residual, misc.) */
  otherValueSharePct: 3,
  /** CPMI 2025: share of FPS capable of processing cross-border payments */
  fpsCrossBorderCapablePct: 47,
  /** CPMI 2025: share of RTGS capable of processing cross-border payments */
  rtgsCrossBorderCapablePct: 48,
  /** Among FPS that enable XB: share using interlinking (CPMI 2024 framing ~43%) */
  fpsInterlinkAmongCapablePct: 43,
  /** RTGS: more than half still rely on correspondent for XB legs (CPMI) */
  rtgsCorrespondentPrimaryPct: 55,
  /** Headline remittance cost (World Bank RPW global average, latest carry) */
  remittanceAvgCostPct: 6.3,
  /** G20 retail target cost (%) */
  g20CostTargetPct: 3,
  /** Median end-to-end hours: correspondent retail remittance (desk/RPW mix) */
  correspondentMedianHours: 28,
  /** Median end-to-end minutes: live FPS–FPS linked corridor (desk) */
  fpsLinkMedianMinutes: 45,
} as const;

export type RailId =
  | "correspondent"
  | "fps_interlink"
  | "closed_loop"
  | "other";

export const RAIL_LABELS: Record<RailId, string> = {
  correspondent: "Correspondent / SWIFT messaging",
  fps_interlink: "Instant FPS interlink / multi-jurisdiction",
  closed_loop: "Closed-loop nonbank / card",
  other: "Other / residual",
};

/** Global retail cross-border value mix by year (desk estimated, % of value) */
export type RailMixYear = {
  year: number;
  correspondent: number;
  fps_interlink: number;
  closed_loop: number;
  other: number;
  confidence: Confidence;
};

export const RAIL_MIX_SERIES: RailMixYear[] = [
  {
    year: 2019,
    correspondent: 86,
    fps_interlink: 1,
    closed_loop: 10,
    other: 3,
    confidence: "estimated",
  },
  {
    year: 2020,
    correspondent: 85,
    fps_interlink: 1,
    closed_loop: 11,
    other: 3,
    confidence: "estimated",
  },
  {
    year: 2021,
    correspondent: 83,
    fps_interlink: 2,
    closed_loop: 12,
    other: 3,
    confidence: "estimated",
  },
  {
    year: 2022,
    correspondent: 81,
    fps_interlink: 3,
    closed_loop: 13,
    other: 3,
    confidence: "estimated",
  },
  {
    year: 2023,
    correspondent: 78,
    fps_interlink: 5,
    closed_loop: 14,
    other: 3,
    confidence: "estimated",
  },
  {
    year: 2024,
    correspondent: 76,
    fps_interlink: 7,
    closed_loop: 14,
    other: 3,
    confidence: "estimated",
  },
  {
    year: 2025,
    correspondent: 74,
    fps_interlink: 9,
    closed_loop: 14,
    other: 3,
    confidence: "estimated",
  },
  {
    year: 2026,
    correspondent: 71,
    fps_interlink: 12,
    closed_loop: 14,
    other: 3,
    confidence: "carried",
  },
  {
    year: 2027,
    correspondent: 66,
    fps_interlink: 17,
    closed_loop: 14,
    other: 3,
    confidence: "carried",
  },
];

export type CorridorRail = {
  id: string;
  corridor: string;
  region: "Americas" | "Europe" | "Asia-Pacific" | "Africa-ME";
  /** % of corridor retail CB value on correspondent */
  correspondentPct: number;
  /** % on FPS interlink / multi-jurisdiction FPS */
  fpsPct: number;
  /** % closed-loop / card */
  closedLoopPct: number;
  /** Avg remittance cost % (RPW-style) */
  avgCostPct: number;
  /** Typical end-to-end hours (correspondent path) */
  correspondentHours: number;
  /** Typical end-to-end minutes when FPS link exists; null if none live */
  fpsMinutes: number | null;
  /** Has live FPS–FPS or multi-jurisdiction FPS path */
  fpsLive: boolean;
  confidence: Confidence;
};

export const CORRIDORS: CorridorRail[] = [
  {
    id: "in-sg",
    corridor: "India → Singapore",
    region: "Asia-Pacific",
    correspondentPct: 38,
    fpsPct: 42,
    closedLoopPct: 20,
    avgCostPct: 2.1,
    correspondentHours: 18,
    fpsMinutes: 2,
    fpsLive: true,
    confidence: "estimated",
  },
  {
    id: "sg-th",
    corridor: "Singapore → Thailand",
    region: "Asia-Pacific",
    correspondentPct: 45,
    fpsPct: 35,
    closedLoopPct: 20,
    avgCostPct: 2.8,
    correspondentHours: 20,
    fpsMinutes: 5,
    fpsLive: true,
    confidence: "estimated",
  },
  {
    id: "br-latam",
    corridor: "Brazil → LatAm peers",
    region: "Americas",
    correspondentPct: 55,
    fpsPct: 22,
    closedLoopPct: 23,
    avgCostPct: 4.5,
    correspondentHours: 24,
    fpsMinutes: 15,
    fpsLive: true,
    confidence: "estimated",
  },
  {
    id: "eu-intra",
    corridor: "Euro area retail XB",
    region: "Europe",
    correspondentPct: 28,
    fpsPct: 48,
    closedLoopPct: 24,
    avgCostPct: 1.4,
    correspondentHours: 6,
    fpsMinutes: 10,
    fpsLive: true,
    confidence: "estimated",
  },
  {
    id: "uk-eu",
    corridor: "UK ↔ EU retail",
    region: "Europe",
    correspondentPct: 52,
    fpsPct: 18,
    closedLoopPct: 30,
    avgCostPct: 2.6,
    correspondentHours: 14,
    fpsMinutes: 30,
    fpsLive: true,
    confidence: "estimated",
  },
  {
    id: "us-mx",
    corridor: "US → Mexico",
    region: "Americas",
    correspondentPct: 48,
    fpsPct: 8,
    closedLoopPct: 44,
    avgCostPct: 3.9,
    correspondentHours: 16,
    fpsMinutes: null,
    fpsLive: false,
    confidence: "estimated",
  },
  {
    id: "us-in",
    corridor: "US → India",
    region: "Asia-Pacific",
    correspondentPct: 42,
    fpsPct: 12,
    closedLoopPct: 46,
    avgCostPct: 3.2,
    correspondentHours: 20,
    fpsMinutes: 60,
    fpsLive: true,
    confidence: "estimated",
  },
  {
    id: "gcc-sa",
    corridor: "GCC → South Asia",
    region: "Africa-ME",
    correspondentPct: 58,
    fpsPct: 15,
    closedLoopPct: 27,
    avgCostPct: 3.8,
    correspondentHours: 22,
    fpsMinutes: 45,
    fpsLive: true,
    confidence: "estimated",
  },
  {
    id: "ssa-intra",
    corridor: "Sub-Saharan corridors",
    region: "Africa-ME",
    correspondentPct: 72,
    fpsPct: 6,
    closedLoopPct: 22,
    avgCostPct: 7.8,
    correspondentHours: 48,
    fpsMinutes: null,
    fpsLive: false,
    confidence: "estimated",
  },
  {
    id: "cn-asean",
    corridor: "China → ASEAN",
    region: "Asia-Pacific",
    correspondentPct: 68,
    fpsPct: 8,
    closedLoopPct: 24,
    avgCostPct: 4.2,
    correspondentHours: 30,
    fpsMinutes: null,
    fpsLive: false,
    confidence: "estimated",
  },
  {
    id: "us-eu",
    corridor: "US → Euro area",
    region: "Americas",
    correspondentPct: 70,
    fpsPct: 4,
    closedLoopPct: 26,
    avgCostPct: 2.9,
    correspondentHours: 24,
    fpsMinutes: null,
    fpsLive: false,
    confidence: "estimated",
  },
  {
    id: "au-nz",
    corridor: "Australia ↔ NZ",
    region: "Asia-Pacific",
    correspondentPct: 40,
    fpsPct: 28,
    closedLoopPct: 32,
    avgCostPct: 2.4,
    correspondentHours: 12,
    fpsMinutes: 20,
    fpsLive: true,
    confidence: "estimated",
  },
];

export type RegionMix = {
  id: string;
  region: string;
  short: string;
  correspondentPct: number;
  fpsPct: number;
  closedLoopPct: number;
  otherPct: number;
  fpsCapableSystemsPct: number;
  confidence: Confidence;
};

export const REGION_MIX: RegionMix[] = [
  {
    id: "apac",
    region: "Asia-Pacific",
    short: "APAC",
    correspondentPct: 62,
    fpsPct: 18,
    closedLoopPct: 17,
    otherPct: 3,
    fpsCapableSystemsPct: 58,
    confidence: "estimated",
  },
  {
    id: "eur",
    region: "Europe",
    short: "Europe",
    correspondentPct: 55,
    fpsPct: 22,
    closedLoopPct: 20,
    otherPct: 3,
    fpsCapableSystemsPct: 52,
    confidence: "estimated",
  },
  {
    id: "amer",
    region: "Americas",
    short: "Americas",
    correspondentPct: 68,
    fpsPct: 7,
    closedLoopPct: 22,
    otherPct: 3,
    fpsCapableSystemsPct: 38,
    confidence: "estimated",
  },
  {
    id: "afr",
    region: "Africa & Middle East",
    short: "AFR-ME",
    correspondentPct: 78,
    fpsPct: 5,
    closedLoopPct: 14,
    otherPct: 3,
    fpsCapableSystemsPct: 41,
    confidence: "estimated",
  },
];

/** CPMI-style arrangement mix among systems that process XB (capability lens) */
export type ArrangementSlice = {
  id: string;
  system: "FPS" | "RTGS";
  label: string;
  sharePct: number;
  confidence: Confidence;
};

export const ARRANGEMENT_MIX: ArrangementSlice[] = [
  {
    id: "fps-interlink",
    system: "FPS",
    label: "FPS interlink / bilateral",
    sharePct: 43,
    confidence: "disclosed",
  },
  {
    id: "fps-multi",
    system: "FPS",
    label: "FPS multi-jurisdictional",
    sharePct: 10,
    confidence: "disclosed",
  },
  {
    id: "fps-corr",
    system: "FPS",
    label: "FPS via correspondent only",
    sharePct: 25,
    confidence: "estimated",
  },
  {
    id: "fps-other",
    system: "FPS",
    label: "FPS other / mixed",
    sharePct: 22,
    confidence: "estimated",
  },
  {
    id: "rtgs-corr",
    system: "RTGS",
    label: "RTGS via correspondent",
    sharePct: 55,
    confidence: "disclosed",
  },
  {
    id: "rtgs-link",
    system: "RTGS",
    label: "RTGS interlink / platform",
    sharePct: 28,
    confidence: "estimated",
  },
  {
    id: "rtgs-other",
    system: "RTGS",
    label: "RTGS other",
    sharePct: 17,
    confidence: "estimated",
  },
];

export type DomesticRail = {
  id: string;
  name: string;
  jurisdiction: string;
  region: RegionMix["id"] extends string ? string : string;
  /** Domestic instant txn index 2021=100 */
  volumeIndex2025: number;
  /** Cross-border path status */
  xbStatus: "live_link" | "pilot" | "domestic_only" | "corr_overlay";
  /** Est. share of that jurisdiction's outbound retail remittances touching the FPS */
  outboundTouchPct: number;
  launched: number;
};

export const DOMESTIC_RAILS: DomesticRail[] = [
  {
    id: "pix",
    name: "PIX",
    jurisdiction: "Brazil",
    region: "Americas",
    volumeIndex2025: 420,
    xbStatus: "pilot",
    outboundTouchPct: 8,
    launched: 2020,
  },
  {
    id: "upi",
    name: "UPI",
    jurisdiction: "India",
    region: "Asia-Pacific",
    volumeIndex2025: 580,
    xbStatus: "live_link",
    outboundTouchPct: 18,
    launched: 2016,
  },
  {
    id: "fednow",
    name: "FedNow",
    jurisdiction: "United States",
    region: "Americas",
    volumeIndex2025: 95,
    xbStatus: "domestic_only",
    outboundTouchPct: 1,
    launched: 2023,
  },
  {
    id: "faster",
    name: "Faster Payments",
    jurisdiction: "United Kingdom",
    region: "Europe",
    volumeIndex2025: 165,
    xbStatus: "corr_overlay",
    outboundTouchPct: 6,
    launched: 2008,
  },
  {
    id: "tips",
    name: "TIPS / SCT Inst",
    jurisdiction: "Euro area",
    region: "Europe",
    volumeIndex2025: 210,
    xbStatus: "live_link",
    outboundTouchPct: 24,
    launched: 2018,
  },
  {
    id: "paynow",
    name: "PayNow",
    jurisdiction: "Singapore",
    region: "Asia-Pacific",
    volumeIndex2025: 240,
    xbStatus: "live_link",
    outboundTouchPct: 28,
    launched: 2017,
  },
  {
    id: "promptpay",
    name: "PromptPay",
    jurisdiction: "Thailand",
    region: "Asia-Pacific",
    volumeIndex2025: 260,
    xbStatus: "live_link",
    outboundTouchPct: 16,
    launched: 2017,
  },
  {
    id: "spei",
    name: "SPEI / CoDi",
    jurisdiction: "Mexico",
    region: "Americas",
    volumeIndex2025: 180,
    xbStatus: "corr_overlay",
    outboundTouchPct: 4,
    launched: 2004,
  },
];

/** Speed vs cost scatter points for corridor panel */
export type SpeedCostPoint = {
  id: string;
  label: string;
  region: CorridorRail["region"];
  costPct: number;
  /** Hours to final credit (log-friendly) */
  hoursToCredit: number;
  rail: "correspondent" | "fps" | "closed_loop";
  valueShareProxy: number;
};

export const SPEED_COST: SpeedCostPoint[] = CORRIDORS.flatMap((c) => {
  const points: SpeedCostPoint[] = [
    {
      id: `${c.id}-corr`,
      label: `${c.corridor} · corr`,
      region: c.region,
      costPct: c.avgCostPct * 1.15,
      hoursToCredit: c.correspondentHours,
      rail: "correspondent",
      valueShareProxy: c.correspondentPct,
    },
    {
      id: `${c.id}-cl`,
      label: `${c.corridor} · closed`,
      region: c.region,
      costPct: c.avgCostPct * 0.85,
      hoursToCredit: Math.max(1, c.correspondentHours * 0.35),
      rail: "closed_loop",
      valueShareProxy: c.closedLoopPct,
    },
  ];
  if (c.fpsLive && c.fpsMinutes != null) {
    points.push({
      id: `${c.id}-fps`,
      label: `${c.corridor} · FPS`,
      region: c.region,
      costPct: Math.max(0.8, c.avgCostPct * 0.55),
      hoursToCredit: c.fpsMinutes / 60,
      rail: "fps",
      valueShareProxy: c.fpsPct,
    });
  }
  return points;
});

export const ANALYTICS = {
  headlineCorrespondentShare: HEADLINE.correspondentValueSharePct,
  headlineInstantShare: HEADLINE.instantRailValueSharePct,
  fpsCapable: HEADLINE.fpsCrossBorderCapablePct,
  deltaCorrespondent2019to2025:
    RAIL_MIX_SERIES[0].correspondent -
    RAIL_MIX_SERIES.find((r) => r.year === 2025)!.correspondent,
  corridorsWithLiveFps: CORRIDORS.filter((c) => c.fpsLive).length,
  corridorsTotal: CORRIDORS.length,
} as const;
