"use client";

import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
}

export function LoadingSpinner({ size = "md", className, label }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  };

  return (
    <div className={cn("flex flex-col items-center gap-3", className)} role="status" aria-label={label || "Laster..."}>
      <div
        className={cn(
          "rounded-full border-slate-200 border-t-mint-500 animate-spin",
          sizeClasses[size]
        )}
      />
      {label && <span className="text-sm text-slate-500">{label}</span>}
    </div>
  );
}

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
  style?: React.CSSProperties;
}

export function Skeleton({ className, variant = "rectangular", width, height, style }: SkeletonProps) {
  const variantClasses = {
    text: "rounded",
    circular: "rounded-full",
    rectangular: "rounded-xl",
  };

  return (
    <div
      className={cn(
        "bg-slate-200 animate-pulse",
        variantClasses[variant],
        className
      )}
      style={{ width, height, ...style }}
      aria-hidden="true"
    />
  );
}

interface CardSkeletonProps {
  hasHeader?: boolean;
  hasChart?: boolean;
  lines?: number;
}

export function CardSkeleton({ hasHeader = true, hasChart = false, lines = 3 }: CardSkeletonProps) {
  return (
    <div className="bg-white rounded-2xl shadow-card border border-slate-100/50 p-6">
      {hasHeader && (
        <div className="mb-4">
          <Skeleton className="h-6 w-1/3 mb-2" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      )}
      {hasChart ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <div className="space-y-3">
          {Array.from({ length: lines }).map((_, i) => (
            <Skeleton key={i} className="h-4" style={{ width: `${100 - i * 15}%` }} />
          ))}
        </div>
      )}
    </div>
  );
}

interface KpiSkeletonProps {
  count?: number;
}

export function KpiSkeleton({ count = 3 }: KpiSkeletonProps) {
  return (
    <div className="grid grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="p-5 rounded-2xl border-2 border-slate-200 bg-white">
          <Skeleton className="h-4 w-20 mb-3" />
          <Skeleton className="h-9 w-24 mb-2" />
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
    </div>
  );
}
