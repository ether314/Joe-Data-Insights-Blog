/**
 * Global AI token consumption estimates (Nov 2022 – Jun 2026).
 *
 * Core finding: Chinese model providers overtook US providers in routed API
 * token volume during Q1 2026. Earlier versions of this dataset tracked only
 * US/Western brands and materially understated global throughput.
 *
 * Series are built by geometric interpolation between ANCHOR points. Anchors
 * flagged `disclosed: true` come from company keynotes, earnings calls, or
 * government statistics; unflagged anchors are derived from revenue, MAU,
 * pricing, or capacity proxies.
 *
 * Units: trillions of tokens processed per calendar month (input + output),
 * across all surfaces the provider operates (first-party apps, internal
 * product surfaces, and external API).
 *
 * KNOWN SCOPE CAVEATS (see METHOD_NOTES):
 * - Vendor "all surfaces" figures include internal workloads (Google Search AI
 *   Overviews, ByteDance recommendation/moderation). Both US and Chinese
 *   headline numbers are inflated the same way, so the ratio remains useful.
 * - Open-weight models (DeepSeek, Qwen, GLM) are served by third-party clouds.
 *   Some tokens may be counted by both the model author and the serving cloud.
 * - Chinese text tokenizes differently (~1–1.5 tokens per Chinese character vs
 *   ~0.75 words per token in English), so equal token counts are not equal work.
 */

export type SourceType = "disclosed" | "estimated";

export type Origin = "United States" | "China" | "Europe" | "Canada";

export type AiBrandId =
  // United States
  | "openai"
  | "google"
  | "anthropic"
  | "microsoft"
  | "meta"
  | "amazon-bedrock"
  | "xai"
  // China
  | "bytedance"
  | "alibaba"
  | "deepseek"
  | "tencent"
  | "baidu"
  | "moonshot"
  | "zhipu"
  | "minimax"
  | "xiaomi"
  | "iflytek"
  // Europe / Canada
  | "mistral"
  | "cohere";

export type TokenMonthlyRecord = {
  id: string;
  brandId: AiBrandId;
  brand: string;
  origin: Origin;
  year: number;
  month: number;
  yearMonth: string;
  tokensTrillions: number;
  unit: "T tokens/mo";
  sourceType: SourceType;
  source: string;
  notes?: string;
  momPct: number | null;
  yoyPct: number | null;
};

export const DATA_YEAR_START = 2022;
export const DATA_YEAR_END = 2026;
export const DATA_MONTH_START = "2022-11";
export const DATA_MONTH_END = "2026-06";

export const SOURCE_NOTE =
  "Disclosed vendor keynotes and earnings calls, China National Data Administration statistics, OpenRouter routed-volume rankings, and analyst estimates. No uniform industry reporting standard for tokens processed.";

export const BRAND_COLORS: Record<AiBrandId, string> = {
  openai: "#10b981",
  google: "#4285f4",
  anthropic: "#d97706",
  microsoft: "#00a4ef",
  meta: "#0668E1",
  "amazon-bedrock": "#ff9900",
  xai: "#64748b",
  bytedance: "#f43f5e",
  alibaba: "#ff6a00",
  deepseek: "#7c3aed",
  tencent: "#12b7f5",
  baidu: "#2932e1",
  moonshot: "#ec4899",
  zhipu: "#14b8a6",
  minimax: "#e11d48",
  xiaomi: "#ff5722",
  iflytek: "#0ea5e9",
  mistral: "#fa5210",
  cohere: "#8b5cf6",
};

export const BRAND_LABELS: Record<AiBrandId, string> = {
  openai: "OpenAI",
  google: "Google",
  anthropic: "Anthropic",
  microsoft: "Microsoft",
  meta: "Meta",
  "amazon-bedrock": "Amazon Bedrock",
  xai: "xAI",
  bytedance: "ByteDance (Doubao)",
  alibaba: "Alibaba (Qwen)",
  deepseek: "DeepSeek",
  tencent: "Tencent (Hunyuan)",
  baidu: "Baidu (ERNIE)",
  moonshot: "Moonshot (Kimi)",
  zhipu: "Zhipu / Z.ai (GLM)",
  minimax: "MiniMax",
  xiaomi: "Xiaomi (MiMo)",
  iflytek: "iFlytek (Spark)",
  mistral: "Mistral AI",
  cohere: "Cohere",
};

export const BRAND_ORIGIN: Record<AiBrandId, Origin> = {
  openai: "United States",
  google: "United States",
  anthropic: "United States",
  microsoft: "United States",
  meta: "United States",
  "amazon-bedrock": "United States",
  xai: "United States",
  bytedance: "China",
  alibaba: "China",
  deepseek: "China",
  tencent: "China",
  baidu: "China",
  moonshot: "China",
  zhipu: "China",
  minimax: "China",
  xiaomi: "China",
  iflytek: "China",
  mistral: "Europe",
  cohere: "Canada",
};

export const ORIGIN_COLORS: Record<Origin, string> = {
  "United States": "#2563eb",
  China: "#dc2626",
  Europe: "#7c3aed",
  Canada: "#0d9488",
};

export const ORIGINS: Origin[] = ["United States", "China", "Europe", "Canada"];

type Anchor = {
  ym: string;
  /** Trillions of tokens per month */
  t: number;
  disclosed?: boolean;
  note?: string;
};

/**
 * Anchor points per provider. Disclosed anchors cite a public figure; the
 * `note` records the original unit so daily/minute conversions stay auditable.
 */
const ANCHORS: Record<AiBrandId, Anchor[]> = {
  openai: [
    { ym: "2022-11", t: 0.12, note: "ChatGPT launch month" },
    { ym: "2023-06", t: 12 },
    { ym: "2024-06", t: 95 },
    { ym: "2025-06", t: 270, note: "API ~5T tokens/day era" },
    {
      ym: "2025-10",
      t: 470,
      disclosed: true,
      note: "DevDay: 6B API tokens/min (263T/mo API) + first-party apps",
    },
    {
      ym: "2026-03",
      t: 1180,
      disclosed: true,
      note: "WSJ/CFO Sarah Friar: 15B API tokens/min (657T/mo API) + apps",
    },
    { ym: "2026-06", t: 1700, note: "GPT-5.4 alone reported at 5T tokens/day" },
  ],
  google: [
    { ym: "2022-11", t: 0.04 },
    {
      ym: "2024-05",
      t: 9.7,
      disclosed: true,
      note: "Pichai I/O 2026: '9.7 trillion tokens a month two years ago'",
    },
    { ym: "2025-05", t: 480, disclosed: true, note: "Google I/O 2025 keynote" },
    { ym: "2025-10", t: 1300, disclosed: true, note: "Google: ~1.3 quadrillion tokens/month" },
    {
      ym: "2026-05",
      t: 3200,
      disclosed: true,
      note: "Google I/O 2026: 3.2 quadrillion/month all surfaces; 19B API tokens/min",
    },
    {
      ym: "2026-06",
      t: 3520,
      disclosed: true,
      note: "Q2 2026 earnings: 22B API tokens/min, Gemini app 950M MAU",
    },
  ],
  anthropic: [
    { ym: "2023-03", t: 0.01, note: "Claude 1 limited release" },
    { ym: "2024-06", t: 12 },
    { ym: "2025-06", t: 98 },
    { ym: "2026-06", t: 490, note: "~$19B ARR ÷ blended effective $/MTok" },
  ],
  microsoft: [
    { ym: "2023-02", t: 0.02, note: "Bing Chat launch" },
    { ym: "2024-06", t: 14 },
    {
      ym: "2025-03",
      t: 33,
      disclosed: true,
      note: "Azure AI Foundry: 100T+ tokens processed in the quarter",
    },
    { ym: "2026-06", t: 540, note: "Azure AI Foundry + M365 Copilot seats" },
  ],
  meta: [
    { ym: "2023-07", t: 0.05, note: "Llama 2 release" },
    { ym: "2024-06", t: 8 },
    { ym: "2025-06", t: 62 },
    { ym: "2026-06", t: 265, note: "Meta AI across WhatsApp/IG + internal fleet" },
  ],
  "amazon-bedrock": [
    { ym: "2023-09", t: 0.03, note: "Bedrock general availability" },
    { ym: "2024-06", t: 6 },
    { ym: "2025-06", t: 58 },
    { ym: "2026-06", t: 310 },
  ],
  xai: [
    { ym: "2023-11", t: 0.02, note: "Grok launch" },
    { ym: "2024-06", t: 1.2 },
    { ym: "2025-06", t: 24, note: "Colossus cluster ramp" },
    { ym: "2026-06", t: 155 },
  ],

  // ByteDance has disclosed a daily-token figure at nearly every Volcano Engine
  // FORCE conference since Dec 2024 — the fullest public series of any provider.
  bytedance: [
    { ym: "2024-05", t: 3.6, disclosed: true, note: "Doubao launch: 120B tokens/day" },
    { ym: "2024-07", t: 15, disclosed: true, note: "500B tokens/day" },
    { ym: "2024-12", t: 120, disclosed: true, note: "FORCE Winter 2024: 4T tokens/day, 33x since May" },
    { ym: "2025-03", t: 381, disclosed: true, note: "12.7T tokens/day, 106x YoY" },
    { ym: "2025-05", t: 492, disclosed: true, note: "FORCE Jun 2025: 16.4T tokens/day" },
    { ym: "2025-09", t: 900, disclosed: true, note: "30T+ tokens/day, 253x over 17 months" },
    { ym: "2025-12", t: 1500, disclosed: true, note: "FORCE Winter 2025: 50T+ tokens/day" },
    { ym: "2026-03", t: 3600, disclosed: true, note: "120T tokens/day, 1,000x vs launch" },
    {
      ym: "2026-06",
      t: 5400,
      disclosed: true,
      note: "FORCE Jun 2026: 180T tokens/day — company-wide meter incl. Douyin, Doubao app, Jimeng",
    },
  ],
  // Alibaba has never published a Qwen daily-token figure. Derived from Frost &
  // Sullivan enterprise share, IDC public-cloud share, and Bailian growth multiples.
  alibaba: [
    { ym: "2023-04", t: 0.05, note: "Tongyi Qianwen launch" },
    { ym: "2023-12", t: 2 },
    { ym: "2024-06", t: 8 },
    { ym: "2024-12", t: 45 },
    { ym: "2025-06", t: 180, note: "F&S: 17.7% of China's 10.2T/day enterprise calls in H1" },
    { ym: "2025-12", t: 450, note: "F&S: 32.1% of 37T/day enterprise calls, ranked #1" },
    { ym: "2026-03", t: 1200, note: "Bailian platform >10x from Dec 2025 to May 2026" },
    { ym: "2026-06", t: 2100, note: "Qwen 3.6 Plus; Qwen app 167M MAU (+5,793% YoY)" },
  ],
  // Non-monotonic by design: R1 spike, a genuine 2025 decline, then V4 re-acceleration.
  deepseek: [
    { ym: "2023-12", t: 0.3 },
    { ym: "2024-05", t: 1.2, note: "V2 launch — opened China's price war" },
    { ym: "2024-12", t: 12, note: "V3 release" },
    { ym: "2025-02", t: 95, note: "R1 peak: 194M MAU, #1 in China, API top-ups suspended" },
    { ym: "2025-06", t: 60, note: "Post-spike decline as curious users churned" },
    { ym: "2025-12", t: 90 },
    { ym: "2026-03", t: 200 },
    {
      ym: "2026-06",
      t: 330,
      note: "V4 Pro/Flash (24 Apr 2026) → #1 on OpenRouter by mid-May, ~8x Apr–Jul",
    },
  ],
  tencent: [
    { ym: "2023-09", t: 0.03, note: "Hunyuan launch" },
    { ym: "2023-12", t: 1 },
    { ym: "2024-06", t: 5 },
    { ym: "2024-12", t: 15 },
    { ym: "2025-06", t: 40 },
    { ym: "2025-12", t: 120 },
    { ym: "2026-03", t: 300, note: "Hy3 preview tops OpenRouter from 28 Apr" },
    {
      ym: "2026-06",
      t: 700,
      disclosed: true,
      note: "Tencent Cloud TokenHub: >5T tokens/day external; Hunyuan 3 usage 10x Hunyuan 2",
    },
  ],
  baidu: [
    { ym: "2023-03", t: 0.04, note: "ERNIE Bot launch" },
    { ym: "2023-12", t: 5 },
    { ym: "2024-06", t: 20, note: "600M+ API calls/day disclosed" },
    { ym: "2024-12", t: 45 },
    { ym: "2025-06", t: 100 },
    { ym: "2025-12", t: 230 },
    { ym: "2026-06", t: 600, note: "Qianfan external daily tokens ~7x YoY (Q1 2026 call)" },
  ],
  moonshot: [
    { ym: "2023-10", t: 0.02, note: "Kimi launch" },
    { ym: "2023-12", t: 0.5 },
    { ym: "2024-06", t: 3 },
    { ym: "2024-12", t: 8 },
    { ym: "2025-06", t: 15 },
    { ym: "2025-12", t: 45 },
    { ym: "2026-03", t: 160, note: "OpenClaw makes Kimi K2.5 its default model (Feb 2026)" },
    { ym: "2026-06", t: 300, note: "ARR >$300M, API >70% of revenue" },
  ],
  // The only long-run first-party series besides ByteDance, from the HK IPO prospectus.
  zhipu: [
    { ym: "2022-11", t: 0.015, disclosed: true, note: "HK IPO prospectus: 500M tokens/day in 2022" },
    { ym: "2023-12", t: 1 },
    { ym: "2024-06", t: 6 },
    { ym: "2024-12", t: 30 },
    { ym: "2025-06", t: 138, disclosed: true, note: "HK IPO prospectus: 4.6T tokens/day in H1 2025" },
    { ym: "2025-12", t: 300 },
    { ym: "2026-06", t: 950, note: "MaaS ARR RMB 1.7bn; API prices raised 83%, still supply-constrained" },
  ],
  minimax: [
    { ym: "2023-11", t: 0.02 },
    { ym: "2023-12", t: 0.5 },
    { ym: "2024-06", t: 3 },
    { ym: "2024-12", t: 8 },
    { ym: "2025-06", t: 20 },
    { ym: "2025-12", t: 40, disclosed: true, note: "HKEX prospectus: open platform >1T tokens/day" },
    { ym: "2026-03", t: 150, note: "M2.5 launch 13 Feb 2026" },
    { ym: "2026-06", t: 240, note: "M3 launch; HK IPO doubled on day one" },
  ],
  xiaomi: [
    { ym: "2025-09", t: 0.4, note: "MiMo early releases" },
    { ym: "2025-12", t: 5 },
    { ym: "2026-03", t: 200 },
    {
      ym: "2026-06",
      t: 700,
      note: "MiMo-V2.5 hits #1–2 on OpenRouter after up-to-99% price cut, 27 May 2026",
    },
  ],
  iflytek: [
    { ym: "2023-05", t: 0.02, note: "Spark launch" },
    { ym: "2023-12", t: 2 },
    { ym: "2024-06", t: 6 },
    { ym: "2024-12", t: 12 },
    { ym: "2025-06", t: 25 },
    { ym: "2025-12", t: 50 },
    { ym: "2026-06", t: 120, note: "No token-volume disclosure found — revenue-derived" },
  ],

  mistral: [
    { ym: "2023-09", t: 0.02, note: "Mistral 7B release" },
    { ym: "2023-12", t: 0.5 },
    { ym: "2024-06", t: 3 },
    { ym: "2024-12", t: 8 },
    { ym: "2025-06", t: 18 },
    { ym: "2025-12", t: 35 },
    { ym: "2026-06", t: 70, note: "~$400M ARR; Le Chat ~5M MAU — inferred from revenue, not disclosed" },
  ],
  cohere: [
    { ym: "2023-05", t: 0.02 },
    { ym: "2023-12", t: 0.5 },
    { ym: "2024-06", t: 1.5 },
    { ym: "2024-12", t: 3 },
    { ym: "2025-06", t: 5 },
    { ym: "2025-12", t: 8 },
    { ym: "2026-06", t: 13, note: "~$240M ARR — inferred from revenue, not disclosed" },
  ],
};

/** Default attribution shown on estimated rows. */
const BRAND_SOURCE: Record<AiBrandId, string> = {
  openai: "API tokens/min disclosures (DevDay, WSJ) + ChatGPT MAU × session tokens",
  google: "Pichai I/O keynotes and Alphabet earnings calls (all surfaces)",
  anthropic: "API revenue run-rate ÷ blended $/MTok (Menlo Ventures, company disclosures)",
  microsoft: "Azure AI Foundry quarterly token disclosures + M365 Copilot seat estimates",
  meta: "Meta AI MAU × session tokens + Llama internal inference fleet",
  "amazon-bedrock": "AWS AI revenue share × Bedrock throughput proxy (re:Invent)",
  xai: "Colossus GPU capacity × utilisation (xAI disclosures)",
  bytedance: "Volcano Engine / Tan Dai disclosures at FORCE conferences (tokens/day)",
  alibaba: "Alibaba Cloud Bailian disclosures + Frost & Sullivan China GenAI share study",
  deepseek: "OpenRouter routed volume + Frost & Sullivan enterprise share + own API",
  tencent: "OpenRouter routed volume + Yuanbao/WeChat integration estimates",
  baidu: "Baidu earnings call API call disclosures × tokens per call",
  moonshot: "OpenRouter routed volume + Kimi app MAU (QuestMobile)",
  zhipu: "OpenRouter routed volume + Zhipu STAR Market filings",
  minimax: "OpenRouter routed volume + MiniMax HK IPO prospectus",
  xiaomi: "OpenRouter routed volume + Xiaomi MiMo pricing disclosures",
  iflytek: "Revenue-derived — iFlytek publishes no token-volume figure",
  mistral: "Revenue-derived (~$400M ARR) + Le Chat MAU — no disclosure exists",
  cohere: "Revenue-derived (~$240M ARR) — no disclosure exists",
};

const MONTH_LABELS = [
  "2022-11", "2022-12",
  "2023-01", "2023-02", "2023-03", "2023-04", "2023-05", "2023-06",
  "2023-07", "2023-08", "2023-09", "2023-10", "2023-11", "2023-12",
  "2024-01", "2024-02", "2024-03", "2024-04", "2024-05", "2024-06",
  "2024-07", "2024-08", "2024-09", "2024-10", "2024-11", "2024-12",
  "2025-01", "2025-02", "2025-03", "2025-04", "2025-05", "2025-06",
  "2025-07", "2025-08", "2025-09", "2025-10", "2025-11", "2025-12",
  "2026-01", "2026-02", "2026-03", "2026-04", "2026-05", "2026-06",
];

const MONTH_INDEX = new Map(MONTH_LABELS.map((ym, i) => [ym, i]));

function pctChange(curr: number, prev: number): number | null {
  if (prev === 0) return curr > 0 ? null : 0;
  return ((curr - prev) / prev) * 100;
}

function parseYearMonth(ym: string): { year: number; month: number } {
  const [y, m] = ym.split("-").map(Number);
  return { year: y, month: m };
}

function round(n: number): number {
  if (n >= 100) return Math.round(n);
  if (n >= 1) return Math.round(n * 10) / 10;
  return Math.round(n * 1000) / 1000;
}

/**
 * Expand anchors into a full monthly series using geometric interpolation.
 * Growth in this regime is multiplicative, so linear interpolation would
 * badly understate mid-period values between distant anchors.
 */
function expandSeries(anchors: Anchor[]): number[] {
  const points = anchors
    .map((a) => ({ ...a, i: MONTH_INDEX.get(a.ym)! }))
    .sort((a, b) => a.i - b.i);

  const series = new Array<number>(MONTH_LABELS.length).fill(0);

  for (let s = 0; s < points.length - 1; s++) {
    const from = points[s];
    const to = points[s + 1];
    const span = to.i - from.i;
    const ratio = Math.pow(to.t / from.t, 1 / span);
    for (let k = 0; k <= span; k++) {
      series[from.i + k] = from.t * Math.pow(ratio, k);
    }
  }

  const first = points[0];
  const last = points[points.length - 1];

  if (points.length >= 2) {
    const headSpan = points[1].i - first.i;
    const headRatio = Math.pow(points[1].t / first.t, 1 / headSpan);
    for (let i = first.i - 1; i >= 0; i--) {
      series[i] = series[i + 1] / headRatio;
    }
    const tailPrev = points[points.length - 2];
    const tailSpan = last.i - tailPrev.i;
    const tailRatio = Math.pow(last.t / tailPrev.t, 1 / tailSpan);
    for (let i = last.i + 1; i < MONTH_LABELS.length; i++) {
      series[i] = series[i - 1] * tailRatio;
    }
  } else {
    series.fill(first.t);
  }

  // Pre-launch months read as zero rather than a vanishing fraction.
  for (let i = 0; i < first.i; i++) {
    if (series[i] < first.t / 64) series[i] = 0;
  }

  return series.map(round);
}

function buildRecords(): TokenMonthlyRecord[] {
  const records: TokenMonthlyRecord[] = [];
  const brandIds = Object.keys(ANCHORS) as AiBrandId[];

  for (const brandId of brandIds) {
    const anchors = ANCHORS[brandId];
    const series = expandSeries(anchors);
    const disclosedByMonth = new Map(
      anchors.filter((a) => a.disclosed).map((a) => [a.ym, a]),
    );
    const noteByMonth = new Map(
      anchors.filter((a) => a.note).map((a) => [a.ym, a.note!]),
    );

    for (let i = 0; i < MONTH_LABELS.length; i++) {
      const yearMonth = MONTH_LABELS[i];
      const { year, month } = parseYearMonth(yearMonth);
      const tokensTrillions = series[i];
      const prev = i > 0 ? series[i - 1] : null;
      const yoyPrev = i >= 12 ? series[i - 12] : null;
      const disclosed = disclosedByMonth.get(yearMonth);

      records.push({
        id: `${brandId}-${yearMonth}`,
        brandId,
        brand: BRAND_LABELS[brandId],
        origin: BRAND_ORIGIN[brandId],
        year,
        month,
        yearMonth,
        tokensTrillions,
        unit: "T tokens/mo",
        sourceType: disclosed ? "disclosed" : "estimated",
        source: disclosed ? disclosed.note ?? BRAND_SOURCE[brandId] : BRAND_SOURCE[brandId],
        notes: noteByMonth.get(yearMonth),
        momPct: prev !== null ? pctChange(tokensTrillions, prev) : null,
        yoyPct: yoyPrev !== null ? pctChange(tokensTrillions, yoyPrev) : null,
      });
    }
  }

  return records;
}

export const TOKEN_MONTHLY: TokenMonthlyRecord[] = buildRecords();

export const BRAND_IDS = Object.keys(BRAND_LABELS) as AiBrandId[];

export const MONTHS = MONTH_LABELS;

/** June 2026 slice — latest full month */
export const JUNE_2026_SLICE = TOKEN_MONTHLY.filter((r) => r.yearMonth === "2026-06");

export const JUNE_2026_TOTAL_T = JUNE_2026_SLICE.reduce(
  (sum, r) => sum + r.tokensTrillions,
  0,
);

export function totalByMonth(yearMonth: string): number {
  return TOKEN_MONTHLY.filter((r) => r.yearMonth === yearMonth).reduce(
    (s, r) => s + r.tokensTrillions,
    0,
  );
}

export function totalByOriginMonth(origin: Origin, yearMonth: string): number {
  return TOKEN_MONTHLY.filter(
    (r) => r.origin === origin && r.yearMonth === yearMonth,
  ).reduce((s, r) => s + r.tokensTrillions, 0);
}

/** Aggregate token volume by origin for every tracked month. */
export const ORIGIN_TREND = MONTH_LABELS.map((ym) => {
  const row: { yearMonth: string; total: number } & Record<string, number | string> = {
    yearMonth: ym,
    total: totalByMonth(ym),
  };
  for (const origin of ORIGINS) {
    row[origin] = totalByOriginMonth(origin, ym);
  }
  return row;
});

const chinaLeads = (r: (typeof ORIGIN_TREND)[number]) =>
  Number(r["China"]) > Number(r["United States"]) && Number(r["China"]) > 0;

/**
 * First month China led at all — a transient spike driven by DeepSeek R1 in
 * early 2025, after which US providers regained the lead.
 */
export const CHINA_FIRST_LEAD_MONTH = ORIGIN_TREND.find(chinaLeads)?.yearMonth ?? null;

/** First month from which China leads in every remaining month — the durable crossover. */
export const CHINA_CROSSOVER_MONTH = (() => {
  for (let i = 0; i < ORIGIN_TREND.length; i++) {
    if (ORIGIN_TREND.slice(i).every(chinaLeads)) return ORIGIN_TREND[i].yearMonth;
  }
  return null;
})();

/**
 * Official China-wide daily token call volume.
 * Source: National Data Administration (Liu Liehong) / CAICT press statements.
 */
export const CHINA_NATIONAL_DAILY: {
  yearMonth: string;
  tokensTrillionsPerDay: number;
  source: string;
}[] = [
  { yearMonth: "2024-01", tokensTrillionsPerDay: 0.1, source: "National Data Administration" },
  { yearMonth: "2025-06", tokensTrillionsPerDay: 30, source: "State Council press conference" },
  { yearMonth: "2025-12", tokensTrillionsPerDay: 100, source: "National Data Administration" },
  { yearMonth: "2026-03", tokensTrillionsPerDay: 140, source: "Liu Liehong, Mar 2026 briefing" },
];

/**
 * OpenRouter routed-volume split by model origin. OpenRouter measures
 * third-party API demand only — it excludes first-party apps (ChatGPT,
 * Gemini app, Doubao app) and direct vendor APIs.
 */
/**
 * Share of ALL routed models, not the top-10 subset. Widely quoted "61%"
 * figures are single-week, top-10-only and are not comparable across time.
 */
export const OPENROUTER_SPLIT: {
  label: string;
  chinaPct: number;
  usPct: number;
  note: string;
}[] = [
  { label: "Dec 2024", chinaPct: 1.8, usPct: 82, note: "Chinese models a rounding error" },
  { label: "Jun 2025", chinaPct: 11, usPct: 74, note: "Qwen + DeepSeek open-weight ramp" },
  { label: "Dec 2025", chinaPct: 30, usPct: 55, note: "Coding passes 50% of all routed tokens" },
  { label: "Feb 2026", chinaPct: 42, usPct: 40, note: "Crossover week: 4.12T vs 2.94T" },
  { label: "Apr 2026", chinaPct: 44, usPct: 38, note: "DeepSeek V4 family launch, 24 Apr" },
  { label: "Jun 2026", chinaPct: 46.4, usPct: 35.7, note: "Anthropic alone 14.8%; Llama below 1%" },
  { label: "Jul 2026", chinaPct: 48, usPct: 34, note: "All five most-used models Chinese" },
];

/** OpenRouter's user base is overwhelmingly non-Chinese, which is what makes it a neutral meter. */
export const OPENROUTER_AUDIENCE = {
  usDevelopersPct: 47.17,
  chineseDevelopersPct: 6.01,
  totalDevelopers: "5M+",
};

/** Top models by routed volume on OpenRouter, trailing month to late Jul 2026. */
export const OPENROUTER_TOP_MODELS: {
  model: string;
  lab: string;
  origin: Origin;
  tokensT: number;
}[] = [
  { model: "hy3", lab: "Tencent", origin: "China", tokensT: 10.9 },
  { model: "mimo-v2.5", lab: "Xiaomi", origin: "China", tokensT: 9.43 },
  { model: "deepseek-v4-flash", lab: "DeepSeek", origin: "China", tokensT: 5.37 },
  { model: "glm-5.2", lab: "Z.ai", origin: "China", tokensT: 3.63 },
  { model: "minimax-m3", lab: "MiniMax", origin: "China", tokensT: 3.23 },
  { model: "deepseek-v4-pro", lab: "DeepSeek", origin: "China", tokensT: 2.8 },
  { model: "nemotron-3-ultra", lab: "NVIDIA", origin: "United States", tokensT: 2.71 },
  { model: "claude-4.7-opus", lab: "Anthropic", origin: "United States", tokensT: 1.93 },
  { model: "claude-4.8-opus", lab: "Anthropic", origin: "United States", tokensT: 1.91 },
  { model: "claude-sonnet-5", lab: "Anthropic", origin: "United States", tokensT: 1.13 },
];

/** Published list prices per million tokens, USD, June 2026. */
export const PRICE_PER_MTOK: {
  model: string;
  lab: string;
  origin: Origin;
  usdPerMTokIn: number;
  usdPerMTokOut: number | null;
}[] = [
  { model: "GPT-5.5", lab: "OpenAI", origin: "United States", usdPerMTokIn: 5.0, usdPerMTokOut: null },
  { model: "Qwen3.7-Max", lab: "Alibaba", origin: "China", usdPerMTokIn: 2.5, usdPerMTokOut: 7.5 },
  { model: "Kimi K2.6", lab: "Moonshot", origin: "China", usdPerMTokIn: 0.9, usdPerMTokOut: 3.75 },
  { model: "Mistral Large 3", lab: "Mistral", origin: "Europe", usdPerMTokIn: 0.5, usdPerMTokOut: 1.5 },
  { model: "DeepSeek V4 Pro", lab: "DeepSeek", origin: "China", usdPerMTokIn: 0.435, usdPerMTokOut: 0.87 },
  { model: "MiMo-V2.5-Pro", lab: "Xiaomi", origin: "China", usdPerMTokIn: 0.435, usdPerMTokOut: 0.87 },
  { model: "Tencent Hy3", lab: "Tencent", origin: "China", usdPerMTokIn: 0.14, usdPerMTokOut: 0.56 },
  { model: "DeepSeek V4 Flash", lab: "DeepSeek", origin: "China", usdPerMTokIn: 0.14, usdPerMTokOut: 0.28 },
  { model: "MiMo-V2.5", lab: "Xiaomi", origin: "China", usdPerMTokIn: 0.14, usdPerMTokOut: 0.28 },
];

/**
 * The 2024–25 Chinese price war has reversed. Supply, not demand, is now the
 * binding constraint — the least-reported finding in the dataset.
 */
export const PRICE_REVERSALS: { lab: string; change: string; detail: string }[] = [
  {
    lab: "Zhipu / Z.ai",
    change: "+83%",
    detail: "Cumulative API price rise through Q1 2026, and still supply-constrained",
  },
  {
    lab: "Alibaba Cloud",
    change: "up to +34%",
    detail: "AI compute and storage prices raised Mar 2026; guided to further token price rises",
  },
  {
    lab: "Moonshot",
    change: "premium launch",
    detail: "Kimi K3 shipped Jul 2026 at ¥20/¥100 per MTok rather than undercutting",
  },
  {
    lab: "DeepSeek",
    change: "cuts paused",
    detail: "Further V4 Pro price cuts made conditional on Huawei Ascend 950 supply in H2 2026",
  },
];

/**
 * IDC public-cloud MaaS — external customers only, explicitly excluding
 * first-party calls from Douyin, the Doubao app and Jimeng. This is the
 * additive, commercially-real counterpart to vendor headline claims.
 */
export const IDC_EXTERNAL_MAAS: {
  label: string;
  tokensTrillionsPerYear: number;
  forecast?: boolean;
}[] = [
  { label: "2024", tokensTrillionsPerYear: 114.2 },
  { label: "2025", tokensTrillionsPerYear: 1944 },
  { label: "2026F", tokensTrillionsPerYear: 40000, forecast: true },
];

/** China's entire public-cloud MaaS revenue pool, against IDC's 2025 token volume. */
export const CHINA_MAAS_ECONOMICS = {
  year: 2025,
  revenueRmbBn: 3.07,
  revenueUsdM: 430,
  tokensTrillions: 1944,
  blendedUsdPerMTok: 0.22,
};

/** QuestMobile monthly active users for China's AI-native apps. */
export const CHINA_APP_MAU: {
  app: string;
  lab: string;
  feb2025M: number | null;
  jun2026M: number;
  yoyPct: number | null;
}[] = [
  { app: "Doubao", lab: "ByteDance", feb2025M: 116, jun2026M: 382, yoyPct: 172.1 },
  { app: "Qwen", lab: "Alibaba", feb2025M: null, jun2026M: 167, yoyPct: 5792.9 },
  { app: "DeepSeek", lab: "DeepSeek", feb2025M: 194, jun2026M: 130, yoyPct: -20.3 },
  { app: "Yuanbao", lab: "Tencent", feb2025M: 41.6, jun2026M: 49.8, yoyPct: null },
  { app: "Ant Afu", lab: "Ant Group", feb2025M: null, jun2026M: 29.0, yoyPct: null },
  { app: "Kimi", lab: "Moonshot", feb2025M: null, jun2026M: 7.45, yoyPct: -47 },
];

export const METHOD_NOTES = [
  "Vendor headline figures are company-wide inference meters. Volcano Engine's president confirmed the 180T/day Doubao number includes internal ByteDance traffic and the Doubao app; Google's 3.2 quadrillion likewise spans Search, YouTube and Workspace. Only these two providers publish on a comparable all-surfaces basis.",
  "Doubao's headline exceeding Google's should not be read as a clean result. ByteDance credits AI video generation for much of the growth, and video tokenises into very large counts. Cache-hit input, offline batch inference and recommendation-system calls may also be included. ByteDance has not published its counting rules.",
  "Dividing Chinese headline figures by roughly 5–10 approximates commercially-served volume. IDC's external-only public-cloud data implies Volcano Engine's paid external volume averaged about 2.6T/day in 2025 against headline claims of 12.7–50T/day.",
  "Summing providers overshoots China's official national figure by around 64%, because open-weight models are re-served by third-party clouds and get counted twice. Never treat the provider stack as a national total.",
  "Chinese-language workloads inflate token counts by only about 8–12% on Chinese-native tokenizers for identical meaning (+7.8% DeepSeek-V2, +8.7% GLM-4, +12.3% Qwen 2.5). Real, but it explains almost none of the China–West volume gap.",
  "IDC and Frost & Sullivan rank different leaders and both are correct: IDC covers external public cloud only and puts Volcano Engine first at 49.5%; Frost & Sullivan includes private and on-premises deployment and puts Qwen first at 32.1%. The two share tables must never be mixed.",
  "OpenRouter is the best neutral meter but is not the world. Its roughly 20T tokens/week is a small slice of global inference — Google alone runs about 27T/day through its APIs — and it over-represents price-sensitive agentic coding traffic.",
  "\"Tokens processed\" is not a stable unit over time. Reasoning models emit far more tokens per answer than 2023-era chat, agentic requests use roughly 15x more tokens than human chat, and cache-hit accounting has changed. Part of the 1,000x growth is redefinition of the unit rather than growth in usage.",
];

/** The macro inflection that reshaped token demand more than any single model launch. */
export const AGENT_INFLECTION = {
  month: "2026-02",
  label: "OpenClaw",
  detail:
    "Open-source autonomous agent framework; a single session can exceed 200,000 tokens. Coding rose from 11% of OpenRouter tokens in early 2025 to over 50% by end-2025.",
};

export const GLOBAL_SUMMARY = {
  monthEnd: "2026-06",
  totalTokensTrillionsJun2026: JUNE_2026_TOTAL_T,
  chinaTokensJun2026: totalByOriginMonth("China", "2026-06"),
  usTokensJun2026: totalByOriginMonth("United States", "2026-06"),
  chinaSharePctJun2026: (totalByOriginMonth("China", "2026-06") / JUNE_2026_TOTAL_T) * 100,
  usSharePctJun2026:
    (totalByOriginMonth("United States", "2026-06") / JUNE_2026_TOTAL_T) * 100,
  topBrandJun2026: [...JUNE_2026_SLICE].sort(
    (a, b) => b.tokensTrillions - a.tokensTrillions,
  )[0],
  openaiSharePctJun2026:
    (JUNE_2026_SLICE.find((r) => r.brandId === "openai")!.tokensTrillions /
      JUNE_2026_TOTAL_T) *
    100,
  googleSharePctJun2026:
    (JUNE_2026_SLICE.find((r) => r.brandId === "google")!.tokensTrillions /
      JUNE_2026_TOTAL_T) *
    100,
  bytedanceSharePctJun2026:
    (JUNE_2026_SLICE.find((r) => r.brandId === "bytedance")!.tokensTrillions /
      JUNE_2026_TOTAL_T) *
    100,
  yoyTotalGrowthPctJun2026: pctChange(JUNE_2026_TOTAL_T, totalByMonth("2025-06"))!,
  momTotalGrowthPctJun2026: pctChange(JUNE_2026_TOTAL_T, totalByMonth("2026-05"))!,
  recordCount: TOKEN_MONTHLY.length,
  brandCount: BRAND_IDS.length,
  chinaBrandCount: BRAND_IDS.filter((id) => BRAND_ORIGIN[id] === "China").length,
  usBrandCount: BRAND_IDS.filter((id) => BRAND_ORIGIN[id] === "United States").length,
  disclosedRowCount: TOKEN_MONTHLY.filter((r) => r.sourceType === "disclosed").length,
  estimatedRowCount: TOKEN_MONTHLY.filter((r) => r.sourceType === "estimated").length,
  crossoverMonth: CHINA_CROSSOVER_MONTH,
  firstLeadMonth: CHINA_FIRST_LEAD_MONTH,
} as const;

export function recordsByBrand(brandId: AiBrandId): TokenMonthlyRecord[] {
  return TOKEN_MONTHLY.filter((r) => r.brandId === brandId);
}

export function recordsByMonth(yearMonth: string): TokenMonthlyRecord[] {
  return TOKEN_MONTHLY.filter((r) => r.yearMonth === yearMonth);
}

export function fmtTokensT(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(2)}Q`;
  if (n >= 1) return `${n.toFixed(1)}T`;
  if (n >= 0.001) return `${(n * 1000).toFixed(0)}B`;
  return `${(n * 1_000_000).toFixed(0)}M`;
}

/** Signed formatter — use for changes (MoM, YoY). */
export function fmtPct(n: number | null, digits = 1): string {
  if (n === null) return "—";
  const sign = n >= 0 ? "+" : "";
  return `${sign}${n.toFixed(digits)}%`;
}

/** Unsigned formatter — use for shares of a total. */
export function fmtShare(n: number | null, digits = 1): string {
  if (n === null) return "—";
  return `${n.toFixed(digits)}%`;
}

export const STATS = {
  recordCount: GLOBAL_SUMMARY.recordCount,
  brandCount: GLOBAL_SUMMARY.brandCount,
  monthRange: `${DATA_MONTH_START} – ${DATA_MONTH_END}`,
  totalJun2026Label: fmtTokensT(GLOBAL_SUMMARY.totalTokensTrillionsJun2026),
  yoyJun2026Label: fmtPct(GLOBAL_SUMMARY.yoyTotalGrowthPctJun2026),
  momJun2026Label: fmtPct(GLOBAL_SUMMARY.momTotalGrowthPctJun2026),
  chinaShareLabel: fmtShare(GLOBAL_SUMMARY.chinaSharePctJun2026),
  usShareLabel: fmtShare(GLOBAL_SUMMARY.usSharePctJun2026),
};
