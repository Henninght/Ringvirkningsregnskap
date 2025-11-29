"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
  variant?: "default" | "elevated" | "outlined" | "filled";
  style?: React.CSSProperties;
}

export function Card({
  children,
  className,
  hover = false,
  padding = "md",
  variant = "default",
  style,
}: CardProps) {
  const paddingClasses = {
    none: "",
    sm: "p-4",
    md: "p-5",
    lg: "p-6",
  };

  const variantClasses = {
    default: "bg-white shadow-card border border-slate-150",
    elevated: "bg-white shadow-elevated border border-slate-100",
    outlined: "bg-white border border-slate-200",
    filled: "bg-slate-50 border border-slate-100",
  };

  return (
    <div
      className={cn(
        "rounded-xl transition-all duration-200",
        variantClasses[variant],
        paddingClasses[padding],
        hover && "card-hover cursor-pointer hover:border-petrol-200",
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
  withBorder?: boolean;
}

export function CardHeader({ children, className, withBorder = false }: CardHeaderProps) {
  return (
    <div className={cn(
      "mb-4",
      withBorder && "pb-4 border-b border-slate-100",
      className
    )}>
      {children}
    </div>
  );
}

interface CardTitleProps {
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function CardTitle({ children, className, size = "md" }: CardTitleProps) {
  const sizeClasses = {
    sm: "text-sm font-medium",
    md: "text-base font-semibold",
    lg: "text-lg font-semibold",
  };

  return (
    <h3
      className={cn(
        "text-slate-800 tracking-tight",
        sizeClasses[size],
        className
      )}
      style={{ fontFamily: "var(--font-outfit)" }}
    >
      {children}
    </h3>
  );
}

interface CardDescriptionProps {
  children: ReactNode;
  className?: string;
}

export function CardDescription({ children, className }: CardDescriptionProps) {
  return (
    <p className={cn("text-sm text-slate-500 mt-1", className)}>
      {children}
    </p>
  );
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
  return <div className={cn("", className)}>{children}</div>;
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
  withBorder?: boolean;
}

export function CardFooter({ children, className, withBorder = false }: CardFooterProps) {
  return (
    <div className={cn(
      "mt-4",
      withBorder && "pt-4 border-t border-slate-100",
      className
    )}>
      {children}
    </div>
  );
}
