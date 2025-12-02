"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { InsightsPanel } from "@/components/layout/InsightsPanel";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { ArrowRight } from "lucide-react";

// Eidsiva-spesifikke komponenter
import { EidsivaSankey } from "@/components/eidsiva/EidsivaSankey";
import { TilsvarerGrid } from "@/components/eidsiva/TilsvarerGrid";
import {
  ProduksjonsKort,
  InfrastrukturKort,
  SamfunnsverdiKort,
} from "@/components/eidsiva/EidsivaKpiCards";
import { KPI_EXPANSION_DATA } from "@/lib/eidsiva/kpiExpansionData";
import { InfoTooltip } from "@/components/ui/InfoTooltip";

export default function EidsivaDashboard() {
  // State for managing card expansion
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const handleCardToggle = (cardId: string) => {
    setExpandedCard((prev) => (prev === cardId ? null : cardId));
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

        {/* KPI Cards - Verdikjede: Produksjon → Distribusjon → Samfunnsverdi */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wide">
              Verdikjede: Produksjon → Distribusjon → Samfunnsverdi
            </h2>
            <InfoTooltip
              description="Viser hvordan energi flyter fra produksjon, gjennom distribusjon, til samfunnsverdi."
              size="sm"
            />
          </div>

          {/* Enhanced KPI Cards with value chain arrows */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_1fr] gap-2 md:gap-4 items-center">
            <ProduksjonsKort
              expandable={true}
              isExpanded={expandedCard === "produksjon"}
              onExpandToggle={() => handleCardToggle("produksjon")}
              delay={0}
            />

            {/* Arrow 1 */}
            <div className="hidden md:flex items-center justify-center text-slate-300">
              <ArrowRight size={24} />
            </div>

            <InfrastrukturKort
              expandable={true}
              isExpanded={expandedCard === "distribusjon"}
              onExpandToggle={() => handleCardToggle("distribusjon")}
              delay={0.1}
            />

            {/* Arrow 2 */}
            <div className="hidden md:flex items-center justify-center text-slate-300">
              <ArrowRight size={24} />
            </div>

            <SamfunnsverdiKort
              expandable={true}
              isExpanded={expandedCard === "samfunnsverdi"}
              onExpandToggle={() => handleCardToggle("samfunnsverdi")}
              delay={0.2}
            />
          </div>

          {/* Full-width Expansion Panel */}
          {expandedCard && (
            <div className="mt-4 p-6 bg-white rounded-xl border border-slate-200 shadow-card animate-fade-in">
              {expandedCard === "produksjon" && (
                <TilsvarerGrid
                  metrics={KPI_EXPANSION_DATA.produksjon.metrics}
                  variant="petrol"
                  title={KPI_EXPANSION_DATA.produksjon.title}
                />
              )}
              {expandedCard === "distribusjon" && (
                <TilsvarerGrid
                  metrics={KPI_EXPANSION_DATA.distribusjon.metrics}
                  variant="sage"
                  title={KPI_EXPANSION_DATA.distribusjon.title}
                />
              )}
              {expandedCard === "samfunnsverdi" && (
                <TilsvarerGrid
                  metrics={KPI_EXPANSION_DATA.samfunnsverdi.metrics}
                  variant="indigo"
                  title={KPI_EXPANSION_DATA.samfunnsverdi.title}
                />
              )}
            </div>
          )}
        </div>

        {/* Sankey Diagram - Eidsiva-spesifikk */}
        <div className="mb-6">
          <ErrorBoundary>
            <EidsivaSankey />
          </ErrorBoundary>
        </div>
      </main>

      {/* Insights Panel */}
      <div className="fixed right-0 top-0 h-screen">
        <InsightsPanel />
      </div>
    </div>
  );
}
