export type GdpYearRow = {
  year: number;
  chinaGdp: number;
  usGdp: number;
  indiaGdp: number;
  chinaPop: number;
  usPop: number;
  indiaPop: number;
  chinaYoY: number | null;
  usYoY: number | null;
  indiaYoY: number | null;
  growthDiff: number | null;
  chinaPerCap: number;
  usPerCap: number;
  indiaPerCap: number;
  chinaUsRatio: number;
  isEstimate: boolean;
};

const US_CPI_YOY: Record<number, number> = {
  1995: 2.805, 1996: 2.931, 1997: 2.338, 1998: 1.552, 1999: 2.188,
  2000: 3.377, 2001: 2.826, 2002: 1.586, 2003: 2.27, 2004: 2.677,
  2005: 3.393, 2006: 3.226, 2007: 2.853, 2008: 3.839, 2009: -0.356,
  2010: 1.64, 2011: 3.157, 2012: 2.069, 2013: 1.465, 2014: 1.622,
  2015: 0.119, 2016: 1.262, 2017: 2.13, 2018: 2.443, 2019: 1.812,
  2020: 1.234, 2021: 4.698, 2022: 8.003, 2023: 4.116, 2024: 2.95,
  2025: 2.9, 2026: 3.5,
};

const NOMINAL_GDP_B: Record<number, [number, number, number]> = {
  1995: [738.19, 7639.75, 360.28], 1996: [868.52, 8073.12, 392.9],
  1997: [967.75, 8577.55, 415.87], 1998: [1037.13, 9062.82, 421.35],
  1999: [1103.84, 9631.17, 458.82], 2000: [1223.75, 10250.95, 468.4],
  2001: [1355.04, 10581.93, 485.44], 2002: [1489.82, 10929.11, 514.94],
  2003: [1683.9, 11456.45, 607.7], 2004: [1984.2, 12217.2, 709.15],
  2005: [2317.55, 13039.2, 820.38], 2006: [2791.5, 13815.58, 940.26],
  2007: [3604.06, 14474.23, 1217.37], 2008: [4667.35, 14769.86, 1198.9],
  2009: [5189.58, 14478.07, 1341.89], 2010: [6192.56, 15048.97, 1675.62],
  2011: [7671.76, 15599.73, 1823.05], 2012: [8673.66, 16253.97, 1827.64],
  2013: [9743.12, 16880.68, 1856.72], 2014: [10674.53, 17608.14, 2039.13],
  2015: [11280.81, 18295.02, 2103.59], 2016: [11456.02, 18804.91, 2294.8],
  2017: [12537.56, 19612.1, 2651.47], 2018: [14147.77, 20656.52, 2702.93],
  2019: [14560.17, 21539.98, 2835.61], 2020: [14996.41, 21375.28, 2674.85],
  2021: [18201.7, 23725.65, 3167.27], 2022: [18316.77, 26054.61, 3346.11],
  2023: [18270.36, 27811.52, 3638.49], 2024: [18743.8, 29298.01, 3909.89],
  2025: [19498.04, 30769.7, 3956.07], 2026: [20851.59, 32383.92, 4153.19],
};

const POP_M: Record<number, [number, number, number]> = {
  1995: [1204.86, 266.28, 960.3], 1996: [1217.55, 269.39, 979.68],
  1997: [1230.08, 272.66, 999.13], 1998: [1241.94, 275.85, 1018.67],
  1999: [1252.74, 279.04, 1038.23], 2000: [1262.65, 282.16, 1057.92],
  2001: [1271.85, 284.97, 1077.9], 2002: [1280.4, 287.63, 1097.6],
  2003: [1288.4, 290.11, 1116.8], 2004: [1296.08, 292.81, 1135.99],
  2005: [1303.72, 295.52, 1154.68], 2006: [1311.02, 298.38, 1172.88],
  2007: [1317.89, 301.23, 1190.68], 2008: [1324.66, 304.09, 1207.93],
  2009: [1331.26, 306.77, 1225.52], 2010: [1337.71, 309.38, 1243.48],
  2011: [1345.04, 311.84, 1261.22], 2012: [1354.19, 314.34, 1278.67],
  2013: [1363.24, 316.73, 1295.83], 2014: [1371.86, 319.26, 1312.28],
  2015: [1379.86, 321.82, 1328.02], 2016: [1387.79, 324.35, 1343.94],
  2017: [1396.22, 326.61, 1359.66], 2018: [1402.76, 328.53, 1374.66],
  2019: [1407.75, 330.23, 1389.03], 2020: [1411.1, 331.58, 1402.62],
  2021: [1412.36, 332.1, 1414.2], 2022: [1412.18, 334.0, 1425.42],
  2023: [1410.71, 336.76, 1438.07], 2024: [1408.98, 340.0, 1450.94],
  2025: [1407.5, 341.78, 1464.5], 2026: [1402.43, 342.94, 1476.43],
};

function buildCpiIndex(): Record<number, number> {
  const years = Object.keys(US_CPI_YOY).map(Number).sort((a, b) => a - b);
  const index: Record<number, number> = {};
  let idx = 100;
  index[years[0]] = idx;
  for (let i = 1; i < years.length; i++) {
    idx *= 1 + US_CPI_YOY[years[i]] / 100;
    index[years[i]] = idx;
  }
  return index;
}

function pctChange(curr: number, prev: number): number {
  return ((curr - prev) / prev) * 100;
}

function buildRows(): GdpYearRow[] {
  const cpiIndex = buildCpiIndex();
  const base2025 = cpiIndex[2025];
  const years = Object.keys(NOMINAL_GDP_B).map(Number).sort((a, b) => a - b);
  const rows: GdpYearRow[] = [];

  for (let i = 0; i < years.length; i++) {
    const year = years[i];
    const [cnNom, usNom, inNom] = NOMINAL_GDP_B[year];
    const [chinaPop, usPop, indiaPop] = POP_M[year];
    const to2025 = base2025 / cpiIndex[year];
    const chinaGdp = cnNom * to2025;
    const usGdp = usNom * to2025;
    const indiaGdp = inNom * to2025;
    const prev = i > 0 ? rows[i - 1] : null;
    const chinaYoY = prev ? pctChange(chinaGdp, prev.chinaGdp) : null;
    const usYoY = prev ? pctChange(usGdp, prev.usGdp) : null;
    const indiaYoY = prev ? pctChange(indiaGdp, prev.indiaGdp) : null;
    const growthDiff = chinaYoY !== null && usYoY !== null ? chinaYoY - usYoY : null;

    rows.push({
      year,
      chinaGdp,
      usGdp,
      indiaGdp,
      chinaPop,
      usPop,
      indiaPop,
      chinaYoY,
      usYoY,
      indiaYoY,
      growthDiff,
      chinaPerCap: (chinaGdp * 1e9) / (chinaPop * 1e6),
      usPerCap: (usGdp * 1e9) / (usPop * 1e6),
      indiaPerCap: (indiaGdp * 1e9) / (indiaPop * 1e6),
      chinaUsRatio: (chinaGdp / usGdp) * 100,
      isEstimate: year >= 2025,
    });
  }
  return rows;
}

export const GDP_DATA = buildRows();
export const GDP_FIRST = GDP_DATA[0];
export const GDP_LAST = GDP_DATA[GDP_DATA.length - 1];

export function fmtT(n: number): string {
  if (n >= 1000) return `$${(n / 1000).toFixed(2)}T`;
  return `$${n.toFixed(1)}B`;
}

export function fmtPct(n: number | null, digits = 1): string {
  if (n === null) return "—";
  return `${n >= 0 ? "+" : ""}${n.toFixed(digits)}%`;
}

export function fmtUsd(n: number): string {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export const CHART_COLORS = {
  china: "#DB704B",
  us: "#3685BF",
  india: "#1F8A65",
} as const;
