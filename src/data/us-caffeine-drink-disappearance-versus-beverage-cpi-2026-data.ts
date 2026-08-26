/**
 * US caffeine-drink disappearance versus beverage CPI (1970–2026).
 *
 * Core question: Did USDA per-capita coffee and carbonated-soft-drink
 * disappearance keep rising while nonalcoholic beverage prices jumped?
 *
 * Method: Coffee = USDA ERS Food Availability archived coffee table
 * (green-bean and retail pounds per capita; fluid gallons = retail lb ×
 * 2.8125 from ERS 60×6-oz cups / 128 oz). CSD = USDA ERS / Statistical
 * Abstract gallons per capita through 1997; sparse post-1998 markers from
 * publicly cited industry composites (Beverage Digest / IBISWorld) because
 * ERS removed BMC soft-drink series from FADS. Prices = BLS CPI-U annual
 * averages for nonalcoholic beverages (CUUR0000SAF116), coffee
 * (CUUR0000SEFP01), and carbonated drinks (CUUR0000SEFW01). Indexes rebase
 * selected series to 1990 = 100. 2025 annuals omit Oct (appropriations
 * lapse); 2026 is Jan–Jul average where noted.
 */

export const SOURCE_NOTE =
  "USDA ERS Food Availability archived coffee, tea, cocoa & spices table (last updated Oct 2018; coffee through 2015). Carbonated soft-drink gallons 1970–1997 from USDA ERS as republished in Statistical Abstract of the United States (table on per-capita beverage consumption). Post-1998 CSD markers are sparse industry composites cited in open summaries (IBISWorld / Beverage Digest tradition) — ERS removed BMC soft-drink series from FADS at BMC’s request. BLS CPI-U: CUUR0000SAF116 (nonalcoholic beverages), CUUR0000SEFP01 (coffee), CUUR0000SEFW01 (carbonated drinks). Confidence: high on USDA coffee + BLS CPI; medium on post-1998 CSD levels.";

export const SOURCES = [
  {
    label: "USDA ERS — Food Availability (Per Capita) Data System",
    url: "https://www.ers.usda.gov/data-products/food-availability-per-capita-data-system",
  },
  {
    label: "USDA ERS — Coffee / tea / cocoa archived availability CSV",
    url: "https://www.ers.usda.gov/media/5327/coffee-tea-cocoa-and-spices-availability.csv",
  },
  {
    label: "BLS — CPI-U nonalcoholic beverages (CUUR0000SAF116)",
    url: "https://data.bls.gov/timeseries/CUUR0000SAF116",
  },
  {
    label: "BLS — CPI-U coffee (CUUR0000SEFP01)",
    url: "https://data.bls.gov/timeseries/CUUR0000SEFP01",
  },
  {
    label: "BLS — CPI-U carbonated drinks (CUUR0000SEFW01)",
    url: "https://data.bls.gov/timeseries/CUUR0000SEFW01",
  },
] as const;

/** ERS fluid conversion: 60 cups × 6 oz / 128 oz per gallon per retail pound */
export const COFFEE_GALLONS_PER_RETAIL_LB = 2.8125;

export const HEADLINE = {
  /** Coffee green-bean lb/capita, 2015 (ERS last year) */
  coffeeGreenBean2015: 10.23,
  /** Coffee green-bean lb/capita, 1995 trough */
  coffeeGreenBean1995: 7.88,
  /** Coffee green-bean lb/capita, 1970 */
  coffeeGreenBean1970: 13.63,
  /** Coffee recovery from 1995 trough to 2015, % */
  coffeeRecoveryPctFrom1995: 29.8,
  /** CSD gallons/capita, 1970 */
  csdGallons1970: 24.3,
  /** CSD gallons/capita, 1997 (USDA/Statistical Abstract peak in series) */
  csdGallons1997: 53.0,
  /** CSD industry-extension gallons, ~2021 */
  csdGallons2021Ext: 42.9,
  /** CSD industry-extension gallons, ~2025 */
  csdGallons2025Ext: 41.9,
  /** Beverage CPI 1990 annual */
  bevCpi1990: 129.3,
  /** Beverage CPI 2019 annual */
  bevCpi2019: 252.542,
  /** Beverage CPI 2025 annual (11 months; Oct missing) */
  bevCpi2025: 295.641,
  /** Beverage CPI 2026 YTD (Jan–Jul avg) */
  bevCpi2026Ytd: 300.109,
  /** Beverage CPI index 1990=100, 2025 */
  bevCpiIndex1990_2025: 228.6,
  /** Coffee volume index 1990=100, 2015 (green bean) */
  coffeeVolIndex1990_2015: 99.1,
  /** CSD volume index 1990=100, 1997 */
  csdVolIndex1990_1997: 114.5,
  /** CSD volume index 1990=100, 2025 extension */
  csdVolIndex1990_2025Ext: 90.5,
  /** Coffee CPI index 1990=100, 2025 */
  coffeeCpiIndex1990_2025: 226.1,
  /** Soda CPI index 1990=100, 2025 */
  sodaCpiIndex1990_2025: 225.3,
  /** Beverage CPI % change 2019→2025 */
  bevCpiPct2019to2025: 17.1,
  /** Coffee CPI % change 2019→2025 */
  coffeeCpiPct2019to2025: 37.5,
  /** Soda CPI % change 2019→2025 */
  sodaCpiPct2019to2025: 21.0,
  latestCoffeeYear: 2015,
  latestCsdUsdaYear: 1997,
  latestCpiYear: 2025,
} as const;

export const VIZ_MARKERS = [
  "Gallons and pounds versus beverage CPI",
  "Coffee disappearance recovered after 1995; soda volumes did not keep climbing",
] as const;

export type VolumeUnit = "coffeeGreenBean" | "coffeeGallons" | "csdGallons";
export type PriceSeries = "bev" | "coffee" | "soda";
export type IndexBase = "1990" | "2015";

export type AnnualRow = {
  year: number;
  coffeeGreenBeanLb: number | null;
  coffeeRetailLb: number | null;
  coffeeGallons: number | null;
  /** USDA / Statistical Abstract gallons; null when discontinued */
  csdGallonsUsda: number | null;
  /** Sparse industry extension after ERS removed BMC series */
  csdGallonsExt: number | null;
  bevCpi: number | null;
  coffeeCpi: number | null;
  sodaCpi: number | null;
};

/** USDA Statistical Abstract / ERS FCPE carbonated soft drinks, gallons/capita */
const CSD_USDA: Record<number, number> = {
  1970: 24.3,
  1975: 28.2,
  1980: 35.1,
  1981: 35.4,
  1982: 35.3,
  1983: 35.2,
  1984: 35.9,
  1985: 35.7,
  1986: 35.8,
  1987: 41.9,
  1988: 44.7,
  1989: 45.4,
  1990: 46.3,
  1991: 47.9,
  1992: 48.5,
  1993: 50.1,
  1994: 51.3,
  1995: 51.6,
  1996: 52.0,
  1997: 53.0,
};

/**
 * Sparse post-1998 CSD gallons from open industry summaries
 * (IBISWorld cites USDA/Beverage Digest tradition; levels approximate).
 */
const CSD_EXT: Record<number, number> = {
  2000: 53.0,
  2005: 51.0,
  2010: 46.0,
  2015: 43.5,
  2021: 42.9,
  2025: 41.9,
};

/** USDA ERS coffee per capita — green bean & retail lb */
const COFFEE_ERS: { year: number; greenBean: number; retail: number }[] = [
  { year: 1970, greenBean: 13.631, retail: 10.413 },
  { year: 1971, greenBean: 13.118, retail: 9.888 },
  { year: 1972, greenBean: 13.669, retail: 10.304 },
  { year: 1973, greenBean: 13.463, retail: 10.012 },
  { year: 1974, greenBean: 12.789, retail: 9.617 },
  { year: 1975, greenBean: 12.159, retail: 9.197 },
  { year: 1976, greenBean: 12.526, retail: 9.419 },
  { year: 1977, greenBean: 9.358, retail: 6.955 },
  { year: 1978, greenBean: 10.544, retail: 7.929 },
  { year: 1979, greenBean: 11.339, retail: 8.577 },
  { year: 1980, greenBean: 10.267, retail: 7.675 },
  { year: 1981, greenBean: 9.993, retail: 7.471 },
  { year: 1982, greenBean: 9.914, retail: 7.368 },
  { year: 1983, greenBean: 10.055, retail: 7.473 },
  { year: 1984, greenBean: 10.231, retail: 7.603 },
  { year: 1985, greenBean: 10.479, retail: 7.788 },
  { year: 1986, greenBean: 10.505, retail: 7.807 },
  { year: 1987, greenBean: 10.222, retail: 7.597 },
  { year: 1988, greenBean: 9.813, retail: 7.315 },
  { year: 1989, greenBean: 10.072, retail: 7.53 },
  { year: 1990, greenBean: 10.327, retail: 7.743 },
  { year: 1991, greenBean: 10.308, retail: 7.751 },
  { year: 1992, greenBean: 9.962, retail: 7.513 },
  { year: 1993, greenBean: 9.008, retail: 6.814 },
  { year: 1994, greenBean: 8.094, retail: 6.14 },
  { year: 1995, greenBean: 7.878, retail: 5.994 },
  { year: 1996, greenBean: 8.711, retail: 6.647 },
  { year: 1997, greenBean: 9.104, retail: 6.967 },
  { year: 1998, greenBean: 9.324, retail: 7.135 },
  { year: 1999, greenBean: 9.819, retail: 7.514 },
  { year: 2000, greenBean: 10.257, retail: 7.835 },
  { year: 2001, greenBean: 9.452, retail: 7.226 },
  { year: 2002, greenBean: 9.235, retail: 7.063 },
  { year: 2003, greenBean: 9.477, retail: 7.247 },
  { year: 2004, greenBean: 9.629, retail: 7.362 },
  { year: 2005, greenBean: 9.466, retail: 7.237 },
  { year: 2006, greenBean: 9.527, retail: 7.284 },
  { year: 2007, greenBean: 9.583, retail: 7.328 },
  { year: 2008, greenBean: 9.46, retail: 7.233 },
  { year: 2009, greenBean: 9.116, retail: 6.97 },
  { year: 2010, greenBean: 9.176, retail: 7.016 },
  { year: 2011, greenBean: 9.63, retail: 7.363 },
  { year: 2012, greenBean: 9.659, retail: 7.385 },
  { year: 2013, greenBean: 9.875, retail: 7.551 },
  { year: 2014, greenBean: 10.048, retail: 7.683 },
  { year: 2015, greenBean: 10.228, retail: 7.82 },
];

/** BLS CPI-U annual averages (2026 = Jan–Jul mean) */
const BEV_CPI: Record<number, number> = {
  1990: 129.3,
  1991: 142.8,
  1992: 147.3,
  1993: 149.6,
  1994: 151.5,
  1995: 153.9,
  1996: 158.5,
  1997: 162.8,
  1998: 165.7,
  1999: 169.7,
  2000: 174.7,
  2001: 179.3,
  2002: 183.6,
  2003: 187.2,
  2004: 192.1,
  2005: 195.9,
  2006: 200.7,
  2007: 207.026,
  2008: 214.484,
  2009: 220.751,
  2010: 223.291,
  2011: 226.685,
  2012: 230.8,
  2013: 234.623,
  2014: 237.305,
  2015: 239.53,
  2016: 242.526,
  2017: 245.419,
  2018: 249.134,
  2019: 252.542,
  2020: 257.246,
  2021: 262.829,
  2022: 273.967,
  2023: 285.414,
  2024: 290.809,
  2025: 295.641,
  2026: 300.109,
};

const COFFEE_CPI: Record<number, number> = {
  1990: 117.5,
  1991: 115.3,
  1992: 110.7,
  1993: 109.8,
  1994: 140.4,
  1995: 163.1,
  1996: 149.2,
  1997: 168.0,
  1998: 163.4,
  1999: 154.8,
  2000: 154.0,
  2001: 146.7,
  2002: 142.6,
  2003: 144.9,
  2004: 145.3,
  2005: 161.2,
  2006: 165.3,
  2007: 175.647,
  2008: 188.027,
  2009: 186.317,
  2010: 186.418,
  2011: 213.824,
  2012: 217.441,
  2013: 204.712,
  2014: 200.984,
  2015: 205.54,
  2016: 199.307,
  2017: 199.156,
  2018: 194.876,
  2019: 193.237,
  2020: 194.177,
  2021: 199.263,
  2022: 227.887,
  2023: 237.245,
  2024: 235.159,
  2025: 265.658,
  2026: 297.707,
};

const SODA_CPI: Record<number, number> = {
  1990: 123.6,
  1991: 138.4,
  1992: 143.5,
  1993: 143.2,
  1994: 143.4,
  1995: 143.9,
  1996: 147.4,
  1997: 148.2,
  1998: 148.5,
  1999: 151.9,
  2000: 156.8,
  2001: 160.7,
  2002: 164.7,
  2003: 168.5,
  2004: 174.6,
  2005: 176.4,
  2006: 178.1,
  2007: 184.125,
  2008: 190.32,
  2009: 197.448,
  2010: 201.0,
  2011: 203.878,
  2012: 207.581,
  2013: 211.069,
  2014: 213.79,
  2015: 215.026,
  2016: 218.937,
  2017: 222.924,
  2018: 225.956,
  2019: 230.114,
  2020: 238.062,
  2021: 242.278,
  2022: 254.36,
  2023: 267.426,
  2024: 275.409,
  2025: 278.482,
  2026: 283.943,
};

const coffeeByYear = new Map(COFFEE_ERS.map((r) => [r.year, r]));

function yearsUnion(): number[] {
  const s = new Set<number>();
  for (const y of COFFEE_ERS.map((r) => r.year)) s.add(y);
  for (const y of Object.keys(CSD_USDA).map(Number)) s.add(y);
  for (const y of Object.keys(CSD_EXT).map(Number)) s.add(y);
  for (const y of Object.keys(BEV_CPI).map(Number)) s.add(y);
  return [...s].sort((a, b) => a - b);
}

export const ANNUAL: AnnualRow[] = yearsUnion().map((year) => {
  const c = coffeeByYear.get(year);
  const retail = c?.retail ?? null;
  return {
    year,
    coffeeGreenBeanLb: c?.greenBean ?? null,
    coffeeRetailLb: retail,
    coffeeGallons:
      retail != null
        ? Math.round(retail * COFFEE_GALLONS_PER_RETAIL_LB * 1000) / 1000
        : null,
    csdGallonsUsda: CSD_USDA[year] ?? null,
    csdGallonsExt: CSD_EXT[year] ?? null,
    bevCpi: BEV_CPI[year] ?? null,
    coffeeCpi: COFFEE_CPI[year] ?? null,
    sodaCpi: SODA_CPI[year] ?? null,
  };
});

export function csdGallonsBest(row: AnnualRow): number | null {
  return row.csdGallonsUsda ?? row.csdGallonsExt;
}

export type IndexRow = {
  year: number;
  coffeeVol: number | null;
  csdVol: number | null;
  bevCpi: number | null;
  coffeeCpi: number | null;
  sodaCpi: number | null;
  /** Coffee volume − beverage CPI gap in index points (1990=100) */
  coffeeGapPp: number | null;
  csdGapPp: number | null;
};

function idx(val: number | null | undefined, base: number | null | undefined): number | null {
  if (val == null || base == null || base === 0) return null;
  return Math.round((val / base) * 1000) / 10;
}

const base1990Coffee = coffeeByYear.get(1990)!.greenBean;
const base1990Csd = CSD_USDA[1990];
const base1990Bev = BEV_CPI[1990];
const base1990CoffeeCpi = COFFEE_CPI[1990];
const base1990SodaCpi = SODA_CPI[1990];

export const INDEX_1990: IndexRow[] = ANNUAL.filter((r) => r.year >= 1990).map(
  (r) => {
    const coffeeVol = idx(r.coffeeGreenBeanLb, base1990Coffee);
    const csdVol = idx(csdGallonsBest(r), base1990Csd);
    const bevCpi = idx(r.bevCpi, base1990Bev);
    const coffeeCpi = idx(r.coffeeCpi, base1990CoffeeCpi);
    const sodaCpi = idx(r.sodaCpi, base1990SodaCpi);
    return {
      year: r.year,
      coffeeVol,
      csdVol,
      bevCpi,
      coffeeCpi,
      sodaCpi,
      coffeeGapPp:
        coffeeVol != null && bevCpi != null
          ? Math.round((coffeeVol - bevCpi) * 10) / 10
          : null,
      csdGapPp:
        csdVol != null && bevCpi != null
          ? Math.round((csdVol - bevCpi) * 10) / 10
          : null,
    };
  },
);

export type EraCompare = {
  era: string;
  years: string;
  coffeeGreenBean: number | null;
  csdGallons: number | null;
  bevCpi: number | null;
  note: string;
};

export const ERA_COMPARE: EraCompare[] = [
  {
    era: "1970 baseline",
    years: "1970",
    coffeeGreenBean: 13.63,
    csdGallons: 24.3,
    bevCpi: null,
    note: "High coffee disappearance; CSD still modest",
  },
  {
    era: "CSD boom peak",
    years: "1997",
    coffeeGreenBean: 9.1,
    csdGallons: 53.0,
    bevCpi: 162.8,
    note: "USDA CSD peak in Statistical Abstract series",
  },
  {
    era: "Coffee trough",
    years: "1995",
    coffeeGreenBean: 7.88,
    csdGallons: 51.6,
    bevCpi: 153.9,
    note: "Green-bean coffee per capita bottomed",
  },
  {
    era: "ERS coffee last print",
    years: "2015",
    coffeeGreenBean: 10.23,
    csdGallons: 43.5,
    bevCpi: 239.53,
    note: "Coffee recovered ~30% from 1995; CSD ext. down from peak",
  },
  {
    era: "Pre-spike prices",
    years: "2019",
    coffeeGreenBean: null,
    csdGallons: null,
    bevCpi: 252.54,
    note: "ERS coffee archive ends 2015; CPI still the price lens",
  },
  {
    era: "Post-spike CPI",
    years: "2025",
    coffeeGreenBean: null,
    csdGallons: 41.9,
    bevCpi: 295.64,
    note: "Beverage CPI +17% vs 2019; CSD ext. still below 1990",
  },
];

export type ScatterPoint = {
  year: number;
  label: string;
  volumeIndex: number;
  priceIndex: number;
  drink: "coffee" | "csd";
};

export const SCATTER_POINTS: ScatterPoint[] = INDEX_1990.filter(
  (r) =>
    (r.coffeeVol != null && r.bevCpi != null) ||
    (r.csdVol != null && r.bevCpi != null),
).flatMap((r) => {
  const out: ScatterPoint[] = [];
  if (r.coffeeVol != null && r.bevCpi != null) {
    out.push({
      year: r.year,
      label: `${r.year}`,
      volumeIndex: r.coffeeVol,
      priceIndex: r.bevCpi,
      drink: "coffee",
    });
  }
  if (r.csdVol != null && r.bevCpi != null && r.year % 5 === 0) {
    out.push({
      year: r.year,
      label: `${r.year}`,
      volumeIndex: r.csdVol,
      priceIndex: r.bevCpi,
      drink: "csd",
    });
  }
  return out;
});

export type DecadeBar = {
  decade: string;
  coffeeVolChangePct: number | null;
  csdVolChangePct: number | null;
  bevCpiChangePct: number | null;
};

function pctChange(
  later: number | null | undefined,
  earlier: number | null | undefined,
): number | null {
  if (later == null || earlier == null || earlier === 0) return null;
  return Math.round(((later - earlier) / earlier) * 1000) / 10;
}

export const DECADE_BARS: DecadeBar[] = [
  {
    decade: "1990s",
    coffeeVolChangePct: pctChange(
      coffeeByYear.get(1999)?.greenBean,
      base1990Coffee,
    ),
    csdVolChangePct: pctChange(CSD_USDA[1997], base1990Csd),
    bevCpiChangePct: pctChange(BEV_CPI[1999], base1990Bev),
  },
  {
    decade: "2000s",
    coffeeVolChangePct: pctChange(
      coffeeByYear.get(2009)?.greenBean,
      coffeeByYear.get(2000)?.greenBean,
    ),
    csdVolChangePct: pctChange(CSD_EXT[2010], CSD_EXT[2000]),
    bevCpiChangePct: pctChange(BEV_CPI[2009], BEV_CPI[2000]),
  },
  {
    decade: "2010s",
    coffeeVolChangePct: pctChange(
      coffeeByYear.get(2015)?.greenBean,
      coffeeByYear.get(2010)?.greenBean,
    ),
    csdVolChangePct: pctChange(CSD_EXT[2015], CSD_EXT[2010]),
    bevCpiChangePct: pctChange(BEV_CPI[2019], BEV_CPI[2010]),
  },
  {
    decade: "2020s*",
    coffeeVolChangePct: null,
    csdVolChangePct: pctChange(CSD_EXT[2025], CSD_EXT[2021]),
    bevCpiChangePct: pctChange(BEV_CPI[2025], BEV_CPI[2020]),
  },
];

export const DETAIL_TABLE = ANNUAL.filter(
  (r) =>
    r.year === 1970 ||
    r.year === 1980 ||
    r.year === 1990 ||
    r.year === 1995 ||
    r.year === 1997 ||
    r.year === 2000 ||
    r.year === 2005 ||
    r.year === 2010 ||
    r.year === 2015 ||
    r.year === 2019 ||
    r.year === 2021 ||
    r.year === 2025 ||
    r.year === 2026,
).map((r) => ({
  year: r.year,
  coffeeGreenBeanLb: r.coffeeGreenBeanLb,
  coffeeGallons: r.coffeeGallons,
  csdGallons: csdGallonsBest(r),
  csdSource: r.csdGallonsUsda != null ? "USDA/Abstract" : r.csdGallonsExt != null ? "Industry ext." : "—",
  bevCpi: r.bevCpi,
  coffeeCpi: r.coffeeCpi,
  sodaCpi: r.sodaCpi,
}));

export function fmtLb(n: number | null | undefined): string {
  if (n == null) return "—";
  return `${n.toFixed(2)} lb`;
}

export function fmtGal(n: number | null | undefined): string {
  if (n == null) return "—";
  return `${n.toFixed(1)} gal`;
}

export function fmtIndex(n: number | null | undefined): string {
  if (n == null) return "—";
  return n.toFixed(1);
}

export function fmtPct(n: number | null | undefined): string {
  if (n == null) return "—";
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(1)}%`;
}
