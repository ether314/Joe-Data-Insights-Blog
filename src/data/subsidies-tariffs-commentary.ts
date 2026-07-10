export const KEY_EVENTS: Record<number, string> = {
  1996: "Farm bill; stable tariff era",
  1997: "Taxpayer Relief Act energy credits",
  1998: "Asia crisis; ag subsidies rise",
  1999: "Oil price recovery",
  2000: "Dot-com peak",
  2001: "Recession; energy tax extenders",
  2002: "Farm Security Act",
  2003: "Medicare drug bill; Iraq war spending",
  2004: "Energy Policy Act drafting",
  2005: "Energy Policy Act enacted",
  2006: "Ethanol mandate expansion",
  2007: "Financial crisis begins",
  2008: "TARP; energy volatility",
  2009: "ARRA green-energy tax credits",
  2010: "Post-crisis stimulus tail",
  2011: "Debt ceiling; R&D credit extensions",
  2012: "Fiscal cliff; production tax credit",
  2013: "Sequestration",
  2014: "Oil price collapse",
  2015: "Export-Import Bank debate",
  2016: "Election year; Paris Agreement",
  2017: "Tax Cuts and Jobs Act",
  2018: "Section 301 tariffs begin",
  2019: "Trade war peak tariffs",
  2020: "COVID recession; tariffs dip",
  2021: "Recovery year; tariffs rebound",
  2022: "CHIPS Act & IRA enacted",
  2023: "CHIPS grants & §48D credits ramp; IRA energy credits grow",
  2024: "CHIPS/IRA manufacturing and clean-energy tax credits expand",
  2025: "New tariff regime (BEA est.)",
};

export const COMMENTARY: Record<number, string> = {
  1996:
    "Total federal support exceeds tariff revenue by 3.6×. Direct outlays and industrial tax breaks both sit near $35–40B — tariffs are a modest offset.",
  1997:
    "Subsidy outlays dip slightly while tax expenditures creep up. Tariffs flat near $20B — the support-over-tariff gap holds steady.",
  1998:
    "Agricultural subsidies push outlays higher. Tariffs unchanged; total support widens its lead over customs duties.",
  1999:
    "Outlays jump on farm and housing aid. Tariffs slip marginally — support exceeds tariffs by the widest margin yet this decade.",
  2000:
    "Both series stable pre-recession. Industrial tax breaks nearly match direct subsidy outlays.",
  2001:
    "Recession-era outlays rise; tariffs flat. Energy and R&D tax credits continue climbing.",
  2002:
    "Farm bill boosts ag outlays; outlays dip from 2001 peak. Tariffs stay below $20B.",
  2003:
    "Outlays rebound. Tariffs tick up slightly — still less than half of total market support.",
  2004:
    "Energy Policy Act negotiations increase forward-looking tax expenditure estimates. Tariffs rise with import growth.",
  2005:
    "Energy Policy Act signed — future energy tax credits locked in. Outlays spike on farm programs; tariffs reach $25B.",
  2006:
    "Ethanol and production tax credits expand. Tariffs cross $26B but support still doubles tariff revenue.",
  2007:
    "Pre-crisis calm: outlays and industrial tax exp both elevated. Tariffs approach $29B.",
  2008:
    "Financial crisis triggers auto and financial subsidies. Tariffs hold near $29B.",
  2009:
    "ARRA adds renewable-energy tax credits and business subsidies. Tariffs fall with import collapse.",
  2010:
    "Stimulus tail plus expanded energy credits push industrial tax expenditures higher. Tariffs recover to $29B.",
  2011:
    "Outlays rise; R&D credit extensions continue. Tariffs cross $32B — still well below total support.",
  2012:
    "Fiscal cliff deal extends production tax credit. Tariffs reach $34B.",
  2013:
    "Sequestration trims some outlays; tax credits stable. Tariffs $35B.",
  2014:
    "Oil price drop reduces some fossil-fuel tax exp estimates. Tariffs $37B.",
  2015:
    "Manufacturing and energy tax breaks dominate the tax-exp side. Support roughly 3.8× tariffs.",
  2016:
    "Outlays tick up; TCJA debate begins. Tariffs flat.",
  2017:
    "Tax Cuts and Jobs Act reshapes corporate depreciation and energy credits. Tariffs unchanged.",
  2018:
    "Section 301 tariffs on China — customs duties jump 38% YoY. First major tariff surge in the period.",
  2019:
    "Trade war peak — tariffs hit the highest pre-2025 level. Support still exceeds tariffs roughly 2:1.",
  2020:
    "COVID recession pulls import volumes down; tariff collections dip while industrial support holds steady.",
  2021:
    "Trade rebounds; tariff revenue recovers. Industrial tax expenditures continue their gradual climb.",
  2022:
    "CHIPS Act and IRA launch. §48D fab ITC and IRA manufacturing credits flow to commerce/manufacturing tax exp.; IRA clean credits to energy tax exp.",
  2023:
    "§48D credits and IRA production/investment credits grow in energy and commerce lines. Tariffs normalize from 2022 peak.",
  2024:
    "CHIPS and IRA tax credits expand in commerce and energy toggles. Support totals track the pre-2022 industrial baseline.",
  2025:
    "BEA estimates tariffs surge under expanded duties — potentially exceeding total support for the first time in 30 years. Preliminary.",
};

export const PROGRAM_MAPPINGS = [
  {
    id: "chips",
    name: "CHIPS and Science Act",
    enacted: 2022,
    activeFrom: 2022,
    componentIds: ["tax_commerce", "tax_rd"],
    summary:
      "§48D advanced manufacturing investment credit → Treasury commerce/manufacturing tax expenditures; NSF/NIST semiconductor R&D authorizations partly in Treasury R&D/general science. Direct CHIPS grants are not included in this dataset.",
  },
  {
    id: "ira",
    name: "Inflation Reduction Act",
    enacted: 2022,
    activeFrom: 2022,
    componentIds: ["tax_energy", "tax_commerce"],
    summary:
      "Clean-energy production, investment, and EV credits → Treasury energy tax expenditures. Advanced manufacturing, domestic content, and related industrial credits → Treasury commerce/manufacturing.",
  },
] as const;
