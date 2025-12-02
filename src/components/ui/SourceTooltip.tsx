"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

export interface KildeRef {
  side: number;
  seksjon?: string;
  beskrivelse?: string;
}

interface SourceTooltipProps {
  kilde: KildeRef;
  className?: string;
  size?: "sm" | "md";
}

/**
 * SourceTooltip - Viser kildehenvisning til Eidsiva-rapporten
 *
 * Bruk: <SourceTooltip kilde={{ side: 17, seksjon: "Fornybar energi" }} />
 */
export function SourceTooltip({ kilde, className, size = "sm" }: SourceTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const iconSize = size === "sm" ? 12 : 14;

  return (
    <span
      className={cn("inline-flex items-center ml-1 relative", className)}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      <span
        className={cn(
          "flex items-center justify-center rounded-full cursor-help transition-colors",
          size === "sm" ? "w-4 h-4" : "w-5 h-5",
          "bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600"
        )}
      >
        <Info size={iconSize} />
      </span>

      {/* Tooltip */}
      <span
        className={cn(
          "absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2",
          "px-3 py-2 rounded-lg shadow-lg",
          "bg-slate-800 text-white text-xs",
          "transition-all duration-150",
          "whitespace-nowrap",
          isVisible ? "opacity-100 visible" : "opacity-0 invisible"
        )}
      >
        {/* Arrow */}
        <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />

        <span className="flex items-center gap-1.5 font-medium">
          <span className="text-slate-300">📄</span>
          Rapport s. {kilde.side}
        </span>

        {kilde.seksjon && (
          <span className="block text-slate-300 mt-0.5">
            {kilde.seksjon}
          </span>
        )}

        {kilde.beskrivelse && (
          <span className="block text-slate-400 mt-1 text-[10px] max-w-[200px] whitespace-normal">
            {kilde.beskrivelse}
          </span>
        )}
      </span>
    </span>
  );
}

/**
 * Helper for å vise verdi med kildehenvisning inline
 */
interface ValueWithSourceProps {
  children: React.ReactNode;
  kilde: KildeRef;
  className?: string;
}

export function ValueWithSource({ children, kilde, className }: ValueWithSourceProps) {
  return (
    <span className={cn("inline-flex items-center", className)}>
      {children}
      <SourceTooltip kilde={kilde} />
    </span>
  );
}
