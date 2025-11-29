"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import {
  Shield,
  Users,
  TrendingUp,
  AlertTriangle,
  HeartPulse,
  ArrowRight,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PreparednessData {
  coverageRatio: number; // Sykepleiere per 1000 innbyggere
  targetCoverage: number; // Malniva
  agencyPremium: number; // Vikarpremie i %
  turnoverRate: number; // Turnover i %
  vacancyRate: number; // Andel ubesatte stillinger
  avgPatientLoad: number; // Pasienter per sykepleier
  targetPatientLoad: number; // Mal for pasientbelastning
}

// Default NSF-data (mock - i produksjon fra API)
const DEFAULT_DATA: PreparednessData = {
  coverageRatio: 12.3,
  targetCoverage: 14.0,
  agencyPremium: 45,
  turnoverRate: 8.2,
  vacancyRate: 6.5,
  avgPatientLoad: 8.3,
  targetPatientLoad: 6.0,
};

interface PreparednessCardProps {
  data?: PreparednessData;
  onDetailClick?: () => void;
}

export function PreparednessCard({
  data = DEFAULT_DATA,
  onDetailClick
}: PreparednessCardProps) {
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  // Beregn beredskapsindeks (0-100)
  const coverageScore = Math.min(100, (data.coverageRatio / data.targetCoverage) * 100);
  const agencyScore = Math.max(0, 100 - data.agencyPremium);
  const turnoverScore = Math.max(0, 100 - (data.turnoverRate * 5));
  const vacancyScore = Math.max(0, 100 - (data.vacancyRate * 10));
  const loadScore = Math.min(100, (data.targetPatientLoad / data.avgPatientLoad) * 100);

  const overallScore = Math.round(
    (coverageScore * 0.3 + agencyScore * 0.2 + turnoverScore * 0.2 +
     vacancyScore * 0.15 + loadScore * 0.15)
  );

  // Beredskapsklasse
  const getPreparednessLevel = (score: number) => {
    if (score >= 80) return { label: "God", color: "text-mint-600", bg: "bg-mint-100" };
    if (score >= 60) return { label: "Moderat", color: "text-coral-500", bg: "bg-coral-100" };
    return { label: "Kritisk", color: "text-red-600", bg: "bg-red-100" };
  };

  const level = getPreparednessLevel(overallScore);

  const metrics = [
    {
      id: "coverage",
      label: "Dekningsgrad",
      value: `${data.coverageRatio.toFixed(1)}`,
      target: `Mal: ${data.targetCoverage}`,
      unit: "per 1000",
      score: coverageScore,
      icon: Users,
      tooltip: "Antall sykepleiere per 1000 innbyggere. Hoyere er bedre for beredskap."
    },
    {
      id: "agency",
      label: "Vikarpremie",
      value: `${data.agencyPremium}%`,
      target: "Lavere er bedre",
      unit: "merkostnad",
      score: agencyScore,
      icon: AlertTriangle,
      tooltip: "Merkostnad ved bruk av vikarbyra sammenlignet med fast ansatte."
    },
    {
      id: "turnover",
      label: "Turnover",
      value: `${data.turnoverRate}%`,
      target: "Mal: <5%",
      unit: "arlig",
      score: turnoverScore,
      icon: TrendingUp,
      tooltip: "Andel ansatte som slutter per ar. Hoy turnover svekker beredskap."
    },
    {
      id: "load",
      label: "Pasientbelastning",
      value: `${data.avgPatientLoad.toFixed(1)}`,
      target: `Mal: ${data.targetPatientLoad}`,
      unit: "per sykepleier",
      score: loadScore,
      icon: HeartPulse,
      tooltip: "Gjennomsnittlig antall pasienter per sykepleier. Lavere gir bedre omsorg."
    },
  ];

  return (
    <Card className="animate-slide-up">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Shield size={18} className="text-mint-500" />
            Beredskapsindeks
          </CardTitle>
          <div className={cn(
            "px-3 py-1 rounded-full text-sm font-medium",
            level.bg,
            level.color
          )}>
            {level.label}
          </div>
        </div>
        <p className="text-sm text-slate-500 mt-1">
          Helhetsvurdering av sykepleierkapasitet og beredskap
        </p>
      </CardHeader>
      <CardContent>
        {/* Hovedscore */}
        <div className="flex items-center gap-6 mb-6">
          <div className="relative">
            <svg className="w-24 h-24 transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="40"
                fill="none"
                stroke="#f1f5f9"
                strokeWidth="8"
              />
              <circle
                cx="48"
                cy="48"
                r="40"
                fill="none"
                stroke={overallScore >= 80 ? "#56C596" : overallScore >= 60 ? "#FF8A65" : "#ef4444"}
                strokeWidth="8"
                strokeDasharray={`${(overallScore / 100) * 251.2} 251.2`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-slate-800" style={{ fontFamily: "var(--font-outfit)" }}>
                {overallScore}
              </span>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-slate-600 text-sm leading-relaxed">
              {overallScore >= 80
                ? "God beredskap. Sykepleierdekningen er tilstrekkelig for å håndtere normale og økte belastninger."
                : overallScore >= 60
                ? "Moderat beredskap. Noen områder krever oppmerksomhet for å sikre robust dekning."
                : "Kritisk beredskap. Betydelige hull i dekningen som kan påvirke pasientbehandling og krisehåndtering."
              }
            </p>
          </div>
        </div>

        {/* Metrikkgrid */}
        <div className="grid grid-cols-2 gap-3">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            const metricLevel = getPreparednessLevel(metric.score);

            return (
              <div
                key={metric.id}
                className="relative p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors group"
                onMouseEnter={() => setShowTooltip(metric.id)}
                onMouseLeave={() => setShowTooltip(null)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon size={14} className={metricLevel.color} />
                    <span className="text-xs font-medium text-slate-600">{metric.label}</span>
                  </div>
                  <Info size={12} className="text-slate-300 group-hover:text-slate-400 transition-colors" />
                </div>
                <div className="text-xl font-bold text-slate-800" style={{ fontFamily: "var(--font-outfit)" }}>
                  {metric.value}
                  <span className="text-xs font-normal text-slate-400 ml-1">{metric.unit}</span>
                </div>
                <div className="text-xs text-slate-400 mt-1">{metric.target}</div>

                {/* Progress bar */}
                <div className="h-1 bg-slate-200 rounded-full mt-2 overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      metric.score >= 80 ? "bg-mint-500" : metric.score >= 60 ? "bg-coral-400" : "bg-red-500"
                    )}
                    style={{ width: `${Math.min(100, metric.score)}%` }}
                  />
                </div>

                {/* Tooltip */}
                {showTooltip === metric.id && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-800 text-white text-xs rounded-lg max-w-[200px] z-10">
                    {metric.tooltip}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA */}
        {onDetailClick && (
          <button
            onClick={onDetailClick}
            className="mt-4 w-full py-3 px-4 bg-gradient-to-r from-slate-100 to-slate-50 text-slate-700 rounded-xl font-medium text-sm hover:from-slate-200 hover:to-slate-100 transition-all duration-300 flex items-center justify-center gap-2 group"
          >
            <span>Se detaljert analyse</span>
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </button>
        )}
      </CardContent>
    </Card>
  );
}
