"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { HelpTooltip } from "@/components/ui/Tooltip";
import { SourceCitation } from "@/components/ui/SourceCitation";
import { PolicyScenario, InterventionScenario } from "@/types/policyScenario";
import { getCriticalPolicyScenarios } from "@/lib/policyScenarios";
import {
  TrendingDown,
  DollarSign,
  Users,
  ChevronRight,
  ChevronDown,
  AlertTriangle,
  Sparkles,
  Info,
} from "lucide-react";

interface PolicyScenarioSelectorProps {
  selectedScenario: PolicyScenario | null;
  selectedIntervention: InterventionScenario | null;
  onScenarioSelect: (scenario: PolicyScenario | null) => void;
  onInterventionSelect: (intervention: InterventionScenario | null) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const CATEGORY_ICONS: Record<string, typeof TrendingDown> = {
  workforce_shortage: Users,
  agency_costs: DollarSign,
  turnover: TrendingDown,
  mobilization: Users,
  preparedness: AlertTriangle,
};

const CATEGORY_COLORS: Record<string, string> = {
  workforce_shortage: "from-coral-50 to-coral-100 border-coral-200",
  agency_costs: "from-sand-50 to-sand-100 border-sand-200",
  turnover: "from-lavender-50 to-lavender-100 border-lavender-200",
  mobilization: "from-sage-50 to-sage-100 border-sage-200",
  preparedness: "from-petrol-50 to-petrol-100 border-petrol-200",
};

export function PolicyScenarioSelector({
  selectedScenario,
  selectedIntervention,
  onScenarioSelect,
  onInterventionSelect,
  isCollapsed = false,
  onToggleCollapse,
}: PolicyScenarioSelectorProps) {
  const [showDetails, setShowDetails] = useState(false);
  const criticalScenarios = getCriticalPolicyScenarios();

  const handleScenarioClick = (scenario: PolicyScenario) => {
    if (selectedScenario?.id === scenario.id) {
      onScenarioSelect(null);
      onInterventionSelect(null);
    } else {
      onScenarioSelect(scenario);
      if (scenario.interventions.length > 0) {
        onInterventionSelect(scenario.interventions[0]);
      }
    }
  };

  const formatValue = (value: number, type: "number" | "currency") => {
    if (type === "currency") {
      if (value >= 1000000000) {
        return `${(value / 1000000000).toFixed(0)} mrd kr`;
      }
      return `${(value / 1000000).toFixed(0)} mill kr`;
    }
    return value.toLocaleString("nb-NO");
  };

  return (
    <Card className="animate-slide-up border-2 border-petrol-200 bg-gradient-to-br from-petrol-50/30 via-white to-petrol-50/20 shadow-lg overflow-hidden">
      {/* Collapsible Header */}
      <div
        role="button"
        tabIndex={0}
        onClick={onToggleCollapse}
        onKeyDown={(e) => e.key === 'Enter' && onToggleCollapse?.()}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-petrol-50/50 transition-colors border-b border-petrol-100 cursor-pointer"
        aria-expanded={!isCollapsed}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-petrol-100 flex items-center justify-center">
            <Sparkles size={16} className="text-petrol-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-petrol-800">Fremtidsscenario</h3>
              <HelpTooltip
                content={
                  <div className="space-y-1.5">
                    <p className="font-medium">Reelle fremtidsprognoser</p>
                    <p className="text-slate-300">
                      Velg et scenario basert pa offisielle prognoser fra SSB, NAV
                      og NSF for a se okonomiske konsekvenser.
                    </p>
                    <p className="text-slate-400 text-[11px]">
                      Alle tall har dokumenterte kilder.
                    </p>
                  </div>
                }
              />
              <span className="text-xs bg-coral-100 text-coral-700 px-2 py-0.5 rounded-full font-normal">
                Nytt
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Hva koster det a ikke handle? Sammenlign scenarier med kilder.
            </p>
          </div>
        </div>
        <ChevronDown
          size={18}
          className={`text-slate-400 transition-transform duration-200 ${!isCollapsed ? "rotate-180" : ""}`}
        />
      </div>

      {/* Collapsible Content */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          !isCollapsed ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="p-4 space-y-3">
            {/* Scenario cards */}
            <div className="grid gap-2">
              {criticalScenarios.map((scenario) => {
                const isSelected = selectedScenario?.id === scenario.id;
                const Icon = CATEGORY_ICONS[scenario.category] || AlertTriangle;
                const colorClass = CATEGORY_COLORS[scenario.category] || "";

                return (
                  <div key={scenario.id} className="space-y-2">
                    <button
                      onClick={() => handleScenarioClick(scenario)}
                      className={`w-full text-left rounded-xl border-2 transition-all duration-200 ${
                        isSelected
                          ? `bg-gradient-to-br ${colorClass} ring-2 ring-petrol-500/30 shadow-md`
                          : "bg-white border-slate-200 hover:border-petrol-200 hover:bg-petrol-50/50 hover:shadow-sm"
                      }`}
                    >
                      <div className="p-3">
                        <div className="flex items-start gap-3">
                          <div
                            className={`p-2 rounded-lg ${
                              isSelected ? "bg-white/80" : "bg-slate-100"
                            }`}
                          >
                            <Icon
                              size={20}
                              className={isSelected ? "text-petrol-600" : "text-slate-400"}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <h3 className="font-semibold text-sm text-slate-800 truncate">
                                {scenario.title}
                              </h3>
                              <ChevronRight
                                size={16}
                                className={`text-slate-400 transition-transform ${
                                  isSelected ? "rotate-90" : ""
                                }`}
                              />
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {scenario.subtitle}
                            </p>
                            <div className="flex items-center gap-3 mt-2">
                              <span className="text-lg font-bold text-petrol-700">
                                {formatValue(
                                  scenario.projection.targetValue,
                                  scenario.projection.type === "cost" ? "currency" : "number"
                                )}
                              </span>
                              <span className="text-xs text-slate-400">
                                innen {scenario.projection.targetYear}
                              </span>
                            </div>
                            <div className="mt-2">
                              <SourceCitation kildeRef={scenario.sources.primary} variant="compact" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </button>

                    {isSelected && (
                      <div className="ml-4 pl-4 border-l-2 border-petrol-200 space-y-2 animate-slide-up">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Info size={12} />
                          Sammenlign tiltak:
                        </div>

                        <button
                          onClick={() => onInterventionSelect(null)}
                          className={`w-full text-left px-3 py-2 rounded-lg border transition-all ${
                            !selectedIntervention
                              ? "bg-slate-100 border-slate-300 ring-1 ring-slate-400"
                              : "bg-white border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <div className="font-medium text-xs text-slate-700">
                            Status quo (uten tiltak)
                          </div>
                          <div className="text-xs text-slate-400">
                            {scenario.baselineDescription}
                          </div>
                        </button>

                        {scenario.interventions.map((intervention) => (
                          <button
                            key={intervention.id}
                            onClick={() => onInterventionSelect(intervention)}
                            className={`w-full text-left px-3 py-2 rounded-lg border transition-all ${
                              selectedIntervention?.id === intervention.id
                                ? "bg-mint-50 border-mint-300 ring-1 ring-mint-400"
                                : "bg-white border-slate-200 hover:border-mint-200 hover:bg-mint-50/50"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="font-medium text-xs text-slate-700">
                                {intervention.name}
                              </div>
                              <span className="text-xs text-mint-600 font-semibold">
                                {intervention.expectedImpact.percentReduction}%
                              </span>
                            </div>
                            <div className="text-xs text-slate-400 mt-0.5">
                              {intervention.description}
                            </div>
                          </button>
                        ))}

                        <button
                          onClick={() => setShowDetails(!showDetails)}
                          className="w-full text-xs text-petrol-600 hover:text-petrol-800 py-1"
                        >
                          {showDetails ? "Skjul detaljer" : "Vis kilder og detaljer"}
                        </button>

                        {showDetails && (
                          <div className="bg-slate-50 rounded-lg p-3 space-y-2">
                            <div className="text-xs font-semibold text-slate-500 uppercase">
                              Hovedkilde
                            </div>
                            <SourceCitation kildeRef={scenario.sources.primary} variant="block" />
                            {scenario.sources.supporting.length > 0 && (
                              <>
                                <div className="text-xs font-semibold text-slate-500 uppercase mt-3">
                                  Stottende kilder ({scenario.sources.supporting.length})
                                </div>
                                {scenario.sources.supporting.map((source, i) => (
                                  <SourceCitation key={i} kildeRef={source} variant="block" />
                                ))}
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {!selectedScenario && (
              <div className="text-xs text-center text-slate-600 py-2">
                Velg et scenario for a se okonomiske konsekvenser over tid
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
