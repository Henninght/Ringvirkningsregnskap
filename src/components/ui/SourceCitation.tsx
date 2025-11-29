"use client";

import { ExternalLink, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { Kilde, getKildeAlder, KildeAlder } from "@/types/kilde";
import { getKildeById } from "@/lib/nsfData";
import { KildeRef } from "@/types/policyScenario";

interface SourceCitationProps {
  kildeRef: KildeRef;
  variant?: "inline" | "block" | "compact";
  showAge?: boolean;
  className?: string;
}

const AGE_CONFIG: Record<
  KildeAlder,
  { icon: typeof CheckCircle; color: string; label: string }
> = {
  fersk: {
    icon: CheckCircle,
    color: "text-mint-600",
    label: "Oppdatert",
  },
  ok: {
    icon: Clock,
    color: "text-amber-600",
    label: "6-12 mnd",
  },
  gammel: {
    icon: AlertTriangle,
    color: "text-coral-600",
    label: "Over 1 ar",
  },
};

export function SourceCitation({
  kildeRef,
  variant = "inline",
  showAge = true,
  className = "",
}: SourceCitationProps) {
  const kilde = getKildeById(kildeRef.kildeId);

  if (!kilde) {
    return (
      <span className={`text-slate-400 text-xs italic ${className}`}>
        [Kilde ikke funnet: {kildeRef.kildeId}]
      </span>
    );
  }

  const age = getKildeAlder(kilde.sistOppdatert);
  const ageConfig = AGE_CONFIG[age];
  const AgeIcon = ageConfig.icon;

  if (variant === "compact") {
    return (
      <a
        href={kilde.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-1 text-xs text-petrol-600 hover:text-petrol-800 hover:underline ${className}`}
        title={`${kilde.tittel} (${kilde.utgiver}, ${kilde.ar})`}
      >
        {kilde.sitatnokkel}
        <ExternalLink size={10} />
      </a>
    );
  }

  if (variant === "inline") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 text-xs ${className}`}
      >
        <a
          href={kilde.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-petrol-600 hover:text-petrol-800 hover:underline inline-flex items-center gap-1"
        >
          {kilde.utgiver} ({kilde.ar})
          <ExternalLink size={10} />
        </a>
        {showAge && (
          <span className={`${ageConfig.color}`} title={ageConfig.label}>
            <AgeIcon size={12} />
          </span>
        )}
      </span>
    );
  }

  // Block variant - full citation
  return (
    <div
      className={`bg-slate-50 border border-slate-200 rounded-lg p-3 ${className}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <a
            href={kilde.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-petrol-700 hover:text-petrol-900 hover:underline inline-flex items-center gap-1"
          >
            {kilde.tittel}
            <ExternalLink size={12} />
          </a>
          <div className="text-xs text-slate-500 mt-0.5">
            {kilde.utgiver}, {kilde.ar}
            {kilde.maned && ` (${getMonthName(kilde.maned)})`}
          </div>
          {kildeRef.spesifikk && (
            <div className="text-xs text-slate-400 mt-1 italic">
              {kildeRef.spesifikk}
            </div>
          )}
          {kildeRef.sitat && (
            <blockquote className="text-xs text-slate-600 mt-2 pl-2 border-l-2 border-petrol-200 italic">
              "{kildeRef.sitat}"
            </blockquote>
          )}
        </div>
        {showAge && (
          <div
            className={`flex items-center gap-1 text-xs ${ageConfig.color} shrink-0`}
            title={`Sist verifisert: ${kilde.sistOppdatert}`}
          >
            <AgeIcon size={14} />
            <span className="hidden sm:inline">{ageConfig.label}</span>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Liste av kilder
 */
interface SourceListProps {
  sources: KildeRef[];
  title?: string;
  className?: string;
}

export function SourceList({
  sources,
  title = "Kilder",
  className = "",
}: SourceListProps) {
  if (sources.length === 0) return null;

  return (
    <div className={`space-y-2 ${className}`}>
      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
        {title}
      </h4>
      <div className="space-y-2">
        {sources.map((source, index) => (
          <SourceCitation
            key={`${source.kildeId}-${index}`}
            kildeRef={source}
            variant="block"
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Inline kildemarkering (f.eks. etter et tall)
 */
interface InlineSourceProps {
  kildeId: string;
  spesifikk?: string;
}

export function InlineSource({ kildeId, spesifikk }: InlineSourceProps) {
  return (
    <SourceCitation
      kildeRef={{ kildeId, spesifikk }}
      variant="compact"
      showAge={false}
      className="ml-0.5"
    />
  );
}

// Hjelpefunksjon for månedsnavn
function getMonthName(month: number): string {
  const months = [
    "jan",
    "feb",
    "mar",
    "apr",
    "mai",
    "jun",
    "jul",
    "aug",
    "sep",
    "okt",
    "nov",
    "des",
  ];
  return months[month - 1] || "";
}
