/**
 * Build Reddit posting guide for all blog posts.
 * Subscriber counts: mix of live about.json (when available) + Aug 2026 research.
 * URL policy: YES = blog link posts OK for OC/news; CONDITIONAL = possible with rules;
 *             NO = self-promo / blog links banned or unsuitable.
 */
import fs from "fs";

const BASE = "https://ether-data-insights-blog.web.app/blog/";
const catalog = JSON.parse(
  fs.readFileSync("artifacts/posts-catalog-for-reddit.json", "utf8")
);

/** @typedef {'YES'|'CONDITIONAL'|'NO'} UrlPolicy */

/**
 * Subreddit reference: subscribers (approx Aug 2026 unless noted live),
 * whether ether-data-insights-blog.web.app link posts are allowed.
 */
const SUBS = {
  dataisbeautiful: {
    subscribers: 21800067,
    subscribersNote: "live about.json 2026-08-25",
    urlPolicy: /** @type {UrlPolicy} */ ("YES"),
    policyDetail:
      "OC must link to original source article — your blog URL is the intended link. Tag [OC], plain title, sources/tools in first comment. US politics only Thursday ET.",
  },
  Infographics: {
    subscribers: 535433,
    subscribersNote: "live sidebar related-subs 2026-08-25",
    urlPolicy: /** @type {UrlPolicy} */ ("YES"),
    policyDetail:
      "Infographic/link posts common; OC blog with a clear chart image/page usually accepted. Avoid spammy multi-posts.",
  },
  MapPorn: {
    subscribers: 6374201,
    subscribersNote: "live sidebar related-subs 2026-08-25",
    urlPolicy: /** @type {UrlPolicy} */ ("CONDITIONAL"),
    policyDetail:
      "Map-first posts only. Link to article OK if the post is a map viz; non-map charts will be removed.",
  },
  visualization: {
    subscribers: 140818,
    subscribersNote: "live sidebar related-subs 2026-08-25",
    urlPolicy: /** @type {UrlPolicy} */ ("YES"),
    policyDetail: "Viz-focused; OC links generally welcome when chart-led.",
  },
  datasets: {
    subscribers: 222071,
    subscribersNote: "live sidebar related-subs 2026-08-25",
    urlPolicy: /** @type {UrlPolicy} */ ("CONDITIONAL"),
    policyDetail:
      "For sharing datasets, not polished blog essays. Only if you also release/share underlying data.",
  },
  datascience: {
    subscribers: 2764737,
    subscribersNote: "live sidebar related-subs 2026-08-25",
    urlPolicy: /** @type {UrlPolicy} */ ("CONDITIONAL"),
    policyDetail:
      "Discussion/education preferred; pure blog dumps often removed. Better as discussion with link in body.",
  },
  statistics: {
    subscribers: 631532,
    subscribersNote: "live sidebar related-subs 2026-08-25",
    urlPolicy: /** @type {UrlPolicy} */ ("CONDITIONAL"),
    policyDetail: "Method/stats angle required; marketing posts removed.",
  },
  Economics: {
    subscribers: 5800000,
    subscribersNote: "gummysearch ~5.8M Aug 2026",
    urlPolicy: /** @type {UrlPolicy} */ ("CONDITIONAL"),
    policyDetail:
      "Link posts to articles allowed if economics-discipline focused (not stock tips). Self-promo ~90/10; blogs of economists/analysis can pass; spam accounts banned. Prefer established sources; OC desk analysis may survive if substantive.",
  },
  economy: {
    subscribers: 1100000,
    subscribersNote: "gummysearch similar ~1.1M",
    urlPolicy: /** @type {UrlPolicy} */ ("CONDITIONAL"),
    policyDetail:
      "Broader than r/Economics; news/analysis links OK. Heavy self-promo still removed.",
  },
  AskEconomics: {
    subscribers: 1400000,
    subscribersNote: "gummysearch ~1.4M",
    urlPolicy: /** @type {UrlPolicy} */ ("NO"),
    policyDetail:
      "Q&A only; top answers moderated. Do not submit blog posts as questions/answers for traffic.",
  },
  finance: {
    subscribers: 2134833,
    subscribersNote: "chartexchange Aug 25 2026",
    urlPolicy: /** @type {UrlPolicy} */ ("CONDITIONAL"),
    policyDetail:
      "News/analysis links accepted; blatant blog spam removed. Disclose OC; keep volume low.",
  },
  investing: {
    subscribers: 3449170,
    subscribersNote: "chartexchange Aug 25 2026",
    urlPolicy: /** @type {UrlPolicy} */ ("CONDITIONAL"),
    policyDetail:
      "No spam/shilling. Educational market structure posts sometimes OK; retail stock pitches not. Self-promo restricted.",
  },
  business: {
    subscribers: 2587405,
    subscribersNote: "chartexchange Aug 25 2026",
    urlPolicy: /** @type {UrlPolicy} */ ("CONDITIONAL"),
    policyDetail: "Business news links OK; repeated self-promo not.",
  },
  personalfinance: {
    subscribers: 21800000,
    subscribersNote: "gummysearch ~21.8M Aug 2026",
    urlPolicy: /** @type {UrlPolicy} */ ("NO"),
    policyDetail:
      "Explicit ban on promoting your own web content/products even if unpaid. Do not post your blog URL.",
  },
  povertyfinance: {
    subscribers: 2800000,
    subscribersNote: "gummysearch similar ~2.8M",
    urlPolicy: /** @type {UrlPolicy} */ ("NO"),
    policyDetail: "Advice community; self-promo/blog dumps not allowed.",
  },
  FluentInFinance: {
    subscribers: 579000,
    subscribersNote: "gummysearch similar ~579k",
    urlPolicy: /** @type {UrlPolicy} */ ("CONDITIONAL"),
    policyDetail: "Educational finance content sometimes OK; still treat as promo-sensitive.",
  },
  technology: {
    subscribers: 20500000,
    subscribersNote: "gummysearch ~20.5M Aug 2026",
    urlPolicy: /** @type {UrlPolicy} */ ("CONDITIONAL"),
    policyDetail:
      "News domain links preferred; unknown blogs often filtered. Domain reputation matters; OC tech-industry data can work if newsworthy.",
  },
  Futurology: {
    subscribers: 21700000,
    subscribersNote: "gummysearch Aug 23 2026",
    urlPolicy: /** @type {UrlPolicy} */ ("CONDITIONAL"),
    policyDetail: "Future/tech trend links; low-quality blog farms banned. Strong OC may pass.",
  },
  space: {
    subscribers: 28000000,
    subscribersNote: "gummysearch Aug 24 2026",
    urlPolicy: /** @type {UrlPolicy} */ ("CONDITIONAL"),
    policyDetail: "Space news/data OK; no spam. Orbital debris / launch cadence posts fit.",
  },
  spacex: {
    subscribers: 3700000,
    subscribersNote: "gummysearch similar Aug 2026",
    urlPolicy: /** @type {UrlPolicy} */ ("CONDITIONAL"),
    policyDetail: "SpaceX-specific; only if post is primarily about SpaceX ops/launches.",
  },
  TrueReddit: {
    subscribers: 627000,
    subscribersNote: "gummysearch Aug 22 2026",
    urlPolicy: /** @type {UrlPolicy} */ ("YES"),
    policyDetail:
      "In-depth articles encouraged; quality longform blog posts are on-topic if substantial.",
  },
  Foodforthought: {
    subscribers: 2500000,
    subscribersNote: "approx ~2–3M class (research)",
    urlPolicy: /** @type {UrlPolicy} */ ("YES"),
    policyDetail: "Thoughtful longform/news analysis links welcome.",
  },
  DepthHub: {
    subscribers: 350000,
    subscribersNote: "approx (research)",
    urlPolicy: /** @type {UrlPolicy} */ ("CONDITIONAL"),
    policyDetail: "Meta: links to good Reddit comments, not external blogs as primary posts.",
  },
  RealEstate: {
    subscribers: 2500000,
    subscribersNote: "gummysearch Aug 25 2026",
    urlPolicy: /** @type {UrlPolicy} */ ("NO"),
    policyDetail:
      "No solicitation; agent/blog promo heavily moderated. Advice-first community — don't drop blog URLs as posts.",
  },
  housing: {
    subscribers: 200000,
    subscribersNote: "approx (research)",
    urlPolicy: /** @type {UrlPolicy} */ ("CONDITIONAL"),
    policyDetail: "Policy/supply discussion; data posts sometimes OK if not salesy.",
  },
  urbanplanning: {
    subscribers: 229702,
    subscribersNote: "redpulse Aug 20 2026",
    urlPolicy: /** @type {UrlPolicy} */ ("CONDITIONAL"),
    policyDetail: "Planning/data welcome; low self-promo tolerance.",
  },
  CRE: {
    subscribers: 80000,
    subscribersNote: "approx (research)",
    urlPolicy: /** @type {UrlPolicy} */ ("CONDITIONAL"),
    policyDetail: "Commercial RE pros; industry data OK, spam not.",
  },
  CommercialRealEstate: {
    subscribers: 60000,
    subscribersNote: "approx (research)",
    urlPolicy: /** @type {UrlPolicy} */ ("CONDITIONAL"),
    policyDetail: "Similar to CRE; professional discussion.",
  },
  REBubble: {
    subscribers: 200000,
    subscribersNote: "approx (research)",
    urlPolicy: /** @type {UrlPolicy} */ ("CONDITIONAL"),
    policyDetail: "Housing market skepticism; data charts often fit. Avoid hard sell.",
  },
  Insurance: {
    subscribers: 234000,
    subscribersNote: "gummysearch ~234k",
    urlPolicy: /** @type {UrlPolicy} */ ("CONDITIONAL"),
    policyDetail:
      "Mostly consumer claims advice; industry data posts occasional. Not a blog farm.",
  },
  actuaries: {
    subscribers: 40000,
    subscribersNote: "approx (research)",
    urlPolicy: /** @type {UrlPolicy} */ ("CONDITIONAL"),
    policyDetail: "Professional; technical posts OK, promo limited.",
  },
  cybersecurity: {
    subscribers: 1500000,
    subscribersNote: "gummysearch ~1.5M",
    urlPolicy: /** @type {UrlPolicy} */ ("CONDITIONAL"),
    policyDetail: "Security news/research; vendor blog spam filtered. Data-led ransomware/insurance posts may fit.",
  },
  netsec: {
    subscribers: 700000,
    subscribersNote: "approx (research)",
    urlPolicy: /** @type {UrlPolicy} */ ("CONDITIONAL"),
    policyDetail: "Technical security; prefer primary research over marketing blogs.",
  },
  truckers: {
    subscribers: 334377,
    subscribersNote: "redpulse Aug 24 2026",
    urlPolicy: /** @type {UrlPolicy} */ ("CONDITIONAL"),
    policyDetail: "Industry lifestyle + news; promo disliked. Spot-rate/headcount data can spark discussion.",
  },
  logistics: {
    subscribers: 50000,
    subscribersNote: "approx (research)",
    urlPolicy: /** @type {UrlPolicy} */ ("CONDITIONAL"),
    policyDetail: "Supply chain/logistics discussion; links OK if substantive.",
  },
  shipping: {
    subscribers: 100000,
    subscribersNote: "approx (research)",
    urlPolicy: /** @type {UrlPolicy} */ ("CONDITIONAL"),
    policyDetail: "Maritime/container interest; freight data fits.",
  },
  Maritime: {
    subscribers: 80000,
    subscribersNote: "approx (research)",
    urlPolicy: /** @type {UrlPolicy} */ ("CONDITIONAL"),
    policyDetail: "Maritime industry; shipyard/fleet data OK.",
  },
  railroading: {
    subscribers: 150000,
    subscribersNote: "approx (research)",
    urlPolicy: /** @type {UrlPolicy} */ ("CONDITIONAL"),
    policyDetail: "Railfans + industry; PSR/headcount posts relevant.",
  },
  freightbrokers: {
    subscribers: 30000,
    subscribersNote: "approx (research)",
    urlPolicy: /** @type {UrlPolicy} */ ("CONDITIONAL"),
    policyDetail: "Broker community; rate data welcome, spam not.",
  },
  electricvehicles: {
    subscribers: 441000,
    subscribersNote: "gummysearch Aug 22 2026",
    urlPolicy: /** @type {UrlPolicy} */ ("CONDITIONAL"),
    policyDetail: "EV news/data; charger corridor posts fit. Low promo.",
  },
  energy: {
    subscribers: 293000,
    subscribersNote: "gummysearch Aug 24 2026",
    urlPolicy: /** @type {UrlPolicy} */ ("CONDITIONAL"),
    policyDetail: "Energy industry discussion; data OK. Referral spam exists and is disliked.",
  },
  renewableenergy: {
    subscribers: 161000,
    subscribersNote: "gummysearch similar Aug 2026",
    urlPolicy: /** @type {UrlPolicy} */ ("CONDITIONAL"),
    policyDetail: "Renewables-focused; grid/AI power posts may fit.",
  },
  nuclear: {
    subscribers: 200000,
    subscribersNote: "approx (research)",
    urlPolicy: /** @type {UrlPolicy} */ ("CONDITIONAL"),
    policyDetail: "Nuclear-specific only.",
  },
  agriculture: {
    subscribers: 150000,
    subscribersNote: "approx (research)",
    urlPolicy: /** @type {UrlPolicy} */ ("CONDITIONAL"),
    policyDetail: "Farming industry; USDA/data posts relevant.",
  },
  farming: {
    subscribers: 200000,
    subscribersNote: "approx (research)",
    urlPolicy: /** @type {UrlPolicy} */ ("CONDITIONAL"),
    policyDetail: "Producer community; cattle/crop data OK if not sales.",
  },
  healthcare: {
    subscribers: 110000,
    subscribersNote: "gummysearch Aug 25 2026",
    urlPolicy: /** @type {UrlPolicy} */ ("CONDITIONAL"),
    policyDetail: "Health system discussion; policy data sometimes OK.",
  },
  publichealth: {
    subscribers: 158000,
    subscribersNote: "gummysearch similar Aug 2026",
    urlPolicy: /** @type {UrlPolicy} */ ("CONDITIONAL"),
    policyDetail: "PH professionals; empirical posts welcome.",
  },
  HealthInsurance: {
    subscribers: 121000,
    subscribersNote: "gummysearch similar Aug 2026",
    urlPolicy: /** @type {UrlPolicy} */ ("CONDITIONAL"),
    policyDetail: "Coverage discussion; data posts occasional; advice-heavy.",
  },
  medicine: {
    subscribers: 566000,
    subscribersNote: "gummysearch similar Aug 2026",
    urlPolicy: /** @type {UrlPolicy} */ ("NO"),
    policyDetail: "Clinical; blog marketing not appropriate for most posts.",
  },
  pharmacy: {
    subscribers: 100000,
    subscribersNote: "approx (research)",
    urlPolicy: /** @type {UrlPolicy} */ ("CONDITIONAL"),
    policyDetail: "Pharmacist community; shortage/generic data may fit.",
  },
  journalism: {
    subscribers: 100000,
    subscribersNote: "approx (research)",
    urlPolicy: /** @type {UrlPolicy} */ ("CONDITIONAL"),
    policyDetail: "News desert / ownership data fits; promo limited.",
  },
  MediaCriticism: {
    subscribers: 50000,
    subscribersNote: "approx (research)",
    urlPolicy: /** @type {UrlPolicy} */ ("CONDITIONAL"),
    policyDetail: "Media industry critique; ownership/employment charts OK.",
  },
  geopolitics: {
    subscribers: 785000,
    subscribersNote: "gummysearch Aug 23 2026",
    urlPolicy: /** @type {UrlPolicy} */ ("CONDITIONAL"),
    policyDetail:
      "Serious IR; requires submission statement. Unknown blogs often flaired 'Not Appropriate Source' — high bar.",
  },
  neoliberal: {
    subscribers: 231000,
    subscribersNote: "gummysearch Aug 23 2026",
    urlPolicy: /** @type {UrlPolicy} */ ("CONDITIONAL"),
    policyDetail: "Policy data charts popular; prefers reputable outlets; OC charts can work.",
  },
  collapse: {
    subscribers: 564000,
    subscribersNote: "gummysearch similar ~564k",
    urlPolicy: /** @type {UrlPolicy} */ ("CONDITIONAL"),
    policyDetail: "Systems-risk framing; doomspam filtered. Strong data OK.",
  },
  environment: {
    subscribers: 2000000,
    subscribersNote: "approx (research)",
    urlPolicy: /** @type {UrlPolicy} */ ("CONDITIONAL"),
    policyDetail: "Env news/data; spam filtered.",
  },
  science: {
    subscribers: 32000000,
    subscribersNote: "approx large default (research)",
    urlPolicy: /** @type {UrlPolicy} */ ("CONDITIONAL"),
    policyDetail: "Peer-ish science news preferred; unknown blogs often removed.",
  },
  labor: {
    subscribers: 100000,
    subscribersNote: "approx (research)",
    urlPolicy: /** @type {UrlPolicy} */ ("CONDITIONAL"),
    policyDetail: "Labor movement; strike/wage data fits.",
  },
  union: {
    subscribers: 150000,
    subscribersNote: "approx (research)",
    urlPolicy: /** @type {UrlPolicy} */ ("CONDITIONAL"),
    policyDetail: "Union community; density/strike posts relevant.",
  },
  SkilledTrades: {
    subscribers: 200000,
    subscribersNote: "approx (research)",
    urlPolicy: /** @type {UrlPolicy} */ ("CONDITIONAL"),
    policyDetail: "Trades discussion; apprenticeship age-cohort data fits.",
  },
  construction: {
    subscribers: 300000,
    subscribersNote: "approx (research)",
    urlPolicy: /** @type {UrlPolicy} */ ("CONDITIONAL"),
    policyDetail: "Construction industry; materials/permits data occasional.",
  },
  steel: {
    subscribers: 30000,
    subscribersNote: "approx (research)",
    urlPolicy: /** @type {UrlPolicy} */ ("CONDITIONAL"),
    policyDetail: "Steel industry niche; BF vs EAF posts fit.",
  },
  fintech: {
    subscribers: 100000,
    subscribersNote: "approx (research)",
    urlPolicy: /** @type {UrlPolicy} */ ("NO"),
    policyDetail: "Very promo-hostile for product/blog launches.",
  },
  Payments: {
    subscribers: 40000,
    subscribersNote: "approx (research)",
    urlPolicy: /** @type {UrlPolicy} */ ("CONDITIONAL"),
    policyDetail: "Payments pros; rails/SWIFT data may fit.",
  },
  banking: {
    subscribers: 100000,
    subscribersNote: "approx (research)",
    urlPolicy: /** @type {UrlPolicy} */ ("CONDITIONAL"),
    policyDetail: "Banking industry discussion.",
  },
  telecom: {
    subscribers: 50000,
    subscribersNote: "approx (research)",
    urlPolicy: /** @type {UrlPolicy} */ ("CONDITIONAL"),
    policyDetail: "5G auction/coverage posts fit.",
  },
  infrastructure: {
    subscribers: 100000,
    subscribersNote: "approx (research)",
    urlPolicy: /** @type {UrlPolicy} */ ("CONDITIONAL"),
    policyDetail: "Infra policy/data welcome.",
  },
  semiconductors: {
    subscribers: 200000,
    subscribersNote: "approx (research)",
    urlPolicy: /** @type {UrlPolicy} */ ("CONDITIONAL"),
    policyDetail: "Chip industry; AI supply-chain posts may fit.",
  },
  datacenter: {
    subscribers: 50000,
    subscribersNote: "approx (research)",
    urlPolicy: /** @type {UrlPolicy} */ ("CONDITIONAL"),
    policyDetail: "DC ops; AI power/capex adjacent.",
  },
  singularity: {
    subscribers: 4000000,
    subscribersNote: "gummysearch Aug 23 2026",
    urlPolicy: /** @type {UrlPolicy} */ ("CONDITIONAL"),
    policyDetail: "AI future; speculative — data-heavy AI infra can work.",
  },
  MachineLearning: {
    subscribers: 3000000,
    subscribersNote: "approx (research)",
    urlPolicy: /** @type {UrlPolicy} */ ("NO"),
    policyDetail: "Papers/discussion; blog promo usually removed.",
  },
  clinicalresearch: {
    subscribers: 30000,
    subscribersNote: "approx (research)",
    urlPolicy: /** @type {UrlPolicy} */ ("CONDITIONAL"),
    policyDetail: "Trial geography/rare disease maps may fit.",
  },
  tax: {
    subscribers: 100000,
    subscribersNote: "approx (research)",
    urlPolicy: /** @type {UrlPolicy} */ ("CONDITIONAL"),
    policyDetail: "Tax pros/hobbyists; sales-tax base posts may fit.",
  },
  Accounting: {
    subscribers: 200000,
    subscribersNote: "approx (research)",
    urlPolicy: /** @type {UrlPolicy} */ ("CONDITIONAL"),
    policyDetail: "Accounting community; limited blog promo.",
  },
  SecurityAnalysis: {
    subscribers: 200000,
    subscribersNote: "approx (research)",
    urlPolicy: /** @type {UrlPolicy} */ ("CONDITIONAL"),
    policyDetail: "Value investing; fundamental research. Self-promo limited.",
  },
  ValueInvesting: {
    subscribers: 300000,
    subscribersNote: "approx (research)",
    urlPolicy: /** @type {UrlPolicy} */ ("CONDITIONAL"),
    policyDetail: "Similar; educational OK.",
  },
  StockMarket: {
    subscribers: 4108485,
    subscribersNote: "chartexchange Aug 25 2026",
    urlPolicy: /** @type {UrlPolicy} */ ("CONDITIONAL"),
    policyDetail: "Market news; unknown blogs often ignored/removed.",
  },
  antiwork: {
    subscribers: 3000000,
    subscribersNote: "approx (research)",
    urlPolicy: /** @type {UrlPolicy} */ ("NO"),
    policyDetail: "Not for blog marketing; culture/advice.",
  },
  worldnews: {
    subscribers: 47000000,
    subscribersNote: "approx (research)",
    urlPolicy: /** @type {UrlPolicy} */ ("NO"),
    policyDetail: "Major outlets only; personal blogs generally removed.",
  },
  news: {
    subscribers: 31500000,
    subscribersNote: "gummysearch similar ~31.5M",
    urlPolicy: /** @type {UrlPolicy} */ ("NO"),
    policyDetail: "Domain whitelist culture; unknown blogs fail.",
  },
  yimby: {
    subscribers: 50000,
    subscribersNote: "approx (research)",
    urlPolicy: /** @type {UrlPolicy} */ ("CONDITIONAL"),
    policyDetail: "Housing abundance; permit/vacancy data fits.",
  },
  FirstTimeHomeBuyer: {
    subscribers: 200000,
    subscribersNote: "approx (research)",
    urlPolicy: /** @type {UrlPolicy} */ ("NO"),
    policyDetail: "Advice; no blog promo.",
  },
  Landlord: {
    subscribers: 200000,
    subscribersNote: "approx (research)",
    urlPolicy: /** @type {UrlPolicy} */ ("NO"),
    policyDetail: "Advice/ops; solicitation banned.",
  },
};

function fmtSubs(n) {
  if (n == null) return "?";
  if (n >= 1e6) return `${(n / 1e6).toFixed(n >= 1e7 ? 1 : 2)}M`.replace(/\.00M/, "M");
  if (n >= 1e3) return `${Math.round(n / 1e3)}k`;
  return String(n);
}

/** Keyword → extra subs (beyond category defaults) */
function keywordSubs(slug, title) {
  const t = `${slug} ${title}`.toLowerCase();
  const hits = [];
  const add = (s) => {
    if (SUBS[s] && !hits.includes(s)) hits.push(s);
  };

  if (/map|geography|state|county|corridor|country|oecd|global/.test(t)) add("MapPorn");
  if (/space|orbital|launch|debris|nasa|satellite/.test(t)) {
    add("space");
    add("spacex");
  }
  if (/cyber|ransomware|malware/.test(t)) {
    add("cybersecurity");
    add("netsec");
  }
  if (/insurance|reinsurance|actuar|premium|underfund/.test(t)) {
    add("Insurance");
    add("actuaries");
  }
  if (/truck|freight|carrier|spot.?rate|container|blank.?sail|transpacific|alliance.?capacit/.test(t)) {
    add("truckers");
    add("shipping");
    add("logistics");
    add("freightbrokers");
  }
  if (/rail|precision.?schedul/.test(t)) add("railroading");
  if (/\b(ship|ships|shipping|maritime|shipyard|merchant.?ship)/.test(t)) add("Maritime");
  if (/ev|nevi|charger|electric.?vehicle/.test(t)) add("electricvehicles");
  if (/grid|power|solar|nuclear|renewable|energy|oil|gas|ai.?power/.test(t)) {
    add("energy");
    add("renewableenergy");
  }
  if (/farm|cattle|crop|egg|beef|agriculture|aquifer|ogallala|food.?dollar/.test(t)) {
    add("agriculture");
    add("farming");
  }
  if (/hospital|medicaid|medicare|uninsur|health.?insurance|glp|pharmacy|injectable|plasma|trial/.test(t)) {
    add("healthcare");
    add("publichealth");
    add("HealthInsurance");
  }
  if (/generic|sterile|pharmacy|drug.?short/.test(t)) add("pharmacy");
  if (/rare.?disease|trial.?desert|clinical/.test(t)) add("clinicalresearch");
  if (/news.?desert|newspaper|journalis|local.?news|hedge.?fund.?ownership/.test(t)) {
    add("journalism");
    add("MediaCriticism");
  }
  if (/geopolitic|imf|quota|china|migration|refugee|oda|dac/.test(t)) add("geopolitics");
  if (/strike|union|labor|wage|apprentice|trades|electrician|plumber/.test(t)) {
    add("labor");
    add("union");
    add("SkilledTrades");
  }
  if (/housing|rent|vacancy|permit|apartment|landlord|investor.?home|single.?family|office.?vacan|conversion/.test(t)) {
    add("housing");
    add("urbanplanning");
    add("REBubble");
    add("yimby");
  }
  if (/office|cre|commercial.?real|conversion.?pipeline/.test(t)) {
    add("CRE");
    add("CommercialRealEstate");
  }
  if (/sales.?tax|tax.?base|wayfair|fiscal/.test(t)) add("tax");
  if (/5g|telecom|auction|spectrum/.test(t)) add("telecom");
  if (/payment|swift|rail|fintech|banking|deposit|money.?market/.test(t)) {
    add("Payments");
    add("banking");
  }
  if (/steel|blast.?furnace|eaf|cement|crushed.?stone|industrial/.test(t)) {
    add("steel");
    add("construction");
  }
  if (/ai|semiconductor|chip|gpu|data.?center|capex|token|compute/.test(t)) {
    add("technology");
    add("semiconductors");
    add("datacenter");
    add("singularity");
  }
  if (/subsea|cable|internet.?backbone/.test(t)) {
    add("technology");
    add("infrastructure");
  }
  if (/climate|disaster|environment|fisher|unsustainable.?stock/.test(t)) {
    add("environment");
    add("collapse");
  }
  if (/road.?death|traffic|vmt|atc.?delay|aviation/.test(t)) add("infrastructure");
  return hits;
}

/** Category → default priority subs (first = primary) */
const CATEGORY_DEFAULTS = {
  "Health Economics": ["dataisbeautiful", "Economics", "healthcare", "publichealth", "Infographics"],
  Economics: ["dataisbeautiful", "Economics", "economy", "neoliberal", "Infographics"],
  "Consumer Finance": ["dataisbeautiful", "finance", "FluentInFinance", "Economics", "Infographics"],
  "Real Estate": ["dataisbeautiful", "housing", "urbanplanning", "REBubble", "Infographics"],
  "Labor & Skills": ["dataisbeautiful", "labor", "SkilledTrades", "Economics", "Infographics"],
  Politics: ["dataisbeautiful", "neoliberal", "TrueReddit", "geopolitics", "Foodforthought"],
  Technology: ["dataisbeautiful", "technology", "Futurology", "Infographics", "visualization"],
  Finance: ["dataisbeautiful", "finance", "Economics", "actuaries", "Infographics"],
  "Global Systems": ["dataisbeautiful", "TrueReddit", "geopolitics", "MapPorn", "Foodforthought"],
  "Transport & Logistics": ["dataisbeautiful", "truckers", "logistics", "shipping", "Infographics"],
  Industry: ["dataisbeautiful", "business", "Economics", "Infographics", "infrastructure"],
  "Capital Markets": ["dataisbeautiful", "finance", "investing", "SecurityAnalysis", "Infographics"],
  Energy: ["dataisbeautiful", "energy", "renewableenergy", "technology", "Infographics"],
  "Food & Agriculture": ["dataisbeautiful", "agriculture", "farming", "Economics", "Infographics"],
};

function pickSubs(post) {
  const defaults = CATEGORY_DEFAULTS[post.category] || [
    "dataisbeautiful",
    "Infographics",
    "TrueReddit",
  ];
  const keyed = keywordSubs(post.slug, post.title);
  const keyedSet = new Set(keyed);
  const merged = [];
  for (const s of [...defaults, ...keyed]) {
    if (!merged.includes(s) && SUBS[s]) merged.push(s);
  }
  const scored = merged.map((s, i) => {
    const pol = SUBS[s].urlPolicy;
    const polScore = pol === "YES" ? 3 : pol === "CONDITIONAL" ? 2 : 0;
    const rankScore = Math.max(0, 10 - i);
    const keywordBoost = keyedSet.has(s) ? 4 : 0;
    return { s, score: polScore * 2 + rankScore + keywordBoost };
  });
  scored.sort((a, b) => b.score - a.score);
  const top = [];
  if (SUBS.dataisbeautiful) top.push("dataisbeautiful");
  for (const { s } of scored) {
    if (!top.includes(s) && SUBS[s].urlPolicy !== "NO") top.push(s);
    if (top.length >= 4) break;
  }
  while (top.length < 3) {
    for (const s of ["Infographics", "visualization", "TrueReddit", "Foodforthought"]) {
      if (!top.includes(s)) {
        top.push(s);
        break;
      }
    }
    if (top.length >= 3) break;
  }
  return top.slice(0, 4);
}

// Merge live / research overrides if present
const livePath = "artifacts/reddit-subs-live.json";
if (fs.existsSync(livePath)) {
  try {
    const live = JSON.parse(fs.readFileSync(livePath, "utf8"));
    for (const row of live) {
      if (!row.subreddit || !row.subscribers) continue;
      if (SUBS[row.subreddit]) {
        SUBS[row.subreddit].subscribers = row.subscribers;
        SUBS[row.subreddit].subscribersNote = row.source || "live override";
        if (row.urlPolicy) SUBS[row.subreddit].urlPolicy = row.urlPolicy;
        if (row.submission_type)
          SUBS[row.subreddit].submission_type = row.submission_type;
      } else {
        SUBS[row.subreddit] = {
          subscribers: row.subscribers,
          subscribersNote: row.source || "live override",
          urlPolicy: row.urlPolicy || "CONDITIONAL",
          policyDetail: "Confirm sidebar rules before posting.",
          submission_type: row.submission_type,
        };
      }
    }
  } catch {
    /* ignore */
  }
}

const rows = [];
for (const post of catalog.posts) {
  const picks = pickSubs(post);
  const url = `${BASE}${post.slug}`;
  const cells = picks.map((s) => {
    const meta = SUBS[s];
    return {
      subreddit: s,
      subscribers: meta.subscribers,
      subscribersFmt: fmtSubs(meta.subscribers),
      urlPolicy: meta.urlPolicy,
      policyDetail: meta.policyDetail,
      subscribersNote: meta.subscribersNote,
    };
  });
  rows.push({
    slug: post.slug,
    title: post.title,
    category: post.category,
    themeId: post.themeId,
    postUrl: url,
    suggestions: cells,
  });
}

// CSV: one row per article × sub
const csvLines = [
  [
    "slug",
    "title",
    "category",
    "post_url",
    "subreddit",
    "subscribers",
    "subscribers_fmt",
    "url_policy",
    "policy_detail",
    "subscribers_source",
    "rank",
  ].join(","),
];

function csvEscape(v) {
  const s = String(v ?? "");
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

for (const row of rows) {
  row.suggestions.forEach((sug, i) => {
    csvLines.push(
      [
        row.slug,
        row.title,
        row.category,
        row.postUrl,
        sug.subreddit,
        sug.subscribers,
        sug.subscribersFmt,
        sug.urlPolicy,
        sug.policyDetail,
        sug.subscribersNote,
        i + 1,
      ]
        .map(csvEscape)
        .join(",")
    );
  });
}

fs.writeFileSync("artifacts/reddit-posting-guide.csv", csvLines.join("\n"), "utf8");

// Wide CSV: one row per article
const wideHeader = [
  "slug",
  "title",
  "category",
  "post_url",
  "sub_1",
  "sub_1_subs",
  "sub_1_url_ok",
  "sub_2",
  "sub_2_subs",
  "sub_2_url_ok",
  "sub_3",
  "sub_3_subs",
  "sub_3_url_ok",
  "sub_4",
  "sub_4_subs",
  "sub_4_url_ok",
];
const wideLines = [wideHeader.join(",")];
for (const row of rows) {
  const s = row.suggestions;
  const pad = (i, field) => (s[i] ? s[i][field] : "");
  wideLines.push(
    [
      row.slug,
      row.title,
      row.category,
      row.postUrl,
      pad(0, "subreddit"),
      pad(0, "subscribersFmt"),
      pad(0, "urlPolicy"),
      pad(1, "subreddit"),
      pad(1, "subscribersFmt"),
      pad(1, "urlPolicy"),
      pad(2, "subreddit"),
      pad(2, "subscribersFmt"),
      pad(2, "urlPolicy"),
      pad(3, "subreddit"),
      pad(3, "subscribersFmt"),
      pad(3, "urlPolicy"),
    ]
      .map(csvEscape)
      .join(",")
  );
}
fs.writeFileSync(
  "artifacts/reddit-posting-guide-wide.csv",
  wideLines.join("\n"),
  "utf8"
);

// Markdown
const md = [];
md.push("# Reddit posting guide — Ether Data Insights Blog");
md.push("");
md.push(`Generated for **${catalog.count} posts**. Blog base: \`${BASE}\``);
md.push("");
md.push(
  "URL policy key: **YES** = your blog link is appropriate for OC/source posts; **CONDITIONAL** = link posts exist but self-promo/quality filters apply; **NO** = do not post your URL (banned or unsuitable)."
);
md.push("");
md.push(
  "> Subscriber counts are mid/late-Aug 2026 snapshots (live about.json where noted; otherwise third-party research). Rules change — re-check the sub sidebar before posting. Sitewide ~90/10 participation still applies."
);
md.push("");
md.push("## Subreddit reference");
md.push("");
md.push("| Subreddit | Subscribers | URL OK? | Notes |");
md.push("| --- | ---: | --- | --- |");
const subNames = Object.keys(SUBS).sort((a, b) => SUBS[b].subscribers - SUBS[a].subscribers);
for (const name of subNames) {
  const s = SUBS[name];
  md.push(
    `| r/${name} | ${fmtSubs(s.subscribers)} | **${s.urlPolicy}** | ${s.policyDetail.replace(/\|/g, "/")} (${s.subscribersNote}) |`
  );
}
md.push("");
md.push("## Articles → suggested subreddits");
md.push("");

const byCat = {};
for (const row of rows) {
  (byCat[row.category] ||= []).push(row);
}

for (const cat of Object.keys(byCat).sort()) {
  md.push(`### ${cat} (${byCat[cat].length})`);
  md.push("");
  md.push("| Article | Suggested subs (subs · URL policy) |");
  md.push("| --- | --- |");
  for (const row of byCat[cat]) {
    const titleShort =
      row.title.length > 90 ? row.title.slice(0, 87) + "…" : row.title;
    const sug = row.suggestions
      .map(
        (s) =>
          `r/${s.subreddit} (${s.subscribersFmt} · ${s.urlPolicy})`
      )
      .join("; ");
    md.push(
      `| [${titleShort}](${row.postUrl})<br>\`${row.slug}\` | ${sug} |`
    );
  }
  md.push("");
}

md.push("## Files");
md.push("");
md.push("- `artifacts/reddit-posting-guide.csv` — long format (article × sub)");
md.push("- `artifacts/reddit-posting-guide-wide.csv` — one row per article");
md.push("- `artifacts/reddit-posting-guide.md` — this file");
md.push("");

fs.writeFileSync("artifacts/reddit-posting-guide.md", md.join("\n"), "utf8");
fs.writeFileSync(
  "artifacts/reddit-subs-reference.json",
  JSON.stringify(SUBS, null, 2),
  "utf8"
);
fs.writeFileSync(
  "artifacts/reddit-posting-guide-rows.json",
  JSON.stringify(rows, null, 2),
  "utf8"
);

console.log(
  `Wrote guide for ${rows.length} posts; ${csvLines.length - 1} CSV rows; ${subNames.length} subs referenced`
);
