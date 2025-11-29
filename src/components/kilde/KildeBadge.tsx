"use client";

import { Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Kilde } from "@/types/kilde";
import { KildeTooltip } from "./KildeTooltip";
import { NSF_KILDER } from "@/lib/nsfData";

interface KildeBadgeProps {
  kildeId: string;
  variant?: "inline" | "superscript" | "icon";
  className?: string;
}

/**
 * Liten badge som indikerer at et tall har en kilde
 * Viser tooltip med kildeinfo ved hover
 */
export function KildeBadge({
  kildeId,
  variant = "icon",
  className,
}: KildeBadgeProps) {
  const kilde = NSF_KILDER[kildeId];

  if (!kilde) {
    console.warn(`Kilde ikke funnet: ${kildeId}`);
    return null;
  }

  if (variant === "superscript") {
    return (
      <KildeTooltip kilde={kilde} position="top">
        <sup
          className={cn(
            "ml-0.5 text-petrol-500 hover:text-petrol-600 cursor-help font-medium",
            className
          )}
        >
          {kilde.sitatnokkel.replace("[^", "").replace("]", "")}
        </sup>
      </KildeTooltip>
    );
  }

  if (variant === "inline") {
    return (
      <KildeTooltip kilde={kilde} position="right">
        <span
          className={cn(
            "ml-1 px-1.5 py-0.5 text-xs bg-slate-100 text-slate-500 rounded cursor-help hover:bg-slate-200 transition-colors",
            className
          )}
        >
          {kilde.sitatnokkel}
        </span>
      </KildeTooltip>
    );
  }

  // Default: icon variant
  return (
    <KildeTooltip kilde={kilde} position="top">
      <button
        type="button"
        className={cn(
          "ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full",
          "bg-petrol-100 text-petrol-500 hover:bg-petrol-200 transition-colors cursor-help",
          className
        )}
        aria-label={`Kilde: ${kilde.tittel}`}
      >
        <Info size={10} />
      </button>
    </KildeTooltip>
  );
}

interface TallMedKildeProps {
  verdi: string | number;
  kildeId: string;
  enhet?: string;
  className?: string;
  badgeVariant?: "inline" | "superscript" | "icon";
}

/**
 * Viser et tall med tilhørende kildebadge
 */
export function TallMedKilde({
  verdi,
  kildeId,
  enhet,
  className,
  badgeVariant = "superscript",
}: TallMedKildeProps) {
  return (
    <span className={cn("inline-flex items-baseline", className)}>
      <span>
        {typeof verdi === "number" ? verdi.toLocaleString("nb-NO") : verdi}
        {enhet && <span className="ml-1">{enhet}</span>}
      </span>
      <KildeBadge kildeId={kildeId} variant={badgeVariant} />
    </span>
  );
}
