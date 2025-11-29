"use client";

import {
  Undo2,
  Redo2,
  Save,
  Download,
  RotateCcw,
  Keyboard,
  HelpCircle
} from "lucide-react";
import { Tooltip } from "@/components/ui/Tooltip";
import { cn } from "@/lib/utils";

interface SimulatorToolbarProps {
  onSave: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onReset: () => void;
  onExport: () => void;
  onShowHelp: () => void;
  canUndo: boolean;
  canRedo: boolean;
  isSaving?: boolean;
}

export function SimulatorToolbar({
  onSave,
  onUndo,
  onRedo,
  onReset,
  onExport,
  onShowHelp,
  canUndo,
  canRedo,
  isSaving = false,
}: SimulatorToolbarProps) {
  return (
    <div className="flex items-center gap-1 bg-white rounded-xl border border-slate-200 p-1 shadow-sm">
      <ToolbarButton
        icon={<Undo2 size={16} />}
        label="Angre"
        shortcut="Ctrl+Z"
        onClick={onUndo}
        disabled={!canUndo}
      />
      <ToolbarButton
        icon={<Redo2 size={16} />}
        label="Gjenopprett"
        shortcut="Ctrl+Y"
        onClick={onRedo}
        disabled={!canRedo}
      />

      <div className="w-px h-6 bg-slate-200 mx-1" />

      <ToolbarButton
        icon={<Save size={16} />}
        label="Lagre beregning"
        shortcut="Ctrl+S"
        onClick={onSave}
        loading={isSaving}
      />
      <ToolbarButton
        icon={<Download size={16} />}
        label="Eksporter"
        onClick={onExport}
      />

      <div className="w-px h-6 bg-slate-200 mx-1" />

      <ToolbarButton
        icon={<RotateCcw size={16} />}
        label="Tilbakestill"
        onClick={onReset}
        variant="danger"
      />

      <div className="w-px h-6 bg-slate-200 mx-1" />

      <ToolbarButton
        icon={<HelpCircle size={16} />}
        label="Hjelp og hurtigtaster"
        onClick={onShowHelp}
      />
    </div>
  );
}

interface ToolbarButtonProps {
  icon: React.ReactNode;
  label: string;
  shortcut?: string;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "default" | "danger";
}

function ToolbarButton({
  icon,
  label,
  shortcut,
  onClick,
  disabled = false,
  loading = false,
  variant = "default",
}: ToolbarButtonProps) {
  const tooltipContent = (
    <div className="text-center">
      <div>{label}</div>
      {shortcut && (
        <div className="text-slate-400 text-xs mt-0.5">{shortcut}</div>
      )}
    </div>
  );

  return (
    <Tooltip content={tooltipContent} position="bottom">
      <button
        onClick={onClick}
        disabled={disabled || loading}
        className={cn(
          "p-2 rounded-lg transition-colors",
          disabled
            ? "text-slate-300 cursor-not-allowed"
            : variant === "danger"
            ? "text-slate-500 hover:text-coral-500 hover:bg-coral-50"
            : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
        )}
        aria-label={label}
      >
        {loading ? (
          <div className="w-4 h-4 rounded-full border-2 border-slate-300 border-t-mint-500 animate-spin" />
        ) : (
          icon
        )}
      </button>
    </Tooltip>
  );
}

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
  if (!isOpen) return null;

  const shortcuts = [
    { keys: ["Ctrl", "Z"], description: "Angre siste endring" },
    { keys: ["Ctrl", "Y"], description: "Gjenopprett angret endring" },
    { keys: ["Ctrl", "S"], description: "Lagre gjeldende beregning" },
    { keys: ["Ctrl", "E"], description: "Eksporter resultater" },
    { keys: ["Ctrl", "R"], description: "Tilbakestill til standard" },
    { keys: ["Esc"], description: "Lukk dialoger" },
    { keys: ["1-5"], description: "Velg scenario (1-5)" },
    { keys: ["Tab"], description: "Naviger mellom felter" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-lavender-100 flex items-center justify-center">
              <Keyboard size={20} className="text-lavender-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-800" style={{ fontFamily: "var(--font-outfit)" }}>
                Hurtigtaster
              </h2>
              <p className="text-sm text-slate-500">
                Naviger raskere med tastaturet
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-3">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm text-slate-600">{shortcut.description}</span>
              <div className="flex items-center gap-1">
                {shortcut.keys.map((key, keyIndex) => (
                  <span key={keyIndex}>
                    <kbd className="px-2 py-1 bg-slate-100 text-slate-700 text-xs font-mono rounded border border-slate-200">
                      {key}
                    </kbd>
                    {keyIndex < shortcut.keys.length - 1 && (
                      <span className="text-slate-400 mx-1">+</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 pt-0">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-100 text-slate-700 rounded-xl font-medium text-sm hover:bg-slate-200 transition-colors"
          >
            Lukk
          </button>
        </div>
      </div>
    </div>
  );
}
