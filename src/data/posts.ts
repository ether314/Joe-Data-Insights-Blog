import type { Post } from "@/types/post";

export const samplePosts: Post[] = [
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
