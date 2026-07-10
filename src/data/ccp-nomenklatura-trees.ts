type StatusTone = "success" | "danger" | "warning" | "info" | "neutral";

type Leader = {
  rank?: number;
  name: string;
  chinese: string;
  office: string;
  concurrentRole: string;
  summary: string;
  status?: string;
  statusTone?: StatusTone;
  psc?: boolean;
};

export type HierarchyNode = {
  id: string;
  office: string;
  incumbent: string;
  summary: string;
  layer: "congress" | "committee" | "politburo" | "psc" | "organ";
};

export const DATA_DATE = "April–July 2026";
const CCP_TOTAL_MEMBERS = "~100.3M"; // ~100.27M at end of 2024 (CCP Organization Dept)

export const HIERARCHY_NODES: HierarchyNode[] = [
  { id: "nc", office: "National Congress", incumbent: "~2,300 delegates", summary: "Meets every 5 years; ratifies pre-selected leadership slate.", layer: "congress" },
  { id: "cc", office: "Central Committee", incumbent: "205 full + 171 alternates", summary: "Highest party authority between congresses; elects Politburo at 1st plenum.", layer: "committee" },
  { id: "pb", office: "Politburo", incumbent: "24 members (23 active)", summary: "Elite decision body: provincial secretaries, ministers, generals.", layer: "politburo" },
  { id: "psc", office: "Politburo Standing Committee", incumbent: "Xi Jinping (General Secretary)", summary: "Apex decision-making body; meets ~weekly in Zhongnanhai.", layer: "psc" },
  { id: "sec", office: "Central Secretariat", incumbent: "Cai Qi (1st Secretary)", summary: "Implements PSC decisions; supervises six functional departments.", layer: "organ" },
  { id: "cmc", office: "Central Military Commission", incumbent: "Xi Jinping / Zhang Shengmin", summary: "Supreme military command. Reduced to 2 members after 2023–2026 purges.", layer: "organ" },
  { id: "ccdi", office: "CCDI", incumbent: "Li Xi (Secretary)", summary: "Party anti-corruption and discipline enforcement.", layer: "organ" },
  { id: "org", office: "Organization Dept", incumbent: "Li Ganjie (Director)", summary: "Manages ~5,000-position nomenklatura list; controls key appointments.", layer: "organ" },
  { id: "npc", office: "NPC Standing Committee", incumbent: "Zhao Leji (Chairman)", summary: "Legislature; enacts laws, appoints officials, constitutional oversight.", layer: "organ" },
  { id: "sc", office: "State Council", incumbent: "Li Qiang (Premier)", summary: "Government cabinet: 21 ministries, central bank, audit office.", layer: "organ" },
  { id: "cppcc", office: "CPPCC", incumbent: "Wang Huning (Chairman)", summary: "United-front advisory body; HK/Macau/Taiwan policy.", layer: "organ" },
];

export const HIERARCHY_EDGES = [
  { from: "nc", to: "cc" },
  { from: "cc", to: "pb" },
  { from: "pb", to: "psc" },
  { from: "psc", to: "sec" },
  { from: "psc", to: "cmc" },
  { from: "psc", to: "ccdi" },
  { from: "psc", to: "npc" },
  { from: "psc", to: "sc" },
  { from: "psc", to: "cppcc" },
  { from: "sec", to: "org" },
];

const PSC: Leader[] = [
  {
    rank: 1,
    name: "Xi Jinping",
    chinese: "习近平",
    office: "General Secretary, CMC Chairman",
    concurrentRole: "PRC President",
    summary: "Paramount leader; chairs PSC, CMC, and sets all major policy direction.",
    status: "Active",
    statusTone: "success",
    psc: true,
  },
  {
    rank: 2,
    name: "Li Qiang",
    chinese: "李强",
    office: "PSC Member",
    concurrentRole: "Premier, State Council",
    summary: "Head of government bureaucracy; manages economic policy and State Council ministries.",
    status: "Active",
    statusTone: "success",
    psc: true,
  },
  {
    rank: 3,
    name: "Zhao Leji",
    chinese: "赵乐际",
    office: "PSC Member",
    concurrentRole: "NPC Standing Committee Chairman",
    summary: "Head of legislature; oversees lawmaking and official appointments.",
    status: "Active",
    statusTone: "success",
    psc: true,
  },
  {
    rank: 4,
    name: "Wang Huning",
    chinese: "王沪宁",
    office: "PSC Member",
    concurrentRole: "CPPCC Chairman",
    summary: "Ideology and united-front chief; manages HK, Macau, and Taiwan policy.",
    status: "Active",
    statusTone: "success",
    psc: true,
  },
  {
    rank: 5,
    name: "Cai Qi",
    chinese: "蔡奇",
    office: "PSC Member, Secretariat 1st Secretary",
    concurrentRole: "General Office Director",
    summary: "Runs day-to-day party operations and supervises six Central Committee departments.",
    status: "Active",
    statusTone: "success",
    psc: true,
  },
  {
    rank: 6,
    name: "Ding Xuexiang",
    chinese: "丁薛祥",
    office: "PSC Member",
    concurrentRole: "Executive Vice Premier",
    summary: "Senior economic manager; top-ranked vice premier on the State Council.",
    status: "Active",
    statusTone: "success",
    psc: true,
  },
  {
    rank: 7,
    name: "Li Xi",
    chinese: "李希",
    office: "PSC Member",
    concurrentRole: "CCDI Secretary",
    summary: "Leads anti-corruption campaign; oversees discipline inspections nationwide.",
    status: "Active",
    statusTone: "success",
    psc: true,
  },
];

const POLITBURO: Leader[] = [
  { name: "Chen Jining", chinese: "陈吉宁", office: "Politburo Member", concurrentRole: "Shanghai Party Secretary", summary: "Runs China's largest city and financial hub.", status: "Active", statusTone: "success" },
  { name: "Chen Min'er", chinese: "陈敏尔", office: "Politburo Member", concurrentRole: "Tianjin Party Secretary", summary: "Xi loyalist; previously Chongqing Party Secretary.", status: "Active", statusTone: "success" },
  { name: "Chen Wenqing", chinese: "陈文清", office: "Politburo Member", concurrentRole: "Political-Legal Affairs Secretary", summary: "Oversees courts, procuratorate, police (MPS), and state security (MSS).", status: "Active", statusTone: "success" },
  { name: "He Lifeng", chinese: "何立峰", office: "Politburo Member", concurrentRole: "Vice Premier (#2)", summary: "Finance and economic policy; former NDRC head.", status: "Active", statusTone: "success" },
  { name: "Huang Kunming", chinese: "黄坤明", office: "Politburo Member", concurrentRole: "Guangdong Party Secretary", summary: "Leads China's largest provincial economy.", status: "Active", statusTone: "success" },
  { name: "Li Ganjie", chinese: "李干杰", office: "Politburo Member", concurrentRole: "Organization Dept Director", summary: "Controls nomenklatura appointments for ~5,000 key positions.", status: "Active", statusTone: "success" },
  { name: "Li Hongzhong", chinese: "李鸿忠", office: "Politburo Member", concurrentRole: "NPC Standing Committee Vice Chairman", summary: "Senior NPC leadership; former Tianjin Party Secretary.", status: "Active", statusTone: "success" },
  { name: "Li Shulei", chinese: "李书磊", office: "Politburo Member", concurrentRole: "Propaganda Dept Director", summary: "Controls media, ideology, and cultural messaging.", status: "Active", statusTone: "success" },
  { name: "Liu Guozhong", chinese: "刘国中", office: "Politburo Member", concurrentRole: "Vice Premier (#3)", summary: "Agriculture, health, and social policy portfolios.", status: "Active", statusTone: "success" },
  { name: "Ma Xingrui", chinese: "马兴瑞", office: "Politburo Member", concurrentRole: "Xinjiang Party Secretary", summary: "Oversees Xinjiang; rumored under investigation, missed key meetings in 2025–2026.", status: "Under scrutiny", statusTone: "warning" },
  { name: "Shi Taifeng", chinese: "石泰峰", office: "Politburo Member", concurrentRole: "CPPCC Vice Chairman, United Front Work Dept", summary: "Oversees ethnic, religious, and diaspora united-front work.", status: "Active", statusTone: "success" },
  { name: "Wang Yi", chinese: "王毅", office: "Politburo Member", concurrentRole: "Foreign Minister (Director, Foreign Affairs Commission Office)", summary: "China's top diplomat; manages foreign policy apparatus.", status: "Active", statusTone: "success" },
  { name: "Yin Li", chinese: "尹力", office: "Politburo Member", concurrentRole: "Sichuan Party Secretary", summary: "Runs major western province; former Beijing mayor.", status: "Active", statusTone: "success" },
  { name: "Yuan Jiajun", chinese: "袁家军", office: "Politburo Member", concurrentRole: "Chongqing Party Secretary", summary: "Former aerospace industry head; runs Chongqing.", status: "Active", statusTone: "success" },
  { name: "Zhang Guoqing", chinese: "张国清", office: "Politburo Member", concurrentRole: "Vice Premier (#4)", summary: "Industry, SOEs, and emergency management portfolios.", status: "Active", statusTone: "success" },
  { name: "Zhang Youxia", chinese: "张又侠", office: "Politburo Member", concurrentRole: "CMC Vice Chairman (suspended)", summary: "Senior general; placed under investigation January 2026.", status: "Under investigation", statusTone: "danger" },
  { name: "He Weidong", chinese: "何卫东", office: "Politburo Member (expelled)", concurrentRole: "Former CMC Vice Chairman", summary: "Expelled from Party October 2025 amid corruption probe.", status: "Expelled", statusTone: "danger" },
];

const CMC_MEMBERS = [
  { name: "Xi Jinping", role: "Chairman", status: "Active", statusTone: "success" as StatusTone },
  { name: "Zhang Shengmin", role: "Vice Chairman (Discipline Inspection)", status: "Active", statusTone: "success" as StatusTone },
  { name: "Zhang Youxia", role: "Former Vice Chairman", status: "Under investigation (Jan 2026)", statusTone: "danger" as StatusTone },
  { name: "He Weidong", role: "Former Vice Chairman", status: "Expelled (Oct 2025)", statusTone: "danger" as StatusTone },
  { name: "Li Shangfu", role: "Former Member / Defense Minister", status: "Expelled (2023)", statusTone: "danger" as StatusTone },
  { name: "Liu Zhenli", role: "Former Chief of Joint Staff", status: "Under investigation (Jan 2026)", statusTone: "danger" as StatusTone },
  { name: "Miao Hua", role: "Former Political Work Director", status: "Expelled (Oct 2025)", statusTone: "danger" as StatusTone },
];

const SECRETARIAT = [
  { name: "Cai Qi", role: "1st Secretary; General Office Director" },
  { name: "Shi Taifeng", role: "Secretariat Member; CPPCC Vice Chairman" },
  { name: "Li Ganjie", role: "Secretariat Member; Organization Dept Director" },
  { name: "Li Shulei", role: "Secretariat Member; Propaganda Dept Director" },
  { name: "Chen Wenqing", role: "Secretariat Member; Political-Legal Affairs Secretary" },
  { name: "Liu Jinguo", role: "Secretariat Member; CCDI Deputy Secretary" },
  { name: "Wang Xiaohong", role: "Secretariat Member; Minister of Public Security" },
];

const SECRETARIAT_DEPTS = [
  { dept: "Organization Department", head: "Li Ganjie", function: "Personnel and nomenklatura — recruits, trains, assigns officials across party-state" },
  { dept: "Publicity (Propaganda) Department", head: "Li Shulei", function: "Media control, ideology, cultural work" },
  { dept: "United Front Work Department", head: "Shi Taifeng (oversight)", function: "Non-CCP groups, ethnic/religious communities, diaspora, HK/Macau/Taiwan" },
  { dept: "International Department", head: "Liu Jianchao", function: "Party-to-party diplomacy; relations with communist and allied parties" },
  { dept: "Political-Legal Affairs Commission", head: "Chen Wenqing", function: "Courts, procuratorate, MPS, MSS, Ministry of Justice" },
  { dept: "Social Work Department", head: "Various", function: "Community governance, social organizations, industry associations" },
];

const STATE_COUNCIL = [
  { name: "Li Qiang", role: "Premier", rank: "PSC #2", status: "Active" },
  { name: "Ding Xuexiang", role: "Executive Vice Premier", rank: "PSC #6", status: "Active" },
  { name: "He Lifeng", role: "Vice Premier", rank: "Politburo", status: "Active" },
  { name: "Liu Guozhong", role: "Vice Premier", rank: "Politburo", status: "Active" },
  { name: "Zhang Guoqing", role: "Vice Premier", rank: "Politburo", status: "Active" },
  { name: "Foreign Affairs State Councilor", role: "Vacant since 2023", rank: "—", status: "Vacant" },
  { name: "Defense State Councilor", role: "Vacant since 2023", rank: "—", status: "Vacant" },
];

export type DeptRow = { name: string; head: string; function: string; reportsTo?: string };

export type ExpandableDept = DeptRow & {
  id: string;
  employees?: string;
  employeeNote?: string;
  budget?: string;
  budgetNote?: string;
  budgetUsdB?: number;
  isSOE?: boolean;
  children?: ExpandableDept[];
};

/** Staff headcount estimates. National civil servants ~7.16M (MOHRSS 2024); PLA ~2M active duty (IISS). */
const HEADCOUNT: Record<string, { count?: string; note?: string }> = {
  "sc-gov-office": { count: "~2,500", note: "Central State Council staff (est.)" },
  mfa: { count: "~30,000", note: "Central MFA + ~275 diplomatic posts abroad (est.)" },
  mod: { count: "~500", note: "Ceremonial ministry; armed forces via CMC" },
  ndrc: { count: "~800", note: "Central commission staff (est.)" },
  moe: { count: "~50,000", note: "Central ministry + direct institutions (est.)" },
  most: { count: "~12,000", note: "Central ministry staff (est.)" },
  miit: { count: "~25,000", note: "Central + industry vertical (est.)" },
  neac: { count: "~400", note: "Central commission (est.)" },
  mps: { count: "~1.9M", note: "National police / public security system (est.)" },
  mss: { count: "ND", note: "State security — not disclosed" },
  mca: { count: "~8,000", note: "Central civil affairs (est.)" },
  moj: { count: "~3,500", note: "Central ministry (est.)" },
  mof: { count: "~120,000", note: "Central finance ministry (est.)" },
  mohrss: { count: "~80,000", note: "Central + social insurance admin (est.)" },
  mnr: { count: "~15,000", note: "Central natural resources (est.)" },
  mee: { count: "~8,000", note: "Central environment ministry (est.)" },
  mohurd: { count: "~5,000", note: "Central HUD ministry (est.)" },
  mot: { count: "~400,000", note: "Incl. rail, aviation, post verticals (est.)" },
  mwr: { count: "~6,000", note: "Central water resources (est.)" },
  moa: { count: "~10,000", note: "Central agriculture ministry (est.)" },
  mofcom: { count: "~8,000", note: "Central commerce ministry (est.)" },
  mct: { count: "~12,000", note: "Central culture/tourism (est.)" },
  nhc: { count: "~200,000", note: "National health admin incl. CDC vertical (est.)" },
  mva: { count: "~3,000", note: "Central veterans affairs (est.)" },
  mem: { count: "~150,000", note: "Incl. fire/rescue national system (est.)" },
  pboc: { count: "~80,000", note: "PBOC + branches (est.)" },
  audit: { count: "~6,000", note: "National audit staff (est.)" },
  customs: { count: "~120,000", note: "National customs vertical (est.)" },
  samr: { count: "~40,000", note: "Market regulation vertical (est.)" },
  stats: { count: "~15,000", note: "National statistics bureau vertical (est.)" },
  sasac: { count: "~3,000", note: "Central SOE supervision staff (est.)" },
  tax: { count: "~800,000", note: "State Taxation Administration vertical (est.)" },
  npc: { count: "~8,000", note: "NPCSC central staff; deputies are part-time" },
  cppcc: { count: "~5,000", note: "CPPCC central staff; members are part-time" },
  ccdi: { count: "ND", note: "Party/state fusion — staff not disclosed" },
  cmc: { count: "~2.0M", note: "PLA active duty (IISS 2024 est.)" },
  party: { count: "ND", note: "Central Party organs — not publicly disclosed" },
  org: { count: "~1,500", note: "Central Organization Dept staff (est.)" },
  nc: { count: "2,878", note: "14th NPC deputies (2022–2023 election)" },
  cc: { count: "376", note: "205 full + 171 alternate members (not staff)" },
  "cc-full": { count: "205", note: "Full voting members" },
  "cc-alt": { count: "171", note: "Alternate members" },
  pb: { count: "24", note: "Politburo members (23 active)" },
  psc: { count: "7", note: "Standing Committee members" },
  "nc-20th": { count: "~2,300", note: "20th Party Congress delegates (2022)" },
  "org-root": { count: "~1,500", note: "Central Organization Dept staff (est.)" },
  "psc-xi": { count: "ND", note: "Commission office staff not disclosed" },
  "psc-li": { count: "~3.5M", note: "Sum of State Council vertical systems (est.)" },
  "psc-zhao": { count: "~8,000", note: "NPCSC central staff (est.)" },
  "psc-wang": { count: "~5,000", note: "CPPCC central staff (est.)" },
  "psc-cai": { count: "ND", note: "Central Party organ staff not disclosed" },
  "psc-ding": { count: "~200K", note: "Economic ministries under EVP Ding (est.)" },
  "psc-lixi": { count: "ND", note: "CCDI/NSC staff not disclosed" },
  "npc-root": { count: "~8,000", note: "NPCSC central staff (est.)" },
  "npc-full": { count: "2,878", note: "NPC deputies (part-time, not staff)" },
  "cppcc-root": { count: "~5,000", note: "CPPCC central staff (est.)" },
  "ccdi-root": { count: "ND", note: "CCDI/NSC staff not disclosed" },
  "cmc-root": { count: "~2.0M", note: "PLA active duty (IISS 2024 est.)" },
  "bur-food-reserves": { count: "~3,000", note: "Central reserves admin (est.)" },
  "bur-data": { count: "~500", note: "New agency (est. 2023)" },
  "bur-energy": { count: "~1,200", note: "Central energy regulator (est.)" },
  "bur-tobacco": { count: "~50,000", note: "State tobacco monopoly system (est.)" },
  "bur-sastind": { count: "~5,000", note: "Defense industry oversight (est.)" },
  "bur-forestry": { count: "~8,000", note: "Forestry and grassland admin (est.)" },
  "bur-immigration": { count: "~50,000", note: "Border exit/entry system (est.)" },
  "bur-railway": { count: "~2,000", note: "Rail regulator (est.)" },
  "bur-caac": { count: "~15,000", note: "Aviation regulator (est.)" },
  "bur-post": { count: "~400,000", note: "Postal system vertical (est.)" },
  "bur-heritage": { count: "~2,000", note: "Cultural relics admin (est.)" },
  "bur-cdc": { count: "~8,000", note: "Disease control vertical (est.)" },
  "bur-tcm": { count: "~3,000", note: "Traditional medicine admin (est.)" },
  "bur-fire": { count: "~150,000", note: "Fire/rescue national system (est.)" },
  "bur-mine-safety": { count: "~5,000", note: "Mining safety regulator (est.)" },
  "bur-nmpa": { count: "~10,000", note: "Drug/medical device regulator (est.)" },
  "bur-safe": { count: "~20,000", note: "Foreign exchange admin (est.)" },
  "npc-comm-0": { count: "~120", note: "NPCSC committee staff (est.)" },
  "npc-comm-1": { count: "~150", note: "NPCSC committee staff (est.)" },
  "npc-comm-2": { count: "~130", note: "NPCSC committee staff (est.)" },
  "npc-comm-3": { count: "~140", note: "NPCSC committee staff (est.)" },
  "npc-comm-4": { count: "~130", note: "NPCSC committee staff (est.)" },
  "npc-comm-5": { count: "~120", note: "NPCSC committee staff (est.)" },
  "npc-comm-6": { count: "~100", note: "NPCSC committee staff (est.)" },
  "npc-comm-7": { count: "~120", note: "NPCSC committee staff (est.)" },
  "npc-comm-8": { count: "~130", note: "NPCSC committee staff (est.)" },
  "npc-comm-9": { count: "~120", note: "NPCSC committee staff (est.)" },
  "npcsc-0": { count: "~800", note: "NPCSC General Office (est.)" },
  "npcsc-1": { count: "~600", note: "Legislative Affairs Commission (est.)" },
  "npcsc-2": { count: "~200", note: "Budgetary Affairs Commission staff (est.)" },
  "npcsc-3": { count: "~150", note: "Delegate Affairs Commission (est.)" },
  "npcsc-4": { count: "~80", note: "HK Basic Law Committee (est.)" },
  "npcsc-5": { count: "~60", note: "Macao Basic Law Committee (est.)" },
  "npcsc-6": { count: "~50", note: "Council of Chairpersons support staff (est.)" },
  "cppcc-0": { count: "~200", note: "CPPCC committee staff (est.)" },
  "cppcc-1": { count: "~250", note: "CPPCC committee staff (est.)" },
  "cppcc-2": { count: "~200", note: "CPPCC committee staff (est.)" },
  "cppcc-3": { count: "~220", note: "CPPCC committee staff (est.)" },
  "cppcc-4": { count: "~230", note: "CPPCC committee staff (est.)" },
  "cppcc-5": { count: "~210", note: "CPPCC committee staff (est.)" },
  "cppcc-6": { count: "~180", note: "CPPCC committee staff (est.)" },
  "cppcc-7": { count: "~200", note: "CPPCC committee staff (est.)" },
  "cppcc-8": { count: "~190", note: "CPPCC committee staff (est.)" },
  "cppcc-9": { count: "~170", note: "CPPCC committee staff (est.)" },
  "cmc-0": { count: "~5,000", note: "CMC General Office (est.)" },
  "cmc-1": { count: "~50,000", note: "Joint Staff + theater support (est.)" },
  "cmc-2": { count: "~40,000", note: "Political commissar system (est.)" },
  "cmc-3": { count: "~35,000", note: "Logistics headquarters (est.)" },
  "cmc-4": { count: "~30,000", note: "Equipment development HQ (est.)" },
  "cmc-5": { count: "~25,000", note: "Training administration (est.)" },
  "cmc-6": { count: "~20,000", note: "Defense mobilization system (est.)" },
  "cmc-7": { count: "~8,000", note: "Military discipline inspection (est.)" },
  "cmc-8": { count: "~5,000", note: "Military legal affairs (est.)" },
  "cmc-9": { count: "~15,000", note: "Defense S&T commission (est.)" },
  "cmc-10": { count: "~3,000", note: "Strategic planning office (est.)" },
  "cmc-11": { count: "~2,500", note: "Reform and structure office (est.)" },
  "cmc-12": { count: "~1,500", note: "International military cooperation (est.)" },
  "cmc-13": { count: "~2,000", note: "Military audit office (est.)" },
  "cmc-14": { count: "~4,000", note: "CMC organ administration (est.)" },
  "xi-0": { count: "ND", note: "Commission office staff (est.)" },
  "xi-1": { count: "ND", note: "Commission office staff (est.)" },
  "xi-2": { count: "ND", note: "Commission office staff (est.)" },
  "xi-3": { count: "ND", note: "Commission office staff (est.)" },
  "xi-4": { count: "~5,000", note: "Cyberspace Administration vertical (est.)" },
  "xi-5": { count: "ND", note: "Commission office staff (est.)" },
  "xi-6": { count: "~2.0M", note: "PLA active duty (IISS 2024 est.)" },
  "xi-7": { count: "ND", note: "Commission office staff (est.)" },
  "xi-8": { count: "ND", note: "Taiwan Affairs Office (est.)" },
  "xi-9": { count: "ND", note: "HK/Macau Affairs Office (est.)" },
  "party-dept-0": { count: "~1,500", note: "Central Organization Dept staff (est.)" },
  "party-dept-1": { count: "~52,000", note: "Central Propaganda + media SOE staff (est.)" },
  "party-dept-2": { count: "~8,000", note: "Central UFWD staff (est.)" },
  "party-dept-3": { count: "~400", note: "International Liaison Dept (est.)" },
  "party-dept-4": { count: "~2.55M", note: "Courts, procuracy, MPS, MSS, MOJ systems (est.)" },
  "party-dept-5": { count: "~5,500", note: "Central Social Work Dept (est.)" },
  "sec-gov-office": { count: "~2,000", note: "CCP General Office staff (est.)" },
};

const BUREAU_IDS: Record<string, string> = {
  "National Food and Strategic Reserves Administration": "bur-food-reserves",
  "National Data Administration 国家数据局": "bur-data",
  "National Energy Administration": "bur-energy",
  "State Tobacco Monopoly Administration": "bur-tobacco",
  "State Administration of Science, Technology and Industry for National Defense": "bur-sastind",
  "National Forestry and Grassland Administration": "bur-forestry",
  "National Immigration Administration 移民局": "bur-immigration",
  "National Railway Administration": "bur-railway",
  "Civil Aviation Administration of China 民航局": "bur-caac",
  "State Post Bureau 邮政局": "bur-post",
  "National Cultural Heritage Administration 文物局": "bur-heritage",
  "National Administration of Disease Control and Prevention 疾控局": "bur-cdc",
  "National Administration of Traditional Chinese Medicine 中医药局": "bur-tcm",
  "National Fire and Rescue Administration 消防救援局": "bur-fire",
  "National Mine Safety Administration": "bur-mine-safety",
  "National Medical Products Administration 药监局": "bur-nmpa",
  "State Administration of Foreign Exchange 外汇局": "bur-safe",
};

const PARTY_UNIT_HEADCOUNT: Record<string, { count: string; note: string }> = {
  "Cadre Bureau": { count: "~400", note: "Core nomenklatura appointments (est.)" },
  "Organization Bureau": { count: "~300", note: "Party structure management (est.)" },
  "Training Bureau": { count: "~250", note: "Cadre education (est.)" },
  "Party Member Affairs Bureau": { count: "~350", note: "100M+ member administration support (est.)" },
  "Supervision Bureau": { count: "~200", note: "Cadre assessment (est.)" },
  "Theory Bureau": { count: "~200", note: "Ideology propagation (est.)" },
  "News Bureau": { count: "~300", note: "Media control (est.)" },
  "Culture Bureau": { count: "~250", note: "Arts and publishing (est.)" },
  "External Propaganda Bureau": { count: "~400", note: "International media (est.)" },
  "Ethnic and Religious Affairs Bureau": { count: "~300", note: "Ethnic/religious united front (est.)" },
  "HK, Macao, Taiwan Affairs Bureau": { count: "~350", note: "Cross-strait united front (est.)" },
  "Non-Party Personages Bureau": { count: "~200", note: "Non-CCP elites (est.)" },
  "New Social Classes Bureau": { count: "~150", note: "Private sector united front (est.)" },
  "Overseas Chinese Affairs Bureau": { count: "~250", note: "Diaspora engagement (est.)" },
  "Bureau for Communist and Left Parties": { count: "~150", note: "Party-to-party diplomacy (est.)" },
  "Bureau for Asian and African Parties": { count: "~120", note: "Developing world ties (est.)" },
  "Bureau for European and American Parties": { count: "~100", note: "Western party ties (est.)" },
  "Supreme People's Court": { count: "~350,000", note: "National court system (est.)" },
  "Supreme People's Procuratorate": { count: "~200,000", note: "National prosecution system (est.)" },
  "Community Governance Bureau": { count: "~300", note: "Grassroots governance (est.)" },
  "Social Organization Bureau": { count: "~250", note: "NGO oversight (est.)" },
  "Volunteer Work Bureau": { count: "~150", note: "Volunteer coordination (est.)" },
  "Public Complaints Bureau": { count: "~2,000", note: "Petition system (est.)" },
};

function headcountForUnit(name: string): { count?: string; note?: string } {
  const key = Object.keys(PARTY_UNIT_HEADCOUNT).find((k) => name.includes(k));
  return key ? PARTY_UNIT_HEADCOUNT[key] : {};
}

/** 2025 annual average CNY/USD (PBOC / IMF 2025 est.). All figures shown in USD. */
const CNY_PER_USD_2025 = 7.25;

function usdBFromCnyB(cnyB: number): number {
  return cnyB / CNY_PER_USD_2025;
}

function fmtUsdFromCnyB(cnyB: number, opts?: { revenue?: boolean }): string {
  const usdB = usdBFromCnyB(cnyB);
  const suffix = opts?.revenue ? " rev." : "";
  if (usdB >= 1000) return `$${(usdB / 1000).toFixed(2)}T${suffix}`;
  if (usdB >= 1) return `$${usdB.toFixed(1)}B${suffix}`;
  if (usdB >= 0.001) return `$${Math.round(usdB * 1000)}M${suffix}`;
  return `$${Math.max(1, Math.round(usdB * 1_000_000))}K${suffix}`;
}

export function formatTotalUsd(usdB: number): string {
  if (usdB >= 1000) return `$${(usdB / 1000).toFixed(2)}T`;
  return `$${usdB.toFixed(1)}B`;
}

/** Organ operating budgets in CNY billions (2025 MOF / SASAC / defense reports). */
const ORGAN_BUDGET_CNY_B: Record<string, { cnyB: number; note?: string; revenue?: boolean }> = {
  "sec-gov-office": { cnyB: 4.2, note: "General Office central expenditure (est.)" },
  "party-dept-0": { cnyB: 3.5, note: "Organization Dept central organ (est.)" },
  "party-dept-1": { cnyB: 48, note: "Incl. media SOE subsidies and CMG (est.)" },
  "party-dept-2": { cnyB: 8.5, note: "UFWD central organ (est.)" },
  "party-dept-3": { cnyB: 1.2, note: "International Liaison Dept (est.)" },
  "party-dept-4": { cnyB: 186, note: "Judicial, police, state security systems (est.)" },
  "party-dept-5": { cnyB: 4.8, note: "Social Work Dept central organ (est.)" },
  "org-root": { cnyB: 3.5, note: "Organization Dept central organ (est.)" },
  "sc-gov-office": { cnyB: 5.8, note: "State Council General Office (est.)" },
  mfa: { cnyB: 68, note: "Central MFA incl. foreign aid (est.)" },
  mod: { cnyB: 1.2, note: "Ceremonial defense ministry (est.)" },
  ndrc: { cnyB: 12, note: "Macro planning commission (est.)" },
  moe: { cnyB: 180, note: "Education system central spend (est.)" },
  most: { cnyB: 45, note: "S&T programs (est.)" },
  miit: { cnyB: 85, note: "Industry and telecom (est.)" },
  neac: { cnyB: 2.5, note: "Ethnic affairs commission (est.)" },
  mps: { cnyB: 220, note: "Public security system (est.)" },
  mss: { cnyB: 0, note: "State security — not disclosed" },
  mca: { cnyB: 18, note: "Civil affairs (est.)" },
  moj: { cnyB: 8, note: "Justice ministry (est.)" },
  mof: { cnyB: 145, note: "Fiscal operations (est.)" },
  mohrss: { cnyB: 95, note: "Labor and social insurance (est.)" },
  mnr: { cnyB: 22, note: "Natural resources (est.)" },
  mee: { cnyB: 28, note: "Environment ministry (est.)" },
  mohurd: { cnyB: 15, note: "Housing and urban development (est.)" },
  mot: { cnyB: 95, note: "Transport verticals (est.)" },
  mwr: { cnyB: 12, note: "Water resources (est.)" },
  moa: { cnyB: 35, note: "Agriculture ministry (est.)" },
  mofcom: { cnyB: 18, note: "Commerce ministry (est.)" },
  mct: { cnyB: 22, note: "Culture and tourism (est.)" },
  nhc: { cnyB: 230, note: "Health system (est.)" },
  mva: { cnyB: 6, note: "Veterans affairs (est.)" },
  mem: { cnyB: 65, note: "Emergency management (est.)" },
  pboc: { cnyB: 95, note: "Central bank operations (est.)" },
  audit: { cnyB: 4.5, note: "National audit office (est.)" },
  customs: { cnyB: 38, note: "Customs administration (est.)" },
  samr: { cnyB: 42, note: "Market regulation (est.)" },
  stats: { cnyB: 8, note: "National statistics (est.)" },
  sasac: { cnyB: 1.8, note: "SOE regulator central organ (est.)" },
  tax: { cnyB: 145, note: "State taxation administration (est.)" },
  "cmc-root": { cnyB: 1780, note: "National defense expenditure 2025 (est.)" },
  cmc: { cnyB: 1780, note: "PLA total defense budget (est.)" },
  "cmc-0": { cnyB: 8, note: "CMC General Office (est.)" },
  "cmc-1": { cnyB: 420, note: "Joint Staff / operations (est.)" },
  "cmc-2": { cnyB: 85, note: "Political work (est.)" },
  "cmc-3": { cnyB: 180, note: "Logistics (est.)" },
  "cmc-4": { cnyB: 320, note: "Equipment development (est.)" },
  "cmc-5": { cnyB: 45, note: "Training administration (est.)" },
  "cmc-6": { cnyB: 35, note: "Defense mobilization (est.)" },
  "cmc-7": { cnyB: 12, note: "Discipline inspection (est.)" },
  "cmc-8": { cnyB: 8, note: "Politics and law (est.)" },
  "cmc-9": { cnyB: 95, note: "Defense S&T (est.)" },
  "cmc-10": { cnyB: 15, note: "Strategic planning (est.)" },
  "cmc-11": { cnyB: 10, note: "Reform and structure (est.)" },
  "cmc-12": { cnyB: 6, note: "International military cooperation (est.)" },
  "cmc-13": { cnyB: 5, note: "Military audit (est.)" },
  "cmc-14": { cnyB: 12, note: "Organ administration (est.)" },
  "ccdi-root": { cnyB: 18, note: "CCDI/NSC central organ (est.)" },
  ccdi: { cnyB: 18, note: "Discipline inspection system (est.)" },
  "npc-root": { cnyB: 12, note: "NPCSC central operations (est.)" },
  npc: { cnyB: 12, note: "NPC system central spend (est.)" },
  "npc-full": { cnyB: 3, note: "Full session operations (est.)" },
  "cppcc-root": { cnyB: 6.5, note: "CPPCC central operations (est.)" },
  cppcc: { cnyB: 6.5, note: "CPPCC system (est.)" },
  "bur-tobacco": { cnyB: 1400, revenue: true, note: "State tobacco monopoly revenue (est.)" },
};

const SOE_NODE_IDS = new Set(["sasac", "pboc", "bur-tobacco", "soe-root", "media-soe-root", "sc-soe-root"]);

const PARTY_DEPT_KEY: Record<string, string> = {
  "Organization Department": "Organization Department 组织部",
  "Publicity (Propaganda) Department": "Publicity Department 宣传部",
  "United Front Work Department": "United Front Work Department 统战部",
  "International Department": "International Department 对外联络部",
  "Political-Legal Affairs Commission": "Political-Legal Affairs Commission 政法委",
  "Social Work Department": "Social Work Department 社会工作部",
};

/** Tuple: [name, function, employees, revenue CNY billions (2024/25 est.)]. */
type SoeDef = [name: string, fn: string, emp: number, revCnyB: number];

/** 97 central SOEs under SASAC / Huijin supervision — party leadership via Org Dept. */
const SASAC_SOE_DEFS: SoeDef[] = [
  ["China State Railway Group 国铁集团", "National rail network operator", 2_000_000, 1100],
  ["China National Petroleum (CNPC) 中石油", "Oil & gas exploration, refining, pipelines", 1_300_000, 3000],
  ["State Grid Corporation 国家电网", "National power transmission & distribution", 900_000, 3900],
  ["China National Tobacco (CNTC) 国家烟草", "Tobacco monopoly (MIIT nameplate)", 450_000, 1400],
  ["China Mobile 中国移动", "Telecom operator", 450_000, 1000],
  ["Aviation Industry Corp (AVIC) 航空工业", "Aircraft, defense aerospace manufacturing", 420_000, 560],
  ["China Post Group 中国邮政", "Postal and logistics services", 400_000, 480],
  ["Sinopec Group 中石化", "Petrochemical refining and marketing", 370_000, 3200],
  ["Industrial & Commercial Bank (ICBC) 工商银行", "Largest state-owned commercial bank", 310_000, 840],
  ["Agricultural Bank of China 农业银行", "State-owned commercial bank", 290_000, 720],
  ["China Construction Bank 建设银行", "State-owned commercial bank", 280_000, 770],
  ["China Telecom 中国电信", "Telecom operator", 280_000, 520],
  ["Bank of China 中国银行", "State-owned commercial bank", 270_000, 650],
  ["China Unicom 中国联通", "Telecom operator", 240_000, 380],
  ["CRRC 中国中车", "Rail rolling stock manufacturing", 180_000, 240],
  ["China National Nuclear (CNNC) 中核集团", "Nuclear power, uranium mining", 190_000, 260],
  ["China Aerospace Science & Technology (CASC) 航天科技", "Satellites, launch vehicles", 170_000, 320],
  ["China Aerospace Science & Industry (CASIC) 航天科工", "Missile systems, defense aerospace", 160_000, 280],
  ["China Shipbuilding Industry (CSSC) 中国船舶", "Naval and commercial shipbuilding", 150_000, 180],
  ["China Electronics Technology Group (CETC) 中国电科", "Defense electronics, radar, semiconductors", 140_000, 350],
  ["China National Offshore Oil (CNOOC) 中海油", "Offshore oil and gas", 130_000, 420],
  ["COSCO Shipping 中远海运", "Maritime shipping and logistics", 130_000, 390],
  ["China Southern Power Grid 南方电网", "Power grid (south China)", 120_000, 780],
  ["China Communications Construction (CCCC) 中交建", "Infrastructure, ports, highways", 110_000, 780],
  ["Dongfeng Motor 东风汽车", "Automotive manufacturing", 110_000, 140],
  ["China Minmetals 中国五矿", "Metals and mining trading", 100_000, 680],
  ["China Baowu Steel 宝武钢铁", "World's largest steel producer", 95_000, 1000],
  ["China Merchants Group 招商局", "Ports, finance, shipping conglomerate", 90_000, 950],
  ["China Energy Investment 国家能源", "Coal, power generation", 85_000, 340],
  ["China Huaneng Group 华能集团", "Power generation", 80_000, 380],
  ["Norinco Group 兵器工业", "Defense equipment, ordnance manufacturing", 75_000, 220],
  ["China South Industries 兵器装备", "Defense equipment, automotive", 72_000, 180],
  ["China FAW Group 一汽集团", "Automotive (incl. VW, Toyota JVs)", 70_000, 120],
  ["China Poly Group 保利集团", "Defense trade, real estate, culture", 65_000, 180],
  ["Bank of Communications 交通银行", "State-owned commercial bank", 90_000, 280],
  ["China Datang 大唐集团", "Power generation", 60_000, 280],
  ["China Huadian 华电集团", "Power generation", 58_000, 290],
  ["State Power Investment 国家电投", "Nuclear, hydro, thermal power", 55_000, 310],
  ["China Three Gorges 三峡集团", "Hydropower, clean energy", 52_000, 150],
  ["China National Aviation Fuel 中国航油", "Aviation fuel supply", 50_000, 320],
  ["China Railway Engineering (CREC) 中国中铁", "Railway and infrastructure construction", 48_000, 1100],
  ["China Railway Construction (CRCC) 中国铁建", "Railway and infrastructure construction", 46_000, 1050],
  ["China State Construction (CSCEC) 中国建筑", "Construction and real estate", 45_000, 2300],
  ["Sinopharm Group 国药集团", "Pharmaceutical distribution and manufacturing", 42_000, 680],
  ["China National Chemical (Sinochem) 中化控股", "Chemicals, agriculture, energy", 40_000, 620],
  ["COFCO Group 中粮集团", "Food, agriculture, trading", 38_000, 580],
  ["China Resources (CR Holdings) 华润集团", "Consumer, healthcare, energy conglomerate", 36_000, 720],
  ["China General Technology 通用技术", "Machinery, healthcare, construction", 35_000, 180],
  ["China National Machinery (Sinomach) 国机集团", "Machinery manufacturing and engineering", 34_000, 320],
  ["China Eastern Air 东方航空", "Airline operator", 32_000, 120],
  ["China Southern Airlines 南方航空", "Airline operator", 31_000, 140],
  ["Air China 国航", "Flag carrier airline", 30_000, 130],
  ["China SatNet 中国星网", "Satellite internet constellation", 28_000, 8],
  ["China Electronics Corp (CEC) 中国电子", "Semiconductors, IT equipment", 27_000, 420],
  ["China First Heavy Industries 一重集团", "Heavy machinery manufacturing", 26_000, 85],
  ["Harbin Electric 哈电集团", "Power equipment manufacturing", 25_000, 180],
  ["Dongfang Electric 东方电气", "Power equipment manufacturing", 24_000, 170],
  ["PowerChina 中国电建", "Power and infrastructure construction", 26_000, 680],
  ["Energy China 中国能建", "Power and infrastructure engineering", 24_000, 420],
  ["Ansteel Group 鞍钢集团", "Steel production", 23_000, 110],
  ["China Aluminum (Chinalco) 中铝集团", "Aluminum and non-ferrous metals", 22_000, 320],
  ["China General Nuclear (CGN) 中广核", "Nuclear power generation", 20_000, 85],
  ["China Mineral Resources 中国矿产", "Strategic mineral resources", 20_000, 95],
  ["China Rongtong 中国融通", "Military-civilian asset management", 18_000, 45],
  ["China Aero Engine (AECC) 中国航发", "Aircraft engine manufacturing", 17_000, 55],
  ["PipeChina 国家管网", "Oil and gas pipeline network", 16_000, 95],
  ["Sinograin 中储粮", "Grain reserves and logistics", 15_000, 85],
  ["China South-North Water 南水北调", "Water diversion infrastructure", 14_000, 12],
  ["SDIC Group 国投集团", "Investment holding conglomerate", 13_000, 680],
  ["China Tourism Group 中国旅游", "Tourism and hospitality", 12_000, 65],
  ["COMAC 中国商飞", "Commercial aircraft manufacturing", 11_000, 28],
  ["China Energy Conservation 中国节能", "Environmental protection and energy", 10_000, 55],
  ["Postal Savings Bank 邮储银行", "State-owned commercial bank", 65_000, 360],
  ["CIECC 中咨公司", "Engineering consulting", 9500, 18],
  ["China Chengtong 中国诚通", "State capital operations and restructuring", 9000, 420],
  ["China Coal Energy 中煤能源", "Coal mining and energy", 8500, 180],
  ["China Coal Tech & Engineering 煤科工", "Coal technology and equipment", 8000, 65],
  ["China Academy of Machinery (CAM) 机械总院", "Machinery R&D", 7500, 12],
  ["China Iron & Steel Research (CISRI) 钢研科技", "Metallurgical R&D", 7000, 15],
  ["China National Chemical Engineering 中国化学", "Chemical engineering and construction", 6800, 180],
  ["China National Salt Industry (CNSG) 中盐集团", "Salt production and distribution", 6500, 22],
  ["China National Building Materials 中国建材", "Cement, glass, materials", 6200, 220],
  ["China Nonferrous Metal Mining (NFC) 有色矿业", "Non-ferrous mining overseas", 6000, 95],
  ["China Rare Earth Group 中国稀土", "Rare earth mining and processing", 5500, 35],
  ["China GRINM 有研科技", "Non-ferrous metals R&D", 5000, 18],
  ["BGRIMM 矿冶科技", "Mining and metallurgy R&D", 4800, 15],
  ["CIIC 中智集团", "HR services and consulting", 4500, 25],
  ["CABR 建研院", "Building research and design", 4200, 12],
  ["China Railway Signal & Comm (CRSC) 中国通号", "Railway signaling systems", 4000, 42],
  ["China InfoComm Tech (CICT) 中国信科", "Telecom equipment and R&D", 3800, 55],
  ["China Coal Geology 煤炭地质总局", "Coal geological exploration", 3500, 8],
  ["Xinxing Cathay 新兴际华", "Textiles, emergency equipment", 3200, 65],
  ["TravelSky 中航信", "Aviation IT and ticketing", 3000, 28],
  ["China Aviation Supplies 中国航材", "Aviation materials and MRO", 2800, 22],
  ["China Aneng 中国安能", "Emergency rescue and construction", 2500, 18],
  ["China Gold Group 中国黄金", "Gold mining and refining", 2200, 65],
  ["China Electrical Equipment 中国电气装备", "Power transmission equipment", 2000, 95],
];

/** Media SOEs supervised by the Propaganda Department (revenue in CNY billions). */
const MEDIA_SOE_DEFS: SoeDef[] = [
  ["China Media Group 中央广播电视总台", "CCTV + China National Radio merged (2018)", 15_000, 18],
  ["Xinhua News Agency 新华通讯社", "Official news wire and global media", 12_000, 8.5],
  ["People's Daily 人民日报社", "CCP official newspaper", 8000, 4.2],
  ["China Publishing Group 中国出版集团", "Books, periodicals, digital publishing", 6000, 3.8],
  ["China Film Group 中影集团", "Film production, distribution, import", 4500, 2.5],
  ["China Daily 中国日报社", "English-language external propaganda", 1200, 0.8],
];

export function parseHeadcount(emp?: string): number {
  if (!emp || emp === "ND") return -1;
  const cleaned = emp.replace(/,/g, "").replace(/~/g, "");
  const match = cleaned.match(/([\d.]+)\s*([KkMm])?/);
  if (!match) return -1;
  const n = parseFloat(match[1]);
  const suffix = match[2]?.toUpperCase();
  if (suffix === "M") return n * 1_000_000;
  if (suffix === "K") return n * 1_000;
  if (n < 1000 && cleaned.includes(".")) return n * 1_000_000;
  return n;
}

export function formatHeadcount(n: number): string {
  if (n < 0) return "ND";
  if (n >= 1_000_000) return `~${(n / 1_000_000).toFixed(2).replace(/\.?0+$/, "")}M`;
  if (n >= 1_000) return `~${Math.round(n / 1_000)}K`;
  return `~${Math.round(n)}`;
}

function sortDeptsByHeadcountDesc(depts: ExpandableDept[]): ExpandableDept[] {
  return [...depts]
    .map((d) => ({
      ...d,
      children: d.children ? sortDeptsByHeadcountDesc(d.children) : undefined,
    }))
    .sort((a, b) => parseHeadcount(b.employees) - parseHeadcount(a.employees));
}

function soeFromDef(def: SoeDef, id: string): ExpandableDept {
  const [name, fn, emp, revCnyB] = def;
  const extra: Partial<ExpandableDept> = {};
  if (name.includes("Railway Group")) extra.employeeNote = "Largest central SOE by headcount (est.)";
  if (name.includes("ICBC")) extra.employeeNote = "Financial SOE; party leadership via Org Dept";
  if (name.includes("Tobacco")) extra.employeeNote = "Dual MIIT/Org Dept oversight";
  if (name.includes("Media Group")) extra.employeeNote = "Flagship broadcast SOE";
  return {
    id,
    name,
    head: "—",
    function: fn,
    employees: formatHeadcount(emp),
    budget: fmtUsdFromCnyB(revCnyB, { revenue: true }),
    budgetUsdB: usdBFromCnyB(revCnyB),
    isSOE: true,
    ...extra,
  };
}

function buildCentralSoeList(prefix: string): ExpandableDept[] {
  return sortDeptsByHeadcountDesc(
    SASAC_SOE_DEFS.map((def, i) => soeFromDef(def, `${prefix}-soe-${i}`))
  );
}

function buildMediaSoeList(prefix: string): ExpandableDept[] {
  return sortDeptsByHeadcountDesc(
    MEDIA_SOE_DEFS.map((def, i) => soeFromDef(def, `${prefix}-media-soe-${i}`))
  );
}

function totalSoeWorkforce(): number {
  return SASAC_SOE_DEFS.reduce((sum, d) => sum + d[2], 0);
}

function totalSoeRevenueUsdB(): number {
  const cnyB = SASAC_SOE_DEFS.reduce((sum, d) => sum + d[3], 0);
  return usdBFromCnyB(cnyB);
}

function soeRootEmployeeNote(): string {
  return `${SASAC_SOE_DEFS.length} central SOEs listed below; combined workforce ${formatHeadcount(totalSoeWorkforce())}, combined revenue ${formatTotalUsd(totalSoeRevenueUsdB())} (2025 USD est.)`;
}

export function sumDeptHeadcount(depts: ExpandableDept[]): number {
  return depts.reduce((sum, d) => sum + Math.max(0, parseHeadcount(d.employees)), 0);
}

export function sumDeptBudgetUsdB(depts: ExpandableDept[]): number {
  return depts.reduce((sum, d) => {
    if (d.budgetUsdB !== undefined) return sum + d.budgetUsdB;
    const raw = d.budget?.replace(/,/g, "") ?? "";
    if (!raw || raw.includes("ND")) return sum;
    const t = raw.match(/\$([\d.]+)T/);
    if (t) return sum + parseFloat(t[1]) * 1000;
    const b = raw.match(/\$([\d.]+)B/);
    if (b) return sum + parseFloat(b[1]);
    const m = raw.match(/\$([\d.]+)M/);
    if (m) return sum + parseFloat(m[1]) / 1000;
    return sum;
  }, 0);
}

export function countSOEsInTree(depts: ExpandableDept[]): number {
  return depts.reduce(
    (n, d) => n + (d.isSOE ? 1 : 0) + (d.children ? countSOEsInTree(d.children) : 0),
    0
  );
}

function markSoeNodes(dept: ExpandableDept): ExpandableDept {
  const isSOE = Boolean(dept.isSOE || SOE_NODE_IDS.has(dept.id));
  return {
    ...dept,
    isSOE,
    children: dept.children?.map(markSoeNodes),
  };
}

function soeChildrenForTree(prefix: string): ExpandableDept[] {
  return buildCentralSoeList(prefix);
}

export function defaultExpandedForNode(nodeId: string): string[] {
  switch (nodeId) {
    case "psc":
      return ["psc-xi", "psc-li", "psc-zhao", "psc-wang", "psc-cai", "psc-ding", "psc-lixi"];
    case "nc":
      return ["nc-npc-14"];
    case "cc":
      return ["cc-pb", "cc-psc"];
    case "sc":
      return ["mps", "tax", "nhc", "mot", "sasac", "sc-soe-root"];
    case "npc":
      return ["npc-root", "npc-full"];
    case "cppcc":
      return ["cppcc-root"];
    case "sec":
      return ["party-dept-4", "party-dept-1", "party-dept-0", "soe-root", "media-soe-root"];
    case "cmc":
      return ["cmc-1", "cmc-4", "cmc-3"];
    case "ccdi":
      return ["ccdi-root"];
    case "org":
      return ["org-root", "soe-root"];
    default:
      return [];
  }
}

/** Maps PSC rank → hierarchy node when clicking a PSC member name. */
const PSC_NODE_MAP: Record<number, string> = {
  1: "psc",
  2: "sc",
  3: "npc",
  4: "cppcc",
  5: "sec",
  6: "sc",
  7: "ccdi",
};

const MFA_SUBDEPTS: ExpandableDept[] = [
  { id: "mfa-admin", name: "Diplomatic management 外交管理事务", head: "—", function: "Embassy and consular administration", employees: "~20,000", employeeNote: "Embassy/consular staff worldwide (est.)" },
  { id: "mfa-aid", name: "Foreign aid 对外援助", head: "—", function: "Global development cooperation", employees: "~1,200", employeeNote: "Central aid administration (est.)" },
  { id: "mfa-io", name: "International organizations 国际组织", head: "—", function: "UN and multilateral membership dues", employees: "~400", employeeNote: "Central staff (est.)" },
  { id: "mfa-exchange", name: "External cooperation 对外合作交流", head: "—", function: "Bilateral cultural and political exchanges", employees: "~800", employeeNote: "Central staff (est.)" },
];

const LAC_OFFICES: ExpandableDept[] = [
  { id: "lac-criminal", name: "Criminal Law Office", head: "—", function: "Criminal legislation drafting", employees: "~80", employeeNote: "Legislative Affairs Commission" },
  { id: "lac-economic", name: "Economic Law Office", head: "—", function: "Economic and commercial law", employees: "~70", employeeNote: "Legislative Affairs Commission" },
  { id: "lac-civil", name: "Civil Law Office", head: "—", function: "Civil and commercial code", employees: "~65", employeeNote: "Legislative Affairs Commission" },
  { id: "lac-state", name: "State Law Office", head: "—", function: "State structure and governance law", employees: "~60", employeeNote: "Legislative Affairs Commission" },
  { id: "lac-admin", name: "Administrative Law Office", head: "—", function: "Administrative procedure law", employees: "~55", employeeNote: "Legislative Affairs Commission" },
  { id: "lac-social", name: "Social Law Office", head: "—", function: "Labor, social welfare legislation", employees: "~55", employeeNote: "Legislative Affairs Commission" },
  { id: "lac-const", name: "Constitution Office", head: "—", function: "Constitutional review and interpretation support", employees: "~40", employeeNote: "Est. 2018" },
  { id: "lac-review", name: "Recording & Reviewing Regulations Office", head: "—", function: "Legislative filing and constitutionality review", employees: "~45", employeeNote: "Legislative Affairs Commission" },
  { id: "lac-planning", name: "Legislative Planning Office", head: "—", function: "Five-year and annual legislative agenda", employees: "~50", employeeNote: "Legislative Affairs Commission" },
];

function toExpandable(
  id: string,
  row: DeptRow,
  children?: ExpandableDept[],
  extras?: Partial<Pick<ExpandableDept, "employees" | "employeeNote" | "budget" | "budgetNote" | "budgetUsdB" | "isSOE">>
): ExpandableDept {
  const h = HEADCOUNT[id] ?? headcountForUnit(row.name);
  const b = ORGAN_BUDGET_CNY_B[id];
  const budgetUsdB =
    extras?.budgetUsdB ?? (b && b.cnyB > 0 ? usdBFromCnyB(b.cnyB) : undefined);
  return {
    id,
    ...row,
    employees: extras?.employees ?? h?.count,
    employeeNote: extras?.employeeNote ?? h?.note,
    budget:
      extras?.budget ??
      (b && b.cnyB > 0 ? fmtUsdFromCnyB(b.cnyB, { revenue: b.revenue }) : b?.cnyB === 0 ? "ND" : undefined),
    budgetUsdB,
    budgetNote: extras?.budgetNote ?? b?.note,
    isSOE: extras?.isSOE,
    children,
  };
}

function buildStateCouncilTree(): ExpandableDept[] {
  const bureauMap: Record<string, ExpandableDept[]> = {};
  for (const b of STATE_COUNCIL_NATIONAL_BUREAUS) {
    const key = b.reportsTo ?? "other";
    if (!bureauMap[key]) bureauMap[key] = [];
    bureauMap[key].push(toExpandable(BUREAU_IDS[b.name] ?? `bur-${key}-${bureauMap[key].length}`, b));
  }

  const ids: Record<string, string> = {
    "General Office of the State Council": "sc-gov-office",
    "Ministry of Foreign Affairs 外交部": "mfa",
    "Ministry of National Defense 国防部": "mod",
    "National Development and Reform Commission 发改委": "ndrc",
    "Ministry of Education 教育部": "moe",
    "Ministry of Science and Technology 科技部": "most",
    "Ministry of Industry and Information Technology 工信部": "miit",
    "National Ethnic Affairs Commission 国家民委": "neac",
    "Ministry of Public Security 公安部": "mps",
    "Ministry of State Security 国家安全部": "mss",
    "Ministry of Civil Affairs 民政部": "mca",
    "Ministry of Justice 司法部": "moj",
    "Ministry of Finance 财政部": "mof",
    "Ministry of Human Resources and Social Security 人社部": "mohrss",
    "Ministry of Natural Resources 自然资源部": "mnr",
    "Ministry of Ecology and Environment 生态环境部": "mee",
    "Ministry of Housing and Urban-Rural Development 住建部": "mohurd",
    "Ministry of Transport 交通运输部": "mot",
    "Ministry of Water Resources 水利部": "mwr",
    "Ministry of Agriculture and Rural Affairs 农业农村部": "moa",
    "Ministry of Commerce 商务部": "mofcom",
    "Ministry of Culture and Tourism 文旅部": "mct",
    "National Health Commission 国家卫健委": "nhc",
    "Ministry of Veterans Affairs 退役军人事务部": "mva",
    "Ministry of Emergency Management 应急管理部": "mem",
    "People's Bank of China 中国人民银行": "pboc",
    "National Audit Office 审计署": "audit",
  };

  const ministryToBureauKey: Record<string, string> = {
    "National Development and Reform Commission 发改委": "NDRC",
    "Ministry of Industry and Information Technology 工信部": "MIIT",
    "Ministry of Natural Resources 自然资源部": "Ministry of Natural Resources",
    "Ministry of Public Security 公安部": "Ministry of Public Security",
    "Ministry of Transport 交通运输部": "Ministry of Transport",
    "Ministry of Culture and Tourism 文旅部": "Ministry of Culture and Tourism",
    "National Health Commission 国家卫健委": "National Health Commission",
    "Ministry of Emergency Management 应急管理部": "Ministry of Emergency Management",
    "People's Bank of China 中国人民银行": "People's Bank of China",
  };

  return STATE_COUNCIL_MINISTRIES.map((m) => {
    const id = ids[m.name] ?? m.name.slice(0, 8);
    const bureauKey = ministryToBureauKey[m.name];
    const children =
      id === "mfa" ? MFA_SUBDEPTS : bureauKey && bureauMap[bureauKey]?.length ? bureauMap[bureauKey] : undefined;
    return markSoeNodes(toExpandable(id, m, children));
  });
}

function buildDirectAgencyTree(withSOEs = false): ExpandableDept[] {
  const agencyIds: Record<string, string> = {
    "General Administration of Customs 海关总署": "customs",
    "State Administration for Market Regulation 市场监管总局": "samr",
    "National Bureau of Statistics 统计局": "stats",
    "State-owned Assets Supervision Commission 国资委": "sasac",
    "State Taxation Administration 税务总局": "tax",
  };
  const soeChildren = soeChildrenForTree("sc");
  return STATE_COUNCIL_DIRECT_AGENCIES.map((a) => {
    const id = agencyIds[a.name] ?? a.name.slice(0, 10);
    if (withSOEs && id === "sasac") {
      return markSoeNodes(
        toExpandable(
          id,
          a,
          [
            {
              id: "sc-soe-root",
              name: "97 central SOEs under SASAC supervision",
              head: "SASAC",
              function: "State-owned enterprises; party leadership appointed via Organization Dept",
              employees: formatHeadcount(sumDeptHeadcount(soeChildren)),
              budget: "—",
              isSOE: true,
              employeeNote: soeRootEmployeeNote(),
              children: soeChildren,
            },
          ],
          { isSOE: true }
        )
      );
    }
    const extras = id === "sasac" || id === "pboc" ? { isSOE: true as const } : undefined;
    return markSoeNodes(toExpandable(id, a, undefined, extras));
  });
}

function buildStateCouncilFullTree(): ExpandableDept[] {
  const ministries = buildStateCouncilTree().map(markSoeNodes);
  const agencies = buildDirectAgencyTree(true);
  return sortDeptsByHeadcountDesc([...ministries, ...agencies]);
}

function buildCmcFullTree(): ExpandableDept[] {
  return sortDeptsByHeadcountDesc(CMC_DEPARTMENTS.map((d, i) => toExpandable(`cmc-${i}`, d)));
}

function buildCcdiFullTree(): ExpandableDept[] {
  return sortDeptsByHeadcountDesc(CCDI_DEPARTMENTS.map((d, i) => toExpandable(`ccdi-${i}`, d)));
}

function buildOrgFullTree(): ExpandableDept[] {
  const soeChildren = soeChildrenForTree("org");
  const bureaus = (PARTY_DEPT_INTERNALS["Organization Department 组织部"] ?? []).map((u, j) =>
    toExpandable(`org-bureau-${j}`, u)
  );
  return sortDeptsByHeadcountDesc([
    markSoeNodes(
      toExpandable(
        "org-root",
        {
          name: "Central Organization Department 中央组织部",
          head: "Li Ganjie 李干杰 (Politburo)",
          function: "Nomenklatura appointments for ~5,000 key positions",
        },
        sortDeptsByHeadcountDesc([
          ...bureaus,
          {
            id: "soe-root",
            name: "Central SOEs (97 under SASAC) — party leadership appointed here",
            head: "Org Dept Cadre Bureau",
            function: "Nomenklatura controls SOE party secretaries, chairmen, and general managers",
            employees: formatHeadcount(sumDeptHeadcount(soeChildren)),
            budget: "—",
            isSOE: true,
            employeeNote: soeRootEmployeeNote(),
            children: soeChildren,
          },
        ])
      )
    ),
  ]);
}

function buildNpcTree(): ExpandableDept[] {
  const working = sortDeptsByHeadcountDesc(
    NPCSC_WORKING_BODIES.map((w, i) => {
      const id = `npcsc-${i}`;
      const children = w.name.includes("Legislative Affairs") ? LAC_OFFICES : undefined;
      return toExpandable(id, w, children);
    })
  );
  const committees = sortDeptsByHeadcountDesc(
    NPC_SPECIAL_COMMITTEES.map((c, i) => toExpandable(`npc-comm-${i}`, c))
  );
  const root = toExpandable(
    "npc-root",
    {
      name: "NPC Standing Committee 全国人大常委会",
      head: "Zhao Leji 赵乐际",
      function: "De facto national legislature; 163 members",
    },
    working
  );
  return sortDeptsByHeadcountDesc([
    root,
    toExpandable(
      "npc-full",
      {
        name: "NPC Full Session 全国人民代表大会",
        head: "2,878 deputies",
        function: "Meets each March; ratifies laws and appoints leaders",
      },
      committees
    ),
  ]);
}

function buildCppccTree(): ExpandableDept[] {
  const committees = sortDeptsByHeadcountDesc(
    CPPCC_COMMITTEES.map((c, i) => toExpandable(`cppcc-${i}`, c))
  );
  const root = toExpandable(
    "cppcc-root",
    {
      name: "CPPCC National Committee 全国政协",
      head: "Wang Huning 王沪宁",
      function: "United-front advisory body; ~2,169 members",
    },
    committees
  );
  return [root];
}

function buildSecretariatTree(): ExpandableDept[] {
  const soeChildren = buildCentralSoeList("soe");
  const mediaSoeChildren = buildMediaSoeList("sec");

  const deptTrees = SECRETARIAT_DEPTS.map((d, i) => {
    const internalsKey = PARTY_DEPT_KEY[d.dept];
    const internalUnits = (PARTY_DEPT_INTERNALS[internalsKey] ?? []).map((u, j) =>
      toExpandable(`party-unit-${i}-${j}`, u)
    );
    let children: ExpandableDept[] | undefined =
      internalUnits.length > 0 ? sortDeptsByHeadcountDesc(internalUnits) : undefined;

    if (d.dept === "Organization Department") {
      children = sortDeptsByHeadcountDesc([
        ...internalUnits,
        {
          id: "soe-root",
          name: "Central SOEs (97 under SASAC) — party leadership appointed here",
          head: "Org Dept Cadre Bureau",
          function: "Nomenklatura controls SOE party secretaries, chairmen, and general managers",
          employees: formatHeadcount(sumDeptHeadcount(soeChildren)),
          budget: "—",
          isSOE: true,
          employeeNote: `${soeRootEmployeeNote()}; SASAC holds equity, Org Dept appoints leaders`,
          children: soeChildren,
        },
      ]);
    }

    if (d.dept === "Publicity (Propaganda) Department") {
      children = sortDeptsByHeadcountDesc([
        ...internalUnits,
        {
          id: "media-soe-root",
          name: "Media SOEs — directly supervised by Propaganda Dept",
          head: "Li Shulei (Director)",
          function: "State-owned media and publishing enterprises",
          employees: formatHeadcount(sumDeptHeadcount(mediaSoeChildren)),
          budget: fmtUsdFromCnyB(37),
          isSOE: true,
          employeeNote: "6 flagship media SOEs; sorted by headcount below",
          children: mediaSoeChildren,
        },
      ]);
    }

    if (d.dept === "Political-Legal Affairs Commission" && children) {
      children = sortDeptsByHeadcountDesc(children);
    }

    return toExpandable(`party-dept-${i}`, { name: d.dept, head: d.head, function: d.function }, children);
  });

  const govOffice = toExpandable("sec-gov-office", {
    name: "General Office of the CCP Central Committee 中央办公厅",
    head: "Cai Qi 蔡奇",
    function: "Day-to-day Central Committee operations; document flow, scheduling, security",
  });

  return sortDeptsByHeadcountDesc([govOffice, ...deptTrees]);
}

function buildPartyDeptTree(): ExpandableDept[] {
  return buildSecretariatTree();
}

function buildCcdiTree(): ExpandableDept[] {
  return [
    toExpandable(
      "ccdi-root",
      {
        name: "CCDI + National Supervisory Commission 中央纪委国家监委",
        head: "Li Xi 李希",
        function: "Party discipline and state anti-corruption; fused since 2018",
      },
      CCDI_DEPARTMENTS.map((d, i) => toExpandable(`ccdi-${i}`, d))
    ),
  ];
}

function buildCmcTree(): ExpandableDept[] {
  return CMC_DEPARTMENTS.map((d, i) => toExpandable(`cmc-${i}`, d));
}

function buildXiTree(): ExpandableDept[] {
  return XI_COMMISSIONS.map((c, i) => {
    const id = `xi-${i}`;
    const children =
      c.name.includes("Military Commission")
        ? buildCmcFullTree()
        : c.name.includes("Foreign Affairs")
          ? [toExpandable("mfa-under-xi", { name: "Ministry of Foreign Affairs", head: "Wang Yi", function: "Executes foreign policy", reportsTo: "Xi / Foreign Affairs Commission" }, MFA_SUBDEPTS)]
          : undefined;
    return toExpandable(id, c, children);
  });
}

const STATE_COUNCIL_MINISTRIES: DeptRow[] = [
  { name: "General Office of the State Council", head: "—", function: "Day-to-day administrative operations; assists premier and vice premiers", reportsTo: "Premier Li Qiang" },
  { name: "Ministry of Foreign Affairs 外交部", head: "Wang Yi 王毅", function: "Diplomacy, treaties, consular affairs", reportsTo: "Xi Jinping (Foreign Affairs Commission)" },
  { name: "Ministry of National Defense 国防部", head: "Dong Jun 董军", function: "Ceremonial defense ministry; real command via CMC", reportsTo: "Xi Jinping (CMC Chairman)" },
  { name: "National Development and Reform Commission 发改委", head: "Zheng Shanjie 郑栅洁", function: "Macroeconomic planning, major project approval, price regulation", reportsTo: "VP Ding Xuexiang" },
  { name: "Ministry of Education 教育部", head: "Huai Jinpeng 怀进鹏", function: "National education policy, universities, language affairs", reportsTo: "State Council" },
  { name: "Ministry of Science and Technology 科技部", head: "Yin Hejun 阴和俊", function: "R&D policy, national S&T programs", reportsTo: "State Council" },
  { name: "Ministry of Industry and Information Technology 工信部", head: "Li Lecheng 李乐成", function: "Industry, telecom, internet, space & nuclear (nameplates)", reportsTo: "VP Zhang Guoqing" },
  { name: "National Ethnic Affairs Commission 国家民委", head: "Pan Yue 潘岳", function: "Ethnic minority policy (Party-controlled via United Front)", reportsTo: "Shi Taifeng (UFWD)" },
  { name: "Ministry of Public Security 公安部", head: "Wang Xiaohong 王小洪", function: "Police, public order, immigration administration", reportsTo: "Chen Wenqing (Political-Legal Affairs)" },
  { name: "Ministry of State Security 国家安全部", head: "Chen Yixin 陈一新", function: "Counter-intelligence, state security", reportsTo: "Chen Wenqing (Political-Legal Affairs)" },
  { name: "Ministry of Civil Affairs 民政部", head: "Lu Zhiyuan 陆治原", function: "Social welfare, NGOs, marriage/adoption registration", reportsTo: "State Councillor Shen Yiqin" },
  { name: "Ministry of Justice 司法部", head: "He Rong 贺荣", function: "Legal system, lawyers, prisons, legal aid", reportsTo: "Chen Wenqing (Political-Legal Affairs)" },
  { name: "Ministry of Finance 财政部", head: "Lan Fo'an 蓝佛安", function: "Fiscal policy, taxation, treasury operations", reportsTo: "VP Ding Xuexiang" },
  { name: "Ministry of Human Resources and Social Security 人社部", head: "Wang Xiaoping 王晓萍", function: "Labor, pensions, social insurance, civil service (with Org Dept)", reportsTo: "State Councillor Shen Yiqin" },
  { name: "Ministry of Natural Resources 自然资源部", head: "Guan Zhi'ou 关志鸥", function: "Land, minerals, ocean administration (nameplate)", reportsTo: "VP Ding Xuexiang" },
  { name: "Ministry of Ecology and Environment 生态环境部", head: "Huang Runqiu 黄润秋", function: "Environmental protection, nuclear safety (nameplate)", reportsTo: "State Council" },
  { name: "Ministry of Housing and Urban-Rural Development 住建部", head: "Ni Hong 倪虹", function: "Housing, construction, urban planning", reportsTo: "VP He Lifeng" },
  { name: "Ministry of Transport 交通运输部", head: "Liu Wei 刘伟", function: "Roads, rail, aviation, maritime transport", reportsTo: "State Council" },
  { name: "Ministry of Water Resources 水利部", head: "Li Guoying 李国英", function: "Water management, flood control, irrigation", reportsTo: "VP Liu Guozhong" },
  { name: "Ministry of Agriculture and Rural Affairs 农业农村部", head: "Han Jun 韩俊", function: "Agriculture, rural revitalization (nameplate)", reportsTo: "State Council" },
  { name: "Ministry of Commerce 商务部", head: "Wang Wentao 王文涛", function: "Domestic & foreign trade, investment promotion", reportsTo: "VP He Lifeng" },
  { name: "Ministry of Culture and Tourism 文旅部", head: "Sun Yeli 孙业礼", function: "Culture, tourism, heritage administration (nameplate)", reportsTo: "Li Shulei (Propaganda Dept)" },
  { name: "National Health Commission 国家卫健委", head: "Lei Haichao 雷海潮", function: "Healthcare policy, disease control (nameplate)", reportsTo: "VP Liu Guozhong" },
  { name: "Ministry of Veterans Affairs 退役军人事务部", head: "Pei Jinjia 裴金佳", function: "Veterans benefits, resettlement", reportsTo: "State Councillor Shen Yiqin" },
  { name: "Ministry of Emergency Management 应急管理部", head: "Zhang Chengzhong 张成中", function: "Disaster response, workplace safety, fire/rescue (nameplate)", reportsTo: "VP Zhang Guoqing" },
  { name: "People's Bank of China 中国人民银行", head: "Pan Gongsheng 潘功胜", function: "Monetary policy, financial stability, forex (nameplate)", reportsTo: "VP He Lifeng (Central Finance Commission)" },
  { name: "National Audit Office 审计署", head: "Hou Kai 侯凯", function: "Audits government finances and SOE accounts", reportsTo: "Premier Li Qiang" },
];

const STATE_COUNCIL_DIRECT_AGENCIES: DeptRow[] = [
  { name: "General Administration of Customs 海关总署", head: "—", function: "Import/export regulation, border customs" },
  { name: "State Administration for Market Regulation 市场监管总局", head: "—", function: "Business registration, food/drug safety, anti-monopoly (nameplates)" },
  { name: "China Securities Regulatory Commission 证监会", head: "—", function: "Securities markets regulation" },
  { name: "General Administration of Sport 体育总局", head: "—", function: "National sports policy and administration" },
  { name: "National Bureau of Statistics 统计局", head: "—", function: "Official economic and social statistics" },
  { name: "China International Development Cooperation Agency 国际发展合作署", head: "—", function: "Foreign aid and development assistance" },
  { name: "State Taxation Administration 税务总局", head: "—", function: "Tax collection and administration" },
  { name: "National Financial Regulatory Administration 金融监管总局", head: "—", function: "Banking and insurance supervision (2023 reform)" },
  { name: "National Radio and Television Administration 广电总局", head: "—", function: "Broadcasting regulation (Party Propaganda nameplate)" },
  { name: "National Public Complaints and Proposals Administration 信访局", head: "—", function: "Public petition and complaint handling" },
  { name: "National Intellectual Property Administration 知识产权局", head: "—", function: "Patents, trademarks, IP enforcement" },
  { name: "National Healthcare Security Administration 医保局", head: "—", function: "Medical insurance system" },
  { name: "State-owned Assets Supervision Commission 国资委", head: "—", function: "Central SOE ownership and supervision (特设机构)" },
  { name: "State Council Research Office 国务院研究室", head: "—", function: "Policy research and drafting for State Council" },
];

const STATE_COUNCIL_NATIONAL_BUREAUS: DeptRow[] = [
  { name: "National Food and Strategic Reserves Administration", head: "—", function: "Grain and strategic stockpiles", reportsTo: "NDRC" },
  { name: "National Data Administration 国家数据局", head: "—", function: "Digital economy, data governance (est. 2023)", reportsTo: "NDRC" },
  { name: "National Energy Administration", head: "—", function: "Energy policy and regulation", reportsTo: "NDRC" },
  { name: "State Tobacco Monopoly Administration", head: "—", function: "Tobacco industry monopoly", reportsTo: "MIIT" },
  { name: "State Administration of Science, Technology and Industry for National Defense", head: "—", function: "Defense industry oversight", reportsTo: "MIIT" },
  { name: "National Forestry and Grassland Administration", head: "—", function: "Forests, parks, wildlife", reportsTo: "Ministry of Natural Resources" },
  { name: "National Immigration Administration 移民局", head: "—", function: "Border exit/entry administration", reportsTo: "Ministry of Public Security" },
  { name: "National Railway Administration", head: "—", function: "Rail industry regulation", reportsTo: "Ministry of Transport" },
  { name: "Civil Aviation Administration of China 民航局", head: "—", function: "Aviation safety and regulation", reportsTo: "Ministry of Transport" },
  { name: "State Post Bureau 邮政局", head: "—", function: "Postal services regulation", reportsTo: "Ministry of Transport" },
  { name: "National Cultural Heritage Administration 文物局", head: "—", function: "Cultural relics protection", reportsTo: "Ministry of Culture and Tourism" },
  { name: "National Administration of Disease Control and Prevention 疾控局", head: "—", function: "Disease surveillance and public health", reportsTo: "National Health Commission" },
  { name: "National Administration of Traditional Chinese Medicine 中医药局", head: "—", function: "TCM policy and standards", reportsTo: "National Health Commission" },
  { name: "National Fire and Rescue Administration 消防救援局", head: "—", function: "Firefighting and emergency rescue", reportsTo: "Ministry of Emergency Management" },
  { name: "National Mine Safety Administration", head: "—", function: "Mining safety oversight", reportsTo: "Ministry of Emergency Management" },
  { name: "National Medical Products Administration 药监局", head: "—", function: "Drug and medical device approval", reportsTo: "SAMR" },
  { name: "State Administration of Foreign Exchange 外汇局", head: "—", function: "Foreign exchange controls", reportsTo: "People's Bank of China" },
];

const NPC_SPECIAL_COMMITTEES: DeptRow[] = [
  { name: "Ethnic Affairs Committee 民族委员会", head: "—", function: "Legislation and oversight on ethnic minority affairs" },
  { name: "Constitution and Law Committee 宪法和法律委员会", head: "—", function: "Unified deliberation on all bills; constitutional review" },
  { name: "Supervisory and Judicial Affairs Committee 监察和司法委员会", head: "—", function: "Legislation on courts, procuratorate, supervision system" },
  { name: "Financial and Economic Affairs Committee 财政经济委员会", head: "—", function: "Fiscal and economic legislation, macroeconomic oversight" },
  { name: "Education, Science, Culture and Public Health Committee 教科文卫委员会", head: "—", function: "Education, research, culture, healthcare legislation" },
  { name: "Foreign Affairs Committee 外事委员会", head: "—", function: "Foreign relations legislation and treaty review" },
  { name: "Overseas Chinese Affairs Committee 华侨委员会", head: "—", function: "Overseas Chinese and diaspora-related legislation" },
  { name: "Environmental Protection and Resources Conservation Committee 环资委员会", head: "—", function: "Environment, climate, natural resources legislation" },
  { name: "Agriculture and Rural Affairs Committee 农业农村委员会", head: "—", function: "Agriculture, rural development, food security legislation" },
  { name: "Social Development Affairs Committee 社会建设委员会", head: "—", function: "Social welfare, labor, civil affairs legislation" },
];

const NPCSC_WORKING_BODIES: DeptRow[] = [
  { name: "General Office 办公厅", head: "—", function: "NPCSC administrative operations and document flow" },
  { name: "Legislative Affairs Commission 法制工作委员会", head: "—", function: "Drafts legislation; 11 law offices (criminal, civil, economic, etc.)" },
  { name: "Budgetary Affairs Commission 预算工作委员会", head: "—", function: "Fiscal review and oversight; 4 internal offices" },
  { name: "Delegate Affairs Commission 代表工作委员会", head: "—", function: "Supports NPC deputies (est. 2023)" },
  { name: "Hong Kong Basic Law Committee 香港基本法委员会", head: "—", function: "Interprets and advises on HK Basic Law" },
  { name: "Macao Basic Law Committee 澳门基本法委员会", head: "—", function: "Interprets and advises on Macao Basic Law" },
  { name: "Council of Chairpersons 委员长会议", head: "Zhao Leji", function: "Day-to-day NPCSC leadership; decides meeting agendas" },
];

const CPPCC_COMMITTEES: DeptRow[] = [
  { name: "Proposal Handling Committee 提案委员会", head: "—", function: "Reviews and assigns member proposals" },
  { name: "Economic Committee 经济委员会", head: "—", function: "Economic policy consultation and investigation" },
  { name: "Agriculture and Rural Affairs Committee 农业和农村委员会", head: "—", function: "Rural development and food security advisory" },
  { name: "Population, Resources and Environment Committee 人口资源环境委员会", head: "—", function: "Demographics, environment, sustainability advisory" },
  { name: "Education, Science, Culture, Health and Sports Committee 教科卫体委员会", head: "—", function: "Education, research, culture, health advisory" },
  { name: "Social and Legal Affairs Committee 社会和法制委员会", head: "—", function: "Social policy and legal system advisory" },
  { name: "Ethnic and Religious Affairs Committee 民族和宗教委员会", head: "—", function: "Ethnic unity and religious affairs advisory" },
  { name: "HK, Macao, Taiwan and Overseas Chinese Committee 港澳台侨委员会", head: "—", function: "Cross-strait and diaspora united-front work" },
  { name: "Foreign Affairs Committee 外事委员会", head: "—", function: "International exchange and people-to-people diplomacy" },
  { name: "Culture, Historical Data and Studies Committee 文化文史和学习委员会", head: "—", function: "Cultural heritage, historical research, study sessions" },
];

const CMC_DEPARTMENTS: DeptRow[] = [
  { name: "General Office 办公厅", head: "Fang Yongxiang 方永祥", function: "CMC administrative operations and document flow" },
  { name: "Joint Staff Department 联合参谋部", head: "Liu Zhenli (investigated)", function: "Combat planning, command support, military strategy" },
  { name: "Political Work Department 政治工作部", head: "Chen Demin 陈德民 (acting)", function: "Party building, political education, personnel in PLA" },
  { name: "Logistic Support Department 后勤保障部", head: "Chen Chi 陈炽", function: "Military logistics, supply chains, infrastructure" },
  { name: "Equipment Development Department 装备发展部", head: "Xu Xueqiang 许学强", function: "Weapons R&D, procurement, modernization" },
  { name: "Training and Administration Department 训练管理部", head: "Liu Di 刘镝", function: "Military training standards and administration" },
  { name: "National Defense Mobilization Department 国防动员部", head: "Zhang Like 张立克", function: "Reserve forces, militia, civil-military integration" },
  { name: "Discipline Inspection Commission 纪律检查委员会", head: "Zhang Shengmin 张升民", function: "Anti-corruption within military; CMC Vice Chairman" },
  { name: "Politics and Law Commission 政法委员会", head: "Vacant", function: "Military legal affairs and law enforcement" },
  { name: "Science and Technology Commission 科学技术委员会", head: "Zhao Xiaozhe 赵晓哲", function: "Defense science and technology innovation" },
  { name: "Office for Strategic Planning 战略规划办公室", head: "Shen Fangwu 沈方吾", function: "Long-term military strategy and planning" },
  { name: "Office for Reform and Organizational Structure 改革和编制办公室", head: "—", function: "Military structural reform implementation" },
  { name: "Office for International Military Cooperation 国际军事合作办公室", head: "—", function: "Foreign military diplomacy and exchanges" },
  { name: "Audit Office 审计署", head: "—", function: "Military financial audits" },
  { name: "Agency for Offices Administration 机关事务管理总局", head: "—", function: "CMC organ facilities and administration" },
];

const CCDI_DEPARTMENTS: DeptRow[] = [
  { name: "General Office 办公厅", head: "—", function: "CCDI/NSC administrative operations" },
  { name: "Organization Department 组织部", head: "—", function: "Discipline inspection cadre management" },
  { name: "Publicity Department 宣传部", head: "—", function: "Anti-corruption messaging and public communications" },
  { name: "Research Office 研究室", head: "—", function: "Policy research on discipline and supervision" },
  { name: "Legislative Affairs Office 法规室", head: "—", function: "Drafts supervision and anti-corruption regulations" },
  { name: "Party Conduct Office 党风政风监督室", head: "—", function: "Monitors official conduct and work style" },
  { name: "Petition Office 信访室", head: "—", function: "Receives corruption and discipline complaints" },
  { name: "Central Inspection Work Leading Group Office 巡视办", head: "—", function: "Manages mobile inspection teams sent to institutions" },
  { name: "Case Supervision and Management Office 案件监督管理室", head: "—", function: "Oversees case handling pipeline and clue management" },
  { name: "Case Adjudication Office 案件审理室", head: "—", function: "Reviews and adjudicates completed investigations" },
  { name: "Inspection Rooms 1–11 监督检查室", head: "—", function: "Daily supervision of assigned ministries, provinces, SOEs" },
  { name: "Investigation Rooms 12–16 审查调查室", head: "—", function: "Conducts corruption and discipline investigations" },
  { name: "Cadre Supervision Office 干部监督室", head: "—", function: "Supervises discipline inspection officials themselves" },
  { name: "International Cooperation Bureau 国际合作局", head: "—", function: "Cross-border corruption cooperation and fugitive repatriation" },
  { name: "National Supervisory Commission 国家监察委员会", head: "Liu Jinguo (deputy)", function: "State anti-corruption body; investigates all public servants" },
  { name: "Dispatched Resident Supervision Groups 派驻纪检监察组", head: "—", function: "Embedded in every central ministry, SOE, and university" },
];

const PARTY_DEPT_INTERNALS: Record<string, DeptRow[]> = {
  "Organization Department 组织部": [
    { name: "Cadre Bureau 干部局", head: "—", function: "Manages senior cadre appointments (core nomenklatura function)" },
    { name: "Organization Bureau 组织局", head: "—", function: "Party organization structure at all levels" },
    { name: "Training Bureau 培训局", head: "—", function: "Cadre education at Party schools" },
    { name: "Party Member Affairs Bureau 党员局", head: "—", function: "Party membership recruitment and management" },
    { name: "Supervision Bureau 监督局", head: "—", function: "Cadre supervision and assessment" },
  ],
  "Publicity Department 宣传部": [
    { name: "Theory Bureau 理论局", head: "—", function: "Marxist ideology and Xi Jinping Thought propagation" },
    { name: "News Bureau 新闻局", head: "—", function: "Media control, press censorship directives" },
    { name: "Culture Bureau 文化局", head: "—", function: "Arts, publishing, cultural policy" },
    { name: "External Propaganda Bureau 对外宣传局", head: "—", function: "International media and soft power (State Council Info Office nameplate)" },
  ],
  "United Front Work Department 统战部": [
    { name: "Ethnic and Religious Affairs Bureau", head: "—", function: "Ethnic minorities and religious groups" },
    { name: "HK, Macao, Taiwan Affairs Bureau", head: "—", function: "Cross-strait and SAR united-front work" },
    { name: "Non-Party Personages Bureau", head: "—", function: "Non-CCP intellectuals and elites" },
    { name: "New Social Classes Bureau", head: "—", function: "Private business owners and professionals" },
    { name: "Overseas Chinese Affairs Bureau", head: "—", function: "Diaspora engagement (State Council OC Affairs nameplate)" },
  ],
  "International Department 对外联络部": [
    { name: "Bureau for Communist and Left Parties", head: "—", function: "Relations with communist and socialist parties" },
    { name: "Bureau for Asian and African Parties", head: "—", function: "Developing world party-to-party diplomacy" },
    { name: "Bureau for European and American Parties", head: "—", function: "Western party and political organization ties" },
  ],
  "Political-Legal Affairs Commission 政法委": [
    { name: "Supreme People's Court 最高人民法院", head: "—", function: "Highest judicial body (Party supervises)" },
    { name: "Supreme People's Procuratorate 最高检", head: "—", function: "Prosecution and legal supervision" },
    { name: "Ministry of Public Security 公安部", head: "Wang Xiaohong", function: "Police and public security" },
    { name: "Ministry of State Security 国家安全部", head: "Chen Yixin", function: "Intelligence and counter-espionage" },
    { name: "Ministry of Justice 司法部", head: "He Rong", function: "Legal profession and prison system" },
  ],
  "Social Work Department 社会工作部": [
    { name: "Community Governance Bureau", head: "—", function: "Grassroots community administration" },
    { name: "Social Organization Bureau", head: "—", function: "NGOs, associations, chambers of commerce" },
    { name: "Volunteer Work Bureau", head: "—", function: "Volunteer and civil society coordination" },
    { name: "Public Complaints Bureau 信访局", head: "—", function: "Petition system (absorbed from State Council 2023)" },
  ],
};

const XI_COMMISSIONS: DeptRow[] = [
  { name: "Central Comprehensively Deepening Reform Commission 深改委", head: "Xi Jinping", function: "Top reform agenda; outranks State Council on priority reforms" },
  { name: "Central National Security Commission 国安委", head: "Xi Jinping", function: "National security policy coordination" },
  { name: "Central Foreign Affairs Commission 外事委", head: "Xi Jinping", function: "Foreign policy direction; office led by Wang Yi" },
  { name: "Central Financial and Economic Affairs Commission 财经委", head: "Xi Jinping", function: "Macroeconomic and financial policy; office led by He Lifeng" },
  { name: "Central Cyberspace Affairs Commission 网信委", head: "Xi Jinping", function: "Internet governance (Cyberspace Administration nameplate)" },
  { name: "Central Commission for Comprehensively Governing the Country According to Law 法治委", head: "Xi Jinping", function: "Rule-of-law campaigns; offices at Ministry of Justice" },
  { name: "Central Military Commission 中央军委", head: "Xi Jinping", function: "Supreme military command (see CMC section)" },
  { name: "Central Audit Commission 审计委", head: "Xi Jinping", function: "Audit policy coordination" },
  { name: "Central Leading Group for Taiwan Affairs 对台办", head: "Xi Jinping", function: "Cross-strait policy (under Foreign Affairs cluster)" },
  { name: "Central Leading Group for Hong Kong and Macao Affairs 港澳办", head: "Xi Jinping", function: "HK/Macau policy (one institution, two names with State Council)" },
];

function buildOrgTree(): ExpandableDept[] {
  const bureaus = PARTY_DEPT_INTERNALS["Organization Department 组织部"] ?? [];
  return [
    toExpandable(
      "org-root",
      {
        name: "Central Organization Department 中央组织部",
        head: "Li Ganjie 李干杰 (Politburo)",
        function: "Nomenklatura appointments for ~5,000 key positions",
      },
      bureaus.map((u, j) => toExpandable(`org-bureau-${j}`, u))
    ),
  ];
}

function buildPolitburoTree(): ExpandableDept[] {
  return POLITBURO.map((l, i) =>
    toExpandable(`pb-${i}`, {
      name: `${l.name} (${l.chinese})`,
      head: l.concurrentRole,
      function: l.summary,
    })
  );
}

function buildCentralCommitteeTree(): ExpandableDept[] {
  return [
    toExpandable("cc-full", {
      name: "Full members 正式委员",
      head: "—",
      function: "205 voting members between congresses",
    }),
    toExpandable("cc-alt", {
      name: "Alternate members 候补委员",
      head: "—",
      function: "171 alternates; promoted when vacancies arise",
    }),
    toExpandable(
      "cc-pb",
      {
        name: "Politburo (subset of CC)",
        head: "24 members",
        function: "Elite decision body elected at 1st plenum",
        reportsTo: "Central Committee",
      },
      buildPolitburoTree()
    ),
    toExpandable(
      "cc-psc",
      {
        name: "Politburo Standing Committee (subset)",
        head: "7 members",
        function: "Apex decision-making body",
        reportsTo: "Politburo",
      },
      PSC.map((l, i) =>
        toExpandable(`cc-psc-${i}`, {
          name: `${l.name} (${l.chinese})`,
          head: l.concurrentRole,
          function: l.summary,
        })
      )
    ),
  ];
}

function buildNationalCongressTree(): ExpandableDept[] {
  return [
    toExpandable("nc-20th", {
      name: "20th National Congress (Oct 2022)",
      head: "Xi Jinping (General Secretary report)",
      function: "Elects Central Committee; ~2,300 delegates",
    }),
    toExpandable(
      "nc-npc-14",
      {
        name: "14th National People's Congress",
        head: "2,878 deputies",
        function: "Current legislature — expand for NPCSC structure",
        reportsTo: "Zhao Leji (PSC #3)",
      },
      buildNpcTree()
    ),
  ];
}

function buildPscOverviewTree(): ExpandableDept[] {
  return [
    toExpandable(
      "psc-xi",
      {
        name: "1 · Xi Jinping — Commissions & CMC",
        head: "General Secretary",
        function: `${XI_COMMISSIONS.length} commissions and leading groups`,
      },
      buildXiTree()
    ),
    toExpandable(
      "psc-li",
      {
        name: "2 · Li Qiang — State Council",
        head: "Premier",
        function: "26 ministries + 14 agencies + 17 national bureaus",
      },
      [...buildStateCouncilFullTree()]
    ),
    toExpandable(
      "psc-zhao",
      {
        name: "3 · Zhao Leji — NPC Standing Committee",
        head: "NPCSC Chairman",
        function: "10 special committees + working bodies",
      },
      buildNpcTree()
    ),
    toExpandable(
      "psc-wang",
      {
        name: "4 · Wang Huning — CPPCC",
        head: "CPPCC Chairman",
        function: "10 special committees",
      },
      buildCppccTree()
    ),
    toExpandable(
      "psc-cai",
      {
        name: "5 · Cai Qi — Central Secretariat",
        head: "1st Secretary",
        function: "6 Party departments with internal bureaus",
      },
      buildPartyDeptTree()
    ),
    toExpandable(
      "psc-ding",
      {
        name: "6 · Ding Xuexiang — Economic portfolios",
        head: "Executive Vice Premier",
        function: "NDRC, MOF, MNR, audit, State Council general office",
      },
      buildStateCouncilFullTree().filter(
        (m) =>
          m.reportsTo?.includes("Ding") ||
          m.id === "ndrc" ||
          m.id === "mof" ||
          m.id === "mnr" ||
          m.id === "audit" ||
          m.id === "sc-gov-office"
      )
    ),
    toExpandable(
      "psc-lixi",
      {
        name: "7 · Li Xi — CCDI / National Supervisory Commission",
        head: "CCDI Secretary",
        function: "Anti-corruption and discipline inspection",
      },
      buildCcdiFullTree()
    ),
  ];
}


export type NodePanelData = {
  description: string;
  calloutTitle?: string;
  calloutBody?: string;
  sectionTitle: string;
  depts: ExpandableDept[];
  defaultExpandedIds: string[];
  highlightSOE: boolean;
  thirdStatLabel?: string;
  thirdStatValue?: string;
  leadershipTitle?: string;
  leadershipHeaders?: string[];
  leadershipRows?: string[][];
};

export function getNodePanelData(nodeId: string): NodePanelData | null {
  const defaultExpandedIds = defaultExpandedForNode(nodeId);
  switch (nodeId) {
    case "nc":
      return {
        description:
          "The 20th Party Congress (Oct 2022) had 2,296 delegates who elected the Central Committee. All delegate names with CC/presidium tags appear below. Click ▸ to expand the 14th NPC structure (2,878 deputies).",
        sectionTitle: "National Congress structure — sorted by headcount ↓",
        depts: buildNationalCongressTree(),
        defaultExpandedIds,
        highlightSOE: false,
      };
    case "cc":
      return {
        description:
          "376 Central Committee seats (205 full + 171 alternates). Full member roster with new/returning status and remarks appears below. Expand Politburo subsets for individual portfolios.",
        sectionTitle: "Central Committee structure — sorted by headcount ↓",
        depts: buildCentralCommitteeTree(),
        defaultExpandedIds,
        highlightSOE: false,
      };
    case "pb":
      return {
        description:
          "24 Politburo members (23 active; 1 expelled, 1 under investigation). Seven also serve on the PSC. Each row is one leadership position — not a department headcount.",
        sectionTitle: "Politburo members — sorted by headcount ↓",
        depts: buildPolitburoTree(),
        defaultExpandedIds,
        highlightSOE: false,
      };
    case "psc": {
      const pscTree = buildPscOverviewTree();
      return {
        description:
          "Each Politburo Standing Committee member heads a major party-state domain. Expand any row to see ministries, committees, bureaus, and sub-units — sorted by headcount with budget estimates.",
        calloutTitle: "PSC portfolio notes",
        calloutBody:
          "Budget figures are 2025 operating expenditure estimates in USD (converted at ¥7.25/USD). SOE rows are highlighted — expand Li Qiang (State Council) or Cai Qi (Secretariat) for full SOE lists.",
        sectionTitle: "Seven PSC domains — sorted by headcount ↓",
        depts: pscTree,
        defaultExpandedIds,
        highlightSOE: true,
        thirdStatLabel: "PSC members",
        thirdStatValue: "7",
      };
    }
    case "sc": {
      const scTree = buildStateCouncilFullTree();
      return {
        description:
          "Li Qiang heads the 14th State Council (2023–2028): 26 constituent departments, 14 direct agencies, and 17 national bureaus nested under ministries.",
        calloutTitle: "Budget and SOE notes",
        calloutBody:
          "Budget from MOF 2025 central department reports in USD (converted at ¥7.25/USD). SOE rows highlighted — expand SASAC for all 97 central SOEs.",
        sectionTitle: "State Council departments and agencies — sorted by headcount ↓",
        depts: scTree,
        defaultExpandedIds,
        highlightSOE: true,
        thirdStatLabel: "SOEs highlighted",
        thirdStatValue: String(countSOEsInTree(scTree)),
        leadershipTitle: "State Council leadership",
        leadershipHeaders: ["Name / Post", "Role", "Rank", "Status"],
        leadershipRows: STATE_COUNCIL.map((s) => [s.name, s.role, s.rank, s.status]),
      };
    }
    case "npc": {
      const npcTree = buildNpcTree();
      return {
        description:
          "Zhao Leji chairs the NPC Standing Committee. Expand the Legislative Affairs Commission for 11 internal law offices. NPCSC central staff ~8,000; deputies are part-time.",
        calloutTitle: "Budget notes",
        calloutBody:
          "NPC budgets cover central legislative operations in USD (converted at ¥7.25/USD, 2025 est.).",
        sectionTitle: "NPC Standing Committee structure — sorted by headcount ↓",
        depts: npcTree,
        defaultExpandedIds,
        highlightSOE: false,
        thirdStatLabel: "Special committees",
        thirdStatValue: "10",
      };
    }
    case "cppcc": {
      const cppccTree = buildCppccTree();
      return {
        description:
          "Wang Huning chairs the CPPCC united-front advisory body. ~2,169 members are part-time advisors; central staff ~5,000.",
        calloutTitle: "Budget notes",
        calloutBody:
          "CPPCC central operating budget in USD (converted at ¥7.25/USD, 2025 est.).",
        sectionTitle: "CPPCC special committees — sorted by headcount ↓",
        depts: cppccTree,
        defaultExpandedIds,
        highlightSOE: false,
        thirdStatLabel: "Special committees",
        thirdStatValue: "10",
      };
    }
    case "sec": {
      const secTree = buildSecretariatTree();
      return {
        description:
          "Cai Qi heads the Central Secretariat and General Office. Six functional departments sorted by employee headcount. Expand Organization Dept and Propaganda Dept for central SOEs.",
        calloutTitle: "Budget and SOE notes",
        calloutBody:
          "Budget figures are 2025 operating expenditure estimates in USD from MOF central reports and SASAC disclosures.",
        sectionTitle: "Six functional departments — sorted by headcount ↓",
        depts: secTree,
        defaultExpandedIds,
        highlightSOE: true,
        thirdStatLabel: "Central SOEs listed",
        thirdStatValue: String(SASAC_SOE_DEFS.length + MEDIA_SOE_DEFS.length),
        leadershipTitle: "Secretariat members (7)",
        leadershipHeaders: ["Name", "Role"],
        leadershipRows: SECRETARIAT.map((s) => [s.name, s.role]),
      };
    }
    case "cmc": {
      const cmcTree = buildCmcFullTree();
      return {
        description:
          "Xi Jinping chairs the CMC. PLA active-duty personnel ~2.0M (IISS 2024 est.). After 2023–2026 purges only Xi and Zhang Shengmin remain as active CMC members.",
        calloutTitle: "Defense budget notes",
        calloutBody:
          "Total defense expenditure ~$245.5B (2025 MOF est., converted at ¥7.25/USD).",
        sectionTitle: "CMC departments and offices — sorted by headcount ↓",
        depts: cmcTree,
        defaultExpandedIds,
        highlightSOE: false,
        thirdStatLabel: "Active CMC members",
        thirdStatValue: "2",
        leadershipTitle: "CMC membership",
        leadershipHeaders: ["Name", "Role", "Status"],
        leadershipRows: CMC_MEMBERS.map((m) => [m.name, m.role, m.status]),
      };
    }
    case "ccdi": {
      const ccdiTree = buildCcdiFullTree();
      return {
        description:
          "Li Xi heads the CCDI fused with the National Supervisory Commission. Internal bureaus, inspection rooms, and resident supervision groups embedded in every ministry, SOE, and university.",
        calloutTitle: "Budget notes",
        calloutBody:
          "CCDI central organ budget ~$2.5B (2025 est., converted at ¥7.25/USD). Most sub-unit staff counts are not publicly disclosed (ND).",
        sectionTitle: "CCDI / NSC bureaus — sorted by headcount ↓",
        depts: ccdiTree,
        defaultExpandedIds,
        highlightSOE: false,
        thirdStatLabel: "Inspection rooms",
        thirdStatValue: "11",
      };
    }
    case "org": {
      const orgTree = buildOrgFullTree();
      return {
        description:
          "Li Ganjie directs the Organization Department — nomenklatura control over ~5,000 centrally managed positions. Expand the SOE section for all major central state-owned enterprises.",
        calloutTitle: "Budget and SOE notes",
        calloutBody:
          "Org Dept central budget ~$483M (2025 est.). SOE rows highlighted — appoints party secretaries and chairmen for all 97 SASAC central SOEs.",
        sectionTitle: "Organization Department — sorted by headcount ↓",
        depts: orgTree,
        defaultExpandedIds,
        highlightSOE: true,
        thirdStatLabel: "SOEs highlighted",
        thirdStatValue: String(countSOEsInTree(orgTree)),
      };
    }
    default:
      return null;
  }
}
