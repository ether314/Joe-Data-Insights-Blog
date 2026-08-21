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

  return null;
}
