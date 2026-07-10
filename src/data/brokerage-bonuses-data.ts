export type BonusTier = { deposit: string; newUser: string; referrer: string };

export type OfferCategory = "Traditional" | "Fintech" | "Robo-advisor" | "Micro-invest";
export type OfferType = "Signup" | "Referral" | "Both";

export type Offer = {
  id: string;
  company: string;
  category: OfferCategory;
  offerType: OfferType;
  maxNewUser: string;
  maxReferrer: string;
  minDeposit: string;
  holdPeriod: string;
  expires: string;
  tiers: BonusTier[];
  referrerNotes: string;
  caveats: string;
  source: string;
};

export const OFFERS: Offer[] = [

  {
    id: "etrade",
    company: "E*TRADE",
    category: "Traditional",
    offerType: "Both",
    maxNewUser: "$10,000 cash",
    maxReferrer: "$50 Amazon GC",
    minDeposit: "$1,000",
    holdPeriod: "12 months",
    expires: "Oct 31, 2026",
    tiers: [
      { deposit: "$1k–$4,999", newUser: "$50", referrer: "$50 GC" },
      { deposit: "$5k–$19,999", newUser: "$150", referrer: "$50 GC" },
      { deposit: "$20k–$99,999", newUser: "$300", referrer: "$50 GC" },
      { deposit: "$100k–$199,999", newUser: "$600", referrer: "$50 GC" },
      { deposit: "$200k–$499,999", newUser: "$1,000", referrer: "$50 GC" },
      { deposit: "$500k–$999,999", newUser: "$1,500", referrer: "$50 GC" },
      { deposit: "$1M–$1.49M", newUser: "$3,000", referrer: "$50 GC" },
      { deposit: "$1.5M–$1.99M", newUser: "$5,000", referrer: "$50 GC" },
      { deposit: "$2M–$4.99M", newUser: "$6,000", referrer: "$50 GC" },
      { deposit: "$5M+", newUser: "$10,000", referrer: "$50 GC" },
    ],
    referrerNotes: "Existing clients earn $50 Amazon gift card per qualifying referral (max $500/yr). New user must also qualify for brokerage promo.",
    caveats: "Code OFFER26. Non-retirement brokerage only. Fund within 60 days. New external funds only.",
    source: "us.etrade.com/promo/brokerage",
  },
  {
    id: "jpmorgan",
    company: "J.P. Morgan Self-Directed",
    category: "Traditional",
    offerType: "Signup",
    maxNewUser: "$1,000 cash",
    maxReferrer: "None",
    minDeposit: "$5,000",
    holdPeriod: "90 days",
    expires: "Jul 21, 2026",
    tiers: [
      { deposit: "$5k–$24,999", newUser: "$50", referrer: "—" },
      { deposit: "$25k–$99,999", newUser: "$150", referrer: "—" },
      { deposit: "$100k–$249,999", newUser: "$325", referrer: "—" },
      { deposit: "$250k+", newUser: "$1,000", referrer: "—" },
    ],
    referrerNotes: "No referrer payout. Must apply via official offer page.",
    caveats: "New money from non-Chase/JPM accounts. Fund within 45 days.",
    source: "chase.com/personal/investments/offers",
  },
  {
    id: "merrill",
    company: "Merrill Edge",
    category: "Traditional",
    offerType: "Signup",
    maxNewUser: "$600 cash ($1,000 w/ Preferred)",
    maxReferrer: "None",
    minDeposit: "$20,000",
    holdPeriod: "90 days",
    expires: "Ongoing",
    tiers: [
      { deposit: "$20k–$49,999", newUser: "$100", referrer: "—" },
      { deposit: "$50k–$99,999", newUser: "$150", referrer: "—" },
      { deposit: "$100k–$199,999", newUser: "$250", referrer: "—" },
      { deposit: "$200k+", newUser: "$600", referrer: "—" },
      { deposit: "$250k+ (code 1000PR + Preferred Rewards)", newUser: "$1,000", referrer: "—" },
    ],
    referrerNotes: "No referral program for existing clients.",
    caveats: "Code merrill600. IRA/CMA eligible. Net new assets within 45 days.",
    source: "merrilledge.com/offers/600",
  },
  {
    id: "schwab",
    company: "Charles Schwab",
    category: "Traditional",
    offerType: "Referral",
    maxNewUser: "$1,000 cash",
    maxReferrer: "None",
    minDeposit: "$25,000",
    holdPeriod: "1 year",
    expires: "Ongoing",
    tiers: [
      { deposit: "$25k–$49,999", newUser: "$100", referrer: "—" },
      { deposit: "$50k–$99,999", newUser: "$300", referrer: "—" },
      { deposit: "$100k–$499,999", newUser: "$500", referrer: "—" },
      { deposit: "$500k+", newUser: "$1,000", referrer: "—" },
    ],
    referrerNotes: "Referrer gets $0. Referral link required from existing Schwab client.",
    caveats: "Also: $50 starter kit with $50 deposit (code SCHWABSTARTERKIT, no referral needed).",
    source: "schwab.com/refer-a-friend",
  },
  {
    id: "tradestation",
    company: "TradeStation",
    category: "Traditional",
    offerType: "Signup",
    maxNewUser: "$5,000 cash",
    maxReferrer: "None",
    minDeposit: "$5,000",
    holdPeriod: "270 days",
    expires: "Ongoing",
    tiers: [
      { deposit: "$5k–$24,999", newUser: "$50–$150", referrer: "—" },
      { deposit: "$25k–$99,999", newUser: "$150–$400", referrer: "—" },
      { deposit: "$100k–$249,999", newUser: "$500–$1,000", referrer: "—" },
      { deposit: "$250k–$499,999", newUser: "$1,000–$800", referrer: "—" },
      { deposit: "$500k–$999,999", newUser: "$2,000", referrer: "—" },
      { deposit: "$1M–$1.99M", newUser: "$3,500–$3,000", referrer: "—" },
      { deposit: "$2M+", newUser: "$5,000", referrer: "—" },
    ],
    referrerNotes: "No standard referral bonus.",
    caveats: "Two promos: code 0148AGGL (up to $3,500) or WHLEAGJE (up to $5,000). Non-IRA only.",
    source: "tradestation.com/pricing/promotions",
  },
  {
    id: "ally",
    company: "Ally Invest",
    category: "Traditional",
    offerType: "Signup",
    maxNewUser: "$200 cash",
    maxReferrer: "None",
    minDeposit: "$1,000",
    holdPeriod: "90 days",
    expires: "Dec 31, 2026",
    tiers: [
      { deposit: "$1,000+ (external transfer)", newUser: "$200", referrer: "—" },
      { deposit: "$1,000+ (from Ally Bank)", newUser: "$100", referrer: "—" },
    ],
    referrerNotes: "No referral program.",
    caveats: "Self-directed or Robo only. Not IRAs. Must use promo page link.",
    source: "ally.com/go/invest/100-bonus-offer",
  },
  {
    id: "ibkr",
    company: "Interactive Brokers",
    category: "Traditional",
    offerType: "Both",
    maxNewUser: "$1,000 IBKR stock",
    maxReferrer: "$200 cash",
    minDeposit: "$10,000 (referral) / scales below",
    holdPeriod: "1 year",
    expires: "Ongoing",
    tiers: [
      { deposit: "$300", newUser: "$1 stock", referrer: "—" },
      { deposit: "$30,000", newUser: "$100 stock", referrer: "—" },
      { deposit: "$300,000", newUser: "$1,000 stock (max)", referrer: "$200" },
    ],
    referrerNotes: "$200 per referral when friend deposits $10k+ and holds 1 year. Max 15/yr, 30 lifetime.",
    caveats: "$1 IBKR stock per $300 deposited (max $1,000). Tax-deferred accounts ineligible.",
    source: "interactivebrokers.com/referral-member-to-member",
  },
  {
    id: "moomoo",
    company: "Moomoo",
    category: "Fintech",
    offerType: "Both",
    maxNewUser: "$1,000 NVDA stock",
    maxReferrer: "$100 NVDA/referral (13+)",
    minDeposit: "$500",
    holdPeriod: "60–180 days",
    expires: "Aug 31, 2026",
    tiers: [
      { deposit: "$500", newUser: "$30 NVDA", referrer: "Puzzle pieces" },
      { deposit: "$2,000", newUser: "$100 NVDA", referrer: "Puzzle pieces" },
      { deposit: "$10,000", newUser: "$200 NVDA", referrer: "Puzzle pieces" },
      { deposit: "$50,000", newUser: "$400 NVDA", referrer: "Puzzle pieces" },
      { deposit: "$100,000", newUser: "$1,000 NVDA", referrer: "Puzzle pieces" },
    ],
    referrerNotes: "Puzzle model: 4 friends × $500 deposit = complete puzzle ($100–$350 cash/NVDA). 13th+ referral = $100 NVDA each. Invitee via link: $25 cash.",
    caveats: "Also: 3% ACAT transfer match (up to $600). 4.75% APY booster on cash sweep. Referral promo may rotate.",
    source: "moomoo.com/us/support (deposit + referral T&Cs)",
  },
  {
    id: "tradeup",
    company: "TradeUP",
    category: "Fintech",
    offerType: "Signup",
    maxNewUser: "$2,000 cash + NVDA",
    maxReferrer: "Varies",
    minDeposit: "$1,000",
    holdPeriod: "30 days + 10 trades",
    expires: "May 31, 2026",
    tiers: [
      { deposit: "$1,000", newUser: "1 NVDA share", referrer: "—" },
      { deposit: "$50,000", newUser: "$1,000 cash", referrer: "—" },
      { deposit: "$100,000 ACAT", newUser: "$2,000 cash", referrer: "—" },
    ],
    referrerNotes: "Partner promo codes (e.g. NINJA). Standard referral varies.",
    caveats: "Taxable accounts only. Up to 5 bonus stocks ($10–$1,800 each) at higher tiers.",
    source: "TradeUP partner promos / official T&Cs",
  },
  {
    id: "robinhood",
    company: "Robinhood",
    category: "Fintech",
    offerType: "Both",
    maxNewUser: "$200 gift stock",
    maxReferrer: "$200 gift stock",
    minDeposit: "$0 (link bank)",
    holdPeriod: "30 days to withdraw",
    expires: "Ongoing",
    tiers: [
      { deposit: "Link bank/debit", newUser: "$5–$200 (99% get $5)", referrer: "$5–$200" },
    ],
    referrerNotes: "Both sides get gift stock. Referrer cap $1,500/yr. Friend must sign up, get approved, link bank.",
    caveats: "~99% receive $5 value. Must pick from 26 preset stocks. 3-day hold before selling.",
    source: "robinhood.com support (referral T&Cs)",
  },
  {
    id: "webull",
    company: "Webull",
    category: "Fintech",
    offerType: "Both",
    maxNewUser: "$80,000 match (4%)",
    maxReferrer: "Free stocks + cash",
    minDeposit: "$2,000",
    holdPeriod: "5 years (installments)",
    expires: "Invitation-only",
    tiers: [
      { deposit: "$2k–$99,999", newUser: "3% match ($60 min)", referrer: "Varies in app" },
      { deposit: "$100k–$2M", newUser: "4% match (max $80k)", referrer: "Varies in app" },
    ],
    referrerNotes: "Referral rewards shown in Promotion Center; typically free fractional shares per funded friend.",
    caveats: "Deposit match is targeted/invitation-only. Paid in 6 annual installments through 2031. IRA excluded.",
    source: "Webull promo pages / Doctor of Credit",
  },
  {
    id: "sofi",
    company: "SoFi Invest",
    category: "Fintech",
    offerType: "Both",
    maxNewUser: "$1,000 stock (0.026% chance)",
    maxReferrer: "$50 cash",
    minDeposit: "$50 signup / $25 referral",
    holdPeriod: "None stated",
    expires: "Ongoing",
    tiers: [
      { deposit: "$50+ (Claw promo)", newUser: "$5–$1,000 stock", referrer: "—" },
      { deposit: "$25+ (referral)", newUser: "$25 stock", referrer: "$50 cash" },
    ],
    referrerNotes: "Referrer gets $50 when friend opens Active Invest via link and deposits $25+.",
    caveats: "Claw promo: fund within 45 days. Also IRA rollover 1% match via Capitalize.",
    source: "sofi.com/invest + referral program T&Cs",
  },
  {
    id: "public",
    company: "Public.com",
    category: "Fintech",
    offerType: "Both",
    maxNewUser: "$20 stock/ETF",
    maxReferrer: "$20 stock/ETF",
    minDeposit: "$1,000",
    holdPeriod: "None stated",
    expires: "Ongoing (may end anytime)",
    tiers: [
      { deposit: "$1,000+", newUser: "$20 asset", referrer: "$20 asset" },
    ],
    referrerNotes: "Both sides pick a stock/ETF. Referrer account must be funded and in good standing.",
    caveats: "Started Jan 20, 2026. Personal friends/family only.",
    source: "public.com/disclosures/referral-terms",
  },
  {
    id: "m1",
    company: "M1 Finance",
    category: "Fintech",
    offerType: "Both",
    maxNewUser: "$50 cash",
    maxReferrer: "$50 cash",
    minDeposit: "$500",
    holdPeriod: "90 days",
    expires: "Ongoing",
    tiers: [
      { deposit: "$500+", newUser: "$50", referrer: "$50" },
    ],
    referrerNotes: "Both sides get $50 after 90-day hold. Paid in 7–10 business days after hold.",
    caveats: "Must open via referral link. Fund within 30 days.",
    source: "M1 referral program",
  },
  {
    id: "acorns",
    company: "Acorns",
    category: "Micro-invest",
    offerType: "Both",
    maxNewUser: "$20 investment",
    maxReferrer: "$5 + promo tiers",
    minDeposit: "$5 recurring",
    holdPeriod: "7 days to set up",
    expires: "Ongoing",
    tiers: [
      { deposit: "$5 recurring", newUser: "$20 bonus", referrer: "$5 per referral" },
      { deposit: "$5 (referred)", newUser: "$5", referrer: "$5 + limited promos" },
    ],
    referrerNotes: "Base: $5 per referral. Periodic promos (e.g. $1,375 for 5 referrals) are time-limited.",
    caveats: "$3–$12/mo subscription. June 2026 promos expired Jun 7.",
    source: "acorns.com/ref-terms",
  },
  {
    id: "stash",
    company: "Stash",
    category: "Micro-invest",
    offerType: "Both",
    maxNewUser: "$100 cash/stock",
    maxReferrer: "$100 cash/stock",
    minDeposit: "$5",
    holdPeriod: "90 days",
    expires: "Ongoing",
    tiers: [
      { deposit: "$5+", newUser: "$5–$100 (often ~$30)", referrer: "$5–$100" },
    ],
    referrerNotes: "Both sides get same variable reward. Referrer cap $1,000/12 months.",
    caveats: "$3/mo Stash Growth plan. Reward amount shown in offer message.",
    source: "stash.com referral solicitation agreement",
  },
  {
    id: "wealthfront",
    company: "Wealthfront",
    category: "Robo-advisor",
    offerType: "Both",
    maxNewUser: "0.50% deposit match",
    maxReferrer: "0.50% deposit match",
    minDeposit: "Varies",
    holdPeriod: "3 months",
    expires: "Ongoing",
    tiers: [
      { deposit: "Up to $100k invested", newUser: "0.50% match (3 mo)", referrer: "0.50% match" },
      { deposit: "Cash account up to $150k", newUser: "+0.75% APY boost (3 mo)", referrer: "+0.75% APY" },
    ],
    referrerNotes: "Both sides can get APY boost on cash and/or 0.50% investing match for 3 months.",
    caveats: "Not a cash bonus. Fee waiver on up to $5k for 3 months.",
    source: "wealthfront.com/support",
  },
  {
    id: "betterment",
    company: "Betterment",
    category: "Robo-advisor",
    offerType: "Referral",
    maxNewUser: "+0.75% APY boost",
    maxReferrer: "+0.75% APY boost",
    minDeposit: "Qualifying deposit",
    holdPeriod: "3 months",
    expires: "Ongoing",
    tiers: [
      { deposit: "Cash Reserve", newUser: "+0.75% APY (up to $1M)", referrer: "+0.75% APY" },
    ],
    referrerNotes: "Both sides get 3-month APY boost on Cash Reserve.",
    caveats: "Investing deposit match promos may exist separately (check site).",
    source: "betterment.com/refer-a-friend-offer",
  },
  {
    id: "empower",
    company: "Empower (Personal Dashboard)",
    category: "Robo-advisor",
    offerType: "Both",
    maxNewUser: "$20–$50 Amazon GC",
    maxReferrer: "$20–$50 Amazon GC",
    minDeposit: "$1,000 linked account",
    holdPeriod: "30 days to link",
    expires: "Ongoing",
    tiers: [
      { deposit: "Link $1k+ investment acct", newUser: "$20–$50 GC", referrer: "$20–$50 GC" },
    ],
    referrerNotes: "Dashboard tool, not a brokerage. Both get Amazon gift card.",
    caveats: "Must link external brokerage/401k/IRA with $1k+ balance.",
    source: "empower.com/refer",
  },
  {
    id: "vanguard",
    company: "Vanguard",
    category: "Traditional",
    offerType: "Signup",
    maxNewUser: "None",
    maxReferrer: "None",
    minDeposit: "—",
    holdPeriod: "—",
    expires: "—",
    tiers: [],
    referrerNotes: "No referral program.",
    caveats: "No brokerage signup bonus. Cash Plus has temporary +0.25% APY boost only.",
    source: "vanguard.com",
  },
  {
    id: "fidelity",
    company: "Fidelity",
    category: "Traditional",
    offerType: "Referral",
    maxNewUser: "None",
    maxReferrer: "None",
    minDeposit: "—",
    holdPeriod: "—",
    expires: "—",
    tiers: [],
    referrerNotes: "Refer-a-friend page exists but no cash/stock bonus for either party.",
    caveats: "Occasional third-party promos; no standing national bonus.",
    source: "fidelity.com",
  },
  {
    id: "tastytrade",
    company: "tastytrade",
    category: "Traditional",
    offerType: "Signup",
    maxNewUser: "4% match (expired)",
    maxReferrer: "None",
    minDeposit: "$1,000",
    holdPeriod: "30 days",
    expires: "Mar 31, 2026",
    tiers: [
      { deposit: "$1k+ (30 days)", newUser: "4% match up to $10k", referrer: "—" },
    ],
    referrerNotes: "No standard referral bonus.",
    caveats: "BIGDEAL promo expired Mar 31, 2026. Check for new promos.",
    source: "investopedia.com / tastytrade",
  },
  {
    id: "firstrade",
    company: "Firstrade",
    category: "Traditional",
    offerType: "Signup",
    maxNewUser: "Up to $4,000 (historical)",
    maxReferrer: "Occasional free stocks",
    minDeposit: "$5,000",
    holdPeriod: "12 months",
    expires: "Check site",
    tiers: [
      { deposit: "$5,000+", newUser: "$50+", referrer: "—" },
      { deposit: "$1.5M", newUser: "$4,000", referrer: "—" },
    ],
    referrerNotes: "Occasional referral free-stock promos.",
    caveats: "Official promos page currently shows transfer/wire rebates only. IRA: 3% contribution / 2% transfer match (seasonal).",
    source: "firstrade.com/accounts/promos",
  },
];

export const CATEGORIES = ["All", "Traditional", "Fintech", "Robo-advisor", "Micro-invest"] as const;
export type CategoryFilter = (typeof CATEGORIES)[number];

export function parseMoneyMax(s: string): number {
  if (!s || s === "None" || s === "—" || s.startsWith("—")) return 0;
  const amounts: number[] = [];
  // Suffix must not be the start of a word (e.g. "$80,000 match" must not read "m" as millions)
  for (const match of s.matchAll(/\$([\d,]+(?:\.\d+)?)(?:\s*([kKmM])(?![a-zA-Z]))?/gi)) {
    let n = Number(match[1].replace(/,/g, ""));
    const suffix = (match[2] || "").toLowerCase();
    if (suffix === "k") n *= 1000;
    if (suffix === "m") n *= 1_000_000;
    amounts.push(n);
  }
  return amounts.length ? Math.max(...amounts) : 0;
}

export function hasReferrerPayout(o: Offer): boolean {
  return (
    o.maxReferrer !== "None" &&
    !o.maxReferrer.startsWith("—") &&
    o.maxReferrer !== "Varies" &&
    o.maxReferrer !== "Puzzle pieces" &&
    o.maxReferrer !== "Occasional free stocks"
  );
}

export function enrichOffer(o: Offer) {
  return {
    ...o,
    maxNewUserNum: parseMoneyMax(o.maxNewUser),
    maxReferrerNum: parseMoneyMax(o.maxReferrer),
    minDepositNum: parseMoneyMax(o.minDeposit),
    hasActiveBonus: o.tiers.length > 0,
    hasReferrerPayout: hasReferrerPayout(o),
  };
}

export type EnrichedOffer = ReturnType<typeof enrichOffer>;

export const ENRICHED_OFFERS = OFFERS.map(enrichOffer);

export const STATS = {
  platformCount: OFFERS.length,
  activeBonusCount: ENRICHED_OFFERS.filter((o) => o.hasActiveBonus).length,
  bothSideCount: ENRICHED_OFFERS.filter((o) => o.hasReferrerPayout).length,
  highestBonus: ENRICHED_OFFERS.reduce((best, o) =>
    o.maxNewUserNum > best.maxNewUserNum ? o : best,
  ENRICHED_OFFERS[0]),
};

export const CATEGORY_COLORS: Record<OfferCategory, string> = {
  Traditional: "#3b82f6",
  Fintech: "#06b6d4",
  "Robo-advisor": "#6366f1",
  "Micro-invest": "#22c55e",
};

export const CHART_COLORS = {
  newUser: "#f59e0b",
  referrer: "#06b6d4",
  accent: "#6366f1",
};

export function fmtUsd(n: number): string {
  if (n >= 1_000_000) return "$" + (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1000) return "$" + (n / 1000).toFixed(0) + "k";
  if (n > 0) return "$" + n.toLocaleString();
  return "—";
}
