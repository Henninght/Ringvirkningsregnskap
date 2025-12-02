/**
 * Eidsiva Energi - Type definitions for ripple effect calculations
 * Based on 4-category model: Hoved, Økonomiske, Sosiale, Bærekraftige
 */

// =============================================================================
// 1. HOVEDRINGVIRKNINGER (Main Ripple Effects)
// =============================================================================

export interface DirektEffekter {
  lonninger: number;        // Lønnskostnader
  investeringer: number;    // Investeringer i infrastruktur
  byggOgAnlegg: number;     // Bygg og anlegg
  drift: number;            // Driftskostnader
  beredskap: number;        // Beredskapskostnader
  skatt: number;            // Skattebidrag
  utbytte: number;          // Utbytte til eiere
}

export interface IndirektEffekter {
  leverandorVerdiskaping: number;   // Total verdiskaping hos leverandører
  leverandorAntall: number;         // Antall leverandører
  leverandorAnsatte: number;        // Estimert sysselsetting hos leverandører
}

export interface ForbruksEffekter {
  ansattForbruk: number;            // Ansattes forbruk i lokalsamfunn
  leverandorAnsattForbruk: number;  // Leverandøransattes forbruk
  totalLokalForbruk: number;        // Total lokal forbrukseffekt
}

export interface HovedRingvirkninger {
  direkte: DirektEffekter;
  indirekte: IndirektEffekter;
  forbruk: ForbruksEffekter;
  totalVerdiskaping: number;
}

// =============================================================================
// 2. ØKONOMISKE RINGVIRKNINGER (Economic Ripple Effects)
// =============================================================================

export interface RegionalVerdiskaping {
  region: "innlandet" | "oslo" | "annet";
  verdiskaping: number;
  andel: number; // Prosentandel
}

export interface OkonomiskeRingvirkninger {
  verdibidragPerRegion: RegionalVerdiskaping[];
  offentligVelferd: {
    skattOgAvgifter: number;
    arbeidsgiveravgift: number;
    selskapsskatt: number;
    totalBidrag: number;
  };
  lokalOkonomiskVekst: {
    sysselsettingsBidrag: number;      // Antall arbeidsplasser
    lonnssumBidrag: number;            // Total lønnssum
    multiplikatorEffekt: number;        // Ringvirknings-multiplikator
  };
  norskNaeringsliv: {
    norskeLeverandorer: number;        // Andel norske leverandører
    verdiskapingNorge: number;
  };
  kritiskInfrastruktur: {
    strømforsyning: boolean;
    fjernvarme: boolean;
    bredbånd: boolean;
    beskrivelse: string;
  };
}

// =============================================================================
// 3. SOSIALE RINGVIRKNINGER (Social Ripple Effects)
// =============================================================================

export interface IdrettsBidrag {
  navn: string;
  type: "bredde" | "topp";
  belop: number;
  beskrivelse?: string;
}

export interface SosialeRingvirkninger {
  breddeIdrett: {
    antallLagOgForeninger: number;
    totalStotte: number;
    medlemmerNadd: number;
    bidrag: IdrettsBidrag[];
  };
  toppIdrett: {
    sponsorater: IdrettsBidrag[];
    totalSponsing: number;
    synlighet: string;          // F.eks. "Vålerenga - kraft til å inspirere"
  };
  lokalsamfunnsBidrag: {
    prosjekter: string[];
    totalBidrag: number;
    frivillighetStotte: number;
  };
}

// =============================================================================
// 4. BÆREKRAFTIGE RINGVIRKNINGER (Sustainability Ripple Effects)
// =============================================================================

export interface FornybartBidrag {
  kraftproduksjonGWh: number;
  fornybartAndel: number;       // Prosent fornybar
  co2Besparelse: number;        // Tonn CO2 spart vs. fossil
}

export interface BaerekraftsMal {
  malNummer: number;            // FN bærekraftsmål nummer (1-17)
  navn: string;
  bidragBeskrivelse: string;
  partnere?: string[];          // F.eks. ["Vålerenga"]
}

export interface BaerekraftigeRingvirkninger {
  fornybarEnergi: FornybartBidrag;
  fnBaerekraftsmal: BaerekraftsMal[];
  miljotiltak: {
    beskrivelse: string;
    investering: number;
  }[];
}

// =============================================================================
// SAMLET EIDSIVA DATAMODELL
// =============================================================================

export interface EidsivaRingvirkninger {
  // Metadata
  metadata: {
    ar: number;
    rapportDato: string;
    kilde: string;
    sistOppdatert: string;
  };

  // Organisasjonsinfo
  organisasjon: EidsivaOrganisasjon;

  // De 4 hovedkategoriene
  hoved: HovedRingvirkninger;
  okonomiske: OkonomiskeRingvirkninger;
  sosiale: SosialeRingvirkninger;
  baerekraftige: BaerekraftigeRingvirkninger;

  // Aggregerte totaler
  totaler: EidsivaTotaler;
}

export interface EidsivaOrganisasjon {
  navn: string;
  konsernstruktur: string[];    // Datterselskaper
  ansatte: number;
  hovedkontor: string;
  regioner: ("innlandet" | "oslo")[];
  forretningsomrader: ("kraftproduksjon" | "nett" | "fjernvarme" | "bredbånd")[];
}

export interface EidsivaTotaler {
  totalVerdiskaping: number;
  totalSysselsetting: number;
  totalSkattebidrag: number;
  totalSosialeBidrag: number;
  multiplikatorEffekt: number;
}

// =============================================================================
// SCENARIOER
// =============================================================================

export interface EidsivaScenario {
  id: string;
  navn: string;
  beskrivelse: string;
  type: "investering" | "ansettelse" | "produksjon" | "beredskap" | "custom";
  endringer: {
    investeringEndring?: number;
    ansatteEndring?: number;
    produksjonEndringGWh?: number;
    leverandorEndring?: number;
  };
}

// =============================================================================
// FARGER
// =============================================================================

export const EIDSIVA_COLORS = {
  // Hovedfarger - mørk, minimalistisk stil
  primary: "#1C1C1E",
  background: "#0D1117",
  text: "#FFFFFF",
  accent: "#F5F5F5",

  // Kategorifarger for diagrammer
  hoved: {
    direkte: "#3B82F6",     // Blå
    indirekte: "#8B5CF6",   // Lilla
    forbruk: "#EC4899",     // Rosa
  },
  okonomiske: "#10B981",    // Grønn
  sosiale: "#F59E0B",       // Gul/oransje
  baerekraftige: "#06B6D4", // Cyan

  // Regionfarger
  regioner: {
    innlandet: "#6366F1",   // Indigo
    oslo: "#F59E0B",        // Gul/oransje
  },
} as const;
