import { fmtBillionsUsd } from "@/lib/fmt-billions-usd";

export type ProjectStatus = "Operational" | "Under Construction" | "Planned" | "Partially Live";
export type BuildPhase = "Not Started" | "Started";

export { fmtBillionsUsd };

export type Site = {
  site: string;
  country: string;
  developer: string;
  costUsd: string;
  powerMw: number;
  completion: string;
  status: ProjectStatus;
  region: string;
};

export const SITES: Site[] = [

  // ── US: Stargate ──
  { site: "Stargate Abilene (flagship)", country: "USA", developer: "OpenAI / Oracle / SoftBank", costUsd: "~$400B program", powerMw: 1200, completion: "Mid-2026 (8 buildings)", status: "Partially Live", region: "North America" },
  { site: "Stargate Shackelford / Vantage Frontier", country: "USA", developer: "Vantage / OpenAI / Oracle", costUsd: "$25B+", powerMw: 1400, completion: "Bldg 1: H2 2026; full build-out TBD", status: "Under Construction", region: "North America" },
  { site: "Stargate Michigan (Saline Township / The Barn)", country: "USA", developer: "OpenAI / Oracle / Related Digital", costUsd: "~$10B", powerMw: 1000, completion: "2026 (construction begun)", status: "Under Construction", region: "North America" },
  { site: "Vantage Lighthouse (Port Washington, WI)", country: "USA", developer: "Vantage / OpenAI / Oracle", costUsd: "Part of Stargate", powerMw: 1000, completion: "2028", status: "Under Construction", region: "North America" },
  { site: "Stargate El Paso area", country: "USA", developer: "Oracle / Stargate", costUsd: "Part of Stargate", powerMw: 800, completion: "2027–2028", status: "Planned", region: "North America" },
  { site: "Stargate Albuquerque area", country: "USA", developer: "Oracle / Stargate", costUsd: "Part of Stargate", powerMw: 600, completion: "2027–2028", status: "Planned", region: "North America" },
  { site: "Stargate Milam County", country: "USA", developer: "SoftBank / OpenAI / SB Energy", costUsd: "Part of Stargate", powerMw: 1100, completion: "2027", status: "Under Construction", region: "North America" },
  { site: "Stargate Doña Ana County", country: "USA", developer: "Oracle / STACK / BorderPlex", costUsd: "Part of Stargate", powerMw: 600, completion: "Project Jupiter; active build 2026", status: "Under Construction", region: "North America" },
  { site: "Stargate Lordstown", country: "USA", developer: "SoftBank / OpenAI", costUsd: "Part of Stargate", powerMw: 1000, completion: "2027", status: "Under Construction", region: "North America" },

  // ── US: Hyperscalers ──
  { site: "Fairwater (Mount Pleasant, WI)", country: "USA", developer: "Microsoft", costUsd: "$7.3B", powerMw: 2000, completion: "Early 2026 (Bldg 1 live)", status: "Partially Live", region: "North America" },
  { site: "Fairwater Atlanta (East US 3)", country: "USA", developer: "Microsoft", costUsd: "Part of AI superfactory", powerMw: 500, completion: "Oct 2025 live", status: "Operational", region: "North America" },
  { site: "Colossus 1 (Memphis, TN)", country: "USA", developer: "xAI", costUsd: "~$18B (full campus)", powerMw: 500, completion: "2025", status: "Operational", region: "North America" },
  { site: "Colossus 2 (Southaven, MS)", country: "USA", developer: "xAI", costUsd: "~$18B (full campus)", powerMw: 1000, completion: "2025", status: "Operational", region: "North America" },
  { site: "Colossus 3 / MACROHARDRR", country: "USA", developer: "xAI", costUsd: "~$18B (full campus)", powerMw: 500, completion: "Q2–Q3 2026", status: "Under Construction", region: "North America" },
  { site: "Meta Prometheus (New Albany, OH)", country: "USA", developer: "Meta", costUsd: "~$15.6B", powerMw: 1100, completion: "2026", status: "Under Construction", region: "North America" },
  { site: "Meta Hyperion (Richland Parish, LA)", country: "USA", developer: "Meta / Entergy", costUsd: "$27B–$200B", powerMw: 5000, completion: "Phase 1: late 2027; full: 2030", status: "Under Construction", region: "North America" },
  { site: "AWS Project Rainier (New Carlisle, IN)", country: "USA", developer: "AWS / Anthropic", costUsd: "$26B", powerMw: 2200, completion: "Phase 1: Oct 2025; full: 2030", status: "Partially Live", region: "North America" },
  { site: "AWS Rainier (Canton, MS)", country: "USA", developer: "AWS", costUsd: "Part of Rainier", powerMw: 1000, completion: "Ramping 2026–2028", status: "Partially Live", region: "North America" },
  { site: "AWS Pennsylvania campuses", country: "USA", developer: "AWS", costUsd: "$20B", powerMw: 960, completion: "2027–2029", status: "Planned", region: "North America" },
  { site: "CoreWeave Lancaster, PA", country: "USA", developer: "CoreWeave", costUsd: "$6B", powerMw: 300, completion: "2027–2028", status: "Planned", region: "North America" },
  { site: "Google PJM region (PA + 13 states)", country: "USA", developer: "Google", costUsd: "$25B", powerMw: 1500, completion: "2026–2028", status: "Under Construction", region: "North America" },
  { site: "Blackstone / QTS Northeast PA", country: "USA", developer: "Blackstone / QTS", costUsd: "$25B", powerMw: 800, completion: "Construction start: 2028", status: "Planned", region: "North America" },
  { site: "Delta Gigasite (Utah)", country: "USA", developer: "Creekstone Energy", costUsd: "$17.08B (20-yr program; Utah GOEO incl. power gen + DC)", powerMw: 10000, completion: "Phase 1 power: H1 2027; first IT ~2026; full 10 GW over ~20 yrs", status: "Under Construction", region: "North America" },
  { site: "Vantage Nevada campus", country: "USA", developer: "Vantage Data Centers", costUsd: "$3B", powerMw: 500, completion: "2027–2028", status: "Planned", region: "North America" },
  { site: "Crusoe Abilene (Oracle / OpenAI campus)", country: "USA", developer: "Crusoe", costUsd: "Part of Stargate", powerMw: 1200, completion: "Phase 2: end 2026", status: "Partially Live", region: "North America" },
  { site: "Crusoe Abilene (Microsoft campus)", country: "USA", developer: "Crusoe / Microsoft", costUsd: "~$5–13B est. (analyst/blog incl. on-site gen; weak — no official capex)", powerMw: 900, completion: "First bldg: mid-2027", status: "Under Construction", region: "North America" },
  { site: "Fluidstack New Lebanon, IN", country: "USA", developer: "Fluidstack / Google-backed JV", costUsd: "$5.7B", powerMw: 430, completion: "300 MW: Dec 2026", status: "Under Construction", region: "North America" },
  { site: "Potentia Heartland Park (Sullivan County, IN)", country: "USA", developer: "Potentia", costUsd: "$65B (program)", powerMw: 2100, completion: "2028–2030", status: "Planned", region: "North America" },
  { site: "Project Jade (Cheyenne, WY)", country: "USA", developer: "Tallgrass Energy", costUsd: "Up to $50B", powerMw: 2700, completion: "First bldg: end 2027", status: "Under Construction", region: "North America" },
  { site: "Prometheus Hyperscale (Evanston, WY)", country: "USA", developer: "Prometheus Hyperscale", costUsd: "TBD", powerMw: 1250, completion: "48–60 mo from permit", status: "Planned", region: "North America" },
  { site: "Bell AI Fabric (Regina, SK)", country: "Canada", developer: "Bell / CoreWeave / Cerebras", costUsd: "CAD $1.7B (~$1.2B)", powerMw: 300, completion: "H1 2027 (staged)", status: "Under Construction", region: "North America" },
  { site: "Buzz HPC Toronto (GTA)", country: "Canada", developer: "Hive / Buzz HPC", costUsd: "$2.55B", powerMw: 320, completion: "H2 2027", status: "Planned", region: "North America" },
  { site: "Beacon AI Alberta campuses", country: "Canada", developer: "Beacon AI Centers", costUsd: "~$7.2B est. (C$10B / Financial Post; medium — 4.5 GW portfolio total)", powerMw: 4500, completion: "2028–2030", status: "Planned", region: "North America" },
  { site: "Wonder Valley Alberta (Phase 1)", country: "Canada", developer: "O'Leary Digital", costUsd: "$12B phase / $70B program", powerMw: 1400, completion: "Permitting; power from 2028", status: "Planned", region: "North America" },
  { site: "Wonder Valley Utah", country: "USA", developer: "O'Leary Digital / West GenCo", costUsd: "Part of $70B program", powerMw: 7500, completion: "Permitting underway", status: "Planned", region: "North America" },
  { site: "Meta El Paso AI campus", country: "USA", developer: "Meta", costUsd: "$10B", powerMw: 1000, completion: "2028", status: "Under Construction", region: "North America" },
  { site: "Related Digital Cheyenne (CoreWeave)", country: "USA", developer: "Related Digital / CoreWeave", costUsd: "$1.2B", powerMw: 302, completion: "88 MW phase: late 2026", status: "Under Construction", region: "North America" },
  { site: "CoreWeave Muskogee (Core Scientific)", country: "USA", developer: "CoreWeave / Core Scientific", costUsd: "Part of $8.7B contract", powerMw: 70, completion: "Q2 2026", status: "Under Construction", region: "North America" },
  { site: "Core Scientific Pecos AI campus", country: "USA", developer: "Core Scientific", costUsd: "~$11B est. (CORZ ~$11M/MW build cost; ~1 GW leasable; medium confidence)", powerMw: 1500, completion: "First hall vertical; live early 2027", status: "Under Construction", region: "North America" },
  { site: "eStruxture CAL-3 Calgary", country: "Canada", developer: "eStruxture / CoreWeave", costUsd: "C$1B+ (Alberta program)", powerMw: 90, completion: "H2 2026", status: "Under Construction", region: "North America" },

  // ── Latin America ──
  { site: "Ascenty Sumaré 3 (São Paulo, BR)", country: "Brazil", developer: "Ascenty / Brookfield", costUsd: "$720M", powerMw: 400, completion: "Q3 2027", status: "Under Construction", region: "Latin America" },
  { site: "Ascenty Vinhedo expansion (SP, BR)", country: "Brazil", developer: "Ascenty", costUsd: "$360M", powerMw: 250, completion: "Q4 2027+", status: "Under Construction", region: "Latin America" },
  { site: "RT-One Uberlândia (MG, BR)", country: "Brazil", developer: "RT-One / Siemens", costUsd: "$1.2B (both campuses)", powerMw: 400, completion: "100 MW phase: 2027", status: "Under Construction", region: "Latin America" },
  { site: "RT-One Maringá (PR, BR)", country: "Brazil", developer: "RT-One / Siemens", costUsd: "Part of RT-One $1.2B program", powerMw: 400, completion: "100 MW phase: 2027–2028", status: "Planned", region: "Latin America" },
  { site: "CloudHQ QRO Campus (Querétaro)", country: "Mexico", developer: "CloudHQ", costUsd: "$4.8B", powerMw: 900, completion: "2027", status: "Under Construction", region: "Latin America" },
  { site: "Google Project Hera (Querétaro)", country: "Mexico", developer: "Google", costUsd: "$2B", powerMw: 250, completion: "Phase 1: 2027; full: 2029", status: "Under Construction", region: "Latin America" },

  // ── Middle East ──
  { site: "Stargate UAE (Abu Dhabi campus)", country: "UAE", developer: "G42 / OpenAI / Oracle / Nvidia", costUsd: "$30B+", powerMw: 5000, completion: "200 MW phase: Q3 2026", status: "Under Construction", region: "Middle East" },
  { site: "Humain AI factories (Riyadh)", country: "Saudi Arabia", developer: "Humain (PIF)", costUsd: "~$2.0B est. (pro-rata share of $77B Humain program; weak per-site split)", powerMw: 170, completion: "2026–2027", status: "Under Construction", region: "Middle East" },
  { site: "Humain AI factories (NEOM)", country: "Saudi Arabia", developer: "Humain (PIF)", costUsd: "~$2.0B est. (pro-rata share of $77B Humain program; weak per-site split)", powerMw: 170, completion: "2027–2028", status: "Planned", region: "Middle East" },
  { site: "Humain AI factories (Eastern Province)", country: "Saudi Arabia", developer: "Humain (PIF)", costUsd: "~$1.9B est. (pro-rata share of $77B Humain program; weak per-site split)", powerMw: 160, completion: "2027–2028", status: "Planned", region: "Middle East" },
  { site: "DataVolt NEOM Oxagon", country: "Saudi Arabia", developer: "DataVolt", costUsd: "$5B est. (Reuters/NEOM phase 1 funding; high confidence — phase only)", powerMw: 1500, completion: "2028–2030", status: "Planned", region: "Middle East" },
  { site: "Microsoft Saudi Arabia East", country: "Saudi Arabia", developer: "Microsoft", costUsd: "~$2.1B est. (MCIT/Reuters 2023 region capex; medium — not site-specific)", powerMw: 120, completion: "Q4 2026", status: "Under Construction", region: "Middle East" },
  { site: "Syntys Qatar hyperscale (Q Data)", country: "Qatar", developer: "Syntys / Ooredoo", costUsd: "~$210M est. (~$8M/MW proxy; weak — acquisition terms undisclosed)", powerMw: 26, completion: "7.5 MW expansion in progress", status: "Partially Live", region: "Middle East" },
  { site: "Meeza Qatar AI expansion", country: "Qatar", developer: "Meeza", costUsd: "$219M (QAR 800M facility)", powerMw: 44, completion: "24 MW phase; 6 MW AI-dedicated", status: "Under Construction", region: "Middle East" },

  // ── Europe ──
  { site: "SoftBank France (Dunkirk / Bosquel / Bouchain)", country: "France", developer: "SoftBank / Sesterce / EDF", costUsd: "€75B (~$80B)", powerMw: 5000, completion: "3.1 GW by 2031", status: "Planned", region: "Europe" },
  { site: "Campus AI Fouju (Paris region)", country: "France", developer: "MGX / Mistral / Nvidia / Bpifrance", costUsd: "€5B+ (campus)", powerMw: 1400, completion: "2028–2030", status: "Under Construction", region: "Europe" },
  { site: "Verne Île-de-France campus", country: "France", developer: "Ardian / Verne", costUsd: "€5B", powerMw: 500, completion: "200+ MW by 2030", status: "Planned", region: "Europe" },
  { site: "Google St. Ghislain expansion", country: "Belgium", developer: "Google", costUsd: "€5B", powerMw: 300, completion: "2026–2027", status: "Under Construction", region: "Europe" },
  { site: "Google Waltham Cross", country: "UK", developer: "Google", costUsd: "Part of £5B UK program", powerMw: 150, completion: "Sep 2025 (opened)", status: "Operational", region: "Europe" },
  { site: "Microsoft Leeds (Skelton Grange)", country: "UK", developer: "Microsoft", costUsd: "Part of £15.5B UK capex", powerMw: 200, completion: "Construction start: 2027", status: "Planned", region: "Europe" },
  { site: "Nscale Stargate Norway (Narvik)", country: "Norway", developer: "Nscale / Microsoft", costUsd: "$6.2B+ (region)", powerMw: 520, completion: "230 MW phase: 2026–2027", status: "Under Construction", region: "Europe" },
  { site: "Baltic Data Center Campus (Choczewo)", country: "Poland", developer: "WBS Power", costUsd: "$8–10B (Phase 1)", powerMw: 3200, completion: "First DC: 2028–2029", status: "Planned", region: "Europe" },
  { site: "EdgeConneX Skellefteå campus", country: "Sweden", developer: "EdgeConneX / EQT", costUsd: "TBD", powerMw: 1000, completion: "2029–2030", status: "Planned", region: "Europe" },
  { site: "WBS Project Jupiter (Finsterwalde)", country: "Germany", developer: "WBS / Prime Capital", costUsd: "€500M", powerMw: 500, completion: "2028–2029", status: "Planned", region: "Europe" },
  { site: "Start Campus SINES (Sines, PT)", country: "Portugal", developer: "Start Campus / Nscale / Microsoft", costUsd: "€8.5B (~$9B)", powerMw: 1200, completion: "SIN01 live; scale to 1.2 GW", status: "Partially Live", region: "Europe" },
  { site: "CoreWeave Stockholm (Conapto)", country: "Sweden", developer: "CoreWeave / Conapto", costUsd: "~$1.1B est. (~$7M/MW proxy; weak — colocation lease, no build capex)", powerMw: 150, completion: "2026 (initial online)", status: "Partially Live", region: "Europe" },

  // ── Asia-Pacific ──
  { site: "Google AI Hub Visakhapatnam (Vizag)", country: "India", developer: "Google / AdaniConneX / Airtel", costUsd: "$15B", powerMw: 1000, completion: "Inauguration: Sep 2028", status: "Under Construction", region: "Asia-Pacific" },
  { site: "Reliance Vizag AI cluster", country: "India", developer: "Reliance", costUsd: "$17B (₹1.6L cr)", powerMw: 1500, completion: "500 MW: Oct 2028; full: 2030", status: "Planned", region: "Asia-Pacific" },
  { site: "Reliance Jamnagar sovereign AI backbone", country: "India", developer: "Reliance Intelligence", costUsd: "Part of $110B program", powerMw: 120, completion: "End 2026", status: "Under Construction", region: "Asia-Pacific" },
  { site: "GMI Cloud AI Factory (Kagoshima)", country: "Japan", developer: "GMI Cloud / Wistron", costUsd: "$12B", powerMw: 1000, completion: "350 MW start: late 2026", status: "Planned", region: "Asia-Pacific" },
  { site: "NTT TKY12 (Chiba / Inzai-Shiroi)", country: "Japan", developer: "NTT GDC", costUsd: "~$2.2B est. (~$11M/MW proxy; weak — no public capex)", powerMw: 200, completion: "2030+", status: "Under Construction", region: "Asia-Pacific" },
  { site: "NTT TKY11 (Chiba)", country: "Japan", developer: "NTT GDC", costUsd: "~$550M est. (~$11M/MW proxy; weak — no public capex)", powerMw: 50, completion: "Apr 2027", status: "Under Construction", region: "Asia-Pacific" },
  { site: "TM Nxera Johor AI campus", country: "Malaysia", developer: "TM Nxera", costUsd: "~$2.3B est. (RM9B campus / Light Reading; medium-high confidence)", powerMw: 200, completion: "2H 2026", status: "Under Construction", region: "Asia-Pacific" },
  { site: "STT GDC Jakarta expansion", country: "Indonesia", developer: "ST Telemedia GDC", costUsd: "~$4B est. (~$11M/MW full campus; weak — $500M loan is partial tranche)", powerMw: 360, completion: "2027–2029", status: "Under Construction", region: "Asia-Pacific" },
  { site: "Microsoft Denmark East region", country: "Denmark", developer: "Microsoft", costUsd: "Part of EU sovereign cloud", powerMw: 100, completion: "Q4 2026", status: "Under Construction", region: "Europe" },
  { site: "Singapore Jurong Island DC Park", country: "Singapore", developer: "Multiple (gov-led)", costUsd: "700 MW program", powerMw: 700, completion: "2028–2030", status: "Planned", region: "Asia-Pacific" },
  { site: "IREN Bundey campus (South Australia)", country: "Australia", developer: "IREN", costUsd: "~$10B", powerMw: 800, completion: "Energization from 2028", status: "Planned", region: "Asia-Pacific" },
  { site: "Stock Farm Road AI SuperCluster (Haenam)", country: "South Korea", developer: "Stock Farm Road / Jeollanam-do", costUsd: "$10B–$35B", powerMw: 3000, completion: "2028", status: "Planned", region: "Asia-Pacific" },
  { site: "Google Cloud Bangkok region", country: "Thailand", developer: "Google", costUsd: "$1B", powerMw: 150, completion: "Live Jan 2026; scale to 150 MW", status: "Operational", region: "Asia-Pacific" },
  { site: "Microsoft Thailand cloud region", country: "Thailand", developer: "Microsoft / Gulf / AIS", costUsd: "$1B+", powerMw: 120, completion: "GSA02 UC; region 2026–2028", status: "Under Construction", region: "Asia-Pacific" },
  { site: "Da Nang AI campus (HTP)", country: "Vietnam", developer: "Create Capital / Haimaker / DataGen", costUsd: "$1B", powerMw: 100, completion: "50 MW: Q3 2027; up to 250 MW", status: "Under Construction", region: "Asia-Pacific" },
  { site: "STT VNG Ho Chi Minh City 2", country: "Vietnam", developer: "ST Telemedia GDC / VNG", costUsd: "~$480M est. ($7–10M/MW per STT CEO; 60 MW bldg only; medium confidence)", powerMw: 60, completion: "H1 2026", status: "Under Construction", region: "Asia-Pacific" },
  { site: "G42 / FPT sovereign AI Vietnam", country: "Vietnam", developer: "G42 / FPT / Viet Thai", costUsd: "$1B framework", powerMw: 200, completion: "3-site program from 2026", status: "Planned", region: "Asia-Pacific" },
  { site: "Viettel Hòa Lạc 2 AI factory", country: "Vietnam", developer: "Viettel", costUsd: "~$630M est. (VND6T for 30 MW built, scaled to 80 MW; weak — likely high)", powerMw: 80, completion: "Live (H200 / DGX B200)", status: "Operational", region: "Asia-Pacific" },
  { site: "MediaTek Miaoli AI data center", country: "Taiwan", developer: "MediaTek", costUsd: "~$300M est. (NT$9.41B company disclosure; high confidence)", powerMw: 45, completion: "15 MW phase live; full: phased", status: "Partially Live", region: "Asia-Pacific" },
  { site: "BW Digital Batam (Nongsa Park)", country: "Indonesia", developer: "BW Digital / Citramas", costUsd: "~$460M est. (~$5.7M/MW vs DayOne Batam comp; weak — no public capex)", powerMw: 80, completion: "TBD", status: "Planned", region: "Asia-Pacific" },
  { site: "DayOne Nongsa Batam campus", country: "Indonesia", developer: "DayOne Data Centres / INA", costUsd: "$412M est. (IDR 6.7T loan / DBS; high confidence)", powerMw: 72, completion: "Live 2025 (72 MW committed)", status: "Operational", region: "Asia-Pacific" },
  { site: "SK Group Nghe An AI DC (feasibility)", country: "Vietnam", developer: "SK Innovation / SK Telecom", costUsd: "~$1.1B est. (~$7M/MW proxy; weak — feasibility stage only)", powerMw: 150, completion: "Feasibility with Quynh Lap LNG", status: "Planned", region: "Asia-Pacific" },
  { site: "CoreWeave UK expansion", country: "UK", developer: "CoreWeave", costUsd: "£1.5B add-on (£2.5B total)", powerMw: 200, completion: "2026–2028", status: "Under Construction", region: "Europe" },
  { site: "EU Gigafactory: Scaleway AION (France)", country: "France", developer: "Scaleway / AION consortium", costUsd: "Part of €230B EOIs", powerMw: 500, completion: "Construction target: 2028", status: "Planned", region: "Europe" },
  { site: "EU Gigafactory: DT/Brookfield (Germany)", country: "Germany", developer: "Deutsche Telekom / Brookfield", costUsd: "Part of €230B EOIs", powerMw: 500, completion: "Construction target: 2028", status: "Planned", region: "Europe" },
  { site: "EU Gigafactory: Black Sea AI (Romania)", country: "Romania", developer: "Romania gov / consortium", costUsd: "Part of €230B EOIs", powerMw: 600, completion: "Construction target: 2028–2030", status: "Planned", region: "Europe" },
  { site: "EU Gigafactory: Nokia/Lumi (Finland)", country: "Finland", developer: "Nokia / CSC", costUsd: "Part of €230B EOIs", powerMw: 400, completion: "Construction target: 2028", status: "Planned", region: "Europe" },
  { site: "EU Gigafactory: Baltic AI (Poland-led)", country: "Poland", developer: "PL/EE/LV/LT consortium", costUsd: "Part of €230B EOIs", powerMw: 500, completion: "Construction target: 2028–2030", status: "Planned", region: "Europe" },
  { site: "EU Gigafactory: Spain Catalonia hub", country: "Spain", developer: "Telefónica / MasOrange / Nvidia", costUsd: "Part of €230B EOIs", powerMw: 500, completion: "Construction target: 2028", status: "Planned", region: "Europe" },
  { site: "SoftBank Sesterce Bosquel (1 GW)", country: "France", developer: "SoftBank / Sesterce", costUsd: "Part of €75B France program", powerMw: 1000, completion: "Selected May 2026", status: "Planned", region: "Europe" },
  { site: "AiOnX Kildare campus (Dublin)", country: "Ireland", developer: "AiOnX / Stoneweg", costUsd: "~$2.5B est. (SWI platform GDV pro-rata; weak — full 179 MW campus pre-lease)", powerMw: 179, completion: "16 MW rentals: late 2026", status: "Under Construction", region: "Europe" },
  { site: "Red Admiral Westmeath campus", country: "Ireland", developer: "Red Admiral / Lumcloon / SK Ecoplant", costUsd: "€1B", powerMw: 250, completion: "Approved Jun 2026", status: "Planned", region: "Europe" },

  // ── Africa ──
  { site: "Nxtra Eko Atlantic (Lagos)", country: "Nigeria", developer: "Airtel Nxtra", costUsd: "$120M+ est. (Airtel CEO disclosure; medium-high confidence)", powerMw: 38, completion: "Early 2026", status: "Under Construction", region: "Africa" },
  { site: "Nxtra Tatu City (Kenya)", country: "Kenya", developer: "Airtel Nxtra", costUsd: "$150M est. (Airtel / Construction Kenya; medium-high confidence)", powerMw: 44, completion: "2026–2027", status: "Under Construction", region: "Africa" },
  { site: "Teraco JB7 (Johannesburg)", country: "South Africa", developer: "Teraco / Digital Realty", costUsd: "~$440M est. (R8B syndicated loan; medium — loan also covers other projects)", powerMw: 40, completion: "2026–2027", status: "Under Construction", region: "Africa" },
  { site: "IXAfrica hyperscale (Kenya)", country: "Kenya", developer: "IXAfrica", costUsd: "~$250M est. (Helios $50M + RMB $200M campus; medium — 53 MW row vs 22.5 MW design)", powerMw: 53, completion: "2027–2028", status: "Planned", region: "Africa" },
  { site: "Microsoft/G42 Kenya (stalled)", country: "Kenya", developer: "Microsoft / G42", costUsd: "$1B package", powerMw: 1000, completion: "Stalled — grid limits", status: "Planned", region: "Africa" },

  // ── China ──
  { site: "China NDRC national AI grid (program)", country: "China", developer: "NDRC / state SOEs", costUsd: "$295B (2026–2030)", powerMw: 15000, completion: "Hubs operational from 2027", status: "Planned", region: "China" },
  { site: "Guizhou Gui'an AI hub cluster", country: "China", developer: "Huawei / Tencent / telecoms", costUsd: "Part of national program", powerMw: 3000, completion: "Ongoing; 48 key DCs", status: "Under Construction", region: "China" },
  { site: "Inner Mongolia Horinger cluster", country: "China", developer: "Multiple / provincial gov", costUsd: "Part of national program", powerMw: 2500, completion: "Ongoing expansion", status: "Under Construction", region: "China" },
  { site: "Ningxia Zhongwei computing hub", country: "China", developer: "Provincial / national hub", costUsd: "Part of national program", powerMw: 800, completion: "17 new centers planned", status: "Under Construction", region: "China" },
];

export const REGION_ORDER = [
  "North America",
  "Latin America",
  "Middle East",
  "Europe",
  "Asia-Pacific",
  "Africa",
  "China",
] as const;

export type Region = (typeof REGION_ORDER)[number];

export const STATUSES = ["All", "Operational", "Partially Live", "Under Construction", "Planned"] as const;
export type StatusFilter = (typeof STATUSES)[number];

export const REGIONS = ["All", ...REGION_ORDER] as const;
export type RegionFilter = (typeof REGIONS)[number];

export type SortKey =
  | "site"
  | "country"
  | "developer"
  | "cost"
  | "powerMw"
  | "energy"
  | "completion"
  | "status"
  | "region"
  | "buildPhase";

export type SortDir = "asc" | "desc";

/** Annual energy at 90% capacity factor: MW × 8,760 h × 0.9 */
export function annualKwhBillion(mw: number): number {
  return Math.round(mw * 8760 * 0.9) / 1_000_000;
}

export function fmtKwh(b: number): string {
  if (b >= 1000) return `${(b / 1000).toFixed(1)} TWh/yr`;
  return `${b.toFixed(1)} B kWh/yr`;
}

export function fmtPower(mw: number): string {
  if (mw >= 1000) return `${(mw / 1000).toFixed(1)} GW`;
  return `${mw} MW`;
}

export function buildPhaseFromStatus(status: ProjectStatus): BuildPhase {
  return status === "Planned" ? "Not Started" : "Started";
}

export function regionTotals(region: string) {
  return SITES.filter((s) => s.region === region).reduce(
    (acc, s) => ({
      mw: acc.mw + s.powerMw,
      kwh: acc.kwh + annualKwhBillion(s.powerMw),
      count: acc.count + 1,
    }),
    { mw: 0, kwh: 0, count: 0 },
  );
}

function unitToBillions(n: number, unit: string): number {
  const u = unit.toLowerCase();
  if (u === "t" || u === "trillion") return n * 1000;
  if (u === "m" || u === "mn" || u === "million") return n / 1000;
  if (u === "k") return n / 1_000_000;
  return n;
}

/** Fixed FX for normalizing disclosed figures to USD (approx. mid-2026). */
const FX_TO_USD = { USD: 1, EUR: 1.07, GBP: 1.27, CAD: 0.72 } as const;
type FxCurrency = keyof typeof FX_TO_USD;

function currencyKeyFromPrefix(prefix: string): FxCurrency {
  const p = prefix.toLowerCase().trim();
  if (p.startsWith("cad") || p === "c$") return "CAD";
  if (p.startsWith("€")) return "EUR";
  if (p.startsWith("£")) return "GBP";
  return "USD";
}

function toUsdBillions(n: number, unit: string, currency: FxCurrency): number {
  return unitToBillions(n, unit) * FX_TO_USD[currency];
}

const CURRENCY_PREFIX = "(?:cad\\s*\\$|c\\$|€|£|\\$)";
const CURRENCY_CAPTURE = "(cad\\s*\\$|c\\$|€|£|\\$)";

function extractExplicitUsdInParens(costText: string): number[] {
  const amounts: number[] = [];
  const re = /\(~\s*\$\s*([\d,]+(?:\.\d+)?)\s*([bBmMtT]|bn|mn|million|billion|trillion)?\s*\)/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(costText)) !== null) {
    amounts.push(unitToBillions(Number(m[1].replace(/,/g, "")), m[2] || "b"));
  }
  return amounts;
}

/** Parse currency amounts and normalize to USD billions. Prefers explicit (~$…) USD conversions when present. */
function extractUsdAmountsBillions(costText: string): number[] {
  const explicitUsd = extractExplicitUsdInParens(costText);
  if (explicitUsd.length > 0) return explicitUsd;

  const dashRange = costText.match(
    new RegExp(
      `${CURRENCY_CAPTURE}\\s*~?\\s*([\\d,]+(?:\\.\\d+)?)\\s*([bBmMtT]|bn|mn|million|billion|trillion)?\\s*[–\\-]\\s*(?:${CURRENCY_PREFIX}\\s*~?\\s*)?([\\d,]+(?:\\.\\d+)?)\\s*([bBmMtT]|bn|mn|million|billion|trillion)?`,
      "i",
    ),
  );
  if (dashRange) {
    const cur = currencyKeyFromPrefix(dashRange[1]);
    const u1 = (dashRange[3] || dashRange[5] || "b").toLowerCase();
    const u2 = (dashRange[5] || dashRange[3] || "b").toLowerCase();
    return [
      toUsdBillions(Number(dashRange[2].replace(/,/g, "")), u1, cur),
      toUsdBillions(Number(dashRange[4].replace(/,/g, "")), u2, cur),
    ];
  }

  const amounts: number[] = [];
  const re = new RegExp(
    `(cad\\s*\\$|c\\$|€|£|\\$)\\s*~?\\s*([\\d,]+(?:\\.\\d+)?)\\s*([bBmMtT]|bn|mn|million|billion|trillion)?`,
    "gi",
  );
  let m: RegExpExecArray | null;
  while ((m = re.exec(costText)) !== null) {
    const cur = currencyKeyFromPrefix(m[1]);
    amounts.push(toUsdBillions(Number(m[2].replace(/,/g, "")), m[3] || "b", cur));
  }
  return amounts;
}

const PART_OF_PROGRAM_USD: { match: string; billions: number; name: string }[] = [
  { match: "stargate", billions: 400, name: "Stargate (~$400B program)" },
  { match: "rainier", billions: 26, name: "Project Rainier ($26B)" },
  { match: "ai superfactory", billions: 7.3, name: "Microsoft Fairwater superfactory ($7.3B)" },
  { match: "national program", billions: 295, name: "China NDRC national AI grid ($295B)" },
];

function parsePartOfProgram(costText: string): { billions: number; name: string } | null {
  const amounts = extractUsdAmountsBillions(costText);
  if (amounts.length > 0) {
    const name = costText.replace(/^part of\s+/i, "").trim();
    return { billions: Math.max(...amounts), name };
  }
  const text = costText.toLowerCase();
  for (const entry of PART_OF_PROGRAM_USD) {
    if (text.includes(entry.match)) {
      return { billions: entry.billions, name: entry.name };
    }
  }
  return null;
}

function isUmbrellaProgramCost(costText: string): boolean {
  const text = costText.toLowerCase();
  if (text.includes("part of")) return true;
  if (/~\$\d[\d,.]*\s*[bmt]?\s*program\b/.test(text)) return true;
  if (/\$\d[\d,.]*\s*[bmt]?\s*\(\s*program\s*\)/.test(text)) return true;
  if (/\d+\s*(?:mw|gw)\s+program/.test(text) && !/\$|€|£|c\$/.test(costText)) return true;
  return false;
}

function parsePhaseCostBillions(costText: string): number | null {
  const phaseMatch = costText.match(
    new RegExp(
      `${CURRENCY_CAPTURE}\\s*~?\\s*([\\d,]+(?:\\.\\d+)?)\\s*([bBmMtT]|bn|mn|million|billion|trillion)?\\s*phase`,
      "i",
    ),
  );
  if (!phaseMatch) return null;
  const cur = currencyKeyFromPrefix(phaseMatch[1]);
  return toUsdBillions(Number(phaseMatch[2].replace(/,/g, "")), phaseMatch[3] || "b", cur);
}

function parseProgramTotalBillionsUsd(costText: string): number | null {
  const m = costText.match(
    new RegExp(
      `${CURRENCY_CAPTURE}\\s*~?\\s*([\\d,]+(?:\\.\\d+)?)\\s*([bBmMtT]|bn|mn|million|billion|trillion)?\\s*program`,
      "i",
    ),
  );
  if (!m) return null;
  const cur = currencyKeyFromPrefix(m[1]);
  return toUsdBillions(Number(m[2].replace(/,/g, "")), m[3] || "b", cur);
}

function isResearchedEstimate(costText: string): boolean {
  return /\best\.?\b/i.test(costText);
}

function parseEstimateSourceNote(costText: string): string | undefined {
  return costText.match(/\(([^)]+)\)\s*$/)?.[1];
}

function estimateConfidencePrefix(note: string | undefined): string {
  if (!note) return "Estimated";
  const n = note.toLowerCase();
  if (n.includes("weak")) return "Weak est.";
  if (n.includes("high confidence")) return "High-confidence est.";
  if (n.includes("medium-high")) return "Medium-high est.";
  if (n.includes("medium confidence") || n.includes("medium —")) return "Medium est.";
  return "Estimated";
}

function stripEstimateAnnotation(costText: string): string {
  if (!isResearchedEstimate(costText)) return costText;
  return costText.replace(/\s*\([^)]*\)\s*$/, "").trim();
}

function withEstimateMarkup(costText: string, display: CostDisplay): CostDisplay {
  if (!isResearchedEstimate(costText)) return display;
  const source = parseEstimateSourceNote(costText);
  const prefix = estimateConfidencePrefix(source);
  const estNote = source ? `${prefix} — ${source}` : prefix;
  const note = display.note ? `${estNote}; ${display.note}` : estNote;
  const label = display.label.startsWith("~") ? display.label : `~${display.label}`;
  return { ...display, label, note };
}

export type CostDisplay = {
  /** USD billions for sorting; -1 when unknown. */
  sortBillions: number;
  label: string;
  note?: string;
};

export function formatCostDisplay(costText: string): CostDisplay {
  const text = costText.toLowerCase();

  if (text.includes("undisclosed") && !isResearchedEstimate(costText)) {
    return { sortBillions: -1, label: "—", note: "Undisclosed" };
  }
  if (text.includes("tbd") && !isResearchedEstimate(costText)) {
    return { sortBillions: -1, label: "—", note: "TBD" };
  }

  if (text.includes("part of")) {
    const parsed = parsePartOfProgram(costText);
    if (parsed) {
      return withEstimateMarkup(costText, {
        sortBillions: parsed.billions,
        label: fmtBillionsUsd(parsed.billions),
        note: `Part of ${parsed.name}`,
      });
    }
    const tail = costText.replace(/^part of\s+/i, "").trim();
    return { sortBillions: -1, label: "—", note: `Part of ${tail}` };
  }

  const phase = parsePhaseCostBillions(costText);
  const programTotal = parseProgramTotalBillionsUsd(costText);
  if (phase !== null && programTotal !== null) {
    return withEstimateMarkup(costText, {
      sortBillions: phase,
      label: fmtBillionsUsd(phase),
      note: `${fmtBillionsUsd(programTotal)} program total`,
    });
  }
  if (phase !== null) {
    return withEstimateMarkup(costText, {
      sortBillions: phase,
      label: fmtBillionsUsd(phase),
      note: "Phase only",
    });
  }

  if (isUmbrellaProgramCost(costText) && !isResearchedEstimate(costText)) {
    const amounts = extractUsdAmountsBillions(costText);
    if (amounts.length > 0) {
      const v = Math.max(...amounts);
      return {
        sortBillions: v,
        label: fmtBillionsUsd(v),
        note: "Program budget (multi-site)",
      };
    }
  }

  const amountText = stripEstimateAnnotation(costText);
  const amounts = extractUsdAmountsBillions(amountText);
  if (amounts.length === 0) {
    return { sortBillions: -1, label: "—", note: costText };
  }

  const lo = Math.min(...amounts);
  const hi = Math.max(...amounts);

  if (amounts.length > 1 && lo !== hi) {
    return withEstimateMarkup(costText, {
      sortBillions: (lo + hi) / 2,
      label: `${fmtBillionsUsd(lo)}–${fmtBillionsUsd(hi)}`,
    });
  }

  const v = amounts[0];
  if (costText.includes("+") && !isResearchedEstimate(costText)) {
    return {
      sortBillions: v * 1.15,
      label: `${fmtBillionsUsd(v)}+`,
      note: "Disclosed minimum",
    };
  }

  return withEstimateMarkup(costText, { sortBillions: v, label: fmtBillionsUsd(v) });
}

export function parseCostToBillions(costUsd: string): number {
  return formatCostDisplay(costUsd).sortBillions;
}

export function costEstimateBillions(costText: string): {
  low: number;
  base: number;
  high: number;
  known: boolean;
  estimated?: boolean;
} {
  const text = costText.toLowerCase();
  if (
    (text.includes("tbd") || text.includes("undisclosed")) &&
    !isResearchedEstimate(costText)
  ) {
    return { low: 0, base: 0, high: 0, known: false };
  }
  if (isUmbrellaProgramCost(costText) && !isResearchedEstimate(costText)) {
    return { low: 0, base: 0, high: 0, known: false };
  }

  const estimated = isResearchedEstimate(costText);

  const phase = parsePhaseCostBillions(costText);
  if (phase !== null) {
    return { low: phase, base: phase, high: phase, known: true, estimated };
  }

  const amountText = stripEstimateAnnotation(costText);
  const amounts = extractUsdAmountsBillions(amountText);
  if (amounts.length === 0) return { low: 0, base: 0, high: 0, known: false };

  const lo = Math.min(...amounts);
  const hi = Math.max(...amounts);
  if (costText.includes("+") && amounts.length === 1) {
    const v = amounts[0];
    return { low: v, base: v * 1.15, high: v * 1.3, known: true, estimated };
  }
  const base = amounts.length === 1 ? amounts[0] : (lo + hi) / 2;
  return { low: lo, base, high: hi, known: true, estimated };
}

export function compareSites(a: Site, b: Site, key: SortKey): number {
  switch (key) {
    case "site":
      return a.site.localeCompare(b.site);
    case "country":
      return a.country.localeCompare(b.country);
    case "developer":
      return a.developer.localeCompare(b.developer);
    case "cost":
      return parseCostToBillions(a.costUsd) - parseCostToBillions(b.costUsd);
    case "powerMw":
      return a.powerMw - b.powerMw;
    case "energy":
      return annualKwhBillion(a.powerMw) - annualKwhBillion(b.powerMw);
    case "completion":
      return a.completion.localeCompare(b.completion);
    case "status":
      return a.status.localeCompare(b.status);
    case "region":
      return a.region.localeCompare(b.region);
    case "buildPhase":
      return buildPhaseFromStatus(a.status).localeCompare(buildPhaseFromStatus(b.status));
    default:
      return 0;
  }
}

const TEXT_SORT_KEYS = new Set<SortKey>([
  "site",
  "country",
  "developer",
  "completion",
  "status",
  "region",
  "buildPhase",
]);

export function defaultSortDir(key: SortKey): SortDir {
  return TEXT_SORT_KEYS.has(key) ? "asc" : "desc";
}

const totalMw = SITES.reduce((a, s) => a + s.powerMw, 0);
const totalKwh = SITES.reduce((a, s) => a + s.powerMw * 8760 * 0.9, 0) / 1_000_000;
const startedCount = SITES.filter((s) => buildPhaseFromStatus(s.status) === "Started").length;

export const STATS = {
  siteCount: SITES.length,
  startedCount,
  notStartedCount: SITES.length - startedCount,
  totalMw,
  totalKwh,
  totalPowerLabel: fmtPower(totalMw),
  totalEnergyLabel: fmtKwh(Math.round(totalKwh * 10) / 10),
};

export const REGION_COLORS: Record<Region, string> = {
  "North America": "#3b82f6",
  "Latin America": "#22c55e",
  "Middle East": "#f59e0b",
  Europe: "#6366f1",
  "Asia-Pacific": "#06b6d4",
  Africa: "#84cc16",
  China: "#ef4444",
};

export const CHART_COLORS = {
  primary: "#06b6d4",
  accent: "#6366f1",
  warning: "#f59e0b",
  danger: "#ef4444",
  success: "#22c55e",
};
