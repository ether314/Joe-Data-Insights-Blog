import type { Category, Post } from "@/types/post";

/** Subreddits known to tolerate sourced blog / OC chart links when rules are followed. */
export interface SubredditTarget {
  name: string;
  url: string;
  /** Why this community fits; shown on the ops page */
  fit: string;
  /**
   * How to post without getting removed:
   * - link: direct article URL usually OK
   * - oc-chart: post the chart as OC; put the blog URL in the first comment
   * - discussion: self-post with key chart + link in body
   */
  postStyle: "link" | "oc-chart" | "discussion";
  /** Approximate community size band for prioritization */
  size: "mega" | "large" | "mid" | "niche";
}

export interface SocialOutreachRow {
  slug: string;
  title: string;
  category: Category;
  excerpt: string;
  publishedAt: string;
  href: string;
  /** 1 (low) … 5 (highest expected social reach) */
  socialScore: 1 | 2 | 3 | 4 | 5;
  socialRankReason: string;
  subreddits: SubredditTarget[];
}

const R = (
  name: string,
  fit: string,
  postStyle: SubredditTarget["postStyle"],
  size: SubredditTarget["size"] = "mid",
): SubredditTarget => ({
  name,
  url: `https://www.reddit.com/r/${name}/`,
  fit,
  postStyle,
  size,
});

/** Always-safe cross-cuts for data-viz blogs (self-promo rules still apply). */
const UNIVERSAL: SubredditTarget[] = [
  R(
    "dataisbeautiful",
    "OC interactive / static chart with methods; put the article URL in the first comment.",
    "oc-chart",
    "mega",
  ),
  R(
    "visualization",
    "Smaller viz community; link + chart usually fine with a short methods note.",
    "link",
    "niche",
  ),
  R(
    "datasets",
    "When the piece surfaces a public file people can reuse — link the story + source.",
    "link",
    "mid",
  ),
];

const CATEGORY_DEFAULTS: Record<Category, SubredditTarget[]> = {
  Economics: [
    R("Economics", "Link posts with a clear empirical claim; expect debate on definitions.", "link", "large"),
    R("economy", "Broader audience for CPI / wages / cost-of-living charts.", "link", "large"),
    R("badeconomics", "Wonky charts land well if methods are shown; read posting rules first.", "discussion", "mid"),
    R("TrueReddit", "Longform analysis with a sharp lede.", "link", "mid"),
    R("dataisbeautiful", "OC chart first; blog URL in comments.", "oc-chart", "mega"),
  ],
  Politics: [
    R("NeutralPolitics", "Requires neutral framing + primary sources in the post body.", "discussion", "mid"),
    R("PoliticalDiscussion", "Self-post with chart + sourced bullets; avoid partisan titles.", "discussion", "large"),
    R("moderatepolitics", "Link + discussion flair; cite agencies in the title/body.", "link", "mid"),
    R("geopolitics", "Foreign aid, borders, institutions — sourced analysis OK.", "link", "large"),
    R("dataisbeautiful", "When the chart is the hook; blog in comments.", "oc-chart", "mega"),
  ],
  Finance: [
    R("finance", "Market-structure / rates / banking charts with sources.", "link", "large"),
    R("investing", "Macro / rates context; no stock tips framing.", "link", "mega"),
    R("SecurityAnalysis", "Longer institutional pieces.", "link", "mid"),
    R("StockMarket", "Macro overlays; keep it non-promotional.", "link", "large"),
    R("dataisbeautiful", "OC chart first; blog URL in comments.", "oc-chart", "mega"),
  ],
  Technology: [
    R("technology", "Infrastructure / broadband / tech-policy data stories.", "link", "mega"),
    R("Futurology", "Forward-looking tech systems charts.", "link", "mega"),
    R("tech", "General tech audience for data stories.", "link", "large"),
    R("gadgets", "Consumer-tech angles (EV chargers, 5G, devices).", "link", "large"),
    R("dataisbeautiful", "OC chart first.", "oc-chart", "mega"),
  ],
  "Global Systems": [
    R("environment", "Climate, heat, water, PFAS, disasters — sourced articles OK.", "link", "mega"),
    R("climate", "Heat / emissions / adaptation data.", "link", "large"),
    R("MapPorn", "Only when the hero is a map.", "oc-chart", "mega"),
    R("collapse", "Systems-risk charts (dams, heat, infrastructure) — stay factual.", "link", "large"),
    R("TrueReddit", "Long systems essays.", "link", "mid"),
  ],
  Energy: [
    R("energy", "Primary home for capacity, fuels, grid, EV cost charts.", "link", "mid"),
    R("RenewableEnergy", "Battery recycling, renewables, clean power.", "link", "mid"),
    R("electricvehicles", "EV cost-per-mile, chargers, battery supply.", "link", "large"),
    R("environment", "Energy × climate crossover.", "link", "mega"),
    R("dataisbeautiful", "OC chart first.", "oc-chart", "mega"),
  ],
  Industry: [
    R("infrastructure", "Heavy industry, capacity, chokepoints.", "link", "mid"),
    R("manufacturing", "Plant / capacity / process charts.", "link", "niche"),
    R("supplychain", "Logistics of industrial inputs.", "link", "mid"),
    R("Economics", "Industrial structure as macro.", "link", "large"),
    R("dataisbeautiful", "OC chart first.", "oc-chart", "mega"),
  ],
  "Consumer Finance": [
    R("povertyfinance", "Medical collections, delinquency — empathetic tone; links tolerated.", "link", "large"),
    R("CreditCards", "APR / delinquency / openings charts.", "link", "large"),
    R("studentloans", "Balances vs repayment status.", "link", "mid"),
    R("MiddleClassFinance", "Household-budget framing for credit stress.", "discussion", "large"),
    R("dataisbeautiful", "OC delinquency / balance chart; blog URL in comments.", "oc-chart", "mega"),
  ],
  "Capital Markets": [
    R("bonds", "Munis, distress, ratings.", "link", "niche"),
    R("investing", "Market-structure pieces.", "link", "mega"),
    R("SecurityAnalysis", "Issuer / sector deep dives.", "link", "mid"),
    R("finance", "Institutional plumbing.", "link", "large"),
    R("Economics", "When framed as fiscal / credit cycle.", "link", "large"),
  ],
  "Health Economics": [
    R("medicine", "Organ discard, staffing, GLP-1 spend — cite CMS/CDC/HRSA.", "link", "mega"),
    R("healthcare", "System cost / coverage charts.", "link", "large"),
    R("HealthInsurance", "Coverage gaps, Part D, employer benefits.", "link", "mid"),
    R("nursing", "Aide turnover / staffing ratios.", "link", "large"),
    R("PublicHealth", "Population health metrics.", "link", "mid"),
  ],
  "Labor & Skills": [
    R("jobs", "Apprenticeships, wages, LFP.", "link", "mid"),
    R("careerguidance", "Trades vs college wage charts — non-spammy tone.", "discussion", "large"),
    R("Teachers", "When education labor is the topic.", "link", "large"),
    R("ExperiencedDevs", "Only for senior-talent / wage-premium stories; check rules first.", "discussion", "mid"),
    R("dataisbeautiful", "OC wage-quintile chart; blog URL in comments.", "oc-chart", "mega"),
  ],
  "Real Estate": [
    R("RealEstate", "Rates, first-time buyers, homeownership cohorts.", "link", "large"),
    R("FirstTimeHomeBuyer", "Mortgage rate vs buyer-share charts.", "link", "mid"),
    R("housing", "Vacancy, rent burden, permits.", "link", "mid"),
    R("urbandesign", "Metro housing / conversion pipelines.", "link", "mid"),
    R("yimby", "Supply / permits / formation stories.", "link", "mid"),
  ],
  "Food & Agriculture": [
    R("agriculture", "Primary home for farm / herd / export charts.", "link", "mid"),
    R("farming", "Producer-facing series.", "link", "mid"),
    R("beekeeping", "Colony loss / pollination acres.", "link", "niche"),
    R("food", "Food-at-home CPI / food dollar.", "link", "large"),
    R("environment", "Aquifer, fisheries, land use crossovers.", "link", "mega"),
  ],
  "Transport & Logistics": [
    R("transit", "Trips, revenue hours, agency recovery.", "link", "mid"),
    R("aviation", "Fares, yields, load factors, ATC delays.", "link", "large"),
    R("trucking", "Spot rates, carrier exits.", "link", "mid"),
    R("Logistics", "Freight, containers, blank sailings.", "link", "niche"),
    R("infrastructure", "Bridges, locks, school buses, rail.", "link", "mid"),
  ],
};

interface KeywordRule {
  /** Matched against slug + title + excerpt + tags */
  pattern: RegExp;
  subs: SubredditTarget[];
  /** Extra social-score points (−2…+2) */
  scoreBoost?: number;
}

const KEYWORD_RULES: KeywordRule[] = [
  {
    pattern: /foreign.?aid|oda|ukraine|israel|egypt|afghanistan/i,
    scoreBoost: 2,
    subs: [
      R("geopolitics", "Aid concentration and alliances.", "link", "large"),
      R("ForeignPolicy", "Long-run obligation ledgers.", "link", "mid"),
      R("ukraine", "When Ukraine is a top recipient in the chart.", "link", "large"),
      R("CredibleDefense", "Military vs economic assistance split — stay dry.", "link", "mid"),
      R("dataisbeautiful", "Stacked all-time bars as OC.", "oc-chart", "mega"),
    ],
  },
  {
    pattern: /currency|peg|exchange.?rate|forex|imf.?areaer|cfa.?franc/i,
    scoreBoost: 2,
    subs: [
      R("Economics", "Impossible-trinity / peg maps.", "link", "large"),
      R("MapPorn", "World peg map as OC.", "oc-chart", "mega"),
      R("europe", "EUR / CFA / ERM II angles.", "link", "mega"),
      R("finance", "Anchor-currency implications.", "link", "large"),
      R("geopolitics", "Dollar vs euro anchor blocs.", "link", "large"),
    ],
  },
  {
    pattern: /heat.?death|extreme.?heat|smoke.?day|pm2\.?5|wildfire|firefight/i,
    scoreBoost: 2,
    subs: [
      R("climate", "Heat mortality / smoke days.", "link", "large"),
      R("environment", "Broad climate-health audience.", "link", "mega"),
      R("Wildfire", "Suppression hours / fuels treatment.", "link", "mid"),
      R("weather", "Extreme-heat day overlays.", "link", "large"),
      R("dataisbeautiful", "Metro vs national trend as OC.", "oc-chart", "mega"),
    ],
  },
  {
    pattern: /homeless|point.?in.?time|unsheltered|aging.?out|foster/i,
    scoreBoost: 1,
    subs: [
      R("homeless", "PIT / CoC charts — respectful tone.", "link", "mid"),
      R("housing", "Vacancy vs homelessness.", "link", "mid"),
      R("urbanplanning", "City systems framing.", "link", "large"),
      R("Fosterit", "Aging-out / care exits.", "link", "niche"),
      R("dataisbeautiful", "OC PIT / vacancy chart; blog URL in comments.", "oc-chart", "mega"),
    ],
  },
  {
    pattern: /mortgage|first.?time.?buyer|homeownership|housing.?permit|rent.?burden|office.?vacanc|investor.?home/i,
    scoreBoost: 2,
    subs: [
      R("RealEstate", "Rates and buyer-share charts.", "link", "large"),
      R("FirstTimeHomeBuyer", "Direct audience for FTB share.", "link", "mid"),
      R("housing", "Formation / permits / burden.", "link", "mid"),
      R("REBubble", "Skeptical housing audience — stay factual.", "link", "mid"),
      R("dataisbeautiful", "Cohort homeownership OC.", "oc-chart", "mega"),
    ],
  },
  {
    pattern: /theft|violent.?crime|jail|prison|property.?crime/i,
    scoreBoost: 1,
    subs: [
      R("AskSocialScience", "Crime rate charts with methods.", "discussion", "mid"),
      R("NeutralPolitics", "Neutral + primary sources required.", "discussion", "mid"),
      R("dataisbeautiful", "Rate comparison as OC.", "oc-chart", "mega"),
      R("TrueCrimeDiscussion", "Data-first crime trends — no gore, keep it statistical.", "discussion", "mid"),
      R("dataisbeautiful", "Rate comparison as OC.", "oc-chart", "mega"),
    ],
  },
  {
    pattern: /bead|broadband|unserved|5g.?auction/i,
    scoreBoost: 1,
    subs: [
      R("technology", "Broadband allocation vs need.", "link", "mega"),
      R("ruralissues", "Unserved locations angle.", "link", "niche"),
      R("Rural_Internet", "Fixed-wireless / fiber buildout audience.", "link", "niche"),
      R("Futurology", "Connectivity infrastructure angle.", "link", "mega"),
      R("dataisbeautiful", "Allocation map/bars as OC.", "oc-chart", "mega"),
    ],
  },
  {
    pattern: /superfund|npl.?site|pfas|lead.?service|cso|overflow|aquifer|colorado.?river|dam/i,
    scoreBoost: 1,
    subs: [
      R("environment", "Contamination / water systems.", "link", "mega"),
      R("water", "Aquifers, LSLs, CSO volume.", "link", "mid"),
      R("civilengineering", "Infrastructure residual risk.", "link", "mid"),
      R("chemistry", "PFAS MCL exceedance charts.", "link", "large"),
      R("Hydrogeology", "Aquifer / groundwater specialist audience.", "link", "niche"),
    ],
  },
  {
    pattern: /insurance|cpi.*repair|auto.?insurance|nfip|reinsurance|cyber.?insurance/i,
    scoreBoost: 2,
    subs: [
      R("Insurance", "Primary specialty audience.", "link", "mid"),
      R("InsurancePros", "Agent / underwriter audience for rate charts.", "discussion", "mid"),
      R("cars", "Auto insurance affordability.", "link", "mega"),
      R("actuaries", "Rate-on-line / loss charts.", "link", "niche"),
      R("florida", "When coastal / NFIP residual is central.", "link", "mega"),
    ],
  },
  {
    pattern: /honey.?bee|colony.?loss|almond|pollination|cattle.?herd|farm.?share|cropland|cash.?rent|farmland/i,
    scoreBoost: 1,
    subs: [
      R("beekeeping", "Colony loss vs almond acres.", "link", "niche"),
      R("agriculture", "Herd / acre / food-dollar series.", "link", "mid"),
      R("farming", "Producer economics.", "link", "mid"),
      R("environment", "Pollinator / land-use crossover.", "link", "mega"),
      R("dataisbeautiful", "OC bars.", "oc-chart", "mega"),
    ],
  },
  {
    pattern: /airline|passenger.?yield|load.?factor|jet.?fuel|atc.?delay|aviation/i,
    scoreBoost: 1,
    subs: [
      R("aviation", "Yields, load factors, fares.", "link", "large"),
      R("flightradar24", "Ops / delay curiosities.", "link", "mid"),
      R("travel", "Fare CPI angles.", "link", "mega"),
      R("economy", "Fuel vs fare pass-through.", "link", "large"),
      R("dataisbeautiful", "OC chart.", "oc-chart", "mega"),
    ],
  },
  {
    pattern: /bridge|school.?bus|lock.?unavailability|barge|freight.?rail|trucking|container.?freight|transit|ntd/i,
    scoreBoost: 1,
    subs: [
      R("infrastructure", "Bridges, locks, buses.", "link", "mid"),
      R("transit", "Unlinked trips / VRH.", "link", "mid"),
      R("civilengineering", "Structurally deficient stock.", "link", "mid"),
      R("trucking", "Spot rates / exits.", "link", "mid"),
      R("urbanplanning", "Aging infrastructure risk — factual framing.", "link", "large"),
    ],
  },
  {
    pattern: /n-?400|naturaliz|immigration|border.?encounter|cbp|uscis/i,
    scoreBoost: 1,
    subs: [
      R("immigration", "N-400 backlog / encounters — sourced only.", "link", "mid"),
      R("NeutralPolitics", "Neutral + primary sources.", "discussion", "mid"),
      R("AskSocialScience", "Methods-forward discussion.", "discussion", "mid"),
      R("dataisbeautiful", "OC backlog chart.", "oc-chart", "mega"),
      R("TrueReddit", "Longform sourced analysis.", "link", "mid"),
    ],
  },
  {
    pattern: /va.?disability|veteran|claims.?pending/i,
    scoreBoost: 1,
    subs: [
      R("Veterans", "Pending vs days-to-complete.", "link", "large"),
      R("VeteransBenefits", "Claims process audience.", "link", "mid"),
      R("Military", "Agency performance framing — keep it factual.", "link", "mid"),
      R("dataisbeautiful", "OC backlog chart.", "oc-chart", "mega"),
      R("NeutralPolitics", "Sourced discussion post.", "discussion", "mid"),
    ],
  },
  {
    pattern: /credit.?card|delinquency|revolving|student.?loan|medical.?collection/i,
    scoreBoost: 2,
    subs: [
      R("CreditCards", "APR / openings / delinquency.", "link", "large"),
      R("MiddleClassFinance", "Household-budget framing; discussion post with chart.", "discussion", "large"),
      R("studentloans", "Balances vs repayment.", "link", "mid"),
      R("povertyfinance", "Collections / distress.", "link", "large"),
      R("dataisbeautiful", "OC delinquency / balance chart; blog URL in comments.", "oc-chart", "mega"),
    ],
  },
  {
    pattern: /pet.?food|veterinary|pet.?own/i,
    scoreBoost: 1,
    subs: [
      R("pets", "Vet CPI / ownership.", "link", "large"),
      R("dogs", "Household cost angles.", "link", "mega"),
      R("cats", "Same for cat owners.", "link", "mega"),
      R("Frugal", "Pet-cost budgeting angle; discussion post.", "discussion", "large"),
      R("dataisbeautiful", "OC CPI chart.", "oc-chart", "mega"),
    ],
  },
  {
    pattern: /streaming|cable.?and.?satellite|sports.?admission/i,
    scoreBoost: 1,
    subs: [
      R("cordcutters", "Streaming vs cable CPI.", "link", "mid"),
      R("television", "Price of watching.", "link", "large"),
      R("sports", "Admissions CPI vs wages.", "link", "mega"),
      R("Frugal", "Household subscription-cost angle.", "discussion", "large"),
      R("dataisbeautiful", "OC series chart.", "oc-chart", "mega"),
    ],
  },
  {
    pattern: /enrollment|high.?school.?graduate|homeschool|library|childcare|fertility/i,
    scoreBoost: 1,
    subs: [
      R("education", "Enrollment / cohort charts.", "link", "large"),
      R("Teachers", "School-age demographics.", "link", "large"),
      R("college", "Undergrad enrollment squeeze.", "link", "large"),
      R("libraries", "Visits vs e-circ / revenue.", "link", "mid"),
      R("natalism", "Fertility / childcare cost — careful tone.", "link", "niche"),
    ],
  },
  {
    pattern: /battery.?recycl|ev.?sales|electricity.?cost.?per.?mile|nevi|fast.?charger/i,
    scoreBoost: 2,
    subs: [
      R("electricvehicles", "Core EV audience.", "link", "large"),
      R("energy", "Grid / kWh cost framing.", "link", "mid"),
      R("cars", "Cost-per-mile comparisons.", "link", "mega"),
      R("RenewableEnergy", "Recycling capacity vs sales.", "link", "mid"),
      R("dataisbeautiful", "OC comparison chart.", "oc-chart", "mega"),
    ],
  },
  {
    pattern: /fema|disaster.?declaration|public.?assistance|billion.?dollar.?disaster/i,
    scoreBoost: 1,
    subs: [
      R("weather", "Disaster declaration intensity.", "link", "large"),
      R("environment", "Climate-adjacent losses.", "link", "mega"),
      R("TropicalWeather", "Storm / hurricane loss audience.", "link", "mid"),
      R("dataisbeautiful", "OC bars.", "oc-chart", "mega"),
      R("NeutralPolitics", "Federal outlay framing needs neutral tone.", "discussion", "mid"),
    ],
  },
  {
    pattern: /marriage|never.?married|demographic/i,
    scoreBoost: 1,
    subs: [
      R("dataisbeautiful", "Age-at-marriage OC is highly shareable.", "oc-chart", "mega"),
      R("AskSocialScience", "Methods discussion.", "discussion", "mid"),
      R("sociology", "Family-formation charts.", "link", "niche"),
      R("Economics", "Demographics as macro.", "link", "large"),
      R("TrueReddit", "Essay form.", "link", "mid"),
    ],
  },
  {
    pattern: /food.?at.?home|wage|cpi|inflation|caffeine|coffee|egg.?price/i,
    scoreBoost: 2,
    subs: [
      R("Economics", "CPI vs wages is evergreen.", "link", "large"),
      R("Frugal", "Household grocery-budget angle; discussion post with chart.", "discussion", "large"),
      R("inflation", "Specialty inflation trackers.", "link", "mid"),
      R("food", "Grocery / beverage prices.", "link", "large"),
      R("dataisbeautiful", "Rebased index OC.", "oc-chart", "mega"),
    ],
  },
  {
    pattern: /kidney|organ|transplant|nurse.?aide|hospital|medicare|glp-?1|plasma|antibiotic/i,
    scoreBoost: 1,
    subs: [
      R("medicine", "Clinical operations metrics.", "link", "mega"),
      R("healthcare", "System cost / access.", "link", "large"),
      R("nursing", "Staffing / turnover.", "link", "large"),
      R("HealthInsurance", "Coverage / Part D.", "link", "mid"),
      R("dataisbeautiful", "OC clinical chart.", "oc-chart", "mega"),
    ],
  },
  {
    pattern: /municipal|emma.?default|go.?rating|state.?pension|unclaimed.?property|escheat/i,
    scoreBoost: 0,
    subs: [
      R("bonds", "Muni distress / defaults.", "link", "niche"),
      R("investing", "Credit-quality angle.", "link", "mega"),
      R("govfire", "Pension underfunding (public employees).", "link", "mid"),
      R("PublicPolicy", "State fiscal capacity discussion.", "discussion", "mid"),
      R("dataisbeautiful", "OC issuer chart.", "oc-chart", "mega"),
    ],
  },
  {
    pattern: /orbital|space|debris|launch.?cadence/i,
    scoreBoost: 2,
    subs: [
      R("space", "Launch cadence / debris growth.", "link", "mega"),
      R("SpaceX", "Operator concentration — non-fanboy tone.", "link", "mega"),
      R("astronomy", "Debris catalog growth.", "link", "large"),
      R("dataisbeautiful", "OC time series.", "oc-chart", "mega"),
      R("Futurology", "Orbital traffic systems.", "link", "mega"),
    ],
  },
  {
    pattern: /subsea.?cable|shipbuilding|graphite|phosphate|copper.?mine|cement.?clinker|steel|blast.?furnace/i,
    scoreBoost: 1,
    subs: [
      R("geopolitics", "Chokepoint commodities.", "link", "large"),
      R("infrastructure", "Physical capacity maps.", "link", "mid"),
      R("MapPorn", "When geography is the viz.", "oc-chart", "mega"),
      R("Economics", "Concentration / trade.", "link", "large"),
      R("dataisbeautiful", "OC concentration chart.", "oc-chart", "mega"),
    ],
  },
  {
    pattern: /ai.?|data.?center|capex|token.?consumption|compute.?demand/i,
    scoreBoost: 2,
    subs: [
      R("MachineLearning", "Capex / compute demand — keep empirical.", "link", "mega"),
      R("technology", "Data-center / power stories.", "link", "mega"),
      R("singularity", "Forward compute demand.", "link", "large"),
      R("energy", "Power-grid × AI.", "link", "mid"),
      R("dataisbeautiful", "OC concentration chart.", "oc-chart", "mega"),
    ],
  },
  {
    pattern: /remittance|refugee|migration|humanitarian/i,
    scoreBoost: 1,
    subs: [
      R("geopolitics", "Hosting burden / corridors.", "link", "large"),
      R("economics", "Remittance macro.", "link", "large"),
      R("MapPorn", "Corridor maps.", "oc-chart", "mega"),
      R("AskSocialScience", "Migration data discussion with methods.", "discussion", "mid"),
      R("dataisbeautiful", "OC map/bars.", "oc-chart", "mega"),
    ],
  },
];

/**
 * NOTE: VIRAL_TITLE is kept for potential future use; scorePost now uses a stricter
 * strongHook test (number + contrast verb) so "versus" alone can't inflate scores.
 */
const VIRAL_TITLE_UNUSED =
  /\b(\d+%|\d+\s*(countries|states|metros|years)|half|still|versus|vs\.?|lowest|highest|record|first.?time)\b/i;
void VIRAL_TITLE_UNUSED;

function haystack(post: Post): string {
  return [
    post.slug,
    post.title,
    post.excerpt,
    post.category,
    ...(post.tags ?? []),
    ...(post.keyPoints ?? []),
  ].join(" ");
}

function dedupeSubs(subs: SubredditTarget[], limit = 5): SubredditTarget[] {
  const seen = new Set<string>();
  const out: SubredditTarget[] = [];
  for (const s of subs) {
    const key = s.name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(s);
    if (out.length >= limit) break;
  }
  return out;
}

function scorePost(post: Post, keywordBoost: number): {
  score: 1 | 2 | 3 | 4 | 5;
  reason: string;
} {
  // Spread model: sequels cluster at 1–2, flagships at 3–4, rare breakouts at 5.
  let points = 3;
  const reasons: string[] = [];

  // Sequel/variant cuts (update/concentration/geography/cycle) are weaker social bets
  // than the flagship research drops — score the cut depth so the ranking spreads out.
  const slugLower = post.slug.toLowerCase();
  const isGeography = slugLower.includes("-geography-") || slugLower.includes("-geography");
  const isConcentration = slugLower.includes("-concentration-") || slugLower.includes("-concentration");
  const isUpdate = slugLower.includes("-update-") || slugLower.includes("-update") || /^update:/i.test(post.title);
  const isCycle = slugLower.includes("-cycle");
  if (isGeography || isConcentration) {
    points -= 1.5;
    reasons.push("variant cut — weaker social hook than the flagship drop");
  } else if (isUpdate) {
    points -= 1;
    reasons.push("follow-up update — weaker social hook than the flagship drop");
  } else if (isCycle) {
    points -= 1;
    reasons.push("cycle re-cut — weaker social hook than the flagship drop");
  }

  if (keywordBoost >= 2) {
    points += 1;
    reasons.push("topic matches high-engagement Reddit niches");
  } else if (keywordBoost === 1) {
    points += 0.5;
    reasons.push("topic matches active Reddit niches");
  }

  // Only genuinely strong hooks (concrete % + contrast, or rare superlative) earn a bump.
  const hasPct = /\b\d+(\.\d+)?%/.test(post.title);
  const hasSuperlative =
    /\b(halved|doubled|record (high|low)|lowest|highest|first.?time|seventy-year|all-time)\b/i.test(post.title);
  if (hasPct && hasSuperlative) {
    points += 1;
    reasons.push("title has a rare concrete hook (number + superlative)");
  } else if (hasSuperlative) {
    points += 0.5;
    reasons.push("title has a superlative hook");
  }

  // Broad categories get a small lift; niche categories a small penalty.
  const broad: Category[] = [
    "Economics",
    "Energy",
    "Politics",
    "Real Estate",
    "Consumer Finance",
    "Global Systems",
    "Technology",
  ];
  if (broad.includes(post.category)) {
    points += 0.5;
    reasons.push(`${post.category} travels well beyond specialist subs`);
  }

  const niche: Category[] = ["Capital Markets", "Industry", "Labor & Skills"];
  if (niche.includes(post.category) && keywordBoost <= 0) {
    points -= 1;
    reasons.push("specialist category — strong in niche subs, weaker on broad social");
  }

  // Recency is a small tiebreaker only (last ~14 days). Older archive (>45d) drifts down.
  const ageDays =
    (Date.now() - new Date(post.publishedAt).getTime()) / (1000 * 60 * 60 * 24);
  if (ageDays >= 0 && ageDays < 14) {
    points += 0.5;
    reasons.push("recently published");
  }
  if (ageDays >= 45) {
    points -= 0.5;
    reasons.push("older story — reshare with a fresh angle");
  }

  const clamped = Math.max(1, Math.min(5, Math.round(points))) as 1 | 2 | 3 | 4 | 5;
  return {
    score: clamped,
    reason: reasons.slice(0, 3).join("; ") || "Standard data-story shareability",
  };
}

export function recommendSubreddits(post: Post): SubredditTarget[] {
  const text = haystack(post);
  const matched: SubredditTarget[] = [];
  for (const rule of KEYWORD_RULES) {
    if (rule.pattern.test(text)) matched.push(...rule.subs);
  }

  const categorySubs = CATEGORY_DEFAULTS[post.category] ?? UNIVERSAL;
  // Prefer keyword hits, then category defaults, then universal fillers
  return dedupeSubs([...matched, ...categorySubs, ...UNIVERSAL], 5);
}

export function buildSocialOutreachRow(post: Post): SocialOutreachRow {
  const text = haystack(post);
  let keywordBoost = 0;
  for (const rule of KEYWORD_RULES) {
    if (rule.pattern.test(text) && rule.scoreBoost) {
      keywordBoost = Math.max(keywordBoost, rule.scoreBoost);
    }
  }
  const { score, reason } = scorePost(post, keywordBoost);
  return {
    slug: post.slug,
    title: post.title,
    category: post.category,
    excerpt: post.excerpt,
    publishedAt: post.publishedAt,
    href: `/blog/${post.slug}`,
    socialScore: score,
    socialRankReason: reason,
    subreddits: recommendSubreddits(post),
  };
}

export function buildSocialOutreachCatalog(posts: Post[]): SocialOutreachRow[] {
  return posts
    .map(buildSocialOutreachRow)
    .sort((a, b) => {
      if (b.socialScore !== a.socialScore) return b.socialScore - a.socialScore;
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });
}

export function topSocialPosts(rows: SocialOutreachRow[], n = 5): SocialOutreachRow[] {
  return rows.slice(0, n);
}

export const POST_STYLE_LABEL: Record<SubredditTarget["postStyle"], string> = {
  link: "Link post OK",
  "oc-chart": "OC chart + link in comment",
  discussion: "Discussion / self-post",
};
