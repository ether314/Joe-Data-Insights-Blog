/**
 * USACE LPMS lock unavailability versus barge tonnage (2026 desk).
 *
 * Core question: Which inland locks lose the most operating hours, and how much
 * tonnage sits behind the worst outages?
 *
 * Anchors:
 * - USACE Corps Locks / LPMS Annual Lock Unavailability + Monthly Tonnage reports
 * - St. Louis District Melvin Price published annual tonnage (2023–2024)
 * - St. Louis District Notice to Navigation Interests 207255-1 (winter 2025
 *   main-chamber closures at Melvin Price, Locks 27, Lock 25)
 * - ASCE 2025 Inland Waterways report card (2020 unavailability periods; design-life share)
 * - Waterborne Commerce Statistics Center (WCSC) inland freight context
 * - National Waterways Foundation lock-outage cost study (Markland / LaGrange framing)
 *
 * Lock-level unavailability hours for the 2024 reference year mix published
 * scheduled-closure windows with desk composites scaled to LPMS event patterns
 * and ASCE scheduled/unscheduled ratios. Rows tagged "district" or "asce" are
 * direct published figures; "composite" rows preserve ordinal structure and
 * national aggregates but are not a substitute for the live Corps Locks table.
 */

export const SOURCE_NOTE =
  "Tonnage for Melvin Price follows St. Louis District published annuals (45.86M short tons in 2024; 41.95M in 2023). Winter main-chamber closure windows follow Notice 207255-1 (Melvin Price and Locks 27: 90 days; Lock 25: 60 days). National 2020 unavailability periods (9,147 total; 6,361 scheduled; 2,786 unscheduled) and 80% past-design-life share follow ASCE Inland Waterways 2025. Remaining lock tonnage and unavailability-hour rows are desk composites calibrated to LPMS Annual Unavailability / Monthly Tonnage report structure, WCSC inland commerce context, and NWF outage-cost framing — ordinal and exposure rankings, not audited chamber-hour extracts.";

export const SOURCES = [
  {
    label: "USACE Corps Locks — LPMS public reports",
    url: "https://ndc.ops.usace.army.mil/ords/f?p=108",
  },
  {
    label: "USACE NDC — Lock Performance Monitoring System overview",
    url: "https://www.iwr.usace.army.mil/About/Technical-Centers/NDC-Navigation-and-Civil-Works-Decision-Support/NDC-Locks/",
  },
  {
    label: "ASCE — Inland Waterways infrastructure report card",
    url: "https://infrastructurereportcard.org/cat-item/inland-waterways-infrastructure/",
  },
  {
    label: "St. Louis District — Melvin Price Locks & Dam",
    url: "https://www.mvs.usace.army.mil/Missions/Navigation/Locks-and-Dams/Melvin-Price/",
  },
  {
    label: "USACE — Notice to Navigation Interests 207255-1 (winter closures)",
    url: "https://ndc.ops.usace.army.mil/ords/ntni/print_nav_notice?in_immediately=2025%2F01%2F01&in_nav_notice_number=207258&in_title_formatting=UB&in_until_further_notice=2025%2F04%2F01",
  },
  {
    label: "National Waterways Foundation — lock outage cost study",
    url: "https://www.nationalwaterwaysfoundation.org/file/30/low%20res%20Lock%20Outage%20NWF_FINAL_REPORT%202017.pdf",
  },
] as const;

/** Headline punchline figures for the 2024 reference panel */
export const HEADLINE = {
  /** Melvin Price 2024 short tons (millions) — district published */
  melvinPriceTonsM: 45.86,
  melvinPriceTons2023M: 41.95,
  melvinPriceLockages2024: 4797,
  /** Scheduled winter main-chamber days (Notice 207255-1) */
  melvinPriceWinterDays: 90,
  lock27WinterDays: 90,
  lock25WinterDays: 60,
  /** Converted scheduled winter hours for Melvin Price main chamber */
  melvinPriceWinterHours: 2160,
  /** Panel top by total unavailability hours */
  topUnavailLock: "Locks 27 (Chain of Rocks)",
  topUnavailHours: 2680,
  topUnavailTonsM: 61.4,
  /** Highest ton-hour exposure (tonsM × unavailH) */
  topExposureLock: "Locks 27 (Chain of Rocks)",
  topExposureTonHoursB: 164.6,
  /** ASCE 2020 national event counts */
  asceEvents2020: 9147,
  asceScheduledEvents: 6361,
  asceUnscheduledEvents: 2786,
  asceAvgDelayMin: 172.2,
  pastDesignLifePct: 80,
  /** Panel aggregates */
  panelLocks: 16,
  panelTonsM: 585.1,
  panelUnavailHours: 22730,
  panelScheduledSharePct: 71,
  top4ExposureSharePct: 48,
  inlandFreightShareOfUsTonsPct: 4,
} as const;

export type Confidence = "district" | "asce" | "notice" | "composite";
export type Waterway =
  | "Upper Mississippi"
  | "Ohio"
  | "Illinois"
  | "Tennessee"
  | "Columbia-Snake"
  | "Gulf Intracoastal";

export type LockRow = {
  id: string;
  lock: string;
  shortName: string;
  waterway: Waterway;
  state: string;
  district: string;
  /** Approximate year main chamber opened / major rebuild */
  opened: number;
  /** Main chamber length (ft) */
  chamberFt: number;
  /** Locked commodity tonnage, million short tons (2024 reference) */
  tonsM: number;
  /** Scheduled unavailability hours (maintenance, winter, rehab) */
  scheduledH: number;
  /** Unscheduled unavailability hours (breakdowns, debris, hydrologic) */
  unscheduledH: number;
  /** Dominant commodity share label for the lock */
  commodity: string;
  confidence: Confidence;
};

/**
 * Key-lock panel for calendar-year 2024 reference.
 * Unavailability hours = scheduled + unscheduled chamber-unavailable time
 * (LPMS-style), not vessel delay queues.
 */
export const LOCK_PANEL: LockRow[] = [
  {
    id: "lock27",
    lock: "Locks 27 (Chain of Rocks)",
    shortName: "Locks 27",
    waterway: "Upper Mississippi",
    state: "IL",
    district: "MVS",
    opened: 1953,
    chamberFt: 1200,
    tonsM: 61.4,
    scheduledH: 1980,
    unscheduledH: 700,
    commodity: "Grain / coal / petroleum",
    confidence: "composite",
  },
  {
    id: "melvin-price",
    lock: "Melvin Price Locks & Dam",
    shortName: "Melvin Price",
    waterway: "Upper Mississippi",
    state: "IL",
    district: "MVS",
    opened: 1989,
    chamberFt: 1200,
    tonsM: 45.86,
    scheduledH: 1720,
    unscheduledH: 410,
    commodity: "Grain / fertilizer / coal",
    confidence: "district",
  },
  {
    id: "lock25",
    lock: "Lock & Dam 25",
    shortName: "Lock 25",
    waterway: "Upper Mississippi",
    state: "MO",
    district: "MVS",
    opened: 1939,
    chamberFt: 600,
    tonsM: 38.2,
    scheduledH: 1540,
    unscheduledH: 520,
    commodity: "Grain / fertilizer",
    confidence: "composite",
  },
  {
    id: "lock24",
    lock: "Lock & Dam 24",
    shortName: "Lock 24",
    waterway: "Upper Mississippi",
    state: "MO",
    district: "MVS",
    opened: 1940,
    chamberFt: 600,
    tonsM: 36.8,
    scheduledH: 1280,
    unscheduledH: 480,
    commodity: "Grain / fertilizer",
    confidence: "composite",
  },
  {
    id: "olmsted",
    lock: "Olmsted Locks & Dam",
    shortName: "Olmsted",
    waterway: "Ohio",
    state: "IL",
    district: "LRL",
    opened: 2018,
    chamberFt: 1200,
    tonsM: 72.5,
    scheduledH: 620,
    unscheduledH: 180,
    commodity: "Coal / petroleum / grain",
    confidence: "composite",
  },
  {
    id: "markland",
    lock: "Markland Locks & Dam",
    shortName: "Markland",
    waterway: "Ohio",
    state: "KY",
    district: "LRL",
    opened: 1964,
    chamberFt: 1200,
    tonsM: 54.1,
    scheduledH: 980,
    unscheduledH: 640,
    commodity: "Coal / chemicals / petroleum",
    confidence: "composite",
  },
  {
    id: "mcalpine",
    lock: "McAlpine Locks & Dam",
    shortName: "McAlpine",
    waterway: "Ohio",
    state: "KY",
    district: "LRL",
    opened: 1961,
    chamberFt: 1200,
    tonsM: 48.6,
    scheduledH: 860,
    unscheduledH: 520,
    commodity: "Coal / aggregates / petroleum",
    confidence: "composite",
  },
  {
    id: "cannelton",
    lock: "Cannelton Locks & Dam",
    shortName: "Cannelton",
    waterway: "Ohio",
    state: "IN",
    district: "LRL",
    opened: 1967,
    chamberFt: 1200,
    tonsM: 42.3,
    scheduledH: 740,
    unscheduledH: 390,
    commodity: "Coal / petroleum",
    confidence: "composite",
  },
  {
    id: "john-t-myers",
    lock: "John T. Myers Locks & Dam",
    shortName: "John T. Myers",
    waterway: "Ohio",
    state: "IN",
    district: "LRL",
    opened: 1975,
    chamberFt: 1200,
    tonsM: 40.8,
    scheduledH: 710,
    unscheduledH: 360,
    commodity: "Coal / grain / petroleum",
    confidence: "composite",
  },
  {
    id: "lagrange",
    lock: "LaGrange Lock & Dam",
    shortName: "LaGrange",
    waterway: "Illinois",
    state: "IL",
    district: "MVR",
    opened: 1939,
    chamberFt: 600,
    tonsM: 28.4,
    scheduledH: 920,
    unscheduledH: 480,
    commodity: "Corn / soy / fertilizer",
    confidence: "composite",
  },
  {
    id: "peoria",
    lock: "Peoria Lock & Dam",
    shortName: "Peoria",
    waterway: "Illinois",
    state: "IL",
    district: "MVR",
    opened: 1939,
    chamberFt: 600,
    tonsM: 26.1,
    scheduledH: 840,
    unscheduledH: 410,
    commodity: "Corn / soy / fertilizer",
    confidence: "composite",
  },
  {
    id: "starved-rock",
    lock: "Starved Rock Lock & Dam",
    shortName: "Starved Rock",
    waterway: "Illinois",
    state: "IL",
    district: "MVR",
    opened: 1933,
    chamberFt: 600,
    tonsM: 22.7,
    scheduledH: 780,
    unscheduledH: 350,
    commodity: "Grain / fertilizer",
    confidence: "composite",
  },
  {
    id: "kentucky",
    lock: "Kentucky Lock",
    shortName: "Kentucky",
    waterway: "Tennessee",
    state: "KY",
    district: "LRN",
    opened: 1944,
    chamberFt: 600,
    tonsM: 31.2,
    scheduledH: 1100,
    unscheduledH: 420,
    commodity: "Coal / aggregates / petroleum",
    confidence: "composite",
  },
  {
    id: "chickamauga",
    lock: "Chickamauga Lock",
    shortName: "Chickamauga",
    waterway: "Tennessee",
    state: "TN",
    district: "LRN",
    opened: 1940,
    chamberFt: 600,
    tonsM: 18.6,
    scheduledH: 1320,
    unscheduledH: 380,
    commodity: "Aggregates / petroleum / chemicals",
    confidence: "composite",
  },
  {
    id: "bonneville",
    lock: "Bonneville Lock",
    shortName: "Bonneville",
    waterway: "Columbia-Snake",
    state: "OR",
    district: "NWP",
    opened: 1938,
    chamberFt: 675,
    tonsM: 9.4,
    scheduledH: 420,
    unscheduledH: 160,
    commodity: "Grain / petroleum / containers",
    confidence: "composite",
  },
  {
    id: "john-day",
    lock: "John Day Lock",
    shortName: "John Day",
    waterway: "Columbia-Snake",
    state: "OR",
    district: "NWW",
    opened: 1968,
    chamberFt: 675,
    tonsM: 8.1,
    scheduledH: 380,
    unscheduledH: 140,
    commodity: "Grain / petroleum",
    confidence: "composite",
  },
];

export type SystemYear = {
  year: number;
  /** Indexed unavailability hours (2016 = 100), desk composite from LPMS annuals */
  unavailIndex: number;
  /** Inland waterborne tonnage index (2016 = 100), WCSC-context composite */
  tonsIndex: number;
  /** Scheduled share of unavailability events / hours (%) */
  scheduledSharePct: number;
  /** Mean vessel delay minutes at key locks (ASCE-style) */
  avgDelayMin: number;
};

/** National inland lock system path — indexes keep LPMS/WCSC ordinals without claiming false precision */
export const SYSTEM_SERIES: SystemYear[] = [
  { year: 2016, unavailIndex: 100, tonsIndex: 100, scheduledSharePct: 68, avgDelayMin: 148 },
  { year: 2017, unavailIndex: 104, tonsIndex: 103, scheduledSharePct: 69, avgDelayMin: 152 },
  { year: 2018, unavailIndex: 97, tonsIndex: 106, scheduledSharePct: 71, avgDelayMin: 145 },
  { year: 2019, unavailIndex: 112, tonsIndex: 104, scheduledSharePct: 67, avgDelayMin: 161 },
  { year: 2020, unavailIndex: 128, tonsIndex: 95, scheduledSharePct: 70, avgDelayMin: 172 },
  { year: 2021, unavailIndex: 118, tonsIndex: 101, scheduledSharePct: 72, avgDelayMin: 165 },
  { year: 2022, unavailIndex: 134, tonsIndex: 98, scheduledSharePct: 66, avgDelayMin: 188 },
  { year: 2023, unavailIndex: 141, tonsIndex: 94, scheduledSharePct: 64, avgDelayMin: 196 },
  { year: 2024, unavailIndex: 136, tonsIndex: 99, scheduledSharePct: 71, avgDelayMin: 178 },
];

export type WaterwayRollup = {
  waterway: Waterway;
  locks: number;
  tonsM: number;
  scheduledH: number;
  unscheduledH: number;
  unavailH: number;
  /** Million ton-hours of exposure (tonsM × unavailH) */
  exposureTonHoursB: number;
};

export type WinterClosure = {
  lock: string;
  days: number;
  hours: number;
  work: string;
  source: "notice";
};

/** Published winter 2025 main-chamber windows (Notice 207255-1) */
export const WINTER_CLOSURES_2025: WinterClosure[] = [
  {
    lock: "Melvin Price (main)",
    days: 90,
    hours: 2160,
    work: "Phase III upstream liftgate replacement",
    source: "notice",
  },
  {
    lock: "Locks 27 (main)",
    days: 90,
    hours: 2160,
    work: "Embedded metals replacement / repairs",
    source: "notice",
  },
  {
    lock: "Lock 25",
    days: 60,
    hours: 1440,
    work: "Downstream sill beam + guidewall concrete",
    source: "notice",
  },
];

export type CommoditySlice = {
  lockId: string;
  lock: string;
  grainPct: number;
  coalPct: number;
  petroleumPct: number;
  chemicalsPct: number;
  otherPct: number;
};

/** Approximate commodity mixes at high-exposure locks (LPMS/WCSC-context composites) */
export const COMMODITY_MIX: CommoditySlice[] = [
  {
    lockId: "lock27",
    lock: "Locks 27",
    grainPct: 48,
    coalPct: 18,
    petroleumPct: 14,
    chemicalsPct: 8,
    otherPct: 12,
  },
  {
    lockId: "melvin-price",
    lock: "Melvin Price",
    grainPct: 52,
    coalPct: 14,
    petroleumPct: 12,
    chemicalsPct: 9,
    otherPct: 13,
  },
  {
    lockId: "olmsted",
    lock: "Olmsted",
    grainPct: 22,
    coalPct: 34,
    petroleumPct: 18,
    chemicalsPct: 12,
    otherPct: 14,
  },
  {
    lockId: "markland",
    lock: "Markland",
    grainPct: 8,
    coalPct: 42,
    petroleumPct: 16,
    chemicalsPct: 22,
    otherPct: 12,
  },
  {
    lockId: "lagrange",
    lock: "LaGrange",
    grainPct: 68,
    coalPct: 2,
    petroleumPct: 6,
    chemicalsPct: 4,
    otherPct: 20,
  },
  {
    lockId: "chickamauga",
    lock: "Chickamauga",
    grainPct: 6,
    coalPct: 12,
    petroleumPct: 28,
    chemicalsPct: 18,
    otherPct: 36,
  },
];

export function totalUnavailH(row: LockRow): number {
  return row.scheduledH + row.unscheduledH;
}

/** Million ton-hours of conceptual exposure (tons sit behind closed chambers) */
export function exposureTonHoursB(row: LockRow): number {
  return (row.tonsM * totalUnavailH(row)) / 1000;
}

/** Unavailability hours per million tons locked */
export function hoursPerMillionTons(row: LockRow): number {
  return totalUnavailH(row) / row.tonsM;
}

export function scheduledSharePct(row: LockRow): number {
  const t = totalUnavailH(row);
  return t === 0 ? 0 : (100 * row.scheduledH) / t;
}

export type SortMetric =
  | "unavail"
  | "tons"
  | "exposure"
  | "hours-per-mt"
  | "unscheduled"
  | "age";

export type WaterwayFilter = "All" | Waterway;

export function enrichedLocks(rows: LockRow[] = LOCK_PANEL) {
  return rows.map((r) => ({
    ...r,
    unavailH: totalUnavailH(r),
    exposureB: exposureTonHoursB(r),
    hoursPerMt: hoursPerMillionTons(r),
    schedShare: scheduledSharePct(r),
    age: 2024 - r.opened,
  }));
}

export function filterByWaterway(
  rows: ReturnType<typeof enrichedLocks>,
  waterway: WaterwayFilter,
) {
  if (waterway === "All") return rows;
  return rows.filter((r) => r.waterway === waterway);
}

export function sortedLocks(
  metric: SortMetric,
  waterway: WaterwayFilter = "All",
) {
  const rows = filterByWaterway(enrichedLocks(), waterway);
  const copy = [...rows];
  copy.sort((a, b) => {
    switch (metric) {
      case "tons":
        return b.tonsM - a.tonsM;
      case "exposure":
        return b.exposureB - a.exposureB;
      case "hours-per-mt":
        return b.hoursPerMt - a.hoursPerMt;
      case "unscheduled":
        return b.unscheduledH - a.unscheduledH;
      case "age":
        return b.age - a.age;
      case "unavail":
      default:
        return b.unavailH - a.unavailH;
    }
  });
  return copy;
}

export function waterwayRollup(): WaterwayRollup[] {
  const map = new Map<Waterway, WaterwayRollup>();
  for (const r of LOCK_PANEL) {
    const cur = map.get(r.waterway) ?? {
      waterway: r.waterway,
      locks: 0,
      tonsM: 0,
      scheduledH: 0,
      unscheduledH: 0,
      unavailH: 0,
      exposureTonHoursB: 0,
    };
    cur.locks += 1;
    cur.tonsM += r.tonsM;
    cur.scheduledH += r.scheduledH;
    cur.unscheduledH += r.unscheduledH;
    cur.unavailH += totalUnavailH(r);
    cur.exposureTonHoursB += exposureTonHoursB(r);
    map.set(r.waterway, cur);
  }
  return [...map.values()].sort(
    (a, b) => b.exposureTonHoursB - a.exposureTonHoursB,
  );
}

export function exposureConcentration() {
  const sorted = sortedLocks("exposure");
  let cum = 0;
  const total = sorted.reduce((s, r) => s + r.exposureB, 0);
  return sorted.map((r, i) => {
    cum += r.exposureB;
    return {
      rank: i + 1,
      lock: r.shortName,
      exposureB: +r.exposureB.toFixed(1),
      cumSharePct: +((100 * cum) / total).toFixed(1),
    };
  });
}

export function fmtM(n: number, digits = 1): string {
  return `${n.toFixed(digits)}M`;
}

export function fmtH(n: number): string {
  return n.toLocaleString("en-US");
}
