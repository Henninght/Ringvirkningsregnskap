"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { HelpTooltip } from "@/components/ui/Tooltip";
import { AdvancedOnly } from "@/contexts/ViewModeContext";
import { RippleCalculation, ScenarioComparison, Scenario } from "@/types/ripple";
import { formatRippleValue } from "@/lib/calculations";
import { useAnimatedValue, useAnimatedPercentage, easings } from "@/hooks/useAnimatedValue";
import { TrendingUp, TrendingDown, Users, Banknote, Building, Sparkles, ChevronDown, Calculator } from "lucide-react";

interface SimulatorResultsProps {
  calculation: RippleCalculation;
  comparison: ScenarioComparison | null;
  selectedScenario: Scenario | null;
  /** Om kortet er kollapset */
  isCollapsed?: boolean;
  /** Callback for å toggle kollaps */
  onToggleCollapse?: () => void;
}

export function SimulatorResults({ calculation, comparison, selectedScenario, isCollapsed = false, onToggleCollapse }: SimulatorResultsProps) {
  const { totals, directEffect, indirectEffect, inducedEffect } = calculation;

  return (
    <Card className="animate-slide-up overflow-hidden">
      {/* Collapsible Header */}
      <button
        type="button"
        onClick={onToggleCollapse}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50/50 transition-colors border-b border-slate-100"
        aria-expanded={!isCollapsed}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-lavender-100 flex items-center justify-center">
            <Calculator size={16} className="text-lavender-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800">Resultater</h3>
            <p className="text-xs text-slate-500">Total ringvirkning og effektfordeling</p>
          </div>
        </div>
        <ChevronDown
          size={18}
          className={`text-slate-400 transition-transform duration-200 ${!isCollapsed ? "rotate-180" : ""}`}
        />
      </button>

      {/* Collapsible Content */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          !isCollapsed ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="p-4 space-y-4">
            {/* Scenario-sammenligning */}
            {comparison && selectedScenario && (
              <div className="border border-petrol-200 bg-gradient-to-br from-petrol-50/50 to-sage-50/30 rounded-xl p-4">
                <div className="flex items-center gap-2 text-petrol-700 font-semibold mb-3">
                  <Sparkles size={18} />
                  {selectedScenario.name}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <ComparisonStat
                    label="Verdiskaping"
                    difference={comparison.difference.valueCreation}
                    percentChange={comparison.difference.percentChange}
                    type="currency"
                  />
                  <ComparisonStat
                    label="Sysselsetting"
                    difference={comparison.difference.employment}
                    percentChange={(comparison.difference.employment / comparison.baseline.totals.employment) * 100}
                    type="employment"
                  />
                  <ComparisonStat
                    label="Skattebidrag"
                    difference={comparison.difference.taxContribution}
                    percentChange={(comparison.difference.taxContribution / comparison.baseline.totals.taxContribution) * 100}
                    type="currency"
                  />
                </div>
              </div>
            )}

            {/* Hovedtall */}
            <div className="border border-slate-200 rounded-xl p-4 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-700">Total ringvirkning</span>
                <HelpTooltip
                  content={
                    <div className="space-y-1.5">
                      <p className="font-medium">Samlet verdiskaping</p>
                      <p className="text-slate-300">Den totale økonomiske verdien som skapes, inkludert alle tre effektnivåer.</p>
                      <p className="text-slate-400 text-[11px]">Multiplikatoren viser hvor mange kroner total effekt per krone direkte effekt.</p>
                    </div>
                  }
                />
              </div>

              {/* Total verdiskaping */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-petrol-50 to-sage-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-petrol-500 flex items-center justify-center">
                    <Building size={20} className="text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-600">Total verdiskaping</div>
                    <div className="text-2xl font-bold text-slate-800" style={{ fontFamily: "var(--font-outfit)" }}>
                      {formatRippleValue(totals.valueCreation, "currency")}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-500">Multiplikator</div>
                  <div className="text-lg font-semibold text-petrol-600">
                    {totals.multiplierEffect.toFixed(2)}x
                  </div>
                </div>
              </div>

              {/* Sysselsetting og skatt */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-2 text-slate-500 mb-1">
                    <Users size={16} />
                    <span className="text-sm">Sysselsetting</span>
                  </div>
                  <div className="text-xl font-bold text-slate-800" style={{ fontFamily: "var(--font-outfit)" }}>
                    {formatRippleValue(totals.employment, "employment")}
                  </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-2 text-slate-500 mb-1">
                    <Banknote size={16} />
                    <span className="text-sm">Skattebidrag</span>
                  </div>
                  <div className="text-xl font-bold text-slate-800" style={{ fontFamily: "var(--font-outfit)" }}>
                    {formatRippleValue(totals.taxContribution, "currency")}
                  </div>
                </div>
              </div>
            </div>

            {/* Effektfordeling */}
            <div className="border border-slate-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-semibold text-slate-700">Effektfordeling</span>
                <HelpTooltip
                  content={
                    <div className="space-y-1.5">
                      <p className="font-medium">Fordeling mellom effekttyper</p>
                      <p className="text-slate-300">Viser hvordan verdiskapingen fordeler seg på de tre nivåene.</p>
                      <div className="space-y-1 mt-2">
                        <p className="text-petrol-400 text-[11px]">Direkte: Lønn + driftsresultat</p>
                        <p className="text-sand-400 text-[11px]">Indirekte: Leverandøreffekter</p>
                        <p className="text-lavender-400 text-[11px]">Induserte: Forbrukseffekter</p>
                      </div>
                    </div>
                  }
                />
              </div>
              <StackedEffectBar
                directValue={directEffect.total}
                indirectValue={indirectEffect.total}
                inducedValue={inducedEffect.total}
              />
            </div>

            {/* Detaljert breakdown - kun i avansert modus */}
            <AdvancedOnly showMoreText="Vis detaljert nedbrytning">
              <div className="border border-slate-200 rounded-xl p-4">
                <div className="text-sm font-semibold text-slate-700 mb-4">Detaljert nedbrytning</div>
                <div className="space-y-4 text-sm">
                  {/* Direkte */}
                  <div>
                    <div className="font-medium text-slate-700 mb-2 flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-petrol-500" />
                      Direkte effekter
                    </div>
                    <div className="pl-5 space-y-1 text-slate-600">
                      <div className="flex justify-between">
                        <span>Lønnskostnader</span>
                        <span className="font-medium">{formatRippleValue(directEffect.wages, "currency")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Driftsresultat</span>
                        <span className="font-medium">{formatRippleValue(directEffect.operatingResult, "currency")}</span>
                      </div>
                    </div>
                  </div>

                  {/* Indirekte */}
                  <div>
                    <div className="font-medium text-slate-700 mb-2 flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-sand-500" />
                      Indirekte effekter
                    </div>
                    <div className="pl-5 space-y-1 text-slate-600">
                      <div className="flex justify-between">
                        <span>Leverandørverdiskaping</span>
                        <span className="font-medium">{formatRippleValue(indirectEffect.supplierValue, "currency")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sysselsetting hos leverandører</span>
                        <span className="font-medium">{Math.round(indirectEffect.supplierEmployment)} årsverk</span>
                      </div>
                    </div>
                  </div>

                  {/* Induserte */}
                  <div>
                    <div className="font-medium text-slate-700 mb-2 flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-lavender-500" />
                      Induserte effekter
                    </div>
                    <div className="pl-5 space-y-1 text-slate-600">
                      <div className="flex justify-between">
                        <span>Forbruksverdiskaping</span>
                        <span className="font-medium">{formatRippleValue(inducedEffect.consumptionValue, "currency")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Lokal økonomieffekt</span>
                        <span className="font-medium">{formatRippleValue(inducedEffect.localEconomyEffect, "currency")}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AdvancedOnly>
          </div>
        </div>
      </div>
    </Card>
  );
}

function ComparisonStat({
  label,
  difference,
  percentChange,
  type,
}: {
  label: string;
  difference: number;
  percentChange: number;
  type: "currency" | "employment";
}) {
  const isPositive = difference >= 0;
  const Icon = isPositive ? TrendingUp : TrendingDown;

  return (
    <div className="text-center">
      <div className="text-xs text-slate-500 mb-1">{label}</div>
      <div className={`flex items-center justify-center gap-1 ${isPositive ? "text-success-600" : "text-sand-600"}`}>
        <Icon size={14} />
        <span className="font-semibold text-sm">
          {isPositive ? "+" : ""}
          {type === "currency"
            ? formatRippleValue(Math.abs(difference), "currency")
            : Math.round(difference)
          }
        </span>
      </div>
      <div className={`text-xs ${isPositive ? "text-success-500" : "text-sand-500"}`}>
        {formatRippleValue(percentChange, "percent")}
      </div>
    </div>
  );
}

/**
 * Stacked horizontal bar showing the total distribution of effects.
 * Uses ABSOLUTE scale so bars visually grow/shrink when input changes.
 */
function StackedEffectBar({
  directValue,
  indirectValue,
  inducedValue,
}: {
  directValue: number;
  indirectValue: number;
  inducedValue: number;
}) {
  const maxScale = 2000000000;

  const total = directValue + indirectValue + inducedValue;
  const totalWidth = useAnimatedPercentage(
    Math.min((total / maxScale) * 100, 100),
    { duration: 800, easing: easings.easeOutQuart }
  );

  const animatedTotal = useAnimatedValue(total, {
    duration: 800,
    easing: easings.easeOutQuart,
  });

  const directPercent = total > 0 ? (directValue / total) * 100 : 0;
  const indirectPercent = total > 0 ? (indirectValue / total) * 100 : 0;
  const inducedPercent = total > 0 ? (inducedValue / total) * 100 : 0;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-slate-500">
        <span>Total verdiskaping</span>
        <span className="tabular-nums font-semibold text-slate-700">
          {formatRippleValue(Math.round(animatedTotal), "currency")}
        </span>
      </div>
      <div className="h-5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full flex rounded-full overflow-hidden"
          style={{ width: `${totalWidth}%` }}
        >
          <div
            className="h-full bg-petrol-500"
            style={{ width: `${directPercent}%` }}
            title={`Direkte: ${directPercent.toFixed(1)}%`}
          />
          <div
            className="h-full bg-sand-500"
            style={{ width: `${indirectPercent}%` }}
            title={`Indirekte: ${indirectPercent.toFixed(1)}%`}
          />
          <div
            className="h-full bg-lavender-500"
            style={{ width: `${inducedPercent}%` }}
            title={`Induserte: ${inducedPercent.toFixed(1)}%`}
          />
        </div>
      </div>
      <div className="flex justify-between text-2xs text-slate-400">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-petrol-500" />
          <span>Direkte ({directPercent.toFixed(0)}%)</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-sand-500" />
          <span>Indirekte ({indirectPercent.toFixed(0)}%)</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-lavender-500" />
          <span>Induserte ({inducedPercent.toFixed(0)}%)</span>
        </div>
      </div>
    </div>
  );
}
