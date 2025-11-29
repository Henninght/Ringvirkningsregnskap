/**
 * NSF Referansedata med kildehenvisninger
 * Oppdatert november 2025 fra NSF.no
 */

import { Kilde, DataPunktMedKilde } from "@/types/kilde";

// ============================================
// KILDEREGISTER
// ============================================

export const NSF_KILDER: Record<string, Kilde> = {
  // === FRAFALL/TURNOVER KILDER ===
  "hdir-turnover-2023": {
    id: "hdir-turnover-2023",
    tittel: "Rekruttering og turnover for sykepleiere",
    utgiver: "Helsedirektoratet",
    ar: 2023,
    url: "https://www.helsedirektoratet.no/rapporter/behovet-for-sykepleiere-med-klinisk-breddekompetanse-i-sykehus--faglige-og-tjenestemessige-behov/situasjonsbeskrivelse-kompetansebehov-i-spesialisthelsetjenesten/rekruttering-og-turnover-for-sykepleiere",
    sitatnokkel: "[^14]",
    sistOppdatert: "2023-12-01",
  },
  "nou-2023-4": {
    id: "nou-2023-4",
    tittel: "NOU 2023: 4 - Tid for handling",
    utgiver: "Regjeringen",
    ar: 2023,
    url: "https://www.regjeringen.no/no/dokumenter/nou-2023-4/id2961552/?ch=6",
    sitatnokkel: "[^15]",
    sistOppdatert: "2023-06-01",
  },
  "ssb-sykepleiere-avveie": {
    id: "ssb-sykepleiere-avveie",
    tittel: "Sykepleiere på avveie?",
    utgiver: "SSB",
    ar: 2017,
    url: "https://www.ssb.no/helse/artikler-og-publikasjoner/sykepleiere-pa-avveie",
    sitatnokkel: "[^16]",
    sistOppdatert: "2017-11-01",
  },
  "sykepleien-myter-2023": {
    id: "sykepleien-myter-2023",
    tittel: "Hvor blir det av alle sykepleierne? Nye tall knuser sykepleier-myter",
    utgiver: "Sykepleien",
    ar: 2023,
    url: "https://sykepleien.no/2023/10/hvor-blir-det-av-alle-sykepleierne-nye-tall-knuser-sykepleier-myter",
    sitatnokkel: "[^17]",
    sistOppdatert: "2023-10-01",
  },
  "ssb-nyutdanna": {
    id: "ssb-nyutdanna",
    tittel: "1 av 5 nyutdanna sykepleiere jobber ikke i helsetjenesten",
    utgiver: "SSB",
    ar: 2017,
    url: "https://www.ssb.no/helse/artikler-og-publikasjoner/1-av-5-nyutdanna-sykepleiere-jobber-ikke-i-helsetjenesten",
    sitatnokkel: "[^18]",
    sistOppdatert: "2017-09-01",
  },
  "ssb-fremskriving-2035": {
    id: "ssb-fremskriving-2035",
    tittel: "Arbeidsmarkedet for helsepersonell fram mot 2035",
    utgiver: "SSB",
    ar: 2019,
    url: "https://www.ssb.no/arbeid-og-lonn/artikler-og-publikasjoner/arbeidsmarkedet-for-helsepersonell-fram-mot-2035",
    sitatnokkel: "[^21]",
    sistOppdatert: "2019-05-01",
  },
  "ssb-bemanning-sammenligning": {
    id: "ssb-bemanning-sammenligning",
    tittel: "Sammenligning av sykepleierstatistikk: En internasjonal utfordring",
    utgiver: "SSB",
    ar: 2022,
    url: "https://www.ssb.no/helse/helsetjenester/artikler/sammenligning-av-sykepleierstatistikk-en-internasjonal-utfordring",
    sitatnokkel: "[^19]",
    sistOppdatert: "2022-06-01",
  },
  "idunn-bemanning-2021": {
    id: "idunn-bemanning-2021",
    tittel: "For få på jobb? Sykepleierbemanning i sykehjem og hjemmesykepleien",
    utgiver: "Idunn/Søkelys på arbeidslivet",
    ar: 2021,
    url: "https://www.idunn.no/spa/2021/02/for_faa_paa_jobb_sykepleierbemanning_i_sykehjem_og_hjemmesyk",
    sitatnokkel: "[^20]",
    sistOppdatert: "2021-06-01",
  },
  // === EKSISTERENDE KILDER ===
  "nav-mangel-2025": {
    id: "nav-mangel-2025",
    tittel: "Ferske tall fra NAV viser kritisk mangel på helsepersonell",
    utgiver: "NAV/NSF",
    ar: 2025,
    maned: 5,
    url: "https://www.nsf.no/artikkel/ferske-tall-fra-nav-viser-kritisk-mangel-pa-helsepersonell",
    sitatnokkel: "[^1]",
    sistOppdatert: "2025-05-08",
  },
  "nsf-rekruttering": {
    id: "nsf-rekruttering",
    tittel: "Rekruttere, mobilisere og beholde sykepleiere",
    utgiver: "NSF",
    ar: 2025,
    url: "https://www.nsf.no/vart-politiske-arbeid/rekruttere-mobilisere-og-beholde-sykepleiere",
    sitatnokkel: "[^2]",
    sistOppdatert: "2025-11-01",
  },
  "nsf-beredskap-2025": {
    id: "nsf-beredskap-2025",
    tittel: "Krise i norsk helseberedskap: Regjeringen slår alarm om sykepleiermangel",
    utgiver: "NSF",
    ar: 2025,
    maned: 4,
    url: "https://www.nsf.no/artikkel/krise-i-norsk-helseberedskap-regjeringen-slar-alarm-om-sykepleiermangel",
    sitatnokkel: "[^3]",
    sistOppdatert: "2025-04-01",
  },
  "ssb-utenfor-sektor": {
    id: "ssb-utenfor-sektor",
    tittel: "16% av sykepleiere jobber utenfor direkte pasientarbeid",
    utgiver: "SSB/Sykepleien",
    ar: 2023,
    url: "https://sykepleien.no/2023/10/hvor-blir-det-av-alle-sykepleierne-nye-tall-knuser-sykepleier-myter",
    sitatnokkel: "[^4]",
    sistOppdatert: "2023-10-01",
  },
  "nsf-bemanning-2025": {
    id: "nsf-bemanning-2025",
    tittel: "Planlagt og faktisk bemanning 2024-2025",
    utgiver: "NSF",
    ar: 2025,
    url: "https://www.nsf.no/fylke/rogaland/nyheter/klar-ferdig-ga-planlagt-og-faktisk-bemanning-2025",
    sitatnokkel: "[^5]",
    sistOppdatert: "2025-01-01",
  },
  "nsf-vikar-firedoblet": {
    id: "nsf-vikar-firedoblet",
    tittel: "Vikarbruken har firedoblet seg",
    utgiver: "NSF",
    ar: 2024,
    url: "https://www.nsf.no/artikkel/vikarbruken-har-firedoblet-seg",
    sitatnokkel: "[^6]",
    sistOppdatert: "2024-12-01",
  },
  "nsf-vikar-36mrd": {
    id: "nsf-vikar-36mrd",
    tittel: "Sykepleiervikarer for 3,6 milliarder",
    utgiver: "NSF",
    ar: 2023,
    url: "https://www.nsf.no/artikkel/sykepleiervikarer-36-milliarder",
    sitatnokkel: "[^7]",
    sistOppdatert: "2023-12-01",
  },
  "nsf-sykepleierloftet": {
    id: "nsf-sykepleierloftet",
    tittel: "Sykepleierløftet - 8 krav",
    utgiver: "NSF",
    ar: 2025,
    url: "https://www.nsf.no/sykepleierloftet",
    sitatnokkel: "[^8]",
    sistOppdatert: "2025-11-01",
  },
  "nsf-lonn-2025": {
    id: "nsf-lonn-2025",
    tittel: "Lønnsoppgjøret 2025",
    utgiver: "NSF",
    ar: 2025,
    url: "https://www.nsf.no/lonn-og-tariff/lonnsoppgjoret-2025",
    sitatnokkel: "[^9]",
    sistOppdatert: "2025-04-01",
  },
  "nsf-statsbudsjett-2026": {
    id: "nsf-statsbudsjett-2026",
    tittel: "Helsetjenesten stopper uten en satsing på helsepersonell",
    utgiver: "NSF",
    ar: 2025,
    url: "https://www.nsf.no/artikkel/helsetjenesten-stopper-uten-en-satsing-pa-helsepersonell",
    sitatnokkel: "[^10]",
    sistOppdatert: "2025-10-01",
  },
  "nsf-oppgavedeling": {
    id: "nsf-oppgavedeling",
    tittel: "Ansvars- og oppgavedeling i et sykepleierperspektiv",
    utgiver: "NSF",
    ar: 2023,
    url: "https://www.nsf.no/nyheter/sykepleierfaget/ansvars-og-oppgavedeling-i-et-sykepleierperspektiv",
    sitatnokkel: "[^11]",
    sistOppdatert: "2023-04-01",
  },
  "nsf-lav-bemanning": {
    id: "nsf-lav-bemanning",
    tittel: "Lav fast bemanning = dårlige tjenester",
    utgiver: "NSF",
    ar: 2024,
    url: "https://www.nsf.no/artikkel/lav-fast-bemanning-darlige-tjenester",
    sitatnokkel: "[^12]",
    sistOppdatert: "2024-06-01",
  },
  "ssb-fremskriving-2040": {
    id: "ssb-fremskriving-2040",
    tittel: "SSB fremskrivning helsepersonell",
    utgiver: "SSB via NSF",
    ar: 2025,
    url: "https://www.nsf.no/vart-politiske-arbeid/rekruttere-mobilisere-og-beholde-sykepleiere",
    sitatnokkel: "[^13]",
    sistOppdatert: "2025-01-01",
  },
};

// ============================================
// REFERANSEDATA MED KILDER
// ============================================

export const NSF_DATA = {
  // Sykepleiermangel
  mangel: {
    totaltHelseSosial: {
      verdi: 11450,
      kildeId: "nav-mangel-2025",
      beskrivelse: "Total mangel helse- og sosialtjenester",
    } as DataPunktMedKilde,

    sykepleiereOgJordmodre: {
      verdi: 3100,
      kildeId: "nav-mangel-2025",
      beskrivelse: "Mangel sykepleiere, spesialsykepleiere og jordmødre",
    } as DataPunktMedKilde,

    helsefagarbeidere: {
      verdi: 3000,
      kildeId: "nav-mangel-2025",
      beskrivelse: "Mangel helsefagarbeidere",
    } as DataPunktMedKilde,

    nsfEstimat: {
      verdi: 4300,
      kildeId: "nsf-rekruttering",
      beskrivelse: "NSFs estimat på nåværende mangel",
    } as DataPunktMedKilde,

    fremskriving2040: {
      verdi: 30000,
      kildeId: "ssb-fremskriving-2040",
      beskrivelse: "Forventet mangel i 2040",
    } as DataPunktMedKilde,

    fremskriving2060: {
      verdi: 560000,
      kildeId: "nsf-sykepleierloftet",
      beskrivelse: "Verste scenario 2060 (årsverk)",
    } as DataPunktMedKilde,

    utenforSektor: {
      verdi: 16,
      kildeId: "ssb-utenfor-sektor",
      beskrivelse: "Prosent sykepleiere som jobber utenfor direkte pasientarbeid",
    } as DataPunktMedKilde,

    vakterUtenSykepleier: {
      verdi: 19,
      kildeId: "nsf-bemanning-2025",
      beskrivelse: "Prosent vakter uten sykepleier (kommuner)",
    } as DataPunktMedKilde,

    // NB: Dette tallet (16%) er ikke verifisert i kilden - vurder å fjerne eller finne bedre kilde
    vakterAnnenKompetanse: {
      verdi: 16,
      kildeId: "nsf-bemanning-2025",
      beskrivelse: "Prosent vakter erstattet av annen kompetanse (estimat)",
    } as DataPunktMedKilde,
  },

  // Vikarbruk
  vikar: {
    kommuner2023: {
      verdi: 3000000000,
      kildeId: "nsf-vikar-firedoblet",
      beskrivelse: "Kommunenes vikarkostnader 2023",
    } as DataPunktMedKilde,

    helseforetak2023: {
      verdi: 956000000,
      kildeId: "nsf-vikar-firedoblet",
      beskrivelse: "Helseforetakenes vikarkostnader 2023",
    } as DataPunktMedKilde,

    total2023: {
      verdi: 4000000000,
      kildeId: "nsf-vikar-firedoblet",
      beskrivelse: "Totale vikarkostnader 2023",
    } as DataPunktMedKilde,

    kommuner2022: {
      verdi: 2630000000,
      kildeId: "nsf-vikar-36mrd",
      beskrivelse: "Kommunenes vikarkostnader 2022",
    } as DataPunktMedKilde,

    okning2021til2022: {
      verdi: 49.7,
      kildeId: "nsf-vikar-36mrd",
      beskrivelse: "Økning i vikarkostnader 2021-2022 (%)",
    } as DataPunktMedKilde,

    baseline2012: {
      verdi: 622000000,
      kildeId: "nsf-vikar-36mrd",
      beskrivelse: "Vikarkostnader 2012 (baseline)",
    } as DataPunktMedKilde,

    okningFaktor: {
      verdi: 5,
      kildeId: "nsf-vikar-firedoblet",
      beskrivelse: "Økning i vikarbruk siden 2012 (faktor)",
    } as DataPunktMedKilde,

    tromsFinmarkPerInnbygger: {
      verdi: 2.4,
      kildeId: "nsf-vikar-36mrd",
      beskrivelse: "Troms/Finnmark vikarbruk vs landsgjennomsnitt (faktor)",
    } as DataPunktMedKilde,

    tapUtdanning: {
      verdi: 800000000,
      kildeId: "nsf-sykepleierloftet",
      beskrivelse: "Årlig tap fra ubrukt utdanningskapasitet",
    } as DataPunktMedKilde,
  },

  // Lønn
  lonn: {
    ramme2025: {
      verdi: 4.4,
      kildeId: "nsf-lonn-2025",
      beskrivelse: "Lønnsramme 2025 (%)",
    } as DataPunktMedKilde,

    // NB: NHO-tallene er ikke verifisert i nsf-lonn-2025 URL - finn bedre kilde
    nhoLoftMin: {
      verdi: 26325,
      kildeId: "nsf-lonn-2025",
      beskrivelse: "NHO løft minimum 1. april 2025 (ikke verifisert)",
    } as DataPunktMedKilde,

    nhoLoftMax: {
      verdi: 33000,
      kildeId: "nsf-lonn-2025",
      beskrivelse: "NHO løft maksimum 1. april 2025 (ikke verifisert)",
    } as DataPunktMedKilde,

    kravSpesialsykepleier: {
      verdi: 650000,
      kildeId: "nsf-sykepleierloftet",
      beskrivelse: "NSF krav: Grunnlønn spesialsykepleier 10 års ansiennitet",
    } as DataPunktMedKilde,
  },

  // Sykepleierløftet - 8 krav
  sykepleierloftet: [
    { krav: "650 000 kr grunnlønn for spesialsykepleiere", kildeId: "nsf-sykepleierloftet" },
    { krav: "Full lønn under videreutdanning", kildeId: "nsf-sykepleierloftet" },
    { krav: "Bemanningsnormer i kommunehelsetjenesten", kildeId: "nsf-sykepleierloftet" },
    { krav: "Ledere må ha beslutningsmyndighet", kildeId: "nsf-sykepleierloftet" },
    { krav: "Oppgavedeling og teknologi skal frigjøre sykepleierkapasitet", kildeId: "nsf-sykepleierloftet" },
    { krav: "Yrkesskadeerstatning for belastningsskader", kildeId: "nsf-sykepleierloftet" },
    { krav: "11 timers hvile mellom vakter, maks hver 3. helg", kildeId: "nsf-sykepleierloftet" },
    { krav: "Økt finansiering av sykepleierutdanning", kildeId: "nsf-sykepleierloftet" },
  ],

  // Statsbudsjettet 2026
  statsbudsjett2026: {
    kommuneokonomi: {
      posisjon: "Så presset at det ikke er ressurser til nødvendig utbygging",
      kildeId: "nsf-statsbudsjett-2026",
    },
    sykehusinntekter: {
      posisjon: "Ingen reell vekst - uansvarlig",
      kildeId: "nsf-statsbudsjett-2026",
    },
    helseberedskap: {
      posisjon: "Forsvaret er avhengig av sterk offentlig helsetjeneste",
      kildeId: "nsf-statsbudsjett-2026",
    },
    // NB: 150 mill er ikke verifisert i nsf-statsbudsjett-2026 URL
    helseteknologi: {
      krav: 150000000,
      beskrivelse: "Krav om dobling av helseteknologiordningen (ikke verifisert)",
      kildeId: "nsf-statsbudsjett-2026",
    },
  },

  // Konstanter for beregninger
  konstanter: {
    arsverkTimer: 1695,
    vikarMultiplikator: 2.5, // Vikarkost vs fast ansatt
    gjennomsnittTimeprisVikar: 850, // Estimat basert på NSF-data
    gjennomsnittTimeprisFast: 340, // Estimat
  },

  // === FRAFALL/TURNOVER DATA ===
  frafall: {
    // Turnover-statistikk
    turnoverSykehusGjennomsnitt: {
      verdi: 8,
      kildeId: "hdir-turnover-2023",
      beskrivelse: "Gjennomsnittlig årlig ekstern turnover i sykehus (%)",
    } as DataPunktMedKilde,

    turnoverSengepostMedian: {
      verdi: 12,
      kildeId: "hdir-turnover-2023",
      beskrivelse: "Halvparten av sengeposter har mer enn 12% turnover",
    } as DataPunktMedKilde,

    turnoverSengepostHoy: {
      verdi: 20,
      kildeId: "hdir-turnover-2023",
      beskrivelse: "En fjerdedel av sengeposter har over 20% turnover",
    } as DataPunktMedKilde,

    turnoverKommunal: {
      verdi: 20,
      kildeId: "nou-2023-4",
      beskrivelse: "Turnover i kommunal helse- og omsorgstjeneste (%)",
    } as DataPunktMedKilde,

    // Hvor de går
    andelIHelsetjenesten: {
      verdi: 84,
      kildeId: "ssb-sykepleiere-avveie",
      beskrivelse: "Prosent av sykepleiere som jobber i helsetjenesten",
    } as DataPunktMedKilde,

    andelUtenforHelsetjenesten: {
      verdi: 16,
      kildeId: "ssb-sykepleiere-avveie",
      beskrivelse: "Prosent av sykepleiere som jobber utenfor helsetjenesten",
    } as DataPunktMedKilde,

    nyutdannaFrafall10aar: {
      verdi: 20,
      kildeId: "ssb-nyutdanna",
      beskrivelse: "Prosent nyutdannede som forlater yrket innen 10 år",
    } as DataPunktMedKilde,

    // Totalt antall
    totaltAntallSykepleiere: {
      verdi: 111000,
      kildeId: "sykepleien-myter-2023",
      beskrivelse: "Totalt antall sysselsatte sykepleiere i Norge",
    } as DataPunktMedKilde,

    // Pasientbelastning
    sykepleierePer1000Innbyggere: {
      verdi: 17.9,
      kildeId: "ssb-bemanning-sammenligning",
      beskrivelse: "Sykepleiere per 1000 innbyggere (Norge)",
    } as DataPunktMedKilde,

    pasientPerSykepleierNattSykehus: {
      verdi: 14,
      kildeId: "idunn-bemanning-2021",
      beskrivelse: "Pasienter per sykepleier på nattevakt (sykehus)",
    } as DataPunktMedKilde,

    vakterUdekketSykehjem: {
      verdi: 18.7,
      kildeId: "idunn-bemanning-2021",
      beskrivelse: "Prosent sykepleiervakter i sykehjem ikke dekket av sykepleier",
    } as DataPunktMedKilde,

    // Rekrutteringskostnad
    rekrutteringskostnadDirekte: {
      verdi: 250000,
      kildeId: "hdir-turnover-2023",
      beskrivelse: "Direkte rekrutteringskostnad per sykepleier (kr)",
    } as DataPunktMedKilde,

    rekrutteringskostnadTotal: {
      verdi: 1200000,
      kildeId: "hdir-turnover-2023",
      beskrivelse: "Total kostnad inkl. opplæring og produktivitetstap (kr)",
    } as DataPunktMedKilde,

    // Lønn - NB: Dette tallet er ikke verifisert i nsf-lonn-2025 URL
    gjennomsnittLonn: {
      verdi: 582000,
      kildeId: "nsf-lonn-2025",
      beskrivelse: "Gjennomsnittlig årslønn for sykepleiere (ikke verifisert)",
    } as DataPunktMedKilde,

    // Fremtidig mangel
    mangel2035: {
      verdi: 28000,
      kildeId: "ssb-fremskriving-2035",
      beskrivelse: "Forventet mangel på sykepleiere i 2035",
    } as DataPunktMedKilde,
  },
};

// ============================================
// HJELPEFUNKSJONER
// ============================================

export function getKilde(kildeId: string): Kilde | undefined {
  return NSF_KILDER[kildeId];
}

// Alias for tydelighet
export const getKildeById = getKilde;

export function getDataMedKilde<T>(data: DataPunktMedKilde<T>): {
  verdi: T;
  kilde: Kilde | undefined;
} {
  return {
    verdi: data.verdi,
    kilde: getKilde(data.kildeId),
  };
}

export function formaterKroner(verdi: number): string {
  if (verdi >= 1000000000) {
    return `${(verdi / 1000000000).toFixed(1)} mrd kr`;
  }
  if (verdi >= 1000000) {
    return `${Math.round(verdi / 1000000)} mill kr`;
  }
  return `${verdi.toLocaleString("nb-NO")} kr`;
}

export function getAlleKilderBrukt(kildeIder: string[]): Kilde[] {
  return kildeIder
    .map((id) => NSF_KILDER[id])
    .filter((k): k is Kilde => k !== undefined);
}
