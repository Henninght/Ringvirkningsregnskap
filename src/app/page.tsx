"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { InsightsPanel } from "@/components/layout/InsightsPanel";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { SankeyDiagram } from "@/components/dashboard/SankeyDiagram";
import { SectorPieChart } from "@/components/dashboard/SectorPieChart";
import { HistoricalChart } from "@/components/dashboard/HistoricalChart";
import { ProjectsTable } from "@/components/dashboard/ProjectsTable";
import { kpiData } from "@/data/mockData";
import { Building2, Users, Receipt } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 ml-[72px] mr-[320px] p-6 lg:p-8">
        {/* Header */}
        <header className="mb-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h1
                className="text-2xl font-bold text-slate-800 mb-1 tracking-tight"
                style={{ fontFamily: "var(--font-outfit)" }}
              >
                Verdiskapingsdetaljer
              </h1>
              <p className="text-sm text-slate-500">
                Oversikt over samfunnsøkonomiske ringvirkninger
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Sist oppdatert:</span>
              <span className="text-xs font-medium text-slate-600">
                {new Date().toLocaleDateString("nb-NO", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </header>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <KpiCard
            title="Verdiskaping"
            subtitle="Total økonomisk verdi"
            value={`${kpiData.verdiskaping.value} mrd NOK`}
            change={kpiData.verdiskaping.change}
            variant="petrol"
            icon={<Building2 size={18} />}
            delay={0}
          />
          <KpiCard
            title="Sysselsettingseffekt"
            subtitle="Arsverk skapt"
            value={kpiData.sysselsetting.value.toLocaleString("nb-NO")}
            change={kpiData.sysselsetting.change}
            variant="sage"
            icon={<Users size={18} />}
            delay={0.05}
          />
          <KpiCard
            title="Skattebidrag"
            subtitle="Bidrag til fellesskapet"
            value={`${kpiData.skattebidrag.value} mill NOK`}
            change={kpiData.skattebidrag.change}
            variant="indigo"
            icon={<Receipt size={18} />}
            delay={0.1}
          />
        </div>

        {/* Sankey Diagram - Full Width */}
        <div className="mb-6">
          <SankeyDiagram />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <SectorPieChart />
          <HistoricalChart />
        </div>

        {/* Bottom Row */}
        <div className="mb-6">
          <ProjectsTable />
        </div>
      </main>

      {/* Insights Panel */}
      <div className="fixed right-0 top-0 h-screen">
        <InsightsPanel />
      </div>
    </div>
  );
}
