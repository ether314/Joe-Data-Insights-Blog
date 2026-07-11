import type { Post } from "@/types/post";

export const samplePosts: Post[] = [
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
