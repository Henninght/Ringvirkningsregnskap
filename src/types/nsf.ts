/**
 * NSF-spesifikke typer for politikkverktøyet
 */

import { DataPunktMedKilde } from "./kilde";

// Fane-typer
export type NsfPolitikkTab =
  | "ringvirkninger"
  | "fremtidsscenario"
  | "vikarkalkulator"
  | "bemanningseffekt"
  | "oppgavedeling"
  | "mobilisering"
  | "frafall"
  | "argumenter";

export const NSF_TABS: { id: NsfPolitikkTab; label: string; beskrivelse: string }[] = [
  { id: "ringvirkninger", label: "Ringvirkninger", beskrivelse: "Samfunnsøkonomiske effekter" },
  { id: "fremtidsscenario", label: "Fremtidsscenario", beskrivelse: "Prognoser og tiltak" },
  { id: "vikarkalkulator", label: "Vikarkalkulator", beskrivelse: "Beregn vikarkostnader" },
  { id: "bemanningseffekt", label: "Bemanning", beskrivelse: "Effekt av bemanningsendringer" },
  { id: "oppgavedeling", label: "Oppgavedeling", beskrivelse: "Frigjør sykepleierkapasitet" },
  { id: "mobilisering", label: "Mobilisering", beskrivelse: "17 000-argumentet" },
  { id: "frafall", label: "Frafall", beskrivelse: "Turnover og bevaringsverdi" },
  { id: "argumenter", label: "Argumenter", beskrivelse: "Generer politiske argumenter" },
];

// Vikarkalkulator
export interface VikarInput {
  vikartimer: number;       // Timer per måned
  timeprisVikar: number;    // Kr per time vikar
  timeprisFast: number;     // Kr per time fast ansatt
}

export interface VikarBeregning {
  arligVikarKost: number;
  arligFastKost: number;
  besparelse: number;
  multiplikator: number;
  andelAvNasjonalt: number; // % av totale 4 mrd
}

// Bemanningseffekt
export interface BemanningInput {
  endringAntall: number;    // +/- antall sykepleiere
  gjennomsnittLonn: number;
  lokalAndel: number;       // Andel i Norge (0-1)
}

export interface BemanningBeregning {
  verdiskaping: number;
  frigjorteArsverk: number;
  skatteeffekt: number;
  vikarkostnadEndring: number;
}

// Oppgavedeling
export interface OppgavedelingInput {
  oppgavetype: string;
  timerPerUke: number;
  antallSykepleiere: number;
}

export interface OppgavedelingBeregning {
  frigjorteArsverk: number;
  timerFrigjort: number;
  potensielleEkstrapasienter: number;
}

export const OPPGAVETYPER = [
  { id: "journalforing", label: "Journalføring", typiskTimer: 5 },
  { id: "medisinutdeling", label: "Medisinutdeling", typiskTimer: 3 },
  { id: "transport", label: "Pasienttransport", typiskTimer: 2 },
  { id: "bestilling", label: "Bestilling/logistikk", typiskTimer: 2 },
  { id: "renhold", label: "Renhold/rydding", typiskTimer: 1 },
  { id: "annet", label: "Annet administrativt", typiskTimer: 3 },
];

// Mobilisering
export interface MobiliseringInput {
  mobiliseringsAndel: number; // 0-100%
  forutsetninger: string[];
}

export interface MobiliseringBeregning {
  potensielleArsverk: number;
  redusertMangel: number;
  opprinneligMangel: number;
  gjenvarendeMangel: number;
}

export const MOBILISERING_FORUTSETNINGER = [
  { id: "lonn", label: "Konkurransedyktig lønn", beskrivelse: "650 000 kr for spesialsykepleiere" },
  { id: "arbeidstid", label: "Fleksibel arbeidstid", beskrivelse: "Tilpassede turnuser" },
  { id: "fagutvikling", label: "Faglig utvikling", beskrivelse: "Videreutdanning og spesialisering" },
  { id: "ledelse", label: "God ledelse", beskrivelse: "Faglig ledelse med beslutningsmyndighet" },
];

// Argumentgenerator
export interface ArgumentMal {
  id: string;
  tittel: string;
  motargument: string;       // "Vi har ikke flere folk"
  nsftSvar: string;          // Kort svar
  datapunkter: string[];     // Kilde-IDer som brukes
  beregninger: NsfPolitikkTab[]; // Kalkulatorer som støtter argumentet
}

export const ARGUMENT_MALER: ArgumentMal[] = [
  {
    id: "ikke-flere-folk",
    tittel: "Mobiliseringsargumentet",
    motargument: "Vi har ikke flere folk!",
    nsftSvar: "16% av sykepleiere jobber utenfor direkte pasientarbeid. Med bedre arbeidsvilkår kan flere mobiliseres til klinisk arbeid.",
    datapunkter: ["ssb-utenfor-sektor", "nav-mangel-2025"],
    beregninger: ["mobilisering"],
  },
  {
    id: "for-dyrt",
    tittel: "Vikarkost-argumentet",
    motargument: "Det er for dyrt å ansette flere!",
    nsftSvar: "Norge bruker 4 milliarder på vikarer årlig. Fast ansettelse er billigere og gir bedre kvalitet.",
    datapunkter: ["nsf-vikar-36mrd", "nsf-vikar-firedoblet"],
    beregninger: ["vikarkalkulator"],
  },
  {
    id: "oppgaver-ma-loses",
    tittel: "Oppgavedeling-argumentet",
    motargument: "Oppgavene må jo løses uansett!",
    nsftSvar: "Ved smart oppgavedeling kan sykepleiere frigjøres til kjerneoppgaver. Støttefunksjoner kan løses av andre.",
    datapunkter: ["nsf-oppgavedeling"],
    beregninger: ["oppgavedeling"],
  },
  {
    id: "tar-tid",
    tittel: "Fremskrivnings-argumentet",
    motargument: "Det tar for lang tid å utdanne flere!",
    nsftSvar: "SSB anslår 30 000 mangel i 2040. Uten handling i dag blir krisen uløselig.",
    datapunkter: ["ssb-fremskriving-2040", "nav-mangel-2025"],
    beregninger: ["bemanningseffekt"],
  },
];

// Eksportformat
export type EksportFormat = "pdf" | "faktaark" | "presentasjon" | "markdown";
