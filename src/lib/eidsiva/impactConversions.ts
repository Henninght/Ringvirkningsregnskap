/**
 * Impact-konverteringer for Eidsiva
 *
 * Konverterer energiproduksjon og sponsorbeløp til relaterbare enheter
 * Kilde: Rapport side 14, 17-20
 */

import { KILDER, EIDSIVA_NOKKELTALL, UTSTYR_PRISER } from "./eidsivaData";
import type { KildeRef } from "@/components/ui/SourceTooltip";

// =============================================================================
// ENERGI-KONVERTERINGER (Side 17)
// =============================================================================

export interface EnergyConversionFactors {
  kWhPerHusholdning: number;
  kWhPerInnbygger: number;
  kWhPerElbillading: number;
  kWhPerIdrettshall: number;
  kWhPerSykehus: number;
  kWhPerGrunnskole: number;
  kWhPerSvommehall: number;
  kWhPerSykehjem: number;
  kWhPerFotballbaneUndervarme: number;
  co2PerKWh: number;  // kg CO2 spart per kWh fornybar
}

export const ENERGY_FACTORS: EnergyConversionFactors = {
  kWhPerHusholdning: 16000,        // Årlig forbruk gjennomsnittshusholdning
  kWhPerInnbygger: 7500,           // Årlig forbruk per innbygger
  kWhPerElbillading: 16.3,         // kWh per full lading
  kWhPerIdrettshall: 178000,       // Årlig forbruk 25x45m hall
  kWhPerSykehus: 32_500_000,       // Årlig forbruk stort sykehus
  kWhPerGrunnskole: 544000,        // Årlig forbruk grunnskole
  kWhPerSvommehall: 2_550_000,     // Årlig forbruk svømmehall
  kWhPerSykehjem: 1_000_000,       // Årlig forbruk sykehjem
  kWhPerFotballbaneUndervarme: 650000, // Årlig forbruk kunstgress med undervarme
  co2PerKWh: 0.02,                 // kg CO2 spart vs nordisk mix
};

export interface EnergyConversion {
  id: string;
  navn: string;
  ikon: string;
  verdi: number;
  enhet: string;
  beskrivelse: string;
}

/**
 * Konverter GWh til relaterbare enheter
 */
export function convertEnergyGWh(
  gwh: number,
  factors: EnergyConversionFactors = ENERGY_FACTORS
): EnergyConversion[] {
  const kwh = gwh * 1_000_000; // GWh til kWh

  return [
    {
      id: "husholdninger",
      navn: "Husholdninger",
      ikon: "Home",
      verdi: Math.round(kwh / factors.kWhPerHusholdning),
      enhet: "husholdninger",
      beskrivelse: "Husholdninger som kan forsynes i ett år",
    },
    {
      id: "innbyggere",
      navn: "Innbyggere",
      ikon: "Users",
      verdi: Math.round(kwh / factors.kWhPerInnbygger),
      enhet: "personer",
      beskrivelse: "Innbyggeres årlige strømforbruk",
    },
    {
      id: "elbilladinger",
      navn: "Elbilladinger",
      ikon: "Car",
      verdi: Math.round(kwh / factors.kWhPerElbillading),
      enhet: "ladinger",
      beskrivelse: "Fulle elbilladinger (16,3 kWh)",
    },
    {
      id: "idrettshaller",
      navn: "Idrettshaller",
      ikon: "Dumbbell",
      verdi: Math.round(kwh / factors.kWhPerIdrettshall),
      enhet: "haller",
      beskrivelse: "Idrettshaller (25x45m) driftet i ett år",
    },
    {
      id: "sykehus",
      navn: "Sykehus",
      ikon: "Hospital",
      verdi: Math.round(kwh / factors.kWhPerSykehus),
      enhet: "sykehus",
      beskrivelse: "Store sykehus driftet i ett år",
    },
    {
      id: "grunnskoler",
      navn: "Grunnskoler",
      ikon: "School",
      verdi: Math.round(kwh / factors.kWhPerGrunnskole),
      enhet: "skoler",
      beskrivelse: "Grunnskoler driftet i ett år",
    },
    {
      id: "co2",
      navn: "CO₂-besparelse",
      ikon: "Leaf",
      verdi: Math.round(kwh * factors.co2PerKWh / 1000), // Tonn
      enhet: "tonn CO₂",
      beskrivelse: "Tonn CO₂ spart sammenlignet med fossil",
    },
  ];
}

/**
 * Konverter biokraft/fjernvarme GWh til varme-enheter
 */
export function convertHeatGWh(
  gwh: number,
  factors: EnergyConversionFactors = ENERGY_FACTORS
): EnergyConversion[] {
  const kwh = gwh * 1_000_000;

  return [
    {
      id: "husholdninger",
      navn: "Husholdninger varmet",
      ikon: "Home",
      verdi: Math.round(kwh / factors.kWhPerHusholdning),
      enhet: "husholdninger",
      beskrivelse: "Husholdninger som kan varmes opp",
    },
    {
      id: "idrettshaller",
      navn: "Idrettshaller varmet",
      ikon: "Dumbbell",
      verdi: Math.round(kwh / factors.kWhPerIdrettshall),
      enhet: "haller",
      beskrivelse: "Idrettshaller som kan varmes opp",
    },
    {
      id: "svommehaller",
      navn: "Svømmehaller varmet",
      ikon: "Waves",
      verdi: Math.round(kwh / factors.kWhPerSvommehall),
      enhet: "haller",
      beskrivelse: "Svømmehaller som kan varmes opp",
    },
    {
      id: "skoler",
      navn: "Skoler varmet",
      ikon: "School",
      verdi: Math.round(kwh / factors.kWhPerGrunnskole),
      enhet: "skoler",
      beskrivelse: "Skoler som kan varmes opp",
    },
    {
      id: "sykehjem",
      navn: "Sykehjem varmet",
      ikon: "Heart",
      verdi: Math.round(kwh / factors.kWhPerSykehjem),
      enhet: "sykehjem",
      beskrivelse: "Sykehjem som kan varmes opp",
    },
    {
      id: "fotballbaner",
      navn: "Fotballbaner m/undervarme",
      ikon: "CircleDot",
      verdi: Math.round(kwh / factors.kWhPerFotballbaneUndervarme),
      enhet: "baner",
      beskrivelse: "Kunstgressbaner med undervarme",
    },
  ];
}

// =============================================================================
// UTSTYR-KONVERTERINGER (Side 14)
// =============================================================================

export interface EquipmentConversion {
  id: string;
  navn: string;
  ikon: string;
  antall: number;
  enhet: string;
}

/**
 * Konverter sponsorbeløp til utstyr
 */
export function convertToEquipment(
  belopNOK: number,
  type: "ski" | "puck" | "fotball" | "handball" | "sko" | "toysett"
): EquipmentConversion {
  const priser = UTSTYR_PRISER;

  const conversions: Record<string, { pris: number; navn: string; ikon: string; enhet: string }> = {
    ski: { pris: priser.skiPar, navn: "Profesjonelle ski", ikon: "Mountain", enhet: "par" },
    puck: { pris: priser.ishockeyPuck, navn: "Ishockey-pucker", ikon: "Circle", enhet: "stk" },
    fotball: { pris: priser.fotball, navn: "Fotballer", ikon: "Circle", enhet: "stk" },
    handball: { pris: priser.handball, navn: "Håndballer", ikon: "Circle", enhet: "stk" },
    sko: { pris: priser.handballSko, navn: "Håndballsko", ikon: "Footprints", enhet: "par" },
    toysett: { pris: priser.toySett, navn: "Tøysett", ikon: "Shirt", enhet: "sett" },
  };

  const conv = conversions[type];
  return {
    id: type,
    navn: conv.navn,
    ikon: conv.ikon,
    antall: Math.floor(belopNOK / conv.pris),
    enhet: conv.enhet,
  };
}

// =============================================================================
// BIOKULL/CO2-KONVERTERINGER (Side 20)
// =============================================================================

export interface CarbonConversion {
  id: string;
  navn: string;
  ikon: string;
  verdi: number;
  enhet: string;
  beskrivelse: string;
}

/**
 * Konverter biokull-produksjon til CO2-ekvivalenter
 */
export function convertBiochar(tonnBiokull: number): CarbonConversion[] {
  // 1 tonn biokull lagrer ca 3 tonn CO2
  const co2Lagret = tonnBiokull * 3;

  // CO2 per flytur Oslo-Trondheim per person: ca 46 kg
  const co2PerFlytur = 46;

  return [
    {
      id: "co2",
      navn: "CO₂ lagret",
      ikon: "Cloud",
      verdi: co2Lagret,
      enhet: "tonn CO₂",
      beskrivelse: "Tonn CO₂ permanent lagret i biokull",
    },
    {
      id: "flyturer",
      navn: "Flyturer Oslo-Trondheim",
      ikon: "Plane",
      verdi: Math.round((co2Lagret * 1000) / co2PerFlytur), // kg til tonn
      enhet: "turer",
      beskrivelse: "Tilsvarende CO₂-utslipp fra flyreiser",
    },
    {
      id: "bilkm",
      navn: "Kjørelengde bil",
      ikon: "Car",
      verdi: Math.round((co2Lagret * 1000) / 0.12), // 120g CO2 per km
      enhet: "km",
      beskrivelse: "Tilsvarende CO₂-utslipp fra bilkjøring",
    },
  ];
}

// =============================================================================
// HEIMDALL-KONVERTERINGER (Side 19)
// =============================================================================

export interface GridCapacityConversion {
  id: string;
  navn: string;
  ikon: string;
  verdi: number;
  enhet: string;
  beskrivelse: string;
}

/**
 * Konverter nettkapasitetsøkning til relaterbare enheter
 */
export function convertGridCapacity(
  capacityIncreasePct: number,
  baseCapacityTWh: number = 28  // Antatt base-kapasitet
): GridCapacityConversion[] {
  const increaseTWh = baseCapacityTWh * (capacityIncreasePct / 100);
  const increaseGWh = increaseTWh * 1000;

  // Gjennomsnittlig husstand bruker ca 16 MWh/år
  const nyeHusstander = Math.round((increaseGWh * 1000) / 16);

  return [
    {
      id: "twh",
      navn: "Økt kapasitet",
      ikon: "Zap",
      verdi: Math.round(increaseTWh * 10) / 10,
      enhet: "TWh",
      beskrivelse: "Økt årlig overføringskapasitet",
    },
    {
      id: "husstander",
      navn: "Nye husstander",
      ikon: "Home",
      verdi: nyeHusstander,
      enhet: "husstander",
      beskrivelse: "Nye husstander som kan motta strøm",
    },
    {
      id: "sparing",
      navn: "Redusert utbyggingsbehov",
      ikon: "TrendingDown",
      verdi: capacityIncreasePct,
      enhet: "% reduksjon",
      beskrivelse: "Redusert behov for ny nettutbygging",
    },
  ];
}

// =============================================================================
// VÅLERENGA/INTILITY ARENA (Side 18)
// =============================================================================

export interface ArenaConversion {
  solcellerDekning: number;   // % av forbruk
  batteriBackup: number;      // Timer med flombelysning
  arligProduksjon: number;    // kWh
}

export function convertArenaImpact(
  solcellerM2: number,
  batteriKWh: number = 500
): ArenaConversion {
  // Ca 150 kWh per m2 per år for solceller i Norge
  const arligProduksjon = solcellerM2 * 150;

  // Antatt arenaforbruk: 3 GWh/år
  const arenaForbruk = 3_000_000;
  const solcellerDekning = (arligProduksjon / arenaForbruk) * 100;

  // Flombelysning bruker ca 250 kW
  const flombelysningKW = 250;
  const batteriBackup = batteriKWh / flombelysningKW;

  return {
    solcellerDekning: Math.round(solcellerDekning),
    batteriBackup: Math.round(batteriBackup * 10) / 10,
    arligProduksjon,
  };
}

// =============================================================================
// KILDER
// =============================================================================

export function getImpactKilder(): Record<string, KildeRef> {
  return {
    energi: KILDER.fornybarEnergi,
    utstyr: KILDER.toppidrett,
    biokull: KILDER.obio,
    heimdall: KILDER.heimdall,
    arena: KILDER.valerenga,
  };
}

// =============================================================================
// EKSPORT
// =============================================================================

export const impactConversions = {
  energy: convertEnergyGWh,
  heat: convertHeatGWh,
  equipment: convertToEquipment,
  biochar: convertBiochar,
  gridCapacity: convertGridCapacity,
  arena: convertArenaImpact,
  factors: ENERGY_FACTORS,
  kilder: getImpactKilder,
};
