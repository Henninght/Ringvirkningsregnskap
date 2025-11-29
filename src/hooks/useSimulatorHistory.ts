"use client";

import { useState, useCallback, useMemo } from "react";
import { OrganizationInput, RippleConfig, Scenario, RippleCalculation } from "@/types/ripple";

export interface SimulatorSnapshot {
  id: string;
  timestamp: Date;
  name: string;
  input: OrganizationInput;
  config: RippleConfig;
  scenario: Scenario | null;
  calculation: RippleCalculation;
}

interface UseSimulatorHistoryOptions {
  maxSnapshots?: number;
}

export function useSimulatorHistory(options: UseSimulatorHistoryOptions = {}) {
  const { maxSnapshots = 10 } = options;

  const [snapshots, setSnapshots] = useState<SimulatorSnapshot[]>([]);
  const [undoStack, setUndoStack] = useState<SimulatorSnapshot[]>([]);
  const [redoStack, setRedoStack] = useState<SimulatorSnapshot[]>([]);

  const saveSnapshot = useCallback((
    input: OrganizationInput,
    config: RippleConfig,
    scenario: Scenario | null,
    calculation: RippleCalculation,
    name?: string
  ) => {
    const snapshot: SimulatorSnapshot = {
      id: `snapshot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      name: name || `Beregning ${new Date().toLocaleTimeString("nb-NO")}`,
      input,
      config,
      scenario,
      calculation,
    };

    setSnapshots((prev) => {
      const updated = [snapshot, ...prev];
      return updated.slice(0, maxSnapshots);
    });

    return snapshot;
  }, [maxSnapshots]);

  const deleteSnapshot = useCallback((id: string) => {
    setSnapshots((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const renameSnapshot = useCallback((id: string, name: string) => {
    setSnapshots((prev) =>
      prev.map((s) => (s.id === id ? { ...s, name } : s))
    );
  }, []);

  const clearHistory = useCallback(() => {
    setSnapshots([]);
    setUndoStack([]);
    setRedoStack([]);
  }, []);

  // Undo/Redo functionality
  const pushToUndo = useCallback((snapshot: SimulatorSnapshot) => {
    setUndoStack((prev) => [...prev, snapshot]);
    setRedoStack([]); // Clear redo stack on new action
  }, []);

  const undo = useCallback(() => {
    if (undoStack.length === 0) return null;

    const lastSnapshot = undoStack[undoStack.length - 1];
    setUndoStack((prev) => prev.slice(0, -1));

    return lastSnapshot;
  }, [undoStack]);

  const redo = useCallback(() => {
    if (redoStack.length === 0) return null;

    const nextSnapshot = redoStack[redoStack.length - 1];
    setRedoStack((prev) => prev.slice(0, -1));
    setUndoStack((prev) => [...prev, nextSnapshot]);

    return nextSnapshot;
  }, [redoStack]);

  const canUndo = undoStack.length > 0;
  const canRedo = redoStack.length > 0;

  // Comparison functionality
  const [comparisonSnapshots, setComparisonSnapshots] = useState<[string | null, string | null]>([null, null]);

  const setComparisonPair = useCallback((index: 0 | 1, snapshotId: string | null) => {
    setComparisonSnapshots((prev) => {
      const updated = [...prev] as [string | null, string | null];
      updated[index] = snapshotId;
      return updated;
    });
  }, []);

  const comparisonData = useMemo(() => {
    const [id1, id2] = comparisonSnapshots;
    if (!id1 || !id2) return null;

    const snapshot1 = snapshots.find((s) => s.id === id1);
    const snapshot2 = snapshots.find((s) => s.id === id2);

    if (!snapshot1 || !snapshot2) return null;

    return {
      snapshot1,
      snapshot2,
      difference: {
        valueCreation: snapshot2.calculation.totals.valueCreation - snapshot1.calculation.totals.valueCreation,
        employment: snapshot2.calculation.totals.employment - snapshot1.calculation.totals.employment,
        taxContribution: snapshot2.calculation.totals.taxContribution - snapshot1.calculation.totals.taxContribution,
        percentChange: snapshot1.calculation.totals.valueCreation > 0
          ? ((snapshot2.calculation.totals.valueCreation - snapshot1.calculation.totals.valueCreation) / snapshot1.calculation.totals.valueCreation) * 100
          : 0,
      },
    };
  }, [snapshots, comparisonSnapshots]);

  return {
    // Snapshots
    snapshots,
    saveSnapshot,
    deleteSnapshot,
    renameSnapshot,
    clearHistory,

    // Undo/Redo
    pushToUndo,
    undo,
    redo,
    canUndo,
    canRedo,

    // Comparison
    comparisonSnapshots,
    setComparisonPair,
    comparisonData,
  };
}
