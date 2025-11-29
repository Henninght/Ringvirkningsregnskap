"use client";

import { useState, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface AccordionProps {
  /** Tittel som vises i header */
  title: string;
  /** Valgfritt ikon ved siden av tittel */
  icon?: ReactNode;
  /** Om accordion skal være åpen som default */
  defaultOpen?: boolean;
  /** Innholdet som vises når accordion er åpen */
  children: ReactNode;
  /** Ekstra CSS-klasser */
  className?: string;
  /** Callback når accordion åpnes/lukkes */
  onToggle?: (isOpen: boolean) => void;
  /** Variant for styling */
  variant?: "default" | "subtle" | "card";
}

export function Accordion({
  title,
  icon,
  defaultOpen = false,
  children,
  className,
  onToggle,
  variant = "default",
}: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const handleToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    onToggle?.(newState);
  };

  const variantStyles = {
    default: {
      container: "border-b border-slate-200",
      header: "py-3 hover:bg-slate-50",
      content: "pb-4",
    },
    subtle: {
      container: "",
      header: "py-2 hover:bg-slate-50 rounded-lg px-2 -mx-2",
      content: "pt-2",
    },
    card: {
      container: "bg-white rounded-xl border border-slate-200 shadow-sm",
      header: "p-4 hover:bg-slate-50 rounded-t-xl",
      content: "px-4 pb-4",
    },
  };

  const styles = variantStyles[variant];

  return (
    <div className={cn(styles.container, className)}>
      <button
        type="button"
        onClick={handleToggle}
        className={cn(
          "w-full flex items-center justify-between text-left transition-colors",
          styles.header
        )}
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2">
          {icon && <span className="text-slate-500">{icon}</span>}
          <span className="text-sm font-medium text-slate-700">{title}</span>
        </div>
        <ChevronDown
          size={16}
          className={cn(
            "text-slate-400 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      <div
        className={cn(
          "grid transition-all duration-200 ease-in-out",
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <div className={styles.content}>{children}</div>
        </div>
      </div>
    </div>
  );
}

interface AccordionGroupProps {
  children: ReactNode;
  className?: string;
}

export function AccordionGroup({ children, className }: AccordionGroupProps) {
  return (
    <div className={cn("divide-y divide-slate-200", className)}>
      {children}
    </div>
  );
}
