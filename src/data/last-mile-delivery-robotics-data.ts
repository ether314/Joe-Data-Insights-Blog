/** Global last-mile delivery robotics — snapshot July 2026. Sources: company IR, SEC filings, press releases. */

export const DATA_SNAPSHOT = "July 2026";

export const SOURCE_NOTE =
  "Fleet counts are most recent company disclosure (built/deployed, not always daily-active). Chinese robovan class (200–500 kg) and sidewalk class (10–30 kg) tracked separately. Drone and indoor-only robots excluded.";

export type FleetClass = "sidewalk" | "robovan";

export type FleetCompany = {
  name: string;
  fleet: number;
  fleetClass: FleetClass;
  hq: string;
  revenueUsdM: number | null;
  revenueNote: string;
  status: string;
};

export const FLEET_COMPANIES: FleetCompany[] = [
  { name: "Neolix", fleet: 25000, fleetClass: "robovan", hq: "Beijing", revenueUsdM: 140, revenueNote: "FY2025", status: "Largest fleet; HK IPO targeted 2026" },
  { name: "Zelos / Jiushi", fleet: 20000, fleetClass: "robovan", hq: "Suzhou", revenueUsdM: null, revenueNote: "Not disclosed", status: "Merged with Cainiao Jan 2026" },
  { name: "Starship", fleet: 3000, fleetClass: "sidewalk", hq: "Estonia / SF", revenueUsdM: null, revenueNote: "Group not disclosed", status: "Claims profitable; exited US campuses" },
  { name: "MINIEYE Robovan", fleet: 6000, fleetClass: "robovan", hq: "Shenzhen", revenueUsdM: 110, revenueNote: "Group FY2025", status: "Spinning off Jun 2026" },
  { name: "Serve Robotics", fleet: 2000, fleetClass: "sidewalk", hq: "San Francisco", revenueUsdM: 26, revenueNote: "FY2026 guide", status: "Public (Nasdaq: SERV)" },
  { name: "White Rhino", fleet: 2000, fleetClass: "robovan", hq: "China", revenueUsdM: null, revenueNote: "Not disclosed", status: "170 cities; 30–50% cost cut claimed" },
  { name: "Coco Robotics", fleet: 1000, fleetClass: "sidewalk", hq: "Santa Monica", revenueUsdM: null, revenueNote: "Not disclosed", status: "500k+ deliveries" },
  { name: "Kiwibot", fleet: 500, fleetClass: "sidewalk", hq: "Berkeley", revenueUsdM: 8, revenueNote: "FY2024", status: "Rebranded Robot.com" },
  { name: "Avride", fleet: 500, fleetClass: "sidewalk", hq: "Newburyport", revenueUsdM: null, revenueNote: "Nebius sub", status: "600k+ deliveries" },
  { name: "Neubility", fleet: 305, fleetClass: "sidewalk", hq: "Seoul", revenueUsdM: 4, revenueNote: "FY2025 guide", status: "Most units patrol, not food" },
  { name: "ROBOTIS AI (GAEMI)", fleet: 200, fleetClass: "sidewalk", hq: "Seoul", revenueUsdM: null, revenueNote: "<3% of parent", status: "Spun off Jun 2025" },
  { name: "Ottonomy.io", fleet: 50, fleetClass: "sidewalk", hq: "Sunnyvale", revenueUsdM: 5, revenueNote: "FY2026 target", status: "Airports & healthcare niche" },
];

export const SIDEWALK_FLEET = FLEET_COMPANIES.filter((c) => c.fleetClass === "sidewalk").reduce((s, c) => s + c.fleet, 0);
export const ROBOVAN_FLEET = FLEET_COMPANIES.filter((c) => c.fleetClass === "robovan").reduce((s, c) => s + c.fleet, 0);
export const TOTAL_FLEET = SIDEWALK_FLEET + ROBOVAN_FLEET;

export const GLOBAL_SUMMARY = {
  totalFleet: TOTAL_FLEET,
  sidewalkFleet: SIDEWALK_FLEET,
  robovanFleet: ROBOVAN_FLEET,
  robovanSharePct: Math.round((ROBOVAN_FLEET / TOTAL_FLEET) * 100),
  exitsCount: 23,
  topRobovan: "Neolix",
  topSidewalk: "Starship",
};

export type CityDeployment = {
  city: string;
  country: string;
  robots: number;
  operators: string;
  confidence: "Disclosed" | "Estimated" | "Reported";
};

export const CITY_DEPLOYMENTS: CityDeployment[] = [
  { city: "Qingdao", country: "China", robots: 1200, operators: "Neolix", confidence: "Disclosed" },
  { city: "Los Angeles", country: "USA", robots: 800, operators: "Serve, Coco", confidence: "Disclosed" },
  { city: "Shenzhen", country: "China", robots: 432, operators: "Neolix, MINIEYE, White Rhino", confidence: "Disclosed" },
  { city: "Abu Dhabi", country: "UAE", robots: 300, operators: "Neolix, Zelos", confidence: "Estimated" },
  { city: "Seoul + Songdo", country: "South Korea", robots: 250, operators: "Neubility, GAEMI, Baemin", confidence: "Estimated" },
  { city: "Helsinki region", country: "Finland", robots: 200, operators: "Starship, Coco", confidence: "Estimated" },
  { city: "Milton Keynes", country: "UK", robots: 120, operators: "Starship", confidence: "Estimated" },
  { city: "Chicago", country: "USA", robots: 100, operators: "Coco, Serve", confidence: "Disclosed" },
  { city: "Miami", country: "USA", robots: 90, operators: "Serve, Coco, Avride", confidence: "Estimated" },
  { city: "Dallas-Fort Worth", country: "USA", robots: 85, operators: "Serve, Avride", confidence: "Estimated" },
  { city: "Austin", country: "USA", robots: 70, operators: "Avride", confidence: "Estimated" },
  { city: "Atlanta", country: "USA", robots: 60, operators: "Serve", confidence: "Estimated" },
  { city: "Tokyo", country: "Japan", robots: 24, operators: "Rakuten, Panasonic, LOMBY", confidence: "Disclosed" },
  { city: "Dubai", country: "UAE", robots: 20, operators: "Yango, Neolix, Zelos", confidence: "Disclosed" },
];

export const REVENUE_DISCLOSED = FLEET_COMPANIES.filter((c) => c.revenueUsdM !== null)
  .sort((a, b) => (b.revenueUsdM ?? 0) - (a.revenueUsdM ?? 0));

export const FLEET_CLASS_COLORS = {
  sidewalk: "#06b6d4",
  robovan: "#f43f5e",
} as const;

export function fmtFleet(n: number): string {
  if (n >= 1000) return `~${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`;
  return n.toLocaleString();
}

export function fmtUsdM(n: number): string {
  return `$${n}M`;
}
