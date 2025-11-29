# Ringvirkningsregnskap

## Prosjektbeskrivelse

Interaktivt dashboard for å visualisere samfunnsøkonomiske ringvirkninger for Norsk Sykepleierforbund (NSF). Applikasjonen oversetter økonomiske data til overbevisende historier om samfunnsverdi.

### Hva er ringvirkningsregnskap?

En metode for å vise en organisasjons totale samfunnsnytte - ikke bare bedriftsøkonomisk overskudd. Tenk på det som ringen i vannet: organisasjonen er steinen, ringvirkningene er bølgene.

**Tre nivåer:**
1. **Direkte** - Verdiskaping internt (lønn + driftsresultat)
2. **Indirekte** - Kjøp fra leverandører skaper arbeidsplasser
3. **Indusert** - Ansattes forbruk i lokalmiljøet (butikk, frisør, etc.)

### NSF-spesifikk vri

For helsesektoren fokuserer vi på **beredskap** fremfor lønnsomhet:
- Sykepleiere er en investering i folkehelse
- Dekningsgrad (sykepleiere per 1000 innbyggere)
- Vikarkostnader vs. faste stillinger

## Tech Stack

- **Frontend:** Next.js 14 + TypeScript + TailwindCSS
- **Database:** Firebase Firestore
- **Auth:** Firebase Authentication
- **Storage:** Firebase Storage (for Excel/PDF)
- **AI:** Claude API (Anthropic)
- **Visualisering:** Nivo (Sankey), React-Leaflet (kart), Recharts

## Hovedfunksjoner

1. **Sankey-diagram** - Visualiserer pengestrøm fra organisasjon til samfunn
2. **Kommunekart** - Varmekart over lokal tilstedeværelse
3. **Scenario-simulator** - "Hva skjer hvis vi ansetter 50 til?"
4. **Storytelling-motor** - AI genererer pressemeldinger fra tallene
5. **Filopplasting** - Import fra Excel, PDF, CSV

## Konfigurerbarhet

Alle beregninger er konfigurerbare via admin-panel:
- Multiplikatorer (indirekte, indusert, lokal retention)
- Skattesatser
- Egendefinerte formler

## Mappestruktur

```
/app              - Next.js sider og API routes
/components       - React-komponenter
/lib              - Business logic og Firebase
/types            - TypeScript-typer
```

## Miljøvariabler

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
ANTHROPIC_API_KEY=
```

## Kommandoer

```bash
npm run dev          # Utviklingsserver
npm run build        # Produksjonsbygg
npm run firebase:emulators  # Lokale Firebase-emulatorer
```

## Domenelogikk

### Ringvirkningsberegning
- Verdiskaping = Lønn + Driftsresultat
- Indirekte effekt = Direkte × multiplikator (standard: 0.5)
- Indusert effekt = Direkte × multiplikator (standard: 0.3)

### NSF-metrikker
- Dekningsgrad = Sykepleiere / (Befolkning / 1000)
- Vikarpremie = Vikarkostnad / Tilsvarende fast kostnad
