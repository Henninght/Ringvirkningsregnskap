/**
 * Frafall & Bevaringsverdi - Beregninger
 * Kalkulerer samfunnsøkonomiske konsekvenser av sykepleier-turnover
 */

import {
  FrafallInput,
  FrafallBeregning,
  FrafallFordeling,
  DEFAULT_FRAFALL_INPUT,
} from "@/types/frafall";
import { NSF_DATA } from "./nsfData";

/**
 * Beregn alle frafall-metrikker
 */
export function beregnFrafall(input: FrafallInput): FrafallBeregning {
  const {
    antallSykepleiere,
    turnoverRate,
    gjennomsnittLonn,
    fordeling,
    antallPasienter,
    bevaringsandel,
  } = input;

  // === ÅRLIG FRAFALL ===
  const aarligFrafall = Math.round(antallSykepleiere * (turnoverRate / 100));

  // === TAPT VERDISKAPING (ringvirkningsmodell) ===
  // Direkte verdi = lønn × ansatte
  const direkteVerdi = aarligFrafall * gjennomsnittLonn;
  // Indirekte verdi = 50% av direkte (leverandørkjede)
  const indirektVerdi = direkteVerdi * 0.5;
  // Indusert verdi = 30% av direkte (forbrukseffekt)
  const indusertVerdi = direkteVerdi * 0.3;
  // Total tapt verdiskaping
  const taptVerdiskaping = direkteVerdi + indirektVerdi + indusertVerdi;

  // === TAPT KAPASITET ===
  const arsverkTimer = NSF_DATA.konstanter.arsverkTimer;
  const taptKapasitetTimer = aarligFrafall * arsverkTimer;
  const taptAarsverk = aarligFrafall;

  // === REKRUTTERINGSKOSTNAD ===
  // Total kostnad inkl. opplæring og produktivitetstap (~1.5-2x årslønn)
  const rekrutteringsMultiplikator = 1.5;
  const rekrutteringskostnad = aarligFrafall * gjennomsnittLonn * rekrutteringsMultiplikator;

  // === PASIENTBELASTNING ===
  const pasientPerSykepleierNaa = antallPasienter / antallSykepleiere;
  const sykepleierEtterFrafall = Math.max(1, antallSykepleiere - aarligFrafall);
  const pasientPerSykepleierEtterFrafall = antallPasienter / sykepleierEtterFrafall;

  // Med bevaringstiltak
  const antallBevart = Math.round(aarligFrafall * (bevaringsandel / 100));
  const sykepleierMedBevaring = antallSykepleiere - aarligFrafall + antallBevart;
  const pasientPerSykepleierMedBevaring = antallPasienter / Math.max(1, sykepleierMedBevaring);

  const endringPasientbelastning = pasientPerSykepleierEtterFrafall - pasientPerSykepleierNaa;

  // === GEVINST VED BEVARING ===
  // Potensiell besparing = unngått rekrutteringskostnad
  const potensiellBesparing = antallBevart * gjennomsnittLonn * rekrutteringsMultiplikator;

  // Unngått vikarbruk (estimat: vikar koster 2.5x fast ansatt)
  const vikarMultiplikator = NSF_DATA.konstanter.vikarMultiplikator;
  const vikarTimepris = NSF_DATA.konstanter.gjennomsnittTimeprisVikar;
  const fastTimepris = NSF_DATA.konstanter.gjennomsnittTimeprisFast;
  const timerPerAar = arsverkTimer;

  // Hvis en sykepleier slutter, må vakansen dekkes med vikar i snitt 3 måneder
  const vikarPeriodeMnd = 3;
  const vikarTimer = (timerPerAar / 12) * vikarPeriodeMnd;
  const vikarKostnadPerFrafall = vikarTimer * vikarTimepris;
  const unngaattVikarbruk = antallBevart * vikarKostnadPerFrafall;

  // === FORDELING/FLYT ===
  const flytData = beregnFordeling(aarligFrafall, fordeling);

  return {
    // TAP
    aarligFrafall,
    taptVerdiskaping,
    taptKapasitetTimer,
    taptAarsverk,
    rekrutteringskostnad,

    // GEVINST
    potensiellBesparing,
    unngaattVikarbruk,
    antallBevart,

    // PASIENTBELASTNING
    pasientPerSykepleierNaa,
    pasientPerSykepleierEtterFrafall,
    pasientPerSykepleierMedBevaring,
    endringPasientbelastning,

    // FORDELING
    flytData,
  };
}

/**
 * Beregn fordeling av hvor sykepleiere går
 */
function beregnFordeling(
  aarligFrafall: number,
  fordeling: FrafallFordeling
): FrafallBeregning["flytData"] {
  // Normaliser fordelingen slik at den summerer til 100%
  const total = fordeling.privatHelse + fordeling.annenOffentlig +
                fordeling.annetYrke + fordeling.utAvArbeid;

  const faktor = total > 0 ? 100 / total : 1;

  return {
    tilPrivatHelse: Math.round(aarligFrafall * (fordeling.privatHelse * faktor / 100)),
    tilAnnenOffentlig: Math.round(aarligFrafall * (fordeling.annenOffentlig * faktor / 100)),
    tilAnnetYrke: Math.round(aarligFrafall * (fordeling.annetYrke * faktor / 100)),
    utAvArbeid: Math.round(aarligFrafall * (fordeling.utAvArbeid * faktor / 100)),
  };
}

/**
 * Beregn nasjonal kontekst for sammenligning
 */
export function beregnNasjonalKontekst(input: FrafallInput): {
  andelAvNasjonalt: number;
  bidragTilMangel: number;
  relativeToNationalTurnover: string;
} {
  const nasjonaltAntall = NSF_DATA.frafall.totaltAntallSykepleiere.verdi;
  const nasjonalTurnover = NSF_DATA.frafall.turnoverSengepostMedian.verdi;
  const mangel2035 = NSF_DATA.frafall.mangel2035.verdi;

  const andelAvNasjonalt = (input.antallSykepleiere / nasjonaltAntall) * 100;

  const aarligFrafall = input.antallSykepleiere * (input.turnoverRate / 100);
  const bidragTilMangel = (aarligFrafall / mangel2035) * 100;

  let relativeToNationalTurnover: string;
  if (input.turnoverRate < nasjonalTurnover - 2) {
    relativeToNationalTurnover = "under";
  } else if (input.turnoverRate > nasjonalTurnover + 2) {
    relativeToNationalTurnover = "over";
  } else {
    relativeToNationalTurnover = "rundt";
  }

  return {
    andelAvNasjonalt,
    bidragTilMangel,
    relativeToNationalTurnover,
  };
}

/**
 * Generer Sankey-data for visualisering
 */
export function genererFrafallSankeyData(beregning: FrafallBeregning) {
  const { flytData, aarligFrafall } = beregning;

  return {
    nodes: [
      { id: "Sykepleiere", color: "#3d838b" },          // petrol-500
      { id: "Privat helse", color: "#5a9fa6" },         // petrol-400
      { id: "Annen offentlig", color: "#7a9e7a" },      // sage-400
      { id: "Annet yrke", color: "#d9a04a" },           // sand-500
      { id: "Ut av arbeid", color: "#c4716c" },         // coral-400
    ],
    links: [
      { source: "Sykepleiere", target: "Privat helse", value: flytData.tilPrivatHelse },
      { source: "Sykepleiere", target: "Annen offentlig", value: flytData.tilAnnenOffentlig },
      { source: "Sykepleiere", target: "Annet yrke", value: flytData.tilAnnetYrke },
      { source: "Sykepleiere", target: "Ut av arbeid", value: flytData.utAvArbeid },
    ].filter(link => link.value > 0),
  };
}

/**
 * Formater tall for visning
 */
export function formaterFrafallVerdi(
  verdi: number,
  type: "antall" | "prosent" | "kroner" | "timer" | "ratio"
): string {
  const formatter = new Intl.NumberFormat("nb-NO", {
    maximumFractionDigits: type === "ratio" ? 1 : 0,
  });

  switch (type) {
    case "antall":
      return formatter.format(verdi);
    case "prosent":
      return `${formatter.format(verdi)}%`;
    case "kroner":
      if (verdi >= 1000000000) {
        return `${(verdi / 1000000000).toFixed(1)} mrd kr`;
      } else if (verdi >= 1000000) {
        return `${Math.round(verdi / 1000000)} mill kr`;
      } else if (verdi >= 1000) {
        return `${Math.round(verdi / 1000)} tusen kr`;
      }
      return `${formatter.format(verdi)} kr`;
    case "timer":
      if (verdi >= 1000000) {
        return `${(verdi / 1000000).toFixed(1)} mill timer`;
      } else if (verdi >= 1000) {
        return `${Math.round(verdi / 1000)} tusen timer`;
      }
      return `${formatter.format(verdi)} timer`;
    case "ratio":
      return `1:${formatter.format(verdi)}`;
    default:
      return formatter.format(verdi);
  }
}

/**
 * Generer argumenttekst basert på beregning
 */
export function genererFrafallArgument(
  beregning: FrafallBeregning,
  input: FrafallInput
): string {
  const { aarligFrafall, taptVerdiskaping, rekrutteringskostnad, pasientPerSykepleierEtterFrafall } = beregning;

  return `Hvert år forlater ${formaterFrafallVerdi(aarligFrafall, "antall")} sykepleiere ` +
    `ved en turnover på ${input.turnoverRate}%. Dette representerer en tapt verdiskaping på ` +
    `${formaterFrafallVerdi(taptVerdiskaping, "kroner")} og koster ` +
    `${formaterFrafallVerdi(rekrutteringskostnad, "kroner")} å erstatte. ` +
    `Pasientbelastningen øker fra ${formaterFrafallVerdi(input.antallPasienter / input.antallSykepleiere, "ratio")} ` +
    `til ${formaterFrafallVerdi(pasientPerSykepleierEtterFrafall, "ratio")} pasienter per sykepleier.`;
}
