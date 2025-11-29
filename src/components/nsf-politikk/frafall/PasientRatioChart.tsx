"use client";

import { useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { formaterFrafallVerdi } from "@/lib/frafallCalculations";
import { Users } from "lucide-react";

interface PasientRatioChartProps {
  naa: number;
  etterFrafall: number;
  medBevaring: number;
}

export function PasientRatioChart({ naa, etterFrafall, medBevaring }: PasientRatioChartProps) {
  // Beregn maksverdien for skalering
  const maxValue = useMemo(() => {
    return Math.max(naa, etterFrafall, medBevaring) * 1.2;
  }, [naa, etterFrafall, medBevaring]);

  const bars = [
    {
      label: "Nåværende",
      value: naa,
      color: "bg-petrol-500",
      textColor: "text-petrol-600",
    },
    {
      label: "Etter frafall",
      value: etterFrafall,
      color: "bg-coral-500",
      textColor: "text-coral-600",
    },
    {
      label: "Med bevaring",
      value: medBevaring,
      color: "bg-mint-500",
      textColor: "text-mint-600",
    },
  ];

  return (
    <Card className="animate-slide-up" style={{ animationDelay: "0.15s" }}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users size={18} className="text-petrol-500" />
          Pasienter per sykepleier
        </CardTitle>
        <p className="text-sm text-slate-500 mt-1">
          Sammenligning av pasientbelastning
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {bars.map((bar) => {
            const percentage = (bar.value / maxValue) * 100;
            return (
              <div key={bar.label} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">{bar.label}</span>
                  <span className={`text-sm font-bold ${bar.textColor}`}>
                    {formaterFrafallVerdi(bar.value, "ratio")}
                  </span>
                </div>
                <div className="h-8 bg-slate-100 rounded-lg overflow-hidden relative">
                  <div
                    className={`h-full ${bar.color} rounded-lg transition-all duration-500 flex items-center justify-end pr-3`}
                    style={{ width: `${percentage}%` }}
                  >
                    {percentage > 25 && (
                      <span className="text-white text-xs font-semibold">
                        {bar.value.toFixed(1)} pas.
                      </span>
                    )}
                  </div>
                  {percentage <= 25 && (
                    <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold ${bar.textColor}`}>
                      {bar.value.toFixed(1)} pas.
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Forklaring */}
        <div className="mt-6 pt-4 border-t border-slate-100">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-2xl font-bold text-petrol-600" style={{ fontFamily: "var(--font-outfit)" }}>
                {formaterFrafallVerdi(naa, "ratio")}
              </div>
              <div className="text-xs text-slate-500">Nå</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-coral-600" style={{ fontFamily: "var(--font-outfit)" }}>
                {etterFrafall > naa ? "+" : ""}
                {(etterFrafall - naa).toFixed(1)}
              </div>
              <div className="text-xs text-slate-500">Endring</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-mint-600" style={{ fontFamily: "var(--font-outfit)" }}>
                {formaterFrafallVerdi(medBevaring, "ratio")}
              </div>
              <div className="text-xs text-slate-500">Med tiltak</div>
            </div>
          </div>
        </div>

        {/* Advarsel ved høy belastning */}
        {etterFrafall > 10 && (
          <div className="mt-4 p-3 bg-coral-50 border border-coral-200 rounded-lg">
            <p className="text-xs text-coral-700">
              <strong>Advarsel:</strong> En ratio over 1:10 er assosiert med økt
              risiko for pasientskader og utbrenthet blant personalet.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
