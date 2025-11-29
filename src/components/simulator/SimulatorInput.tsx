"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { HelpTooltip } from "@/components/ui/Tooltip";
import { AdvancedOnly, useViewMode } from "@/contexts/ViewModeContext";
import { RippleConfig, OrganizationInput, Scenario, PRESET_SCENARIOS, NSF_SCENARIOS, DEFAULT_RIPPLE_CONFIG } from "@/types/ripple";
import { Users, Banknote, TrendingUp, Settings2, Percent, Building2, UserMinus, Clock, RefreshCcw, Lightbulb, FlaskConical, Sparkles, ChevronDown, ChevronUp } from "lucide-react";

interface SimulatorInputProps {
  input: OrganizationInput;
  config: RippleConfig;
  onInputChange: (input: OrganizationInput) => void;
  onConfigChange: (config: RippleConfig) => void;
  onScenarioSelect: (scenario: Scenario | null) => void;
  selectedScenario: Scenario | null;
}

// Prioritert rekkefølge av scenarier - de viktigste først
const PRIORITY_SCENARIO_IDS = ["sykepleierløftet", "reduser-vikarer", "heltidskultur"];

export function SimulatorInput({
  input,
  config,
  onInputChange,
  onConfigChange,
  onScenarioSelect,
  selectedScenario,
}: SimulatorInputProps) {
  const { isAdvanced } = useViewMode();
  const [showAllScenarios, setShowAllScenarios] = useState(false);

  // Sorter scenarier: prioriterte først, deretter resten
  const prioritizedScenarios = NSF_SCENARIOS.filter(s => PRIORITY_SCENARIO_IDS.includes(s.id));
  const otherScenarios = NSF_SCENARIOS.filter(s => !PRIORITY_SCENARIO_IDS.includes(s.id));

  // Hvis et scenario som ikke er i prioritert liste er valgt, vis alle
  const shouldShowAll = showAllScenarios || (selectedScenario && !PRIORITY_SCENARIO_IDS.includes(selectedScenario.id));
  const visibleScenarios = shouldShowAll ? NSF_SCENARIOS : prioritizedScenarios;

  const handleInputChange = (field: keyof OrganizationInput, value: number) => {
    onInputChange({ ...input, [field]: value });
  };

  const handleConfigChange = (field: keyof RippleConfig, value: number) => {
    onConfigChange({ ...config, [field]: value });
  };

  return (
    <div className="space-y-4">
      {/* Quick Start - Scenario Selection (promoted to top) */}
      <Card className="animate-slide-up border-petrol-200 bg-gradient-to-br from-petrol-50/50 to-white">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-petrol-700">
            <Sparkles size={18} className="text-petrol-500" />
            Hurtigstart: Velg scenario
            <HelpTooltip
              content={
                <div className="space-y-1.5">
                  <p className="font-medium">Forhåndsdefinerte scenarier</p>
                  <p className="text-slate-300">Velg et scenario for å se hvordan ulike tiltak påvirker ringvirkningene.</p>
                  <p className="text-slate-400 text-[11px]">Scenariet justerer parametrene automatisk og viser endringene i sanntid.</p>
                </div>
              }
            />
          </CardTitle>
          <p className="text-xs text-slate-500 mt-1">Velg et scenario for å se effekten av ulike tiltak</p>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="space-y-2">
            {visibleScenarios.map((scenario) => (
              <button
                key={scenario.id}
                onClick={() => onScenarioSelect(selectedScenario?.id === scenario.id ? null : scenario)}
                className={`w-full text-left px-3 py-2.5 rounded-xl border transition-all duration-200 ${
                  selectedScenario?.id === scenario.id
                    ? "bg-petrol-100 border-petrol-300 ring-2 ring-petrol-500/20"
                    : "bg-white border-slate-200 hover:border-petrol-200 hover:bg-petrol-50/50"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-medium text-sm text-slate-800 truncate">{scenario.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5 line-clamp-1">{scenario.description}</div>
                  </div>
                  {selectedScenario?.id === scenario.id && (
                    <span className="shrink-0 text-xs bg-petrol-500 text-white px-2 py-0.5 rounded-full">Aktiv</span>
                  )}
                </div>
              </button>
            ))}

            {/* Vis flere / Vis faerre knapp */}
            {otherScenarios.length > 0 && (
              <button
                onClick={() => setShowAllScenarios(!shouldShowAll)}
                className="w-full flex items-center justify-center gap-1 px-3 py-2 text-xs text-slate-500 hover:text-petrol-600 hover:bg-slate-50 rounded-lg transition-colors"
              >
                {shouldShowAll ? (
                  <>
                    <ChevronUp size={14} />
                    Vis faerre scenarier
                  </>
                ) : (
                  <>
                    <ChevronDown size={14} />
                    Vis {otherScenarios.length} flere scenarier
                  </>
                )}
              </button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Grunndata - with step indicator */}
      <Card className="animate-slide-up" style={{ animationDelay: "0.05s" }}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Building2 size={18} className="text-petrol-500" />
              Grunndata
              <HelpTooltip
                content={
                  <div className="space-y-1.5">
                    <p className="font-medium">Organisasjonens grunndata</p>
                    <p className="text-slate-300">Disse verdiene danner grunnlaget for alle beregninger.</p>
                    <p className="text-slate-400 text-[11px]">Juster sliderne for å se hvordan endringer påvirker ringvirkningene.</p>
                  </div>
                }
              />
            </CardTitle>
            <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-full">Steg 1</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Juster antall ansatte og lønnsnivå</p>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Antall ansatte */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Users size={14} className="text-slate-400" />
                Antall ansatte
                <HelpTooltip
                  content={
                    <div className="space-y-1.5">
                      <p className="font-medium">Antall ansatte</p>
                      <p className="text-slate-300">Totalt antall ansatte påvirker direkte verdiskaping gjennom lønn.</p>
                      <p className="text-slate-400 text-[11px]">Eks: 1000 ansatte × 650 000 kr = 650 mill</p>
                    </div>
                  }
                />
              </label>
              <span className="text-sm font-semibold text-petrol-600">
                {input.employees.toLocaleString("nb-NO")}
              </span>
            </div>
            <input
              type="range"
              min={10}
              max={10000}
              step={10}
              value={input.employees}
              onChange={(e) => handleInputChange("employees", Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-400">
              <span>10</span>
              <span>10 000</span>
            </div>
          </div>

          {/* Gjennomsnittlig lønn */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Banknote size={14} className="text-slate-400" />
                Gjennomsnittlig årslønn
                <HelpTooltip
                  content={
                    <div className="space-y-1.5">
                      <p className="font-medium">Gjennomsnittlig årslønn</p>
                      <p className="text-slate-300">Bruttolønn per ansatt inkl. feriepenger og tillegg.</p>
                      <p className="text-slate-400 text-[11px]">Sykepleiersnitt: ~620 000 kr/år</p>
                    </div>
                  }
                />
              </label>
              <span className="text-sm font-semibold text-petrol-600">
                {input.averageSalary.toLocaleString("nb-NO")} kr
              </span>
            </div>
            <input
              type="range"
              min={300000}
              max={1200000}
              step={10000}
              value={input.averageSalary}
              onChange={(e) => handleInputChange("averageSalary", Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-400">
              <span>300 000</span>
              <span>1 200 000</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* NSF-spesifikke faktorer - with step indicator */}
      <Card className="animate-slide-up border-petrol-200 bg-gradient-to-br from-petrol-50/30 to-white" style={{ animationDelay: "0.1s" }}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <UserMinus size={16} className="text-petrol-500" />
              Arbeidsforhold
              <HelpTooltip
                content={
                  <div className="space-y-1.5">
                    <p className="font-medium">NSF-spesifikke faktorer</p>
                    <p className="text-slate-300">Parametere som er spesielt relevante for helsesektoren.</p>
                    <p className="text-slate-400 text-[11px]">Vikarbruk og deltidsandel påvirker hvor mye verdi som forblir i lokalsamfunnet.</p>
                  </div>
                }
              />
            </CardTitle>
            <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-full">Steg 2</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Juster helsesektorspesifikke parametere</p>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Vikarandel */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <UserMinus size={14} className="text-sand-500" />
                Vikarandel
                <HelpTooltip
                  content={
                    <div className="space-y-1.5">
                      <p className="font-medium">Vikarandel</p>
                      <p className="text-slate-300">Andel av arbeidsstyrken som er vikarer/innleide.</p>
                      <p className="text-slate-400 text-[11px]">Vikarer koster 2.5× fast ansatt, men kun 30% blir igjen lokalt.</p>
                      <p className="text-amber-400 text-[11px]">Høy vikarandel = verdi lekker ut til byråer</p>
                    </div>
                  }
                />
              </label>
              <span className="text-sm font-semibold text-sand-600">
                {Math.round(input.agencyShare * 100)}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={50}
              step={1}
              value={input.agencyShare * 100}
              onChange={(e) => handleInputChange("agencyShare", Number(e.target.value) / 100)}
              className="w-full accent-sand-500"
            />
            <div className="flex justify-between text-xs text-slate-400">
              <span>0%</span>
              <span>50%</span>
            </div>
          </div>

          {/* Heltidsandel */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Clock size={14} className="text-sage-500" />
                Gjennomsnittlig stillingsprosent
                <HelpTooltip
                  content={
                    <div className="space-y-1.5">
                      <p className="font-medium">Stillingsandel</p>
                      <p className="text-slate-300">Gjennomsnittlig stillingsprosent for ansatte.</p>
                      <p className="text-slate-400 text-[11px]">Sykepleiersnitt: ~75% (mye deltid)</p>
                      <p className="text-emerald-400 text-[11px]">Høyere heltid = mer effektiv verdiskaping</p>
                    </div>
                  }
                />
              </label>
              <span className="text-sm font-semibold text-sage-600">
                {Math.round(input.fullTimeEquivalent * 100)}%
              </span>
            </div>
            <input
              type="range"
              min={50}
              max={100}
              step={1}
              value={input.fullTimeEquivalent * 100}
              onChange={(e) => handleInputChange("fullTimeEquivalent", Number(e.target.value) / 100)}
              className="w-full accent-sage-500"
            />
            <div className="flex justify-between text-xs text-slate-400">
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
        </CardContent>
      </Card>


      {/* Avanserte grunndata - skjulte felt */}
      <AdvancedOnly showMoreText="Vis avanserte parametere">
        <Card className="animate-slide-up" style={{ animationDelay: "0.12s" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-slate-600">
              <FlaskConical size={16} className="text-slate-400" />
              Avanserte parametere
              <HelpTooltip
                content={
                  <div className="space-y-1.5">
                    <p className="font-medium">Avanserte innstillinger</p>
                    <p className="text-slate-300">Disse parametrene gir mer kontroll over beregningene.</p>
                    <p className="text-slate-400 text-[11px]">For de fleste brukstilfeller er standardverdiene tilstrekkelige.</p>
                  </div>
                }
              />
            </CardTitle>
            <p className="text-xs text-slate-500 mt-1">Tilleggsparametere for detaljert kontroll</p>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Driftsresultat */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <TrendingUp size={14} className="text-slate-400" />
                  Driftsresultat (mill NOK)
                </label>
                <input
                  type="number"
                  value={Math.round(input.operatingResult / 1000000)}
                  onChange={(e) => handleInputChange("operatingResult", Number(e.target.value) * 1000000)}
                  className="w-24 text-right text-sm font-semibold text-petrol-600 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-petrol-500/20 focus:border-petrol-500"
                />
              </div>
            </div>

            {/* Lokaliseringsandel */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Percent size={14} className="text-slate-400" />
                  Andel i Norge
                </label>
                <span className="text-sm font-semibold text-petrol-600">
                  {Math.round(input.localShare * 100)}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={input.localShare * 100}
                onChange={(e) => handleInputChange("localShare", Number(e.target.value) / 100)}
                className="w-full"
              />
            </div>

            {/* Turnover */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <RefreshCcw size={14} className="text-rose-400" />
                  Årlig turnover
                  <HelpTooltip
                    content={
                      <div className="space-y-1.5">
                        <p className="font-medium">Turnover-rate</p>
                        <p className="text-slate-300">Andel ansatte som slutter hvert år.</p>
                        <p className="text-slate-400 text-[11px]">Rekrutteringskost: ~1.5× årslønn per som slutter</p>
                        <p className="text-rose-400 text-[11px]">Høy turnover = tapt kompetanse og høye rekrutteringskostnader</p>
                      </div>
                    }
                  />
                </label>
                <span className="text-sm font-semibold text-rose-500">
                  {Math.round(input.turnoverRate * 100)}%
                </span>
              </div>
              <input
                type="range"
                min={5}
                max={25}
                step={1}
                value={input.turnoverRate * 100}
                onChange={(e) => handleInputChange("turnoverRate", Number(e.target.value) / 100)}
                className="w-full accent-rose-400"
              />
              <div className="flex justify-between text-xs text-slate-400">
                <span>5%</span>
                <span>25%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </AdvancedOnly>

      {/* Generiske scenarier - i avansert modus */}
      <AdvancedOnly showMoreText="Vis flere scenarier">
        <Card className="animate-slide-up" style={{ animationDelay: "0.15s" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-slate-600">
              <Lightbulb size={16} className="text-slate-400" />
              Generiske scenarier
              <HelpTooltip
                content={
                  <div className="space-y-1.5">
                    <p className="font-medium">Alternative scenarier</p>
                    <p className="text-slate-300">Generelle scenarier som kan brukes på tvers av organisasjonstyper.</p>
                    <p className="text-slate-400 text-[11px]">Disse scenariene er ikke spesifikke for helsesektoren.</p>
                  </div>
                }
              />
            </CardTitle>
            <p className="text-xs text-slate-500 mt-1">Utforsk andre scenariotyper</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-2">
              {PRESET_SCENARIOS.map((scenario) => (
                <button
                  key={scenario.id}
                  onClick={() => onScenarioSelect(selectedScenario?.id === scenario.id ? null : scenario)}
                  className={`text-left px-4 py-3 rounded-xl border transition-all duration-200 ${
                    selectedScenario?.id === scenario.id
                      ? "bg-slate-100 border-slate-300 ring-2 ring-slate-500/20"
                      : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div className="font-medium text-sm text-slate-700">{scenario.name}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{scenario.description}</div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </AdvancedOnly>

      {/* Avanserte innstillinger - kun i avansert modus */}
      <AdvancedOnly showMoreText="Juster multiplikatorer">
        <Card className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-slate-600">
              <Settings2 size={16} className="text-slate-400" />
              Multiplikatorer
              <HelpTooltip
                content={
                  <div className="space-y-1.5">
                    <p className="font-medium">Beregningsparametre</p>
                    <p className="text-slate-300">Multiplikatorer bestemmer hvor mye indirekte og indusert effekt som genereres per krone direkte effekt.</p>
                    <p className="text-slate-400 text-[11px]">Standardverdiene er basert på SSB-data. Juster kun hvis du har spesifikke kilder.</p>
                  </div>
                }
              />
            </CardTitle>
            <p className="text-xs text-slate-500 mt-1">Finjuster beregningsparameterne</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Indirekte multiplikator */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm text-slate-600 flex items-center gap-1">
                  Indirekte multiplikator
                  <HelpTooltip
                    content={
                      <div className="space-y-2">
                        <p className="font-medium">Indirekte multiplikator</p>
                        <p className="text-slate-300">Måler verdiskaping i leverandørkjeden per krone direkte effekt.</p>
                        <div className="bg-slate-700/50 p-2 rounded text-[11px]">
                          <strong>Eksempel:</strong> 0.5 betyr at 100 mill direkte → 50 mill hos leverandører
                        </div>
                        <p className="text-slate-400 text-[11px]">Kilde: SSB input-output-analyser</p>
                      </div>
                    }
                  />
                </label>
                <span className="text-sm font-medium text-sage-600">
                  {config.indirectMultiplier.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min={0.3}
                max={0.8}
                step={0.05}
                value={config.indirectMultiplier}
                onChange={(e) => handleConfigChange("indirectMultiplier", Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-400">
                <span>0.30</span>
                <span>0.80</span>
              </div>
            </div>

            {/* Indusert multiplikator */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm text-slate-600 flex items-center gap-1">
                  Indusert multiplikator
                  <HelpTooltip
                    content={
                      <div className="space-y-2">
                        <p className="font-medium">Indusert multiplikator</p>
                        <p className="text-slate-300">Forbrukseffekten - verdiskaping fra ansattes kjøpekraft i lokalsamfunnet.</p>
                        <div className="bg-slate-700/50 p-2 rounded text-[11px]">
                          <strong>Eksempel:</strong> 0.3 betyr at 100 mill direkte → 30 mill i lokal handel/tjenester
                        </div>
                        <p className="text-slate-400 text-[11px]">Kilde: SSB konsum-analyser</p>
                      </div>
                    }
                  />
                </label>
                <span className="text-sm font-medium text-indigo-500">
                  {config.inducedMultiplier.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min={0.2}
                max={0.5}
                step={0.05}
                value={config.inducedMultiplier}
                onChange={(e) => handleConfigChange("inducedMultiplier", Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-400">
                <span>0.20</span>
                <span>0.50</span>
              </div>
            </div>

            {/* Lokal retention */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm text-slate-600 flex items-center gap-1">
                  Lokal retention rate
                  <HelpTooltip
                    content={
                      <div className="space-y-2">
                        <p className="font-medium">Lokal retention rate</p>
                        <p className="text-slate-300">Andel av forbruk som forblir i lokalsamfunnet (ikke «lekker» ut).</p>
                        <div className="bg-slate-700/50 p-2 rounded text-[11px]">
                          <strong>70%</strong> = Typisk for norske kommuner med variert næringsliv
                        </div>
                        <p className="text-slate-400 text-[11px]">Høyere i byer, lavere i grisgrendte strøk</p>
                      </div>
                    }
                  />
                </label>
                <span className="text-sm font-medium text-sand-600">
                  {(config.localRetentionRate * 100).toFixed(0)}%
                </span>
              </div>
              <input
                type="range"
                min={0.5}
                max={0.9}
                step={0.05}
                value={config.localRetentionRate}
                onChange={(e) => handleConfigChange("localRetentionRate", Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-400">
                <span>50%</span>
                <span>90%</span>
              </div>
            </div>

            {/* Reset-knapp */}
            <button
              onClick={() => onConfigChange(DEFAULT_RIPPLE_CONFIG)}
              className="w-full mt-2 px-4 py-2 text-sm text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Tilbakestill til standard
            </button>
          </CardContent>
        </Card>
      </AdvancedOnly>
    </div>
  );
}
