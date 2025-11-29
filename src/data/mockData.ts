import {
  KpiData,
  DirectEffect,
  SectorData,
  HistoricalData,
  Project,
  Insight,
} from "@/types";

export const kpiData: KpiData = {
  verdiskaping: { value: 1.2, change: 5 },
  sysselsetting: { value: 4500, change: 2 },
  skattebidrag: { value: 300, change: 7 },
};

export const directEffectsData: DirectEffect[] = [
  { name: "Q1", fou: 200, infrastruktur: 400, lonninger: 600, direkteEffekter: 300 },
  { name: "Q2", fou: 250, infrastruktur: 450, lonninger: 650, direkteEffekter: 350 },
  { name: "Q3", fou: 300, infrastruktur: 500, lonninger: 700, direkteEffekter: 400 },
  { name: "Q4", fou: 350, infrastruktur: 550, lonninger: 750, direkteEffekter: 450 },
  { name: "Q5", fou: 400, infrastruktur: 600, lonninger: 800, direkteEffekter: 500 },
];

export const sectorData: SectorData[] = [
  { name: "Teknologi", value: 40, color: "#3d838b" },
  { name: "Tjenester", value: 35, color: "#5c825c" },
  { name: "Industri", value: 25, color: "#6b74a8" },
];

export const historicalData: HistoricalData[] = [
  { year: "2019", value: 2.1 },
  { year: "2020", value: 2.8 },
  { year: "2021", value: 3.5 },
  { year: "2022", value: 4.8 },
  { year: "2023", value: 6.2 },
  { year: "2024", value: 7.5 },
];

export const projectsData: Project[] = [
  { id: "1", name: "Prosjekt Alfa", value: "1,2 mrd", status: "aktiv" },
  { id: "2", name: "Prosjekt Beta", value: "1 000 mill", status: "aktiv" },
  { id: "3", name: "Prosjekt Gamma", value: "2 500 mill", status: "fullfort" },
  { id: "4", name: "Prosjekt Delta", value: "1 000 mill", status: "aktiv" },
];

export const insightsData: Insight[] = [
  {
    id: "1",
    title: "Hovedfunn",
    content:
      "Detaljert analyse viser at FoU-investeringer er den primære driveren for direkte verdiskaping. Teknologisektoren dominerer med 40% av total verdi.",
  },
  {
    id: "2",
    title: "Lokale ringvirkninger",
    content:
      "Organisasjonen skaper betydelige lokale ringvirkninger gjennom forbruk i lokalsamfunnet, leverandørkjeder og arbeidsplasser i helse- og omsorgssektoren.",
  },
];
