"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
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
 * Bruker portal for å unngå CSS-arv problemer
 */
export function SourceTooltip({ kilde, className, size = "sm" }: SourceTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLSpanElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const updatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.top - 8,
        left: rect.left + rect.width / 2,
      });
    }
  };

  const handleMouseEnter = () => {
    updatePosition();
    setIsVisible(true);
  };

  const iconSize = size === "sm" ? 12 : 14;

  // Tooltip styles - completely isolated from page CSS
  const tooltipStyles: React.CSSProperties = {
    position: "fixed",
    zIndex: 99999,
    transform: "translate(-50%, -100%)",
    padding: "10px 14px",
    borderRadius: "10px",
    backgroundColor: "#020617",
    border: "1px solid #475569",
    boxShadow: "0 20px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)",
    pointerEvents: "none",
    whiteSpace: "nowrap",
  };

  const arrowStyles: React.CSSProperties = {
    position: "absolute",
    bottom: "-6px",
    left: "50%",
    transform: "translateX(-50%)",
    width: 0,
    height: 0,
    borderLeft: "6px solid transparent",
    borderRight: "6px solid transparent",
    borderTop: "6px solid #020617",
  };

  const titleStyles: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontWeight: 600,
    fontSize: "12px",
    color: "#ffffff",
    margin: 0,
    padding: 0,
    fontFamily: "system-ui, -apple-system, sans-serif",
  };

  const sectionStyles: React.CSSProperties = {
    display: "block",
    marginTop: "4px",
    fontSize: "12px",
    color: "#f1f5f9",
    fontFamily: "system-ui, -apple-system, sans-serif",
  };

  const descriptionStyles: React.CSSProperties = {
    display: "block",
    marginTop: "6px",
    fontSize: "10px",
    color: "#94a3b8",
    maxWidth: "200px",
    whiteSpace: "normal",
    lineHeight: 1.4,
    fontFamily: "system-ui, -apple-system, sans-serif",
  };

  return (
    <>
      <span
        ref={triggerRef}
        className={cn("inline-flex items-center ml-1 relative", className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsVisible(false)}
      >
        <span
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: size === "sm" ? "16px" : "20px",
            height: size === "sm" ? "16px" : "20px",
            borderRadius: "50%",
            backgroundColor: "rgba(71, 85, 105, 0.7)",
            color: "#cbd5e1",
            border: "1px solid rgba(100, 116, 139, 0.5)",
            cursor: "help",
            transition: "all 0.15s ease",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(100, 116, 139, 0.8)";
            e.currentTarget.style.color = "#ffffff";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(71, 85, 105, 0.7)";
            e.currentTarget.style.color = "#cbd5e1";
          }}
        >
          <Info size={iconSize} />
        </span>
      </span>

      {mounted && isVisible && createPortal(
        <div
          style={{
            ...tooltipStyles,
            top: position.top,
            left: position.left,
          }}
        >
          <div style={arrowStyles} />
          <span style={titleStyles}>
            <span style={{ fontSize: "14px" }}>📄</span>
            Rapport s. {kilde.side}
          </span>
          {kilde.seksjon && (
            <span style={sectionStyles}>
              {kilde.seksjon}
            </span>
          )}
          {kilde.beskrivelse && (
            <span style={descriptionStyles}>
              {kilde.beskrivelse}
            </span>
          )}
        </div>,
        document.body
      )}
    </>
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
