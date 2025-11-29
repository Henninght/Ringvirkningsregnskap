"use client";

import { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  Line,
  ComposedChart,
  Bar,
  ReferenceLine,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Target,
  ArrowRight,
  Minus,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TrendDataPoint {
  period: string;
  value: number;
  employees?: number;
  coverage?: number;
  target?: number;
}

interface TrendAnalysisProps {
  data?: TrendDataPoint[];
  title?: string;
  className?: string;
}

// Default historical data
const DEFAULT_DATA: TrendDataPoint[] = [
  { period: "2019", value: 2.1, employees: 3800, coverage: 11.2, target: 12.0 },
  { period: "2020", value: 2.4, employees: 3950, coverage: 11.5, target: 12.0 },
  { period: "2021", value: 2.8, employees: 4100, coverage: 11.8, target: 12.5 },
  { period: "2022", value: 3.2, employees: 4250, coverage: 12.1, target: 12.5 },
  { period: "2023", value: 3.6, employees: 4400, coverage: 12.4, target: 13.0 },
  { period: "2024", value: 3.9, employees: 4500, coverage: 12.6, target: 13.0 },
];

type MetricView = "verdiskaping" | "ansatte" | "dekning";

export function TrendAnalysis({
  data = DEFAULT_DATA,
  title = "Trendanalyse",
  className,
}: TrendAnalysisProps) {
  const [mounted, setMounted] = useState(false);
  const [activeView, setActiveView] = useState<MetricView>("verdiskaping");

  // Ensure client-side rendering for charts
  useState(() => {
    setMounted(true);
  });

  // Calculate trend statistics
  const stats = useMemo(() => {
    if (data.length < 2) return null;

    const first = data[0];
    const last = data[data.length - 1];
    const previous = data[data.length - 2];

    // Value metrics
    const totalGrowth = ((last.value - first.value) / first.value) * 100;
    const yearOverYear = ((last.value - previous.value) / previous.value) * 100;
    const avgGrowth = totalGrowth / (data.length - 1);

    // Employee metrics
    const employeeGrowth = first.employees && last.employees
      ? ((last.employees - first.employees) / first.employees) * 100
      : 0;

    // Coverage metrics
    const coverageChange = first.coverage && last.coverage
      ? last.coverage - first.coverage
      : 0;

    // Target achievement
    const targetAchievement = last.coverage && last.target
      ? (last.coverage / last.target) * 100
      : 0;

    // Forecast next year (simple linear projection)
    const avgIncrement = (last.value - first.value) / (data.length - 1);
    const forecastValue = last.value + avgIncrement;

    return {
      totalGrowth,
      yearOverYear,
      avgGrowth,
      employeeGrowth,
      coverageChange,
      targetAchievement,
      forecastValue,
      currentValue: last.value,
      currentCoverage: last.coverage,
      currentEmployees: last.employees,
    };
  }, [data]);

  const viewConfig: Record<MetricView, {
    dataKey: string;
    color: string;
    gradientId: string;
    unit: string;
    formatter: (value: number) => string;
  }> = {
    verdiskaping: {
      dataKey: "value",
      color: "#56C596",
      gradientId: "colorValue",
      unit: "mrd NOK",
      formatter: (v) => `${v.toFixed(1)} mrd`,
    },
    ansatte: {
      dataKey: "employees",
      color: "#14b8a6",
      gradientId: "colorEmployees",
      unit: "ansatte",
      formatter: (v) => v.toLocaleString("nb-NO"),
    },
    dekning: {
      dataKey: "coverage",
      color: "#B39DDB",
      gradientId: "colorCoverage",
      unit: "per 1000",
      formatter: (v) => v.toFixed(1),
    },
  };

  const config = viewConfig[activeView];

  if (!stats) return null;

  return (
    <Card className={cn("animate-slide-up", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar size={18} className="text-teal-500" />
            {title}
          </CardTitle>
          <div className="flex gap-1">
            {(Object.keys(viewConfig) as MetricView[]).map((view) => (
              <button
                key={view}
                onClick={() => setActiveView(view)}
                className={cn(
                  "px-3 py-1.5 text-xs rounded-lg transition-colors",
                  activeView === view
                    ? "bg-teal-500 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                )}
              >
                {view === "verdiskaping" ? "Verdiskaping" : view === "ansatte" ? "Ansatte" : "Dekning"}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Key stats row */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <div className="p-3 bg-slate-50 rounded-xl">
            <div className="text-xs text-slate-500 mb-1">Total vekst</div>
            <div className="flex items-center gap-1">
              {stats.totalGrowth >= 0 ? (
                <TrendingUp size={14} className="text-mint-500" />
              ) : (
                <TrendingDown size={14} className="text-coral-500" />
              )}
              <span
                className={cn(
                  "text-lg font-bold",
                  stats.totalGrowth >= 0 ? "text-mint-600" : "text-coral-500"
                )}
                style={{ fontFamily: "var(--font-outfit)" }}
              >
                {stats.totalGrowth >= 0 ? "+" : ""}{stats.totalGrowth.toFixed(1)}%
              </span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl">
            <div className="text-xs text-slate-500 mb-1">Siste ar</div>
            <div className="flex items-center gap-1">
              {stats.yearOverYear >= 0 ? (
                <TrendingUp size={14} className="text-mint-500" />
              ) : (
                <TrendingDown size={14} className="text-coral-500" />
              )}
              <span
                className={cn(
                  "text-lg font-bold",
                  stats.yearOverYear >= 0 ? "text-mint-600" : "text-coral-500"
                )}
                style={{ fontFamily: "var(--font-outfit)" }}
              >
                {stats.yearOverYear >= 0 ? "+" : ""}{stats.yearOverYear.toFixed(1)}%
              </span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl">
            <div className="text-xs text-slate-500 mb-1">Maloppnaelse</div>
            <div className="flex items-center gap-1">
              {stats.targetAchievement >= 100 ? (
                <Target size={14} className="text-mint-500" />
              ) : (
                <Target size={14} className="text-amber-500" />
              )}
              <span
                className={cn(
                  "text-lg font-bold",
                  stats.targetAchievement >= 100 ? "text-mint-600" : "text-amber-600"
                )}
                style={{ fontFamily: "var(--font-outfit)" }}
              >
                {stats.targetAchievement.toFixed(0)}%
              </span>
            </div>
          </div>

          <div className="p-3 bg-gradient-to-r from-lavender-50 to-teal-50 rounded-xl border border-lavender-100">
            <div className="text-xs text-slate-500 mb-1">Prognose 2025</div>
            <div className="flex items-center gap-1">
              <ArrowRight size={14} className="text-lavender-400" />
              <span
                className="text-lg font-bold text-lavender-600"
                style={{ fontFamily: "var(--font-outfit)" }}
              >
                {stats.forecastValue.toFixed(1)} mrd
              </span>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="h-[220px] w-full">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={data}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id={config.gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={config.color} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={config.color} stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e2e8f0"
                  vertical={false}
                />
                <XAxis
                  dataKey="period"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  tickFormatter={(value) => config.formatter(value)}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  }}
                  formatter={(value: number) => [
                    `${config.formatter(value)} ${config.unit}`,
                    activeView === "verdiskaping" ? "Verdiskaping"
                      : activeView === "ansatte" ? "Ansatte"
                      : "Dekningsgrad",
                  ]}
                  labelStyle={{ fontWeight: 600, color: "#1e293b" }}
                />

                {/* Target line for coverage */}
                {activeView === "dekning" && (
                  <ReferenceLine
                    y={13.0}
                    stroke="#f97316"
                    strokeDasharray="5 5"
                    label={{ value: "Mal", fill: "#f97316", fontSize: 11 }}
                  />
                )}

                <Area
                  type="monotone"
                  dataKey={config.dataKey}
                  stroke={config.color}
                  strokeWidth={3}
                  fill={`url(#${config.gradientId})`}
                  dot={{
                    fill: config.color,
                    strokeWidth: 2,
                    stroke: "white",
                    r: 4,
                  }}
                  activeDot={{
                    fill: config.color,
                    strokeWidth: 3,
                    stroke: "white",
                    r: 6,
                  }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full bg-slate-100 rounded-lg animate-pulse" />
          )}
        </div>

        {/* Insight */}
        <div className="mt-4 p-3 bg-mint-50/50 rounded-xl border border-mint-100">
          <p className="text-sm text-slate-700">
            <strong className="text-mint-700">Trend:</strong>{" "}
            {stats.avgGrowth > 5
              ? `Sterk vekst med gjennomsnittlig ${stats.avgGrowth.toFixed(1)}% arlig okning.`
              : stats.avgGrowth > 0
              ? `Stabil vekst med ${stats.avgGrowth.toFixed(1)}% arlig okning.`
              : `Nedadgaende trend som krever oppmerksomhet.`
            }
            {stats.targetAchievement < 100 && (
              <span className="text-amber-600">
                {" "}Dekningsgrad er fortsatt under malniva.
              </span>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
