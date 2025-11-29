"use client";

import { useState, useMemo, useCallback } from "react";
import { SimulatorParametersBar } from "@/components/simulator/SimulatorParametersBar";
import { SimulatorResults } from "@/components/simulator/SimulatorResults";
import { SimulatorSankey } from "@/components/simulator/SimulatorSankey";
import { useViewMode } from "@/contexts/ViewModeContext";
import {
  RippleConfig,
  OrganizationInput,
  Scenario,
  DEFAULT_RIPPLE_CONFIG,
} from "@/types/ripple";
import {
  calculateTotalRipple,
  compareScenarios,
} from "@/lib/calculations";
import { ChevronDown, ChevronUp } from "lucide-react";

const DEFAULT_INPUT: OrganizationInput = {
  name: "NSF Organisasjon",
  employees: 1000,
  averageSalary: 580000,
  operatingResult: 50000000,
  localShare: 0.95,
  agencyShare: 0.15,
  fullTimeEquivalent: 0.75,
  turnoverRate: 0.12,
};

// Collapse state type
interface CollapseState {
  parameters: boolean;
  sankey: boolean;
  results: boolean;
}

export function RingvirkningerTab() {
  const [input, setInput] = useState<OrganizationInput>(DEFAULT_INPUT);
  const [config, setConfig] = useState<RippleConfig>(DEFAULT_RIPPLE_CONFIG);
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const { isAdvanced } = useViewMode();

  // Collapse state - all open as default
  const [collapsed, setCollapsed] = useState<CollapseState>({
    parameters: false,
    sankey: false,
    results: false,
  });

  const allCollapsed = collapsed.parameters && collapsed.sankey && collapsed.results;

  const toggleAll = useCallback(() => {
    const newState = !allCollapsed;
    setCollapsed({
      parameters: newState,
      sankey: newState,
      results: newState,
    });
  }, [allCollapsed]);

  const toggleSection = useCallback((section: keyof CollapseState) => {
    setCollapsed(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  }, []);

  const calculation = useMemo(() => {
    return calculateTotalRipple(input, config);
  }, [input, config]);

  const comparison = useMemo(() => {
    if (!selectedScenario) return null;
    return compareScenarios(input, selectedScenario, config);
  }, [input, selectedScenario, config]);

  const displayCalculation = comparison ? comparison.scenario : calculation;

  const handleInputChange = useCallback((newInput: OrganizationInput) => {
    setInput(newInput);
  }, []);

  const handleConfigChange = useCallback((newConfig: RippleConfig) => {
    setConfig(newConfig);
  }, []);

  return (
    <div className="space-y-4">
      {/* Kollaps/Ekspander alle-knapp */}
      <div className="flex justify-end">
        <button
          onClick={toggleAll}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors"
        >
          {allCollapsed ? (
            <>
              <ChevronDown size={14} />
              Ekspander alle
            </>
          ) : (
            <>
              <ChevronUp size={14} />
              Kollaps alle
            </>
          )}
        </button>
      </div>

      {/* Parameters Bar - Horizontal */}
      <SimulatorParametersBar
        input={input}
        config={config}
        onInputChange={handleInputChange}
        onConfigChange={handleConfigChange}
        onScenarioSelect={setSelectedScenario}
        selectedScenario={selectedScenario}
        isCollapsed={collapsed.parameters}
        onToggleCollapse={() => toggleSection("parameters")}
      />

      {/* Sankey Diagram - Full Width */}
      <SimulatorSankey
        calculation={displayCalculation}
        comparison={comparison}
        isCollapsed={collapsed.sankey}
        onToggleCollapse={() => toggleSection("sankey")}
      />

      {/* Results - Full Width */}
      <SimulatorResults
        calculation={displayCalculation}
        comparison={comparison}
        selectedScenario={selectedScenario}
        isCollapsed={collapsed.results}
        onToggleCollapse={() => toggleSection("results")}
      />
    </div>
  );
}
