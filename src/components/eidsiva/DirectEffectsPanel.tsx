"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { SourceTooltip } from "@/components/ui/SourceTooltip";
import { InfoTooltip } from "@/components/ui/InfoTooltip";
import { KILDER } from "@/lib/eidsiva/eidsivaData";
import { EIDSIVA_DESCRIPTIONS } from "@/lib/eidsiva/eidsivaDescriptions";
import { Users, Wallet, TrendingUp, Landmark, Calculator } from "lucide-react";
import type { DirektEffektInput } from "@/lib/eidsiva/rippleCalculations";

// Formatering med norsk locale
const formatNOK = (value: number): string => {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1)} mrd`;
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(0)} mill`;
  }
  return new Intl.NumberFormat("nb-NO").format(value);
};

interface DirectEffectsPanelProps {
  onChange: (input: DirektEffektInput) => void;
  initialValues?: Partial<DirektEffektInput>;
  className?: string;
}

interface InputFieldProps {
  label: string;
  icon: React.ReactNode;
  value: number;
  onChange: (value: number) => void;
  suffix?: string;
  description?: string;
  min?: number;
  max?: number;
  step?: number;
}

function InputField({
  label,
  icon,
  value,
  onChange,
  suffix = "NOK",
  description,
  min = 0,
  max,
  step = 1000000,
}: InputFieldProps) {
  const [localValue, setLocalValue] = useState(value.toString());
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isFocused) {
      setLocalValue(value.toString());
    }
  }, [value, isFocused]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    setLocalValue(raw);
    const numValue = parseInt(raw) || 0;
    onChange(numValue);
  };

  const handleBlur = () => {
    setIsFocused(false);
    const numValue = parseInt(localValue) || 0;
    setLocalValue(numValue.toString());
  };

  return (
    <div className="group">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-slate-400">{icon}</span>
        <label className="text-sm font-medium text-slate-700">{label}</label>
        {description && (
          <InfoTooltip description={description} size="sm" />
        )}
      </div>
      <div className="relative">
        <input
          type="text"
          inputMode="numeric"
          value={isFocused ? localValue : formatNOK(parseInt(localValue) || 0)}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          className="w-full px-4 py-3 pr-16 rounded-lg border border-slate-200 bg-white
                     text-slate-900 font-medium text-right
                     focus:outline-none focus:ring-2 focus:ring-petrol-500 focus:border-transparent
                     transition-all duration-200
                     group-hover:border-slate-300"
          aria-label={label}
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
          {suffix}
        </span>
      </div>
    </div>
  );
}

export function DirectEffectsPanel({
  onChange,
  initialValues,
  className = "",
}: DirectEffectsPanelProps) {
  const [input, setInput] = useState<DirektEffektInput>({
    antallAnsatte: initialValues?.antallAnsatte ?? 1200,
    sumLonnskostnader: initialValues?.sumLonnskostnader ?? 1_200_000_000,
    investeringer: initialValues?.investeringer ?? 800_000_000,
    skattOgUtbytte: initialValues?.skattOgUtbytte ?? 500_000_000,
  });

  // Notify parent on changes
  useEffect(() => {
    onChange(input);
  }, [input, onChange]);

  const updateField = <K extends keyof DirektEffektInput>(
    field: K,
    value: DirektEffektInput[K]
  ) => {
    setInput((prev) => ({ ...prev, [field]: value }));
  };

  // Calculate totals for summary
  const totalDirekte = input.sumLonnskostnader + input.investeringer + input.skattOgUtbytte;
  const perAnsatt = input.antallAnsatte > 0
    ? totalDirekte / input.antallAnsatte
    : 0;

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <CardTitle size="md">Direkte effekter</CardTitle>
          <SourceTooltip kilde={KILDER.ringvirkninger} size="md" />
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Interne verdiskapingseffekter fra virksomheten
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Ansatte - spesiell input med annen suffix */}
        <div className="group">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-slate-400"><Users size={16} /></span>
            <label className="text-sm font-medium text-slate-700">Antall ansatte</label>
            <InfoTooltip
              description="Totalt antall årsverk i konsernet"
              size="sm"
            />
          </div>
          <div className="relative">
            <input
              type="number"
              value={input.antallAnsatte}
              onChange={(e) => updateField("antallAnsatte", parseInt(e.target.value) || 0)}
              min={0}
              step={10}
              className="w-full px-4 py-3 pr-20 rounded-lg border border-slate-200 bg-white
                         text-slate-900 font-medium text-right
                         focus:outline-none focus:ring-2 focus:ring-petrol-500 focus:border-transparent
                         transition-all duration-200
                         group-hover:border-slate-300"
              aria-label="Antall ansatte"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
              årsverk
            </span>
          </div>
        </div>

        <InputField
          label="Sum lønnskostnader"
          icon={<Wallet size={16} />}
          value={input.sumLonnskostnader}
          onChange={(v) => updateField("sumLonnskostnader", v)}
          description="Total lønnssum inkludert sosiale kostnader"
        />

        <InputField
          label="Investeringer"
          icon={<TrendingUp size={16} />}
          value={input.investeringer}
          onChange={(v) => updateField("investeringer", v)}
          description="Årlige investeringer i infrastruktur og utstyr"
        />

        <InputField
          label="Skatt og utbytte"
          icon={<Landmark size={16} />}
          value={input.skattOgUtbytte}
          onChange={(v) => updateField("skattOgUtbytte", v)}
          description="Skatt, avgifter og utbytte til eierkommuner"
        />

        {/* Summary */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 mb-3">
            <Calculator size={16} className="text-petrol-600" />
            <span className="text-sm font-semibold text-slate-700">Oppsummering</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-500 mb-1">Total direkte effekt</p>
              <p className="text-lg font-bold text-petrol-700">
                {formatNOK(totalDirekte)}
              </p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-500 mb-1">Per ansatt</p>
              <p className="text-lg font-bold text-petrol-700">
                {formatNOK(perAnsatt)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
