// KPI Data Types
export interface KpiData {
  verdiskaping: { value: number; change: number };
  sysselsetting: { value: number; change: number };
  skattebidrag: { value: number; change: number };
}

// Direct Effects Chart Data
export interface DirectEffect {
  name: string;
  fou: number;
  infrastruktur: number;
  lonninger: number;
  direkteEffekter: number;
}

// Sector Distribution Data
export interface SectorData {
  name: string;
  value: number;
  color: string;
}

// Historical Value Data
export interface HistoricalData {
  year: string;
  value: number;
}

// Project Data
export type ProjectStatus = "aktiv" | "fullfort" | "planlagt";

export interface Project {
  id: string;
  name: string;
  value: string;
  status: ProjectStatus;
}

// Navigation Items
export interface NavItem {
  id: string;
  icon: string;
  label: string;
  href: string;
  active?: boolean;
}

// Insight Data
export interface Insight {
  id: string;
  title: string;
  content: string;
}
