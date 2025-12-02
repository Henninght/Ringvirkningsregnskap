"use client";

import { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Municipality } from "@/types/ripple";
import { municipalityData, getCounties } from "@/data/municipalities";
import {
  GitCompare,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Minus,
  MapPin,
  Users,
  Activity,
  Building2
} from "lucide-react";
import { cn } from "@/lib/utils";

type ComparisonMetric = "nurses" | "coverage" | "population" | "employees";

interface ComparisonWidgetProps {
  initialMunicipality1?: string;
  initialMunicipality2?: string;
}

export function ComparisonWidget({
  initialMunicipality1 = "0301", // Oslo
  initialMunicipality2 = "4601", // Bergen
}: ComparisonWidgetProps) {
  const [municipality1Id, setMunicipality1Id] = useState(initialMunicipality1);
  const [municipality2Id, setMunicipality2Id] = useState(initialMunicipality2);
  const [countyFilter, setCountyFilter] = useState<string | null>(null);

  const counties = getCounties();

  const filteredMunicipalities = countyFilter
    ? municipalityData.filter(m => m.county === countyFilter)
    : municipalityData;

  const municipality1 = useMemo(
    () => municipalityData.find(m => m.id === municipality1Id),
    [municipality1Id]
  );

  const municipality2 = useMemo(
    () => municipalityData.find(m => m.id === municipality2Id),
    [municipality2Id]
  );

  if (!municipality1 || !municipality2) {
    return null;
  }

  const metrics: {
    key: ComparisonMetric;
    label: string;
    icon: typeof Users;
    format: (m: Municipality) => string;
    getValue: (m: Municipality) => number;
    unit: string;
    higherIsBetter: boolean;
  }[] = [
    {
      key: "nurses",
      label: "Sykepleiere",
      icon: Users,
      format: (m) => m.nurses?.toLocaleString("nb-NO") || "0",
      getValue: (m) => m.nurses || 0,
      unit: "ansatte",
      higherIsBetter: true,
    },
    {
      key: "coverage",
      label: "Dekningsgrad",
      icon: Activity,
      format: (m) => m.coverageRatio?.toFixed(1) || "0",
      getValue: (m) => m.coverageRatio || 0,
      unit: "per 1000 innb.",
      higherIsBetter: true,
    },
    {
      key: "population",
      label: "Befolkning",
      icon: Building2,
      format: (m) => m.population.toLocaleString("nb-NO"),
      getValue: (m) => m.population,
      unit: "innbyggere",
      higherIsBetter: false, // Neutral
    },
    {
      key: "employees",
      label: "Ansatte totalt",
      icon: MapPin,
      format: (m) => m.employees.toLocaleString("nb-NO"),
      getValue: (m) => m.employees,
      unit: "i organisasjonen",
      higherIsBetter: true,
    },
  ];

  const calculateDiff = (val1: number, val2: number): number => {
    if (val2 === 0) return val1 > 0 ? 100 : 0;
    return ((val1 - val2) / val2) * 100;
  };

  return (
    <Card className="animate-slide-up">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitCompare size={18} className="text-teal-500" />
          Kommunesammenligning
        </CardTitle>
        <p className="text-sm text-slate-500 mt-1">
          Sammenlign sykepleierdekning mellom kommuner
        </p>
      </CardHeader>
      <CardContent>
        {/* Fylkesfilter */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setCountyFilter(null)}
              className={cn(
                "px-2.5 py-1 text-xs rounded-full transition-colors",
                countyFilter === null
                  ? "bg-teal-500 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
            >
              Alle
            </button>
            {counties.slice(0, 6).map(county => (
              <button
                key={county}
                onClick={() => setCountyFilter(county)}
                className={cn(
                  "px-2.5 py-1 text-xs rounded-full transition-colors",
                  countyFilter === county
                    ? "bg-teal-500 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                )}
              >
                {county}
              </button>
            ))}
          </div>
        </div>

        {/* Kommune-velgere */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">
              Kommune 1
            </label>
            <div className="relative">
              <select
                value={municipality1Id}
                onChange={(e) => setMunicipality1Id(e.target.value)}
                className="w-full appearance-none bg-mint-50 border border-mint-200 rounded-xl px-3 py-2.5 pr-8 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-mint-500/20 focus:border-mint-500"
              >
                {filteredMunicipalities.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-mint-500 pointer-events-none"
              />
            </div>
            <div className="text-xs text-slate-400 mt-1">{municipality1.county}</div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">
              Kommune 2
            </label>
            <div className="relative">
              <select
                value={municipality2Id}
                onChange={(e) => setMunicipality2Id(e.target.value)}
                className="w-full appearance-none bg-teal-50 border border-teal-200 rounded-xl px-3 py-2.5 pr-8 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              >
                {filteredMunicipalities.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-teal-500 pointer-events-none"
              />
            </div>
            <div className="text-xs text-slate-400 mt-1">{municipality2.county}</div>
          </div>
        </div>

        {/* Sammenligningstabell */}
        <div className="space-y-3">
          {metrics.map(metric => {
            const val1 = metric.getValue(municipality1);
            const val2 = metric.getValue(municipality2);
            const diff = calculateDiff(val1, val2);
            const Icon = metric.icon;

            // Hvem er "bedre"?
            const winner = metric.higherIsBetter
              ? (val1 > val2 ? 1 : val1 < val2 ? 2 : 0)
              : 0; // Neutral for non-comparative metrics

            return (
              <div
                key={metric.key}
                className="p-3 bg-slate-50 rounded-xl"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon size={14} className="text-slate-400" />
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    {metric.label}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 items-center">
                  {/* Kommune 1 verdi */}
                  <div className={cn(
                    "text-center p-2 rounded-lg",
                    winner === 1 ? "bg-mint-100" : "bg-white"
                  )}>
                    <div
                      className={cn(
                        "text-lg font-bold",
                        winner === 1 ? "text-mint-600" : "text-slate-800"
                      )}
                      style={{ fontFamily: "var(--font-outfit)" }}
                    >
                      {metric.format(municipality1)}
                    </div>
                    <div className="text-xs text-slate-400">{metric.unit}</div>
                  </div>

                  {/* Diff */}
                  <div className="text-center">
                    <div className={cn(
                      "inline-flex items-center gap-1 text-sm font-medium",
                      diff > 0 ? "text-mint-600" : diff < 0 ? "text-coral-500" : "text-slate-400"
                    )}>
                      {diff > 0 ? (
                        <TrendingUp size={14} />
                      ) : diff < 0 ? (
                        <TrendingDown size={14} />
                      ) : (
                        <Minus size={14} />
                      )}
                      <span>
                        {diff > 0 ? "+" : ""}{diff.toFixed(0)}%
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">forskjell</div>
                  </div>

                  {/* Kommune 2 verdi */}
                  <div className={cn(
                    "text-center p-2 rounded-lg",
                    winner === 2 ? "bg-teal-100" : "bg-white"
                  )}>
                    <div
                      className={cn(
                        "text-lg font-bold",
                        winner === 2 ? "text-teal-600" : "text-slate-800"
                      )}
                      style={{ fontFamily: "var(--font-outfit)" }}
                    >
                      {metric.format(municipality2)}
                    </div>
                    <div className="text-xs text-slate-400">{metric.unit}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Innsikt */}
        <div className="mt-4 p-4 bg-gradient-to-r from-lavender-50 to-teal-50 rounded-xl border border-lavender-100">
          <p className="text-sm text-slate-700">
            <strong>{municipality1.name}</strong> har{" "}
            {(municipality1.coverageRatio || 0) > (municipality2.coverageRatio || 0) ? (
              <span className="text-mint-600 font-medium">høyere</span>
            ) : (municipality1.coverageRatio || 0) < (municipality2.coverageRatio || 0) ? (
              <span className="text-coral-500 font-medium">lavere</span>
            ) : (
              <span className="text-slate-500 font-medium">lik</span>
            )}{" "}
            dekningsgrad enn <strong>{municipality2.name}</strong>.
            {(municipality1.coverageRatio || 0) < 12.0 && (
              <span className="text-coral-500">
                {" "}Merk: {municipality1.name} ligger under anbefalt minstenivia.
              </span>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
