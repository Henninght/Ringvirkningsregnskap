"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { InsightsPanel } from "@/components/layout/InsightsPanel";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { SectorPieChart } from "@/components/dashboard/SectorPieChart";
import { HistoricalChart } from "@/components/dashboard/HistoricalChart";
import { ProjectsTable } from "@/components/dashboard/ProjectsTable";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { Zap, Leaf, Heart } from "lucide-react";

// Eidsiva-spesifikke komponenter
import { EidsivaSankey } from "@/components/eidsiva/EidsivaSankey";
import { EIDSIVA_NOKKELTALL, KILDER } from "@/lib/eidsiva/eidsivaData";
import { InfoTooltip } from "@/components/ui/InfoTooltip";
import { EIDSIVA_DESCRIPTIONS } from "@/lib/eidsiva/eidsivaDescriptions";

export default function EidsivaDashboard() {
  // Eidsiva-spesifikke KPI-verdier
  const eidsivaKpis = {
    vannkraft: {
      value: `${(EIDSIVA_NOKKELTALL.vannkraft.produksjonGWh / 1000).toFixed(1)} TWh`,
      subtitle: `${EIDSIVA_NOKKELTALL.vannkraft.antallKraftverk} vannkraftverk`,
    },
    biokraft: {
      value: `${EIDSIVA_NOKKELTALL.biokraft.produksjonGWh} GWh`,
      subtitle: `${EIDSIVA_NOKKELTALL.biokraft.antallVarmesentraler} varmesentraler`,
    },
    co2: {
      value: `${((EIDSIVA_NOKKELTALL.vannkraftTilsvarer.husholdninger + EIDSIVA_NOKKELTALL.biokraftTilsvarer.husholdninger) / 1000).toFixed(0)}k`,
      subtitle: "Husholdninger forsynt",
    },
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <Sidebar tenantId="eidsiva" />

      {/* Main Content */}
      <main className="flex-1 ml-[72px] mr-[320px] p-6 lg:p-8">
        {/* Header */}
        <header className="mb-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h1
                  className="text-2xl font-bold text-slate-800 mb-1 tracking-tight"
                  style={{ fontFamily: "var(--font-outfit)" }}
                >
                  Ringvirkningsregnskap
                </h1>
                <InfoTooltip
                  description="Viser samlet effekt på økonomi, mennesker og miljø. (s.5)"
                  size="md"
                  variant="petrol"
                />
              </div>
              <p className="text-sm text-slate-500">
                Oversikt over samfunnsøkonomiske ringvirkninger for Eidsiva Energi
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

        {/* KPI Cards - Eidsiva-spesifikke */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wide">
              Fornybar energiproduksjon
            </h2>
            <InfoTooltip
              description={EIDSIVA_DESCRIPTIONS.vannkraft}
              size="sm"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <KpiCard
              title="Fornybar vannkraft"
              subtitle={eidsivaKpis.vannkraft.subtitle}
              value={eidsivaKpis.vannkraft.value}
              change={EIDSIVA_NOKKELTALL.vannkraft.andelAvNorge}
              changeLabel="av Norges produksjon"
              variant="petrol"
              icon={<Zap size={18} />}
              delay={0}
              kilde={KILDER.fornybarEnergi}
            />
            <KpiCard
              title="Biokraft & fjernvarme"
              subtitle={eidsivaKpis.biokraft.subtitle}
              value={eidsivaKpis.biokraft.value}
              change={EIDSIVA_NOKKELTALL.biokraft.fornybartBrensel}
              changeLabel="fornybart"
              variant="sage"
              icon={<Leaf size={18} />}
              delay={0.05}
              kilde={KILDER.fornybarEnergi}
            />
            <KpiCard
              title="Strømforsyning"
              subtitle={eidsivaKpis.co2.subtitle}
              value={eidsivaKpis.co2.value}
              change={0}
              variant="indigo"
              icon={<Heart size={18} />}
              delay={0.1}
              kilde={KILDER.fornybarEnergi}
            />
          </div>
        </div>

        {/* Sankey Diagram - Eidsiva-spesifikk */}
        <div className="mb-6">
          <ErrorBoundary>
            <EidsivaSankey />
          </ErrorBoundary>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <ErrorBoundary>
            <SectorPieChart />
          </ErrorBoundary>
          <ErrorBoundary>
            <HistoricalChart />
          </ErrorBoundary>
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
