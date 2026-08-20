"use client";

import dynamic from "next/dynamic";

const GdpInteractiveDashboard = dynamic(
  () =>
    import("@/components/visualizations/GdpInteractiveDashboard").then(
      (m) => m.GdpInteractiveDashboard,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const SubsidiesTariffsDashboard = dynamic(
  () =>
    import("@/components/visualizations/SubsidiesTariffsDashboard").then(
      (m) => m.SubsidiesTariffsDashboard,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const BrokerageBonusesDashboard = dynamic(
  () =>
    import("@/components/visualizations/BrokerageBonusesDashboard").then(
      (m) => m.BrokerageBonusesDashboard,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const AiDataCentersDashboard = dynamic(
  () =>
    import("@/components/visualizations/AiDataCentersDashboard").then(
      (m) => m.AiDataCentersDashboard,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const CcpNomenklaturaDashboard = dynamic(
  () =>
    import("@/components/visualizations/CcpNomenklaturaDashboard").then(
      (m) => m.CcpNomenklaturaDashboard,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const ChinaFiscalRevenueDashboard = dynamic(
  () =>
    import("@/components/visualizations/ChinaFiscalRevenueDashboard").then(
      (m) => m.ChinaFiscalRevenueDashboard,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const ElectricityGenerationMixDashboard = dynamic(
  () =>
    import("@/components/visualizations/ElectricityGenerationMixDashboard").then(
      (m) => m.ElectricityGenerationMixDashboard,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const RefugeeHostingBurdenDashboard = dynamic(
  () =>
    import("@/components/visualizations/RefugeeHostingBurdenDashboard").then(
      (m) => m.RefugeeHostingBurdenDashboard,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const AiPackagingBottleneckDashboard = dynamic(
  () =>
    import("@/components/visualizations/AiPackagingBottleneckDashboard").then(
      (m) => m.AiPackagingBottleneckDashboard,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const AiTokenConsumptionDashboard = dynamic(
  () =>
    import("@/components/visualizations/AiTokenConsumptionDashboard").then(
      (m) => m.AiTokenConsumptionDashboard,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const DeflationaryGrowth2025Dashboard = dynamic(
  () =>
    import("@/components/visualizations/DeflationaryGrowth2025Dashboard").then(
      (m) => m.DeflationaryGrowth2025Dashboard,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const LastMileDeliveryRoboticsDashboard = dynamic(
  () =>
    import("@/components/visualizations/LastMileDeliveryRoboticsDashboard").then(
      (m) => m.LastMileDeliveryRoboticsDashboard,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const GoldmanSachsAiCapexDashboard = dynamic(
  () =>
    import("@/components/visualizations/GoldmanSachsAiCapexDashboard").then(
      (m) => m.GoldmanSachsAiCapexDashboard,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const SocialSecurityTrustFundDashboard = dynamic(
  () =>
    import("@/components/visualizations/SocialSecurityTrustFundDashboard").then(
      (m) => m.SocialSecurityTrustFundDashboard,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);


const AiCapexIntensityResearchDashboard = dynamic(
  () =>
    import("@/components/visualizations/AiCapexIntensityResearchDashboard").then(
      (m) => m.AiCapexIntensityResearchDashboard,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const AiCapexSpendResearchDashboard = dynamic(
  () =>
    import("@/components/visualizations/AiCapexSpendResearchDashboard").then(
      (m) => m.AiCapexSpendResearchDashboard,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const GlobalRemittanceCorridorsDashboard = dynamic(
  () =>
    import("@/components/visualizations/GlobalRemittanceCorridorsDashboard").then(
      (m) => m.GlobalRemittanceCorridorsDashboard,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const PhosphateFertilizerExportDashboard = dynamic(
  () =>
    import("@/components/visualizations/PhosphateFertilizerExportDashboard").then(
      (m) => m.PhosphateFertilizerExportDashboard,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const BillionDollarDisastersDashboard = dynamic(
  () =>
    import("@/components/visualizations/BillionDollarDisastersDashboard").then(
      (m) => m.BillionDollarDisastersDashboard,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);
const NaturalGraphiteMineConcentrationDashboard = dynamic(
  () =>
    import("@/components/visualizations/NaturalGraphiteMineConcentrationDashboard").then(
      (m) => m.NaturalGraphiteMineConcentrationDashboard,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const BankLoanChargeoffsDashboard = dynamic(
  () =>
    import("@/components/visualizations/BankLoanChargeoffsDashboard").then(
      (m) => m.BankLoanChargeoffsDashboard,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const IrenaRenewableCapacityDashboard = dynamic(
  () =>
    import("@/components/visualizations/IrenaRenewableCapacityDashboard").then(
      (m) => m.IrenaRenewableCapacityDashboard,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const OecdDacOdaDashboard = dynamic(
  () =>
    import("@/components/visualizations/OecdDacOdaDashboard").then(
      (m) => m.OecdDacOdaDashboard,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const MoneyMarketFundsDepositsDashboard = dynamic(
  () =>
    import("@/components/visualizations/MoneyMarketFundsDepositsDashboard").then(
      (m) => m.MoneyMarketFundsDepositsDashboard,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const CommercialAircraftAssemblyDashboard = dynamic(
  () =>
    import("@/components/visualizations/CommercialAircraftAssemblyDashboard").then(
      (m) => m.CommercialAircraftAssemblyDashboard,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const MacroGrowthTradeResearchDashboard = dynamic(
  () =>
    import("@/components/visualizations/MacroGrowthTradeResearchDashboard").then(
      (m) => m.MacroGrowthTradeResearchDashboard,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const AiComputeDemandResearchDashboard = dynamic(
  () =>
    import("@/components/visualizations/AiComputeDemandResearchDashboard").then(
      (m) => m.AiComputeDemandResearchDashboard,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const AiFinancingResearchDashboard = dynamic(
  () =>
    import("@/components/visualizations/AiFinancingResearchDashboard").then(
      (m) => m.AiFinancingResearchDashboard,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const AiPowerGridResearchDashboard = dynamic(
  () =>
    import("@/components/visualizations/AiPowerGridResearchDashboard").then(
      (m) => m.AiPowerGridResearchDashboard,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const FiscalIndustrialPolicyResearchDashboard = dynamic(
  () =>
    import("@/components/visualizations/FiscalIndustrialPolicyResearchDashboard").then(
      (m) => m.FiscalIndustrialPolicyResearchDashboard,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const MigrationHumanitarianResearchDashboard = dynamic(
  () =>
    import("@/components/visualizations/MigrationHumanitarianResearchDashboard").then(
      (m) => m.MigrationHumanitarianResearchDashboard,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const UsTaxExpenditureCatalogDashboard = dynamic(
  () =>
    import("@/components/visualizations/UsTaxExpenditureCatalogDashboard").then(
      (m) => m.UsTaxExpenditureCatalogDashboard,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const MeasurementScienceResearchDashboard = dynamic(
  () =>
    import("@/components/visualizations/MeasurementScienceResearchDashboard").then(
      (m) => m.MeasurementScienceResearchDashboard,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const DemographicCashFlowsResearchDashboard = dynamic(
  () =>
    import("@/components/visualizations/DemographicCashFlowsResearchDashboard").then(
      (m) => m.DemographicCashFlowsResearchDashboard,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const CopperMineVsRefineryGeographyDashboard = dynamic(
  () =>
    import("@/components/visualizations/CopperMineVsRefineryGeographyDashboard").then(
      (m) => m.CopperMineVsRefineryGeographyDashboard,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const GlobalShipbuildingGtDeliveryDashboard = dynamic(
  () =>
    import("@/components/visualizations/GlobalShipbuildingGtDeliveryDashboard").then(
      (m) => m.GlobalShipbuildingGtDeliveryDashboard,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const GeopoliticsInstitutionsResearchDashboard = dynamic(
  () =>
    import("@/components/visualizations/GeopoliticsInstitutionsResearchDashboard").then(
      (m) => m.GeopoliticsInstitutionsResearchDashboard,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const ChokepointCommoditiesResearchDashboard = dynamic(
  () =>
    import("@/components/visualizations/ChokepointCommoditiesResearchDashboard").then(
      (m) => m.ChokepointCommoditiesResearchDashboard,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const AdaptationEconomicsResearchDashboard = dynamic(
  () =>
    import("@/components/visualizations/AdaptationEconomicsResearchDashboard").then(
      (m) => m.AdaptationEconomicsResearchDashboard,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const EnergySystemsResearchDashboard = dynamic(
  () =>
    import("@/components/visualizations/EnergySystemsResearchDashboard").then(
      (m) => m.EnergySystemsResearchDashboard,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const ConsumerFinanceMarketsResearchDashboard = dynamic(
  () =>
    import("@/components/visualizations/ConsumerFinanceMarketsResearchDashboard").then(
      (m) => m.ConsumerFinanceMarketsResearchDashboard,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const AiCapexIntensityUpdateDashboard = dynamic(
  () =>
    import("@/components/visualizations/AiCapexIntensityUpdateDashboard").then(
      (m) => m.AiCapexIntensityUpdateDashboard,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const AiSupplyChainUpdateDashboard = dynamic(
  () =>
    import("@/components/visualizations/AiSupplyChainUpdateDashboard").then(
      (m) => m.AiSupplyChainUpdateDashboard,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const AiPowerGridConcentrationDashboard = dynamic(
  () =>
    import("@/components/visualizations/AiPowerGridConcentrationDashboard").then(
      (m) => m.AiPowerGridConcentrationDashboard,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const BankCommercialCreditResearchDashboard = dynamic(
  () =>
    import("@/components/visualizations/BankCommercialCreditResearchDashboard").then(
      (m) => m.BankCommercialCreditResearchDashboard,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const MacroGrowthTradeUpdateDashboard = dynamic(
  () =>
    import("@/components/visualizations/MacroGrowthTradeUpdateDashboard").then(
      (m) => m.MacroGrowthTradeUpdateDashboard,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const AiComputeDemandUpdateDashboard = dynamic(
  () =>
    import("@/components/visualizations/AiComputeDemandUpdateDashboard").then(
      (m) => m.AiComputeDemandUpdateDashboard,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const AiCapexSpendUpdateDashboard = dynamic(
  () =>
    import("@/components/visualizations/AiCapexSpendUpdateDashboard").then(
      (m) => m.AiCapexSpendUpdateDashboard,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const AiFinancingUpdateDashboard = dynamic(
  () =>
    import("@/components/visualizations/AiFinancingUpdateDashboard").then(
      (m) => m.AiFinancingUpdateDashboard,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const FiscalIndustrialPolicyUpdateDashboard = dynamic(
  () =>
    import("@/components/visualizations/FiscalIndustrialPolicyUpdateDashboard").then(
      (m) => m.FiscalIndustrialPolicyUpdateDashboard,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const CommercialAircraftFinalAssemblyGeography2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/CommercialAircraftFinalAssemblyGeography2026Dashboard"
    ).then((m) => m.CommercialAircraftFinalAssemblyGeography2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const FiscalPlumbingResearchDashboard = dynamic(
  () =>
    import("@/components/visualizations/FiscalPlumbingResearchDashboard").then(
      (m) => m.FiscalPlumbingResearchDashboard,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

export function PostVisualization({
  type,
  embedded = false,
}: {
  type: NonNullable<import("@/types/post").Post["visualization"]>;
  embedded?: boolean;
}) {
  if (type === "gdp-analysis") {
    return <GdpInteractiveDashboard />;
  }
  if (type === "subsidies-tariffs") {
    return <SubsidiesTariffsDashboard />;
  }
  if (type === "brokerage-bonuses") {
    return <BrokerageBonusesDashboard />;
  }
  if (type === "ai-data-centers") {
    return <AiDataCentersDashboard />;
  }
  if (type === "ccp-nomenklatura") {
    return <CcpNomenklaturaDashboard />;
  }
  if (type === "china-fiscal-revenue") {
    return <ChinaFiscalRevenueDashboard embedded={embedded} />;
  }
  if (type === "electricity-generation-mix") {
    return <ElectricityGenerationMixDashboard />;
  }
  if (type === "refugee-hosting-burden") {
    return <RefugeeHostingBurdenDashboard />;
  }
  if (type === "ai-packaging-bottleneck") {
    return <AiPackagingBottleneckDashboard />;
  }
  if (type === "ai-token-consumption") {
    return <AiTokenConsumptionDashboard />;
  }
  if (type === "deflationary-growth-2025") {
    return <DeflationaryGrowth2025Dashboard />;
  }
  if (type === "last-mile-delivery-robotics") {
    return <LastMileDeliveryRoboticsDashboard />;
  }
  if (type === "goldman-sachs-ai-capex") {
    return <GoldmanSachsAiCapexDashboard />;
  }
  if (type === "social-security-trust-fund") {
    return <SocialSecurityTrustFundDashboard />;
  }
  if (type === "ai-capex-intensity-research-2026") {
    return <AiCapexIntensityResearchDashboard />;
  }
  if (type === "ai-capex-spend-research-2026") {
    return <AiCapexSpendResearchDashboard />;
  }
  if (type === "global-remittance-corridors") {
    return <GlobalRemittanceCorridorsDashboard />;
  }
  if (type === "phosphate-fertilizer-export") {
    return <PhosphateFertilizerExportDashboard />;
  }
  if (type === "billion-dollar-disasters") {
    return <BillionDollarDisastersDashboard />;
  }

  if (type === "natural-graphite-mine-concentration") {
    return <NaturalGraphiteMineConcentrationDashboard />;
  }

  if (type === "bank-loan-chargeoffs") {
    return <BankLoanChargeoffsDashboard />;
  }

  if (type === "irena-renewable-capacity") {
    return <IrenaRenewableCapacityDashboard />;
  }

  if (type === "oecd-dac-oda") {
    return <OecdDacOdaDashboard />;
  }

  if (type === "money-market-funds-deposits") {
    return <MoneyMarketFundsDepositsDashboard />;
  }

  if (type === "commercial-aircraft-assembly") {
    return <CommercialAircraftAssemblyDashboard />;
  }

  if (type === "macro-growth-trade-research-2026") {
    return <MacroGrowthTradeResearchDashboard />;
  }

  if (type === "ai-compute-demand-research-2026") {
    return <AiComputeDemandResearchDashboard />;
  }

  if (type === "ai-financing-research-2026") {
    return <AiFinancingResearchDashboard />;
  }

  if (type === "ai-power-grid-research-2026") {
    return <AiPowerGridResearchDashboard />;
  }

  if (type === "fiscal-industrial-policy-research-2026") {
    return <FiscalIndustrialPolicyResearchDashboard />;
  }

  if (type === "migration-humanitarian-research-2026") {
    return <MigrationHumanitarianResearchDashboard />;
  }

  if (type === "us-tax-expenditure-catalog-2026") {
    return <UsTaxExpenditureCatalogDashboard />;
  }

  if (type === "measurement-science-research-2026") {
    return <MeasurementScienceResearchDashboard />;
  }

  if (type === "demographic-cash-flows-research-2026") {
    return <DemographicCashFlowsResearchDashboard />;
  }

  if (type === "copper-mine-vs-refinery-geography-2026") {
    return <CopperMineVsRefineryGeographyDashboard />;
  }

  if (type === "global-shipbuilding-gt-delivery-concentration-2026") {
    return <GlobalShipbuildingGtDeliveryDashboard />;
  }

  if (type === "geopolitics-institutions-research-2026") {
    return <GeopoliticsInstitutionsResearchDashboard />;
  }

  if (type === "chokepoint-commodities-research-2026") {
    return <ChokepointCommoditiesResearchDashboard />;
  }

  if (type === "adaptation-economics-research-2026") {
    return <AdaptationEconomicsResearchDashboard />;
  }

  if (type === "energy-systems-research-2026") {
    return <EnergySystemsResearchDashboard />;
  }

  if (type === "consumer-finance-markets-research-2026") {
    return <ConsumerFinanceMarketsResearchDashboard />;
  }

  if (type === "ai-capex-intensity-update-2026") {
    return <AiCapexIntensityUpdateDashboard />;
  }

  if (type === "ai-supply-chain-update-2026") {
    return <AiSupplyChainUpdateDashboard />;
  }

  if (type === "ai-power-grid-concentration-2026") {
    return <AiPowerGridConcentrationDashboard />;
  }

  if (type === "bank-commercial-credit-research-2026") {
    return <BankCommercialCreditResearchDashboard />;
  }

  if (type === "macro-growth-trade-update-2026") {
    return <MacroGrowthTradeUpdateDashboard />;
  }

  if (type === "ai-compute-demand-update-2026") {
    return <AiComputeDemandUpdateDashboard />;
  }

  if (type === "ai-capex-spend-update-2026") {
    return <AiCapexSpendUpdateDashboard />;
  }

  if (type === "ai-financing-update-2026") {
    return <AiFinancingUpdateDashboard />;
  }

  if (type === "fiscal-industrial-policy-update-2026") {
    return <FiscalIndustrialPolicyUpdateDashboard />;
  }

  if (type === "commercial-aircraft-final-assembly-geography-2026") {
    return <CommercialAircraftFinalAssemblyGeography2026Dashboard />;
  }

  if (type === "fiscal-plumbing-research-2026") {
    return <FiscalPlumbingResearchDashboard />;
  }

  return null;
}
