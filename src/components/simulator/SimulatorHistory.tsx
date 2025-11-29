"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { SimulatorSnapshot } from "@/hooks/useSimulatorHistory";
import { formatRippleValue } from "@/lib/calculations";
import {
  History,
  Trash2,
  Download,
  ChevronDown,
  ChevronUp,
  Clock,
  RotateCcw,
  Edit3,
  Check,
  X,
  GitCompare,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SimulatorHistoryProps {
  snapshots: SimulatorSnapshot[];
  onRestore: (snapshot: SimulatorSnapshot) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onCompare?: (snapshotId: string, slot: 0 | 1) => void;
  comparisonSnapshots?: [string | null, string | null];
}

export function SimulatorHistory({
  snapshots,
  onRestore,
  onDelete,
  onRename,
  onCompare,
  comparisonSnapshots = [null, null],
}: SimulatorHistoryProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const handleStartEdit = (snapshot: SimulatorSnapshot) => {
    setEditingId(snapshot.id);
    setEditName(snapshot.name);
  };

  const handleSaveEdit = (id: string) => {
    if (editName.trim()) {
      onRename(id, editName.trim());
    }
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName("");
  };

  if (snapshots.length === 0) {
    return null;
  }

  return (
    <Card className="animate-slide-up">
      <CardHeader>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full"
        >
          <CardTitle className="flex items-center gap-2 text-base">
            <History size={16} className="text-slate-400" />
            Beregningshistorikk
            <span className="text-xs text-slate-400 font-normal ml-2">
              ({snapshots.length} lagret)
            </span>
          </CardTitle>
          <span className={cn("text-slate-400 transition-transform duration-200", isExpanded && "rotate-180")}>
            <ChevronDown size={18} />
          </span>
        </button>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0">
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {snapshots.map((snapshot) => (
              <SnapshotItem
                key={snapshot.id}
                snapshot={snapshot}
                isEditing={editingId === snapshot.id}
                editName={editName}
                onEditNameChange={setEditName}
                onStartEdit={() => handleStartEdit(snapshot)}
                onSaveEdit={() => handleSaveEdit(snapshot.id)}
                onCancelEdit={handleCancelEdit}
                onRestore={() => onRestore(snapshot)}
                onDelete={() => onDelete(snapshot.id)}
                onCompare={onCompare}
                isInComparison={comparisonSnapshots.includes(snapshot.id)}
                comparisonSlot={comparisonSnapshots.indexOf(snapshot.id) as -1 | 0 | 1}
              />
            ))}
          </div>

          {onCompare && comparisonSnapshots[0] && comparisonSnapshots[1] && (
            <div className="mt-4 p-3 bg-lavender-50 border border-lavender-200 rounded-xl">
              <div className="flex items-center gap-2 text-sm text-lavender-700">
                <GitCompare size={16} />
                <span>Sammenligner to beregninger</span>
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}

interface SnapshotItemProps {
  snapshot: SimulatorSnapshot;
  isEditing: boolean;
  editName: string;
  onEditNameChange: (name: string) => void;
  onStartEdit: () => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onRestore: () => void;
  onDelete: () => void;
  onCompare?: (snapshotId: string, slot: 0 | 1) => void;
  isInComparison: boolean;
  comparisonSlot: -1 | 0 | 1;
}

function SnapshotItem({
  snapshot,
  isEditing,
  editName,
  onEditNameChange,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onRestore,
  onDelete,
  onCompare,
  isInComparison,
  comparisonSlot,
}: SnapshotItemProps) {
  return (
    <div
      className={cn(
        "p-3 rounded-xl border transition-colors",
        isInComparison
          ? "bg-lavender-50 border-lavender-200"
          : "bg-slate-50 border-slate-100 hover:border-slate-200"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={editName}
                onChange={(e) => onEditNameChange(e.target.value)}
                className="flex-1 px-2 py-1 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-500/20 focus:border-mint-500"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") onSaveEdit();
                  if (e.key === "Escape") onCancelEdit();
                }}
              />
              <button
                onClick={onSaveEdit}
                className="p-1 text-mint-600 hover:text-mint-700"
                aria-label="Lagre"
              >
                <Check size={16} />
              </button>
              <button
                onClick={onCancelEdit}
                className="p-1 text-slate-400 hover:text-slate-600"
                aria-label="Avbryt"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm text-slate-700 truncate">
                {snapshot.name}
              </span>
              {isInComparison && (
                <span className="px-1.5 py-0.5 bg-lavender-200 text-lavender-700 text-xs rounded">
                  {comparisonSlot === 0 ? "A" : "B"}
                </span>
              )}
              <button
                onClick={onStartEdit}
                className="p-1 text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Rediger navn"
              >
                <Edit3 size={12} />
              </button>
            </div>
          )}

          <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {snapshot.timestamp.toLocaleTimeString("nb-NO", { hour: "2-digit", minute: "2-digit" })}
            </span>
            <span>{formatRippleValue(snapshot.calculation.totals.valueCreation, "currency")}</span>
            {snapshot.scenario && (
              <span className="px-1.5 py-0.5 bg-mint-100 text-mint-700 rounded">
                {snapshot.scenario.name}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          {onCompare && (
            <>
              <button
                onClick={() => onCompare(snapshot.id, 0)}
                className={cn(
                  "p-1.5 rounded-lg transition-colors text-xs",
                  comparisonSlot === 0
                    ? "bg-lavender-200 text-lavender-700"
                    : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                )}
                title="Sett som sammenligning A"
              >
                A
              </button>
              <button
                onClick={() => onCompare(snapshot.id, 1)}
                className={cn(
                  "p-1.5 rounded-lg transition-colors text-xs",
                  comparisonSlot === 1
                    ? "bg-lavender-200 text-lavender-700"
                    : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                )}
                title="Sett som sammenligning B"
              >
                B
              </button>
            </>
          )}
          <button
            onClick={onRestore}
            className="p-1.5 text-slate-400 hover:text-mint-600 hover:bg-mint-50 rounded-lg transition-colors"
            title="Gjenopprett"
          >
            <RotateCcw size={14} />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 text-slate-400 hover:text-coral-500 hover:bg-coral-50 rounded-lg transition-colors"
            title="Slett"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
