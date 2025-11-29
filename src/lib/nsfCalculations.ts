/**
 * NSF-spesifikke beregninger
 */

import {
  VikarInput,
  VikarBeregning,
  BemanningInput,
  BemanningBeregning,
  OppgavedelingInput,
  OppgavedelingBeregning,
  MobiliseringInput,
  MobiliseringBeregning,
} from "@/types/nsf";
import { NSF_DATA } from "./nsfData";

/**
 * Vikarkalkulator - beregn besparelse ved å erstatte vikarer med faste ansatte
 */
export function beregnVikarKost(input: VikarInput): VikarBeregning {
  const arligVikarKost = input.vikartimer * 12 * input.timeprisVikar;
  const arligFastKost = input.vikartimer * 12 * input.timeprisFast;
  const besparelse = arligVikarKost - arligFastKost;
  const multiplikator = arligFastKost > 0 ? arligVikarKost / arligFastKost : 0;

  // Andel av nasjonale vikarkostnader (4 mrd)
  const nasjonaltTotal = NSF_DATA.vikar.total2023.verdi;
  const andelAvNasjonalt = (arligVikarKost / nasjonaltTotal) * 100;

  return {
    arligVikarKost,
    arligFastKost,
    besparelse,
    multiplikator,
    andelAvNasjonalt,
  };
}

/**
 * Bemanningseffekt - beregn ringvirkninger av bemanningsendringer
 */
export function beregnBemanningEffekt(input: BemanningInput): BemanningBeregning {
  const { endringAntall, gjennomsnittLonn, lokalAndel } = input;

  // Direkte verdiskaping fra lønnskostnader
  const direkteVerdiskaping = endringAntall * gjennomsnittLonn;

  // Med standard multiplikatorer (fra ripple-beregninger)
  const indirektMultiplikator = 0.5;
  const indusertMultiplikator = 0.3;

  const indirekte = direkteVerdiskaping * indirektMultiplikator * lokalAndel;
  const indusert = direkteVerdiskaping * indusertMultiplikator * lokalAndel;

  const totalVerdiskaping = direkteVerdiskaping + indirekte + indusert;

  // Skatteeffekt (estimert 30% av verdiskaping)
  const skatteeffekt = totalVerdiskaping * 0.3;

  // Frigjorte årsverk (1 sykepleier ≈ 1 årsverk direkte + indirekte effekter)
  const frigjorteArsverk = endringAntall * 1.5; // Med multiplikatoreffekt

  // Vikarkostnad-endring (hvis man ansetter flere, reduseres vikarbehov)
  const gjennomsnittVikarKostPerArsverk =
    NSF_DATA.konstanter.gjennomsnittTimeprisVikar * NSF_DATA.konstanter.arsverkTimer;
  const vikarkostnadEndring = endringAntall > 0
    ? -endringAntall * gjennomsnittVikarKostPerArsverk * 0.3 // Antar 30% vikarreduksjon
    : -endringAntall * gjennomsnittVikarKostPerArsverk * 0.5; // Økt vikarbehov ved nedbemanning

  return {
    verdiskaping: totalVerdiskaping,
    frigjorteArsverk,
    skatteeffekt,
    vikarkostnadEndring,
  };
}

/**
 * Oppgavedeling - beregn frigjorte årsverk ved oppgaveoverføring
 */
export function beregnOppgavedeling(input: OppgavedelingInput): OppgavedelingBeregning {
  const { timerPerUke, antallSykepleiere } = input;
  const arsverkTimer = NSF_DATA.konstanter.arsverkTimer;

  // Totalt frigjorte timer per år
  const timerFrigjort = timerPerUke * antallSykepleiere * 52;

  // Konverter til årsverk
  const frigjorteArsverk = timerFrigjort / arsverkTimer;

  // Estimat: Potensielle ekstra pasienter (antar 1 årsverk = 50 pasienter/år)
  const potensielleEkstrapasienter = Math.round(frigjorteArsverk * 50);

  return {
    frigjorteArsverk,
    timerFrigjort,
    potensielleEkstrapasienter,
  };
}

/**
 * Mobilisering - beregn effekt av å mobilisere sykepleiere utenfor sektor
 */
export function beregnMobilisering(input: MobiliseringInput): MobiliseringBeregning {
  const { mobiliseringsAndel } = input;

  const totalUtenforSektor = NSF_DATA.mangel.utenforSektor.verdi;
  const opprinneligMangel = NSF_DATA.mangel.sykepleiereOgJordmodre.verdi;

  // Potensielle årsverk som kan mobiliseres
  const potensielleArsverk = Math.round(totalUtenforSektor * (mobiliseringsAndel / 100));

  // Reduksjon i mangel
  const redusertMangel = Math.min(potensielleArsverk, opprinneligMangel);

  // Gjenværende mangel
  const gjenvarendeMangel = Math.max(0, opprinneligMangel - redusertMangel);

  return {
    potensielleArsverk,
    redusertMangel,
    opprinneligMangel,
    gjenvarendeMangel,
  };
}

/**
 * Standardverdier for input
 */
export const DEFAULT_VIKAR_INPUT: VikarInput = {
  vikartimer: 500,
  timeprisVikar: NSF_DATA.konstanter.gjennomsnittTimeprisVikar,
  timeprisFast: NSF_DATA.konstanter.gjennomsnittTimeprisFast,
};

export const DEFAULT_BEMANNING_INPUT: BemanningInput = {
  endringAntall: 10,
  gjennomsnittLonn: NSF_DATA.lonn.kravSpesialsykepleier.verdi,
  lokalAndel: 0.95,
};

export const DEFAULT_OPPGAVEDELING_INPUT: OppgavedelingInput = {
  oppgavetype: "journalforing",
  timerPerUke: 5,
  antallSykepleiere: 100,
};

export const DEFAULT_MOBILISERING_INPUT: MobiliseringInput = {
  mobiliseringsAndel: 20,
  forutsetninger: ["lonn", "arbeidstid"],
};
