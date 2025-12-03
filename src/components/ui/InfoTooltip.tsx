"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
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
 * Bruker portal for å unngå CSS-arv problemer
 */
export function InfoTooltip({
  description,
  title,
  className,
  size = "sm",
  variant = "default"
}: InfoTooltipProps) {
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

  const iconSize = size === "sm" ? 13 : 15;

  // Variant colors for the icon button
  const variantColors = {
    default: {
      bg: "rgba(71, 85, 105, 0.7)",
      hoverBg: "rgba(100, 116, 139, 0.8)",
      color: "#cbd5e1",
      hoverColor: "#ffffff",
      border: "rgba(100, 116, 139, 0.5)",
    },
    petrol: {
      bg: "rgba(20, 184, 166, 0.2)",
      hoverBg: "rgba(20, 184, 166, 0.3)",
      color: "#5eead4",
      hoverColor: "#99f6e4",
      border: "rgba(20, 184, 166, 0.3)",
    },
    sage: {
      bg: "rgba(132, 204, 22, 0.2)",
      hoverBg: "rgba(132, 204, 22, 0.3)",
      color: "#bef264",
      hoverColor: "#d9f99d",
      border: "rgba(132, 204, 22, 0.3)",
    },
  };

  const colors = variantColors[variant];

  // Tooltip styles - completely isolated from page CSS
  const tooltipStyles: React.CSSProperties = {
    position: "fixed",
    zIndex: 99999,
    transform: "translate(-50%, -100%)",
    padding: "12px 16px",
    borderRadius: "12px",
    backgroundColor: "#020617",
    border: "1px solid #475569",
    boxShadow: "0 20px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)",
    pointerEvents: "none",
    maxWidth: "260px",
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
    display: "block",
    fontWeight: 600,
    fontSize: "12px",
    color: "#ffffff",
    marginBottom: "6px",
    fontFamily: "system-ui, -apple-system, sans-serif",
  };

  const descriptionStyles: React.CSSProperties = {
    display: "block",
    fontSize: "12px",
    color: "#f1f5f9",
    lineHeight: 1.5,
    whiteSpace: "normal",
    fontFamily: "system-ui, -apple-system, sans-serif",
  };

  return (
    <>
      <span
        ref={triggerRef}
        className={cn("inline-flex items-center ml-1.5 relative", className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsVisible(false)}
      >
        <span
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: size === "sm" ? "18px" : "22px",
            height: size === "sm" ? "18px" : "22px",
            borderRadius: "50%",
            backgroundColor: colors.bg,
            color: colors.color,
            border: `1px solid ${colors.border}`,
            cursor: "help",
            transition: "all 0.15s ease",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = colors.hoverBg;
            e.currentTarget.style.color = colors.hoverColor;
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = colors.bg;
            e.currentTarget.style.color = colors.color;
          }}
        >
          <HelpCircle size={iconSize} strokeWidth={2} />
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
          {title && (
            <span style={titleStyles}>
              {title}
            </span>
          )}
          <span style={descriptionStyles}>
            {description}
          </span>
        </div>,
        document.body
      )}
    </>
  );
}
