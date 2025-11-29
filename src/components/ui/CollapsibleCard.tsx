"use client";

import { useState, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { Card } from "./Card";

interface CollapsibleCardProps {
  /** Tittel som vises i header */
  title: string;
  /** Beskrivelse under tittel */
  description?: string;
  /** Valgfritt ikon ved siden av tittel */
  icon?: ReactNode;
  /** Ekstra innhold i header (høyre side) */
  headerExtra?: ReactNode;
  /** Om kortet skal være åpent som default */
  defaultOpen?: boolean;
  /** Kontrollert åpen-state (valgfritt) */
  isOpen?: boolean;
  /** Callback når kortet åpnes/lukkes */
  onToggle?: (isOpen: boolean) => void;
  /** Innholdet som vises når kortet er åpent */
  children: ReactNode;
  /** Ekstra CSS-klasser for Card */
  className?: string;
  /** Animasjonsdelay for slide-up */
  animationDelay?: string;
}

export function CollapsibleCard({
  title,
  description,
  icon,
  headerExtra,
  defaultOpen = true,
  isOpen: controlledIsOpen,
  onToggle,
  children,
  className,
  animationDelay,
}: CollapsibleCardProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(defaultOpen);

  // Støtt både kontrollert og ukontrollert modus
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  const handleToggle = () => {
    const newState = !isOpen;
    if (controlledIsOpen === undefined) {
      setInternalIsOpen(newState);
    }
    onToggle?.(newState);
  };

  return (
    <Card
      className={cn("animate-slide-up overflow-hidden", className)}
      style={animationDelay ? { animationDelay } : undefined}
    >
      {/* Clickable Header */}
      <button
        type="button"
        onClick={handleToggle}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50/50 transition-colors"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3 min-w-0">
          {icon && (
            <div className="shrink-0 text-petrol-500">
              {icon}
            </div>
          )}
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-slate-800 truncate">
              {title}
            </h3>
            {description && (
              <p className="text-xs text-slate-500 mt-0.5 truncate">
                {description}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {headerExtra}
          <ChevronDown
            size={18}
            className={cn(
              "text-slate-400 transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        </div>
      </button>

      {/* Collapsible Content */}
      <div
        className={cn(
          "grid transition-all duration-300 ease-in-out",
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <div className="px-4 pb-4">
            {children}
          </div>
        </div>
      </div>
    </Card>
  );
}
