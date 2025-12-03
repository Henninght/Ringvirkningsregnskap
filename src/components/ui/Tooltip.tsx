"use client";

import { useState, ReactNode, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

interface TooltipProps {
  children: ReactNode;
  content: ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  delay?: number;
  className?: string;
}

export function Tooltip({
  children,
  content,
  position = "top",
  delay = 200,
  className,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const updatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      let top = 0;
      let left = 0;

      switch (position) {
        case "top":
          top = rect.top - 8;
          left = rect.left + rect.width / 2;
          break;
        case "bottom":
          top = rect.bottom + 8;
          left = rect.left + rect.width / 2;
          break;
        case "left":
          top = rect.top + rect.height / 2;
          left = rect.left - 8;
          break;
        case "right":
          top = rect.top + rect.height / 2;
          left = rect.right + 8;
          break;
      }

      setCoords({ top, left });
    }
  };

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      updatePosition();
      setIsVisible(true);
    }, delay);
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

  // Position transform based on tooltip position
  const getTransform = () => {
    switch (position) {
      case "top":
        return "translate(-50%, -100%)";
      case "bottom":
        return "translate(-50%, 0)";
      case "left":
        return "translate(-100%, -50%)";
      case "right":
        return "translate(0, -50%)";
    }
  };

  // Arrow position styles
  const getArrowStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      position: "absolute",
      width: 0,
      height: 0,
      borderLeft: "6px solid transparent",
      borderRight: "6px solid transparent",
      borderTop: "6px solid transparent",
      borderBottom: "6px solid transparent",
    };

    switch (position) {
      case "top":
        return {
          ...base,
          bottom: "-6px",
          left: "50%",
          transform: "translateX(-50%)",
          borderTopColor: "#020617",
          borderBottomColor: "transparent",
        };
      case "bottom":
        return {
          ...base,
          top: "-6px",
          left: "50%",
          transform: "translateX(-50%)",
          borderBottomColor: "#020617",
          borderTopColor: "transparent",
        };
      case "left":
        return {
          ...base,
          right: "-6px",
          top: "50%",
          transform: "translateY(-50%)",
          borderLeftColor: "#020617",
          borderRightColor: "transparent",
        };
      case "right":
        return {
          ...base,
          left: "-6px",
          top: "50%",
          transform: "translateY(-50%)",
          borderRightColor: "#020617",
          borderLeftColor: "transparent",
        };
    }
  };

  const tooltipStyles: React.CSSProperties = {
    position: "fixed",
    zIndex: 99999,
    transform: getTransform(),
    padding: "10px 14px",
    borderRadius: "10px",
    backgroundColor: "#020617",
    border: "1px solid #475569",
    boxShadow: "0 20px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)",
    pointerEvents: "none",
    maxWidth: "280px",
    fontSize: "12px",
    color: "#f1f5f9",
    fontFamily: "system-ui, -apple-system, sans-serif",
    lineHeight: 1.5,
  };

  return (
    <div
      ref={triggerRef}
      className={cn("relative inline-block", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
    >
      {children}
      {mounted && isVisible && createPortal(
        <div
          style={{
            ...tooltipStyles,
            top: coords.top,
            left: coords.left,
          }}
          role="tooltip"
        >
          <div style={getArrowStyles()} />
          {content}
        </div>,
        document.body
      )}
    </div>
  );
}

interface HelpTooltipProps {
  content: ReactNode;
  position?: "top" | "bottom" | "left" | "right";
}

export function HelpTooltip({ content, position = "top" }: HelpTooltipProps) {
  return (
    <Tooltip content={content} position={position}>
      <button
        type="button"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "16px",
          height: "16px",
          borderRadius: "50%",
          backgroundColor: "rgba(71, 85, 105, 0.7)",
          color: "#cbd5e1",
          border: "1px solid rgba(100, 116, 139, 0.5)",
          fontSize: "11px",
          fontWeight: 600,
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
        aria-label="Hjelp"
      >
        ?
      </button>
    </Tooltip>
  );
}
