import { EIDSIVA_NOKKELTALL, KILDER } from "./eidsivaData";
import type { KpiExpansionData } from "@/types/kpiExpansion";

export const KPI_EXPANSION_DATA: Record<string, KpiExpansionData> = {
  // =============================================================================
  // PRODUKSJON - Vannkraft + Biokraft kombinert
  // =============================================================================
  produksjon: {
    title: "6,7 TWh fornybar energi fordelt på:",
    metrics: [
      {
        label: "Vannkraft",
        value: EIDSIVA_NOKKELTALL.vannkraft.produksjonGWh,
        unit: "GWh via Hafslund Kraft",
        icon: "Droplets",
        category: "production",
        kilde: KILDER.fornybarEnergi,
      },
      {
        label: "Biokraft & fjernvarme",
        value: EIDSIVA_NOKKELTALL.biokraft.produksjonGWh,
        unit: "GWh fra 16 varmesentraler",
        icon: "Flame",
        category: "production",
        kilde: KILDER.fornybarEnergi,
      },
      {
        label: "Vannkraftverk",
        value: EIDSIVA_NOKKELTALL.vannkraft.antallKraftverk,
        unit: "kraftverk",
        icon: "Factory",
        category: "infrastructure",
        kilde: KILDER.fornybarEnergi,
      },
      {
        label: "Andel av Norges produksjon",
        value: EIDSIVA_NOKKELTALL.vannkraft.andelAvNorge,
        unit: "prosent",
        icon: "PieChart",
        category: "scale",
        kilde: KILDER.fornybarEnergi,
      },
      {
        label: "Fornybarandel biokraft",
        value: EIDSIVA_NOKKELTALL.biokraft.fornybartBrensel,
        unit: "% (mål: 100% innen 2030)",
        icon: "Leaf",
        category: "environment",
        kilde: KILDER.fornybarEnergi,
      },
      {
        label: "Total CO₂-besparelse",
        value:
          EIDSIVA_NOKKELTALL.vannkraftTilsvarer.co2BesparelseTonn +
          EIDSIVA_NOKKELTALL.biokraftTilsvarer.co2BesparelseTonn,
        unit: "tonn CO₂ per år",
        icon: "TreeDeciduous",
        category: "environment",
        kilde: KILDER.fornybarEnergi,
      },
    ],
    kilde: KILDER.fornybarEnergi,
  },

  // =============================================================================
  // DISTRIBUSJON - Elvia nett + bredbånd + kritisk infrastruktur
  // =============================================================================
  distribusjon: {
    title: "Elvia-nettet leverer til:",
    metrics: [
      {
        label: "Mennesker med strøm",
        value: EIDSIVA_NOKKELTALL.kundedekning.innbyggereMedStrom,
        unit: "innbyggere",
        icon: "Users",
        category: "people",
        kilde: KILDER.nettLeveranse,
      },
      {
        label: "Bredbånd-kunder",
        value: EIDSIVA_NOKKELTALL.kundedekning.husstanderMedBredbånd,
        unit: "husstander",
        icon: "Wifi",
        category: "connectivity",
        kilde: KILDER.nettLeveranse,
      },
      {
        label: "Kritisk infrastruktur",
        value: "Sykehus, militærleire, brannstasjoner",
        unit: "",
        icon: "ShieldCheck",
        category: "critical",
        kilde: KILDER.kritiskInfrastruktur,
      },
      {
        label: "Geografisk dekning",
        value: "Innlandet + Oslo",
        unit: "",
        icon: "MapPin",
        category: "coverage",
        kilde: KILDER.regionaltKart,
      },
      {
        label: "Kommuner som eier",
        value: EIDSIVA_NOKKELTALL.eierskap.kommunerInnlandet,
        unit: "kommuner i Innlandet",
        icon: "Building2",
        category: "ownership",
        kilde: KILDER.eierstruktur,
      },
      {
        label: "Andre eiere",
        value: "Oslo kommune, Innlandet fylke",
        unit: "",
        icon: "Landmark",
        category: "ownership",
        kilde: KILDER.eierstruktur,
      },
    ],
    kilde: KILDER.nettLeveranse,
  },

  // =============================================================================
  // SAMFUNNSVERDI - Hva energien muliggjør
  // =============================================================================
  samfunnsverdi: {
    title: "Energien muliggjør:",
    metrics: [
      {
        label: "Husholdninger forsynt",
        value:
          EIDSIVA_NOKKELTALL.vannkraftTilsvarer.husholdninger +
          EIDSIVA_NOKKELTALL.biokraftTilsvarer.husholdninger,
        unit: "husholdninger",
        icon: "Home",
        category: "people",
        kilde: KILDER.fornybarEnergi,
      },
      {
        label: "Sykehus i drift",
        value: EIDSIVA_NOKKELTALL.vannkraftTilsvarer.sykehus,
        unit: "sykehus",
        icon: "Hospital",
        category: "critical",
        kilde: KILDER.velferdsbidrag,
      },
      {
        label: "Grunnskoler",
        value: EIDSIVA_NOKKELTALL.vannkraftTilsvarer.grunnskoler,
        unit: "skoler",
        icon: "GraduationCap",
        category: "infrastructure",
        kilde: KILDER.velferdsbidrag,
      },
      {
        label: "Sykehjem varmet",
        value: EIDSIVA_NOKKELTALL.biokraftTilsvarer.sykehjemVarme,
        unit: "sykehjem",
        icon: "Heart",
        category: "care",
        kilde: KILDER.fornybarEnergi,
      },
      {
        label: "Elbil-ladinger",
        value: EIDSIVA_NOKKELTALL.vannkraftTilsvarer.elbilladinger,
        unit: "ladinger per år",
        icon: "Car",
        category: "transport",
        kilde: KILDER.fornybarEnergi,
      },
      {
        label: "Idrettshaller",
        value:
          EIDSIVA_NOKKELTALL.vannkraftTilsvarer.idrettshaller +
          EIDSIVA_NOKKELTALL.biokraftTilsvarer.idrettshallerVarme,
        unit: "haller driftet/varmet",
        icon: "Dumbbell",
        category: "community",
        kilde: KILDER.breddeidrett,
      },
    ],
    kilde: KILDER.velferdsbidrag,
  },

  // =============================================================================
  // LEGACY - Behold for bakoverkompatibilitet
  // =============================================================================
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
        label: "CO₂-besparelse per år",
        value: EIDSIVA_NOKKELTALL.biokraftTilsvarer.co2BesparelseTonn,
        unit: "tonn CO₂",
        icon: "Leaf",
        category: "environment",
      },
    ],
    kilde: KILDER.fornybarEnergi,
  },
  stromforsyning: {
    title: "426k husholdninger tilsvarer:",
    metrics: [
      {
        label: "Totale innbyggere",
        value:
          EIDSIVA_NOKKELTALL.vannkraftTilsvarer.innbyggere +
          EIDSIVA_NOKKELTALL.biokraftTilsvarer.innbyggere,
        unit: "innbyggere",
        icon: "Users",
        category: "people",
      },
    ],
    kilde: KILDER.fornybarEnergi,
  },
};
