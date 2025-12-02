/**
 * Eidsiva Energi - Data fra ringvirkningsrapport
 *
 * Kilde: Eidsiva Ringvirkningsregnskap (PDF)
 * Merk: Mange verdier er plassholdere (0) fra mal-dokumentet - må oppdateres med faktiske tall
 */

import type { EidsivaRingvirkninger } from "@/types/eidsiva";
import type { KildeRef } from "@/components/ui/SourceTooltip";

// =============================================================================
// KILDEHENVISNINGER
// =============================================================================

export const KILDER = {
  // Fase 2: Verdikart
  ringvirkninger: { side: 5, seksjon: "Ringvirkninger og multiplikatoreffekter" } as KildeRef,
  regionaltKart: { side: 7, seksjon: "Verditilførsel til lokalsamfunn" } as KildeRef,
  velferdsbidrag: { side: 8, seksjon: "Bidrag til offentlig velferd" } as KildeRef,
  ssbVelferd: { side: 8, seksjon: "SSB-baserte velferdskostnader", beskrivelse: "Sykkelvei, barnehage, sykehjem, lærere, sykepleiere, brannkonstabler" } as KildeRef,

  // Fase 3: Ringvirkningskalkulator
  forbrukseffekter: { side: 9, seksjon: "Lokal økonomisk vekst" } as KildeRef,
  leverandorer: { side: 10, seksjon: "Bidrag til norsk næringsliv" } as KildeRef,
  kritiskInfrastruktur: { side: 11, seksjon: "Samfunnskritiske virksomheter" } as KildeRef,

  // Fase 4: Samfunnsbidrag
  breddeidrett: { side: 13, seksjon: "Breddeidrett og foreninger" } as KildeRef,
  toppidrett: { side: 14, seksjon: "Toppidrett sponsorater" } as KildeRef,
  elviaFondet: { side: 15, seksjon: "Elvia-fondet" } as KildeRef,
  fornybarEnergi: { side: 17, seksjon: "Fornybar energiproduksjon" } as KildeRef,
  valerenga: { side: 18, seksjon: "Enga for målene" } as KildeRef,
  heimdall: { side: 19, seksjon: "Heimdall-nevroner" } as KildeRef,
  obio: { side: 20, seksjon: "Karbonfangst med biokull" } as KildeRef,
} as const;

// =============================================================================
// REGIONER I INNLANDET
// =============================================================================

export const EIDSIVA_REGIONER = [
  { id: "nord-osterdal", navn: "Nord-Østerdal", verdi: 0 },
  { id: "sor-osterdal", navn: "Sør-Østerdal", verdi: 0 },
  { id: "kongsvinger", navn: "Kongsvinger-regionen", verdi: 0 },
  { id: "hamar", navn: "Hamarregionen", verdi: 0 },
  { id: "lillehammer", navn: "Lillehammer-regionen", verdi: 0 },
  { id: "gjovik", navn: "Gjøvikregionen", verdi: 0 },
  { id: "nord-gudbrandsdal", navn: "Nord-Gudbrandsdal", verdi: 0 },
  { id: "midt-gudbrandsdal", navn: "Midt-Gudbrandsdal", verdi: 0 },
  { id: "valdres", navn: "Valdres", verdi: 0 },
  { id: "gran", navn: "Gran", verdi: 0 },
  { id: "oslo", navn: "Oslo", verdi: 0 },
] as const;

// =============================================================================
// HOVEDDATA
// =============================================================================

export const EIDSIVA_DATA: EidsivaRingvirkninger = {
  metadata: {
    ar: 2024,
    rapportDato: "2024",
    kilde: "Eidsiva Ringvirkningsregnskap",
    sistOppdatert: new Date().toISOString(),
  },

  organisasjon: {
    navn: "Eidsiva Energi AS",
    konsernstruktur: [
      "Elvia (nettselskap)",
      "Eidsiva Bioenergi",
      "Eidsiva Bredbånd",
      "Hafslund Kraft (deleierskap)",
      "OBIO (60% eierskap)",
      "Eidsiva Peak Shaper",
    ],
    ansatte: 0, // TODO: Hent fra faktisk rapport
    hovedkontor: "Hamar",
    regioner: ["innlandet", "oslo"],
    forretningsomrader: ["kraftproduksjon", "nett", "fjernvarme", "bredbånd"],
  },

  // ===========================================================================
  // HOVEDRINGVIRKNINGER (Direkte, Indirekte, Forbrukseffekter)
  // ===========================================================================
  hoved: {
    direkte: {
      lonninger: 0,        // TODO: Fra rapport
      investeringer: 0,    // TODO: Fra rapport
      byggOgAnlegg: 0,     // TODO: Fra rapport
      drift: 0,            // TODO: Fra rapport
      beredskap: 0,        // TODO: Fra rapport
      skatt: 0,            // TODO: Fra rapport
      utbytte: 0,          // TODO: Fra rapport - eierutbytte til kommunene
    },
    indirekte: {
      leverandorVerdiskaping: 0,
      leverandorAntall: 0,
      leverandorAnsatte: 0,
    },
    forbruk: {
      ansattForbruk: 0,
      leverandorAnsattForbruk: 0,
      totalLokalForbruk: 0,
    },
    totalVerdiskaping: 0,
  },

  // ===========================================================================
  // ØKONOMISKE RINGVIRKNINGER
  // ===========================================================================
  okonomiske: {
    verdibidragPerRegion: [
      { region: "innlandet", verdiskaping: 0, andel: 0 },
      { region: "oslo", verdiskaping: 0, andel: 0 },
    ],
    offentligVelferd: {
      skattOgAvgifter: 0,
      arbeidsgiveravgift: 0,
      selskapsskatt: 0,
      totalBidrag: 0, // "xyz millioner NOK til samfunnet"
    },
    lokalOkonomiskVekst: {
      sysselsettingsBidrag: 0,
      lonnssumBidrag: 0,
      multiplikatorEffekt: 0,
    },
    norskNaeringsliv: {
      norskeLeverandorer: 0, // Andel i prosent
      verdiskapingNorge: 0,
    },
    kritiskInfrastruktur: {
      strømforsyning: true,
      fjernvarme: true,
      bredbånd: true,
      beskrivelse: "Forsyner over 2 millioner mennesker med strøm. Sikrer normalfunksjon for landets kjernevirksomheter innen liv, helse, trygghet og nasjonal sikkerhet.",
    },
  },

  // ===========================================================================
  // SOSIALE RINGVIRKNINGER
  // ===========================================================================
  sosiale: {
    breddeIdrett: {
      antallLagOgForeninger: 0, // "xxx lag og foreninger"
      totalStotte: 0,           // "x millioner" årlig
      medlemmerNadd: 0,         // "xx xxx medlemmer"
      bidrag: [
        // 5 regioner med breddeidrett
        { navn: "Gjøvik-regionen", type: "bredde", belop: 0 },
        { navn: "Hamar-regionen", type: "bredde", belop: 0 },
        { navn: "Sør-Østerdal", type: "bredde", belop: 0 },
        { navn: "Kongsvinger-regionen", type: "bredde", belop: 0 },
        { navn: "Lillehammer-regionen", type: "bredde", belop: 0 },
      ],
    },
    toppIdrett: {
      sponsorater: [
        { navn: "Norges Skiskytterforbund", type: "topp", belop: 0, beskrivelse: "Langrenn og skiskyting" },
        { navn: "Vålerenga", type: "topp", belop: 0, beskrivelse: "Fotball - Enga for målene" },
        { navn: "HamKam", type: "topp", belop: 0, beskrivelse: "Fotball" },
        { navn: "Lillehammer Ishockey", type: "topp", belop: 0, beskrivelse: "Ishockey" },
        { navn: "Elverum Håndball", type: "topp", belop: 0, beskrivelse: "Håndball" },
        { navn: "Storhamar Håndball", type: "topp", belop: 0, beskrivelse: "Håndball" },
      ],
      totalSponsing: 0, // "x,xxx millioner NOK"
      synlighet: "Toppidrett med kraft til å inspirere",
    },
    lokalsamfunnsBidrag: {
      prosjekter: [
        // Elvia-fondet 12 prosjekter 2025
        "Østre Toten Skilag",
        "Furuset Idrettsforening",
        "Hunndalen KFUM/KFUK-speidere",
        "Skolehage på Ulvenhagen",
        "FAU Ridabu Skole",
        "Dale Oen Academy",
        "Bra nok",
        "BUA Trysil",
        "Innvandrerforum i Østfold",
        "Bliksrud borettslag",
        "Xyz blinde og svaksynte",
      ],
      totalBidrag: 0,
      frivillighetStotte: 0,
    },
  },

  // ===========================================================================
  // BÆREKRAFTIGE RINGVIRKNINGER
  // ===========================================================================
  baerekraftige: {
    fornybarEnergi: {
      kraftproduksjonGWh: 6200 + 485, // 6,2 mrd kWh vannkraft + 485 mill kWh biokraft
      fornybartAndel: 98, // 98% fornybart brensel, mål 100% innen 2030
      co2Besparelse: 1360000 + 1364000, // Vannkraft + biokraft CO2-besparelse
    },
    fnBaerekraftsmal: [
      {
        malNummer: 7,
        navn: "Ren energi til alle",
        bidragBeskrivelse: "6,2 mrd kWh fornybar vannkraft via Hafslund Kraft. 485 mill kWh biokraft fra 16 varmesentraler.",
        partnere: ["Hafslund Kraft"],
      },
      {
        malNummer: 9,
        navn: "Industri, innovasjon og infrastruktur",
        bidragBeskrivelse: "Heimdall-nevroner for 20% mer kapasitet fra eksisterende nett. 5,6 TWh økt nettkapasitet.",
        partnere: ["Heimdall Power", "Elvia"],
      },
      {
        malNummer: 11,
        navn: "Bærekraftige byer og lokalsamfunn",
        bidragBeskrivelse: "Enga for målene - Norges mest bærekraftige arena. 4000 m² solceller på Intility Arena.",
        partnere: ["Vålerenga", "Enny", "Celsio", "Eidsiva Peak Shaper"],
      },
      {
        malNummer: 13,
        navn: "Stoppe klimaendringene",
        bidragBeskrivelse: "OBIO produserer 400 tonn biokull årlig = 1200 tonn lagret CO2. Tilsvarer 26 102 flyturer Oslo-Trondheim.",
        partnere: ["OBIO"],
      },
    ],
    miljotiltak: [
      {
        beskrivelse: "Peak Shaper batteriparkløsning for nettstabilisering og backup",
        investering: 0,
      },
      {
        beskrivelse: "Solceller på Intility Arena - 600 000 kWh årlig produksjon",
        investering: 0,
      },
      {
        beskrivelse: "OBIO biokullproduksjon - karbonfangst fra grantrær",
        investering: 0,
      },
      {
        beskrivelse: "Heimdall Power nevroner på kraftlinjer for smart nettdrift",
        investering: 0,
      },
    ],
  },

  // ===========================================================================
  // TOTALER
  // ===========================================================================
  totaler: {
    totalVerdiskaping: 0,
    totalSysselsetting: 0,
    totalSkattebidrag: 0,
    totalSosialeBidrag: 0,
    multiplikatorEffekt: 0,
  },
};

// =============================================================================
// NØKKELTALL MED FAKTISKE VERDIER FRA RAPPORTEN
// =============================================================================

export const EIDSIVA_NOKKELTALL = {
  // Fornybar energi
  vannkraft: {
    produksjonGWh: 6200, // 6,2 milliarder kWh
    andelAvNorge: 4, // 4% av Norges kraftproduksjon
    antallKraftverk: 74,
    eierskap: "Hafslund Kraft",
  },
  biokraft: {
    produksjonGWh: 485, // 485 millioner kWh
    fornybartBrensel: 98, // 98%
    antallVarmesentraler: 16,
    mal2030: 100, // 100% fornybart innen 2030
  },

  // Rekkevidde
  kundedekning: {
    innbyggereMedStrom: 2000000, // Over 2 millioner
    husstanderMedBredbånd: 100000, // Rundt 100 000
  },

  // Eierskap
  eierskap: {
    kommunerInnlandet: 27,
    andreEiere: ["Oslo kommune", "Innlandet fylkeskommune"],
  },

  // Bærekraft - Vålerenga
  valerenga: {
    solcellerM2: 4000,
    solcellerProduksjonKWh: 600000,
    solcellerDekning: 20, // 20% av arenaens forbruk
    batteriBackupTimer: 2,
  },

  // Heimdall
  heimdall: {
    kapasitetsokningMal: 20, // 20% mer effekt
    potensielKapasitetTWh: 5.6,
    nyeHusstander: 356688,
  },

  // OBIO Biokull
  obio: {
    eierskap: 60, // 60% eid av Eidsiva Bioenergi
    arligProduksjonTonn: 400,
    co2LagretTonn: 1200,
    tilsvarerFlyturer: 26102, // Oslo-Trondheim
  },

  // Vannkraft-effekt (tilsvarer)
  vannkraftTilsvarer: {
    husholdninger: 394904,
    innbyggere: 833248,
    elbilladinger: 379669320,
    idrettshaller: 348424,
    sykehus: 191,
    grunnskoler: 11388,
  },

  // Biokraft-effekt (tilsvarer)
  biokraftTilsvarer: {
    husholdninger: 30829,
    innbyggere: 65182,
    idrettshallerVarme: 800,
    svommehallerVarme: 190,
    skolerVarme: 1212,
    sykehjemVarme: 485,
    fotballbanerUndervarme: 750,
  },
} as const;

// =============================================================================
// SANKEY-DATA FOR VISUALISERING
// =============================================================================

export function generateEidsivaSankeyData() {
  const { vannkraft, biokraft, kundedekning } = EIDSIVA_NOKKELTALL;

  return {
    nodes: [
      // Kilder
      { id: "Eidsiva Energi", nodeColor: "#1C1C1E" },

      // Hovedringvirkninger
      { id: "Direkte effekter", nodeColor: "#3B82F6" },
      { id: "Indirekte effekter", nodeColor: "#8B5CF6" },
      { id: "Forbrukseffekter", nodeColor: "#EC4899" },

      // Økonomiske
      { id: "Innlandet", nodeColor: "#6366F1" },
      { id: "Oslo", nodeColor: "#F59E0B" },
      { id: "Offentlig velferd", nodeColor: "#10B981" },
      { id: "Norsk næringsliv", nodeColor: "#14B8A6" },

      // Sosiale
      { id: "Breddeidrett", nodeColor: "#F97316" },
      { id: "Toppidrett", nodeColor: "#EF4444" },
      { id: "Lokalsamfunn", nodeColor: "#8B5CF6" },

      // Bærekraft
      { id: "Fornybar energi", nodeColor: "#22C55E" },
      { id: "Klimatiltak", nodeColor: "#06B6D4" },
    ],
    links: [
      // Fra Eidsiva til hovedeffekter
      { source: "Eidsiva Energi", target: "Direkte effekter", value: 40 },
      { source: "Eidsiva Energi", target: "Indirekte effekter", value: 30 },
      { source: "Eidsiva Energi", target: "Forbrukseffekter", value: 20 },
      { source: "Eidsiva Energi", target: "Fornybar energi", value: 10 },

      // Direkte effekter videre
      { source: "Direkte effekter", target: "Innlandet", value: 25 },
      { source: "Direkte effekter", target: "Oslo", value: 10 },
      { source: "Direkte effekter", target: "Offentlig velferd", value: 5 },

      // Indirekte effekter
      { source: "Indirekte effekter", target: "Norsk næringsliv", value: 20 },
      { source: "Indirekte effekter", target: "Innlandet", value: 10 },

      // Forbrukseffekter
      { source: "Forbrukseffekter", target: "Lokalsamfunn", value: 15 },
      { source: "Forbrukseffekter", target: "Breddeidrett", value: 5 },

      // Sosiale koblinger
      { source: "Eidsiva Energi", target: "Breddeidrett", value: 3 },
      { source: "Eidsiva Energi", target: "Toppidrett", value: 5 },

      // Bærekraft
      { source: "Fornybar energi", target: "Klimatiltak", value: 10 },
    ],
  };
}

// =============================================================================
// SPONSORATER DETALJER
// =============================================================================

export const EIDSIVA_SPONSORATER = {
  toppidrett: [
    {
      navn: "Norges Skiskytterforbund",
      logo: "/logos/skiforbundet.png",
      belopMNOK: 0,
      tilsvarer: "xxx par profesjonelle ski",
    },
    {
      navn: "Vålerenga",
      logo: "/logos/valerenga.png",
      belopMNOK: 0,
      tilsvarer: "xxx sett med tøy",
      spesielt: "Enga for målene - FNs bærekraftsmål",
    },
    {
      navn: "HamKam",
      logo: "/logos/hamkam.png",
      belopTNOK: 0,
      tilsvarer: "x xxx fotballer",
    },
    {
      navn: "Lillehammer Ishockey",
      logo: "/logos/lillehammer-hockey.png",
      belopTNOK: 0,
      tilsvarer: "x xxx pucker",
    },
    {
      navn: "Elverum Håndball",
      logo: "/logos/elverum-handball.png",
      belopTNOK: 0,
      tilsvarer: "xxx håndballer",
    },
    {
      navn: "Storhamar Håndball",
      logo: "/logos/storhamar-handball.png",
      belopTNOK: 0,
      tilsvarer: "xxx håndballsko",
    },
  ],
} as const;

// =============================================================================
// FORBRUKSEFFEKT-KATEGORIER (Side 9)
// =============================================================================

export const FORBRUKSKATEGORIER = {
  /** Kategorier for ansattes forbruk - fra rapport side 9 */
  kategorier: [
    { id: "sparing", navn: "Sparing og investering", andel: 0.15 },
    { id: "mat", navn: "Mat og drikke", andel: 0.12 },
    { id: "klaer", navn: "Klær og sko", andel: 0.05 },
    { id: "bolig", navn: "Bolig, lys og brensel", andel: 0.25 },
    { id: "mobler", navn: "Møbler og husholdningsartikler", andel: 0.06 },
    { id: "forsikring", navn: "Forsikring og finansielle tjenester", andel: 0.08 },
    { id: "helse", navn: "Helsepleie", andel: 0.03 },
    { id: "tele", navn: "Post- og teletjenester", andel: 0.03 },
    { id: "restaurant", navn: "Restaurant- og hotelltjenester", andel: 0.05 },
    { id: "andre", navn: "Andre varer og tjenester", andel: 0.08 },
    { id: "kommunalt", navn: "Kommunale avgifter", andel: 0.05 },
    { id: "kultur", navn: "Kultur og fritid", andel: 0.05 },
  ],
  kilde: KILDER.forbrukseffekter,
} as const;

// =============================================================================
// KRITISK INFRASTRUKTUR (Side 11)
// =============================================================================

export const KRITISK_INFRASTRUKTUR = {
  /** Samfunnskritiske virksomheter Eidsiva forsyner */
  kategorier: [
    {
      id: "sykehus",
      navn: "Sykehus",
      ikon: "Hospital",
      antall: 0, // xyz sykehus
      ansatte: 0, // xyz ansatte
      eksempler: ["Hamar sykehus"],
    },
    {
      id: "brannstasjoner",
      navn: "Brannstasjoner",
      ikon: "Flame",
      antall: 0, // xyz brannstasjoner
      ansatte: 0, // xyz ansatte
      eksempler: ["Elverum Brannstasjon"],
    },
    {
      id: "militaerleire",
      navn: "Militærleire",
      ikon: "Shield",
      antall: 0, // xyz militærleire
      ansatte: 0, // xyz ansatte
      eksempler: ["Rena Leir base"],
    },
    {
      id: "politistasjoner",
      navn: "Politistasjoner",
      ikon: "BadgeCheck",
      antall: 0, // xyz politistasjoner
      ansatte: 0, // xyz ansatte
      eksempler: ["Oslo Politihus (Grønland)"],
    },
  ],
  kilde: KILDER.kritiskInfrastruktur,
} as const;

// =============================================================================
// IDRETTS-KATEGORIER (Side 13)
// =============================================================================

export const IDRETTS_KATEGORIER = {
  /** Typer idretter som støttes */
  idretter: [
    { id: "fleridrett", navn: "Fleridrettslag/-klubber", antallMedlemmer: 0 },
    { id: "handball", navn: "Håndball", antallMedlemmer: 0 },
    { id: "fotball", navn: "Fotball", antallMedlemmer: 0 },
    { id: "ski", navn: "Skiklubber", antallMedlemmer: 0 },
    { id: "ishockey", navn: "Ishockey", antallMedlemmer: 0 },
    { id: "turn", navn: "Turnklubber", antallMedlemmer: 0 },
    { id: "orientering", navn: "Orienteringsklubber", antallMedlemmer: 0 },
    { id: "korps", navn: "Korps", antallMedlemmer: 0 },
    { id: "dans", navn: "Danseklubber", antallMedlemmer: 0 },
    { id: "teater", navn: "Musikal og teater", antallMedlemmer: 0 },
  ],
  kilde: KILDER.breddeidrett,
} as const;

// =============================================================================
// UTSTYR-PRISER FOR KONVERTERING (Side 14)
// =============================================================================

export const UTSTYR_PRISER = {
  /** Priser for å konvertere sponsorbeløp til utstyr */
  skiPar: 8000, // Profesjonelle langrennsski
  ishockeyPuck: 50,
  fotball: 500,
  handball: 400,
  handballSko: 1200,
  toySett: 2000, // Drakt, shorts, sokker, genser, bukser
  kilde: KILDER.toppidrett,
} as const;
