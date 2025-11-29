"use client";

import { cn } from "@/lib/utils";
import { ProjectStatus } from "@/types";

interface StatusBadgeProps {
  status: ProjectStatus;
  className?: string;
  size?: "sm" | "md";
  withDot?: boolean;
}

const statusConfig: Record<
  ProjectStatus,
  {
    label: string;
    bgColor: string;
    textColor: string;
    dotColor: string;
    borderColor: string;
  }
> = {
  aktiv: {
    label: "Aktiv",
    bgColor: "bg-success-50",
    textColor: "text-success-700",
    dotColor: "bg-success-500",
    borderColor: "border-success-200",
  },
  fullfort: {
    label: "Fullfort",
    bgColor: "bg-petrol-50",
    textColor: "text-petrol-700",
    dotColor: "bg-petrol-500",
    borderColor: "border-petrol-200",
  },
  planlagt: {
    label: "Planlagt",
    bgColor: "bg-indigo-50",
    textColor: "text-indigo-700",
    dotColor: "bg-indigo-400",
    borderColor: "border-indigo-200",
  },
};

export function StatusBadge({
  status,
  className,
  size = "md",
  withDot = true,
}: StatusBadgeProps) {
  const config = statusConfig[status];

  const sizeClasses = {
    sm: "px-2 py-0.5 text-2xs",
    md: "px-2.5 py-1 text-xs",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium border",
        sizeClasses[size],
        config.bgColor,
        config.textColor,
        config.borderColor,
        className
      )}
    >
      {withDot && (
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full",
            config.dotColor,
            status === "aktiv" && "status-dot-active"
          )}
        />
      )}
      {config.label}
    </span>
  );
}
