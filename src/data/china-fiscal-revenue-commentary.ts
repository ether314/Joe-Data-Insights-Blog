/** Analyst commentary for each MOF 2024 revenue line item (hover copy) */
export const REVENUE_COMMENTARY: Record<string, string> = {
  "Domestic VAT":
    "China's largest single tax line. VAT is split 50/50 between central and local governments under the 1994 tax-sharing reform. The −3.8% YoY drop reflects weak consumption and industrial output in 2024.",
  "Enterprise employee pension":
    "The biggest social-insurance fund. Premiums from employers and workers (~¥46T) plus central fiscal subsidies (~¥8.2T) fund urban employee retirement. Not part of the general public budget but counted in the four-budget total.",
  "Land use rights transfer":
    "Local governments' primary off-budget financing tool — selling 70-year land leases to developers. Down 16% in 2024 as the property crisis crushed developer demand. Almost entirely local revenue.",
  "Corporate Income Tax":
    "Split ~60% central / 40% local. Tech and finance sectors contribute disproportionately. Flat YoY in 2024 as corporate profits softened alongside the property downturn.",
  "Employee basic medical":
    "Urban employee health insurance premiums and employer contributions. Growing with an aging workforce and expanded benefit coverage. Managed separately from the general public budget.",
  "State asset & resource use fees":
    "Surging non-tax category (+26% est.) driven by SOE dividend-like payments, mining concessions, and public asset monetization as local governments hunt for revenue outside land sales.",
  "Government employee pension":
    "Covers civil servants and public-institution employees — a separate, more generous pension track from enterprise workers. Fully budgeted within the social insurance system.",
  "Import VAT + Consumption":
    "Collected at the border; 100% central. Tracks import volumes and tariff policy. Slight decline in 2024 as trade patterns shifted and some consumer imports softened.",
  "Urban-rural resident medical":
    "Basic medical insurance for hundreds of millions of non-urban employees — farmers, gig workers, retirees without enterprise coverage. Heavily subsidized by central transfers.",
  "Domestic Consumption Tax":
    "Excise on luxury goods, fuel, alcohol, and tobacco — all central revenue. Modest +2.6% growth as consumption held up better than VAT-heavy industrial activity.",
  "Individual Income Tax":
    "Split ~60% central / 40% local. Progressive rates hit urban salaried workers hardest. The 2018 reform raised the threshold but high earners in tier-1 cities still drive collections.",
  "Urban-rural resident pension":
    "The rural and urban-resident pension — lower benefits than the enterprise system, funded by personal contributions plus heavy central and provincial subsidies.",
  "State SOE remittance (general budget)":
    "Profits remitted by state-owned enterprises into the general public budget (distinct from the dedicated State Capital budget). Spiked in 2024 on tobacco and PBOC one-time central proceeds.",
  "Special receipts (surcharges)":
    "Education surcharge, local education surcharge, and other mandated levies on top of VAT and consumption tax. Mixed central-local sharing (~38% central).",
  "Fines & confiscations":
    "Administrative penalties and asset seizures — mostly local. Growth reflects expanded enforcement in traffic, environment, and market-regulation domains.",
  "Administrative fees":
    "Passport fees, license charges, and regulatory service fees. Predominantly local (~85%). Stable in 2024 as governments avoided fee hikes amid economic headwinds.",
  "Deed Tax":
    "Property transaction tax — local revenue, highly cyclical with real estate. −12.5% YoY mirrors collapsing home sales and developer defaults in 2024.",
  "Unemployment insurance":
    "Employer and employee premiums funding short-term jobless benefits. Small relative to pension funds but spiked during COVID; normalized in 2024.",
  "Urban Maintenance & Construction":
    "Surcharge on VAT and consumption tax funding city infrastructure — shared between central and local. Tracks the VAT base; down with industrial activity.",
  "Property Tax":
    "Pilot property tax on commercial and residential holdings in select cities. Still a tiny share of total revenue but +17.8% YoY as pilots expanded in Shanghai and Chongqing.",
  "Central SOE · Tobacco":
    "China Tobacco's profit remittance to the State Capital budget. The single largest central SOE contributor — a near-monopoly generating reliable fiscal income.",
  "Land Appreciation Tax":
    "Levied on property developer gains — local revenue, closely tied to land sales and project completions. −8% YoY as developers deferred projects.",
  "Central SOE · Oil & petrochemical":
    "PetroChina, Sinopec, and CNOOC profit income. Sensitive to global oil prices and domestic refining margins; second-largest central SOE profit line.",
  "Stamp Tax":
    "Securities transactions and contract stamps — mixed central-local (~37% central). Down 9.5% as equity turnover and property contract volumes fell.",
  "Resource Tax":
    "Mining and natural-resource extraction levies — mostly local. Coal and metal prices drive volatility; modest −3.5% in 2024.",
  "Vehicle Purchase Tax":
    "10% tax on car sales — 100% central. Used as a stimulus lever (cuts in 2015–2017, 2022). −9.4% YoY as EV subsidies and weak auto demand cut collections.",
  "Tariffs":
    "Customs duties on imports — all central. Trade policy and import composition drive the line. −5.7% in 2024 amid shifting supply chains.",
  "Urban Land Use Tax":
    "Annual tax on commercial and industrial land holders — local revenue. +9.6% as local governments broadened the base to offset land-sale shortfalls.",
  "Central SOE · Power":
    "State grid and generation SOE profits remitted centrally. Revenue linked to industrial electricity demand and regulated tariff spreads.",
  "Central SOE · Telecom":
    "China Mobile, China Telecom, and China Unicom dividend income. Stable cash cow as 5G capex peaks and ARPU stabilizes.",
  "Lottery public welfare fund":
    "Mandatory allocation from lottery sales to social welfare programs. Scaled estimate from 2023 levels; lottery sales grew modestly in 2024.",
  "Farmland Occupation Tax":
    "Levied when agricultural land is converted to construction — local revenue. +21.5% as some provinces accelerated infrastructure land conversion.",
  "Central SOE · Overseas / international":
    "Profits from central SOEs' foreign subsidiaries and international operations — oil, construction, and shipping SOEs operating abroad.",
  "Central SOE · Construction":
    "China State Construction, China Railway Construction, and peers. Infrastructure stimulus partially offset property-sector weakness in 2024.",
  "Renewable energy surcharge":
    "Surcharge on electricity bills funding renewable subsidies and grid integration. Growing with wind and solar capacity additions.",
  "City infrastructure配套费":
    "Fees on new development to fund municipal infrastructure (roads, schools, utilities). Local revenue tied to new construction starts — weak in 2024.",
  "State land benefit fund":
    "Income from state-owned land reallocation and benefit-sharing. Local-heavy; correlates with land administration activity.",
  "Central SOE · Coal":
    "Coal SOE profits — volatile with domestic coal prices and production caps. Smaller than oil but important for energy-security dividends.",
  "Environmental Protection Tax":
    "Pollution levy replacing discharge fees since 2018. Local collection; +19.7% YoY as enforcement tightened under dual-carbon targets.",
  "Other (vehicle, vessel, tobacco leaf)":
    "Residual tax category covering vehicle and vessel taxes plus tobacco leaf tax. Tobacco leaf tax is local; vehicle/vessel split between central and local.",
  "Railway construction fund":
    "Surcharge on rail freight and passenger tickets funding national rail expansion. Mostly central; tracks rail investment cycles.",
  "Vehicle tolls":
    "Highway toll revenue collected into the government fund budget. Local and provincial operators remit per MOF rules.",
  "Central SOE · Other industries":
    "Residual central SOE profit income across steel, aviation, shipping, and other sectors not broken out separately in MOF tables.",
  "Central SOE · Dividends & equity disposal":
    "Cash dividends and equity sale proceeds from central SOE holdings — the formal State Capital budget dividend line beyond operating profit.",
  "Aviation development fund":
    "Surcharge on air tickets and aviation-related fees — 100% central. Recovered post-COVID as domestic air travel normalized (+7.2%).",
  "Central reservoir migrant fund":
    "Levy on hydropower sales funding resettlement of migrants displaced by dam projects. Central collection from western provinces.",
  "Other non-tax":
    "Catch-all for miscellaneous non-tax receipts — donations, interest on fiscal deposits, and residual administrative income.",
  "Major water conservancy fund":
    "Surcharge funding South-North Water Transfer and other national water projects. Central and provincial sharing per project rules.",
  "Lottery sales agency fees":
    "Commission income from lottery ticket sales agents. Small but stable revenue stream within the government fund budget.",
  "Ag. land development fund":
    "Fees tied to agricultural land development and reclamation projects. Smallest named gov-fund line; mostly local.",
  "Other gov. fund items":
    "Residual government fund revenue — local fee categories, smaller levies, and adjustments to reach the ¥62,090B official total.",
  "Central SOE · Property transfer income":
    "Asset sales and property transfers by central SOEs — one-off disposals of real estate and land holdings.",
  "Central SOE · Liquidation income":
    "Proceeds from winding up failed or restructured central SOEs. Tiny but recorded separately in MOF State Capital accounts.",
  "Local SOE profit remittance":
    "Profits uploaded from provincial and municipal SOEs to the State Capital budget. The local counterpart to central SOE remittances — growing as provinces consolidate SOE holdings.",
  "Work injury insurance":
    "Employer-funded insurance covering workplace injuries. Smallest of the five social insurance types but mandatory for all employers.",
};
