"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { HelpTooltip } from "@/components/ui/Tooltip";
import { SourceList, InlineSource } from "@/components/ui/SourceCitation";
import { PolicyScenario, InterventionScenario } from "@/types/policyScenario";
import {
  calculateMultiYearComparison,
  generatePolicyScenarioSummary,
} from "@/lib/calculations";
import {
  ArrowDown,
  ArrowRight,
  Users,
  TrendingDown,
  CheckCircle,
  XCircle,
  Sparkles,
  ChevronDown,
} from "lucide-react";

interface ScenarioComparisonProps {
  scenario: PolicyScenario;
  selectedIntervention: InterventionScenario | null;
  className?: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function ScenarioComparison({
  scenario,
  selectedIntervention,
  className = "",
  isCollapsed = false,
  onToggleCollapse,
}: ScenarioComparisonProps) {
  const comparison = useMemo(() => {
    if (!selectedIntervention) return null;
    return calculateMultiYearComparison(scenario.projection.dataPoints, selectedIntervention);
  }, [scenario, selectedIntervention]);

  const summary = useMemo(() => {
    if (!comparison || !selectedIntervention) return null;
    return generatePolicyScenarioSummary(comparison, selectedIntervention.name);
  }, [comparison, selectedIntervention]);

  const formatCurrency = (value: number) => {
    if (Math.abs(value) >= 1000000000) {
      return `${(value / 1000000000).toFixed(1)} mrd kr`;
    }
    return `${Math.round(value / 1000000)} mill kr`;
  };

  const formatNumber = (value: number) => {
    return value.toLocaleString("nb-NO");
  };

  // Hvis ingen intervensjon er valgt, vis baseline-info
  if (!selectedIntervention || !comparison || !summary) {
    return (
      <Card className={`${className} overflow-hidden`}>
        {/* Collapsible Header */}
        <div
          role="button"
          tabIndex={0}
          onClick={onToggleCollapse}
          onKeyDown={(e) => e.key === 'Enter' && onToggleCollapse?.()}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50/50 transition-colors border-b border-slate-100 cursor-pointer"
          aria-expanded={!isCollapsed}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-coral-100 flex items-center justify-center">
              <TrendingDown size={16} className="text-coral-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-800">Økonomisk konsekvens</h3>
              <p className="text-xs text-slate-500">Status quo uten tiltak</p>
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
            <div className="p-4">
              <div className="bg-coral-50 border border-coral-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-coral-100 rounded-lg">
                    <XCircle size={20} className="text-coral-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-coral-800">Status quo: Ingen tiltak</h4>
                    <p className="text-sm text-coral-700 mt-1">{scenario.baselineDescription}</p>
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <Users size={14} className="text-coral-500" />
                        <span className="text-sm text-coral-700">
                          <strong>{formatNumber(scenario.projection.targetValue)}</strong>{" "}
                          {scenario.projection.unit} innen {scenario.projection.targetYear}
                        </span>
                      </div>
                      <div className="text-xs text-coral-700 font-medium mt-2">
                        Velg et tiltak for a se besparelse
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Med intervensjon: Vis sammenligning
  const lastBaseline = comparison.baseline[comparison.baseline.length - 1];
  const lastIntervention = comparison.withIntervention[comparison.withIntervention.length - 1];

  return (
    <Card className={`${className} overflow-hidden`}>
      {/* Collapsible Header */}
      <div
        role="button"
        tabIndex={0}
        onClick={onToggleCollapse}
        onKeyDown={(e) => e.key === 'Enter' && onToggleCollapse?.()}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50/50 transition-colors border-b border-slate-100 cursor-pointer"
        aria-expanded={!isCollapsed}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-mint-100 flex items-center justify-center">
            <Sparkles size={16} className="text-mint-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-slate-800">
                Sammenligning: Tiltak vs. status quo
              </h3>
              <HelpTooltip
                content={
                  <div className="space-y-1.5">
                    <p className="font-medium">Okonomisk effekt</p>
                    <p className="text-slate-300">
                      Viser forskjellen mellom a handle og a ikke handle.
                    </p>
                  </div>
                }
              />
            </div>
            <p className="text-xs text-slate-500">Potensiell besparelse ved tiltak</p>
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
          <div className="p-4 space-y-4">
            {/* Side-by-side comparison */}
            <div className="grid grid-cols-2 gap-3">
              {/* Status quo column */}
              <div className="bg-coral-50 border border-coral-200 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-2">
                  <XCircle size={14} className="text-coral-500" />
                  <span className="text-xs font-semibold text-coral-700 uppercase">Uten tiltak</span>
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="text-xs text-coral-600">
                      Mangel i {scenario.projection.targetYear}
                    </div>
                    <div className="text-lg font-bold text-coral-800">
                      {formatNumber(lastBaseline.shortage)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-coral-600">Total kostnad</div>
                    <div className="text-lg font-bold text-coral-800">
                      {formatCurrency(summary.baselineTotalCost)}
                    </div>
                    <div className="text-xs text-coral-500">({comparison.yearsAnalyzed} ar)</div>
                  </div>
                </div>
              </div>

              {/* With intervention column */}
              <div className="bg-mint-50 border border-mint-200 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle size={14} className="text-mint-600" />
                  <span className="text-xs font-semibold text-mint-700 uppercase truncate">
                    {selectedIntervention.name}
                  </span>
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="text-xs text-mint-600">
                      Mangel i {scenario.projection.targetYear}
                    </div>
                    <div className="text-lg font-bold text-mint-800">
                      {formatNumber(lastIntervention.shortage)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-mint-600">Total kostnad</div>
                    <div className="text-lg font-bold text-mint-800">
                      {formatCurrency(summary.interventionTotalCost)}
                    </div>
                    <div className="text-xs text-mint-500">({comparison.yearsAnalyzed} ar)</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Savings highlight */}
            <div className="bg-gradient-to-r from-mint-100 via-mint-50 to-sage-50 border border-mint-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-mint-700 font-semibold uppercase">
                    Potensiell besparelse
                  </div>
                  <div className="text-2xl font-bold text-mint-800 mt-1">
                    {formatCurrency(summary.totalSaved)}
                  </div>
                  <div className="text-xs text-mint-600 mt-0.5">
                    {summary.percentSaved.toFixed(0)}% reduksjon i kostnader
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-mint-700">Redusert mangel</div>
                  <div className="text-lg font-semibold text-mint-800 flex items-center gap-1">
                    <ArrowDown size={16} />
                    {formatNumber(summary.finalYearShortageReduction)}
                  </div>
                  <div className="text-xs text-mint-600">faerre ubesatte</div>
                </div>
              </div>
            </div>

            {/* Policy actions required */}
            {selectedIntervention.policyActions.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-slate-500 uppercase">
                  Tiltak som kreves
                </h4>
                <div className="space-y-1.5">
                  {selectedIntervention.policyActions.map((action, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 text-sm bg-slate-50 rounded-lg p-2"
                    >
                      <ArrowRight size={14} className="text-petrol-500 mt-0.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="text-slate-700">{action.action}</span>
                        <span className="text-xs text-slate-400 ml-1">({action.responsible})</span>
                        {action.kildeRef && (
                          <InlineSource
                            kildeId={action.kildeRef.kildeId}
                            spesifikk={action.kildeRef.spesifikk}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sources */}
            {selectedIntervention.sources.length > 0 && (
              <SourceList sources={selectedIntervention.sources} title="Kilder for tiltak" />
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
