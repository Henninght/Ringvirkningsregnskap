"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { SourceTooltip } from "@/components/ui/SourceTooltip";
import { InfoTooltip } from "@/components/ui/InfoTooltip";
import { KILDER } from "@/lib/eidsiva/eidsivaData";
import { DEFAULT_MULTIPLIKATORER } from "@/lib/eidsiva/rippleCalculations";
import { motion } from "framer-motion";
import {
  Building2,
  Truck,
  Users,
  TrendingUp,
  MapPin,
  Package,
  Factory,
  Calculator,
} from "lucide-react";
import type { LeverandorInput } from "@/lib/eidsiva/rippleCalculations";

// Formatering
const formatNOK = (value: number): string => {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1)} mrd`;
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(0)} mill`;
  }
  return new Intl.NumberFormat("nb-NO").format(Math.round(value));
};

const formatNumber = (value: number): string => {
  return new Intl.NumberFormat("nb-NO").format(Math.round(value));
};

interface SupplierImpactProps {
  onChange: (input: LeverandorInput) => void;
  initialValues?: Partial<LeverandorInput>;
  className?: string;
}

export function SupplierImpact({
  onChange,
  initialValues,
  className = "",
}: SupplierImpactProps) {
  const [input, setInput] = useState<LeverandorInput>({
    totaleInnkjop: initialValues?.totaleInnkjop ?? 2_500_000_000,
    antallLeverandorer: initialValues?.antallLeverandorer ?? 850,
    innlandsandel: initialValues?.innlandsandel ?? 85,
  });

  // Notify parent on changes
  useEffect(() => {
    onChange(input);
  }, [input, onChange]);

  const updateField = <K extends keyof LeverandorInput>(
    field: K,
    value: LeverandorInput[K]
  ) => {
    setInput((prev) => ({ ...prev, [field]: value }));
  };

  // Beregn indirekte effekter
  const results = useMemo(() => {
    const innlandsInnkjop = input.totaleInnkjop * (input.innlandsandel / 100);
    const leverandorVerdiskaping = innlandsInnkjop * DEFAULT_MULTIPLIKATORER.indirekte;
    const anslattAnsatte = Math.round(
      leverandorVerdiskaping / DEFAULT_MULTIPLIKATORER.verdiskapingPerAnsattLeverandor
    );
    const bedrifterMedAvhengighet = Math.round(input.antallLeverandorer * 0.05);
    const snittPerLeverandor = input.antallLeverandorer > 0
      ? input.totaleInnkjop / input.antallLeverandorer
      : 0;

    return {
      innlandsInnkjop,
      leverandorVerdiskaping,
      anslattAnsatte,
      bedrifterMedAvhengighet,
      snittPerLeverandor,
    };
  }, [input]);

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <CardTitle size="md">Leverandøreffekter</CardTitle>
          <SourceTooltip kilde={KILDER.leverandorer} size="md" />
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Indirekte verdiskaping gjennom leverandørkjeden
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Totale innkjøp */}
        <div className="group">
          <div className="flex items-center gap-2 mb-2">
            <Package size={16} className="text-slate-400" />
            <label className="text-sm font-medium text-slate-700">
              Totale innkjøp
            </label>
            <InfoTooltip
              description="Samlede innkjøp fra leverandører årlig"
              size="sm"
            />
          </div>
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              value={formatNOK(input.totaleInnkjop)}
              onChange={(e) => {
                const raw = e.target.value.replace(/[^0-9]/g, "");
                updateField("totaleInnkjop", parseInt(raw) || 0);
              }}
              className="w-full px-4 py-3 pr-16 rounded-lg border border-slate-200 bg-white
                         text-slate-900 font-medium text-right
                         focus:outline-none focus:ring-2 focus:ring-petrol-500 focus:border-transparent
                         transition-all duration-200 group-hover:border-slate-300"
              aria-label="Totale innkjøp"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
              NOK
            </span>
          </div>
        </div>

        {/* Antall leverandører */}
        <div className="group">
          <div className="flex items-center gap-2 mb-2">
            <Factory size={16} className="text-slate-400" />
            <label className="text-sm font-medium text-slate-700">
              Antall leverandører
            </label>
            <InfoTooltip
              description="Antall unike leverandører i leverandørkjeden"
              size="sm"
            />
          </div>
          <div className="relative">
            <input
              type="number"
              value={input.antallLeverandorer}
              onChange={(e) => updateField("antallLeverandorer", parseInt(e.target.value) || 0)}
              min={0}
              step={10}
              className="w-full px-4 py-3 pr-20 rounded-lg border border-slate-200 bg-white
                         text-slate-900 font-medium text-right
                         focus:outline-none focus:ring-2 focus:ring-petrol-500 focus:border-transparent
                         transition-all duration-200 group-hover:border-slate-300"
              aria-label="Antall leverandører"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
              bedrifter
            </span>
          </div>
        </div>

        {/* Innlandsandel slider */}
        <div className="group">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-slate-400" />
              <label className="text-sm font-medium text-slate-700">
                Norsk leverandørandel
              </label>
              <InfoTooltip
                description="Andel av innkjøp fra norske leverandører"
                size="sm"
              />
            </div>
            <span className="text-sm font-bold text-petrol-600">
              {input.innlandsandel}%
            </span>
          </div>
          <input
            type="range"
            value={input.innlandsandel}
            onChange={(e) => updateField("innlandsandel", parseInt(e.target.value))}
            min={0}
            max={100}
            step={1}
            className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer
                       [&::-webkit-slider-thumb]:appearance-none
                       [&::-webkit-slider-thumb]:h-4
                       [&::-webkit-slider-thumb]:w-4
                       [&::-webkit-slider-thumb]:rounded-full
                       [&::-webkit-slider-thumb]:bg-petrol-600
                       [&::-webkit-slider-thumb]:cursor-pointer
                       [&::-webkit-slider-thumb]:shadow-md
                       [&::-moz-range-thumb]:h-4
                       [&::-moz-range-thumb]:w-4
                       [&::-moz-range-thumb]:rounded-full
                       [&::-moz-range-thumb]:bg-petrol-600
                       [&::-moz-range-thumb]:cursor-pointer
                       [&::-moz-range-thumb]:border-0"
            aria-label="Norsk leverandørandel"
            style={{
              background: `linear-gradient(to right, #1a8a7a 0%, #1a8a7a ${input.innlandsandel}%, #e2e8f0 ${input.innlandsandel}%, #e2e8f0 100%)`,
            }}
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Resultater */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 mb-4">
            <Calculator size={16} className="text-petrol-600" />
            <span className="text-sm font-semibold text-slate-700">
              Beregnede effekter
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <motion.div
              className="bg-gradient-to-br from-petrol-50 to-petrol-100/50 rounded-lg p-3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center gap-1.5 text-petrol-600 mb-1">
                <TrendingUp size={14} />
                <span className="text-xs font-medium">Verdiskaping</span>
              </div>
              <p className="text-lg font-bold text-petrol-700">
                {formatNOK(results.leverandorVerdiskaping)}
              </p>
            </motion.div>

            <motion.div
              className="bg-gradient-to-br from-sage-50 to-sage-100/50 rounded-lg p-3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: 0.05 }}
            >
              <div className="flex items-center gap-1.5 text-sage-600 mb-1">
                <Users size={14} />
                <span className="text-xs font-medium">Ansatte</span>
              </div>
              <p className="text-lg font-bold text-sage-700">
                {formatNumber(results.anslattAnsatte)}
              </p>
              <p className="text-xs text-sage-500">hos leverandører</p>
            </motion.div>

            <motion.div
              className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-lg p-3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: 0.1 }}
            >
              <div className="flex items-center gap-1.5 text-amber-600 mb-1">
                <Building2 size={14} />
                <span className="text-xs font-medium">Avhengige</span>
              </div>
              <p className="text-lg font-bold text-amber-700">
                {formatNumber(results.bedrifterMedAvhengighet)}
              </p>
              <p className="text-xs text-amber-500">bedrifter</p>
            </motion.div>

            <motion.div
              className="bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-lg p-3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: 0.15 }}
            >
              <div className="flex items-center gap-1.5 text-slate-600 mb-1">
                <Truck size={14} />
                <span className="text-xs font-medium">Snitt/leverandør</span>
              </div>
              <p className="text-lg font-bold text-slate-700">
                {formatNOK(results.snittPerLeverandor)}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Info om norske innkjøp */}
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <MapPin size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-blue-700">
                Norske innkjøp: {formatNOK(results.innlandsInnkjop)}
              </p>
              <p className="text-xs text-blue-600 mt-0.5">
                {input.innlandsandel}% av totale innkjøp bidrar til norsk verdiskaping
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
