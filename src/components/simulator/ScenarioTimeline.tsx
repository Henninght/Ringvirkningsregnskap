"use client";

import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from "recharts";
import { Card } from "@/components/ui/Card";
import { HelpTooltip } from "@/components/ui/Tooltip";
import { InlineSource } from "@/components/ui/SourceCitation";
import { PolicyScenario, InterventionScenario } from "@/types/policyScenario";
import {
  calculateYearlyImpacts,
  calculateYearlyImpactsWithIntervention,
} from "@/lib/calculations";
import { TrendingUp, AlertTriangle, ChevronDown } from "lucide-react";

interface ScenarioTimelineProps {
  scenario: PolicyScenario;
  selectedIntervention: InterventionScenario | null;
  className?: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function ScenarioTimeline({
  scenario,
  selectedIntervention,
  className = "",
  isCollapsed = false,
  onToggleCollapse,
}: ScenarioTimelineProps) {
  const currentYear = new Date().getFullYear();

  const chartData = useMemo(() => {
    const baseline = calculateYearlyImpacts(scenario.projection.dataPoints);
    const withIntervention = selectedIntervention
      ? calculateYearlyImpactsWithIntervention(
          scenario.projection.dataPoints,
          selectedIntervention
        )
      : null;

    return baseline.map((b, i) => ({
      year: b.year,
      baseline: b.shortage,
      baselineCost: b.economicCost,
      withIntervention: withIntervention ? withIntervention[i].shortage : null,
      interventionCost: withIntervention ? withIntervention[i].economicCost : null,
      isProjected: b.isProjected,
      isCurrent: b.year === currentYear,
    }));
  }, [scenario, selectedIntervention, currentYear]);

  const maxValue = Math.max(...chartData.map((d) => d.baseline));

  const formatNumber = (value: number) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}k`;
    }
    return value.toLocaleString("nb-NO");
  };

  const formatCurrency = (value: number) => {
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(1)} mrd`;
    }
    return `${(value / 1000000).toFixed(0)} mill`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || payload.length === 0) return null;

    const data = chartData.find((d) => d.year === label);
    if (!data) return null;

    return (
      <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3 text-sm">
        <div className="font-semibold text-slate-700 mb-2">
          {label}
          {data.isProjected && (
            <span className="ml-2 text-xs text-amber-600 font-normal">(fremskriving)</span>
          )}
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-coral-400" />
            <span className="text-slate-600">Uten tiltak:</span>
            <span className="font-semibold text-coral-700">
              {formatNumber(data.baseline)} {scenario.projection.unit === "kr" ? "kr" : ""}
            </span>
          </div>
          {data.withIntervention !== null && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-mint-500" />
              <span className="text-slate-600">Med tiltak:</span>
              <span className="font-semibold text-mint-700">
                {formatNumber(data.withIntervention)} {scenario.projection.unit === "kr" ? "kr" : ""}
              </span>
            </div>
          )}
          {scenario.projection.type === "shortage" && (
            <div className="mt-2 pt-2 border-t border-slate-100">
              <div className="text-xs text-slate-500">Okonomisk kostnad:</div>
              <div className="text-slate-700">{formatCurrency(data.baselineCost)} kr/ar</div>
              {data.interventionCost !== null && (
                <div className="text-mint-700">
                  vs {formatCurrency(data.interventionCost)} kr/ar med tiltak
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

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
          <div className="w-8 h-8 rounded-lg bg-petrol-100 flex items-center justify-center">
            <TrendingUp size={16} className="text-petrol-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-slate-800">Utvikling over tid</h3>
              <HelpTooltip
                content={
                  <div className="space-y-1.5">
                    <p className="font-medium">Tidslinje</p>
                    <p className="text-slate-300">
                      Viser utviklingen fra i dag til malar for {scenario.projection.targetYear}.
                    </p>
                    <p className="text-slate-400 text-[11px]">
                      Stiplede omrader er fremskrivninger basert pa {scenario.sources.primary.kildeId}.
                    </p>
                  </div>
                }
              />
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-2">
              {scenario.projection.metric}
              <InlineSource kildeId={scenario.sources.primary.kildeId} />
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
          <div className="p-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="baselineGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f87171" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f87171" stopOpacity={0.05} />
                    </linearGradient>
                    <linearGradient id="interventionGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#34d399" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />

                  <XAxis
                    dataKey="year"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    tickLine={{ stroke: "#cbd5e1" }}
                    axisLine={{ stroke: "#cbd5e1" }}
                  />

                  <YAxis
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    tickLine={{ stroke: "#cbd5e1" }}
                    axisLine={{ stroke: "#cbd5e1" }}
                    tickFormatter={formatNumber}
                    domain={[0, maxValue * 1.1]}
                  />

                  <Tooltip content={<CustomTooltip />} />

                  <ReferenceLine
                    x={currentYear}
                    stroke="#3d838b"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    label={{
                      value: "I dag",
                      position: "top",
                      fill: "#3d838b",
                      fontSize: 10,
                    }}
                  />

                  <Area
                    type="monotone"
                    dataKey="baseline"
                    name="Uten tiltak"
                    stroke="#f87171"
                    strokeWidth={2}
                    fill="url(#baselineGradient)"
                    dot={(props: any) => {
                      const { cx, cy, payload } = props;
                      if (!payload.isProjected) {
                        return (
                          <circle cx={cx} cy={cy} r={4} fill="#f87171" stroke="#fff" strokeWidth={2} />
                        );
                      }
                      return (
                        <circle
                          cx={cx}
                          cy={cy}
                          r={3}
                          fill="#fff"
                          stroke="#f87171"
                          strokeWidth={2}
                          strokeDasharray="2 2"
                        />
                      );
                    }}
                  />

                  {selectedIntervention && (
                    <Area
                      type="monotone"
                      dataKey="withIntervention"
                      name={selectedIntervention.name}
                      stroke="#34d399"
                      strokeWidth={2}
                      fill="url(#interventionGradient)"
                      dot={(props: any) => {
                        const { cx, cy, payload } = props;
                        if (payload.withIntervention === null) return null;
                        return <circle cx={cx} cy={cy} r={3} fill="#34d399" stroke="#fff" strokeWidth={2} />;
                      }}
                    />
                  )}

                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value: string) => <span className="text-xs text-slate-600">{value}</span>}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {selectedIntervention && (
              <div className="mt-3 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-mint-500" />
                    <span className="text-slate-600">Besparelse med {selectedIntervention.name}:</span>
                  </div>
                  <span className="font-semibold text-mint-700">
                    {selectedIntervention.expectedImpact.percentReduction}% reduksjon
                  </span>
                </div>
              </div>
            )}

            <div className="mt-2 flex items-start gap-1.5 text-xs text-slate-400">
              <AlertTriangle size={12} className="mt-0.5 shrink-0" />
              <span>
                Tall etter {currentYear} er fremskrivninger basert pa offisielle prognoser. Faktisk
                utvikling kan avvike.
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
