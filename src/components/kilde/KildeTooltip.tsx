"use client";

import { useState, ReactNode, useRef, useEffect } from "react";
import { ExternalLink, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Kilde, getKildeAlder, KildeAlder } from "@/types/kilde";

interface KildeTooltipProps {
  children: ReactNode;
  kilde: Kilde;
  position?: "top" | "bottom" | "left" | "right";
  showAge?: boolean;
}

const ALDER_CONFIG: Record<KildeAlder, { icon: typeof CheckCircle; farge: string; tekst: string }> = {
  fersk: { icon: CheckCircle, farge: "text-mint-500", tekst: "Oppdatert" },
  ok: { icon: Clock, farge: "text-amber-500", tekst: "6-12 mnd" },
  gammel: { icon: AlertTriangle, farge: "text-coral-500", tekst: ">12 mnd" },
};

export function KildeTooltip({
  children,
  kilde,
  position = "top",
  showAge = true,
}: KildeTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, 150);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const alder = getKildeAlder(kilde.sistOppdatert);
  const alderConfig = ALDER_CONFIG[alder];
  const AlderIcon = alderConfig.icon;

  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <div
      className="relative inline-flex items-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isVisible && (
        <div
          className={cn(
            "absolute z-50 w-72 p-3 bg-white border border-slate-200 rounded-xl shadow-elevated",
            "animate-fade-in",
            positionClasses[position]
          )}
          role="tooltip"
        >
          {/* Utgiver og år */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              {kilde.utgiver} {kilde.ar}
            </span>
            {showAge && (
              <span className={cn("flex items-center gap-1 text-xs", alderConfig.farge)}>
                <AlderIcon size={12} />
                {alderConfig.tekst}
              </span>
            )}
          </div>

          {/* Tittel */}
          <h4 className="text-sm font-medium text-slate-800 mb-2 leading-snug">
            {kilde.tittel}
          </h4>

          {/* Lenke */}
          <a
            href={kilde.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-petrol-600 hover:text-petrol-700 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink size={12} />
            Åpne kilde
          </a>

          {/* Sitatnøkkel */}
          <div className="mt-2 pt-2 border-t border-slate-100">
            <span className="text-xs text-slate-400">
              Referanse: {kilde.sitatnokkel}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
