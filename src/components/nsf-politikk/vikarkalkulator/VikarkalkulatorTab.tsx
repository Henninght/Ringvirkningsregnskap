"use client";

import { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { HeroStat } from "@/components/ui/HeroStat";
import { AdvancedOnly } from "@/contexts/ViewModeContext";
import { TallMedKilde } from "@/components/kilde";
import { NSF_DATA, formaterKroner } from "@/lib/nsfData";
import { beregnVikarKost, DEFAULT_VIKAR_INPUT } from "@/lib/nsfCalculations";
import { VikarInput } from "@/types/nsf";
import { Calculator, TrendingDown, DollarSign, Percent } from "lucide-react";

export function VikarkalkulatorTab() {
  const [input, setInput] = useState<VikarInput>(DEFAULT_VIKAR_INPUT);

  const beregning = useMemo(() => beregnVikarKost(input), [input]);

  return (
    <div className="space-y-6">
      {/* Hero-seksjon med hovedresultat */}
      <HeroStat
        title="Mulig årlig besparelse"
        value={formaterKroner(beregning.besparelse)}
        description="Ved å erstatte vikarer med fast ansatte"
        secondaryValue={`${beregning.multiplikator.toFixed(1)}x`}
        secondaryDescription="dyrere med vikar"
        icon={<TrendingDown size={24} />}
        variant="mint"
      />

      <div className="grid grid-cols-12 gap-6">
      {/* Input panel */}
      <div className="col-span-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator size={18} className="text-petrol-500" />
              Vikarkostnader
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Vikartimer */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Vikartimer per måned
              </label>
              <input
                type="range"
                min={100}
                max={5000}
                step={50}
                value={input.vikartimer}
                onChange={(e) => setInput({ ...input, vikartimer: Number(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>100 timer</span>
                <span className="font-medium text-slate-700">
                  {input.vikartimer.toLocaleString("nb-NO")} timer
                </span>
                <span>5 000 timer</span>
              </div>
            </div>

            {/* Avanserte timepriser - kun i avansert modus */}
            <AdvancedOnly showMoreText="Vis timepriser">
              {/* Timepris vikar */}
              <div className="pt-4 border-t border-slate-100">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Timepris vikar (kr)
                </label>
                <input
                  type="number"
                  value={input.timeprisVikar}
                  onChange={(e) => setInput({ ...input, timeprisVikar: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Inkluderer byrå-påslag og overhead
                </p>
              </div>

              {/* Timepris fast */}
              <div className="pt-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Timepris fast ansatt (kr)
                </label>
                <input
                  type="number"
                  value={input.timeprisFast}
                  onChange={(e) => setInput({ ...input, timeprisFast: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>
            </AdvancedOnly>

            {/* Nasjonal kontekst - kun i avansert modus */}
            <AdvancedOnly showMoreText="Vis nasjonal kontekst">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="text-sm font-medium text-slate-700 mb-2">Nasjonal kontekst</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Total vikarbruk 2023:</span>
                    <TallMedKilde
                      verdi={formaterKroner(NSF_DATA.vikar.total2023.verdi)}
                      kildeId="nsf-vikar-firedoblet"
                    />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Økning siden 2012:</span>
                    <TallMedKilde
                      verdi={`${NSF_DATA.vikar.okningFaktor.verdi}x`}
                      kildeId="nsf-vikar-firedoblet"
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
          {/* Årlig vikarkost */}
          <Card className="bg-coral-50 border-coral-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-coral-600 mb-2">
                <DollarSign size={18} />
                <span className="text-sm font-medium">Årlig vikarkost</span>
              </div>
              <p className="text-3xl font-bold text-coral-700" style={{ fontFamily: "var(--font-outfit)" }}>
                {formaterKroner(beregning.arligVikarKost)}
              </p>
              <p className="text-sm text-coral-600 mt-1">
                {input.vikartimer.toLocaleString("nb-NO")} timer × 12 mnd × {input.timeprisVikar} kr
              </p>
            </CardContent>
          </Card>

          {/* Årlig kost fast ansatt */}
          <Card className="bg-mint-50 border-mint-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-mint-600 mb-2">
                <DollarSign size={18} />
                <span className="text-sm font-medium">Alternativ: Fast ansatt</span>
              </div>
              <p className="text-3xl font-bold text-mint-700" style={{ fontFamily: "var(--font-outfit)" }}>
                {formaterKroner(beregning.arligFastKost)}
              </p>
              <p className="text-sm text-mint-600 mt-1">
                {input.vikartimer.toLocaleString("nb-NO")} timer × 12 mnd × {input.timeprisFast} kr
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Besparelse */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-slate-600 mb-2">
                  <TrendingDown size={18} />
                  <span className="text-sm font-medium">Årlig besparelse ved fast ansettelse</span>
                </div>
                <p className="text-4xl font-bold text-petrol-600" style={{ fontFamily: "var(--font-outfit)" }}>
                  {formaterKroner(beregning.besparelse)}
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 text-slate-600 mb-2">
                  <Percent size={18} />
                  <span className="text-sm font-medium">Multiplikator</span>
                </div>
                <p className="text-4xl font-bold text-amber-600" style={{ fontFamily: "var(--font-outfit)" }}>
                  {beregning.multiplikator.toFixed(1)}x
                </p>
                <p className="text-sm text-slate-500">dyrere med vikar</p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-6">
              <div className="flex justify-between text-sm text-slate-600 mb-2">
                <span>Andel av nasjonale vikarkostnader</span>
                <span className="font-medium">{beregning.andelAvNasjonalt.toFixed(3)}%</span>
              </div>
              <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-petrol-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(beregning.andelAvNasjonalt * 10, 100)}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Argumentkort */}
        <Card className="bg-gradient-to-br from-petrol-50 to-slate-50 border-petrol-200">
          <CardContent className="p-6">
            <h3 className="font-semibold text-petrol-800 mb-3" style={{ fontFamily: "var(--font-outfit)" }}>
              Argument for beslutningstakere
            </h3>
            <p className="text-slate-700 leading-relaxed">
              Ved å erstatte {input.vikartimer.toLocaleString("nb-NO")} vikartimer per måned med faste stillinger,
              kan vi spare <strong>{formaterKroner(beregning.besparelse)}</strong> årlig.
              Vikarer koster {beregning.multiplikator.toFixed(1)} ganger mer enn fast ansatte.
              Nasjonalt bruker vi {formaterKroner(NSF_DATA.vikar.total2023.verdi)} på vikarer årlig –
              en femdobling siden 2012.
            </p>
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  );
}
