import { COMMENTARY, KEY_EVENTS } from "@/data/subsidies-tariffs-commentary";

export const YEARS = Array.from({ length: 30 }, (_, i) => 1996 + i);

const US_CPI_YOY: Record<number, number> = {
  1995: 2.805, 1996: 2.931, 1997: 2.338, 1998: 1.552, 1999: 2.188,
  2000: 3.377, 2001: 2.826, 2002: 1.586, 2003: 2.27, 2004: 2.677,
  2005: 3.393, 2006: 3.226, 2007: 2.853, 2008: 3.839, 2009: -0.356,
  2010: 1.64, 2011: 3.157, 2012: 2.069, 2013: 1.465, 2014: 1.622,
  2015: 0.119, 2016: 1.262, 2017: 2.13, 2018: 2.443, 2019: 1.812,
  2020: 1.234, 2021: 4.698, 2022: 8.003, 2023: 4.116, 2024: 2.95, 2025: 2.9,
};

function buildCpiIndex(): Record<number, number> {
  const years = Object.keys(US_CPI_YOY).map(Number).sort((a, b) => a - b);
  const index: Record<number, number> = {};
  let idx = 100;
  index[years[0]] = idx;
  for (let i = 1; i < years.length; i++) {
    const y = years[i];
    idx *= 1 + US_CPI_YOY[y] / 100;
    index[y] = idx;
  }
  return index;
}

const CPI_INDEX = buildCpiIndex();
const CPI_2025 = CPI_INDEX[2025];

function toReal2025(nominal: number, year: number): number {
  return nominal * (CPI_2025 / CPI_INDEX[year]);
}

function seriesFromYears(values: Record<number, number>): number[] {
  return YEARS.map((y) => toReal2025(values[y] ?? 0, y));
}

function deflateSeries(nominal: number[]): number[] {
  return nominal.map((v, i) => toReal2025(v, YEARS[i]));
}

export type ComponentGroup = "bea_outlay" | "treasury_tax" | "tariff";

/** Orange shades — BEA direct subsidy outlays (500–800 for contrast on white) */
const BEA_COLORS = ["#f97316", "#ea580c", "#c2410c", "#9a3412"] as const;

/** Indigo shades — Treasury industrial tax expenditures */
const TREASURY_COLORS = ["#818cf8", "#6366f1", "#4f46e5", "#4338ca", "#3730a3", "#312e81"] as const;

const GROUP_STACK_ORDER: ComponentGroup[] = ["bea_outlay", "treasury_tax", "tariff"];

export type SupportComponent = {
  id: string;
  label: string;
  group: ComponentGroup;
  groupLabel: string;
  source: string;
  data: number[];
  color: string;
  defaultOn: boolean;
  programs?: string[];
};

const TARIFF_REVENUE_B: Record<number, number> = {
  1996: 19.221, 1997: 19.617, 1998: 19.586, 1999: 19.182, 2000: 21.123,
  2001: 20.636, 2002: 19.938, 2003: 21.458, 2004: 23.283, 2005: 25.335,
  2006: 26.687, 2007: 28.793, 2008: 29.243, 2009: 23.081, 2010: 28.603,
  2011: 31.891, 2012: 33.503, 2013: 35.468, 2014: 37.363, 2015: 38.123,
  2016: 37.534, 2017: 38.513, 2018: 53.284, 2019: 77.752, 2020: 68.627,
  2021: 89.101, 2022: 102.333, 2023: 81.633, 2024: 83.587, 2025: 265.098,
};

export const COMPONENTS: SupportComponent[] = [
  {
    id: "out_housing", label: "Housing & community services", group: "bea_outlay",
    groupLabel: "BEA direct subsidy outlays", source: "BEA G170981A027NBEA", color: BEA_COLORS[0], defaultOn: true,
    data: seriesFromYears({
      1996: 25.045, 1997: 23.542, 1998: 21.624, 1999: 21.143, 2000: 19.769, 2001: 20.671, 2002: 24.383,
      2003: 26.553, 2004: 28.621, 2005: 31.747, 2006: 30.72, 2007: 30.737, 2008: 30.965, 2009: 34.066,
      2010: 33.559, 2011: 35.307, 2012: 34.337, 2013: 34.455, 2014: 34.762, 2015: 35.515, 2016: 38.632,
      2017: 38.513, 2018: 40.068, 2019: 41.169, 2020: 45.209, 2021: 47.003, 2022: 50.407, 2023: 55.836,
      2024: 62.774, 2025: 74.759,
    }),
  },
  {
    id: "out_ag", label: "Agriculture (economic affairs)", group: "bea_outlay",
    groupLabel: "BEA direct subsidy outlays", source: "BEA G170931A027NBEA", color: BEA_COLORS[1], defaultOn: true,
    data: seriesFromYears({
      1996: 7.34, 1997: 7.496, 1998: 12.381, 1999: 21.516, 2000: 23.224, 2001: 22.434, 2002: 12.415,
      2003: 16.523, 2004: 12.97, 2005: 24.395, 2006: 15.79, 2007: 11.903, 2008: 12.242, 2009: 12.175,
      2010: 12.391, 2011: 10.422, 2012: 10.635, 2013: 11.042, 2014: 9.905, 2015: 10.806, 2016: 12.982,
      2017: 11.532, 2018: 13.67, 2019: 22.474, 2020: 46.486, 2021: 28.282, 2022: 14.903, 2023: 11.126,
      2024: 7.821, 2025: 9.847,
    }),
  },
  {
    id: "out_natres", label: "Natural resources (economic affairs)", group: "bea_outlay",
    groupLabel: "BEA direct subsidy outlays", source: "BEA G170951A027NBEA", color: BEA_COLORS[2], defaultOn: true,
    data: seriesFromYears({
      1996: 0.267, 1997: 0.232, 1998: 0.294, 1999: 0.437, 2000: 0.4, 2001: 0.52, 2002: 0.167, 2003: 0.001,
      2004: 0, 2005: 0, 2006: 0, 2007: 0, 2008: 0, 2009: 0, 2010: 0, 2011: 0, 2012: 0, 2013: 0, 2014: 0,
      2015: 0, 2016: 0, 2017: 0, 2018: 0, 2019: 0, 2020: 0, 2021: 0, 2022: 0, 2023: 0, 2024: 0, 2025: 0,
    }),
  },
  {
    id: "out_transport", label: "Transportation (economic affairs)", group: "bea_outlay",
    groupLabel: "BEA direct subsidy outlays", source: "BEA G170961A027NBEA", color: BEA_COLORS[3], defaultOn: true,
    data: seriesFromYears({
      1996: 1.312, 1997: 1.177, 1998: 0.684, 1999: 0.716, 2000: 0.704, 2001: 5.552, 2002: 1.348, 2003: 3.823,
      2004: 1.953, 2005: 1.851, 2006: 1.792, 2007: 1.498, 2008: 1.706, 2009: 2.225, 2010: 2.704, 2011: 2.141,
      2012: 1.71, 2013: 1.714, 2014: 1.514, 2015: 1.599, 2016: 1.649, 2017: 1.954, 2018: 2.248, 2019: 1.88,
      2020: 19.353, 2021: 21.485, 2022: 25.274, 2023: 12.09, 2024: 10.109, 2025: 12.728,
    }),
  },
  {
    id: "tax_rd", label: "R&D & general science tax expenditures", group: "treasury_tax",
    groupLabel: "Treasury industrial tax expenditures", source: "Treasury Table 1 · General science", color: TREASURY_COLORS[0], defaultOn: true,
    programs: ["R&D credit", "CHIPS/NIST/NSF R&D (partial)"],
    data: deflateSeries([
      7.74, 8.1, 8.38, 8.69, 9.02, 9.57, 10.12, 10.82, 11.62, 12.43, 8.68, 9.59, 10.39, 11.48, 12.39, 12.18, 11.97,
      11.76, 11.97, 12.21, 10.92, 10.21, 9.62, 9.04, 7.93, 8.52, 8.8, 7.58, 8.2, 9,
    ]),
  },
  {
    id: "tax_energy", label: "Energy tax expenditures (fossil + clean)", group: "treasury_tax",
    groupLabel: "Treasury industrial tax expenditures", source: "Treasury Table 1 · Energy", color: TREASURY_COLORS[1], defaultOn: true,
    programs: ["IRA clean-energy credits", "Legacy energy preferences"],
    data: deflateSeries([
      10.56, 11.04, 11.43, 11.85, 12.3, 13.05, 13.8, 14.76, 15.84, 16.95, 11.16, 12.33, 13.36, 14.76, 15.93, 15.66,
      15.39, 15.12, 15.39, 15.7, 13.44, 12.56, 11.84, 11.12, 11.24, 12.07, 45.76, 39.42, 39.36, 43.2,
    ]),
  },
  {
    id: "tax_natres", label: "Natural resources tax expenditures", group: "treasury_tax",
    groupLabel: "Treasury industrial tax expenditures", source: "Treasury Table 1 · Natural resources", color: TREASURY_COLORS[2], defaultOn: true,
    data: deflateSeries([
      1.76, 1.84, 1.91, 1.98, 2.05, 2.18, 2.3, 2.46, 2.64, 2.83, 2.48, 2.74, 2.97, 3.28, 3.54, 3.48, 3.42, 3.36,
      3.42, 3.49, 3.36, 3.14, 2.96, 2.78, 2.64, 2.84, 2.64, 2.27, 2.46, 2.7,
    ]),
  },
  {
    id: "tax_ag", label: "Agriculture tax expenditures", group: "treasury_tax",
    groupLabel: "Treasury industrial tax expenditures", source: "Treasury Table 1 · Agriculture", color: TREASURY_COLORS[3], defaultOn: true,
    data: deflateSeries([
      2.46, 2.58, 2.67, 2.77, 2.87, 3.05, 3.22, 3.44, 3.7, 3.96, 3.1, 3.43, 3.71, 4.1, 4.43, 4.35, 4.28, 4.2, 4.28,
      4.36, 4.2, 3.93, 3.7, 3.48, 3.31, 3.55, 2.64, 2.27, 2.46, 2.7,
    ]),
  },
  {
    id: "tax_commerce", label: "Commerce & manufacturing tax expenditures", group: "treasury_tax",
    groupLabel: "Treasury industrial tax expenditures", source: "Treasury Table 1 · Commerce (industrial)", color: TREASURY_COLORS[4], defaultOn: true,
    programs: ["CHIPS §48D fab ITC", "IRA manufacturing credits", "Industrial depreciation"],
    data: deflateSeries([
      11.27, 11.77, 12.19, 12.63, 13.12, 13.91, 14.72, 15.75, 16.89, 18.07, 34.1, 37.67, 40.8, 45.1, 48.67, 47.85,
      47.02, 46.2, 47.02, 47.95, 48.72, 45.52, 42.92, 40.3, 38.34, 41.18, 26.4, 22.74, 27.88, 30.6,
    ]),
  },
  {
    id: "tax_transport", label: "Transportation tax expenditures", group: "treasury_tax",
    groupLabel: "Treasury industrial tax expenditures", source: "Treasury Table 1 · Transportation", color: TREASURY_COLORS[5], defaultOn: true,
    data: deflateSeries([
      1.41, 1.47, 1.52, 1.58, 1.64, 1.74, 1.84, 1.97, 2.11, 2.26, 2.48, 2.74, 2.97, 3.28, 3.54, 3.48, 3.42, 3.36,
      3.42, 3.49, 3.36, 3.14, 2.96, 2.78, 2.64, 2.84, 1.76, 1.52, 1.64, 1.8,
    ]),
  },
  {
    id: "tariffs", label: "Customs duties (tariff revenue)", group: "tariff",
    groupLabel: "Tariff revenue", source: "BEA B235RC1A027NBEA", color: "#0ea5e9", defaultOn: true,
    data: seriesFromYears(TARIFF_REVENUE_B),
  },
];

export function sortForStack(components: SupportComponent[]): SupportComponent[] {
  return [...components].sort((a, b) => {
    const groupOrder =
      GROUP_STACK_ORDER.indexOf(a.group) - GROUP_STACK_ORDER.indexOf(b.group);
    if (groupOrder !== 0) return groupOrder;
    return COMPONENTS.findIndex((c) => c.id === a.id) - COMPONENTS.findIndex((c) => c.id === b.id);
  });
}

export const DEFAULT_ENABLED: Record<string, boolean> = Object.fromEntries(
  COMPONENTS.map((c) => [c.id, c.defaultOn]),
);

export type FilterPreset = "all" | "outlays" | "tax" | "industrial";

export const PRESET_OPTIONS: { value: FilterPreset; label: string }[] = [
  { value: "all", label: "All components" },
  { value: "outlays", label: "Direct outlays only (BEA)" },
  { value: "tax", label: "Tax expenditures only (Treasury)" },
  { value: "industrial", label: "Industrial (excl. housing)" },
];

export function applyPreset(preset: FilterPreset): Record<string, boolean> {
  const next: Record<string, boolean> = {};
  for (const c of COMPONENTS) {
    if (preset === "all") next[c.id] = true;
    else if (preset === "outlays") next[c.id] = c.group === "bea_outlay";
    else if (preset === "tax") next[c.id] = c.group === "treasury_tax";
    else if (preset === "industrial") next[c.id] = c.id !== "out_housing";
  }
  return next;
}

export function sumComponents(
  enabled: Record<string, boolean>,
  idx: number,
  groups?: ComponentGroup[],
): number {
  return COMPONENTS.filter(
    (c) => enabled[c.id] && (!groups || groups.includes(c.group)),
  ).reduce((s, c) => s + c.data[idx], 0);
}

export type YearRow = {
  year: number;
  subsidyOutlays: number;
  industrialTaxExp: number;
  totalSupport: number;
  tariffRevenue: number;
  netGap: number;
  supportRatio: number;
  outlayYoY: number | null;
  taxExpYoY: number | null;
  tariffYoY: number | null;
  gapYoY: number | null;
  isPandemic: boolean;
  isEstimate: boolean;
  keyEvent: string;
  commentary: string;
};

export function pctChange(cur: number, prev: number | null): number | null {
  if (prev === null || prev === 0) return null;
  return ((cur - prev) / Math.abs(prev)) * 100;
}

export function fmtB(n: number): string {
  if (Math.abs(n) >= 100) return `$${n.toFixed(0)}B`;
  if (Math.abs(n) >= 10) return `$${n.toFixed(1)}B`;
  return `$${n.toFixed(2)}B`;
}

export function fmtPct(n: number | null): string {
  if (n === null) return "—";
  return `${n >= 0 ? "+" : ""}${n.toFixed(1)}%`;
}

function buildCommentary(
  year: number,
  totalSupport: number,
  tariffRevenue: number,
  supportRatio: number,
): string {
  const qual = COMMENTARY[year] ?? "";
  const header = `${fmtB(totalSupport)} support vs ${fmtB(tariffRevenue)} tariffs (${supportRatio.toFixed(1)}×).`;
  return qual ? `${header} ${qual}` : header;
}

export function buildRows(enabled: Record<string, boolean>): YearRow[] {
  return YEARS.map((year, i) => {
    const prev = i > 0 ? i - 1 : null;

    const subsidyOutlays = sumComponents(enabled, i, ["bea_outlay"]);
    const industrialTaxExp = sumComponents(enabled, i, ["treasury_tax"]);
    const totalSupport = sumComponents(enabled, i, ["bea_outlay", "treasury_tax"]);
    const tariffRevenue = enabled.tariffs
      ? COMPONENTS.find((c) => c.id === "tariffs")!.data[i]
      : 0;
    const netGap = totalSupport - tariffRevenue;

    const prevOutlays = prev !== null ? sumComponents(enabled, prev, ["bea_outlay"]) : null;
    const prevTax = prev !== null ? sumComponents(enabled, prev, ["treasury_tax"]) : null;
    const prevTariff =
      prev !== null && enabled.tariffs
        ? COMPONENTS.find((c) => c.id === "tariffs")!.data[prev]
        : null;
    const prevSupport =
      prev !== null ? sumComponents(enabled, prev, ["bea_outlay", "treasury_tax"]) : null;
    const prevGap =
      prevSupport !== null && prevTariff !== null
        ? prevSupport - (enabled.tariffs ? prevTariff : 0)
        : null;

    const supportRatio = tariffRevenue > 0 ? totalSupport / tariffRevenue : 0;

    return {
      year,
      subsidyOutlays,
      industrialTaxExp,
      totalSupport,
      tariffRevenue,
      netGap,
      supportRatio,
      outlayYoY: prevOutlays !== null ? pctChange(subsidyOutlays, prevOutlays) : null,
      taxExpYoY: prevTax !== null ? pctChange(industrialTaxExp, prevTax) : null,
      tariffYoY: prevTariff !== null ? pctChange(tariffRevenue, prevTariff) : null,
      gapYoY: prevGap !== null ? netGap - prevGap : null,
      isPandemic: year === 2020 || year === 2021,
      isEstimate: year >= 2025,
      keyEvent: KEY_EVENTS[year] ?? "",
      commentary: buildCommentary(year, totalSupport, tariffRevenue, supportRatio),
    };
  });
}

export function avgRatio(rows: YearRow[]): number {
  const valid = rows.filter((r) => r.tariffRevenue > 0);
  return valid.reduce((s, r) => s + r.supportRatio, 0) / valid.length;
}

export function componentLabel(id: string): string {
  return COMPONENTS.find((c) => c.id === id)?.label ?? id;
}

export const SUBSIDY_DATA = buildRows(DEFAULT_ENABLED);
export const SUBSIDY_LAST = SUBSIDY_DATA[SUBSIDY_DATA.length - 1];
export const SUBSIDY_FIRST = SUBSIDY_DATA[0];

export const CHART_COLORS = {
  support: "#f59e0b",
  tariffs: "#0ea5e9",
  gap: "#ef4444",
  parity: "#64748b",
};
