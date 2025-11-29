import { type ClassValue, clsx } from "clsx";

// Simple classname merger (without tailwind-merge for simplicity)
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// Format large numbers with Norwegian locale
export function formatNumber(value: number, decimals = 0): string {
  return new Intl.NumberFormat("nb-NO", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

// Format currency values
export function formatCurrency(
  value: number,
  unit: "mrd" | "mill" = "mrd"
): string {
  const formatted = formatNumber(value, 1);
  return `${formatted} ${unit}`;
}

// Format percentage change with sign
export function formatChange(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value}%`;
}

// Get status color classes
export function getStatusColor(status: string): string {
  switch (status) {
    case "aktiv":
      return "bg-mint-500 text-white";
    case "fullfort":
      return "bg-teal-500 text-white";
    case "planlagt":
      return "bg-lavender-300 text-white";
    default:
      return "bg-slate-300 text-slate-700";
  }
}

// Get status label in Norwegian
export function getStatusLabel(status: string): string {
  switch (status) {
    case "aktiv":
      return "Aktiv";
    case "fullfort":
      return "Fullført";
    case "planlagt":
      return "Planlagt";
    default:
      return status;
  }
}
