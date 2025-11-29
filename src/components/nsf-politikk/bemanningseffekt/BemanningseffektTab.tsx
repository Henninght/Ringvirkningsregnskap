"use client";

import { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { HeroStat } from "@/components/ui/HeroStat";
import { AdvancedOnly } from "@/contexts/ViewModeContext";
import { TallMedKilde } from "@/components/kilde";
import { NSF_DATA, formaterKroner } from "@/lib/nsfData";
import { beregnBemanningEffekt, DEFAULT_BEMANNING_INPUT } from "@/lib/nsfCalculations";
import { BemanningInput } from "@/types/nsf";
import { Users, TrendingUp, Receipt, Briefcase, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function BemanningseffektTab() {
  const [input, setInput] = useState<BemanningInput>(DEFAULT_BEMANNING_INPUT);

  const beregning = useMemo(() => beregnBemanningEffekt(input), [input]);

  const isPositive = input.endringAntall >= 0;

  return (
    <div className="space-y-6">
      {/* Hero-seksjon */}
      <HeroStat
        title={isPositive ? "Verdiskaping ved økt bemanning" : "Tap ved redusert bemanning"}
        value={`${isPositive ? "+" : ""}${formaterKroner(beregning.verdiskaping)}`}
        description="Total samfunnsøkonomisk effekt"
        secondaryValue={`${isPositive ? "+" : ""}${beregning.frigjorteArsverk.toFixed(1)} årsverk`}
        secondaryDescription="sysselsettingseffekt"
        icon={<TrendingUp size={24} />}
        variant={isPositive ? "mint" : "coral"}
      />

      <div className="grid grid-cols-12 gap-6">
      {/* Input panel */}
      <div className="col-span-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users size={18} className="text-petrol-500" />
              Bemanningsendring
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Endring i antall */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Endring i antall sykepleiere
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setInput({ ...input, endringAntall: Math.max(-100, input.endringAntall - 10) })}
                  className="w-10 h-10 rounded-lg bg-coral-100 text-coral-600 font-bold hover:bg-coral-200 transition-colors"
                >
                  -10
                </button>
                <input
                  type="number"
                  value={input.endringAntall}
                  onChange={(e) => setInput({ ...input, endringAntall: Number(e.target.value) })}
                  className={cn(
                    "flex-1 px-4 py-3 text-center text-2xl font-bold border rounded-xl",
                    isPositive ? "border-mint-300 text-mint-700 bg-mint-50" : "border-coral-300 text-coral-700 bg-coral-50"
                  )}
                />
                <button
                  onClick={() => setInput({ ...input, endringAntall: Math.min(500, input.endringAntall + 10) })}
                  className="w-10 h-10 rounded-lg bg-mint-100 text-mint-600 font-bold hover:bg-mint-200 transition-colors"
                >
                  +10
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-2 text-center">
                {isPositive ? "Flere sykepleiere" : "Færre sykepleiere"}
              </p>
            </div>

            {/* Gjennomsnittlønn */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Gjennomsnittlig årslønn
              </label>
              <input
                type="range"
                min={450000}
                max={850000}
                step={10000}
                value={input.gjennomsnittLonn}
                onChange={(e) => setInput({ ...input, gjennomsnittLonn: Number(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>450 000</span>
                <span className="font-medium text-slate-700">
                  {input.gjennomsnittLonn.toLocaleString("nb-NO")} kr
                </span>
                <span>850 000</span>
              </div>
            </div>

            {/* NSF Kontekst - kun i avansert modus */}
            <AdvancedOnly showMoreText="Vis mangelsituasjon">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="text-sm font-medium text-slate-700 mb-2">Mangelsituasjon</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Nåværende mangel:</span>
                    <TallMedKilde
                      verdi={NSF_DATA.mangel.sykepleiereOgJordmodre.verdi.toLocaleString("nb-NO")}
                      kildeId="nav-mangel-2025"
                    />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Forventet 2040:</span>
                    <TallMedKilde
                      verdi={NSF_DATA.mangel.fremskriving2040.verdi.toLocaleString("nb-NO")}
                      kildeId="ssb-fremskriving-2040"
                    />
                  </div>
                </div>
              </div>
            </AdvancedOnly>
          </CardContent>
        </Card>
      </div>

      {/* Results panel */}
      <div className="col-span-8">
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Verdiskaping */}
          <Card className={cn(isPositive ? "bg-mint-50 border-mint-200" : "bg-coral-50 border-coral-200")}>
            <CardContent className="p-6">
              <div className={cn("flex items-center gap-2 mb-2", isPositive ? "text-mint-600" : "text-coral-600")}>
                <TrendingUp size={18} />
                <span className="text-sm font-medium">Verdiskaping</span>
                {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
              </div>
              <p className={cn("text-3xl font-bold", isPositive ? "text-mint-700" : "text-coral-700")} style={{ fontFamily: "var(--font-outfit)" }}>
                {isPositive ? "+" : ""}{formaterKroner(beregning.verdiskaping)}
              </p>
              <p className={cn("text-sm mt-1", isPositive ? "text-mint-600" : "text-coral-600")}>
                Total samfunnsøkonomisk effekt
              </p>
            </CardContent>
          </Card>

          {/* Skatteeffekt */}
          <Card className={cn(isPositive ? "bg-indigo-50 border-indigo-200" : "bg-slate-50 border-slate-200")}>
            <CardContent className="p-6">
              <div className={cn("flex items-center gap-2 mb-2", isPositive ? "text-indigo-600" : "text-slate-600")}>
                <Receipt size={18} />
                <span className="text-sm font-medium">Skattebidrag</span>
              </div>
              <p className={cn("text-3xl font-bold", isPositive ? "text-indigo-700" : "text-slate-700")} style={{ fontFamily: "var(--font-outfit)" }}>
                {isPositive ? "+" : ""}{formaterKroner(beregning.skatteeffekt)}
              </p>
              <p className={cn("text-sm mt-1", isPositive ? "text-indigo-600" : "text-slate-600")}>
                Økt/redusert skatteinntekt
              </p>
            </CardContent>
          </Card>

          {/* Frigjorte årsverk */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-slate-600 mb-2">
                <Users size={18} />
                <span className="text-sm font-medium">Sysselsettingseffekt</span>
              </div>
              <p className="text-3xl font-bold text-slate-800" style={{ fontFamily: "var(--font-outfit)" }}>
                {isPositive ? "+" : ""}{beregning.frigjorteArsverk.toFixed(1)} årsverk
              </p>
              <p className="text-sm text-slate-500 mt-1">
                Inkl. ringvirkninger i økonomien
              </p>
            </CardContent>
          </Card>

          {/* Vikarkostnad-endring */}
          <Card className={cn(beregning.vikarkostnadEndring < 0 ? "bg-mint-50 border-mint-200" : "bg-coral-50 border-coral-200")}>
            <CardContent className="p-6">
              <div className={cn("flex items-center gap-2 mb-2", beregning.vikarkostnadEndring < 0 ? "text-mint-600" : "text-coral-600")}>
                <Briefcase size={18} />
                <span className="text-sm font-medium">Vikarkostnad</span>
              </div>
              <p className={cn("text-3xl font-bold", beregning.vikarkostnadEndring < 0 ? "text-mint-700" : "text-coral-700")} style={{ fontFamily: "var(--font-outfit)" }}>
                {formaterKroner(beregning.vikarkostnadEndring)}
              </p>
              <p className={cn("text-sm mt-1", beregning.vikarkostnadEndring < 0 ? "text-mint-600" : "text-coral-600")}>
                {beregning.vikarkostnadEndring < 0 ? "Spart vikarbruk" : "Økt vikarbehov"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Argumentkort */}
        <Card className={cn(
          "bg-gradient-to-br border",
          isPositive ? "from-mint-50 to-slate-50 border-mint-200" : "from-coral-50 to-slate-50 border-coral-200"
        )}>
          <CardContent className="p-6">
            <h3 className={cn("font-semibold mb-3", isPositive ? "text-mint-800" : "text-coral-800")} style={{ fontFamily: "var(--font-outfit)" }}>
              {isPositive ? "Argument for oppbemanning" : "Konsekvenser av nedbemanning"}
            </h3>
            <p className="text-slate-700 leading-relaxed">
              {isPositive ? (
                <>
                  Ved å ansette <strong>{input.endringAntall} flere sykepleiere</strong> får vi
                  en verdiskaping på <strong>{formaterKroner(beregning.verdiskaping)}</strong>,
                  økt skattebidrag på <strong>{formaterKroner(beregning.skatteeffekt)}</strong>,
                  og sparer <strong>{formaterKroner(Math.abs(beregning.vikarkostnadEndring))}</strong> i vikarkostnader.
                  Samtidig reduserer vi gapet mot SSBs fremskrivning på 30 000 sykepleiere i 2040.
                </>
              ) : (
                <>
                  Ved å redusere med <strong>{Math.abs(input.endringAntall)} sykepleiere</strong> taper vi
                  en verdiskaping på <strong>{formaterKroner(Math.abs(beregning.verdiskaping))}</strong>,
                  redusert skattebidrag på <strong>{formaterKroner(Math.abs(beregning.skatteeffekt))}</strong>,
                  og får økte vikarkostnader på <strong>{formaterKroner(beregning.vikarkostnadEndring)}</strong>.
                </>
              )}
            </p>
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  );
}
