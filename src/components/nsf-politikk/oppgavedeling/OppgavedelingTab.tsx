"use client";

import { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { HeroStat } from "@/components/ui/HeroStat";
import { AdvancedOnly } from "@/contexts/ViewModeContext";
import { TallMedKilde } from "@/components/kilde";
import { NSF_DATA } from "@/lib/nsfData";
import { beregnOppgavedeling, DEFAULT_OPPGAVEDELING_INPUT } from "@/lib/nsfCalculations";
import { OppgavedelingInput, OPPGAVETYPER } from "@/types/nsf";
import { GitBranch, Clock, Users, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export function OppgavedelingTab() {
  const [input, setInput] = useState<OppgavedelingInput>(DEFAULT_OPPGAVEDELING_INPUT);

  const beregning = useMemo(() => beregnOppgavedeling(input), [input]);

  const selectedOppgave = OPPGAVETYPER.find(o => o.id === input.oppgavetype);

  return (
    <div className="space-y-6">
      {/* Hero-seksjon */}
      <HeroStat
        title="Frigjort sykepleierkapasitet"
        value={`${beregning.frigjorteArsverk.toFixed(1)} årsverk`}
        description="Ved å flytte oppgaver til andre yrkesgrupper"
        secondaryValue={`${beregning.timerFrigjort.toLocaleString("nb-NO")} timer`}
        secondaryDescription="frigjort årlig"
        icon={<GitBranch size={24} />}
        variant="mint"
      />

      <div className="grid grid-cols-12 gap-6">
      {/* Input panel */}
      <div className="col-span-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch size={18} className="text-petrol-500" />
              Oppgavedeling
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Oppgavetype */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Type oppgave som flyttes
              </label>
              <div className="grid grid-cols-2 gap-2">
                {OPPGAVETYPER.map((oppgave) => (
                  <button
                    key={oppgave.id}
                    onClick={() => setInput({
                      ...input,
                      oppgavetype: oppgave.id,
                      timerPerUke: oppgave.typiskTimer
                    })}
                    className={cn(
                      "p-3 rounded-lg border text-left transition-all",
                      input.oppgavetype === oppgave.id
                        ? "bg-petrol-50 border-petrol-300 ring-2 ring-petrol-200"
                        : "bg-white border-slate-200 hover:border-petrol-200"
                    )}
                  >
                    <div className="text-sm font-medium text-slate-700">{oppgave.label}</div>
                    <div className="text-xs text-slate-500">{oppgave.typiskTimer} t/uke</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Timer per uke */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Timer per uke per sykepleier
              </label>
              <input
                type="range"
                min={1}
                max={15}
                step={0.5}
                value={input.timerPerUke}
                onChange={(e) => setInput({ ...input, timerPerUke: Number(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>1 time</span>
                <span className="font-medium text-slate-700">{input.timerPerUke} timer</span>
                <span>15 timer</span>
              </div>
            </div>

            {/* Antall sykepleiere */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Antall sykepleiere berørt
              </label>
              <input
                type="range"
                min={10}
                max={1000}
                step={10}
                value={input.antallSykepleiere}
                onChange={(e) => setInput({ ...input, antallSykepleiere: Number(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>10</span>
                <span className="font-medium text-slate-700">{input.antallSykepleiere}</span>
                <span>1 000</span>
              </div>
            </div>

            {/* NSF posisjon - kun i avansert modus */}
            <AdvancedOnly showMoreText="Vis NSFs posisjon">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="text-sm font-medium text-slate-700 mb-2">NSFs posisjon</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  "Oppgavedeling må skje med bevissthet, planlegging, system og tydelig faglig ledelse"
                </p>
                <TallMedKilde
                  verdi=""
                  kildeId="nsf-oppgavedeling"
                  className="mt-2"
                />
              </div>
            </AdvancedOnly>
          </CardContent>
        </Card>
      </div>

      {/* Results panel */}
      <div className="col-span-8">
        {/* Hovedresultater */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="bg-mint-50 border-mint-200">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-mint-100 flex items-center justify-center mx-auto mb-3">
                <Users size={24} className="text-mint-600" />
              </div>
              <p className="text-4xl font-bold text-mint-700" style={{ fontFamily: "var(--font-outfit)" }}>
                {beregning.frigjorteArsverk.toFixed(1)}
              </p>
              <p className="text-sm text-mint-600 mt-1">Frigjorte årsverk</p>
            </CardContent>
          </Card>

          <Card className="bg-indigo-50 border-indigo-200">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-3">
                <Clock size={24} className="text-indigo-600" />
              </div>
              <p className="text-4xl font-bold text-indigo-700" style={{ fontFamily: "var(--font-outfit)" }}>
                {beregning.timerFrigjort.toLocaleString("nb-NO")}
              </p>
              <p className="text-sm text-indigo-600 mt-1">Timer frigjort årlig</p>
            </CardContent>
          </Card>

          <Card className="bg-coral-50 border-coral-200">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-coral-100 flex items-center justify-center mx-auto mb-3">
                <Heart size={24} className="text-coral-600" />
              </div>
              <p className="text-4xl font-bold text-coral-700" style={{ fontFamily: "var(--font-outfit)" }}>
                {beregning.potensielleEkstrapasienter.toLocaleString("nb-NO")}
              </p>
              <p className="text-sm text-coral-600 mt-1">Flere pasienter/år</p>
            </CardContent>
          </Card>
        </div>

        {/* Visualisering */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-sm">Frigjort tid til kjerneoppgaver</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">{selectedOppgave?.label || "Oppgave"} (flyttes bort)</span>
                  <span className="font-medium text-slate-800">{input.timerPerUke} t/uke</span>
                </div>
                <div className="h-8 bg-slate-100 rounded-lg overflow-hidden">
                  <div
                    className="h-full bg-slate-400 rounded-lg flex items-center justify-end pr-2"
                    style={{ width: `${Math.min((input.timerPerUke / 40) * 100, 100)}%` }}
                  >
                    <span className="text-xs text-white font-medium">
                      {((input.timerPerUke / 40) * 100).toFixed(0)}% av arbeidstid
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center py-2">
                <div className="flex items-center gap-2 text-mint-600">
                  <span className="text-2xl">↓</span>
                  <span className="text-sm font-medium">Frigjøres til</span>
                  <span className="text-2xl">↓</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">Pleie og omsorg (kjerneoppgaver)</span>
                  <span className="font-medium text-mint-700">+{input.timerPerUke} t/uke</span>
                </div>
                <div className="h-8 bg-mint-100 rounded-lg overflow-hidden">
                  <div
                    className="h-full bg-mint-500 rounded-lg flex items-center justify-end pr-2 animate-pulse"
                    style={{ width: `${Math.min((input.timerPerUke / 40) * 100, 100)}%` }}
                  >
                    <span className="text-xs text-white font-medium">
                      Mer pasienttid
                    </span>
                  </div>
                </div>
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
              Ved å flytte <strong>{selectedOppgave?.label.toLowerCase()}</strong> til andre yrkesgrupper
              frigjør vi <strong>{beregning.frigjorteArsverk.toFixed(1)} årsverk</strong> sykepleierkapasitet
              ({beregning.timerFrigjort.toLocaleString("nb-NO")} timer/år).
              Dette tilsvarer kapasitet til å behandle <strong>{beregning.potensielleEkstrapasienter.toLocaleString("nb-NO")} flere pasienter</strong> årlig,
              uten å ansette flere sykepleiere.
            </p>
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  );
}
