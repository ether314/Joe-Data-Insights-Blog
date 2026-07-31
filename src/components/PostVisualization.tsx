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

export function PostVisualization({
  type,
  embedded = false,
}: {
  type: "gdp-analysis" | "subsidies-tariffs" | "brokerage-bonuses" | "ai-data-centers" | "ccp-nomenklatura" | "china-fiscal-revenue" | "electricity-generation-mix" | "refugee-hosting-burden" | "ai-packaging-bottleneck" | "ai-token-consumption" | "deflationary-growth-2025" | "last-mile-delivery-robotics" | "goldman-sachs-ai-capex" | "billion-dollar-disasters";
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
  if (type === "billion-dollar-disasters") {
    return <BillionDollarDisastersDashboard />;
  }
  return null;
}
