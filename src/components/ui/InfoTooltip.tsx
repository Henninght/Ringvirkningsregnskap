"use client";

import { useState } from "react";
import { HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface InfoTooltipProps {
  /** Beskrivende tekst som vises i tooltip */
  description: string;
  /** Valgfri tittel over beskrivelsen */
  title?: string;
  className?: string;
  size?: "sm" | "md";
  /** Farge-variant for ikonet */
  variant?: "default" | "petrol" | "sage";
}

/**
 * InfoTooltip - Viser beskrivende tekst fra rapporten
 *
 * Bruk: <InfoTooltip description="Lønn, investeringer, drift. (s.5)" />
 */
export function InfoTooltip({
  description,
  title,
  className,
  size = "sm",
  variant = "default"
}: InfoTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const iconSize = size === "sm" ? 13 : 15;

  const variantStyles = {
    default: "bg-slate-700/60 text-slate-300 hover:bg-slate-600/80 hover:text-white border border-slate-600/50",
    petrol: "bg-petrol-500/20 text-petrol-300 hover:bg-petrol-500/30 hover:text-petrol-200 border border-petrol-500/30",
    sage: "bg-sage-500/20 text-sage-300 hover:bg-sage-500/30 hover:text-sage-200 border border-sage-500/30",
  };

  return (
    <span
      className={cn("inline-flex items-center ml-1.5 relative", className)}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      <span
        className={cn(
          "flex items-center justify-center rounded-full cursor-help transition-all duration-200",
          size === "sm" ? "w-[18px] h-[18px]" : "w-[22px] h-[22px]",
          variantStyles[variant]
        )}
      >
        <HelpCircle size={iconSize} strokeWidth={2} />
      </span>

      {/* Tooltip */}
      <span
        className={cn(
          "absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2.5",
          "px-3 py-2.5 rounded-xl shadow-xl",
          "bg-slate-900 border border-slate-700 text-xs",
          "transition-all duration-200 ease-out",
          "max-w-[240px]",
          isVisible
            ? "opacity-100 visible translate-y-0"
            : "opacity-0 invisible translate-y-1"
        )}
      >
        {/* Arrow */}
        <span className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-slate-900" />

        {title && (
          <span className="block font-semibold text-white mb-1">
            {title}
          </span>
        )}

        <span className="block text-slate-200 leading-relaxed whitespace-normal">
          {description}
        </span>
      </span>
    </span>
  );
}
