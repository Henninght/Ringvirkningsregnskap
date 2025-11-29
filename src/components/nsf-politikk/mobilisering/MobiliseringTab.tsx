"use client";

import { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { HeroStat } from "@/components/ui/HeroStat";
import { AdvancedOnly } from "@/contexts/ViewModeContext";
import { TallMedKilde } from "@/components/kilde";
import { NSF_DATA } from "@/lib/nsfData";
import { beregnMobilisering, DEFAULT_MOBILISERING_INPUT } from "@/lib/nsfCalculations";
import { MobiliseringInput, MOBILISERING_FORUTSETNINGER } from "@/types/nsf";
import { UserPlus, Users, Target, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobiliseringTab() {
  const [input, setInput] = useState<MobiliseringInput>(DEFAULT_MOBILISERING_INPUT);

  const beregning = useMemo(() => beregnMobilisering(input), [input]);

  const toggleForutsetning = (id: string) => {
    if (input.forutsetninger.includes(id)) {
      setInput({ ...input, forutsetninger: input.forutsetninger.filter(f => f !== id) });
    } else {
      setInput({ ...input, forutsetninger: [...input.forutsetninger, id] });
    }
  };

  const mangelprosent = (beregning.gjenvarendeMangel / beregning.opprinneligMangel) * 100;

  return (
    <div className="space-y-6">
      {/* Hero-seksjon */}
      <HeroStat
        title="Potensielle årsverk å mobilisere"
        value={beregning.potensielleArsverk.toLocaleString("nb-NO")}
        description="Sykepleiere utenfor helsesektoren som kan komme tilbake"
        secondaryValue={beregning.gjenvarendeMangel === 0 ? "Mangel dekket!" : `${beregning.gjenvarendeMangel.toLocaleString("nb-NO")} gjenstår`}
        secondaryDescription={beregning.gjenvarendeMangel === 0 ? "ved full mobilisering" : "av nåværende mangel"}
        icon={<UserPlus size={24} />}
        variant={beregning.gjenvarendeMangel === 0 ? "mint" : "sand"}
      />

      <div className="grid grid-cols-12 gap-6">
      {/* Input panel */}
      <div className="col-span-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus size={18} className="text-petrol-500" />
              Mobiliseringspotensial
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Nøkkeltall */}
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
              <div className="flex items-center gap-2 mb-2">
                <Users size={16} className="text-amber-600" />
                <span className="text-sm font-medium text-amber-800">Sykepleiere utenfor sektor</span>
              </div>
              <p className="text-3xl font-bold text-amber-700" style={{ fontFamily: "var(--font-outfit)" }}>
                <TallMedKilde
                  verdi={NSF_DATA.mangel.utenforSektor.verdi.toLocaleString("nb-NO")}
                  kildeId="ssb-utenfor-sektor"
                />
              </p>
              <p className="text-xs text-amber-600 mt-1">
                Jobber i andre næringer, men har sykepleierutdanning
              </p>
            </div>

            {/* Mobiliseringsandel */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Hvor mange % kan mobiliseres?
              </label>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={input.mobiliseringsAndel}
                onChange={(e) => setInput({ ...input, mobiliseringsAndel: Number(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>0%</span>
                <span className="text-lg font-bold text-petrol-600">{input.mobiliseringsAndel}%</span>
                <span>100%</span>
              </div>
            </div>

            {/* Forutsetninger - kun i avansert modus */}
            <AdvancedOnly showMoreText="Vis forutsetninger">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Forutsetninger for mobilisering
                </label>
                <div className="space-y-2">
                  {MOBILISERING_FORUTSETNINGER.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => toggleForutsetning(f.id)}
                      className={cn(
                        "w-full p-3 rounded-lg border text-left transition-all flex items-start gap-3",
                        input.forutsetninger.includes(f.id)
                          ? "bg-mint-50 border-mint-300"
                          : "bg-white border-slate-200 hover:border-slate-300"
                      )}
                    >
                      <div className={cn(
                        "w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5",
                        input.forutsetninger.includes(f.id)
                          ? "bg-mint-500 text-white"
                          : "bg-slate-100"
                      )}>
                        {input.forutsetninger.includes(f.id) && <CheckCircle size={14} />}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-700">{f.label}</div>
                        <div className="text-xs text-slate-500">{f.beskrivelse}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </AdvancedOnly>
          </CardContent>
        </Card>
      </div>

      {/* Results panel */}
      <div className="col-span-8">
        {/* Gap-visualisering */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Target size={16} />
              Reduksjon i sykepleiermangel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Før */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600">Nåværende mangel</span>
                  <span className="font-medium text-coral-600">
                    {beregning.opprinneligMangel.toLocaleString("nb-NO")} sykepleiere
                  </span>
                </div>
                <div className="h-10 bg-slate-100 rounded-lg overflow-hidden">
                  <div
                    className="h-full bg-coral-500 rounded-lg flex items-center px-3"
                    style={{ width: "100%" }}
                  >
                    <span className="text-sm text-white font-medium">100% gap</span>
                  </div>
                </div>
              </div>

              {/* Pil */}
              <div className="flex items-center justify-center">
                <div className="flex items-center gap-3 px-4 py-2 bg-mint-100 rounded-full">
                  <UserPlus size={18} className="text-mint-600" />
                  <span className="text-sm font-medium text-mint-700">
                    +{beregning.potensielleArsverk.toLocaleString("nb-NO")} mobilisert
                  </span>
                </div>
              </div>

              {/* Etter */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600">Gjenværende mangel</span>
                  <span className={cn(
                    "font-medium",
                    beregning.gjenvarendeMangel === 0 ? "text-mint-600" : "text-amber-600"
                  )}>
                    {beregning.gjenvarendeMangel.toLocaleString("nb-NO")} sykepleiere
                  </span>
                </div>
                <div className="h-10 bg-slate-100 rounded-lg overflow-hidden relative">
                  {beregning.gjenvarendeMangel > 0 ? (
                    <div
                      className="h-full bg-amber-500 rounded-lg flex items-center px-3 transition-all duration-500"
                      style={{ width: `${mangelprosent}%` }}
                    >
                      <span className="text-sm text-white font-medium">
                        {mangelprosent.toFixed(0)}% gjenstår
                      </span>
                    </div>
                  ) : (
                    <div className="h-full bg-mint-500 rounded-lg flex items-center justify-center">
                      <span className="text-sm text-white font-medium">Mangel dekket!</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistikk-kort */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="bg-petrol-50 border-petrol-200">
            <CardContent className="p-5 text-center">
              <p className="text-3xl font-bold text-petrol-700" style={{ fontFamily: "var(--font-outfit)" }}>
                {beregning.potensielleArsverk.toLocaleString("nb-NO")}
              </p>
              <p className="text-sm text-petrol-600 mt-1">Potensielle årsverk</p>
            </CardContent>
          </Card>

          <Card className="bg-mint-50 border-mint-200">
            <CardContent className="p-5 text-center">
              <p className="text-3xl font-bold text-mint-700" style={{ fontFamily: "var(--font-outfit)" }}>
                {beregning.redusertMangel.toLocaleString("nb-NO")}
              </p>
              <p className="text-sm text-mint-600 mt-1">Redusert mangel</p>
            </CardContent>
          </Card>

          <Card className={cn(
            beregning.gjenvarendeMangel === 0 ? "bg-mint-50 border-mint-200" : "bg-amber-50 border-amber-200"
          )}>
            <CardContent className="p-5 text-center">
              <p className={cn(
                "text-3xl font-bold",
                beregning.gjenvarendeMangel === 0 ? "text-mint-700" : "text-amber-700"
              )} style={{ fontFamily: "var(--font-outfit)" }}>
                {beregning.gjenvarendeMangel.toLocaleString("nb-NO")}
              </p>
              <p className={cn(
                "text-sm mt-1",
                beregning.gjenvarendeMangel === 0 ? "text-mint-600" : "text-amber-600"
              )}>
                Gjenværende mangel
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Argumentkort */}
        <Card className="bg-gradient-to-br from-petrol-50 to-slate-50 border-petrol-200">
          <CardContent className="p-6">
            <h3 className="font-semibold text-petrol-800 mb-3" style={{ fontFamily: "var(--font-outfit)" }}>
              17 000-argumentet
            </h3>
            <p className="text-slate-700 leading-relaxed mb-4">
              <strong>17 000 utdannede sykepleiere</strong> jobber i dag utenfor helsesektoren.
              Med riktige tiltak kan vi mobilisere <strong>{beregning.potensielleArsverk.toLocaleString("nb-NO")} av disse</strong> tilbake.
              {beregning.gjenvarendeMangel === 0 ? (
                <> Dette ville <strong>dekke hele den nåværende mangelen</strong>.</>
              ) : (
                <> Dette ville redusere mangelen fra {beregning.opprinneligMangel.toLocaleString("nb-NO")} til <strong>{beregning.gjenvarendeMangel.toLocaleString("nb-NO")}</strong>.</>
              )}
            </p>

            {input.forutsetninger.length > 0 && (
              <div className="border-t border-petrol-200 pt-4">
                <p className="text-sm text-slate-600 mb-2">Valgte forutsetninger:</p>
                <div className="flex flex-wrap gap-2">
                  {input.forutsetninger.map(f => {
                    const forutsetning = MOBILISERING_FORUTSETNINGER.find(x => x.id === f);
                    return (
                      <span key={f} className="px-2 py-1 bg-petrol-100 text-petrol-700 rounded text-xs">
                        {forutsetning?.label}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  );
}
