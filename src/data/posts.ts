import type { Post } from "@/types/post";

export const samplePosts: Post[] = [
  {
    id: "ai-capex-intensity-research-2026",
    slug: "ai-capex-intensity-research-2026",
    title: "Charted: Meta Reinvests 35% of Revenue — Is Hyperscaler Capex Intensity Sustainable?",
    excerpt:
      "Five hyperscalers now push 18–37% of revenue into capex. Map the ratios against free-cash-flow coverage, telecom history, and foundry extremes — and ask what fraction of sales can stay in the build-out.",
    content: `## The question that dollar totals skip

Headline AI infrastructure numbers — Goldman’s [Tracking Trillions](/blog/goldman-sachs-ai-capex-chips-data-centers-2027-2028) scenarios, campus megawatts, GPU backlogs — answer *how much* capital is flowing. They do not answer the sharper capital-markets question: **what fraction of each dollar of revenue is being plowed back into property, plant, and equipment**, and can that reinvestment rate persist without crushing free cash flow?

Capex intensity — gross purchases of PP&E divided by total revenue — is the cleanest public proxy. It is unitless, comparable across fiscal calendars, and brutal when it spikes. The interactive dashboard above tracks five public builders (Microsoft, Amazon, Alphabet, Meta, Oracle) from FY20 through FY25, overlays free-cash-flow margins, and places the ratios against wireline telecom, energy, SaaS, and leading-edge foundry benchmarks.

## What the FY25 ratios actually say

| Company | FY25 capex / revenue | Capex ($B) | Revenue ($B) | FCF margin |
|---------|---------------------:|-----------:|-------------:|-----------:|
| Oracle | **37.0%** | 21.2 | 57.4 | 8.9% |
| Meta | **34.7%** | 69.7 | 201.0 | 18.2% |
| Microsoft | **22.9%** | 64.6 | 281.7 | 25.4% |
| Alphabet | **22.7%** | 91.4 | 403.0 | 14.8% |
| Amazon | **18.4%** | 131.8 | 716.9 | 3.1% |

Oracle and Meta sit inside the **dot-com telecom peak band** (~30–40%) that carriers briefly sustained around 2000. Microsoft and Alphabet have roughly **doubled** their mid-decade teens intensities. Amazon’s percentage looks “moderate” only because retail revenue is enormous — absolute FY25 capex still leads the set at **$132B**.

Revenue-weighted across the big four (ex-Oracle), intensity lands near **22%** — roughly double the pre-AI hyperscale cloud norm (~11%) and aligned with the long-run **wireline telecom** capital intensity that FCC ARMIS large-ILEC data put around **20%** before the late-1990s surge.

## Intensity is not the same as dollars

Dollar capex and intensity can diverge. Amazon’s FY23 intensity **fell** to 9.2% even while absolute spending stayed above $50B, because revenue growth outran the build. Meta’s FY22 spike to **27.9%** came with a compressed FCF margin; the FY23–24 “Year of Efficiency” pulled intensity back before the FY25 AI surge pushed it to a new high.

Toggle companies in the chart to see the stack of absolute dollars: the same fiscal years that look like a smooth intensity climb for Microsoft become a **step-change** in cash leaving the firm once Amazon and Alphabet accelerate. For site-level context on where those dollars land physically, see the [global AI data center build tracker](/blog/global-ai-data-center-build-tracker).

## Free cash flow is the sustainability hinge

A firm can run high intensity indefinitely if operating cash flow still covers capex with room for buybacks, dividends, and debt service. The scatter panel pairs **intensity (x)** with **FCF margin (y)** for the selected fiscal year.

- **Microsoft** remains the textbook “high intensity, still cash-rich” case: FY25 intensity 22.9% with FCF margin still above **25%**.
- **Meta** funds a 35% intensity ratio while keeping FCF near **18%** — uncomfortable versus its own history, survivable versus most industrials.
- **Alphabet**’s FCF margin compressed from the mid-20s toward **~15%** as intensity crossed 20%.
- **Amazon** is the fragile edge: intensity 18% with FCF margin only **~3%**, leaving little buffer if AWS monetization lags GPU depreciation.
- **Oracle**’s estimated FY25 jump to 37% coincides with FCF margin falling into single digits — the classic “build now, harvest later” posture of a capacity land-grab.

Sustainability, then, is not a single threshold. It is whether **cash conversion survives the reinvestment rate** long enough for utilization and pricing to catch the depreciation wave.

## Historical bands that still matter

Three reference bands help investors read the time series without treating every spike as a bubble:

1. **Historical cloud range (0–15%)** — the 2015–19 hyperscale pattern when capacity followed contracted cloud demand.
2. **Elevated reinvestment (15–25%)** — where Microsoft, Alphabet, and Amazon now cluster; comparable to integrated energy peers (~16%) and below classic telecom norms.
3. **Telecom / foundry territory (25%+)** — Meta and Oracle today; overlapping the 1999–2000 carrier peak mid (~35%) and approaching leading-edge foundry cycles (~45%) that TSMC-class manufacturers run when node transitions dominate.

The ranked bar chart marks the **20% telecom norm** and the **35% dot-com mid**. Crossing into the third band does not prove a bubble — foundries live there for years — but it does mean the equity story must look more like **industrial capacity** than **asset-light software**.

## Why the comparison to 2000 is imperfect — and still useful

Dot-com carriers levered balance sheets to lay dark fiber ahead of demand that never arrived on schedule. Today’s hyperscalers fund most AI capex from **operating cash flow**, not speculative project finance, and they sit on demand queues for compute that carriers never enjoyed. That is the bull case for sustainability.

The bear case is timing: GPU useful lives are short, power and packaging bottlenecks (see [AI GPU packaging and memory constraints](/blog/ai-gpu-packaging-memory-bottleneck-2025)) can idle expensive halls, and advertising or cloud pricing may not rise fast enough to amortize the wave. Intensity can stay “affordable” on an FCF basis for two years and still destroy equity value if returns on invested capital disappoint. Equity analysts who stop at “they can afford it” miss the harder test: whether incremental ROIC on AI PP&E clears the cost of capital after utilization, power, and model-price compression.

Use the sector benchmark panel to keep perspective: mature SaaS at ~4% intensity is not the peer set anymore. The relevant comps are **telecom infrastructure, energy upstream, and foundries** — businesses judged on utilization, not ARR multiples alone.

## Caveats and methodology

1. **Gross PP&E purchases ≠ AI-only spend.** Filings do not cleanly split AI accelerators from warehouses, offices, or network gear. Amazon’s ratio mixes retail fulfillment with AWS; treat company-level intensity as an upper-bound proxy for “AI intensity.”
2. **Fiscal calendars differ.** Microsoft ends in June, Oracle in May, the others in December. “FY25” is not a single calendar window — trajectory charts align labels, not months.
3. **Lease accounting and cloud capacity purchases** can shift economics off the PP&E line. Some GPU capacity is rented; some is on partner balance sheets. Intensity understates total compute committed where operating leases dominate.
4. **Oracle FY25** includes estimated elements where trailing guidance and partial-year disclosures were spliced; flag confidence in the data module.
5. **FCF margin** here is (operating cash flow − capex) ÷ revenue. Definitions that add back stock-based compensation or exclude working-capital swings will differ.

Primary sources: company Form 10-K / 10-Q cash-flow statements (purchases of property and equipment; cash from operations), FCC ARMIS / TIA historical telecom capital-intensity aggregates, and industry peer medians for energy and foundry benchmarks as labeled in the dashboard.

## What to watch next

Watch three coincident signals, not intensity alone: (1) **FCF margin** by company — especially Amazon and Oracle; (2) **revenue growth in AI-exposed segments** (Azure, AWS, Google Cloud, Meta ads + AI products) relative to depreciation step-ups; (3) **guidance language** that converts “multi-year build” into explicit intensity ceilings. If weighted intensity holds above 20% while FCF margins stabilize, the market will treat the AI build as a new steady state — a capital-markets regime shift from software to infrastructure. If intensity stays high and FCF keeps compressing, the sustainability debate stops being academic. Either path, the ratio — not the headline dollar — is the signal that forces the re-rating.`,
    category: "Finance",
    imageUrl: "/images/finance-ai-capex-intensity-research-2026-hero.png",
    imageAlt:
      "Hyperscaler capex intensity research 2026 — dark navy chart of Meta and peers reinvesting rising shares of revenue into AI infrastructure",
    publishedAt: "2026-07-31T11:00:00Z",
    featured: true,
    visualization: "ai-capex-intensity-research-2026",
    layout: "default",
  },
  {
    id: "ai-capex-spend-research-2026",
    slug: "ai-capex-spend-research-2026",
    title: "Charted: AI Capex Hits $760B in 2026 Guidance — and $1.4T in the Bull Case",
    excerpt:
      "Big-5 midpoints sum to ~$760B for 2026. Goldman’s Investment Research base puts 2027 hyperscaler spend at $1.14T (bull $1.4T), while its Global Institute all-in AI path and McKinsey’s $5.2T cumulative framework answer a different question.",
    content: `## The number everyone quotes is not one number

Ask how large AI infrastructure spending is and you will hear **$725 billion**, **$750 billion**, **$765 billion**, **$1.14 trillion**, **$1.4 trillion**, **$5.2 trillion**, and **$7.6 trillion** — often in the same briefing deck. Those figures are not disagreements about arithmetic. They are answers to **different questions**: which companies, which year, which layers of the stack, and whether the total is an **annual run-rate** or a **multi-year cumulative**.

The interactive dashboard above is a spend map across those scopes. Toggle **2026 / 2027 / 2028**, switch between **gross** hyperscaler capex and an **AI-attributed (~75%)** slice, and compare research-house fans against McKinsey’s cumulative scenarios. The point is not to pick a single “true” total. It is to keep the scopes honest so markets can debate substance instead of mixing labels.

## What company guidance actually says for 2026

After Q1 2026 earnings, the five largest cloud / AI infrastructure spenders disclosed or reaffirmed calendar-ish guidance that midpoints near:

| Company | 2026 guidance (mid / point) | Notes |
|---------|----------------------------|--------|
| **Amazon** | **$200B** | Reaffirmed; largest single program |
| **Microsoft** | **~$190B** CY | Raised; component pricing called out |
| **Alphabet** | **$185B** midpoint | Raised to $180–190B range |
| **Meta** | **$135B** midpoint | Raised to $125–145B; memory inflation cited |
| **Oracle** | **~$50B** | OCI / Stargate-linked build |

Sum those midpoints and you land near **$760B** of **gross company capital expenditure** for 2026 — not a pure “AI-only” ledger. CreditSights’ post-earnings aggregate (~**$750B**) sits in the same neighborhood. Apply the commonly used **~75% AI-attributed** factor and the AI-specific slice of that stack is roughly **$545–570B**.

That company stack is the cleanest near-term **observed** number markets have: it is grounded in guidance, not in a top-down silicon model. It is also incomplete. It excludes non-hyperscaler buyers, sovereign AI programs, much of the colocation / power ecosystem, and the full global compute + facility + generation stack that Goldman Sachs Global Institute models separately.

## Annual scenarios diverge hard by 2027

Where guidance ends, research scenarios take over — and the spread widens.

**Goldman Sachs Investment Research** (hyperscaler gross scope) has circulated a **2027 base near $1.14T** against **Street consensus near $920B**, with a **bull path around $1.4T** if cloud backlogs and token demand keep supply short into the second half of 2027. That is the origin of many “trillion-dollar AI capex” headlines. It is still a **hyperscaler** frame: five (or so) balance sheets, gross PP&E, not every watt and every accelerator worldwide.

**Goldman Sachs Global Institute**’s *Tracking Trillions* baseline — covered in depth in our [chips-and-data-centers breakdown](/blog/goldman-sachs-ai-capex-chips-data-centers-2027-2028) — is a **different object**. It is an **all-in AI infrastructure** scenario (compute + data centers + power) of **$765B in 2026**, **$1.01T in 2027**, and **$1.22T in 2028**, compounding toward roughly **$7.6T cumulative from 2026–2031**. GS is explicit that the Global Institute product is a **sensitivity framework**, not a house forecast from Investment Research.

Put the two Goldman families side by side and the 2027 comparison looks paradoxical until you read the scopes: IR’s **hyperscaler base ($1.14T)** can sit **above** GI’s **all-in AI total ($1.01T)** because IR is counting **entire company capex programs**, while GI is counting **AI infrastructure layers** with a different perimeter and methodology. Mixing them produces fake contradictions.

Street and CreditSights prints for 2026 cluster with company guidance. Into 2027–2028, consensus paths that apply Dell’Oro-style growth rates on top of today’s run-rate typically land **below** Goldman’s IR base — which is exactly why IR argues consensus is too conservative.

## Cumulative frameworks answer a longer question

McKinsey’s *Cost of Compute* work (April 2025) does not try to pin a single calendar-year hyperscaler total. It frames **global data-center capital intensity through 2030** under constrained, base, and accelerated demand:

- **Constrained:** ~**78 GW** incremental capacity · **~$3.7T** AI-specific · ~**$5.2T** total DC
- **Base:** ~**125 GW** · **~$5.2T** AI-specific · **~$6.7T** total
- **Accelerated:** ~**205 GW** · **~$7.9T** AI-specific · **~$9.4T** total

These are **multi-year cumulative** dollars. Annualizing the base AI figure naively (~$5.2T / 6 years ≈ **$870B/year**) produces a useful order-of-magnitude check against 2026–2027 run-rates — but it is not a substitute for company guidance or for Goldman’s year-by-year GI path. The dashboard’s McKinsey panel is there so readers can see **scenario width** without pretending the units match an Amazon 10-K line item.

GS Global Institute’s **~$7.6T (2026–2031)** cumulative sits in a similar “era-scale” conversation as McKinsey’s base/accelerated band, again with different layer definitions. The right use of both is **direction and sensitivity**, not false precision to the nearest $10B.

## Intensity and financing sit next to the totals

Dollar totals alone do not tell you whether the cycle is sustainable. Capex **as a share of revenue** for the same companies has moved into ranges last associated with telecom build-outs. Meta’s FY25 intensity near **35%** of revenue is the vivid example; Microsoft and Alphabet have also stepped well above their early-2020s norms. On the physical side, our [global AI data-center build tracker](/blog/global-ai-data-center-build-tracker) shows how announced megawatts and live campuses still diverge — spend authorized is not the same as capacity energized.

Funding is shifting with the scale. Public reporting around Goldman’s financing work has pointed to investment-grade hyperscaler issuance rising toward roughly **a third of capex** by 2026–2027 as free cash flow cannot stretch as fast as the build plan. That does not invalidate the demand signal — signed cloud backlogs and multi-year GPU / power commitments are real — but it does mean **credit markets** now co-price the cycle alongside equity narratives.

Physical constraints bind the other side. US data-center capacity shortfalls measured in **tens of gigawatts** by late-decade (Goldman / Morgan Stanley prints in market commentary), CoWoS and HBM bottlenecks on the silicon side, and skilled-labor shortages on the construction side all argue that **dollars authorized ≠ megawatts energized on the same schedule**. Spend totals can keep rising even while delivered capacity lags the press-release curve.

## How to read the dashboard without mixing scopes

Use this checklist when a headline throws a big AI spend number:

1. **Company or system?** Big-5 guidance / CreditSights / GS IR ≈ hyperscaler gross. GS GI ≈ global AI infra layers. McKinsey ≈ cumulative global DC.
2. **Year or era?** $760B is a **2026** run-rate family. $5.2T / $7.6T are **cumulative** decade-edge figures.
3. **Gross or AI-attributed?** A 75% haircut is a research convention, not a line item in the 10-K.
4. **Base or bull?** GS IR’s **$1.14T vs $1.4T** 2027 pair is a scenario fan, not a point forecast with error bars.
5. **Sensitivity levers?** In the GI framework, **$/MW data-center cost** and silicon useful life dominate; training-vs-inference mix matters more for returns than for aggregate capital required.

If two numbers fail any of those checks, they are not in conflict — they are simply not comparable.

## Caveats and methodology

- **2026 company figures** are guidance midpoints and post-earnings aggregates, not final audited totals. Ranges (especially Meta and Alphabet) mean the true year-end print can miss the midpoint.
- **2027–2028 company paths** in the stacked area are **directional consensus / projected** values for visualization continuity; treat them as softer than 2026 guidance.
- **AI-attributed (~75%)** is a CreditSights-style factor applied uniformly here for interaction — actual AI shares differ by company and year.
- **GS Global Institute** figures are a **scenario framework**, not Goldman Sachs Global Investment Research forecasts. **GS IR** hyperscaler figures come from public secondary reporting of research notes.
- **McKinsey** scenarios are cumulative through ~2030 and include traditional IT as well as AI loads in the “total DC” series.
- Totals may not sum across houses because **perimeters differ** (leases, power, non-hyperscaler buyers, geographic coverage).
- This post is explanatory data journalism, **not investment advice**.

**Primary synthesis sources:** company Q1 2026 earnings guidance; CreditSights aggregate commentary; Goldman Sachs Global Institute [*Tracking Trillions*](https://www.goldmansachs.com/insights/articles/tracking-trillions-the-assumptions-shaping-scale-of-the-ai-build-out) (April 2026); Goldman Sachs Investment Research hyperscaler scenario figures via public reporting (June 2026); McKinsey & Company, *The Cost of Compute* (April 2025).`,
    category: "Finance",
    imageUrl: "/images/finance-ai-capex-spend-research-2026-hero.png",
    imageAlt:
      "Dark navy data-viz hero of rising AI infrastructure capex bars and scenario layers from hundreds of billions toward trillions",
    publishedAt: "2026-07-31T12:00:00Z",
    featured: true,
    visualization: "ai-capex-spend-research-2026",
  },
  {
    id: "global-remittance-corridors",
    slug: "global-remittance-corridors-2026",
    title:
      "Charted: US→Mexico Moves $52B — the World's Largest Remittance Corridor",
    excerpt:
      "KNOMAD's bilateral matrix puts US→Mexico at ~$52B, ahead of UAE→India ($20B). Country totals tell another story: India takes $129B of $685B LMIC remittances in 2024.",
    content: `## The corridor answer first

Ask which **country pair** moves the most remittance dollars and the World Bank / KNOMAD bilateral remittance matrix gives a clear answer: **United States → Mexico at about $52 billion** (2021 model estimate). That single pipe is larger than the next Gulf corridor into India (**UAE → India ~$20 billion**) and larger than **Saudi Arabia → India (~$13 billion)** or **US → Philippines (~$15 billion)**.

Those corridor estimates allocate each recipient's recorded inflows across source countries using migrant stocks and PPP-adjusted incomes — the Ratha–Shaw methodology — not SWIFT wire counts. Treat them as **disclosed model estimates**, not transaction ledgers. Still, the ranking is stable enough to answer the core question: the densest dollar corridor on the planet runs from the US labor market into Mexico.

Country **totals** tell a different story. Officially recorded remittances to low- and middle-income countries (LMICs) are expected to reach **$685 billion** in **2024**, per the World Bank's Migration and Development Brief 41. India has been the **largest recipient since 2008** and is projected at **$129 billion** — roughly **19%** of all LMIC inflows — more than Mexico (**$68 billion**) and the Philippines (**$40 billion**) combined.

## India's $129 billion country anchor

Growth reaccelerated to **5.8%** after a sluggish **1.2%** in 2023. That rebound matters because remittances to LMICs now exceed **FDI (~$470 billion)** and more than triple **ODA (~$210 billion)** in the same Brief 41 comparisons. Diaspora cash is not a side story in global macro; it is one of the largest cross-border capital flows on Earth.

China (**$48 billion**) and Pakistan (**$33 billion**) round out the top five recipients. Dollar volume is Gulf-and-US-skewed: skilled and semi-skilled migration into OECD labor markets plus long-standing South Asian diasporas in the Middle East. For a parallel view of how India's scale shows up in aggregate growth — not just remittance receipts — see our [China–US–India GDP comparison](/blog/china-us-india-gdp-30-years).

## Two leaderboards: dollars vs dependence

The top-recipient chart is not the vulnerability chart. World Bank figure 2 in Brief 41 ranks countries where remittances dominate national output:

| Country | 2024 inflow (est.) | Share of LMIC total | Remittances / GDP |
|---------|-------------------|---------------------|-------------------|
| India | $129B | 18.8% | modest (large economy) |
| Mexico | $68B | 9.9% | ~4% |
| China | $48B | 7.0% | low |
| Philippines | $40B | 5.8% | ~8% |
| Pakistan | $33B | 4.8% | ~6% |
| Tajikistan | small | — | **45%** |
| Tonga | tiny | — | **38%** |
| Nicaragua | small | — | **27%** |

**Tajikistan** tops the dependence list at **45% of GDP** — remittances effectively fund the current account and buffer fiscal gaps. **Tonga** (**38%**) and **Nicaragua** (**27%**) follow. Lebanon also hits **27%**, overlapping humanitarian stress with remittance reliance. A shock to Gulf payrolls or a US downturn hits Tajikistan and Tonga differently than it hits India: the dollar loss is smaller, but the macro share is existential.

The scatter panel in the dashboard makes the split visual: India and Mexico sit far right on dollar volume with modest GDP shares; Tajikistan and Tonga sit high on the dependence axis with tiny absolute inflows.

## Bilateral corridors — where money actually moves

Aggregate country totals hide the pipes. Filter the corridor chart by **US only** or **Gulf only** and the structure jumps out:

- **US → Mexico ~$52B** — largest bilateral corridor globally in the 2021 KNOMAD matrix
- **UAE → India ~$20B** — GCC corridor; dirham–rupee interlinks later boosted formalization
- **US → Philippines ~$14.8B** — roughly 40% of Philippines receipts in earlier Brief commentary
- **Saudi Arabia → India ~$13B** — second Gulf pipe into South Asia
- **US → India ~$6B** (KNOMAD 2021) — **understates** recent RBI source-mix data where the US share of India's inflows rose sharply

Corridor analysis matters for policy: payment-system interlinks, migration enforcement at the US southern border (which also affects transit-country flows through Mexico and Guatemala), and Gulf visa rules all move bilateral splits faster than headline recipient totals. Remittance Prices Worldwide still shows average sending costs above the SDG **3%** target — high bank fees push informal channels, which Brief 41 reminds us means **true flows exceed official $685 billion**.

## Regional growth in 2024

Brief 41 regional growth rates show **South Asia leading at 11.8%** — driven by India, Pakistan, and Bangladesh — after **5.2%** growth in 2023. **Middle East and Africa** combined rebounded an estimated **5.4%** after Egypt's 2023 slump. Latin America benefits from a strong US job market for migrant workers but slowed from **7.5%** to roughly **4.8%**. Europe and Central Asia post moderate gains as Ukrainian displacement and Russian corridor flows evolve.

Stacked regional history clarifies the base: South Asia climbed from **$115 billion** in 2019 to an estimated **$199 billion** in 2024. Latin America and the Caribbean rose from **$96 billion** to **~$152 billion** — US labor demand shows up here. East Asia and Pacific totals look flatter in dollar terms because China's large inflow share has stagnated or fallen in some years while the Philippines grows steadily.

That regional resilience sits beside a different macro story in our [deflationary-growth economies](/blog/deflationary-growth-economies-2025) piece: remittance-heavy LMICs can keep consuming even when local price signals and investment cycles weaken.

## Remittances vs FDI and aid — the scale comparison

LMIC remittances at **$685 billion** exceed **FDI (~$470 billion)** and **ODA (~$210 billion)** in 2024 World Bank comparisons. That ordering is not new, but the 2024 rebound underscores resilience: remittances are often counter-cyclical for families (workers send more when home-country conditions worsen) while FDI retreats when risk premia rise.

For fiscal planners, the implication is blunt: diaspora transfers finance consumption, housing, and local investment in ways aid cannot match at scale — but they are **private, volatile, and poorly captured** in quarterly GDP nowcasts. They do not appear on a single government's balance sheet the way aid does.

## Who wins, who is exposed, and what could change the story

**Winners in 2024:** India's formal-channel share rises with payment digitization and Gulf interlinks; Mexico and Central America capture US labor-market strength; Philippines OFW remittances hold despite tourism recovery competing for foreign exchange.

**Exposed:** High GDP-share economies (Tajikistan, Tonga, Nicaragua, Lebanon, Samoa) face asymmetric risk — a 10% drop in inflows can mean a 4–5 point GDP hit. Pakistan and Egypt sit between scale and stress: large recipient totals with recurring current-account pressure.

**Migration politics:** US border policy affects not only US-bound flows but **transit remittances** through Mexico and Guatemala (Brief 41 notes migrant passage from Cuba, Haiti, Venezuela, and others). EU and UK corridors into India gained share in RBI data even as Gulf shares moderated — a diversification trend worth watching.

Remittances sit beside our [refugee hosting burden](/blog/global-refugee-hosting-burden-2024) map — who physically hosts displaced populations. Refugees and labor migrants are different legal categories, but both reshape cross-border money flows. Hosting burden is a stock of people; remittance corridors are a flow of dollars that follow diaspora networks, sometimes years after the initial move.

## Caveats

- **Official vs true flows:** Brief 41 states informal channels mean actual remittances exceed recorded **$685 billion** — magnitude unknown
- **Bilateral corridors are modeled:** KNOMAD 2021 splits use migrant-stock allocation; they are **not** SWIFT-level bilateral reporting and can understate fast-shifting US→India shares
- **2024 figures are estimates (e):** December 2024 Brief projections may revise when balance-of-payments data settle
- **Regional 2024 splits:** Sub-regional totals in our dashboard are scaled from 2023 disclosed bases using published growth rates — not separately disclosed line items
- **GDP-share and inflow leaders use different country sets:** Tajikistan's 45% is not comparable to India's $129B without per-capita context
- **China inclusion:** China is an upper-middle-income economy in World Bank groupings; LMIC totals exclude high-income recipients by definition

## Methodology

Primary source: World Bank Migration and Development Brief 41 (December 2024) blog and tables — LMIC total, top-five recipients, GDP-share leaders, regional growth rates. Historical regional totals through 2023 from Brief 40. Bilateral corridors from KNOMAD bilateral remittance matrix (2021), World Bank People Move blog (December 2022). FDI/ODA comparison figures from Brief 41 narrative.

**Unlike our electricity generation mix map, this post tracks people-linked money flows — not physical power systems.**`,
    category: "Global Systems",
    themeId: "demographic-cash-flows",
    imageUrl: "/images/global-systems-global-remittance-corridors-2026-hero.png",
    imageAlt:
      "Dark navy visualization of global remittance corridors highlighting the US→Mexico $52B top corridor and India as the $129B largest recipient",
    publishedAt: "2026-07-31T10:00:00Z",
    featured: true,
    visualization: "global-remittance-corridors",
    layout: "default",
  },
  {
    id: "phosphate-fertilizer-export",
    slug: "phosphate-fertilizer-export-dependence-2026",
    title:
      "Charted: Morocco, China, and Saudi Arabia Control 67% of Phosphate Fertilizer Exports",
    excerpt:
      "Processed phosphate fertilizers — not just rock — are a seaborne chokepoint. TFI puts Morocco, China, and Saudi Arabia at 67% of MAP/DAP/TSP exports; add Russia and the top four clear ~82%. India's, Kenya's, and Brazil's DAP origins show which food systems sit downstream.",
    content: `## The nutrient that has to arrive on a ship

Phosphorus has no agricultural substitute. Farmers can stretch nitrogen with better timing and they can recycle some organic matter, but commercial grain systems still depend on **processed phosphate fertilizers** — chiefly **monoammonium phosphate (MAP)**, **diammonium phosphate (DAP)**, and **triple superphosphate (TSP)** — to replace what each harvest removes from soil. More than half of those finished products enter international trade. That is the chokepoint this post maps: **who exports the bags**, not who digs the rock.

Our companion [phosphate rock supply concentration](/blog/phosphate-rock-supply-concentration-2024) piece used USGS mine and reserve tables: Morocco owns the geologic inventory; China digs the most rock. This dashboard answers a different question — **which food systems depend on a short list of phosphate fertilizer exporters** — with shares from The Fertilizer Institute (TFI), corridor evidence from IFPRI, and trade-context from FAO and UN Comtrade patterns.

## Top-3 exporter share: 67%

TFI's 2025 phosphorus brief ranks **22 exporting countries** for processed phosphates and finds a brutal concentration at the top:

| Rank | Exporter | Export share | Production share |
|---|---|---:|---:|
| 1 | Morocco | **30%** | 14% |
| 2 | China | **21%** | 44% |
| 3 | Saudi Arabia | **16%** | 9% |
| 4 | Russia | 15% | 9% |
| 5 | United States | 4% | 8% |
| — | Other | 14% | 16% |

**Morocco + China + Saudi Arabia = 67% of world exports.** Add Russia and the **top four reach about 82%** — the same ballpark IFPRI cites when it says China, Morocco, Russia, and Saudi Arabia constitute roughly **80% of global DAP and MAP exports**. Production is also tight: TFI puts the **top five producers above 80%** of MAP/DAP/TSP output among roughly **30 producing countries**, with **China alone at 44%**.

The scatter and gap charts above make the asymmetry visible. **China produces far more than it exports** — a food-security state that keeps nutrient tons at home when domestic rice and maize affordability stays tight. **Morocco and Saudi Arabia export well above their production shares** — they are the seaborne swing suppliers when Chinese licensing bites.

## China closed the tap; the rest did not refill it

IFPRI's March 2025 review is blunt about the 2021–2024 shock path. China exported an average of about **9 million metric tons** of ammoniated phosphates in 2019–2020, hit a record **10 Mt in 2021**, then used export restrictions and licensing to prioritize the domestic market. By **2024**, Chinese exports were only **6.6 Mt** — roughly a **one-third cut** from the peak.

Russia and Saudi Arabia were already near capacity; IFPRI expects little volume relief until new plants arrive around **2027–2028**. Morocco raised exports after 2022, but gradually, and diverted more of its processed mix into **TSP**, which many DAP/MAP-habituated farmers treat as a second-best product. The stacked area in the dashboard shows the shape of that story: China's band shrinks after 2021; peers inch up without restoring the old seaborne surplus.

FAO's fertilizer focus note puts global phosphate trade near **30.4 Mt in 2023** — a rebound of about 1 Mt year-over-year, yet still **more than 4 Mt below 2021**. TFI adds that **2024 processed-phosphate exports were about 7% below 2021** even though **global production exceeded 2021 by roughly 4%**. Tons were made. They were not all allowed onto the water.

## Which food systems sit downstream

Export concentration becomes a food-system risk only when importers cannot diversify origins. IFPRI's corridor work shows how thin that diversification often is:

- **India (2023 DAP):** China about **39%**, Saudi Arabia ~18%, Morocco ~13%, Russia ~10%. China's share of Indian DAP swung from **19% in 2022 to 39% in 2023** as licensing eased — proof that New Delhi's planting calendar still tracks Beijing's permit desk.
- **Brazil (2023 DAP):** a more plural mix, but still dominated by Morocco, Russia, and China (China alone ~**20%**, down from 27% in 2021 and up from 14% in 2022). Stocks looked healthier than in South Asia, yet much of the inventory was high-priced material that deterred farmer purchases.
- **Kenya (2023 DAP):** a **two-origin market** — Saudi Arabia **83%**, Morocco **17%**. Russia held an 11% share in 2021 and then disappeared. That is not a contestable commodity market; it is a bilateral logistics relationship.
- **European Union:** Morocco remains the primary origin, with Russia still material because fertilizers were exempted from EU sanctions — a political carve-out that keeps European phosphorus exposed to a sanctioned-state exporter.

Toggle the **Food-system importers** lens above to see origin donuts and single-origin dominance bars. The pattern repeats: large agrarian importers do not face "the world phosphate market." They face **two to four state-linked supply systems**.

## Rock chokepoint vs fertilizer chokepoint

Readers who know the USGS rock table sometimes assume fertilizer trade mirrors mine ranks. It does not. China's **44% production / 21% export** split is the clearest proof: the largest processor can starve the seaborne market while still running plants. Morocco's **14% production / 30% export** split is the mirror: OCP's integrated system is built to ship. Saudi Arabia punches similarly above its production weight.

That is why pairing this post with the [phosphate rock](/blog/phosphate-rock-supply-concentration-2024) dashboard matters. Rock reserves answer "who owns the century." Fertilizer exports answer "who can cancel next season's application rates in India, Kenya, or Bangladesh." The same molecule; different binding constraint.

For another physical chokepoint with a dig-versus-process split, see [copper mine vs refinery geography](/blog/copper-mine-vs-refinery-concentration-2024). For a one-country mine monopoly in battery anodes, see [natural graphite](/blog/natural-graphite-mine-concentration-2024). Phosphate fertilizer is closer to copper's midstream logic than to graphite's mine monopoly — except the "midstream" here is acidulation and ammoniation of rock into MAP/DAP, and the customers are food systems rather than cable mills.

## Prices, affordability, and the slow yield risk

All fertilizer prices fell from 2022 peaks, but IFPRI notes phosphate remains roughly **double** early-2020 levels while urea is closer to **1.5×**. Affordability — phosphate cost relative to crop prices — deteriorated because crop prices retreated faster than phosphate. IFA's November 2024 update revised phosphate demand growth down for 2024–2025 versus earlier forecasts.

The failure mode is slow. Skipping nitrogen shows up in the next harvest. Skipping phosphate can look fine for a season or two because soils buffer phosphorus — until they do not. IFPRI flags historical-low stocks in major markets by end-2024 and DAP scarcity protests during Indian sowing windows. Sub-Saharan application rates start low; Kenya still saw phosphate use contract about **42%** over 2020–2022. The global calorie system can absorb a one-year skim. A multi-year skim is how you bake lower yields into food prices.

## Who is exposed, who benefits, what would change the story

**Exposed:** South Asian and East African DAP buyers with two-to-four origin lists; any importer that treated 2019–2020 Chinese export volumes as a permanent feature of the market; US growers facing AD/CVD duties on Moroccan and Russian phosphates since 2019 that shifted imports toward costlier origins while domestic Florida plants took hurricane hits.

**Relative beneficiaries under current geography:** Morocco/OCP as the scalable seaborne alternative; Saudi and Russian exporters running near capacity into a short market; traders who can arbitrate TSP versus DAP acceptance.

**What would change the story:** Chinese licensing that returns exports toward the **9–10 Mt** band; greenfield capacity in Saudi Arabia, Morocco, and elsewhere that IFPRI dates to **2027–2028**; a lasting shift in farmer acceptance of TSP/NPKs; or phosphorus recycling at a scale that actually dents primary MAP/DAP demand — still small relative to tens of millions of nutrient tons.

## Caveats

- **Export and production shares are TFI aggregates for MAP/DAP/TSP**, not USGS phosphate-rock mine shares; do not mix the two tables.
- **China export Mt figures are IFPRI-reported ammoniated phosphate exports**; product definitions can differ slightly from TFI share denominators.
- **Importer corridor percentages** are IFPRI DAP-origin shares for cited years; Bangladesh is an illustrative South Asian pattern, not a primary IFPRI table reprint.
- **Stacked volume history** anchors IFPRI's China 10→6.6 Mt path and interpolates peer volumes for visualization — treat peer Mt as approximate, not customs microdata.
- **UN Comtrade HS codes** for phosphatic fertilizers fragment across DAP, MAP, and other headings; we use secondary research syntheses rather than a raw Comtrade scrape for headline shares.
- **Western Sahara / Morocco** reporting conventions in rock statistics can differ from fertilizer-brand export statistics; TFI exporter shares follow commercial trade practice.

## Methodology

Headline top-3 and top-4 export shares and production shares: TFI Phosphorus/phosphate one-pager (2025). China export volumes 2019–2024 and qualitative capacity notes: IFPRI (March 2025). Importer DAP origin shares for India, Brazil, Kenya, and EU context: IFPRI fertilizer-trade analyses (2021–2023 updates). Global phosphate trade tonnage: FAO Focus on Fertilizers. Dashboard gaps and scatter positions are derived from the disclosed TFI share pairs. This post is about **processed fertilizer trade dependence**; rock geology remains covered in the linked USGS-based companion.

**Unlike our [helium supply concentration](/blog/global-helium-supply-concentration-2024) map — a two-country industrial-gas bottleneck — phosphate fertilizer exports are a four-country food-system bottleneck whose binding constraint is often an export license, not a depleted mine.**`,
    category: "Global Systems",
    themeId: "chokepoint-commodities",
    imageUrl:
      "/images/global-systems-phosphate-fertilizer-export-dependence-2026-hero.png",
    imageAlt:
      "Dark navy data-viz hero of phosphate fertilizer export routes dominated by Morocco, China, and Saudi Arabia with a 67% top-3 callout",
    publishedAt: "2026-07-31T10:00:00Z",
    featured: true,
    visualization: "phosphate-fertilizer-export",
    layout: "default",
  },
  {
    id: "billion-dollar-disasters",
    slug: "us-billion-dollar-weather-disasters-2026",
    title: "Charted: US Billion-Dollar Disasters Now Cost $149B a Year — and the Increments Keep Growing",
    excerpt:
      "NOAA’s CPI-adjusted ledger shows annual US billion-dollar disaster costs averaging $149.3B in 2020–24 — 6.8× the 1980s — while decade-to-decade cost increments keep widening.",
    content: `## The inflation-adjusted total is the right headline

Everyone remembers the year a hurricane breaks the damage record. Fewer people ask whether **normalized** disaster cost is still accelerating after you strip out general inflation — and after you scale by the size of the economy.

NOAA NCEI’s Billion-Dollar Weather and Climate Disasters series answers the first half cleanly. All costs are **CPI-adjusted to 2024 dollars**. On that yardstick, the **2020–2024** average is **$149.3 billion per year** in direct damages from events that individually clear **$1 billion**. In the **1980s** the average was **$22.0 billion**. That is a **6.8×** jump in the annual CPI total — not a media-cycle illusion.

Event frequency moved in parallel: **23.0** billion-dollar disasters per year in 2020–24 versus **3.3** in the 1980s (**~7×**). Over the full **1980–2024** window NOAA counts **403** such events and **$2.915 trillion** in cumulative CPI-adjusted cost.

**Unlike our [electricity generation mix](/blog/global-electricity-generation-mix-2024) map, this post is not about how grids are fueled — it is about the rising damage ledger those grids, coasts, and floodplains keep paying.**

## Acceleration means first differences, not just levels

A level can be high without still accelerating. The sharper test is whether the **decade-to-decade increment** in annual cost keeps getting larger.

| Step | Change in cost / year (2024$) |
|------|-------------------------------|
| 1980s → 1990s | **+$11.5B** |
| 1990s → 2000s | **+$28.7B** |
| 2000s → 2010s | **+$37.3B** |
| 2010s → 2020–24 | **+$49.8B** |

Each step’s increment is larger than the last. That is the acceleration signal in the official ledger: not merely “costs are high,” but “the climb itself is steepening.” The **2010s** already averaged **$99.5B/year**; the partial **2020–24** decade is running **$149.3B/year** — and the **2022–24** three-year average is even hotter at **$153.9B/year**.

Frequency tells the same story at the count level. The US has now posted **14 consecutive years** (2011–2024) with **10 or more** billion-dollar events. Over the last ten years (**2015–2024**), NOAA’s Climate.gov wrap counts **190** separate billion-dollar disasters and roughly **$1.4 trillion** in damage.

## 2024: second-most events, fourth-costliest year

**2024** logged **27** billion-dollar disasters and **$182.7 billion** in CPI-adjusted damage — second only to **2023’s record 28 events**, and fourth on the cost ranking behind **2017** ($395.9B), **2005** ($268.5B), and **2022** ($183.6B). Fatalities tied to these events reached **568**, among the higher years in the 45-year record.

Severe storms dominated the **count** (17 of 27 when tornado outbreaks and hail/wind events are grouped with the broader severe-weather category in Climate.gov’s narrative). Hurricanes dominated the **bill**: Helene (~$78.7B) and Milton ($34.3B) alone topped **$100B** across the Southeast in roughly two weeks. Beryl added another **$7.2B**; a May tornado outbreak added **$6.6B**.

That split matters for adaptation economics. A year can look “busy” on the event counter because localized severe storms keep clearing the $1B threshold, while the fiscal and insurance shock still concentrates in a handful of tropical cyclones.

## Count vs dollars: two different hazard regimes

Over **1980–2024**, **severe storms** lead event counts (**203**) but average only about **$2.5B** each. **Tropical cyclones** are rarer (**67**) yet average about **$23B** and account for roughly **$1.54 trillion** of cumulative cost — more than triple severe-storm dollar totals. Drought (~$368B cumulative), inland flooding (~$203B), wildfire (~$148B), and winter storms (~$104B) fill out the ledger.

So “is disaster risk rising?” depends on which series you watch:

- **Frequency:** severe storms are the volume engine pushing more years over the artificial $1B line.
- **Severity of the bill:** hurricanes still write the largest checks.
- **Human cost:** tropical cyclones also lead cumulative deaths in the NOAA table, with drought/heat close behind.

For insurers, municipalities, and federal disaster budgets, the practical implication is portfolio-shaped: many mid-size convective losses plus fat-tailed hurricane years — not a single smooth trend line.

## GDP normalization softens the story — it does not erase it

CPI adjustment removes general inflation. It does **not** remove the fact that the US economy and capital stock are much larger than in 1980. Dividing decade average disaster cost by a BEA nominal-GDP midpoint is a rough second normalization:

| Period | Cost / year (2024$) | ≈ GDP midpoint | Cost share of GDP |
|--------|---------------------|----------------|-------------------|
| 1980s | $22.0B | ~$4.3T | **0.51%** |
| 1990s | $33.5B | ~$7.6T | **0.44%** |
| 2000s | $62.2B | ~$13.1T | **0.48%** |
| 2010s | $99.5B | ~$18.2T | **0.55%** |
| 2020–24 | $149.3B | ~$25.7T | **0.58%** |

On this yardstick the rise is real but slower than the raw CPI multiple: from about **half a percent of GDP** in the 1980s to a bit under **0.6%** in 2020–24. Spike years still puncture the average — **2017** alone was on the order of **2% of that year’s GDP** when Harvey, Irma, and Maria stacked.

Climate.gov’s per-capita framing is harsher than the GDP share: five-year-average disaster cost per US resident rose from roughly **$150** in the early 2000s to above **$400** by the late 2010s and has stayed elevated. Population growth alone does not absorb the CPI-adjusted climb.

Readers tracking fiscal pressure from another angle may want our [US industrial subsidies vs tariffs](/blog/us-industrial-subsidies-vs-tariffs-30-years) piece — adaptation and disaster outlays compete in the same long-run budget with industrial policy, interest, and tax expenditures.

## Who is exposed — and what would change the story

Exposure concentrates where people and property keep filling hazard zones: Gulf and Atlantic hurricane coasts (Florida’s cumulative cost leads the state map at roughly **$450B** since 1980; Texas is close behind on both cost and event count), inland floodplains, and the Western wildland–urban interface. NOAA is explicit that rising losses mix **exposure** (more assets in harm’s way), **vulnerability** (how we build and insure), and **climate-driven extremes**. This post does **not** attribute shares among those drivers; attribution science and building-code studies sit outside the NCEI ledger.

The interactive dashboard above is built to stress-test the acceleration claim: toggle the rolling average between **CPI dollars**, **event counts**, and **GDP share**, and switch the window between **5** and **10** years. CPI dollars and counts rise steeply; GDP share rises more slowly — which is exactly why “normalized” needs a definition before the headline.

What would change the story:

- A sustained multi-year stretch back toward the long-run **9.0 events / $64.8B** averages without a compensating mega-hurricane year.
- Material downward revisions to 2020–24 costs as claims settle the other way (historically revisions more often rise).
- A GDP boom that outruns CPI-adjusted losses enough to push the cost/GDP share back toward 1990s levels even if dollar losses stay high.

None of those is visible in the January 2025 Climate.gov update. The working conclusion: **yes — inflation-adjusted annual totals are still accelerating on a decade-difference basis**, while GDP-normalized shares are elevated and slowly rising rather than exploding.

## Caveats and methodology

- **Threshold artifact:** Events just under $1B (2024$) are excluded; 57 older events crossed the line only after CPI adjustment.
- **Partial decade:** 2020–24 is five years, not ten — comparisons use per-year averages.
- **Cost revisions:** 2024 totals (analysis through early January 2025) can still rise as claims data settle.
- **GDP shares are estimated:** NOAA costs are disclosed; dividing by BEA nominal GDP midpoints is our normalization, not an NCEI field.
- **No driver split:** The series does not isolate climate change vs exposure vs vulnerability.
- **Direct damages only:** Broader macroeconomic and health costs are out of scope.

**Primary sources:** [NOAA NCEI Billion-Dollar Disasters](https://www.ncei.noaa.gov/access/billions/) and [Climate.gov’s 2024 wrap-up](https://www.climate.gov/news-features/blogs/beyond-data/2024-active-year-us-billion-dollar-weather-and-climate-disasters); GDP context from [BEA](https://www.bea.gov/data/gdp/gross-domestic-product).

**Unlike our [Goldman Sachs AI capex](/blog/goldman-sachs-ai-capex-chips-data-centers-2027-2028) scenario stack, this post tracks realized weather losses — not forward infrastructure spend.**`,
    category: "Energy",
    themeId: "adaptation-economics",
    imageUrl: "/images/energy-us-billion-dollar-weather-disasters-2026-hero.png",
    imageAlt:
      "Dark navy data visualization of rising US billion-dollar weather disaster bars morphing into storm systems with $149B/yr callout",
    publishedAt: "2026-07-31T11:20:00.000Z",
    featured: true,
    visualization: "billion-dollar-disasters",
    layout: "fullscreen",
  },
  {
    id: "social-security-trust-fund",
    slug: "us-social-security-trust-fund-depletion-path-2026",
    title: "Charted: Social Security Reserves Hit Zero in 2034 — One Year Sooner",
    excerpt:
      "SSA’s 2025 Trustees Report projects combined OASDI reserves deplete in 2034 with only 81% of scheduled benefits payable — OASI alone runs dry in 2033 at 77%.",
    content: `## The clock moved up again

The Social Security Board of Trustees released its **2025 annual report** on June 18. The headline number for policymakers and retirees alike is unchanged in shape but worse in timing: the **combined Old-Age, Survivors, and Disability Insurance (OASDI) trust funds** are projected to become **depleted in 2034** — **one year earlier** than in the 2024 report.

At depletion, continuing dedicated tax revenue would cover only **81%** of scheduled benefits. That is not a forecast of a total program shutdown. Payroll taxes, taxation of benefits, and other statutory income keep flowing. What stops is the ability to redeem the **$2.72 trillion** in accumulated reserves — special-issue Treasury securities built up over decades — to fill the gap between income and cost.

## Two funds, one combined story

Social Security is legally **two separate trust funds**:

| Fund | Role | Reserves end-2024 | Depletion (intermediate) | Payable at depletion |
|------|------|-------------------|--------------------------|----------------------|
| **OASI** | Retirement & survivors | $2,538B | **2033** (Q1) | **77%** |
| **DI** | Disability | $183B | Not in 75-year window | 100% |
| **OASDI** (hypothetical combined) | Illustrative total | $2,722B | **2034** (Q3) | **81%** |

The combined OASDI figures are **hypothetical** — Congress has never merged the funds — but they are the standard way to summarize program-wide solvency. The split matters politically: **retirement benefits face the earlier cliff**; **disability financing looks stable** under current law and disability-incidence trends.

## From $2.72 trillion to $214 billion in nine years

Trustees publish reserves at the **beginning of each calendar year**. Under intermediate assumptions:

- **Start of 2025:** **$2,721 billion** (169% of annual cost — the “trust fund ratio”)
- **Start of 2034:** **$214 billion** (9% of annual cost)
- **Third quarter 2034:** combined reserves reach **zero**

The drawdown is not linear. Annual deficits widen as the baby-boom cohort ages and as the ratio of workers to beneficiaries falls. Net reserve reductions accelerate from **$181 billion** in 2025 to more than **$400 billion** by 2033.

In 2024, combined reserves **fell $67 billion** — income including interest was **$1,418 billion** against cost of **$1,485 billion**. Cost has exceeded **non-interest income every year since 2010**; total income fell below cost starting in **2021** once interest could no longer fully bridge the gap.

## Trust fund ratio: the “months of runway” metric

Actuaries track the **trust fund ratio** — reserves at January 1 divided by that year’s projected cost. **100%** means one full year of benefits could be paid from the trust fund alone.

The combined ratio slides from **169%** in 2025 to **95%** by 2029 (already below the short-range adequacy threshold), then **26%** at the start of 2033, and **9%** at the start of 2034. **OASI** hits **89%** in 2029 and **3%** at the start of 2033 — functionally empty a year before the combined funds.

**DI** moves the opposite direction: from **106%** in 2025 to **116%** by 2034, with the ratio projected to reach **777%** by 2099 under intermediate assumptions — a post-reform recovery that contrasts sharply with the retirement fund’s path.

## What “81% payable” actually means

After depletion, Social Security does **not** stop mailing checks. Benefits are limited to **amounts that incoming revenue can support on a pay-as-you-go basis**. The Trustees estimate **81%** of scheduled benefits for the combined funds at the 2034 depletion point, drifting to **72%** by 2099 unless law changes.

For **OASI** at its **2033** depletion, the figure is **77%**. The gap between 77% and 81% reflects DI’s continuing surplus temporarily subsidizing the combined picture — another reason separate-fund accounting matters.

Scheduled benefits include **cost-of-living adjustments (COLAs)** and benefit formulas written into current law. Payable benefits would be whatever tax inflows allow under those formulas — a mechanical cut, not a negotiated political choice, unless Congress intervenes.

## Why the date moved up one year

The **2024 report** pointed to **2035** for combined depletion. The **2025 report** pulls that to **2034**. The **OASI** depletion year is **unchanged at 2033**.

Drivers in the Trustees’ reconciliation include:

- **Slightly weaker near-term economic assumptions** — including a lower assumed labor share of GDP (61.2% vs 62.8% in the prior report’s long-run path)
- **Updated starting values** from 2024 operations
- A **75-year valuation window** extended through **2099**, which mechanically worsens the long-range actuarial deficit to **3.82%** of taxable payroll (from 3.50%)

The **open-group unfunded obligation** — the present value of scheduled costs minus income over 75 years — is **$25.1 trillion** as of January 1, 2025, or **3.64%** of taxable payroll over the period.

## Scenario spread: 2032 to 2051

Trustees publish **low-cost** and **high-cost** alternatives, not probabilities. For combined OASDI depletion:

| Scenario | Combined OASDI | OASI | DI |
|----------|----------------|------|-----|
| High-cost | 2032 | 2031 | 2044 |
| Intermediate | **2034** | **2033** | Not depleted |
| Low-cost | 2051 | 2036 | Not depleted |

Stochastic simulations in the report suggest a **95% confidence band** for combined depletion between **2032 and 2039** — tighter on the late side than last year’s band (2032–2043). The central message: depletion before mid-century is **very likely** without legislative changes to revenue or benefits.

## Who is exposed — and what Congress could change

Roughly **67.6 million** people received Social Security benefits at the end of 2024. **60.1 million** were OASI beneficiaries; **8.3 million** received DI. Benefits are **progressive** by design — lower earners receive higher replacement rates — so a uniform across-the-board reduction to 77–81% would hit **middle-income retirees** who depend on Social Security for most of their cash income.

Policy levers are well mapped: raise the payroll tax rate (currently **12.4%** split between worker and employer), increase or eliminate the **taxable maximum** ($176,100 in 2025), raise the **full retirement age** further, change **COLA** indexing, or tax a larger share of benefits. Each option has distributional winners and losers — the Trustees do not recommend a package.

Unlike discretionary federal spending, Social Security operates as **mandatory spending** financed by dedicated taxes. Depletion is a **cash-flow constraint inside a trust-fund accounting framework**, not a federal debt default. Treasury would still honor the special-issue securities until reserves are gone — then benefit payments shrink to incoming receipts.

## Links to the wider fiscal picture

This is domestic **fiscal plumbing** — how a dedicated revenue stream meets a mandated spending line. For a different lens on government cash flows, see our [China fiscal revenue breakdown](/blog/china-fiscal-revenue-all-budgets-2024), which maps how another major economy’s budget lines shifted in 2024.

Industrial and trade policy also compete for the same federal balance sheet. Pair this trust-fund path with our long-run chart of [US industrial subsidies versus tariffs](/blog/us-industrial-subsidies-vs-tariffs-30-years) — on-budget market support and customs duties are the cousin of dedicated payroll taxes: different statutes, same question of whether current law matches current obligations.

For another structural pressure on public finances, see [global electricity generation mix](/blog/global-electricity-generation-mix-2024) — energy transition capital needs sit outside Social Security’s trust funds but still shape the broader fiscal environment in which Congress will eventually rewrite payroll-tax and benefit formulas.

## Historical context: from surplus to structural deficit

The trust funds accumulated large surpluses from the **1983 reforms** through the mid-2010s as the baby-boom generation paid in more than the system paid out. Those surpluses were invested in Treasury securities — the “lockbox” debate of the 1990s and 2000s asked whether that accounting truly prefunded future benefits or simply reduced measured federal deficits.

By **2010**, **non-interest income** no longer covered annual cost. By **2021**, even **total income including interest** fell short. The system is now in **drawdown mode** — selling securities back to Treasury to pay beneficiaries. That worked while reserves were large; it stops when reserves hit zero.

The **1983 bipartisan fix** combined tax increases, benefit adjustments, and a gradual rise in the full retirement age. The magnitude of today’s **3.82% of payroll actuarial deficit** is in the same ballpark as the gap that reform closed — but the political coalition for a similar bargain is harder to assemble in a polarized Congress.

## What would change the story

Several developments could push the depletion date **later** without legislation: stronger-than-assumed **productivity and wage growth**, higher **fertility**, lower **disability incidence**, or more **immigration** of working-age contributors. Conversely, **recession**, **higher inflation** without matching wage growth, or **rising longevity** could pull depletion **earlier**.

Legislative action remains the only lever that directly resets payable benefits. Past Congresses have acted **close to deadlines** — the 1983 reforms passed with the trust fund weeks from inability to pay full benefits. Whether that pattern repeats before **2033–2034** is a political forecast, not an actuarial one.

## Caveats

- **Intermediate assumptions are one scenario** — low-cost and high-cost bounds differ by nearly two decades on combined depletion
- **OASDI combined figures are hypothetical** — OASI and DI are separate legal entities; only Congress can reallocate or merge them
- **Payable-benefit percentages apply at depletion** — they drift lower over the 75-year window (81% → 72% for OASDI by 2099)
- **Trust fund “reserves” are Treasury securities** — redemption affects federal unified budget accounting but is not the same as an external sovereign default
- **Projections incorporate current law** — no assumed future reforms unless explicitly modeled in alternative scenarios
- **Economic and demographic sensitivity is large** — the stochastic depletion band spans 2032–2039 for combined funds

## Methodology

All reserve levels, trust fund ratios, depletion years, and payable percentages are from the **Social Security Administration, 2025 Annual Trustees Report** (released June 18, 2025), intermediate assumptions. Annual reserve paths from Tables IV.A2 (OASI), IV.A4 (DI), and IV.A3 (combined OASDI). Prior-year comparison uses the 2024 Trustees Report combined depletion year of 2035.

**Unlike our China fiscal revenue piece, this post tracks US Social Security trust-fund depletion timing and payable-benefit mechanics — not general-government revenue composition.**`,
    category: "Global Systems",
    themeId: "fiscal-plumbing",
    imageUrl: "/images/global-systems-us-social-security-trust-fund-depletion-path-2026-hero.png",
    imageAlt:
      "Dark navy visualization of declining Social Security trust fund reserves toward a 2034 depletion cliff with benefit percentage gauge",
    publishedAt: "2026-07-31T10:00:00Z",
    featured: true,
    visualization: "social-security-trust-fund",
    layout: "default",
  },
  {
    id: "goldman-sachs-ai-capex",
    slug: "goldman-sachs-ai-capex-chips-data-centers-2027-2028",
    title: "Charted: Goldman Sachs Puts 2027 AI Capex at $961B — Chips and Data Centers",
    excerpt:
      "Goldman's Tracking Trillions model: $661B on compute and $300B on data centers in 2027, rising to $808B and $353B in 2028. A scenario framework — not a forecast — but the clearest public split of the AI build-out.",
    content: `## The direct answer from Goldman

Goldman Sachs Global Institute published the most detailed public breakdown of global AI infrastructure spending in **[Tracking Trillions: The Assumptions Shaping the Scale of the AI Build-Out](https://www.goldmansachs.com/insights/articles/tracking-trillions-the-assumptions-shaping-scale-of-the-ai-build-out)** (April 2026, authors George Lee and Lucas Greenbaum).

The interactive chart above maps their baseline scenario model. For the years most investors ask about:

| Year | Compute / chips | Data centers | Chips + DC | Total incl. power |
|------|-----------------|--------------|------------|-------------------|
| **2027** | **$661B** | **$300B** | **$961B** | **$1,011B** |
| **2028** | **$808B** | **$353B** | **$1,161B** | **$1,220B** |

"Compute" is accelerators and systems (GPUs and ASICs including node costs) — the closest line to **chips**. "Data centers" is shell, cooling, and fit-out at a baseline **$15M per MW**. Power generation is reported separately and remains small relative to the other two layers.

## Not a forecast — read the disclaimer first

Goldman is explicit that this is **not a house forecast**. The report describes itself as a *scenario-based framework* to explore how infrastructure assumptions affect aggregate capital requirements. The disclaimer states it was prepared by the **Goldman Sachs Global Institute** and **is not a product of Goldman Sachs Global Investment Research**.

That distinction matters because a different Goldman number circulates constantly: **~$1.14 trillion in hyperscaler capex for 2027** (Investment Research base case, strategist Ryan Hammond, June 2026). That figure is **narrower** — hyperscaler spending only, not all-in global AI infrastructure. Street consensus on hyperscaler capex sits near **$920B**. Do not mix the scopes.

## What drives the data center line

The data center capex figure is the most assumption-sensitive piece. Goldman's baseline uses **$15M/MW**. Legacy hyperscale cloud was built around **$10M/MW**; next-generation AI facilities are running **$15–20M/MW** with upside as density and redundancy rise.

At **$11M/MW**, 2027 data center capex drops to **$220B** and 2028 to **$259B**. At **$19M/MW**, those rise to **$380B** and **$447B**. The compute line is unchanged — only the facility cost assumption moves.

## Cumulative build-out: $7.6 trillion

Across **2026–2031**, the baseline model totals:

- **$5.1T** compute
- **$2.1T** data centers
- **$358B** power
- **$7.6T** all-in

Compute alone crosses **$1T annually by 2030** ($1,073B) in the baseline path.

## Chip stack: top-down model vs bottom-up checks

Tracking Trillions does **not** roll compute into a single semiconductor industry revenue forecast. Global Institute builds the **$661B / $808B** compute lines top-down from accelerator shipments; equity research sizes suppliers separately. Those bottom-up figures — Broadcom AI silicon, HBM, MediaTek ASICs, TSMC capex — are in the **chip & component table** in the chart above, not in the main scenario model.

Worth noting outside that table: Goldman **raised its 2027 HBM market estimate from $75B to $116B**, a signal that memory is tightening faster than earlier assumptions.

## What actually moves the total

Goldman ranks four assumptions as decisive:

1. **Economic useful life of AI silicon** — does not change annual compute capex but swings implied depreciation by hundreds of billions
2. **Data center cost per MW** — the biggest lever on the facility line
3. **Chip and architecture mix**
4. **Elongation from power, labor, and equipment bottlenecks**

It argues three widely debated factors — training vs inference mix, per-chip memory growth, and behind-the-meter vs grid power — affect returns and value distribution but **do not materially change aggregate capital required**.

## Methodology

All figures from Goldman Sachs Global Institute, **Tracking Trillions** (April 2026). Baseline assumptions: NVIDIA forward data center revenue estimates (March 3, 2026), 75% NVIDIA share of compute, VR200 at $80.5K/GPU and 3,000W, $15M/MW data center cost, $2,500/kW new power, PUE 1.2, 15–30% brownfield space exclusion rising through 2031. Hyperscaler cross-check figures from GS Investment Research via public reporting, June 2026. Chip/component rows in the dashboard from GS equity research (Broadcom, MediaTek, TSMC) and Lee/Schneider memory research, 2026.

**Primary source:** [Tracking Trillions: The Assumptions Shaping the Scale of the AI Build-Out](https://www.goldmansachs.com/insights/articles/tracking-trillions-the-assumptions-shaping-scale-of-the-ai-build-out)`,
    category: "Technology",
    imageUrl: "/images/technology-goldman-sachs-ai-capex-hero.png",
    imageAlt:
      "Goldman Sachs AI capex forecast 2027 2028 — stacked bar chart of compute chips and data center spending on dark navy background",
    publishedAt: "2026-07-28T22:30:00Z",
    featured: true,
    visualization: "goldman-sachs-ai-capex",
    layout: "canvas",
  },
  {
    id: "last-mile-delivery-robotics",
    slug: "global-last-mile-delivery-robotics-2026",
    title: "Charted: 60,000 Delivery Robots — and China Owns 88% of Them",
    excerpt:
      "Neolix and Zelos operate 45,000 road-legal robovans while Starship, Serve, and Coco fight over 7,500 sidewalk bots. The global last-mile robotics race looks nothing like Western headlines suggest.",
    content: `## Two industries, one label

Western coverage frames last-mile delivery robotics as a race between **Starship**, **Serve Robotics**, and **Coco** — each operating 1,000–3,000 sidewalk bots in US and European cities. That story is real, but it describes a **rounding error** in the global fleet.

The interactive chart above tracks **12 operators** with disclosed fleet counts totaling **~60,600 vehicles** as of July 2026. **Chinese robovans** — road-legal vans carrying 200–500 kg for parcel carriers — account for **~53,000 units (88%)**. The entire sidewalk-class fleet worldwide is **~7,600**.

**Neolix** alone fields **25,000+ vehicles** across 300 cities. **Zelos** (merged with Alibaba's Cainiao AV unit in January 2026) operates **20,000+**. Together they outnumber every Western sidewalk operator combined by roughly **six to one**.

## Why China chose a bigger vehicle

The Chinese winners skipped the sidewalk entirely. Instead of 10 kg of takeout for consumers, they built **road-legal vans** for **B2B parcel contracts** with SF Express, China Post, JD Logistics, and DiDi Freight.

That choice changes the economics:

- **Route density** — one van replaces dozens of sidewalk trips
- **Revenue per vehicle** — B2B parcel fees dwarf per-delivery food commissions
- **Regulatory path** — ~300 Chinese cities had unmanned-vehicle frameworks by February 2026

Neolix reported **~$140M revenue** in FY2025 and monthly profitability in H1'25. Zelos signed a **7,000-unit order** with China Post. Serve Robotics — the only listed Western pure-play — guided **$26M revenue** on **~2,000 deployed bots**.

## The Western sidewalk story

Sidewalk-class operators are not idle. **Starship** claims **3,000+ robots** across 300 service areas and says it is profitable. **Serve** is public on Nasdaq (SERV) with **812 daily-active robots** averaging Q1 2026. **Coco** targets **10,000 units** with a **1,000/month production** goal after an **$80M round** in June 2025.

But capital markets have soured. Serve fell from an **$18.64** 52-week high to roughly **$4.81** — a **~$372M market cap** — even as revenue grew **578% year over year**. Investors price the gap between fleet size and revenue: roughly **$13,000 annual revenue per robot**.

## Platforms hold the leverage

Almost no Western operator owns its customer. **Uber Eats** runs Serve, Coco, Cartken, Avride, and historically Nuro. **DoorDash** runs both Coco and Serve. Multi-sourcing is deliberate — it caps per-order pricing and means **no robot vendor can hold a platform hostage**.

Barclays sizes the profit unlocked for delivery platforms at roughly **$16B per year**. ABI Research puts robotic last-mile **revenue** at only **~$260M in 2025** growing to **$1.74B by 2032**. The value accrues to platforms, not robot builders.

## Consolidation and the graveyard

The sector is consolidating fast:

- **Alibaba's Cainiao** folded its AV unit into **Zelos** (Jan 2026)
- **Amazon** bought **RIVR** (Mar 2026), re-entering delivery robotics 3.5 years after killing Scout
- **Serve** acquired **Vayu Robotics** and **Diligent Robotics** (hospital bots)
- **Grab** bought **Infermove/Carri** for Singapore's Punggol testbed (late 2026)

**23 companies** that appear on "top robotics startup" lists are now **acquired, dead, or repositioned** — including programs from **Amazon, FedEx, Waymo, and Alibaba**. Sidewalk-robot VC funding collapsed from **~$1.09B in 2021** to **~$86M in 2025** (Tracxn).

## Where robots actually deploy

City-level counts are rarely published. The best-documented deployments:

| City | Robots | Operators |
|------|--------|-----------|
| Qingdao | 1,200 | Neolix |
| Los Angeles | 800 | Serve, Coco |
| Shenzhen | 432 | Neolix, MINIEYE, White Rhino |
| Abu Dhabi | ~300 | Neolix, Zelos |
| Tokyo | 24 | Rakuten, Panasonic, LOMBY |

Japan remains **demo-scale** — Rakuten's **10 robots** in Chuo Ward is the largest disclosed fleet. Korea is the only APAC market outside China with genuine commercial consumer robot delivery via **Yogiyo/Neubility** and **Baemin/Dilly**.

## What to watch

- **Neolix HK IPO** — targeting 2026 at a **$10–15B** analyst corridor
- **Serve unit economics** — can revenue per robot close the gap with Chinese robovans?
- **Chicago pilot expiry** — May 2027; one alderman froze expansion after **83.7%** ward opposition
- **UK legislation** — Starship says it would place **10,000+ robots** and build a UK factory if pavement law is clarified
- **Grab/Carri Singapore testbed** — eight-operator government program launching late 2026

## Methodology

Fleet counts from company press releases, SEC filings (Serve), Estonian Business Register (Starship subsidiary), and trade press (Caixin, 36Kr, SCMP, TechCrunch) as of **28 July 2026**. Sidewalk class = 10–30 kg PDDs; robovan class = 200–500 kg road-legal vehicles. Drone delivery and indoor-only robots excluded. City counts mix disclosed figures and allocations from company totals (±40% where estimated). Revenue in USD; Chinese figures converted at approximate prevailing rates where cited in RMB.`,
    category: "Technology",
    imageUrl: "/images/technology-last-mile-delivery-robotics-hero.png",
    imageAlt:
      "Global last-mile delivery robotics fleet comparison — Chinese robovans dwarf Western sidewalk robots on a dark navy data visualization",
    publishedAt: "2026-07-28T20:00:00Z",
    featured: true,
    visualization: "last-mile-delivery-robotics",
    layout: "canvas",
  },
  {
    id: "china-fiscal-revenue",
    slug: "china-fiscal-revenue-all-budgets-2024",
    title: "Breaking down China's state revenue",
    excerpt:
      "China raised $5.68T across four parallel budgets in 2024 — land sales, SOE profits, and social insurance sit beside taxes in ways the US system does not. High-level summary and line-by-line breakdown.",
    content: `## The headline number

In 2024, China's Ministry of Finance (MOF) collected **¥408,710 billion** in operating revenue across **four parallel budget systems** — equivalent to roughly **$5.68T in 2025 USD** at ¥7.2/$. That is not one tax code and one treasury. It is a stacked fiscal machine: core taxes, land-finance, state-owned enterprise dividends, and social insurance premiums each run on separate ledgers but all count toward what the Chinese state actually takes in.

The interactive chart above maps all **55 named revenue lines**, normalized to MOF official totals. Hover any row for stream-by-stream commentary.

## Four buckets, one country

- **General Public — $3.05T (54%)** — VAT, income tax, consumption tax, fines, fees
- **Social Insurance — $1.67T (29%)** — Pensions, medical, unemployment, work injury
- **Gov. Funds — $862B (15%)** — Land sales, highway tolls, lottery, earmarked levies
- **State Capital — $94B (2%)** — Central and local SOE profit remittances

Within the general public budget alone, **net tax revenue** is **$2.43T** (after export VAT rebates) and **non-tax revenue** adds **$621B** — much of that from state asset fees and SOE remittances that would look alien on a US Treasury statement.

## What actually drives the number

Three lines account for more than **40%** of all government revenue:

1. **Domestic VAT** (~$833B, 14.7%) — China's single largest tax, shared 50/50 between Beijing and provinces under the 1994 tax-sharing reform. Down 3.8% in 2024 as consumption and industrial output softened.
2. **Enterprise employee pension** (~$791B, 13.9%) — premiums from employers and workers plus **~$1.1T in central fiscal subsidies** embedded in the social insurance budget, not the general public ledger.
3. **Land use rights transfer** (~$676B, 11.9%) — local governments selling 70-year land leases to developers. Down **16%** year over year as the property crisis cut developer demand. This one line is larger than most countries' entire defense budgets.

After that tier: corporate income tax (~$568B), employee medical insurance (~$329B), state asset monetization fees (~$264B), and individual income tax (~$202B) round out the top eight.

## Central vs local: a split the US does not mirror

The 1994 **分税制** (tax-sharing) reform permanently divided China's revenue geography. VAT and income taxes are shared; import duties and most consumption taxes are **100% central**; land sales, deed taxes, and most property levies are **almost entirely local**.

That is why land sales collapsed in 2024 but Beijing's core tax lines held up better — local governments bore the property downturn directly, while the center still collected import VAT, tariffs, and tobacco excise.

Each row in the chart includes an estimated central vs local split based on MOF collection patterns.

## How this differs from the United States

Americans usually think of "government revenue" as **federal receipts** (~$4.9T in FY2024) plus separate state and local taxes (~$2.3T combined). China's **$5.68T figure already embeds all four national budget systems** — it is closer to a consolidated view of what the Chinese state collects than any single US line item.

Several structural differences stand out:

### 1. Land finance has no US equivalent at this scale

**~$676B** from land lease sales sits in the government funds budget — roughly **78% of that entire budget**. US local governments rely on **property tax** (annual levy on assessed value), not the sale of 70-year land rights to developers. China's model tied local infrastructure spending to a property boom; when that boom ended, land revenue fell 16% while Washington's tax base looked different.

### 2. Social insurance is a separate fiscal universe

China's **$1.67T social insurance budget** is a standalone ledger — enterprise pensions, government employee pensions, urban and rural medical funds, unemployment, and work injury. Premiums and employer contributions flow in; Beijing also sends **direct fiscal subsidies** (e.g. ~$115B into the enterprise pension fund alone in 2024).

In the US, **payroll taxes** (Social Security and Medicare) are collected by the federal government and credited to trust funds, but they appear in unified federal budget presentations. Medicare and Social Security are not separate "budget systems" with their own MOF-style execution reports. China's four-budget architecture makes the **scale of social contributions visible as its own fiscal pillar** — nearly 30% of all state revenue.

### 3. The state owns the economy's commanding heights — and collects rent

The **State Capital budget** ($94B) captures dividends and profit income from central SOEs — tobacco, oil, telecom, power, construction. Separately, the general public budget records **~$87B in SOE remittances** and **~$264B in state asset and resource use fees** as non-tax revenue.

The US federal government collects corporate income tax (~$530B FY2024) from all corporations, public and private. It does **not** operate a parallel pipeline where the Treasury directly absorbs profits from hundreds of centrally controlled firms in tobacco, energy, and telecom — because those firms are private. China's fiscal architecture treats **state corporate ownership as a revenue line**, not just a regulatory relationship.

### 4. VAT-first vs income-tax-first

**Domestic VAT** alone is ~17% of China's general public tax haul. The US has **no federal VAT**; state sales taxes total roughly $500B across all states. China's consumption tax architecture front-loads revenue at production and import stages, producing a tax base that tracks industrial output as much as household spending.

Corporate income tax (~$568B in China vs ~$530B federal in the US) looks comparable in dollars, but China's CIT is split 60/40 central/local and heavily influenced by SOE and property-sector cycles.

### 5. One MOF, four books — vs federalism without a consolidated view

The US fiscal picture requires adding **federal + 50 state + thousands of local** jurisdictions, each with different accounting standards, and even then land-lease finance and SOE dividends do not exist at China's scale.

China's MOF publishes **four budget execution reports** that sum to a single national operating total. That transparency is unusual — and it reveals revenue streams (land, SOE, social premiums) that are **economically material but invisible** in a US Treasury-only framing.

## What is missing from this total

This dataset is **operating revenue only**. It excludes **¥49,000B (~$680B) in bond proceeds** from special treasury and ultra-long bonds issued in 2024 — financing inflows, not recurring receipts.

It also excludes **off-balance local government financing vehicle (LGFV) activity**, hidden subsidies, and quasi-fiscal credit — the shadow balance sheet that makes China's true fiscal footprint larger than MOF tables alone.

## How to use the chart

- **Bar width** = each line's share of the full **$5.68T** total across all four budgets
- **Bar color** = which budget system the revenue belongs to
- **Hover** any row for analyst commentary, central/local split, and 2024 context

## Methodology

All figures from MOF **2024 budget execution reports** (published March 2025). Source amounts in **亿元** (CNY 100M). Converted to **2025 USD** at **¥7.2/$** (2024 annual average). Line items normalized to official MOF totals (¥219,702B general public · ¥62,090B gov. funds · ¥6,783B state capital · ¥120,135B social insurance). Export VAT rebates netted from gross positive tax lines. US comparison figures from CBO FY2024 actuals and Census state/local summary for orientation — not a strict apples-to-apples consolidation.`,
    category: "Politics",
    imageUrl: "/images/finance-china-state-revenue-hero-v2.png",
    imageAlt: "Breaking down China's state revenue — yuan, gold, and sovereign fiscal power",
    publishedAt: "2026-07-06T01:00:00Z",
    featured: true,
    visualization: "china-fiscal-revenue",
    layout: "canvas",
  },
  {
    id: "ccp-nomenklatura",
    slug: "ccp-nomenklatura-hierarchy-2026",
    title: "Inside the CCP's Nomenklatura — From 2,300 Delegates to 7 Power Brokers",
    excerpt:
      "From 2,300 National Congress delegates to the seven-member Politburo Standing Committee — an interactive map of who holds power, what they control, and how the Party staffs the Chinese state.",
    content: `## Methodology

Leadership roster compiled from CRS IF12505 (Apr 2026), 20th Central Committee plenum records, and official state media as of **April–July 2026**. Status flags reflect publicly reported investigations and expulsions. Employee headcount and budget estimates in the source research use MOHRSS civil-service statistics, IISS military data, and MOF central department reports where available.`,
    category: "Politics",
    imageUrl: "/images/politics-ccp-nomenklatura-hero.png",
    imageAlt: "CCP nomenklatura hierarchy — from National Congress delegates to the seven-member Politburo Standing Committee",
    publishedAt: "2026-07-06T00:00:00Z",
    featured: true,
    visualization: "ccp-nomenklatura",
    layout: "canvas",
  },
  {
    id: "ai-data-centers",
    slug: "global-ai-data-center-build-tracker",
    title: "Mapped: The Global AI Data Center Boom — 107 Megaprojects Racing for Power",
    excerpt:
      "Stargate, Meta Hyperion, xAI Colossus, and 100+ more — every major AI data center build tracked by site, country, cost, IT load, and completion timeline.",
    content: `## The terawatt arms race

Hyperscalers and neoclouds are building AI infrastructure faster than the grid can keep up. OpenAI's **Stargate** program alone spans multiple gigawatt-scale campuses across Texas, Michigan, and the UAE. Meta is planning **5 GW at Hyperion** in Louisiana. xAI's **Colossus** campuses in Memphis and Mississippi are already live while Colossus 3 ramps in 2026.

The interactive tracker above maps **107 publicly announced AI-focused sites** across seven regions — from 38 MW in Lagos to 15 GW in China's national AI grid program. Filter by region and status, sort by IT load or estimated cost, and explore regional share in the charts.

## North America dominates planned load

The US and Canada account for the bulk of tracked megawatt capacity: Stargate, Fairwater, Project Rainier, Meta Prometheus/Hyperion, CoreWeave, Crusoe, and dozens of greenfield gigasites in Wyoming, Utah, and Indiana. BloombergNEF counted **~16 GW under construction in the US alone** as of late 2025 — this tracker captures the named projects driving that figure.

## Power is the product

Annual energy in the table assumes **90% capacity factor** on disclosed IT load (MW × 8,760 hours × 0.9). A single 1 GW campus can draw nearly **8 TWh per year** — comparable to a small country's electricity consumption. That is why developers are signing nuclear PPAs, building behind-the-meter gas, and siting in Malaysia, India, and Poland where grid queues are shorter.

## Cost estimates are messy

Disclosed capex ranges from **$720M** (Ascenty São Paulo) to **$400B** (Stargate program-level). Many rows show "Part of …" or "Undisclosed" because hyperscalers bundle shell, power, and GPU fit-out differently. The cost rollup chart sums only rows with parseable dollar figures — umbrella programs are excluded to avoid double counting.

## What to watch

- **2026 completions:** Stargate Abilene, Fairwater Wisconsin, AWS Rainier phases, and dozens of neocloud halls targeting H2 2026
- **Grid bottlenecks:** Tokyo and Seoul queues stretch 7–10 years — pushing builds to Southeast Asia and the Middle East
- **China's parallel build:** NDRC's **$295B** national AI infrastructure program targets 15 GW across Guizhou, Inner Mongolia, and Ningxia hubs

## Methodology

Site list compiled from public announcements, SEC filings, press releases, and industry trackers (BNEF, McKinsey/JLL) as of **June 2026**. IT load figures reflect developer-disclosed peak capacity, not always energization dates. Status: Operational, Partially Live, Under Construction, or Planned. This is not exhaustive of every colocation or enterprise facility globally.`,
    category: "Technology",
    imageUrl: "/images/technology-ai-data-centers-hero.png",
    imageAlt: "107 AI megaprojects — the global race for terawatts of data center power",
    publishedAt: "2026-07-05T23:30:00Z",
    featured: true,
    visualization: "ai-data-centers",
    layout: "canvas",
  },
  {
    id: "ai-packaging-bottleneck",
    slug: "ai-gpu-packaging-memory-bottleneck-2025",
    title: "Charted: The Real AI GPU Bottleneck — HBM Memory & CoWoS Packaging, Not 3nm Fabs",
    excerpt:
      "TSMC CoWoS is sold out through 2026 while HBM hits $46.7B — SK hynix, Amkor, and OSAT partners matter more than another fab line. 27 sourced supply-chain records across capacity, demand, and allocation.",
    content: `## The bottleneck moved downstream

Headlines still obsess over **3nm and 2nm wafer capacity** at TSMC and Samsung. But in 2025 the binding constraint on AI accelerator shipments shifted to **two packaging layers**: **High Bandwidth Memory (HBM)** stacked beside the GPU die, and **CoWoS** (Chip-on-Wafer-on-Substrate) — the only production-proven 2.5D integration technology that wires them together.

TSMC Chairman C.C. Wei said CoWoS was **sold out through 2025 and into 2026**. Every NVIDIA Blackwell, AMD MI300, and Google TPU needs both a CoWoS slot and an HBM allocation. Without both, a finished AI GPU cannot ship — no matter how many front-end wafers exist.

The interactive chart above tracks **27 sourced supply-chain records** across HBM vendors, CoWoS capacity, customer allocations, and OSAT outsourcing.

## HBM: a $46.7B market sold out

TrendForce projects the global HBM market reaches **$46.7 billion in 2025** — up **156%** from $18.2B in 2024. HBM will account for **34% of total DRAM revenue** and **85% of HBM shipments will be HBM3E**, driven by NVIDIA Blackwell.

The supplier hierarchy is stark:

- **SK hynix — 52.3%** HBM market share (TrendForce, Aug 2025); sold out for 2025, taking 2026 orders
- **Samsung — 28.7%**; down from 41% as 12-hi HBM3E NVIDIA verification lagged
- **Micron — 19.0%**; ramping Idaho and Malaysia lines toward 20–25% share

NVIDIA alone drove an estimated **27% of SK hynix total revenue** in 1H25 — more than any other customer in the company's history. BofA forecasts HBM TAM reaches **$54.6B in 2026** (+58% YoY).

## CoWoS: capacity doubles, demand triples

TSMC expanded CoWoS from roughly **37,500 wpm at end-2024** to a target of **75,000 wpm by end-2025** — nearly doubling output via AP8 (ex-Innolux) and Taichung lines. The 2026 target: **120,000–130,000 wpm**.

Yet demand outruns supply:

| Year | CoWoS demand | TSMC capacity (annualized) |
|------|-------------|---------------------------|
| 2024 | ~370K wafers | ~450K wafers |
| 2025 | ~670K wafers | ~900K wafers |
| 2026 | ~1.0M wafers | ~1.5M wafers (target) |

Even at the 2026 capacity target, lines stay **fully booked** with **52–78 week lead times**. Capacity growth ≠ availability when demand grows faster.

## Who gets the slots?

**NVIDIA** dominates allocation: an estimated **400,000 CoWoS wafers in 2025** (~60% of TSMC output), rising to **700,000 in 2026** as Blackwell Ultra and Vera Rubin ramp. The remainder is split among AMD (~55K), Google (~80K rising to 240K target), Broadcom custom ASICs (~40K), and Marvell.

Google's TPU v7 push illustrates the squeeze: target demand of **240,000 wafers in 2026**, but GlobalSemiResearch estimates TSMC can deliver only **150,000–180,000** — enough for ~3.2M TPUs against a ~6M unit goal.

## OSAT: TSMC's relief valve

TSMC is outsourcing a growing share of CoWoS workload to OSAT partners:

- **Amkor — 180,000–190,000 wafers/yr** (2026), Arizona and Vietnam
- **SPIL/ASE — 60,000–80,000 wafers/yr** (2026), Taiwan
- **Combined OSAT — 240,000–270,000 wafers/yr**

NVIDIA reportedly outsources **50% of CoWoS in 2025** and **70–80% in 2026** as CoWoS-L complexity rises. OSAT is not a full substitute — TSMC retains CoWoS-L with silicon bridge interposers — but it relieves CoWoS-S substrate bottlenecks.

## Why this is not a fab problem

Leading-edge **N2 and A16 nodes** at TSMC are also tight, but the queue mechanics differ. Fab capacity expands on predictable cadences; CoWoS requires **specialized cleanroom bays, interposer fabs, and substrate supply chains** that cannot be cloned in 12 months. HBM needs **TSV drilling, stacking, and logic-die proximity** that conventional DRAM lines cannot produce.

The compound constraint: a single B200 module needs **~192GB HBM3E** (8 stacks × 24GB) **and** a CoWoS-L package **and** a reticle-limited 4NP logic die. Missing any one component zeros the shipment.

## What to watch in 2025–2026

- **HBM4 qualification** for NVIDIA Vera Rubin — SK hynix and Samsung both qualified by mid-2026
- **CoWoS-L to CoPoS transition** — TSMC's next-gen panel-level packaging for 2027+
- **Amkor Arizona ramp** — first major US advanced-packaging volume for AI chips
- **Samsung HBM recovery** — whether 12-hi HBM3E share recovers or Micron takes slot 3 permanently
- **Custom ASIC HBM demand** — Goldman projects +82% YoY for ASIC-attached HBM, diversifying beyond NVIDIA
- **CoWoS pricing** — packaging BOM reportedly +20% on AI accelerator builds in 2026

## Methodology

Supply-chain records compiled from **TrendForce** (HBM market sizing, supplier share, CoWoS capacity), **TSMC investor disclosures** (C.C. Wei, Jun He), **SK hynix** investor materials, **Silicon Analysts** CoWoS capacity tracker, and **GlobalSemiResearch** customer allocation estimates. Primary data year **2025**; 2026 figures are publicly sourced forecasts and capacity targets, not realized output. CoWoS capacity in wafer starts per month (wpm); annual demand in wafers per year. HBM market share figures are TrendForce revenue-based estimates (Aug 2025). OSAT outsourcing figures trace to GlobalSemiResearch sell-side models — medium confidence, single-source. This dataset tracks the packaging/memory bottleneck specifically; it does not include leading-edge fab utilization or substrate (ABF) supply, which are separate constraints.`,
    category: "Technology",
    imageUrl: "/images/technology-ai-packaging-bottleneck-hero.png",
    imageAlt:
      "HBM memory stacks and CoWoS packaging wafer — the binding AI GPU supply-chain bottleneck beyond 3nm fabs",
    publishedAt: "2026-07-11T00:00:00Z",
    featured: true,
    visualization: "ai-packaging-bottleneck",
    layout: "canvas",
  },
  {
    id: "ai-token-consumption",
    slug: "major-ai-brands-token-consumption-2022-2026",
    title:
      "Charted: Chinese Models Now Process More AI Tokens Than American Ones (2022–June 2026)",
    excerpt:
      "19 providers, 836 monthly records. ByteDance's Doubao alone claims 180 trillion tokens a day — more than China's own government says the entire country processes. Chinese models passed American ones on OpenRouter in February 2026, and the gap between what companies claim and what the market pays for is the real story.",
    content: `## The blind spot in every Western token chart

Tokens are the atomic unit of AI economics — they drive inference cost, API pricing, and data centre power draw. Almost no lab publishes a clean "tokens processed" figure, so most public estimates are built from whatever US companies happen to mention on stage.

That produces a badly distorted picture. An earlier version of this dataset tracked eight American and Canadian brands and put global volume near 3.8 quadrillion tokens a month. **It was missing the single largest token processor on earth, and eight more Chinese providers behind it.**

The rebuilt dashboard above tracks **836 monthly records** across **19 providers** — ten Chinese, seven American, plus Mistral and Cohere — from November 2022 through June 2026. Rows sitting on a published figure are flagged **disclosed**; the rest are interpolated between anchors.

## The numbers do not reconcile, and that is the story

China's National Data Administration says the **entire country** processes 140 trillion tokens a day (March 2026). ByteDance says **one of its model families** does 180 trillion. Both cannot be true on a common basis.

At Volcano Engine's FORCE conference in June 2026, president Tan Dai disclosed that the **Doubao model family processes over 180 trillion tokens per day** — roughly **5.4 quadrillion per month**, or 1,500x its May 2024 launch volume. ByteDance has published a figure at nearly every FORCE conference since December 2024, which makes it the fullest public series of any provider on earth:

| Date | Tokens per day | Monthly equivalent |
|------|----------------|--------------------|
| May 2024 (launch) | 120B | 3.6T |
| Dec 2024 | 4T | 120T |
| Mar 2025 | 12.7T | 381T |
| Sep 2025 | 30T | 900T |
| Dec 2025 | 50T | 1,500T |
| Mar 2026 | 120T | 3,600T |
| **Jun 2026** | **180T** | **5,400T** |

Tan Dai also confirmed the crucial caveat himself: the figure **"includes both internal and external use, as well as usage within the Doubao App itself."** It is a company-wide inference meter, not a sales figure.

That makes it comparable to exactly one Western number. Google disclosed **3.2 quadrillion tokens per month** at I/O 2026 — also all-surfaces, spanning Search, YouTube, Workspace and Gemini — up 7x from 480 trillion a year earlier. OpenAI and Anthropic disclose nothing at all; OpenAI's only public throughput figure is **15 billion API tokens per minute** as of March 2026.

Doubao's claim exceeding Google's, on a far smaller user base, should not be read as a clean result. ByteDance credits AI **video generation** for much of the growth, and video tokenises into enormous counts. The company has not published its counting rules.

## What the market actually pays for

Set the headline claims aside and look at what customers buy. IDC measures public-cloud model services sold to **external customers only**, explicitly excluding first-party calls from Douyin, the Doubao app and Jimeng. On that basis China ran **1,944 trillion tokens across all of 2025** — about 5.3T/day, against headline claims 10 to 20 times larger.

The revenue attached to that volume is the most striking number in the dataset. China's entire public-cloud model market earned **RMB 3.07 billion (~$430 million)** in 2025. That works out to roughly **22 cents per million tokens**, blended nationwide. Vercel's gateway data shows the same divergence from the demand side: DeepSeek took 17% of routed token volume while accounting for about 1% of spend.

A useful rule of thumb: **divide Chinese headline figures by five to ten** to approximate commercially-served tokens.

## February 2026: the crossover

The cleanest evidence comes from **OpenRouter**, which routes third-party developer traffic across labs and publishes volume by model. What makes it credible is its audience: **47% of its developers are American and only 6% are Chinese**, so Chinese models winning there reflects global demand, not domestic accounting.

In the week of **9–15 February 2026**, Chinese models processed **4.12 trillion tokens** against **2.94 trillion** for American models — the first time Chinese models led. They have held the lead since. By mid-2026 Chinese-origin models were **46.4%** of all routed volume against 35.7% for American ones. Anthropic's share halved from 29.1% to 13.3% in twelve months; Meta's Llama fell below 1%.

Beware the higher numbers in circulation. Widely-quoted figures of 61% are single-week, top-ten-only measurements. The defensible all-model figure is 46%.

## Price is the mechanism — but it is now reversing

Developers switched on cost per unit of work, not benchmark scores:

| Model | Lab | Origin | $/M in | $/M out |
|-------|-----|--------|--------|---------|
| GPT-5.5 | OpenAI | US | $5.00 | — |
| Qwen3.7-Max | Alibaba | China | $2.50 | $7.50 |
| Kimi K2.6 | Moonshot | China | ~$0.90 | ~$3.75 |
| Mistral Large 3 | Mistral | Europe | $0.50 | $1.50 |
| DeepSeek V4 Pro | DeepSeek | China | $0.435 | $0.87 |
| Tencent Hy3 | Tencent | China | ~$0.14 | ~$0.56 |
| DeepSeek V4 Flash | DeepSeek | China | $0.14 | $0.28 |
| MiMo-V2.5 | Xiaomi | China | $0.14 | $0.28 |

DeepSeek V4 Pro's output price sits roughly **34x below GPT-5.5**. Cache-hit discounts go further still — DeepSeek charges $0.0028 per million on cached input, optimising hard for repetitive agentic prefill.

**But the "China is cheap" story is inverting, and almost nobody has written it.** Zhipu raised API prices **83%** cumulatively and still reports customers queuing. Alibaba told analysts its "ability to supply this demand is not able to keep up" and expects to **raise** prices while costs fall. Kimi K3 launched in July 2026 at premium pricing rather than undercutting. Alibaba Cloud raised AI compute prices up to 34% in March 2026. The 2024–25 price war is over; the binding constraint has moved from demand to supply.

Two structural factors still amplify Chinese volume. **Open weights** mean DeepSeek, Qwen and GLM run on hardware their authors do not own and cannot meter — Qwen passed **1 billion cumulative Hugging Face downloads** in January 2026, overtaking Llama, with 200,000+ derivative models. Every Chinese token figure is therefore a floor. And **agentic workloads** multiply consumption: the open-source agent framework OpenClaw, which spread across every Chinese cloud in weeks from February 2026, can burn 200,000 tokens in a single session. Coding rose from 11% of OpenRouter tokens in early 2025 to over 50% by year-end.

## The official Chinese numbers

China is the only country publishing an official national series:

- **Early 2024:** ~100 billion tokens/day
- **June 2025:** over 30 trillion/day
- **End 2025:** 100 trillion/day
- **March 2026:** over 140 trillion/day

Frost & Sullivan's enterprise study — which includes private and on-premises deployment — found corporate calls rising from 10.2T/day in H1 2025 to **37.0T/day in H2 2025**, with Alibaba Qwen at 32.1% share, Doubao at 21.3% and DeepSeek at 18.4%.

Note that IDC and Frost & Sullivan rank different leaders and **both are correct**. IDC covers external public cloud only and puts Volcano Engine first at 49.5%. Frost & Sullivan includes private deployment, where open-weight Qwen dominates. The two share tables must never be combined.

## Read these numbers carefully

1. **Headline figures are company-wide meters, not sales.** ByteDance's own executives say so. Only ByteDance and Google publish on a comparable all-surfaces basis.
2. **Summing providers overshoots the national total by about 64%** — open weights get re-served by third-party clouds and counted twice.
3. **Chinese tokenisation is a red herring.** Measured on identical meaning, Chinese needs only 8–12% more tokens on Chinese-native tokenizers. It explains almost none of the volume gap.
4. **The unit itself is unstable.** Reasoning models emit far more tokens per answer than 2023-era chat, and agentic requests use roughly 15x more tokens than human chat. A meaningful part of the "1,000x growth" is redefinition, not usage.
5. **Two crossover dates, both real.** DeepSeek's R1 moment briefly put Chinese providers ahead in early 2025 before US providers regained the lead; the durable crossover in this dataset is January 2026. On OpenRouter's routed traffic it is February 2026.

## What to watch

- **Whether US labs start disclosing** — Google publishes throughput every quarter; OpenAI and Anthropic still do not
- **Huawei's memory supply** — DeepSeek has said further price cuts depend on Ascend 950 supernodes scaling. The real ceiling is CXMT's HBM stacking yield, not logic dies, which makes Chinese token prices a function of Chinese memory yield
- **Whether rising prices slow adoption** — the switching argument weakens if the 30x spread compresses
- **DeepSeek's shape** — its curve is non-monotonic, and charts drawing it as smooth exponential growth are wrong
- **A standardised metric** — an audited "tokens served" definition would resolve most of the ambiguity here`,
    category: "Technology",
    imageUrl: "/images/technology-major-ai-brands-token-consumption-2022-2026-hero.png",
    imageAlt:
      "Global AI token consumption 2022–2026 — Chinese providers led by ByteDance Doubao overtake US providers in monthly token volume",
    publishedAt: "2026-07-10T18:00:00Z",
    featured: true,
    visualization: "ai-token-consumption",
    layout: "canvas",
  },
  {
    id: "deflationary-growth-2025",
    slug: "deflationary-growth-economies-2025",
    title: "Charted: 18 Economies That Grew in 2025 While Prices Fell",
    excerpt:
      "Real GDP expanded and CPI YoY went negative — from China and Taiwan to Ireland and Hong Kong. 18 sourced economy records challenge the idea that growth requires inflation.",
    content: `## Growth without inflation?

Textbook macroeconomics links **strong GDP growth** to **rising prices** — demand pulls output up, wages follow, and CPI climbs. 2025 broke that pattern in **18 major economies** where **real GDP grew** while **headline CPI YoY turned negative**.

The interactive chart above maps each economy on GDP growth vs CPI deflation, sized by export share of GDP. Hover any point for source attribution and strategy notes.

## Who made the list?

The pattern is not random. **14 of 18** economies in the dataset export more than **50% of GDP**. The fastest growers were not inflation hawks — they were **export-heavy economies cutting prices to grab market share**:

| Economy | GDP 2025 | CPI YoY | Export share |
|---------|----------|---------|--------------|
| Vietnam | +6.5% | −0.1% | 86% |
| Macao SAR | +5.8% | −0.5% | 85% |
| China | +5.0% | −0.2% | 19% |
| Ireland | +4.8% | −0.4% | 125% |
| Taiwan | +4.6% | −0.3% | 63% |

Hong Kong posted the **deepest deflation** (−0.8% CPI) alongside **+2.5% GDP** — rent collapse met re-export trade recovery. Switzerland and Ireland show the European variant: strong franc/euro purchasing power imported disinflation while financial and pharma exports kept output growing.

## Three mechanisms, one theme

1. **Export pricing wars** — Taiwan semiconductors, Korean memory, Vietnamese assembly: volumes up, unit prices down
2. **Imported disinflation** — Gulf states, Singapore, Luxembourg: pegged or open economies pass through global goods deflation
3. **Base-effect normalization** — Thailand, Czech Republic, Poland: energy and food prices fell after 2022–23 spikes while real activity recovered

None of these look like **demand-collapse deflation** (1930s or Japan 1990s). Output expanded. Employment held. Prices fell because producers **chose** to compete on cost.

## Methodology

Records compiled from **IMF WEO Oct 2025**, **World Bank Global Economic Prospects 2025**, **OECD Economic Outlook 2025**, and **national statistics offices**. Inclusion requires **gdpGrowthPct2025 > 0** and **cpiYoYPct2025 < 0** (Dec 2025 vs Dec 2024 unless noted). Rows flag **disclosed** (official final print) vs **estimated** (IMF/OECD projection where national CPI final pending).

## The unintuitive takeaway

Here is the punchline textbooks skip: in 2025, **deflation was not the villain — it was the weapon**. The economies that grew fastest did not inflate their way to prosperity; they ** grew by getting cheaper**. Export champions from Vietnam to Taiwan treated falling prices as a **competitive strategy**, not a symptom of collapse — undercutting rivals, filling shipping containers, and letting volume make up for margin. So the next time someone says you cannot have growth without inflation, ask which century's supply chain they are modeling — because 18 countries just did exactly that, and their factories were running overtime while CPI printed red.`,
    category: "Economics",
    imageUrl: "/images/economics-deflationary-growth-economies-2025-hero.png",
    imageAlt:
      "Deflationary growth economies 2025 — scatter chart of GDP growth versus falling CPI across 18 export-heavy countries",
    publishedAt: "2026-07-11T03:00:00Z",
    featured: true,
    visualization: "deflationary-growth-2025",
    layout: "canvas",
  },
  {
    id: "brokerage-bonuses",
    slug: "us-brokerage-fintech-investing-bonuses",
    title: "US Finance Referral Programs — Master Table",
    excerpt:
      "663 referral programs across banks, credit cards, investing, crypto, lending, and more — who pays what, payout tiers, requirements, and annual cost.",
    content: "",
    category: "Finance",
    imageUrl: "/images/finance-referral-programs-hero.png",
    imageAlt: "663 US finance referral programs — who pays you to refer friends",
    publishedAt: "2026-07-05T22:30:00Z",
    featured: true,
    visualization: "brokerage-bonuses",
    layout: "fullscreen",
  },
  {
    id: "subsidies-tariffs",
    slug: "us-industrial-subsidies-vs-tariffs-30-years",
    title: "Charted: 30 Years of US Industrial Subsidies vs Tariff Revenue",
    excerpt:
      "From farm bills to CHIPS and IRA: how much Washington spends distorting markets through subsidies and tax breaks — and whether tariff collections are starting to catch up.",
    content: `## Two sides of industrial policy

For three decades, the federal government has used two blunt instruments to reshape American industry: **direct subsidy outlays** (grants, loan programs, farm payments) and **industrial tax expenditures** (R&D credits, oil-and-gas preferences, clean-energy credits, manufacturing ITCs). On the other side of the ledger sits **customs-duty revenue** — what importers pay when goods cross the border.

The interactive charts above compare both sides in real 2025 US dollars, year by year from 1996 through 2025. Toggle components to isolate BEA outlays, Treasury tax breaks, or housing subsidies.

## The long subsidy lead

For most of this period, total market-distorting support **far exceeded** tariff collections. In the late 1990s, federal support ran roughly **3.6×** customs duties. Direct outlays and industrial tax breaks were each near **$35–40B** annually — tariffs hovered around **$20B**.

Tax expenditures did much of the heavy lifting. Treasury estimates for R&D credits, energy preferences (fossil and clean), agriculture deductions, and manufacturing depreciation consistently outpaced visible grant programs. Housing and community-service subsidies also appear in the BEA outlay totals — use the **Industrial (excl. housing)** preset if you want a tighter industrial lens.

Over the full 1996–2025 window, total support averaged **3.5×** tariff revenue.

## Trade war tariffs

The first major break in the tariff series came in **2018**, when Section 301 duties on China pushed customs revenue up **38%** year over year. By **2019**, tariffs reached **$78B** — the highest level before 2025 — yet total support still exceeded collections by roughly **1.7×**.

Tariffs are a tax on imports; they do not directly subsidize domestic production. But they raise revenue that can, in theory, offset the fiscal cost of industrial support. For most of the 2010s, that offset was modest.

## CHIPS, IRA, and the new industrial stack

**2022** marked a structural shift. The CHIPS and Science Act and Inflation Reduction Act did not create standalone Treasury line items — they flow into shared tax-expenditure buckets:

- **§48D** semiconductor fab ITC → Treasury commerce/manufacturing tax expenditures
- **IRA** clean-energy credits → Treasury energy tax expenditures
- **IRA** manufacturing and domestic-content credits → Treasury commerce/manufacturing

From 2022 onward, energy and commerce tax-expenditure toggles show visible ramps as credits take effect. Direct CHIPS manufacturing grants are not included in this dataset — only the tax-credit side is captured here.

## 2025: tariffs overtaking support?

BEA's latest estimate puts **2025** customs duties at **~$265B** under expanded tariff policies — **exceeding total support (~$187B) for the first time in this 30-year window**. That flips the net gap to roughly **−$78B**: tariffs collecting more than subsidies and tax breaks cost, before counting broader fiscal effects.

This is preliminary. BEA tariff estimates move with trade volumes, duty rates, and legal challenges. Support totals also shift as IRA and CHIPS credits ramp and as Congress extends or lets expire existing preferences.

### Pivotal years

- **2005:** Energy Policy Act locks in future energy tax credits; farm outlays spike
- **2009:** ARRA adds renewable-energy tax credits; tariffs fall with import collapse
- **2017:** Tax Cuts and Jobs Act reshapes corporate depreciation and energy credits
- **2018:** Section 301 tariffs on China — first major tariff surge
- **2020:** COVID recession — tariff collections dip on lower import volumes
- **2022:** CHIPS Act and IRA enacted — industrial support enters a new era
- **2025 (est.):** Expanded tariffs exceed total support for the first time

## What to watch next

Three dynamics will define the next chapter:

- **Tariff regime durability:** Court challenges, trade negotiations, and retaliatory duties will move the revenue line faster than subsidy outlays
- **IRA/CHIPS credit uptake:** Treasury tax-expenditure estimates will rise as fabs come online and clean-energy projects reach COD
- **Fiscal trade-offs:** If tariffs stay elevated, Congress faces less pressure to offset industrial support with new revenue — or more pressure to expand subsidies to protect domestic firms hit by retaliation

## Methodology

**Subsidy outlays** — BEA federal current expenditure subsidies by function (G17098 housing · G17093 agriculture · G17095 natural resources · G17096 transportation). **Industrial tax expenditures** — U.S. Treasury Tax Expenditure reports, Table 1 industrial categories (R&D, energy, natural resources, agriculture, commerce/manufacturing, transportation). **Tariff revenue** — BEA customs duties (B235RC1A027NBEA). All figures rebased to real 2025 US dollars using US CPI (World Bank FPCPITOTLZGUSA). Tax expenditure subcategories cannot be summed perfectly due to interaction effects (Treasury warning). This measures federal cash flows and revenue foregone, not full economic incidence on consumers or exporters.`,
    category: "Politics",
    imageUrl: "/images/politics-subsidies-tariffs-hero.png",
    imageAlt: "30 years of US industrial subsidies versus tariff revenue — tariffs overtake in 2025",
    publishedAt: "2026-07-05T22:00:00Z",
    featured: true,
    visualization: "subsidies-tariffs",
  },
  {
    id: "gdp-analysis",
    slug: "china-us-india-gdp-30-years",
    title: "Charted: 30 Years of GDP — China, the US & India",
    excerpt:
      "From $738B to $20T: how China closed the gap with America, why India is rising, and what per-capita income reveals about the real story.",
    content: `## The great divergence

The line chart above tells a story of two speeds. America's economy grew steadily — tech booms, housing busts, pandemic stimulus — but never at the breakneck pace of an industrializing China. From WTO accession in 2001 through the 2008 stimulus and the 2010s property boom, China repeatedly posted double-digit real growth that translated into massive USD gains.

India's arc is quieter but unmistakable. Liberalization in the 1990s, the IT services revolution, and a young demographic profile pushed GDP from $760B to $4T. In several recent years, India has actually outpaced China in growth rate — a shift visible in the growth-gap charts.

## China closing the gap

Perhaps the most striking single metric is China's GDP as a percentage of America's. It crossed the halfway mark around 2011–2012, peaked near 70% in 2020, and has moderated slightly as China's property sector cooled and the yuan softened.

Absolute convergence does not mean parity. American GDP per capita remains roughly **6× higher** than China's and **8× higher** than India's. Population is the denominator that changes everything: China peaked at 1.41 billion and is now declining; India surpassed China as the world's most populous nation in 2023.

## Growth rate face-off

Who outgrew whom, year by year? Over the full 30-year window, China beat US growth by an average of **+5.8 percentage points** per year. India beat the US by **+3.2 pp**. China beat India by **+2.6 pp** — but that gap has narrowed dramatically in the 2020s.

### Pivotal years

- **2001:** China joins the WTO — locks in lower tariffs and becomes the anchor of global manufacturing supply chains
- **2008:** Financial crisis — China launches a $586B stimulus; USD GDP spikes 25% YoY while the US contracts
- **2020:** COVID — China is the only major economy with positive growth; China reaches 70% of US GDP
- **2023:** India overtakes the UK as fifth-largest economy; China reopens after zero-COVID but consumer confidence stays weak
- **2026 (est.):** IMF projects China at $20.9T, US at $32.4T, India at $4.2T — together representing roughly half of world GDP

## Per-capita: the human scale

Aggregate GDP dazzles, but per-capita income tells you how ordinary people live. In 2026 (est.):

- **United States:** ~$91,000 per person
- **China:** ~$14,400 per person
- **India:** ~$2,700 per person

China's middle class is real and growing — hundreds of millions lifted out of poverty since 1995. But the average Chinese citizen still earns a fraction of their American counterpart. India's challenge is scale: enormous growth potential, but starting from a much lower base.

## What to watch next

Three forces will shape the next decade of this rivalry:

- **Demographics:** China's shrinking workforce vs India's youth bulge
- **Technology:** AI, semiconductors, and export controls reshaping who captures value
- **Property & debt:** China's real estate slump and local-government debt remain unresolved headwinds

Absolute GDP parity between China and the US could arrive by the 2030s if current trajectories hold. Per-capita parity is a story for mid-century — if it happens at all.

## Methodology

All GDP figures are rebased to constant 2025 US dollars using the US CPI (World Bank FPCPITOTLZGUSA). Year-over-year growth rates are computed from those rebased levels. Population data from World Bank WDI; 2025–2026 GDP from IMF WEO April 2026. Exchange-rate movements still affect how foreign economies appear in USD, but inflation is stripped out for apples-to-apples comparison.`,
    category: "Economics",
    imageUrl: "/images/economics-gdp-china-us-india-hero.png",
    imageAlt: "China, US, and India GDP race over 30 years — who wins next",
    publishedAt: "2026-07-05T17:00:00Z",
    featured: true,
    visualization: "gdp-analysis",
  },
  {
    id: "electricity-generation-mix",
    slug: "global-electricity-generation-mix-2024",
    title: "Mapped: How Every Major Economy Powers Its Grid in 2024",
    excerpt:
      "Coal still supplies a third of world electricity — but France runs on nuclear, Brazil on hydro, and the US on gas. Compare generation mix across 21 economies totaling 30.9 PWh.",
    content: `## The global split

In 2024 the world generated **30.9 PWh** of electricity. Fossil fuels still account for **59.1%** of that total — coal alone delivers **34.3%**, more than hydro, nuclear, solar, and wind combined. Yet the picture varies wildly by country: Norway and Sweden exceed **98% low-carbon** generation, while India and South Africa remain above **75% fossil**.

The interactive chart above compares **21 major economies** plus the world aggregate. Filter by region, sort by total generation or coal share, and inspect source-by-source breakdowns for each grid.

## Coal's last strongholds

Coal remains the dominant fuel in **China (58%)**, **India (75%)**, **Indonesia (61%)**, **Poland (54%)**, and **South Africa (82%)**. China alone produced **10.1 PWh** in 2024 — roughly one-third of global output — and still relies on coal for nearly three-fifths of its mix despite record solar and wind installations.

The US has moved faster: coal fell to **14.9%** of American generation in 2024, displaced by **42.5% gas** and rising wind and solar. The UK is effectively off coal (**0.8%**), leaning on **30% wind**, **30% gas**, and **14.5% nuclear**.

## Gas, hydro, and nuclear anchors

Natural gas is the backbone of several large grids:

- **Mexico:** 60.8% gas — cheap US pipeline imports and peaker plants
- **Russia:** 44.4% gas — domestic reserves feed both export and home demand
- **Saudi Arabia:** 63.3% gas plus **34.5% oil** — almost entirely fossil
- **United States:** 42.5% gas — the shale revolution reshaped the fuel mix this century

Hydro defines **Brazil (55.7%)**, **Canada (55.3%)**, **Norway (88.7%)**, and **Vietnam (31.3%)**. Nuclear anchors **France (68%)** and **South Korea (30.3%)**, while Germany exited nuclear entirely in 2023 and replaced capacity with **28% wind** and **15% solar**.

## Renewables acceleration

Solar and wind are no longer niche. **Germany** gets **43%** of generation from wind and solar combined. **Australia** reaches **29.5%**. Even **China** — often framed as a coal story — generated more absolute wind and solar TWh than any other country in 2024 because of scale.

Globally, solar reached **6.9%** and wind **8.1%** of generation. Add hydro and the low-carbon share crosses **40.9%** — a milestone, but still short of what IPCC pathways require for a 1.5°C-aligned power sector by mid-century.

## Why the mix matters

Electricity is the lever for decarbonizing transport, buildings, and industry. A grid dominated by coal — as in India or South Africa — means every new EV or heat pump inherits a carbon-intensive upstream fuel. Conversely, France and Sweden offer near-zero-carbon power for electrification.

For investors and policymakers, generation mix signals:

- **Energy security:** gas-importing Europe vs. resource-rich North America and Middle East
- **Transition speed:** UK and Germany retiring coal; Asia-Pacific still building coal capacity
- **AI and data centers:** hyperscale siting decisions increasingly hinge on available clean power and interconnection queues

## What to watch in 2025–2026

- **China's coal plateau:** whether absolute coal TWh peaks as renewable additions accelerate
- **India's solar surge:** 280 GW target and rising share from 6.5% solar in 2024
- **US IRA effects:** tax credits pushing solar/wind share above 25% nationally
- **European gas displacement:** LNG dependence vs. offshore wind build-out in the North Sea
- **Nuclear restarts:** Japan and South Korea extending reactor lifetimes; SMR pilots in the US

## Methodology

Country-level data from **Our World in Data** (Ember & Energy Institute energy mix dataset), year **2024**. Generation totals in terawatt-hours; source shares as percent of national generation. Renewables aggregate includes hydro, solar, wind, and biofuels per OWID definitions. Regions assigned for dashboard grouping. World total is the OWID global aggregate row, not a sum of listed countries.`,
    category: "Economics",
    imageUrl: "/images/economics-electricity-generation-mix-hero.png",
    imageAlt:
      "Stacked bar chart of 2024 electricity generation mix across 21 major economies — coal, gas, nuclear, hydro, solar, and wind shares on a dark navy data-viz background",
    publishedAt: "2026-07-10T22:00:00Z",
    featured: true,
    visualization: "electricity-generation-mix",
    layout: "canvas",
  },
  {
    id: "refugee-hosting-burden",
    slug: "global-refugee-hosting-burden-2024",
    title: "Mapped: Who Actually Hosts the World's Refugees — Not Where Headlines Point",
    excerpt:
      "73% of refugees live in low- and middle-income countries — Iran, Türkiye, Colombia, and Uganda outrank the US. Lebanon hosts 1 in 8 residents; Germany is the only top host with no border crisis next door.",
    content: `## The narrative gap

Most Western audiences assume refugees cluster in wealthy destination countries — Germany, the United States, or EU border states. UNHCR's **Global Trends 2024** report tells a different story: at end-2024, **73%** of refugees and other people in need of international protection lived in **low- and middle-income countries**, and **67%** stayed in countries **neighbouring** their homeland.

The interactive chart above compares **25 major host countries** on absolute numbers and per-capita burden. Filter by income level or region, sort by total hosted or share of population, and inspect origin-country context for each row.

## The real top hosts

The five largest hosts at end-2024 were not EU members or the United States:

1. **Iran — 3.5 million** — overwhelmingly Afghans across a long shared border
2. **Türkiye — 2.9 million** — mostly Syrians, down 22% since 2021 but still the largest Syrian-hosting state
3. **Colombia — 2.8 million** — Venezuelans granted temporary protection, not classical asylum cases
4. **Germany — 2.7 million** — the only top-five host without a bordering displacement crisis; Ukrainians, Syrians, and Afghans
5. **Uganda — 1.8 million** — South Sudanese and Congolese refugees in rural settlements

**Pakistan** (1.6M), **Chad** (1.1M), **Peru** (1.1M), and **Bangladesh** (1.1M Rohingya) round out the next tier — none are G7 economies.

## Per-capita: where the burden actually bites

Absolute headcount understates strain. Relative to national population:

- **Lebanon — 1 in 8** residents is a refugee or person in need of international protection (755,400 registered Syrians plus other nationalities; government estimates are higher)
- **Chad — 1 in 16** — absorbing Sudan's war across a desert border
- **Jordan — 1 in 18** — 611,500 Syrian refugees on top of 2.4 million Palestine refugees under UNRWA
- **Uganda — 1 in 27** — one of the world's most generous refugee policies, on a low-income budget

The **United States** hosted roughly **435,000** refugees under UNHCR mandate at end-2024 — about **1 in 790** residents. **Australia** hosted **29,500** — roughly **1 in 900**.

## Income level mismatch

High-income countries account for roughly **64% of global GDP** but hosted only **27%** of refugees and other people in need of international protection at end-2024. The split by World Bank income group:

- **Upper-middle income — 37%** (Türkiye, Colombia, Iran reclassified in 2024, Peru)
- **Low income — 19%** (Uganda, Chad, Ethiopia)
- **High income — 27%** (Germany, Poland, Chile)
- **Lower-middle income — 17%** (Pakistan, Bangladesh, Egypt)

**Least Developed Countries** — 44 states with 1.4% of global GDP — hosted **23%** of the world's refugees. That is a tenfold overrepresentation relative to economic weight.

## Regional patterns

- **Latin America** absorbed the Venezuelan exodus: Colombia, Peru, Brazil, Chile, and Ecuador together host millions under temporary-protection frameworks
- **East Africa and the Sahel** carry South Sudanese, Sudanese, and Somali displacement — often in camps with minimal international funding
- **Europe's role** is real but narrower than perceived: Germany and Poland host large Ukrainian populations, but EU-wide totals are still below Iran or Türkiye alone
- **Neighbouring-country hosting** persists: 67% of refugees remain next to their country of origin, consistent with a decade of UNHCR reporting

## What changed in 2024

Several forces reshaped the map:

- **Sudan's war** pushed Sudanese refugee totals above **2.1 million**; Chad (+20%) and South Sudan (+36%) absorbed the surge
- **Afghan returns** from Iran (-7%) and Pakistan (-22%) lowered Afghan-hosting totals amid deportation policies
- **Venezuelan flows** stabilised in Colombia and Peru but remain the largest displacement crisis in the Americas
- **Syrian returns** accelerated after the fall of the Assad government in December 2024, especially from Lebanon
- **Ukrainian refugees** in Germany (+10%) and Poland (+4%) kept both in the global top ten

## What to watch in 2025

- **Iran–Afghanistan returns** after Tehran ended headcount-slip extensions in March 2025
- **Pakistan's repatriation plan** for undocumented Afghans and its effect on Peshawar/Quetta hosting corridors
- **Lebanon–Syria border dynamics** as spontaneous returns interact with new displacement from Israeli airstrikes
- **Sudan spillover** into Chad, Egypt, and South Sudan as the world's largest displacement crisis grinds on
- **EU burden-sharing debates** versus the statistical reality that most refugees never reach Europe

## Methodology

**Primary stock figures** (16 countries) from **UNHCR Global Trends Report 2024** (published June 2025), covering refugees, people in a refugee-like situation, and other people in need of international protection at **31 December 2024**. This is UNHCR's headline hosting metric — broader than "refugees under mandate" alone, and necessary to capture Venezuelans in Colombia and Afghans in Iran/Pakistan.

**Supplementary comparison rows** (9 countries) use **Our World in Data** extracts of UNHCR Refugee Population Statistics — refugees under mandate only, end-2024 — for high-income states where Global Trends does not publish standalone totals in the main country table. These rows are flagged in the dataset as \`refugees_mandate_only\` and should not be summed with OPNIIP rows without deduplication.

**Population denominators** from Our World in Data (UN World Population Prospects), year **2023** (latest in source extract). Per-capita ratios are illustrative hosting burden, not UNHCR official "1 in N" figures (which use slightly different population bases and inclusion rules for Lebanon/Jordan).

**Income classifications** follow World Bank FY2024–2025 country income groups as cited in UNHCR Table 2. Iran's reclassification to upper-middle income in 2024 shifted regional shares materially.

**Regional groupings** are editorial assignments for dashboard filters, not UNHCR geographic regions. Palestine refugees under UNRWA mandate (5.9M) are excluded from country hosting totals in this dataset; Jordan and Lebanon per-capita figures in UNHCR's public materials include UNRWA populations separately.`,
    category: "Politics",
    imageUrl: "/images/politics-refugee-hosting-burden-hero.png",
    imageAlt:
      "Bar chart of global refugee hosting burden by country — Iran, Türkiye, and Colombia outrank the United States; Lebanon and Jordan show highest per-capita strain",
    publishedAt: "2026-07-10T23:00:00Z",
    featured: true,
    visualization: "refugee-hosting-burden",
    layout: "canvas",
  },
];
