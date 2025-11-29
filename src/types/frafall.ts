/**
 * Frafall & Bevaringsverdi - Types
 * Analyseverktøy for sykepleier-turnover og samfunnsøkonomiske konsekvenser
 */

import { DataPunktMedKilde } from "./kilde";

/**
 * Fordeling av hvor sykepleiere går når de slutter
 * Basert på SSB-data: 85% i helse, 15% utenfor
 */
export interface FrafallFordeling {
  /** Vikarbyråer, privat helsesektor */
  privatHelse: number;
  /** NAV, utdanning, forskning, administrasjon */
  annenOffentlig: number;
  /** Helt ut av helsesektoren, annet yrke */
  annetYrke: number;
  /** Pensjon, AAP, uførhet, permisjon */
  utAvArbeid: number;
}

/**
 * Input for frafallsberegninger
 */
export interface FrafallInput {
  /** Antall sykepleiere i enheten/kommunen/regionen */
  antallSykepleiere: number;
  /** Årlig turnover-rate i prosent (default: 12%) */
  turnoverRate: number;
  /** Gjennomsnittlig årslønn i kr (default: 582,000) */
  gjennomsnittLonn: number;
  /** Fordeling av hvor de som slutter går (må summere til 100%) */
  fordeling: FrafallFordeling;
  /** Antall pasienter i enheten (for pasientbelastning) */
  antallPasienter: number;
  /** Bevaringsandel - hvor mange % kan beholdes med tiltak (0-100) */
  bevaringsandel: number;
}

/**
 * Resultat fra frafallsberegning
 */
export interface FrafallBeregning {
  // === TAP-SIDEN ===
  /** Antall sykepleiere som slutter årlig */
  aarligFrafall: number;
  /** Tapt verdiskaping (direkte + indirekte + indusert) */
  taptVerdiskaping: number;
  /** Tapte arbeidstimer per år */
  taptKapasitetTimer: number;
  /** Tapte årsverk */
  taptAarsverk: number;
  /** Kostnad for å rekruttere og lære opp erstatninger */
  rekrutteringskostnad: number;

  // === GEVINST-SIDEN ===
  /** Potensiell besparing ved å beholde bevaringsandel */
  potensiellBesparing: number;
  /** Unngått vikarbruk i kroner */
  unngaattVikarbruk: number;
  /** Antall sykepleiere som kan beholdes */
  antallBevart: number;

  // === PASIENTBELASTNING ===
  /** Nåværende pasienter per sykepleier */
  pasientPerSykepleierNaa: number;
  /** Pasienter per sykepleier etter årlig frafall */
  pasientPerSykepleierEtterFrafall: number;
  /** Pasienter per sykepleier med bevaringstiltak */
  pasientPerSykepleierMedBevaring: number;
  /** Endring i pasientbelastning */
  endringPasientbelastning: number;

  // === FORDELING/FLYT ===
  /** Data for Sankey-visualisering */
  flytData: {
    tilPrivatHelse: number;
    tilAnnenOffentlig: number;
    tilAnnetYrke: number;
    utAvArbeid: number;
  };
}

/**
 * Default-verdier for frafall-input
 */
export const DEFAULT_FRAFALL_INPUT: FrafallInput = {
  antallSykepleiere: 100,
  turnoverRate: 12,
  gjennomsnittLonn: 582000,
  fordeling: {
    privatHelse: 40,      // 40% av de som slutter
    annenOffentlig: 20,   // 20% til annen offentlig
    annetYrke: 15,        // 15% helt ut
    utAvArbeid: 25,       // 25% ut av arbeidslivet
  },
  antallPasienter: 80,
  bevaringsandel: 30,
};

/**
 * Default-fordeling basert på SSB-data
 * Av de som forlater helsetjenesten:
 * - Mange til vikarbyråer (telles som privat helse)
 * - NAV, utdanning, forskning, administrasjon
 * - Helt ut av helse
 * - Ut av arbeidslivet (pensjon, AAP, etc.)
 */
export const DEFAULT_FORDELING: FrafallFordeling = {
  privatHelse: 40,
  annenOffentlig: 20,
  annetYrke: 15,
  utAvArbeid: 25,
};

/**
 * Nasjonal kontekst for sammenligning
 */
export interface NasjonalFrafallKontekst {
  /** Totalt antall sykepleiere i Norge */
  totaltAntallSykepleiere: DataPunktMedKilde;
  /** Gjennomsnittlig turnover nasjonalt */
  nasjonalTurnover: DataPunktMedKilde;
  /** Andel utenfor helsetjenesten */
  andelUtenforHelse: DataPunktMedKilde;
  /** Fremtidig mangel 2035 */
  mangel2035: DataPunktMedKilde;
}

/**
 * Kategori-labels for visning
 */
export const FRAFALL_KATEGORI_LABELS: Record<keyof FrafallFordeling, string> = {
  privatHelse: "Privat helse / Vikarbyrå",
  annenOffentlig: "Annen offentlig sektor",
  annetYrke: "Annet yrke",
  utAvArbeid: "Ut av arbeidslivet",
};

/**
 * Farger for kategorier (matcher NSF fargepalett)
 */
export const FRAFALL_KATEGORI_FARGER: Record<keyof FrafallFordeling, string> = {
  privatHelse: "#5a9fa6",     // petrol-400
  annenOffentlig: "#7a9e7a",  // sage-400
  annetYrke: "#d9a04a",       // sand-500
  utAvArbeid: "#c4716c",      // coral-400
};
