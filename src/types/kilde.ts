/**
 * Kildehenvisningssystem for NSF Politikkverktøy
 * Alle tall skal kunne spores tilbake til offisielle kilder
 */

export interface Kilde {
  id: string;           // Unik ID, f.eks. "nav-2025-mangel"
  tittel: string;       // "NAV Bedriftsundersøkelse mai 2025"
  utgiver: string;      // "NAV", "NSF", "SSB"
  ar: number;           // 2025
  maned?: number;       // 5 (mai)
  url: string;          // Full URL til kilden
  sitatnokkel: string;  // "[^1]" for fotnoter
  sistOppdatert: string; // ISO dato for når kilden ble sjekket
}

export interface KildeReferanse {
  kildeId: string;
  verdi: number | string;
  beskrivelse: string;
  enhet?: "kr" | "mrd" | "mill" | "prosent" | "arsverk" | "antall";
}

export interface DataPunktMedKilde<T = number> {
  verdi: T;
  kildeId: string;
  beskrivelse?: string;
}

// Kildealder for visuell indikator
export type KildeAlder = "fersk" | "ok" | "gammel";

export function getKildeAlder(sistOppdatert: string): KildeAlder {
  const dato = new Date(sistOppdatert);
  const na = new Date();
  const manederSiden = (na.getTime() - dato.getTime()) / (1000 * 60 * 60 * 24 * 30);

  if (manederSiden < 6) return "fersk";
  if (manederSiden < 12) return "ok";
  return "gammel";
}

// Farger for kildealder
export const KILDE_ALDER_FARGER: Record<KildeAlder, string> = {
  fersk: "bg-mint-100 text-mint-700",
  ok: "bg-amber-100 text-amber-700",
  gammel: "bg-coral-100 text-coral-700",
};
