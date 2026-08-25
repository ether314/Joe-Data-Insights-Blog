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

const GeopoliticsInstitutionsUpdateDashboard = dynamic(
  () =>
    import("@/components/visualizations/GeopoliticsInstitutionsUpdateDashboard").then(
      (m) => m.GeopoliticsInstitutionsUpdateDashboard,
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

const MeasurementScienceUpdateDashboard = dynamic(
  () =>
    import("@/components/visualizations/MeasurementScienceUpdateDashboard").then(
      (m) => m.MeasurementScienceUpdateDashboard,
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

const DemographicCashFlowsUpdateDashboard = dynamic(
  () =>
    import("@/components/visualizations/DemographicCashFlowsUpdateDashboard").then(
      (m) => m.DemographicCashFlowsUpdateDashboard,
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

const AdaptationEconomicsUpdateDashboard = dynamic(
  () =>
    import("@/components/visualizations/AdaptationEconomicsUpdateDashboard").then(
      (m) => m.AdaptationEconomicsUpdateDashboard,
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

const IndustrialRoboticsUpdateDashboard = dynamic(
  () =>
    import("@/components/visualizations/IndustrialRoboticsUpdateDashboard").then(
      (m) => m.IndustrialRoboticsUpdateDashboard,
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

const EnergySystemsUpdateDashboard = dynamic(
  () =>
    import("@/components/visualizations/EnergySystemsUpdateDashboard").then(
      (m) => m.EnergySystemsUpdateDashboard,
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

const ChokepointCommoditiesUpdateDashboard = dynamic(
  () =>
    import("@/components/visualizations/ChokepointCommoditiesUpdateDashboard").then(
      (m) => m.ChokepointCommoditiesUpdateDashboard,
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

const ConsumerFinanceMarketsUpdateDashboard = dynamic(
  () =>
    import("@/components/visualizations/ConsumerFinanceMarketsUpdateDashboard").then(
      (m) => m.ConsumerFinanceMarketsUpdateDashboard,
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

const GeopoliticsInstitutionsUpdate2026q3Dashboard = dynamic(
  () =>
    import("@/components/visualizations/GeopoliticsInstitutionsUpdate2026q3Dashboard").then(
      (m) => m.GeopoliticsInstitutionsUpdate2026q3Dashboard,
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

const AiComputeDemandUpdate2026q3Dashboard = dynamic(
  () =>
    import("@/components/visualizations/AiComputeDemandUpdate2026q3Dashboard").then(
      (m) => m.AiComputeDemandUpdate2026q3Dashboard,
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

const FiscalIndustrialPolicyUpdate2026q3Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/FiscalIndustrialPolicyUpdate2026q3Dashboard"
    ).then((m) => m.FiscalIndustrialPolicyUpdate2026q3Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const AiCapexSpendUpdate2026q3Dashboard = dynamic(
  () =>
    import("@/components/visualizations/AiCapexSpendUpdate2026q3Dashboard").then(
      (m) => m.AiCapexSpendUpdate2026q3Dashboard,
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

const AiPowerGridUpdateDashboard = dynamic(
  () =>
    import("@/components/visualizations/AiPowerGridUpdateDashboard").then(
      (m) => m.AiPowerGridUpdateDashboard,
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

const AiFinancingUpdate2026q3Dashboard = dynamic(
  () =>
    import("@/components/visualizations/AiFinancingUpdate2026q3Dashboard").then(
      (m) => m.AiFinancingUpdate2026q3Dashboard,
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

const IndustrialRoboticsUpdate2026q3Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/IndustrialRoboticsUpdate2026q3Dashboard"
    ).then((m) => m.IndustrialRoboticsUpdate2026q3Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const ConsumerFinanceMarketsUpdate2026q3Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/ConsumerFinanceMarketsUpdate2026q3Dashboard"
    ).then((m) => m.ConsumerFinanceMarketsUpdate2026q3Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const ChokepointCommoditiesUpdate2026q3Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/ChokepointCommoditiesUpdate2026q3Dashboard"
    ).then((m) => m.ChokepointCommoditiesUpdate2026q3Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const DemographicCashFlowsUpdate2026q3Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/DemographicCashFlowsUpdate2026q3Dashboard"
    ).then((m) => m.DemographicCashFlowsUpdate2026q3Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const HeavyIndustrialCapacityResearch2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/HeavyIndustrialCapacityResearch2026Dashboard"
    ).then((m) => m.HeavyIndustrialCapacityResearch2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const MeasurementScienceUpdate2026q3Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/MeasurementScienceUpdate2026q3Dashboard"
    ).then((m) => m.MeasurementScienceUpdate2026q3Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const AdaptationEconomicsUpdate2026q3Dashboard = dynamic(
  () =>
    import("@/components/visualizations/AdaptationEconomicsUpdate2026q3Dashboard").then(
      (m) => m.AdaptationEconomicsUpdate2026q3Dashboard,
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

const IndustrialRoboticsUpdate202608Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/IndustrialRoboticsUpdate202608Dashboard"
    ).then((m) => m.IndustrialRoboticsUpdate202608Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const EnergySystemsUpdate2026q3Dashboard = dynamic(
  () =>
    import("@/components/visualizations/EnergySystemsUpdate2026q3Dashboard").then(
      (m) => m.EnergySystemsUpdate2026q3Dashboard,
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

const FiscalIndustrialPolicyUpdate202608Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/FiscalIndustrialPolicyUpdate202608Dashboard"
    ).then((m) => m.FiscalIndustrialPolicyUpdate202608Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const GeopoliticsInstitutionsUpdate202608Dashboard = dynamic(
  () =>
    import("@/components/visualizations/GeopoliticsInstitutionsUpdate202608Dashboard").then(
      (m) => m.GeopoliticsInstitutionsUpdate202608Dashboard,
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

const ChokepointCommoditiesUpdate202608Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/ChokepointCommoditiesUpdate202608Dashboard"
    ).then((m) => m.ChokepointCommoditiesUpdate202608Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const AiCapexSpendUpdate202608Dashboard = dynamic(
  () =>
    import("@/components/visualizations/AiCapexSpendUpdate202608Dashboard").then(
      (m) => m.AiCapexSpendUpdate202608Dashboard,
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

const AiPowerGridUpdate2026q3Dashboard = dynamic(
  () =>
    import("@/components/visualizations/AiPowerGridUpdate2026q3Dashboard").then(
      (m) => m.AiPowerGridUpdate2026q3Dashboard,
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

const AdaptationEconomicsUpdate202608Dashboard = dynamic(
  () =>
    import("@/components/visualizations/AdaptationEconomicsUpdate202608Dashboard").then(
      (m) => m.AdaptationEconomicsUpdate202608Dashboard,
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

const AiFinancingUpdate202608Dashboard = dynamic(
  () =>
    import("@/components/visualizations/AiFinancingUpdate202608Dashboard").then(
      (m) => m.AiFinancingUpdate202608Dashboard,
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

const AiSupplyChainUpdate2026q3Dashboard = dynamic(
  () =>
    import("@/components/visualizations/AiSupplyChainUpdate2026q3Dashboard").then(
      (m) => m.AiSupplyChainUpdate2026q3Dashboard,
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

const MacroGrowthTradeUpdate2026q3Dashboard = dynamic(
  () =>
    import("@/components/visualizations/MacroGrowthTradeUpdate2026q3Dashboard").then(
      (m) => m.MacroGrowthTradeUpdate2026q3Dashboard,
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

const AiCapexIntensityUpdate2026q3Dashboard = dynamic(
  () =>
    import("@/components/visualizations/AiCapexIntensityUpdate2026q3Dashboard").then(
      (m) => m.AiCapexIntensityUpdate2026q3Dashboard,
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

const AiComputeDemandUpdate202608Dashboard = dynamic(
  () =>
    import("@/components/visualizations/AiComputeDemandUpdate202608Dashboard").then(
      (m) => m.AiComputeDemandUpdate202608Dashboard,
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

const ConsumerFinanceMarketsUpdate202608Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/ConsumerFinanceMarketsUpdate202608Dashboard"
    ).then((m) => m.ConsumerFinanceMarketsUpdate202608Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const FiscalPlumbingUpdate2026Dashboard = dynamic(
  () =>
    import("@/components/visualizations/FiscalPlumbingUpdate2026Dashboard").then(
      (m) => m.FiscalPlumbingUpdate2026Dashboard,
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

const BankCommercialCreditUpdateDashboard = dynamic(
  () =>
    import("@/components/visualizations/BankCommercialCreditUpdateDashboard").then(
      (m) => m.BankCommercialCreditUpdateDashboard,
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

const IndustrialRoboticsConcentrationDashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/IndustrialRoboticsConcentrationDashboard"
    ).then((m) => m.IndustrialRoboticsConcentrationDashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const DemographicCashFlowsUpdate202608Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/DemographicCashFlowsUpdate202608Dashboard"
    ).then((m) => m.DemographicCashFlowsUpdate202608Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const HeavyIndustrialCapacityUpdate2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/HeavyIndustrialCapacityUpdate2026Dashboard"
    ).then((m) => m.HeavyIndustrialCapacityUpdate2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const GeopoliticsInstitutionsConcentrationDashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/GeopoliticsInstitutionsConcentrationDashboard"
    ).then((m) => m.GeopoliticsInstitutionsConcentrationDashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const MigrationHumanitarianUpdateDashboard = dynamic(
  () =>
    import("@/components/visualizations/MigrationHumanitarianUpdateDashboard").then(
      (m) => m.MigrationHumanitarianUpdateDashboard,
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

const FiscalIndustrialPolicyConcentrationDashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/FiscalIndustrialPolicyConcentrationDashboard"
    ).then((m) => m.FiscalIndustrialPolicyConcentrationDashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const MeasurementScienceUpdate202608Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/MeasurementScienceUpdate202608Dashboard"
    ).then((m) => m.MeasurementScienceUpdate202608Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const AiCapexSpendConcentrationDashboard = dynamic(
  () =>
    import("@/components/visualizations/AiCapexSpendConcentrationDashboard").then(
      (m) => m.AiCapexSpendConcentrationDashboard,
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

const FiscalPlumbingUpdate2026q3Dashboard = dynamic(
  () =>
    import("@/components/visualizations/FiscalPlumbingUpdate2026q3Dashboard").then(
      (m) => m.FiscalPlumbingUpdate2026q3Dashboard,
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

const ChokepointCommoditiesConcentrationDashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/ChokepointCommoditiesConcentrationDashboard"
    ).then((m) => m.ChokepointCommoditiesConcentrationDashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const AiFinancingConcentrationDashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/AiFinancingConcentrationDashboard"
    ).then((m) => m.AiFinancingConcentrationDashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const EnergySystemsUpdate202608Dashboard = dynamic(
  () =>
    import("@/components/visualizations/EnergySystemsUpdate202608Dashboard").then(
      (m) => m.EnergySystemsUpdate202608Dashboard,
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

const MacroGrowthTradeUpdate202608Dashboard = dynamic(
  () =>
    import("@/components/visualizations/MacroGrowthTradeUpdate202608Dashboard").then(
      (m) => m.MacroGrowthTradeUpdate202608Dashboard,
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

const AiSupplyChainUpdate202608Dashboard = dynamic(
  () =>
    import("@/components/visualizations/AiSupplyChainUpdate202608Dashboard").then(
      (m) => m.AiSupplyChainUpdate202608Dashboard,
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

const AiCapexIntensityUpdate202608Dashboard = dynamic(
  () =>
    import("@/components/visualizations/AiCapexIntensityUpdate202608Dashboard").then(
      (m) => m.AiCapexIntensityUpdate202608Dashboard,
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

const ConsumerFinanceMarketsConcentrationDashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/ConsumerFinanceMarketsConcentrationDashboard"
    ).then((m) => m.ConsumerFinanceMarketsConcentrationDashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const BankCommercialCreditUpdate2026q3Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/BankCommercialCreditUpdate2026q3Dashboard"
    ).then((m) => m.BankCommercialCreditUpdate2026q3Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const AiComputeDemandConcentrationDashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/AiComputeDemandConcentrationDashboard"
    ).then((m) => m.AiComputeDemandConcentrationDashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const DemographicCashFlowsConcentrationDashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/DemographicCashFlowsConcentrationDashboard"
    ).then((m) => m.DemographicCashFlowsConcentrationDashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const MigrationHumanitarianUpdate2026q3Dashboard = dynamic(
  () =>
    import("@/components/visualizations/MigrationHumanitarianUpdate2026q3Dashboard").then(
      (m) => m.MigrationHumanitarianUpdate2026q3Dashboard,
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

const FiscalIndustrialPolicyConcentration2026q3Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/FiscalIndustrialPolicyConcentration2026q3Dashboard"
    ).then((m) => m.FiscalIndustrialPolicyConcentration2026q3Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const MacroGrowthTradeConcentrationDashboard = dynamic(
  () =>
    import("@/components/visualizations/MacroGrowthTradeConcentrationDashboard").then(
      (m) => m.MacroGrowthTradeConcentrationDashboard,
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

const AiCapexSpendConcentration2026q3Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/AiCapexSpendConcentration2026q3Dashboard"
    ).then((m) => m.AiCapexSpendConcentration2026q3Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const DemographicCashFlowsConcentration2026q3Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/DemographicCashFlowsConcentration2026q3Dashboard"
    ).then((m) => m.DemographicCashFlowsConcentration2026q3Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const FiscalPlumbingUpdate202608Dashboard = dynamic(
  () =>
    import("@/components/visualizations/FiscalPlumbingUpdate202608Dashboard").then(
      (m) => m.FiscalPlumbingUpdate202608Dashboard,
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

const MeasurementScienceConcentrationDashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/MeasurementScienceConcentrationDashboard"
    ).then((m) => m.MeasurementScienceConcentrationDashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const FiscalIndustrialPolicyConcentration202608Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/FiscalIndustrialPolicyConcentration202608Dashboard"
    ).then((m) => m.FiscalIndustrialPolicyConcentration202608Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const AiCapexIntensityConcentrationDashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/AiCapexIntensityConcentrationDashboard"
    ).then((m) => m.AiCapexIntensityConcentrationDashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const AiSupplyChainConcentrationDashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/AiSupplyChainConcentrationDashboard"
    ).then((m) => m.AiSupplyChainConcentrationDashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const AiPowerGridUpdate202608Dashboard = dynamic(
  () =>
    import("@/components/visualizations/AiPowerGridUpdate202608Dashboard").then(
      (m) => m.AiPowerGridUpdate202608Dashboard,
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

const ConsumerFinanceMarketsConcentration2026q3Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/ConsumerFinanceMarketsConcentration2026q3Dashboard"
    ).then((m) => m.ConsumerFinanceMarketsConcentration2026q3Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const AiComputeDemandConcentration2026q3Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/AiComputeDemandConcentration2026q3Dashboard"
    ).then((m) => m.AiComputeDemandConcentration2026q3Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const ChokepointCommoditiesConcentration2026q3Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/ChokepointCommoditiesConcentration2026q3Dashboard"
    ).then((m) => m.ChokepointCommoditiesConcentration2026q3Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const HeavyIndustrialCapacityUpdate2026q3Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/HeavyIndustrialCapacityUpdate2026q3Dashboard"
    ).then((m) => m.HeavyIndustrialCapacityUpdate2026q3Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const AdaptationEconomicsConcentrationDashboard = dynamic(
  () =>
    import("@/components/visualizations/AdaptationEconomicsConcentrationDashboard").then(
      (m) => m.AdaptationEconomicsConcentrationDashboard,
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

const AiFinancingConcentration2026q3Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/AiFinancingConcentration2026q3Dashboard"
    ).then((m) => m.AiFinancingConcentration2026q3Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const IndustrialRoboticsConcentration2026q3Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/IndustrialRoboticsConcentration2026q3Dashboard"
    ).then((m) => m.IndustrialRoboticsConcentration2026q3Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const GeopoliticsInstitutionsConcentration2026q3Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/GeopoliticsInstitutionsConcentration2026q3Dashboard"
    ).then((m) => m.GeopoliticsInstitutionsConcentration2026q3Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const BankCommercialCreditUpdate202608Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/BankCommercialCreditUpdate202608Dashboard"
    ).then((m) => m.BankCommercialCreditUpdate202608Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const EnergySystemsConcentration2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/EnergySystemsConcentration2026Dashboard"
    ).then((m) => m.EnergySystemsConcentration2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const DemographicCashFlowsConcentration202608Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/DemographicCashFlowsConcentration202608Dashboard"
    ).then((m) => m.DemographicCashFlowsConcentration202608Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const MacroGrowthTradeConcentration2026q3Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/MacroGrowthTradeConcentration2026q3Dashboard"
    ).then((m) => m.MacroGrowthTradeConcentration2026q3Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const FiscalIndustrialPolicyGeography2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/FiscalIndustrialPolicyGeography2026Dashboard"
    ).then((m) => m.FiscalIndustrialPolicyGeography2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const AiPowerGridConcentration2026q3Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/AiPowerGridConcentration2026q3Dashboard"
    ).then((m) => m.AiPowerGridConcentration2026q3Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const AiSupplyChainConcentration2026q3Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/AiSupplyChainConcentration2026q3Dashboard"
    ).then((m) => m.AiSupplyChainConcentration2026q3Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const MeasurementScienceConcentration2026q3Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/MeasurementScienceConcentration2026q3Dashboard"
    ).then((m) => m.MeasurementScienceConcentration2026q3Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const FiscalPlumbingConcentration2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/FiscalPlumbingConcentration2026Dashboard"
    ).then((m) => m.FiscalPlumbingConcentration2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const ConsumerFinanceMarketsConcentration202608Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/ConsumerFinanceMarketsConcentration202608Dashboard"
    ).then((m) => m.ConsumerFinanceMarketsConcentration202608Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const ChokepointCommoditiesConcentration202608Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/ChokepointCommoditiesConcentration202608Dashboard"
    ).then((m) => m.ChokepointCommoditiesConcentration202608Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const MigrationHumanitarianUpdate202608Dashboard = dynamic(
  () =>
    import("@/components/visualizations/MigrationHumanitarianUpdate202608Dashboard").then(
      (m) => m.MigrationHumanitarianUpdate202608Dashboard,
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

const AiCapexSpendConcentration202608Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/AiCapexSpendConcentration202608Dashboard"
    ).then((m) => m.AiCapexSpendConcentration202608Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const AiComputeDemandConcentration202608Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/AiComputeDemandConcentration202608Dashboard"
    ).then((m) => m.AiComputeDemandConcentration202608Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const AdaptationEconomicsConcentration2026q3Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/AdaptationEconomicsConcentration2026q3Dashboard"
    ).then((m) => m.AdaptationEconomicsConcentration2026q3Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const IndustrialRoboticsConcentration202608Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/IndustrialRoboticsConcentration202608Dashboard"
    ).then((m) => m.IndustrialRoboticsConcentration202608Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const BankCommercialCreditConcentration2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/BankCommercialCreditConcentration2026Dashboard"
    ).then((m) => m.BankCommercialCreditConcentration2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const GeopoliticsInstitutionsConcentration202608Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/GeopoliticsInstitutionsConcentration202608Dashboard"
    ).then((m) => m.GeopoliticsInstitutionsConcentration202608Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const MacroGrowthTradeConcentration202608Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/MacroGrowthTradeConcentration202608Dashboard"
    ).then((m) => m.MacroGrowthTradeConcentration202608Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const AiFinancingConcentration202608Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/AiFinancingConcentration202608Dashboard"
    ).then((m) => m.AiFinancingConcentration202608Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const AiCapexIntensityConcentration2026q3Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/AiCapexIntensityConcentration2026q3Dashboard"
    ).then((m) => m.AiCapexIntensityConcentration2026q3Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const EnergySystemsConcentration2026q3Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/EnergySystemsConcentration2026q3Dashboard"
    ).then((m) => m.EnergySystemsConcentration2026q3Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const AiPowerGridConcentration202608Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/AiPowerGridConcentration202608Dashboard"
    ).then((m) => m.AiPowerGridConcentration202608Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const FiscalIndustrialPolicyGeography2026q3Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/FiscalIndustrialPolicyGeography2026q3Dashboard"
    ).then((m) => m.FiscalIndustrialPolicyGeography2026q3Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const AiSupplyChainConcentration202608Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/AiSupplyChainConcentration202608Dashboard"
    ).then((m) => m.AiSupplyChainConcentration202608Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const DemographicCashFlowsGeography2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/DemographicCashFlowsGeography2026Dashboard"
    ).then((m) => m.DemographicCashFlowsGeography2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const FiscalPlumbingConcentration2026q3Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/FiscalPlumbingConcentration2026q3Dashboard"
    ).then((m) => m.FiscalPlumbingConcentration2026q3Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const MeasurementScienceConcentration202608Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/MeasurementScienceConcentration202608Dashboard"
    ).then((m) => m.MeasurementScienceConcentration202608Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const AiCapexSpendGeography2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/AiCapexSpendGeography2026Dashboard"
    ).then((m) => m.AiCapexSpendGeography2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const MigrationHumanitarianConcentration2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/MigrationHumanitarianConcentration2026Dashboard"
    ).then((m) => m.MigrationHumanitarianConcentration2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const ChokepointCommoditiesGeography2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/ChokepointCommoditiesGeography2026Dashboard"
    ).then((m) => m.ChokepointCommoditiesGeography2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const ConsumerFinanceMarketsGeography2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/ConsumerFinanceMarketsGeography2026Dashboard"
    ).then((m) => m.ConsumerFinanceMarketsGeography2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const AiComputeDemandGeography2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/AiComputeDemandGeography2026Dashboard"
    ).then((m) => m.AiComputeDemandGeography2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const AdaptationEconomicsConcentration202608Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/AdaptationEconomicsConcentration202608Dashboard"
    ).then((m) => m.AdaptationEconomicsConcentration202608Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const GeopoliticsInstitutionsGeography2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/GeopoliticsInstitutionsGeography2026Dashboard"
    ).then((m) => m.GeopoliticsInstitutionsGeography2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const MacroGrowthTradeGeography2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/MacroGrowthTradeGeography2026Dashboard"
    ).then((m) => m.MacroGrowthTradeGeography2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const BankCommercialCreditConcentration2026q3Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/BankCommercialCreditConcentration2026q3Dashboard"
    ).then((m) => m.BankCommercialCreditConcentration2026q3Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const FiscalIndustrialPolicyGeography202608Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/FiscalIndustrialPolicyGeography202608Dashboard"
    ).then((m) => m.FiscalIndustrialPolicyGeography202608Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const AiCapexIntensityConcentration202608Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/AiCapexIntensityConcentration202608Dashboard"
    ).then((m) => m.AiCapexIntensityConcentration202608Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const AiFinancingGeography2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/AiFinancingGeography2026Dashboard"
    ).then((m) => m.AiFinancingGeography2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const AiSupplyChainGeography2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/AiSupplyChainGeography2026Dashboard"
    ).then((m) => m.AiSupplyChainGeography2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const EnergySystemsConcentration202608Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/EnergySystemsConcentration202608Dashboard"
    ).then((m) => m.EnergySystemsConcentration202608Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const MacroGrowthTradeGeography2026q3Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/MacroGrowthTradeGeography2026q3Dashboard"
    ).then((m) => m.MacroGrowthTradeGeography2026q3Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const FiscalPlumbingConcentration202608Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/FiscalPlumbingConcentration202608Dashboard"
    ).then((m) => m.FiscalPlumbingConcentration202608Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const DemographicCashFlowsGeography2026q3Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/DemographicCashFlowsGeography2026q3Dashboard"
    ).then((m) => m.DemographicCashFlowsGeography2026q3Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const AdaptationEconomicsGeography2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/AdaptationEconomicsGeography2026Dashboard"
    ).then((m) => m.AdaptationEconomicsGeography2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const MigrationHumanitarianConcentration2026q3Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/MigrationHumanitarianConcentration2026q3Dashboard"
    ).then((m) => m.MigrationHumanitarianConcentration2026q3Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const AiCapexSpendGeography2026q3Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/AiCapexSpendGeography2026q3Dashboard"
    ).then((m) => m.AiCapexSpendGeography2026q3Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const ChokepointCommoditiesGeography2026q3Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/ChokepointCommoditiesGeography2026q3Dashboard"
    ).then((m) => m.ChokepointCommoditiesGeography2026q3Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const MeasurementScienceGeography2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/MeasurementScienceGeography2026Dashboard"
    ).then((m) => m.MeasurementScienceGeography2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const UsShareOfGlobalSourcePlasma2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/UsShareOfGlobalSourcePlasma2026Dashboard"
    ).then((m) => m.UsShareOfGlobalSourcePlasma2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const PivotalTrialSitesByCountry2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/PivotalTrialSitesByCountry2026Dashboard"
    ).then((m) => m.PivotalTrialSitesByCountry2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const FaoCaptureVsAquacultureTonnage2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/FaoCaptureVsAquacultureTonnage2026Dashboard"
    ).then((m) => m.FaoCaptureVsAquacultureTonnage2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const WhoGlassBloodstreamResistance2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/WhoGlassBloodstreamResistance2026Dashboard"
    ).then((m) => m.WhoGlassBloodstreamResistance2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const ConstructionSandExtractionAndTrade2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/ConstructionSandExtractionAndTrade2026Dashboard"
    ).then((m) => m.ConstructionSandExtractionAndTrade2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const UsAtcDelayMinutesByCause2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/UsAtcDelayMinutesByCause2026Dashboard"
    ).then((m) => m.UsAtcDelayMinutesByCause2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const CorrespondentBankingCorridorRetreat2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/CorrespondentBankingCorridorRetreat2026Dashboard"
    ).then((m) => m.CorrespondentBankingCorridorRetreat2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const SpotContainerFreightVsBlankSailings2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/SpotContainerFreightVsBlankSailings2026Dashboard"
    ).then((m) => m.SpotContainerFreightVsBlankSailings2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const PublicDcFastChargersVsEvStock2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/PublicDcFastChargersVsEvStock2026Dashboard"
    ).then((m) => m.PublicDcFastChargersVsEvStock2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const ColoradoRiverCompactVsActualFlows2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/ColoradoRiverCompactVsActualFlows2026Dashboard"
    ).then((m) => m.ColoradoRiverCompactVsActualFlows2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const CementClinkerProcessEmissionsByCountry2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/CementClinkerProcessEmissionsByCountry2026Dashboard"
    ).then((m) => m.CementClinkerProcessEmissionsByCountry2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const OecdChildcareCostsVersusTotalFertility2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/OecdChildcareCostsVersusTotalFertility2026Dashboard"
    ).then((m) => m.OecdChildcareCostsVersusTotalFertility2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const EndowmentPayoutVsTuitionDependence2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/EndowmentPayoutVsTuitionDependence2026Dashboard"
    ).then((m) => m.EndowmentPayoutVsTuitionDependence2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const UsTrafficDeathsPerVmtVsPeerCountries2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/UsTrafficDeathsPerVmtVsPeerCountries2026Dashboard"
    ).then((m) => m.UsTrafficDeathsPerVmtVsPeerCountries2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const AdmittedHomeownersInsurersExitingCoastalStates2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/AdmittedHomeownersInsurersExitingCoastalStates2026Dashboard"
    ).then((m) => m.AdmittedHomeownersInsurersExitingCoastalStates2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const UsStatePensionFundedRatios2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/UsStatePensionFundedRatios2026Dashboard"
    ).then((m) => m.UsStatePensionFundedRatios2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const UsWorkStoppageIdlenessVersusUnionDensity2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/UsWorkStoppageIdlenessVersusUnionDensity2026Dashboard"
    ).then((m) => m.UsWorkStoppageIdlenessVersusUnionDensity2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const CornAndSoybeanExportChokepoints2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/CornAndSoybeanExportChokepoints2026Dashboard"
    ).then((m) => m.CornAndSoybeanExportChokepoints2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const SingleOwnerSubseaCableRisk2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/SingleOwnerSubseaCableRisk2026Dashboard"
    ).then((m) => m.SingleOwnerSubseaCableRisk2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const VeterinaryAntibioticSalesVsHumanUse2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/VeterinaryAntibioticSalesVsHumanUse2026Dashboard"
    ).then((m) => m.VeterinaryAntibioticSalesVsHumanUse2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const OgallalaAquiferSaturatedThicknessDecline2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/OgallalaAquiferSaturatedThicknessDecline2026Dashboard"
    ).then((m) => m.OgallalaAquiferSaturatedThicknessDecline2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const PlasmaCenterDensityVsPoverty2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/PlasmaCenterDensityVsPoverty2026Dashboard"
    ).then((m) => m.PlasmaCenterDensityVsPoverty2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const RegisteredApprenticeshipsVsTradesRetirements2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/RegisteredApprenticeshipsVsTradesRetirements2026Dashboard"
    ).then((m) => m.RegisteredApprenticeshipsVsTradesRetirements2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const FreightRailVelocityVersusShipperRates2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/FreightRailVelocityVersusShipperRates2026Dashboard"
    ).then((m) => m.FreightRailVelocityVersusShipperRates2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const UsGenericSterileInjectableShortages2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/UsGenericSterileInjectableShortages2026Dashboard"
    ).then((m) => m.UsGenericSterileInjectableShortages2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const UsCattleHerdAtSeventyYearLows2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/UsCattleHerdAtSeventyYearLows2026Dashboard"
    ).then((m) => m.UsCattleHerdAtSeventyYearLows2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const FarmShareOfTheFoodDollar2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/FarmShareOfTheFoodDollar2026Dashboard"
    ).then((m) => m.FarmShareOfTheFoodDollar2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const EmployerCoverageOfGlp1WeightLossDrugs2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/EmployerCoverageOfGlp1WeightLossDrugs2026Dashboard"
    ).then((m) => m.EmployerCoverageOfGlp1WeightLossDrugs2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const TruckingSpotRatesVersusCarrierExits2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/TruckingSpotRatesVersusCarrierExits2026Dashboard"
    ).then((m) => m.TruckingSpotRatesVersusCarrierExits2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const InstitutionalShareOfSingleFamilyRentals2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/InstitutionalShareOfSingleFamilyRentals2026Dashboard"
    ).then((m) => m.InstitutionalShareOfSingleFamilyRentals2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const HospitalSystemCloutVsCommercialPrices2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/HospitalSystemCloutVsCommercialPrices2026Dashboard"
    ).then((m) => m.HospitalSystemCloutVsCommercialPrices2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const OfficeVacancyVersusConversionPipelines2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/OfficeVacancyVersusConversionPipelines2026Dashboard"
    ).then((m) => m.OfficeVacancyVersusConversionPipelines2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const WomenAndMenInApprenticeTrades2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/WomenAndMenInApprenticeTrades2026Dashboard"
    ).then((m) => m.WomenAndMenInApprenticeTrades2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const FourFirmBeefpackingShare2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/FourFirmBeefpackingShare2026Dashboard"
    ).then((m) => m.FourFirmBeefpackingShare2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const AllianceCapacityShareOnTranspacific2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/AllianceCapacityShareOnTranspacific2026Dashboard"
    ).then((m) => m.AllianceCapacityShareOnTranspacific2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const UsCountiesWithNoLocalNewsOutlet2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/UsCountiesWithNoLocalNewsOutlet2026Dashboard"
    ).then((m) => m.UsCountiesWithNoLocalNewsOutlet2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const UsCyberInsurancePremiumsVsIncurredLosses2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/UsCyberInsurancePremiumsVsIncurredLosses2026Dashboard"
    ).then((m) => m.UsCyberInsurancePremiumsVsIncurredLosses2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const UsHousingPermitsVsHouseholdFormation2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/UsHousingPermitsVsHouseholdFormation2026Dashboard"
    ).then((m) => m.UsHousingPermitsVsHouseholdFormation2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const OrbitalLaunchCadenceByOperator2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/OrbitalLaunchCadenceByOperator2026Dashboard"
    ).then((m) => m.OrbitalLaunchCadenceByOperator2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const UsCrushedStoneVsConstructionPutInPlace2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/UsCrushedStoneVsConstructionPutInPlace2026Dashboard"
    ).then((m) => m.UsCrushedStoneVsConstructionPutInPlace2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const Global5gAuctionProceedsVsCoverage2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/Global5gAuctionProceedsVsCoverage2026Dashboard"
    ).then((m) => m.Global5gAuctionProceedsVsCoverage2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const RareDiseaseTrialDesertMap2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/RareDiseaseTrialDesertMap2026Dashboard"
    ).then((m) => m.RareDiseaseTrialDesertMap2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const InstantDomesticRailsVsSwiftForRetail2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/InstantDomesticRailsVsSwiftForRetail2026Dashboard"
    ).then((m) => m.InstantDomesticRailsVsSwiftForRetail2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const BiologicallyUnsustainableStocksShare2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/BiologicallyUnsustainableStocksShare2026Dashboard"
    ).then((m) => m.BiologicallyUnsustainableStocksShare2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const RansomwarePaymentsVsUninsuredLosses2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/RansomwarePaymentsVsUninsuredLosses2026Dashboard"
    ).then((m) => m.RansomwarePaymentsVsUninsuredLosses2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const ElectricianAndPlumberAgeCohorts2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/ElectricianAndPlumberAgeCohorts2026Dashboard"
    ).then((m) => m.ElectricianAndPlumberAgeCohorts2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const UsChildcarePriceVsWomenSPrimeAgeLfp2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/UsChildcarePriceVsWomenSPrimeAgeLfp2026Dashboard"
    ).then((m) => m.UsChildcarePriceVsWomenSPrimeAgeLfp2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const UsNeviCorridorGaps2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/UsNeviCorridorGaps2026Dashboard"
    ).then((m) => m.UsNeviCorridorGaps2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const GenericPriceDeclinesVersusManufacturerExits2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/GenericPriceDeclinesVersusManufacturerExits2026Dashboard"
    ).then((m) => m.GenericPriceDeclinesVersusManufacturerExits2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const EggPriceShocksAndPassThrough2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/EggPriceShocksAndPassThrough2026Dashboard"
    ).then((m) => m.EggPriceShocksAndPassThrough2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const BlastFurnaceVsEafSteelByCountry2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/BlastFurnaceVsEafSteelByCountry2026Dashboard"
    ).then((m) => m.BlastFurnaceVsEafSteelByCountry2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const RailHeadcountAfterPrecisionScheduling2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/RailHeadcountAfterPrecisionScheduling2026Dashboard"
    ).then((m) => m.RailHeadcountAfterPrecisionScheduling2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const MedicarePartDGlp1DiabetesSpending2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/MedicarePartDGlp1DiabetesSpending2026Dashboard"
    ).then((m) => m.MedicarePartDGlp1DiabetesSpending2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const ContractRenewalSeasonVsSpotDivergence2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/ContractRenewalSeasonVsSpotDivergence2026Dashboard"
    ).then((m) => m.ContractRenewalSeasonVsSpotDivergence2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const SocialHousingStockShareInOecd2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/SocialHousingStockShareInOecd2026Dashboard"
    ).then((m) => m.SocialHousingStockShareInOecd2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const ReinsuranceRateOnLineVsResidualTakeUp2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/ReinsuranceRateOnLineVsResidualTakeUp2026Dashboard"
    ).then((m) => m.ReinsuranceRateOnLineVsResidualTakeUp2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const GlobalRoadDeathsVsVehicleStock2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/GlobalRoadDeathsVsVehicleStock2026Dashboard"
    ).then((m) => m.GlobalRoadDeathsVsVehicleStock2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const LocalPoliceFirePlanUnderfunding2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/LocalPoliceFirePlanUnderfunding2026Dashboard"
    ).then((m) => m.LocalPoliceFirePlanUnderfunding2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const TradeWagesVersusCollegeMajors2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/TradeWagesVersusCollegeMajors2026Dashboard"
    ).then((m) => m.TradeWagesVersusCollegeMajors2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const OecdStrikeDaysPer1000Employees2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/OecdStrikeDaysPer1000Employees2026Dashboard"
    ).then((m) => m.OecdStrikeDaysPer1000Employees2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const CataloguedOrbitalDebrisGrowth2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/CataloguedOrbitalDebrisGrowth2026Dashboard"
    ).then((m) => m.CataloguedOrbitalDebrisGrowth2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const SubsidyCostPerConvertedApartment2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/SubsidyCostPerConvertedApartment2026Dashboard"
    ).then((m) => m.SubsidyCostPerConvertedApartment2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const NewspaperEmploymentVsHedgeFundOwnership2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/NewspaperEmploymentVsHedgeFundOwnership2026Dashboard"
    ).then((m) => m.NewspaperEmploymentVsHedgeFundOwnership2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const RuralHospitalClosuresAndDriveTimes2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/RuralHospitalClosuresAndDriveTimes2026Dashboard"
    ).then((m) => m.RuralHospitalClosuresAndDriveTimes2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const RentBurdenShareOfRenterIncome2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/RentBurdenShareOfRenterIncome2026Dashboard"
    ).then((m) => m.RentBurdenShareOfRenterIncome2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const RealWageGrowthByWageQuintile2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/RealWageGrowthByWageQuintile2026Dashboard"
    ).then((m) => m.RealWageGrowthByWageQuintile2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const PlatformEarningsSwingsAndHouseholdReliance2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/PlatformEarningsSwingsAndHouseholdReliance2026Dashboard"
    ).then((m) => m.PlatformEarningsSwingsAndHouseholdReliance2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const StateSalesTaxBasesVsTheServiceEconomy2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/StateSalesTaxBasesVsTheServiceEconomy2026Dashboard"
    ).then((m) => m.StateSalesTaxBasesVsTheServiceEconomy2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const InvestorHomePurchasesVsFirstTimeBuyers2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/InvestorHomePurchasesVsFirstTimeBuyers2026Dashboard"
    ).then((m) => m.InvestorHomePurchasesVsFirstTimeBuyers2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const CroplandValuesVersusFarmIncomes2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/CroplandValuesVersusFarmIncomes2026Dashboard"
    ).then((m) => m.CroplandValuesVersusFarmIncomes2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const UninsuranceByStateAfterMedicaidUnwinding2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/UninsuranceByStateAfterMedicaidUnwinding2026Dashboard"
    ).then((m) => m.UninsuranceByStateAfterMedicaidUnwinding2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const HighPropensityApplicationsVsEmployerFirms2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/HighPropensityApplicationsVsEmployerFirms2026Dashboard"
    ).then((m) => m.HighPropensityApplicationsVsEmployerFirms2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const StateSalesTaxBaseErosion2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/StateSalesTaxBaseErosion2026Dashboard"
    ).then((m) => m.StateSalesTaxBaseErosion2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const HealthInsuranceCoverageGapsCensus2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/HealthInsuranceCoverageGapsCensus2026Dashboard"
    ).then((m) => m.HealthInsuranceCoverageGapsCensus2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const RemoteSalesTaxCollectionAfterWayfair2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/RemoteSalesTaxCollectionAfterWayfair2026Dashboard"
    ).then((m) => m.RemoteSalesTaxCollectionAfterWayfair2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const CreditOutcomesOfGigDependentHouseholds2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/CreditOutcomesOfGigDependentHouseholds2026Dashboard"
    ).then((m) => m.CreditOutcomesOfGigDependentHouseholds2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const SurvivalCurvesOfPandemicEraStartups2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/SurvivalCurvesOfPandemicEraStartups2026Dashboard"
    ).then((m) => m.SurvivalCurvesOfPandemicEraStartups2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const CoverageGapsInGigAndSmallFirmWork2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/CoverageGapsInGigAndSmallFirmWork2026Dashboard"
    ).then((m) => m.CoverageGapsInGigAndSmallFirmWork2026Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">Loading interactive charts…</p>
      </div>
    ),
  },
);

const CashRentsVersusLandPricesByState2026Dashboard = dynamic(
  () =>
    import(
      "@/components/visualizations/CashRentsVersusLandPricesByState2026Dashboard"
    ).then((m) => m.CashRentsVersusLandPricesByState2026Dashboard),
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

  if (type === "geopolitics-institutions-update-2026") {
    return <GeopoliticsInstitutionsUpdateDashboard />;
  }

  if (type === "measurement-science-update-2026") {
    return <MeasurementScienceUpdateDashboard />;
  }

  if (type === "demographic-cash-flows-update-2026") {
    return <DemographicCashFlowsUpdateDashboard />;
  }

  if (type === "adaptation-economics-update-2026") {
    return <AdaptationEconomicsUpdateDashboard />;
  }

  if (type === "industrial-robotics-update-2026") {
    return <IndustrialRoboticsUpdateDashboard />;
  }

  if (type === "energy-systems-update-2026") {
    return <EnergySystemsUpdateDashboard />;
  }

  if (type === "chokepoint-commodities-update-2026") {
    return <ChokepointCommoditiesUpdateDashboard />;
  }

  if (type === "consumer-finance-markets-update-2026") {
    return <ConsumerFinanceMarketsUpdateDashboard />;
  }

  if (type === "geopolitics-institutions-update-2026q3") {
    return <GeopoliticsInstitutionsUpdate2026q3Dashboard />;
  }

  if (type === "ai-compute-demand-update-2026q3") {
    return <AiComputeDemandUpdate2026q3Dashboard />;
  }

  if (type === "fiscal-industrial-policy-update-2026q3") {
    return <FiscalIndustrialPolicyUpdate2026q3Dashboard />;
  }

  if (type === "ai-capex-spend-update-2026q3") {
    return <AiCapexSpendUpdate2026q3Dashboard />;
  }

  if (type === "ai-power-grid-update-2026") {
    return <AiPowerGridUpdateDashboard />;
  }

  if (type === "ai-financing-update-2026q3") {
    return <AiFinancingUpdate2026q3Dashboard />;
  }

  if (type === "industrial-robotics-update-2026q3") {
    return <IndustrialRoboticsUpdate2026q3Dashboard />;
  }

  if (type === "consumer-finance-markets-update-2026q3") {
    return <ConsumerFinanceMarketsUpdate2026q3Dashboard />;
  }

  if (type === "chokepoint-commodities-update-2026q3") {
    return <ChokepointCommoditiesUpdate2026q3Dashboard />;
  }

  if (type === "demographic-cash-flows-update-2026q3") {
    return <DemographicCashFlowsUpdate2026q3Dashboard />;
  }

  if (type === "heavy-industrial-capacity-research-2026") {
    return <HeavyIndustrialCapacityResearch2026Dashboard />;
  }

  if (type === "measurement-science-update-2026q3") {
    return <MeasurementScienceUpdate2026q3Dashboard />;
  }

  if (type === "adaptation-economics-update-2026q3") {
    return <AdaptationEconomicsUpdate2026q3Dashboard />;
  }

  if (type === "industrial-robotics-update-202608") {
    return <IndustrialRoboticsUpdate202608Dashboard />;
  }

  if (type === "energy-systems-update-2026q3") {
    return <EnergySystemsUpdate2026q3Dashboard />;
  }

  if (type === "fiscal-industrial-policy-update-202608") {
    return <FiscalIndustrialPolicyUpdate202608Dashboard />;
  }

  if (type === "geopolitics-institutions-update-202608") {
    return <GeopoliticsInstitutionsUpdate202608Dashboard />;
  }

  if (type === "chokepoint-commodities-update-202608") {
    return <ChokepointCommoditiesUpdate202608Dashboard />;
  }

  if (type === "ai-capex-spend-update-202608") {
    return <AiCapexSpendUpdate202608Dashboard />;
  }

  if (type === "ai-power-grid-update-2026q3") {
    return <AiPowerGridUpdate2026q3Dashboard />;
  }

  if (type === "adaptation-economics-update-202608") {
    return <AdaptationEconomicsUpdate202608Dashboard />;
  }

  if (type === "ai-financing-update-202608") {
    return <AiFinancingUpdate202608Dashboard />;
  }

  if (type === "ai-supply-chain-update-2026q3") {
    return <AiSupplyChainUpdate2026q3Dashboard />;
  }

  if (type === "macro-growth-trade-update-2026q3") {
    return <MacroGrowthTradeUpdate2026q3Dashboard />;
  }

  if (type === "ai-capex-intensity-update-2026q3") {
    return <AiCapexIntensityUpdate2026q3Dashboard />;
  }

  if (type === "ai-compute-demand-update-202608") {
    return <AiComputeDemandUpdate202608Dashboard />;
  }

  if (type === "consumer-finance-markets-update-202608") {
    return <ConsumerFinanceMarketsUpdate202608Dashboard />;
  }

  if (type === "fiscal-plumbing-update-2026") {
    return <FiscalPlumbingUpdate2026Dashboard />;
  }

  if (type === "bank-commercial-credit-update-2026") {
    return <BankCommercialCreditUpdateDashboard />;
  }

  if (type === "industrial-robotics-concentration-2026") {
    return <IndustrialRoboticsConcentrationDashboard />;
  }

  if (type === "demographic-cash-flows-update-202608") {
    return <DemographicCashFlowsUpdate202608Dashboard />;
  }

  if (type === "heavy-industrial-capacity-update-2026") {
    return <HeavyIndustrialCapacityUpdate2026Dashboard />;
  }

  if (type === "geopolitics-institutions-concentration-2026") {
    return <GeopoliticsInstitutionsConcentrationDashboard />;
  }

  if (type === "migration-humanitarian-update-2026") {
    return <MigrationHumanitarianUpdateDashboard />;
  }

  if (type === "fiscal-industrial-policy-concentration-2026") {
    return <FiscalIndustrialPolicyConcentrationDashboard />;
  }

  if (type === "measurement-science-update-202608") {
    return <MeasurementScienceUpdate202608Dashboard />;
  }

  if (type === "ai-capex-spend-concentration-2026") {
    return <AiCapexSpendConcentrationDashboard />;
  }

  if (type === "fiscal-plumbing-update-2026q3") {
    return <FiscalPlumbingUpdate2026q3Dashboard />;
  }

  if (type === "chokepoint-commodities-concentration-2026") {
    return <ChokepointCommoditiesConcentrationDashboard />;
  }

  if (type === "ai-financing-concentration-2026") {
    return <AiFinancingConcentrationDashboard />;
  }

  if (type === "energy-systems-update-202608") {
    return <EnergySystemsUpdate202608Dashboard />;
  }

  if (type === "macro-growth-trade-update-202608") {
    return <MacroGrowthTradeUpdate202608Dashboard />;
  }

  if (type === "ai-supply-chain-update-202608") {
    return <AiSupplyChainUpdate202608Dashboard />;
  }

  if (type === "ai-capex-intensity-update-202608") {
    return <AiCapexIntensityUpdate202608Dashboard />;
  }

  if (type === "consumer-finance-markets-concentration-2026") {
    return <ConsumerFinanceMarketsConcentrationDashboard />;
  }

  if (type === "bank-commercial-credit-update-2026q3") {
    return <BankCommercialCreditUpdate2026q3Dashboard />;
  }

  if (type === "ai-compute-demand-concentration-2026") {
    return <AiComputeDemandConcentrationDashboard />;
  }

  if (type === "demographic-cash-flows-concentration-2026") {
    return <DemographicCashFlowsConcentrationDashboard />;
  }

  if (type === "migration-humanitarian-update-2026q3") {
    return <MigrationHumanitarianUpdate2026q3Dashboard />;
  }

  if (type === "fiscal-industrial-policy-concentration-2026q3") {
    return <FiscalIndustrialPolicyConcentration2026q3Dashboard />;
  }

  if (type === "macro-growth-trade-concentration-2026") {
    return <MacroGrowthTradeConcentrationDashboard />;
  }

  if (type === "ai-capex-spend-concentration-2026q3") {
    return <AiCapexSpendConcentration2026q3Dashboard />;
  }

  if (type === "demographic-cash-flows-concentration-2026q3") {
    return <DemographicCashFlowsConcentration2026q3Dashboard />;
  }

  if (type === "fiscal-plumbing-update-202608") {
    return <FiscalPlumbingUpdate202608Dashboard />;
  }

  if (type === "measurement-science-concentration-2026") {
    return <MeasurementScienceConcentrationDashboard />;
  }

  if (type === "fiscal-industrial-policy-concentration-202608") {
    return <FiscalIndustrialPolicyConcentration202608Dashboard />;
  }

  if (type === "ai-capex-intensity-concentration-2026") {
    return <AiCapexIntensityConcentrationDashboard />;
  }

  if (type === "ai-supply-chain-concentration-2026") {
    return <AiSupplyChainConcentrationDashboard />;
  }

  if (type === "ai-power-grid-update-202608") {
    return <AiPowerGridUpdate202608Dashboard />;
  }

  if (type === "consumer-finance-markets-concentration-2026q3") {
    return <ConsumerFinanceMarketsConcentration2026q3Dashboard />;
  }

  if (type === "ai-compute-demand-concentration-2026q3") {
    return <AiComputeDemandConcentration2026q3Dashboard />;
  }

  if (type === "chokepoint-commodities-concentration-2026q3") {
    return <ChokepointCommoditiesConcentration2026q3Dashboard />;
  }

  if (type === "heavy-industrial-capacity-update-2026q3") {
    return <HeavyIndustrialCapacityUpdate2026q3Dashboard />;
  }

  if (type === "adaptation-economics-concentration-2026") {
    return <AdaptationEconomicsConcentrationDashboard />;
  }

  if (type === "ai-financing-concentration-2026q3") {
    return <AiFinancingConcentration2026q3Dashboard />;
  }

  if (type === "industrial-robotics-concentration-2026q3") {
    return <IndustrialRoboticsConcentration2026q3Dashboard />;
  }

  if (type === "geopolitics-institutions-concentration-2026q3") {
    return <GeopoliticsInstitutionsConcentration2026q3Dashboard />;
  }

  if (type === "bank-commercial-credit-update-202608") {
    return <BankCommercialCreditUpdate202608Dashboard />;
  }

  if (type === "energy-systems-concentration-2026") {
    return <EnergySystemsConcentration2026Dashboard />;
  }

  if (type === "demographic-cash-flows-concentration-202608") {
    return <DemographicCashFlowsConcentration202608Dashboard />;
  }

  if (type === "macro-growth-trade-concentration-2026q3") {
    return <MacroGrowthTradeConcentration2026q3Dashboard />;
  }

  if (type === "fiscal-industrial-policy-geography-2026") {
    return <FiscalIndustrialPolicyGeography2026Dashboard />;
  }

  if (type === "ai-power-grid-concentration-2026q3") {
    return <AiPowerGridConcentration2026q3Dashboard />;
  }

  if (type === "ai-supply-chain-concentration-2026q3") {
    return <AiSupplyChainConcentration2026q3Dashboard />;
  }

  if (type === "measurement-science-concentration-2026q3") {
    return <MeasurementScienceConcentration2026q3Dashboard />;
  }

  if (type === "fiscal-plumbing-concentration-2026") {
    return <FiscalPlumbingConcentration2026Dashboard />;
  }

  if (type === "consumer-finance-markets-concentration-202608") {
    return <ConsumerFinanceMarketsConcentration202608Dashboard />;
  }

  if (type === "chokepoint-commodities-concentration-202608") {
    return <ChokepointCommoditiesConcentration202608Dashboard />;
  }

  if (type === "migration-humanitarian-update-202608") {
    return <MigrationHumanitarianUpdate202608Dashboard />;
  }

  if (type === "ai-capex-spend-concentration-202608") {
    return <AiCapexSpendConcentration202608Dashboard />;
  }

  if (type === "ai-compute-demand-concentration-202608") {
    return <AiComputeDemandConcentration202608Dashboard />;
  }

  if (type === "adaptation-economics-concentration-2026q3") {
    return <AdaptationEconomicsConcentration2026q3Dashboard />;
  }

  if (type === "industrial-robotics-concentration-202608") {
    return <IndustrialRoboticsConcentration202608Dashboard />;
  }

  if (type === "bank-commercial-credit-concentration-2026") {
    return <BankCommercialCreditConcentration2026Dashboard />;
  }

  if (type === "geopolitics-institutions-concentration-202608") {
    return <GeopoliticsInstitutionsConcentration202608Dashboard />;
  }

  if (type === "macro-growth-trade-concentration-202608") {
    return <MacroGrowthTradeConcentration202608Dashboard />;
  }

  if (type === "ai-financing-concentration-202608") {
    return <AiFinancingConcentration202608Dashboard />;
  }

  if (type === "ai-capex-intensity-concentration-2026q3") {
    return <AiCapexIntensityConcentration2026q3Dashboard />;
  }

  if (type === "energy-systems-concentration-2026q3") {
    return <EnergySystemsConcentration2026q3Dashboard />;
  }

  if (type === "ai-power-grid-concentration-202608") {
    return <AiPowerGridConcentration202608Dashboard />;
  }

  if (type === "fiscal-industrial-policy-geography-2026q3") {
    return <FiscalIndustrialPolicyGeography2026q3Dashboard />;
  }

  if (type === "ai-supply-chain-concentration-202608") {
    return <AiSupplyChainConcentration202608Dashboard />;
  }

  if (type === "demographic-cash-flows-geography-2026") {
    return <DemographicCashFlowsGeography2026Dashboard />;
  }

  if (type === "fiscal-plumbing-concentration-2026q3") {
    return <FiscalPlumbingConcentration2026q3Dashboard />;
  }

  if (type === "measurement-science-concentration-202608") {
    return <MeasurementScienceConcentration202608Dashboard />;
  }

  if (type === "ai-capex-spend-geography-2026") {
    return <AiCapexSpendGeography2026Dashboard />;
  }

  if (type === "migration-humanitarian-concentration-2026") {
    return <MigrationHumanitarianConcentration2026Dashboard />;
  }

  if (type === "chokepoint-commodities-geography-2026") {
    return <ChokepointCommoditiesGeography2026Dashboard />;
  }

  if (type === "consumer-finance-markets-geography-2026") {
    return <ConsumerFinanceMarketsGeography2026Dashboard />;
  }

  if (type === "ai-compute-demand-geography-2026") {
    return <AiComputeDemandGeography2026Dashboard />;
  }

  if (type === "adaptation-economics-concentration-202608") {
    return <AdaptationEconomicsConcentration202608Dashboard />;
  }

  if (type === "geopolitics-institutions-geography-2026") {
    return <GeopoliticsInstitutionsGeography2026Dashboard />;
  }

  if (type === "macro-growth-trade-geography-2026") {
    return <MacroGrowthTradeGeography2026Dashboard />;
  }

  if (type === "bank-commercial-credit-concentration-2026q3") {
    return <BankCommercialCreditConcentration2026q3Dashboard />;
  }

  if (type === "fiscal-industrial-policy-geography-202608") {
    return <FiscalIndustrialPolicyGeography202608Dashboard />;
  }

  if (type === "ai-capex-intensity-concentration-202608") {
    return <AiCapexIntensityConcentration202608Dashboard />;
  }

  if (type === "ai-financing-geography-2026") {
    return <AiFinancingGeography2026Dashboard />;
  }

  if (type === "ai-supply-chain-geography-2026") {
    return <AiSupplyChainGeography2026Dashboard />;
  }

  if (type === "energy-systems-concentration-202608") {
    return <EnergySystemsConcentration202608Dashboard />;
  }

  if (type === "macro-growth-trade-geography-2026q3") {
    return <MacroGrowthTradeGeography2026q3Dashboard />;
  }

  if (type === "fiscal-plumbing-concentration-202608") {
    return <FiscalPlumbingConcentration202608Dashboard />;
  }

  if (type === "demographic-cash-flows-geography-2026q3") {
    return <DemographicCashFlowsGeography2026q3Dashboard />;
  }

  if (type === "adaptation-economics-geography-2026") {
    return <AdaptationEconomicsGeography2026Dashboard />;
  }

  if (type === "migration-humanitarian-concentration-2026q3") {
    return <MigrationHumanitarianConcentration2026q3Dashboard />;
  }

  if (type === "ai-capex-spend-geography-2026q3") {
    return <AiCapexSpendGeography2026q3Dashboard />;
  }

  if (type === "chokepoint-commodities-geography-2026q3") {
    return <ChokepointCommoditiesGeography2026q3Dashboard />;
  }

  if (type === "measurement-science-geography-2026") {
    return <MeasurementScienceGeography2026Dashboard />;
  }

  if (type === "us-share-of-global-source-plasma-2026") {
    return <UsShareOfGlobalSourcePlasma2026Dashboard />;
  }

  if (type === "pivotal-trial-sites-by-country-2026") {
    return <PivotalTrialSitesByCountry2026Dashboard />;
  }

  if (type === "fao-capture-vs-aquaculture-tonnage-2026") {
    return <FaoCaptureVsAquacultureTonnage2026Dashboard />;
  }

  if (type === "who-glass-bloodstream-resistance-2026") {
    return <WhoGlassBloodstreamResistance2026Dashboard />;
  }

  if (type === "construction-sand-extraction-and-trade-2026") {
    return <ConstructionSandExtractionAndTrade2026Dashboard />;
  }

  if (type === "us-atc-delay-minutes-by-cause-2026") {
    return <UsAtcDelayMinutesByCause2026Dashboard />;
  }

  if (type === "correspondent-banking-corridor-retreat-2026") {
    return <CorrespondentBankingCorridorRetreat2026Dashboard />;
  }

  if (type === "spot-container-freight-vs-blank-sailings-2026") {
    return <SpotContainerFreightVsBlankSailings2026Dashboard />;
  }

  if (type === "public-dc-fast-chargers-vs-ev-stock-2026") {
    return <PublicDcFastChargersVsEvStock2026Dashboard />;
  }

  if (type === "colorado-river-compact-vs-actual-flows-2026") {
    return <ColoradoRiverCompactVsActualFlows2026Dashboard />;
  }

  if (type === "cement-clinker-process-emissions-by-country-2026") {
    return <CementClinkerProcessEmissionsByCountry2026Dashboard />;
  }

  if (type === "oecd-childcare-costs-versus-total-fertility-2026") {
    return <OecdChildcareCostsVersusTotalFertility2026Dashboard />;
  }

  if (type === "endowment-payout-vs-tuition-dependence-2026") {
    return <EndowmentPayoutVsTuitionDependence2026Dashboard />;
  }

  if (type === "us-traffic-deaths-per-vmt-vs-peer-countries-2026") {
    return <UsTrafficDeathsPerVmtVsPeerCountries2026Dashboard />;
  }

  if (type === "admitted-homeowners-insurers-exiting-coastal-states-2026") {
    return <AdmittedHomeownersInsurersExitingCoastalStates2026Dashboard />;
  }

  if (type === "us-state-pension-funded-ratios-2026") {
    return <UsStatePensionFundedRatios2026Dashboard />;
  }

  if (type === "us-work-stoppage-idleness-versus-union-density-2026") {
    return <UsWorkStoppageIdlenessVersusUnionDensity2026Dashboard />;
  }

  if (type === "corn-and-soybean-export-chokepoints-2026") {
    return <CornAndSoybeanExportChokepoints2026Dashboard />;
  }

  if (type === "single-owner-subsea-cable-risk-2026") {
    return <SingleOwnerSubseaCableRisk2026Dashboard />;
  }

  if (type === "veterinary-antibiotic-sales-vs-human-use-2026") {
    return <VeterinaryAntibioticSalesVsHumanUse2026Dashboard />;
  }

  if (type === "ogallala-aquifer-saturated-thickness-decline-2026") {
    return <OgallalaAquiferSaturatedThicknessDecline2026Dashboard />;
  }

  if (type === "plasma-center-density-vs-poverty-2026") {
    return <PlasmaCenterDensityVsPoverty2026Dashboard />;
  }

  if (type === "registered-apprenticeships-vs-trades-retirements-2026") {
    return <RegisteredApprenticeshipsVsTradesRetirements2026Dashboard />;
  }

  if (type === "freight-rail-velocity-versus-shipper-rates-2026") {
    return <FreightRailVelocityVersusShipperRates2026Dashboard />;
  }

  if (type === "us-generic-sterile-injectable-shortages-2026") {
    return <UsGenericSterileInjectableShortages2026Dashboard />;
  }

  if (type === "us-cattle-herd-at-seventy-year-lows-2026") {
    return <UsCattleHerdAtSeventyYearLows2026Dashboard />;
  }

  if (type === "farm-share-of-the-food-dollar-2026") {
    return <FarmShareOfTheFoodDollar2026Dashboard />;
  }

  if (type === "employer-coverage-of-glp-1-weight-loss-drugs-2026") {
    return <EmployerCoverageOfGlp1WeightLossDrugs2026Dashboard />;
  }

  if (type === "trucking-spot-rates-versus-carrier-exits-2026") {
    return <TruckingSpotRatesVersusCarrierExits2026Dashboard />;
  }

  if (type === "institutional-share-of-single-family-rentals-2026") {
    return <InstitutionalShareOfSingleFamilyRentals2026Dashboard />;
  }

  if (type === "hospital-system-clout-vs-commercial-prices-2026") {
    return <HospitalSystemCloutVsCommercialPrices2026Dashboard />;
  }

  if (type === "office-vacancy-versus-conversion-pipelines-2026") {
    return <OfficeVacancyVersusConversionPipelines2026Dashboard />;
  }

  if (type === "women-and-men-in-apprentice-trades-2026") {
    return <WomenAndMenInApprenticeTrades2026Dashboard />;
  }

  if (type === "four-firm-beefpacking-share-2026") {
    return <FourFirmBeefpackingShare2026Dashboard />;
  }

  if (type === "alliance-capacity-share-on-transpacific-2026") {
    return <AllianceCapacityShareOnTranspacific2026Dashboard />;
  }

  if (type === "us-counties-with-no-local-news-outlet-2026") {
    return <UsCountiesWithNoLocalNewsOutlet2026Dashboard />;
  }

  if (type === "us-cyber-insurance-premiums-vs-incurred-losses-2026") {
    return <UsCyberInsurancePremiumsVsIncurredLosses2026Dashboard />;
  }

  if (type === "us-housing-permits-vs-household-formation-2026") {
    return <UsHousingPermitsVsHouseholdFormation2026Dashboard />;
  }

  if (type === "orbital-launch-cadence-by-operator-2026") {
    return <OrbitalLaunchCadenceByOperator2026Dashboard />;
  }

  if (type === "us-crushed-stone-vs-construction-put-in-place-2026") {
    return <UsCrushedStoneVsConstructionPutInPlace2026Dashboard />;
  }

  if (type === "global-5g-auction-proceeds-vs-coverage-2026") {
    return <Global5gAuctionProceedsVsCoverage2026Dashboard />;
  }

  if (type === "rare-disease-trial-desert-map-2026") {
    return <RareDiseaseTrialDesertMap2026Dashboard />;
  }

  if (type === "instant-domestic-rails-vs-swift-for-retail-2026") {
    return <InstantDomesticRailsVsSwiftForRetail2026Dashboard />;
  }

  if (type === "biologically-unsustainable-stocks-share-2026") {
    return <BiologicallyUnsustainableStocksShare2026Dashboard />;
  }

  if (type === "ransomware-payments-vs-uninsured-losses-2026") {
    return <RansomwarePaymentsVsUninsuredLosses2026Dashboard />;
  }

  if (type === "electrician-and-plumber-age-cohorts-2026") {
    return <ElectricianAndPlumberAgeCohorts2026Dashboard />;
  }

  if (type === "us-childcare-price-vs-women-s-prime-age-lfp-2026") {
    return <UsChildcarePriceVsWomenSPrimeAgeLfp2026Dashboard />;
  }

  if (type === "us-nevi-corridor-gaps-2026") {
    return <UsNeviCorridorGaps2026Dashboard />;
  }

  if (type === "generic-price-declines-versus-manufacturer-exits-2026") {
    return <GenericPriceDeclinesVersusManufacturerExits2026Dashboard />;
  }

  if (type === "egg-price-shocks-and-pass-through-2026") {
    return <EggPriceShocksAndPassThrough2026Dashboard />;
  }

  if (type === "blast-furnace-vs-eaf-steel-by-country-2026") {
    return <BlastFurnaceVsEafSteelByCountry2026Dashboard />;
  }

  if (type === "rail-headcount-after-precision-scheduling-2026") {
    return <RailHeadcountAfterPrecisionScheduling2026Dashboard />;
  }

  if (type === "medicare-part-d-glp-1-diabetes-spending-2026") {
    return <MedicarePartDGlp1DiabetesSpending2026Dashboard />;
  }

  if (type === "contract-renewal-season-vs-spot-divergence-2026") {
    return <ContractRenewalSeasonVsSpotDivergence2026Dashboard />;
  }

  if (type === "social-housing-stock-share-in-oecd-2026") {
    return <SocialHousingStockShareInOecd2026Dashboard />;
  }

  if (type === "reinsurance-rate-on-line-vs-residual-take-up-2026") {
    return <ReinsuranceRateOnLineVsResidualTakeUp2026Dashboard />;
  }

  if (type === "global-road-deaths-vs-vehicle-stock-2026") {
    return <GlobalRoadDeathsVsVehicleStock2026Dashboard />;
  }

  if (type === "local-police-fire-plan-underfunding-2026") {
    return <LocalPoliceFirePlanUnderfunding2026Dashboard />;
  }

  if (type === "trade-wages-versus-college-majors-2026") {
    return <TradeWagesVersusCollegeMajors2026Dashboard />;
  }

  if (type === "oecd-strike-days-per-1-000-employees-2026") {
    return <OecdStrikeDaysPer1000Employees2026Dashboard />;
  }

  if (type === "catalogued-orbital-debris-growth-2026") {
    return <CataloguedOrbitalDebrisGrowth2026Dashboard />;
  }

  if (type === "subsidy-cost-per-converted-apartment-2026") {
    return <SubsidyCostPerConvertedApartment2026Dashboard />;
  }

  if (type === "newspaper-employment-vs-hedge-fund-ownership-2026") {
    return <NewspaperEmploymentVsHedgeFundOwnership2026Dashboard />;
  }

  if (type === "rural-hospital-closures-and-drive-times-2026") {
    return <RuralHospitalClosuresAndDriveTimes2026Dashboard />;
  }

  if (type === "rent-burden-share-of-renter-income-2026") {
    return <RentBurdenShareOfRenterIncome2026Dashboard />;
  }

  if (type === "real-wage-growth-by-wage-quintile-2026") {
    return <RealWageGrowthByWageQuintile2026Dashboard />;
  }

  if (type === "platform-earnings-swings-and-household-reliance-2026") {
    return <PlatformEarningsSwingsAndHouseholdReliance2026Dashboard />;
  }

  if (type === "state-sales-tax-bases-vs-the-service-economy-2026") {
    return <StateSalesTaxBasesVsTheServiceEconomy2026Dashboard />;
  }

  if (type === "investor-home-purchases-vs-first-time-buyers-2026") {
    return <InvestorHomePurchasesVsFirstTimeBuyers2026Dashboard />;
  }

  if (type === "cropland-values-versus-farm-incomes-2026") {
    return <CroplandValuesVersusFarmIncomes2026Dashboard />;
  }

  if (type === "uninsurance-by-state-after-medicaid-unwinding-2026") {
    return <UninsuranceByStateAfterMedicaidUnwinding2026Dashboard />;
  }

  if (type === "high-propensity-applications-vs-employer-firms-2026") {
    return <HighPropensityApplicationsVsEmployerFirms2026Dashboard />;
  }

  if (type === "state-sales-tax-base-erosion-2026") {
    return <StateSalesTaxBaseErosion2026Dashboard />;
  }

  if (type === "health-insurance-coverage-gaps-census-2026") {
    return <HealthInsuranceCoverageGapsCensus2026Dashboard />;
  }

  if (type === "remote-sales-tax-collection-after-wayfair-2026") {
    return <RemoteSalesTaxCollectionAfterWayfair2026Dashboard />;
  }

  if (type === "credit-outcomes-of-gig-dependent-households-2026") {
    return <CreditOutcomesOfGigDependentHouseholds2026Dashboard />;
  }

  if (type === "survival-curves-of-pandemic-era-startups-2026") {
    return <SurvivalCurvesOfPandemicEraStartups2026Dashboard />;
  }

  if (type === "coverage-gaps-in-gig-and-small-firm-work-2026") {
    return <CoverageGapsInGigAndSmallFirmWork2026Dashboard />;
  }

  if (type === "cash-rents-versus-land-prices-by-state-2026") {
    return <CashRentsVersusLandPricesByState2026Dashboard />;
  }

  return null;
}
