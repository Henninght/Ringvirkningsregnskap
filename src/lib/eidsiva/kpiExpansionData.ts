import { EIDSIVA_NOKKELTALL, KILDER } from "./eidsivaData";
import type { KpiExpansionData } from "@/types/kpiExpansion";

export const KPI_EXPANSION_DATA: Record<string, KpiExpansionData> = {
  vannkraft: {
    title: "6,2 TWh vannkraft tilsvarer:",
    metrics: [
      {
        label: "Husholdninger forsynt",
        value: EIDSIVA_NOKKELTALL.vannkraftTilsvarer.husholdninger,
        unit: "husholdninger",
        icon: "Home",
        category: "people",
      },
      {
        label: "Innbyggere nådd",
        value: EIDSIVA_NOKKELTALL.vannkraftTilsvarer.innbyggere,
        unit: "innbyggere",
        icon: "Users",
        category: "people",
      },
      {
        label: "CO₂-besparelse per år",
        value: EIDSIVA_NOKKELTALL.vannkraftTilsvarer.co2BesparelseTonn,
        unit: "tonn CO₂",
        icon: "Leaf",
        category: "environment",
      },
      {
        label: "Elbilladinger",
        value: EIDSIVA_NOKKELTALL.vannkraftTilsvarer.elbilladinger,
        unit: "ladinger (16,3 kWh)",
        icon: "Zap",
        category: "transport",
      },
      {
        label: "El-tog kjørestrekning",
        value: EIDSIVA_NOKKELTALL.vannkraftTilsvarer.elTogKm,
        unit: "km",
        icon: "Train",
        category: "transport",
      },
      {
        label: "El-buss kjørestrekning",
        value: EIDSIVA_NOKKELTALL.vannkraftTilsvarer.elBussKm,
        unit: "km",
        icon: "Bus",
        category: "transport",
      },
      {
        label: "Idrettshaller",
        value: EIDSIVA_NOKKELTALL.vannkraftTilsvarer.idrettshaller,
        unit: "haller (25 × 45 m)",
        icon: "Dumbbell",
        category: "infrastructure",
      },
      {
        label: "Sykehus",
        value: EIDSIVA_NOKKELTALL.vannkraftTilsvarer.sykehus,
        unit: "sykehus",
        icon: "Hospital",
        category: "infrastructure",
      },
      {
        label: "Grunnskoler",
        value: EIDSIVA_NOKKELTALL.vannkraftTilsvarer.grunnskoler,
        unit: "skoler",
        icon: "GraduationCap",
        category: "infrastructure",
      },
    ],
    kilde: KILDER.fornybarEnergi,
  },
  biokraft: {
    title: "485 GWh biokraft tilsvarer:",
    metrics: [
      {
        label: "Husholdninger forsynt",
        value: EIDSIVA_NOKKELTALL.biokraftTilsvarer.husholdninger,
        unit: "husholdninger",
        icon: "Home",
        category: "people",
      },
      {
        label: "Innbyggere nådd",
        value: EIDSIVA_NOKKELTALL.biokraftTilsvarer.innbyggere,
        unit: "innbyggere",
        icon: "Users",
        category: "people",
      },
      {
        label: "CO₂-besparelse per år",
        value: EIDSIVA_NOKKELTALL.biokraftTilsvarer.co2BesparelseTonn,
        unit: "tonn CO₂",
        icon: "Leaf",
        category: "environment",
      },
      {
        label: "Idrettshaller varme",
        value: EIDSIVA_NOKKELTALL.biokraftTilsvarer.idrettshallerVarme,
        unit: "haller",
        icon: "Dumbbell",
        category: "infrastructure",
      },
      {
        label: "Svømmehaller varme",
        value: EIDSIVA_NOKKELTALL.biokraftTilsvarer.svommehallerVarme,
        unit: "haller",
        icon: "Waves",
        category: "infrastructure",
      },
      {
        label: "Skoler varme",
        value: EIDSIVA_NOKKELTALL.biokraftTilsvarer.skolerVarme,
        unit: "skoler",
        icon: "GraduationCap",
        category: "infrastructure",
      },
      {
        label: "Sykehjem varme",
        value: EIDSIVA_NOKKELTALL.biokraftTilsvarer.sykehjemVarme,
        unit: "sykehjem",
        icon: "Heart",
        category: "infrastructure",
      },
      {
        label: "Fotballbaner undervarme",
        value: EIDSIVA_NOKKELTALL.biokraftTilsvarer.fotballbanerUndervarme,
        unit: "baner",
        icon: "Goal",
        category: "infrastructure",
      },
    ],
    kilde: KILDER.fornybarEnergi,
  },
  stromforsyning: {
    title: "426k husholdninger tilsvarer:",
    metrics: [
      {
        label: "Totale husholdninger",
        value:
          EIDSIVA_NOKKELTALL.vannkraftTilsvarer.husholdninger +
          EIDSIVA_NOKKELTALL.biokraftTilsvarer.husholdninger,
        unit: "husholdninger",
        icon: "Home",
        category: "people",
      },
      {
        label: "Totale innbyggere",
        value:
          EIDSIVA_NOKKELTALL.vannkraftTilsvarer.innbyggere +
          EIDSIVA_NOKKELTALL.biokraftTilsvarer.innbyggere,
        unit: "innbyggere",
        icon: "Users",
        category: "people",
      },
      {
        label: "Total CO₂-besparelse",
        value:
          EIDSIVA_NOKKELTALL.vannkraftTilsvarer.co2BesparelseTonn +
          EIDSIVA_NOKKELTALL.biokraftTilsvarer.co2BesparelseTonn,
        unit: "tonn CO₂ per år",
        icon: "Leaf",
        category: "environment",
      },
    ],
    kilde: KILDER.fornybarEnergi,
  },
};
