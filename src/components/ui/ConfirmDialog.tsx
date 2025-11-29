"use client";

import { ReactNode } from "react";
import { AlertTriangle, Info, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type DialogType = "warning" | "danger" | "info" | "confirm";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  type?: DialogType;
  isLoading?: boolean;
  children?: ReactNode;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Bekreft",
  cancelLabel = "Avbryt",
  type = "confirm",
  isLoading = false,
  children,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const typeConfig: Record<DialogType, { icon: ReactNode; iconBg: string; confirmBg: string }> = {
    warning: {
      icon: <AlertTriangle size={24} className="text-amber-500" />,
      iconBg: "bg-amber-100",
      confirmBg: "bg-amber-500 hover:bg-amber-600",
    },
    danger: {
      icon: <AlertTriangle size={24} className="text-coral-500" />,
      iconBg: "bg-coral-100",
      confirmBg: "bg-coral-500 hover:bg-coral-600",
    },
    info: {
      icon: <Info size={24} className="text-blue-500" />,
      iconBg: "bg-blue-100",
      confirmBg: "bg-blue-500 hover:bg-blue-600",
    },
    confirm: {
      icon: <HelpCircle size={24} className="text-mint-500" />,
      iconBg: "bg-mint-100",
      confirmBg: "bg-mint-500 hover:bg-mint-600",
    },
  };

  const config = typeConfig[type];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      <div
        className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={cn("w-12 h-12 rounded-full flex items-center justify-center shrink-0", config.iconBg)}>
              {config.icon}
            </div>
            <div className="flex-1">
              <h2
                id="dialog-title"
                className="text-lg font-semibold text-slate-800 mb-1"
                style={{ fontFamily: "var(--font-outfit)" }}
              >
                {title}
              </h2>
              <p id="dialog-description" className="text-sm text-slate-600">
                {description}
              </p>
            </div>
          </div>

          {children && <div className="mt-4">{children}</div>}
        </div>

        <div className="flex gap-3 p-6 pt-0">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-2.5 px-4 bg-slate-100 text-slate-700 rounded-xl font-medium text-sm hover:bg-slate-200 transition-colors disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={cn(
              "flex-1 py-2.5 px-4 text-white rounded-xl font-medium text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2",
              config.confirmBg
            )}
          >
            {isLoading && (
              <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            )}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

interface UnsavedChangesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onDiscard: () => void;
  onSave: () => void;
}

export function UnsavedChangesDialog({
  isOpen,
  onClose,
  onDiscard,
  onSave,
}: UnsavedChangesDialogProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
              <AlertTriangle size={24} className="text-amber-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-800 mb-1" style={{ fontFamily: "var(--font-outfit)" }}>
                Ulagrede endringer
              </h2>
              <p className="text-sm text-slate-600">
                Du har endringer som ikke er lagret. Vil du lagre dem for du fortsetter?
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 p-6 pt-0">
          <button
            onClick={onDiscard}
            className="flex-1 py-2.5 px-4 bg-slate-100 text-slate-700 rounded-xl font-medium text-sm hover:bg-slate-200 transition-colors"
          >
            Forkast
          </button>
          <button
            onClick={onClose}
            className="py-2.5 px-4 border border-slate-200 text-slate-700 rounded-xl font-medium text-sm hover:bg-slate-50 transition-colors"
          >
            Tilbake
          </button>
          <button
            onClick={onSave}
            className="flex-1 py-2.5 px-4 bg-mint-500 text-white rounded-xl font-medium text-sm hover:bg-mint-600 transition-colors"
          >
            Lagre
          </button>
        </div>
      </div>
    </div>
  );
}
