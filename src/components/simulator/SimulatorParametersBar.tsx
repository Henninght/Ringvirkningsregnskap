"use client";

import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { HelpTooltip } from "@/components/ui/Tooltip";
import {
  RippleConfig,
  OrganizationInput,
  Scenario,
  NSF_SCENARIOS,
  PRESET_SCENARIOS,
  DEFAULT_RIPPLE_CONFIG
} from "@/types/ripple";
import {
  Users,
  Banknote,
  UserMinus,
  Clock,
  ChevronDown,
  Sparkles,
  Settings2
} from "lucide-react";

interface SimulatorParametersBarProps {
  input: OrganizationInput;
  config: RippleConfig;
  onInputChange: (input: OrganizationInput) => void;
  onConfigChange: (config: RippleConfig) => void;
  onScenarioSelect: (scenario: Scenario | null) => void;
  selectedScenario: Scenario | null;
  /** Om kortet er kollapset */
  isCollapsed?: boolean;
  /** Callback for å toggle kollaps */
  onToggleCollapse?: () => void;
}

export function SimulatorParametersBar({
  input,
  config,
  onInputChange,
  onConfigChange,
  onScenarioSelect,
  selectedScenario,
  isCollapsed = false,
  onToggleCollapse,
}: SimulatorParametersBarProps) {
  const [scenarioDropdownOpen, setScenarioDropdownOpen] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const advancedRef = useRef<HTMLDivElement>(null);

  // Lukk dropdowns ved klikk utenfor
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setScenarioDropdownOpen(false);
      }
      if (advancedRef.current && !advancedRef.current.contains(event.target as Node)) {
        setAdvancedOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (field: keyof OrganizationInput, value: number) => {
    onInputChange({ ...input, [field]: value });
  };

  const handleConfigChange = (field: keyof RippleConfig, value: number) => {
    onConfigChange({ ...config, [field]: value });
  };

  const allScenarios = [...NSF_SCENARIOS, ...PRESET_SCENARIOS];

  return (
    <Card className="animate-slide-up">
      {/* Collapsible Header */}
      <button
        type="button"
        onClick={onToggleCollapse}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50/50 transition-colors border-b border-slate-100"
        aria-expanded={!isCollapsed}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-petrol-100 flex items-center justify-center">
            <Settings2 size={16} className="text-petrol-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800">Parametere</h3>
            <p className="text-xs text-slate-500">Juster grunndata og arbeidsforhold</p>
          </div>
        </div>
        <ChevronDown
          size={18}
          className={`text-slate-400 transition-transform duration-200 ${!isCollapsed ? "rotate-180" : ""}`}
        />
      </button>

      {/* Collapsible Content */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          !isCollapsed ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Grunndata */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700 border-b border-slate-100 pb-2">
              <Users size={14} className="text-petrol-500" />
              Grunndata
              <HelpTooltip
                content={
                  <div className="space-y-1">
                    <p className="font-medium">Organisasjonens grunndata</p>
                    <p className="text-slate-300 text-xs">Antall ansatte og lønnsnivå danner grunnlaget for beregningene.</p>
                  </div>
                }
              />
            </div>

            {/* Ansatte */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Ansatte</span>
                <span className="font-medium text-petrol-600">{input.employees.toLocaleString("nb-NO")}</span>
              </div>
              <input
                type="range"
                min={10}
                max={10000}
                step={10}
                value={input.employees}
                onChange={(e) => handleInputChange("employees", Number(e.target.value))}
                className="w-full h-1.5 accent-petrol-500"
              />
            </div>

            {/* Lønn */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Årslønn</span>
                <span className="font-medium text-petrol-600">{(input.averageSalary / 1000).toFixed(0)}k</span>
              </div>
              <input
                type="range"
                min={300000}
                max={1200000}
                step={10000}
                value={input.averageSalary}
                onChange={(e) => handleInputChange("averageSalary", Number(e.target.value))}
                className="w-full h-1.5 accent-petrol-500"
              />
            </div>
          </div>

          {/* Arbeidsforhold */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700 border-b border-slate-100 pb-2">
              <UserMinus size={14} className="text-sand-500" />
              Arbeidsforhold
              <HelpTooltip
                content={
                  <div className="space-y-1">
                    <p className="font-medium">Helsesektorspesifikke faktorer</p>
                    <p className="text-slate-300 text-xs">Vikarbruk og deltid påvirker hvor mye verdi som blir i lokalsamfunnet.</p>
                  </div>
                }
              />
            </div>

            {/* Vikarandel */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Vikarer</span>
                <span className="font-medium text-sand-600">{Math.round(input.agencyShare * 100)}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={50}
                step={1}
                value={input.agencyShare * 100}
                onChange={(e) => handleInputChange("agencyShare", Number(e.target.value) / 100)}
                className="w-full h-1.5 accent-sand-500"
              />
            </div>

            {/* Heltid */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Stillingsprosent</span>
                <span className="font-medium text-sage-600">{Math.round(input.fullTimeEquivalent * 100)}%</span>
              </div>
              <input
                type="range"
                min={50}
                max={100}
                step={1}
                value={input.fullTimeEquivalent * 100}
                onChange={(e) => handleInputChange("fullTimeEquivalent", Number(e.target.value) / 100)}
                className="w-full h-1.5 accent-sage-500"
              />
            </div>
          </div>

          {/* Scenario Dropdown */}
          <div className="space-y-3" ref={dropdownRef}>
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700 border-b border-slate-100 pb-2">
              <Sparkles size={14} className="text-lavender-500" />
              Scenario
              <HelpTooltip
                content={
                  <div className="space-y-1">
                    <p className="font-medium">Velg et scenario</p>
                    <p className="text-slate-300 text-xs">Scenariene justerer parametrene automatisk for å vise effekten av ulike tiltak.</p>
                  </div>
                }
              />
            </div>

            <div className="relative">
              <button
                onClick={() => setScenarioDropdownOpen(!scenarioDropdownOpen)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border text-sm transition-all ${
                  selectedScenario
                    ? "bg-lavender-50 border-lavender-300 text-lavender-700"
                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                <span className="truncate">
                  {selectedScenario ? selectedScenario.name : "Velg scenario..."}
                </span>
                <ChevronDown size={16} className={`shrink-0 transition-transform ${scenarioDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {scenarioDropdownOpen && (
                <div className="absolute z-50 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg max-h-64 overflow-auto">
                  {/* Nullstill */}
                  {selectedScenario && (
                    <button
                      onClick={() => {
                        onScenarioSelect(null);
                        setScenarioDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-slate-500 hover:bg-slate-50 border-b border-slate-100"
                    >
                      Nullstill scenario
                    </button>
                  )}

                  {/* NSF Scenarier */}
                  <div className="px-3 py-1.5 text-xs font-medium text-slate-400 bg-slate-50">
                    NSF-scenarier
                  </div>
                  {NSF_SCENARIOS.map((scenario) => (
                    <button
                      key={scenario.id}
                      onClick={() => {
                        onScenarioSelect(scenario);
                        setScenarioDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-lavender-50 transition-colors ${
                        selectedScenario?.id === scenario.id ? "bg-lavender-100 text-lavender-700" : "text-slate-700"
                      }`}
                    >
                      <div className="font-medium">{scenario.name}</div>
                      <div className="text-xs text-slate-400 truncate">{scenario.description}</div>
                    </button>
                  ))}

                  {/* Generiske Scenarier */}
                  <div className="px-3 py-1.5 text-xs font-medium text-slate-400 bg-slate-50">
                    Generiske scenarier
                  </div>
                  {PRESET_SCENARIOS.map((scenario) => (
                    <button
                      key={scenario.id}
                      onClick={() => {
                        onScenarioSelect(scenario);
                        setScenarioDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-50 transition-colors ${
                        selectedScenario?.id === scenario.id ? "bg-slate-100 text-slate-700" : "text-slate-600"
                      }`}
                    >
                      <div className="font-medium">{scenario.name}</div>
                      <div className="text-xs text-slate-400 truncate">{scenario.description}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Vis valgt scenario-info */}
            {selectedScenario && (
              <div className="text-xs text-lavender-600 bg-lavender-50 rounded-lg px-2 py-1.5 line-clamp-2">
                {selectedScenario.description}
              </div>
            )}
          </div>

          {/* Avansert Dropdown */}
          <div className="space-y-3" ref={advancedRef}>
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700 border-b border-slate-100 pb-2">
              <Settings2 size={14} className="text-slate-400" />
              Avansert
              <HelpTooltip
                content={
                  <div className="space-y-1">
                    <p className="font-medium">Avanserte innstillinger</p>
                    <p className="text-slate-300 text-xs">Multiplikatorer og andre beregningsparametere.</p>
                  </div>
                }
              />
            </div>

            <button
              onClick={() => setAdvancedOpen(!advancedOpen)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 hover:border-slate-300 transition-all"
            >
              <span>Juster parametere</span>
              <ChevronDown size={16} className={`transition-transform ${advancedOpen ? "rotate-180" : ""}`} />
            </button>

            {advancedOpen && (
              <div className="absolute z-50 mt-1 right-6 w-80 bg-white border border-slate-200 rounded-lg shadow-lg p-4 space-y-4">
                {/* Driftsresultat */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Driftsresultat (mill)</span>
                    <input
                      type="number"
                      value={Math.round(input.operatingResult / 1000000)}
                      onChange={(e) => handleInputChange("operatingResult", Number(e.target.value) * 1000000)}
                      className="w-20 text-right text-xs font-medium text-petrol-600 bg-slate-50 border border-slate-200 rounded px-2 py-1"
                    />
                  </div>
                </div>

                {/* Lokaliseringsandel */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Andel i Norge</span>
                    <span className="font-medium text-petrol-600">{Math.round(input.localShare * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={input.localShare * 100}
                    onChange={(e) => handleInputChange("localShare", Number(e.target.value) / 100)}
                    className="w-full h-1.5"
                  />
                </div>

                {/* Turnover */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Årlig turnover</span>
                    <span className="font-medium text-rose-500">{Math.round(input.turnoverRate * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={25}
                    step={1}
                    value={input.turnoverRate * 100}
                    onChange={(e) => handleInputChange("turnoverRate", Number(e.target.value) / 100)}
                    className="w-full h-1.5 accent-rose-400"
                  />
                </div>

                <div className="border-t border-slate-100 pt-3 space-y-3">
                  <div className="text-xs font-medium text-slate-500">Multiplikatorer</div>

                  {/* Indirekte */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Indirekte</span>
                      <span className="font-medium text-sage-600">{config.indirectMultiplier.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min={0.3}
                      max={0.8}
                      step={0.05}
                      value={config.indirectMultiplier}
                      onChange={(e) => handleConfigChange("indirectMultiplier", Number(e.target.value))}
                      className="w-full h-1.5"
                    />
                  </div>

                  {/* Indusert */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Indusert</span>
                      <span className="font-medium text-lavender-600">{config.inducedMultiplier.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min={0.2}
                      max={0.5}
                      step={0.05}
                      value={config.inducedMultiplier}
                      onChange={(e) => handleConfigChange("inducedMultiplier", Number(e.target.value))}
                      className="w-full h-1.5"
                    />
                  </div>
                </div>

                {/* Reset */}
                <button
                  onClick={() => onConfigChange(DEFAULT_RIPPLE_CONFIG)}
                  className="w-full text-xs text-slate-500 hover:text-slate-700 py-1"
                >
                  Tilbakestill til standard
                </button>
              </div>
            )}
          </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
