"use client";

import { useState, useCallback } from "react";
import { PolicyScenarioSelector } from "@/components/simulator/PolicyScenarioSelector";
import { ScenarioTimeline } from "@/components/simulator/ScenarioTimeline";
import { ScenarioComparison } from "@/components/simulator/ScenarioComparison";
import { PolicyScenario, InterventionScenario } from "@/types/policyScenario";
import { ChevronDown, ChevronUp } from "lucide-react";

// Collapse state type
interface CollapseState {
  policyScenario: boolean;
  timeline: boolean;
  comparison: boolean;
}

export function FremtidsscenarioTab() {
  // Policy scenario state
  const [selectedPolicyScenario, setSelectedPolicyScenario] = useState<PolicyScenario | null>(null);
  const [selectedIntervention, setSelectedIntervention] = useState<InterventionScenario | null>(null);

  // Collapse state - all open as default
  const [collapsed, setCollapsed] = useState<CollapseState>({
    policyScenario: false,
    timeline: false,
    comparison: false,
  });

  const allCollapsed = collapsed.policyScenario && collapsed.timeline && collapsed.comparison;

  const toggleAll = useCallback(() => {
    const newState = !allCollapsed;
    setCollapsed({
      policyScenario: newState,
      timeline: newState,
      comparison: newState,
    });
  }, [allCollapsed]);

  const toggleSection = useCallback((section: keyof CollapseState) => {
    setCollapsed(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  }, []);

  return (
    <div className="space-y-4">
      {/* Collapse/Expand all button */}
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

      {/* Policy Scenario Selector */}
      <PolicyScenarioSelector
        selectedScenario={selectedPolicyScenario}
        selectedIntervention={selectedIntervention}
        onScenarioSelect={setSelectedPolicyScenario}
        onInterventionSelect={setSelectedIntervention}
        isCollapsed={collapsed.policyScenario}
        onToggleCollapse={() => toggleSection("policyScenario")}
      />

      {/* Policy Scenario Visualizations - shown only when policy scenario is selected */}
      {selectedPolicyScenario && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ScenarioTimeline
            scenario={selectedPolicyScenario}
            selectedIntervention={selectedIntervention}
            isCollapsed={collapsed.timeline}
            onToggleCollapse={() => toggleSection("timeline")}
          />
          <ScenarioComparison
            scenario={selectedPolicyScenario}
            selectedIntervention={selectedIntervention}
            isCollapsed={collapsed.comparison}
            onToggleCollapse={() => toggleSection("comparison")}
          />
        </div>
      )}
    </div>
  );
}
