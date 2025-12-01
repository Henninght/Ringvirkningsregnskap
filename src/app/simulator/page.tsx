"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { SimulatorInput } from "@/components/simulator/SimulatorInput";
import { SimulatorResults } from "@/components/simulator/SimulatorResults";
import { SimulatorSankey } from "@/components/simulator/SimulatorSankey";
import { SimulatorHistory } from "@/components/simulator/SimulatorHistory";
import { SimulatorToolbar, KeyboardShortcutsModal } from "@/components/simulator/SimulatorToolbar";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { useToast } from "@/components/ui/Toast";
import { useSimulatorHistory, SimulatorSnapshot } from "@/hooks/useSimulatorHistory";
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
import { Calculator, ArrowLeft, Save, CheckCircle } from "lucide-react";
import Link from "next/link";
import { ViewModeProvider } from "@/contexts/ViewModeContext";

// Standard utgangsverdier
const DEFAULT_INPUT: OrganizationInput = {
  name: "Organisasjon",
  employees: 1000,
  averageSalary: 650000,
  operatingResult: 50000000, // 50 mill
  localShare: 0.95,
  agencyShare: 0.05, // 5% vikarandel
  fullTimeEquivalent: 0.85, // 85% gjennomsnittlig stillingsprosent
  turnoverRate: 0.12, // 12% årlig turnover
};

function SimulatorContent() {
  // Toast notifications
  const { showToast } = useToast();

  // State for input-verdier
  const [input, setInput] = useState<OrganizationInput>(DEFAULT_INPUT);
  const [config, setConfig] = useState<RippleConfig>(DEFAULT_RIPPLE_CONFIG);
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);

  // UI state
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [saveNotification, setSaveNotification] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // History management
  const {
    snapshots,
    saveSnapshot,
    deleteSnapshot,
    renameSnapshot,
    clearHistory,
    pushToUndo,
    undo,
    redo,
    canUndo,
    canRedo,
    setComparisonPair,
    comparisonSnapshots,
    comparisonData,
  } = useSimulatorHistory();

  // Beregn ringvirkninger live
  const calculation = useMemo(() => {
    return calculateTotalRipple(input, config);
  }, [input, config]);

  // Beregn scenario-sammenligning hvis et scenario er valgt
  const comparison = useMemo(() => {
    if (!selectedScenario) return null;
    return compareScenarios(input, selectedScenario, config);
  }, [input, selectedScenario, config]);

  // Beregningen som skal vises (scenario hvis valgt, ellers baseline)
  const displayCalculation = comparison ? comparison.scenario : calculation;

  // Track changes for unsaved state
  useEffect(() => {
    setHasUnsavedChanges(true);
  }, [input, config, selectedScenario]);

  // Handle input changes with undo support
  const handleInputChange = useCallback((newInput: OrganizationInput) => {
    pushToUndo({
      id: `undo-${Date.now()}`,
      timestamp: new Date(),
      name: "Forrige tilstand",
      input,
      config,
      scenario: selectedScenario,
      calculation,
    });
    setInput(newInput);
  }, [input, config, selectedScenario, calculation, pushToUndo]);

  // Handle config changes with undo support
  const handleConfigChange = useCallback((newConfig: RippleConfig) => {
    pushToUndo({
      id: `undo-${Date.now()}`,
      timestamp: new Date(),
      name: "Forrige tilstand",
      input,
      config,
      scenario: selectedScenario,
      calculation,
    });
    setConfig(newConfig);
  }, [input, config, selectedScenario, calculation, pushToUndo]);

  // Save current calculation
  const handleSave = useCallback(() => {
    const scenarioName = selectedScenario ? ` (${selectedScenario.name})` : "";
    const name = `Beregning${scenarioName}`;
    saveSnapshot(input, config, selectedScenario, displayCalculation, name);
    setHasUnsavedChanges(false);
    setSaveNotification(true);
    showToast("Beregning lagret i historikk", "success");
    setTimeout(() => setSaveNotification(false), 2000);
  }, [input, config, selectedScenario, displayCalculation, saveSnapshot, showToast]);

  // Undo action
  const handleUndo = useCallback(() => {
    const previousState = undo();
    if (previousState) {
      setInput(previousState.input);
      setConfig(previousState.config);
      setSelectedScenario(previousState.scenario);
    }
  }, [undo]);

  // Redo action
  const handleRedo = useCallback(() => {
    const nextState = redo();
    if (nextState) {
      setInput(nextState.input);
      setConfig(nextState.config);
      setSelectedScenario(nextState.scenario);
    }
  }, [redo]);

  // Reset to defaults
  const handleReset = useCallback(() => {
    setInput(DEFAULT_INPUT);
    setConfig(DEFAULT_RIPPLE_CONFIG);
    setSelectedScenario(null);
    setShowResetDialog(false);
    setHasUnsavedChanges(false);
    showToast("Alle verdier tilbakestilt", "info");
  }, [showToast]);

  // Export results
  const handleExport = useCallback(() => {
    try {
      const data = {
        timestamp: new Date().toISOString(),
        input,
        config,
        scenario: selectedScenario,
        results: displayCalculation,
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ringvirkninger-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast("Beregning eksportert som JSON", "success");
    } catch (error) {
      showToast("Kunne ikke eksportere beregning", "error");
    }
  }, [input, config, selectedScenario, displayCalculation, showToast]);

  // Restore from history
  const handleRestoreSnapshot = useCallback((snapshot: SimulatorSnapshot) => {
    pushToUndo({
      id: `undo-${Date.now()}`,
      timestamp: new Date(),
      name: "Forrige tilstand",
      input,
      config,
      scenario: selectedScenario,
      calculation,
    });
    setInput(snapshot.input);
    setConfig(snapshot.config);
    setSelectedScenario(snapshot.scenario);
  }, [input, config, selectedScenario, calculation, pushToUndo]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for modifier key
      const isMod = e.ctrlKey || e.metaKey;

      if (isMod && e.key === "z") {
        e.preventDefault();
        handleUndo();
      } else if (isMod && e.key === "y") {
        e.preventDefault();
        handleRedo();
      } else if (isMod && e.key === "s") {
        e.preventDefault();
        handleSave();
      } else if (isMod && e.key === "e") {
        e.preventDefault();
        handleExport();
      } else if (isMod && e.key === "r") {
        e.preventDefault();
        setShowResetDialog(true);
      } else if (e.key === "Escape") {
        setShowHelpModal(false);
        setShowResetDialog(false);
      } else if (e.key === "?") {
        setShowHelpModal(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleUndo, handleRedo, handleSave, handleExport]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      {/* Main Content */}
      <main className="ml-[72px] min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-slate-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link
                  href="/"
                  className="flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors"
                >
                  <ArrowLeft size={18} />
                  <span className="text-sm">Dashboard</span>
                </Link>
                <div className="h-6 w-px bg-slate-200" />
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-mint-400 to-teal-500 flex items-center justify-center">
                    <Calculator size={20} className="text-white" />
                  </div>
                  <div>
                    <h1
                      className="text-xl font-semibold text-slate-800"
                      style={{ fontFamily: "var(--font-outfit)" }}
                    >
                      Ringvirkningssimulator
                    </h1>
                    <p className="text-sm text-slate-500">
                      Utforsk hvordan endringer pavirker samfunnsokonomien
                    </p>
                  </div>
                </div>
              </div>

              {/* Toolbar and Quick stats */}
              <div className="flex items-center gap-6">
                {/* Save notification */}
                {saveNotification && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-mint-100 text-mint-700 rounded-lg text-sm animate-fade-in">
                    <CheckCircle size={16} />
                    Lagret!
                  </div>
                )}

                {/* Unsaved changes indicator */}
                {hasUnsavedChanges && !saveNotification && (
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    Ulagrede endringer
                  </div>
                )}

                <SimulatorToolbar
                  onSave={handleSave}
                  onUndo={handleUndo}
                  onRedo={handleRedo}
                  onReset={() => setShowResetDialog(true)}
                  onExport={handleExport}
                  onShowHelp={() => setShowHelpModal(true)}
                  canUndo={canUndo}
                  canRedo={canRedo}
                />

                <div className="h-8 w-px bg-slate-200" />

                <div className="text-right">
                  <div className="text-xs text-slate-400 uppercase tracking-wider">Total effekt</div>
                  <div className="text-lg font-bold text-mint-600" style={{ fontFamily: "var(--font-outfit)" }}>
                    {(displayCalculation.totals.valueCreation / 1000000000).toFixed(2)} mrd
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400 uppercase tracking-wider">Multiplikator</div>
                  <div className="text-lg font-bold text-teal-600" style={{ fontFamily: "var(--font-outfit)" }}>
                    {displayCalculation.totals.multiplierEffect.toFixed(2)}x
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Three-column layout */}
        <div className="p-6">
          <div className="grid grid-cols-12 gap-6">
            {/* Left column - Input */}
            <div className="col-span-3 space-y-4">
              <SimulatorInput
                input={input}
                config={config}
                onInputChange={handleInputChange}
                onConfigChange={handleConfigChange}
                onScenarioSelect={setSelectedScenario}
                selectedScenario={selectedScenario}
              />

              {/* History panel */}
              <SimulatorHistory
                snapshots={snapshots}
                onRestore={handleRestoreSnapshot}
                onDelete={deleteSnapshot}
                onRename={renameSnapshot}
                onCompare={(id, slot) => setComparisonPair(slot, id)}
                comparisonSnapshots={comparisonSnapshots}
              />
            </div>

            {/* Middle column - Visualization */}
            <div className="col-span-5">
              <ErrorBoundary>
                <SimulatorSankey
                  calculation={displayCalculation}
                  comparison={comparison}
                />
              </ErrorBoundary>
            </div>

            {/* Right column - Results */}
            <div className="col-span-4">
              <ErrorBoundary>
                <SimulatorResults
                  calculation={displayCalculation}
                  comparison={comparison}
                  selectedScenario={selectedScenario}
                />
              </ErrorBoundary>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <KeyboardShortcutsModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
      />

      <ConfirmDialog
        isOpen={showResetDialog}
        onClose={() => setShowResetDialog(false)}
        onConfirm={handleReset}
        title="Tilbakestill alle verdier?"
        description="Dette vil tilbakestille alle innstillinger til standardverdier. Beregningshistorikken vil bevares."
        confirmLabel="Tilbakestill"
        type="warning"
      />
    </div>
  );
}

export default function SimulatorPage() {
  return (
    <ViewModeProvider>
      <SimulatorContent />
    </ViewModeProvider>
  );
}
