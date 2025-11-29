"use client";

import { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { HeroStat } from "@/components/ui/HeroStat";
import { Accordion } from "@/components/ui/Accordion";
import { AdvancedOnly, useViewMode } from "@/contexts/ViewModeContext";
import { FrafallInput, DEFAULT_FRAFALL_INPUT, FRAFALL_KATEGORI_LABELS } from "@/types/frafall";
import { beregnFrafall, formaterFrafallVerdi, genererFrafallArgument } from "@/lib/frafallCalculations";
import { NSF_DATA } from "@/lib/nsfData";
import { FrafallSankey } from "./FrafallSankey";
import { PasientRatioChart } from "./PasientRatioChart";
import {
  Users,
  TrendingDown,
  Banknote,
  Clock,
  UserMinus,
  Sparkles,
  AlertTriangle,
  Target,
  FileText,
} from "lucide-react";

export function FrafallTab() {
  const [input, setInput] = useState<FrafallInput>(DEFAULT_FRAFALL_INPUT);
  const { isAdvanced } = useViewMode();

  const beregning = useMemo(() => beregnFrafall(input), [input]);
  const argument = useMemo(() => genererFrafallArgument(beregning, input), [beregning, input]);

  const handleInputChange = (field: keyof FrafallInput, value: number) => {
    setInput((prev) => ({ ...prev, [field]: value }));
  };

  const handleFordelingChange = (field: keyof FrafallInput["fordeling"], value: number) => {
    setInput((prev) => ({
      ...prev,
      fordeling: { ...prev.fordeling, [field]: value },
    }));
  };

  // Sjekk om fordeling summerer til 100
  const fordelingSum = Object.values(input.fordeling).reduce((a, b) => a + b, 0);
  const fordelingValid = Math.abs(fordelingSum - 100) < 0.1;

  return (
    <div className="space-y-6">
      {/* Hero-seksjon med hovedresultat */}
      <HeroStat
        title="Årlig tap ved frafall"
        value={formaterFrafallVerdi(beregning.taptVerdiskaping, "kroner")}
        description="Tapt verdiskaping inkludert ringvirkninger"
        secondaryValue={`${formaterFrafallVerdi(beregning.aarligFrafall, "antall")} sykepleiere`}
        secondaryDescription="forlater årlig"
        icon={<TrendingDown size={24} />}
        variant="coral"
      />

      <div className="grid grid-cols-12 gap-6">
        {/* VENSTRE KOLONNE - Input */}
        <div className="col-span-3 space-y-4">
          {/* Grunndata - alltid synlig men forenklet i enkel modus */}
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users size={18} className="text-petrol-500" />
                Grunndata
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Antall sykepleiere - alltid synlig */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-700">
                    Antall sykepleiere
                  </label>
                  <span className="text-sm font-semibold text-petrol-600">
                    {formaterFrafallVerdi(input.antallSykepleiere, "antall")}
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="1000"
                  step="10"
                  value={input.antallSykepleiere}
                  onChange={(e) => handleInputChange("antallSykepleiere", Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-400">
                  <span>10</span>
                  <span>1 000</span>
                </div>
              </div>

              {/* Turnover-rate - alltid synlig */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-700">
                    Årlig turnover
                  </label>
                  <span className="text-sm font-semibold text-petrol-600">
                    {formaterFrafallVerdi(input.turnoverRate, "prosent")}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="1"
                  value={input.turnoverRate}
                  onChange={(e) => handleInputChange("turnoverRate", Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-400">
                  <span>1%</span>
                  <span>30%</span>
                </div>
                <div className="text-xs text-slate-500">
                  Nasjonal median: {NSF_DATA.frafall.turnoverSengepostMedian.verdi}%
                </div>
              </div>

              {/* Avanserte innstillinger - kun i avansert modus */}
              <AdvancedOnly showMoreText="Vis flere innstillinger">
                {/* Antall pasienter */}
                <div className="space-y-2 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-700">
                      Antall pasienter
                    </label>
                    <span className="text-sm font-semibold text-petrol-600">
                      {formaterFrafallVerdi(input.antallPasienter, "antall")}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="500"
                    step="10"
                    value={input.antallPasienter}
                    onChange={(e) => handleInputChange("antallPasienter", Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>10</span>
                    <span>500</span>
                  </div>
                </div>

                {/* Gjennomsnittlønn */}
                <div className="space-y-2 pt-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-700">
                      Gj.snitt årslønn
                    </label>
                    <span className="text-sm font-semibold text-petrol-600">
                      {formaterFrafallVerdi(input.gjennomsnittLonn, "kroner")}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="450000"
                    max="850000"
                    step="10000"
                    value={input.gjennomsnittLonn}
                    onChange={(e) => handleInputChange("gjennomsnittLonn", Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </AdvancedOnly>
            </CardContent>
          </Card>

          {/* Fordeling - kun i avansert modus */}
          <AdvancedOnly showMoreText="Vis fordelingsinnstillinger">
            <Card className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <TrendingDown size={16} className="text-coral-500" />
                  Hvor går de?
                  {!fordelingValid && (
                    <span className="text-xs text-coral-500 ml-auto">
                      Sum: {fordelingSum}%
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {(Object.keys(input.fordeling) as Array<keyof FrafallInput["fordeling"]>).map((key) => (
                  <div key={key} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs text-slate-600">
                        {FRAFALL_KATEGORI_LABELS[key]}
                      </label>
                      <span className="text-xs font-semibold text-slate-700">
                        {input.fordeling[key]}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={input.fordeling[key]}
                      onChange={(e) => handleFordelingChange(key, Number(e.target.value))}
                      className="w-full h-1.5"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </AdvancedOnly>

          {/* Bevaringstiltak - alltid synlig */}
          <Card className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Sparkles size={16} className="text-mint-500" />
                Bevaringstiltak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-700">
                    Hvor mange kan beholdes?
                  </label>
                  <span className="text-sm font-semibold text-mint-600">
                    {formaterFrafallVerdi(input.bevaringsandel, "prosent")}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={input.bevaringsandel}
                  onChange={(e) => handleInputChange("bevaringsandel", Number(e.target.value))}
                  className="w-full"
                />
                <div className="text-xs text-slate-500 mt-2">
                  = {formaterFrafallVerdi(beregning.antallBevart, "antall")} sykepleiere
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      {/* MIDT KOLONNE - Visualisering */}
      <div className="col-span-5 space-y-4">
        {/* Sankey-diagram */}
        <FrafallSankey beregning={beregning} />

        {/* Pasientbelastning */}
        <PasientRatioChart
          naa={beregning.pasientPerSykepleierNaa}
          etterFrafall={beregning.pasientPerSykepleierEtterFrafall}
          medBevaring={beregning.pasientPerSykepleierMedBevaring}
        />
      </div>

        {/* HØYRE KOLONNE - Resultater */}
        <div className="col-span-4 space-y-4">
          {/* Nøkkeltall - forenklet i enkel modus */}
          <Card className="border-coral-200 bg-gradient-to-br from-coral-50/50 to-white animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-coral-700">
                <AlertTriangle size={18} />
                Årlig tap
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Hovedtall - alltid synlig */}
              <div className="grid grid-cols-2 gap-3">
                <StatCard
                  label="Frafall"
                  value={formaterFrafallVerdi(beregning.aarligFrafall, "antall")}
                  subtext="sykepleiere/år"
                  icon={<UserMinus size={16} />}
                  color="coral"
                />
                <StatCard
                  label="Tapt verdi"
                  value={formaterFrafallVerdi(beregning.taptVerdiskaping, "kroner")}
                  subtext="ringvirkning"
                  icon={<TrendingDown size={16} />}
                  color="coral"
                />
              </div>
              {/* Detaljer - kun i avansert modus */}
              <AdvancedOnly showButton={false}>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <StatCard
                    label="Rekruttering"
                    value={formaterFrafallVerdi(beregning.rekrutteringskostnad, "kroner")}
                    subtext="å erstatte"
                    icon={<Banknote size={16} />}
                    color="coral"
                  />
                  <StatCard
                    label="Tapt kapasitet"
                    value={formaterFrafallVerdi(beregning.taptKapasitetTimer, "timer")}
                    subtext="per år"
                    icon={<Clock size={16} />}
                    color="coral"
                  />
                </div>
              </AdvancedOnly>
            </CardContent>
          </Card>

          {/* Gevinst-kort - alltid synlig */}
          <Card className="border-mint-200 bg-gradient-to-br from-mint-50/50 to-white animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-mint-700">
                <Sparkles size={18} />
                Potensiell gevinst
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <StatCard
                  label="Bevart"
                  value={formaterFrafallVerdi(beregning.antallBevart, "antall")}
                  subtext="sykepleiere"
                  icon={<Users size={16} />}
                  color="mint"
                />
                <StatCard
                  label="Spart rekr."
                  value={formaterFrafallVerdi(beregning.potensiellBesparing, "kroner")}
                  subtext="besparing"
                  icon={<Banknote size={16} />}
                  color="mint"
                />
              </div>
              {beregning.unngaattVikarbruk > 0 && (
                <div className="text-sm text-mint-700 bg-mint-100/50 rounded-lg p-3">
                  Unngått vikarbruk: {formaterFrafallVerdi(beregning.unngaattVikarbruk, "kroner")}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pasientbelastning-kort - kun i avansert modus */}
          <AdvancedOnly showMoreText="Vis pasientbelastning" showButton={true}>
            <Card className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Target size={16} className="text-petrol-500" />
                  Pasientbelastning
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Nå</span>
                    <span className="font-semibold text-slate-800">
                      {formaterFrafallVerdi(beregning.pasientPerSykepleierNaa, "ratio")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Etter frafall</span>
                    <span className="font-semibold text-coral-600">
                      {formaterFrafallVerdi(beregning.pasientPerSykepleierEtterFrafall, "ratio")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Med bevaring</span>
                    <span className="font-semibold text-mint-600">
                      {formaterFrafallVerdi(beregning.pasientPerSykepleierMedBevaring, "ratio")}
                    </span>
                  </div>
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-700">Endring</span>
                      <span className={`font-semibold ${beregning.endringPasientbelastning > 0 ? "text-coral-600" : "text-mint-600"}`}>
                        {beregning.endringPasientbelastning > 0 ? "+" : ""}
                        {beregning.endringPasientbelastning.toFixed(1)} pasienter/sykepleier
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AdvancedOnly>

          {/* Argument-kort - alltid synlig */}
          <Card className="bg-slate-50 animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText size={16} className="text-slate-500" />
                Frafall-argumentet
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-700 leading-relaxed">
                {argument}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  subtext,
  icon,
  color,
}: {
  label: string;
  value: string;
  subtext: string;
  icon: React.ReactNode;
  color: "coral" | "mint" | "petrol";
}) {
  const colorClasses = {
    coral: "text-coral-500",
    mint: "text-mint-500",
    petrol: "text-petrol-500",
  };

  return (
    <div className="bg-white rounded-lg p-3 border border-slate-100">
      <div className={`flex items-center gap-1.5 ${colorClasses[color]} mb-1`}>
        {icon}
        <span className="text-xs font-medium text-slate-500">{label}</span>
      </div>
      <div className="text-lg font-bold text-slate-800" style={{ fontFamily: "var(--font-outfit)" }}>
        {value}
      </div>
      <div className="text-xs text-slate-400">{subtext}</div>
    </div>
  );
}
