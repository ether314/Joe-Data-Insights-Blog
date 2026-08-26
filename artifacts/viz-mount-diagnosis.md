# Viz mount diagnosis — 19 no_viz_root posts (audit 2026-08-23)

## Root causes found (two distinct, both mechanical)

### A. Dispatcher gaps (3 posts)
Three posts declared a `visualization` id with **no dispatch entry** in
`src/components/PostVisualization.tsx`, so the dispatcher fell through to
`return null` and no viz root ever mounted:

| slug | viz id | fix |
| --- | --- | --- |
| industrial-robotics-research-2026 | `industrial-robotics-research-2026` | added dynamic import + dispatch branch for existing component `IndustrialRoboticsResearchDashboard` |
| ai-supply-chain-research-2026 | `ai-supply-chain-research-2026` | added dynamic import + dispatch branch for existing component `AiSupplyChainResearchDashboard` |
| us-billion-dollar-weather-disasters-ms94skof | `us-billion-dollar-weather-disasters-ms94skof` | added dynamic import + dispatch branch for existing component `UsBillionDollarWeatherDisastersDashboard` |

The components existed on disk the whole time; only the switch in
`PostVisualization.tsx` was missing. All three now render.

### B. Missing `data-viz` marker attribute (16 posts)
These posts' dashboards mounted fine but their root element lacked the
`data-viz="<id>"` attribute that the audit crawler and smoke test use to
detect a mounted visualization root, so they were counted as "no viz root":

CcpNomenklaturaDashboard, ChinaFiscalRevenueDashboard, GdpInteractiveDashboard,
SubsidiesTariffsDashboard, DemographicCashFlowsResearchDashboard,
CopperMineVsRefineryGeographyDashboard, ChokepointCommoditiesResearchDashboard,
EnergySystemsResearchDashboard, FiscalIndustrialPolicyGeography2026Dashboard,
FiscalIndustrialPolicyGeography202608Dashboard,
FiscalIndustrialPolicyGeography2026q3Dashboard, AiDataCentersDashboard,
LastMileDeliveryRoboticsDashboard, GoldmanSachsAiCapexDashboard,
MacroGrowthTradeGeography2026q3Dashboard, BrokerageBonusesDashboard

Fix: added `data-viz="<viz id>"` to each component's root JSX div. No logic
changed anywhere.

## Not content-specific
Every one of the 19 posts was explained by A or B — no per-post content bugs,
no data-module failures, no conditional guards. No post needed exclusion.
