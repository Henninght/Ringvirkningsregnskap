"use client";

import { useState } from "react";
import { X, HelpCircle, ArrowRight, Sliders, BarChart3, FileText } from "lucide-react";

interface GettingStartedGuideProps {
  className?: string;
}

export function GettingStartedGuide({ className }: GettingStartedGuideProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Trigger-knapp */}
      <button
        onClick={() => setIsOpen(true)}
        className={`flex items-center gap-2 px-3 py-1.5 text-sm text-slate-600 hover:text-petrol-600 hover:bg-petrol-50 rounded-lg transition-colors ${className}`}
        title="Kom i gang med ringvirkninger"
      >
        <HelpCircle size={16} />
        <span className="hidden sm:inline">Kom i gang</span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm animate-fade-in"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal content */}
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto animate-scale-in">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
              <h2
                className="text-xl font-semibold text-slate-800"
                style={{ fontFamily: "var(--font-outfit)" }}
              >
                Ringvirkningskalkulatoren
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-6 space-y-8">
              {/* Intro */}
              <div className="bg-gradient-to-br from-petrol-50 to-sage-50 rounded-xl p-5">
                <h3 className="font-semibold text-slate-800 mb-2">Hva er ringvirkninger?</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Ringvirkninger viser hvordan en organisasjon skaper verdi utover sin egen aktivitet.
                  Når ansatte får lønn, bruker de pengene lokalt. Når organisasjonen kjøper tjenester,
                  skaper det arbeidsplasser hos leverandører. Denne kalkulatoren beregner hele denne
                  samfunnsøkonomiske verdiskapingen.
                </p>
              </div>

              {/* Steps */}
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-800">Slik bruker du verktøyet</h3>

                <div className="grid gap-4">
                  {/* Step 1 */}
                  <div className="flex gap-4 p-4 bg-slate-50 rounded-xl">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-petrol-500 text-white flex items-center justify-center">
                      <Sliders size={18} />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-800 mb-1">1. Legg inn grunndata</h4>
                      <p className="text-sm text-slate-600">
                        Juster antall ansatte, gjennomsnittlig lønn og driftsresultat.
                        Bruk sliderne for å eksperimentere med ulike verdier.
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex gap-4 p-4 bg-slate-50 rounded-xl">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-sand-500 text-white flex items-center justify-center">
                      <BarChart3 size={18} />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-800 mb-1">2. Se beregningene</h4>
                      <p className="text-sm text-slate-600">
                        Diagrammet viser pengestrømmen: direkte effekter (lønn),
                        indirekte (leverandører) og induserte (forbruk i lokalsamfunnet).
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex gap-4 p-4 bg-slate-50 rounded-xl">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-lavender-500 text-white flex items-center justify-center">
                      <FileText size={18} />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-800 mb-1">3. Utforsk scenarier</h4>
                      <p className="text-sm text-slate-600">
                        Test «hva hvis»-scenarier som ansettelser eller lønnsøkninger.
                        Se hvordan endringer påvirker total verdiskaping.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Multiplier explanation */}
              <div className="border border-slate-200 rounded-xl p-5">
                <h3 className="font-semibold text-slate-800 mb-3">Forstå multiplikatorene</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <span className="w-3 h-3 rounded-full bg-petrol-500 mt-1 flex-shrink-0" />
                    <div>
                      <strong className="text-slate-700">Direkte effekt (100%)</strong>
                      <p className="text-slate-500">Lønn + driftsresultat - organisasjonens egen verdiskaping</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center text-slate-400">
                    <ArrowRight size={16} />
                    <span className="text-xs ml-2">× 0.5 (indirekte multiplikator)</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-3 h-3 rounded-full bg-sand-500 mt-1 flex-shrink-0" />
                    <div>
                      <strong className="text-slate-700">Indirekte effekt (50%)</strong>
                      <p className="text-slate-500">Verdiskaping hos leverandører og deres ansatte</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center text-slate-400">
                    <ArrowRight size={16} />
                    <span className="text-xs ml-2">× 0.3 (indusert multiplikator)</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-3 h-3 rounded-full bg-lavender-500 mt-1 flex-shrink-0" />
                    <div>
                      <strong className="text-slate-700">Indusert effekt (30%)</strong>
                      <p className="text-slate-500">Lokal handel og tjenester fra ansattes forbruk</p>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-petrol-50 rounded-lg">
                    <p className="text-petrol-700 font-medium">
                      Total multiplikator: 1.80x
                    </p>
                    <p className="text-petrol-600 text-xs mt-1">
                      Hver krone i direkte verdi skaper nesten to kroner i samfunnsøkonomisk verdi
                    </p>
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="text-sm text-slate-500">
                <strong className="text-slate-700">Tips:</strong> Aktiver «Avansert modus» øverst
                for å justere multiplikatorverdiene selv.
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t border-slate-100 px-6 py-4">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full px-4 py-2.5 bg-petrol-500 hover:bg-petrol-600 text-white font-medium rounded-lg transition-colors"
              >
                Kom i gang
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
