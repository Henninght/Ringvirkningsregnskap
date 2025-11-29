# Ringvirkningsregnskap - Multi-Fase Prosjektplan

## Nåværende Status

**✅ Implementert:**
- Next.js 14 struktur med TypeScript og TailwindCSS
- Dashboard-layout med sidebar, hovedinnhold og insights-panel
- KPI-kort (verdiskaping, sysselsetting, skattebidrag)
- Sankey-diagram (@nivo/sankey integrert)
- Diagrammer: SectorPieChart, HistoricalChart
- Prosjekttabell
- Mock-data struktur
- ✅ Scenario-simulator med live beregninger
- ✅ Kommunekart med varmekart (react-leaflet)
- ✅ Beregningsmotor med TypeScript-typer

**⏳ Mangler:**
- Storytelling-motor med Claude AI
- Filopplasting (Excel, PDF, CSV)
- Firebase-integrasjon (utsatt - legges inn når persistens trengs)
- Admin-panel for konfigurerbare parametere
- Fremskrivnings-gap-visualisering (tidslinje 2024-2040)

**✅ Nylig fullført (Fase 4):**
- NSF Politikkverktøy med 5 faner (Ringvirkninger, Vikarkalkulator, Bemanningseffekt, Oppgavedeling, Mobilisering, Argumenter)
- Referansedata-modul (`/lib/nsfData.ts`) med alle NSF-kilder
- Kildehenvisnings-system med `Kilde`-typer og `KildeTooltip`-komponent
- Argumentgenerator med ferdiglagde maler og eksport

---

## ✅ Fase 1: Simulator-side (FULLFØRT)
**Mål:** Interaktiv side hvor brukere kan "leke" med tallene

### 1.1 Simulator-layout (`/app/simulator/page.tsx`)
- [x] ✅ Tre-kolonne layout: Input | Visualisering | Resultater
- [ ] ⏳ Responsivt design for mobil

### 1.2 Input-paneler
- [x] ✅ **Grunndata-input**
  - Antall ansatte (slider + input)
  - Gjennomsnittlig lønn
  - Driftsresultat
  - Lokaliseringsandel (% i Norge)

- [x] ✅ **Multiplikator-kontroller**
  - Indirekte multiplikator (slider 0.3-0.8)
  - Indusert multiplikator (slider 0.2-0.5)
  - Lokal retention rate (slider 0.5-0.9)

- [x] ✅ **Scenariovalg**
  - "Hva hvis vi ansetter X flere?"
  - "Hva hvis lønnsnivået øker med X%?"
  - "Hva skjer ved nedbemannings-scenario?"

### 1.3 Live-oppdaterte visualiseringer
- [x] ✅ Mini Sankey-diagram som oppdateres i sanntid
- [ ] ⏳ Ringvirknings-kaskade (animert)
- [x] ✅ Sammenligning: Nåværende vs. Scenario

### 1.4 Resultat-panel
- [x] ✅ KPI-endringer (før/etter)
- [x] ✅ Detaljert nedbrytning av effekter
- [ ] ⏳ Eksport til PDF/Excel

---

## ✅ Fase 2: Beregningsmotor (FULLFØRT)
**Mål:** Gjenbrukbar logikk for ringvirkningsberegninger

### 2.1 TypeScript-typer (`/types/ripple.ts`)
- [x] ✅ `RippleConfig` - konfigurerbare multiplikatorer og satser
- [x] ✅ `RippleCalculation` - beregningsresultater
- [x] ✅ `OrganizationInput` - organisasjonsdata
- [x] ✅ `Scenario` - scenariodata for simulator
- [x] ✅ `Municipality` - kommunedata for kart

### 2.2 Beregningsfunksjoner (`/lib/calculations.ts`)
- [x] ✅ `calculateDirectEffect()` - Lønn + Driftsresultat
- [x] ✅ `calculateIndirectEffect()` - Direkte × multiplikator
- [x] ✅ `calculateInducedEffect()` - Forbrukseffekt
- [x] ✅ `calculateTotalRipple()` - Samlet ringvirkning
- [x] ✅ `calculateNsfMetrics()` - Dekningsgrad, vikarpremie
- [x] ✅ `generateSankeyData()` - Konverter til Sankey-format
- [x] ✅ `compareScenarios()` - Sammenlign baseline vs scenario

---

## ✅ Fase 3: Kommunekart (FULLFØRT)
**Mål:** Varmekart over lokal tilstedeværelse

### 3.1 React-Leaflet-oppsett
- [x] ✅ Installer `react-leaflet` og `leaflet`
- [x] ✅ Mock-data for 43 norske kommuner
- [x] ✅ `MunicipalityMap`-komponent

### 3.2 Varmekart-funksjonalitet
- [x] ✅ Fargeskala basert på sykepleiere per kommune
- [x] ✅ Tooltip med kommunedetaljer
- [x] ✅ Fylkesfiltrering

### 3.3 Data-integrasjon
- [x] ✅ Kobling mot ansattdata per lokasjon
- [x] ✅ Dekningsgrad per kommune (sykepleiere/1000 innb.)
- [x] ✅ `Municipality` type for kommunedata
- [x] ✅ Statistikk-paneler (flest sykepleiere, lavest dekning, fylkesoversikt)

---

## ✅ Fase 4: NSF Politikk & Argumentasjonsverktøy (FULLFØRT)
**Mål:** Gjøre simulatoren til et politisk verktøy som underbygger NSFs argumenter med kildehenvisninger

> **Bakgrunn:** NSF trenger verktøy for å vise politikere den samfunnsøkonomiske gevinsten av å investere i sykepleiere, fremfor å bare si "vi må bemanne opp".

---

### 4.1 Referansedata (2025 - Oppdatert med NSF-kilder)

**Sykepleiermangel - Nøkkeltall (2025):**
| Metrikk | Verdi | Kilde |
|---------|-------|-------|
| Mangel helse/sosial totalt | 11 450 | NAV Bedriftsundersøkelse mai 2025 [^1] |
| Mangel sykepleiere, spesialsykepleiere, jordmødre | 3 100 | NAV Bedriftsundersøkelse mai 2025 [^1] |
| Mangel helsefagarbeidere | 3 000 | NAV Bedriftsundersøkelse mai 2025 [^1] |
| Nåværende mangel (NSF estimat) | 4 300 | NSF.no 2025 [^2] |
| Fremskriving 2040 | 30 000 mangel | SSB via NSF [^2] |
| Fremskriving 2060 | 560 000 årsverk mangel | SSB/Helsepersonellkommisjonen [^3] |
| Sykepleiere utenfor helsesektoren | 17 000 | SSB [^4] |
| Vakter uten sykepleier (kommuner 2024) | 19% | NSF Bemanningsundersøkelse [^5] |
| Vakter erstattet av annen kompetanse | 16% | NSF Agder-kartlegging 2024 [^5] |

**Vikarbruk og kostnader (2023-tall, siste tilgjengelige):**
| Metrikk | Verdi | Kilde |
|---------|-------|-------|
| Kommuner - vikarkostnader 2023 | 3,0 mrd kr | NSF Vikarundersøkelse [^6] |
| Helseforetak - vikarkostnader 2023 | 956 mill kr | NSF Vikarundersøkelse [^6] |
| **Total vikarbruk 2023** | **~4,0 mrd kr** | NSF [^6] |
| Kommuner - vikarkostnader 2022 | 2,63 mrd kr | NSF [^7] |
| Økning 2021-2022 | +49,7% | NSF [^7] |
| Kommuner - vikarkostnader 2012 | 622 mill kr | NSF (baseline) [^7] |
| **Økning 2012-2023** | **~5x (firedoblet+)** | NSF [^6] |
| Tap: ubrukt utdanningskapasitet | 800 mill kr/år | NSF Sykepleierløftet [^8] |
| Troms/Finnmark vikarbruk per innbygger | 2,4x landsgj.snitt | NSF [^7] |

**Lønnsnivå og krav (2025):**
| Stilling | Årslønn/Krav | Kilde |
|----------|--------------|-------|
| Lønnsramme 2025 | 4,4% | NSF Lønnsoppgjøret 2025 [^9] |
| NHO løft 1. april 2025 | +26 325 - 33 000 kr | NSF [^9] |
| **NSF krav: Spesialsykepleier 10 års ansiennitet** | **650 000 kr** | NSF Sykepleierløftet [^8] |
| NSF krav: Full lønn under videreutdanning | Ja | NSF Sykepleierløftet [^8] |

**NSF Sykepleierløftet - 8 hovedkrav:**
| # | Krav | Kilde |
|---|------|-------|
| 1 | 650 000 kr grunnlønn for spesialsykepleiere | NSF [^8] |
| 2 | Full lønn under videreutdanning | NSF [^8] |
| 3 | Bemanningsnormer i kommunehelsetjenesten | NSF [^8] |
| 4 | Ledere må ha beslutningsmyndighet | NSF [^8] |
| 5 | Oppgavedeling og teknologi skal frigjøre sykepleierkapasitet | NSF [^8] |
| 6 | Yrkesskadeerstatning for belastningsskader | NSF [^8] |
| 7 | 11 timers hvile mellom vakter, maks hver 3. helg | NSF [^8] |
| 8 | Økt finansiering av sykepleierutdanning | NSF [^8] |

**Statsbudsjettet 2026 - NSF høringssvar:**
| Tema | NSF-posisjon | Kilde |
|------|--------------|-------|
| Kommuneøkonomi | "Så presset at det ikke er ressurser til nødvendig utbygging" | NSF Høring 2025 [^10] |
| Sykehusinntekter | "Ingen reell vekst - uansvarlig" | NSF Høring 2025 [^10] |
| Helseberedskap | "Forsvaret er avhengig av sterk offentlig helsetjeneste" | NSF Høring 2025 [^10] |
| Helsestasjoner/skolehelsetjeneste | Advarer mot å legge midler i bredere tilskuddsordning | NSF Høring 2025 [^10] |
| Helseteknologiordningen | Krav om dobling til 150 mill kr | NSF Høring 2025 [^10] |

**Oppgavedeling - NSF-posisjon:**
| Prinsipp | Beskrivelse | Kilde |
|----------|-------------|-------|
| Pasientfokus | "Pasientenes behov må alltid stå i sentrum" | NSF [^11] |
| Planmessig | "Må skje med bevissthet, planlegging, system og tydelig faglig ledelse" | NSF [^11] |
| Kompetansekrav | Oppgavedeling må stå i samsvar med den ansattes kompetanse | NSF [^11] |
| Støttefunksjoner | Kan trenge sekretærer, postverter, logistikkmedarbeidere | NSF [^11] |
| Teknologi | E-helse og ny teknologi skal frigjøre sykepleierkapasitet | NSF [^11] |

---

### 4.2 Nye simulatorfunksjoner

#### 4.2.1 Bemanning opp/ned-simulator ✅
- [x] ✅ Input: Endre antall sykepleiere (+/- X)
- [x] ✅ Vise ringvirkning på:
  - Verdiskaping (direkte, indirekte, indusert)
  - Frigjorte/tapte årsverk
  - Skatteeffekt
  - Vikarkostnader spart/påløpt
- [x] ✅ Referanse til SSB-fremskrivning i kontekst
- [x] ✅ Implementert i `BemanningseffektTab.tsx`

#### 4.2.2 Vikarkost-kalkulator ✅
- [x] ✅ Input: Antall vikartimer/måned
- [x] ✅ Beregne:
  - Faktisk vikarkostnad (med 2,5x multiplikator)
  - Alternativkostnad: Hva tilsvarende faste stillinger ville kostet
  - Årlig besparelse ved konvertering
- [x] ✅ Vise nasjonal kontekst (4 mrd totalt i 2023)
- [x] ✅ Implementert i `VikarkalkulatorTab.tsx`

#### 4.2.3 Oppgavedeling-simulator ✅
- [x] ✅ Velg oppgavetype som flyttes (journalføring, medisinutdeling, etc.)
- [x] ✅ Input: Timer/uke brukt på oppgaven per sykepleier
- [x] ✅ Beregne frigjorte årsverk:
  ```
  Frigjorte årsverk = (timer/uke × antall_sykepleiere × 52) / 1695
  ```
- [x] ✅ Vise hva frigjort tid kan brukes til (pleie, omsorg)
- [x] ✅ Implementert i `OppgavedelingTab.tsx`

#### 4.2.4 Mobiliserings-simulator ("17 000-argumentet") ✅
- [x] ✅ Input: Hvor mange % av de 17 000 som jobber utenfor helsesektoren kan mobiliseres?
- [x] ✅ Vise:
  - Antall potensielle årsverk
  - Reduksjon i mangel (fra X til Y)
  - Forutsetninger for mobilisering (lønn, arbeidsforhold)
- [x] ✅ Kildehenvisning til SSB-data
- [x] ✅ Implementert i `MobiliseringTab.tsx`

#### 4.2.5 Fremskrivnings-gap-visualisering ⏳
- [ ] Tidslinje fra 2024 til 2040
- [ ] Vise:
  - Forventet behov (SSB)
  - Forventet tilgang (SSB)
  - Gap (mangel)
- [ ] Interaktiv: "Hva om vi utdanner X flere per år?"

---

### 4.3 Argumentgenerator ✅

#### 4.3.1 Ferdiglagde argumentmaler ✅
- [x] ✅ **"Vi har ikke flere folk"** → Vis 17 000-tallet + mobiliseringspotensial
- [x] ✅ **"Det er for dyrt"** → Vis vikarkost vs fast + samfunnsøkonomisk gevinst
- [x] ✅ **"Oppgavene må løses"** → Vis oppgavedeling-potensial
- [x] ✅ **"Det tar for lang tid"** → Vis SSB-fremskrivning og konsekvenser
- [x] ✅ Implementert i `ArgumenterTab.tsx` med ARGUMENT_MALER fra `/types/nsf.ts`

#### 4.3.2 Eksportformater
- [x] ✅ Kopier til utklippstavle (formatert tekst med kilder)
- [x] ✅ Last ned som .txt-fil med kildeliste
- [ ] ⏳ One-pager for politikermøte (PDF)
- [ ] ⏳ Presentasjonsformat (3-5 slides)

---

### 4.4 Kildehenvisnings-system ✅

#### 4.4.1 Referansedatabase ✅
- [x] ✅ `Kilde` interface i `/types/kilde.ts`
- [x] ✅ `DataPunktMedKilde<T>` for typesikre datapunkter
- [x] ✅ `KildeAlder` type med fargekoding (fersk/ok/gammel)
- [x] ✅ 13 kilder registrert i `NSF_KILDER` (`/lib/nsfData.ts`)

#### 4.4.2 Automatisk kildehenvisning ✅
- [x] ✅ `KildeTooltip`-komponent med hover-visning
- [x] ✅ `KildeBadge`-komponent for inline-visning
- [x] ✅ `TallMedKilde`-komponent for tall med kildehenvisning
- [x] ✅ Alle tall i UI har tooltip med kilde
- [x] ✅ Eksporter inkluderer alltid kildeliste
- [x] ✅ Visuell indikator for kildealder (grønn/gul/rød)

---

### 4.5 NSF-spesifikke KPIer (utvidelse av dashboardet)

- [x] ✅ **Nøkkeltall-paneler**: Mangel, utenfor sektor, vikarbruk, fremskriving (i ArgumenterTab)
- [ ] ⏳ **Sykepleiermangel-barometer**: Nasjonal mangel med regional fordeling
- [ ] ⏳ **Vikarkostnad-tracker**: Akkumulert vikarkostnad over tid
- [x] ✅ **Dekningsgrad-kart**: Sykepleiere per 1000 innbyggere per kommune (i kommunekart)
- [ ] ⏳ **Bemannings-alarm**: Kommuner/institusjoner under kritisk nivå

---

### 4.6 Implementasjonsrekkefølge

| # | Oppgave | Kompleksitet | Status |
|---|---------|--------------|--------|
| 1 | Referansedata-modul (`/lib/nsfData.ts`) | Lav | ✅ Fullført |
| 2 | Kildehenvisnings-komponent | Lav | ✅ Fullført |
| 3 | Bemanning opp/ned-simulator | Medium | ✅ Fullført |
| 4 | Vikarkost-kalkulator | Medium | ✅ Fullført |
| 5 | Oppgavedeling-simulator | Medium | ✅ Fullført |
| 6 | Mobiliserings-simulator | Medium | ✅ Fullført |
| 7 | Fremskrivnings-visualisering | Høy | ⏳ Gjenstår |
| 8 | Argumentgenerator | Høy | ✅ Fullført |

---

### 4.7 Kildeliste (Oppdatert november 2025)

[^1]: NAV Bedriftsundersøkelse mai 2025. "Ferske tall fra NAV viser kritisk mangel på helsepersonell." https://www.nsf.no/artikkel/ferske-tall-fra-nav-viser-kritisk-mangel-pa-helsepersonell

[^2]: Norsk Sykepleierforbund. "Rekruttere, mobilisere og beholde sykepleiere." https://www.nsf.no/vart-politiske-arbeid/rekruttere-mobilisere-og-beholde-sykepleiere

[^3]: Norsk Sykepleierforbund. "Krise i norsk helseberedskap: Regjeringen slår alarm om sykepleiermangel." April 2025. https://www.nsf.no/artikkel/krise-i-norsk-helseberedskap-regjeringen-slar-alarm-om-sykepleiermangel

[^4]: SSB via NSF. "17 000 sykepleiere jobber utenfor helsesektoren." https://www.nsf.no/vart-politiske-arbeid/rekruttere-mobilisere-og-beholde-sykepleiere

[^5]: Norsk Sykepleierforbund. "Planlagt og faktisk bemanning 2024-2025." https://www.nsf.no/fylke/rogaland/nyheter/klar-ferdig-ga-planlagt-og-faktisk-bemanning-2025 og https://www.nsf.no/fylke/agder/nyheter/planlagt-og-faktisk-bemanning-i-agder

[^6]: Norsk Sykepleierforbund. "Vikarbruken har firedoblet seg." 2024. https://www.nsf.no/artikkel/vikarbruken-har-firedoblet-seg

[^7]: Norsk Sykepleierforbund. "Sykepleiervikarer for 3,6 milliarder." 2023. https://www.nsf.no/artikkel/sykepleiervikarer-36-milliarder

[^8]: Norsk Sykepleierforbund. "Sykepleierløftet - 8 krav." https://www.nsf.no/sykepleierloftet

[^9]: Norsk Sykepleierforbund. "Lønnsoppgjøret 2025." https://www.nsf.no/lonn-og-tariff/lonnsoppgjoret-2025

[^10]: Norsk Sykepleierforbund. "Helsetjenesten stopper uten en satsing på helsepersonell." Statsbudsjettet 2026 høring. https://www.nsf.no/artikkel/helsetjenesten-stopper-uten-en-satsing-pa-helsepersonell og https://www.nsf.no/artikkel/horing-i-arbeids-og-sosialkomiteen-pa-stortinget

[^11]: Norsk Sykepleierforbund. "Ansvars- og oppgavedeling i et sykepleierperspektiv." https://www.nsf.no/nyheter/sykepleierfaget/ansvars-og-oppgavedeling-i-et-sykepleierperspektiv

[^12]: Norsk Sykepleierforbund. "Lav fast bemanning = dårlige tjenester." https://www.nsf.no/artikkel/lav-fast-bemanning-darlige-tjenester

[^13]: Norsk Sykepleierforbund. "Utvikle helse- og omsorgstjenestene." https://www.nsf.no/vart-politiske-arbeid/utvikle-helse-og-omsorgstjenestene

---

## ⏳ Fase 5: Storytelling-motor
**Mål:** AI genererer pressemeldinger fra tallene

### 5.1 Claude API-integrasjon
- [ ] API-route (`/app/api/generate-story/route.ts`)
- [ ] Prompt-templating for ulike formål
- [ ] Rate limiting og caching

### 5.2 Story-typer
- [ ] Pressemelding
- [ ] Årsrapport-avsnitt
- [ ] Styrepresentasjon
- [ ] Sosiale medier-innlegg

### 5.3 UI-komponenter
- [ ] Story-generator panel
- [ ] Tone/stil-velger
- [ ] Rediger og eksporter

---

## ⏳ Fase 6: Firebase-integrasjon
**Mål:** Persistens og brukeradministrasjon (når nødvendig)

### 5.1 Firebase-oppsett
- [ ] Firebase-konfigurasjon (`/lib/firebase.ts`)
- [ ] Firestore-skjema for organisasjoner, beregninger, config
- [ ] Auth-integrasjon for admin-tilgang
- [ ] Storage for filopplasting

### 5.2 Migrering fra mock-data
- [ ] Erstatte `mockData.ts` med Firestore-kall
- [ ] Custom hooks for datahenting (`useOrganization`, etc.)

---

## ⏳ Fase 6: Filopplasting og Import
**Mål:** Import fra Excel, PDF, CSV

### 6.1 Upload-infrastruktur
- [ ] Drag-and-drop upload-komponent
- [ ] Firebase Storage-integrasjon
- [ ] Filvalidering

### 6.2 Parsing
- [ ] Excel-parsing (`xlsx` bibliotek)
- [ ] CSV-parsing
- [ ] PDF-tekstekstraksjon (Claude Vision?)

### 6.3 Data-mapping
- [ ] Automatisk kolonnegjenkjenning
- [ ] Manuell mapping-UI
- [ ] Validering og feilhåndtering

---

## ⏳ Fase 7: Admin-panel
**Mål:** Konfigurere alle beregningsparametere

### 7.1 Autentisering
- [ ] Firebase Auth med e-post/passord
- [ ] Admin-rolle sjekk
- [ ] Protected routes

### 7.2 Konfigurasjonspaneler
- [ ] Multiplikator-innstillinger
- [ ] Skattesatser
- [ ] Egendefinerte formler (formel-editor)
- [ ] Bransjespesifikke standarder

### 7.3 Audit-logg
- [ ] Hvem endret hva, når
- [ ] Tilbakerulling av endringer

---

## ⏳ Fase 8: NSF-spesifikke Funksjoner
**Mål:** Helsesektorens unike metrikker

### 8.1 Beredskapsmetrikker
- [ ] Dekningsgrad-kalkulator
- [ ] Vikarpremie-analyse
- [ ] Turnover-kostnadsberegning

### 8.2 Benchmark-modul
- [ ] Sammenligning med nasjonale standarder
- [ ] Kommune-vs-kommune sammenligning
- [ ] Trendanalyse over tid

### 8.3 Rapporter
- [ ] NSF-spesifikke rapportmaler
- [ ] Automatisk kvartalsrapport
- [ ] Styrepresentasjoner

---

## Teknisk Gjeld & Kvalitet

### Kontinuerlig
- [ ] Testing (Jest + React Testing Library)
- [ ] E2E-tester (Playwright)
- [ ] Tilgjengelighet (WCAG 2.1 AA)
- [ ] Performance-optimalisering
- [ ] Dokumentasjon

---

## Prioritert Rekkefølge

| # | Fase | Status | Firebase? | Begrunnelse |
|---|------|--------|-----------|-------------|
| 1 | Simulator | ✅ Fullført | Nei | Brukerverdi, demonstrerer konseptet |
| 2 | Beregningsmotor | ✅ Fullført | Nei | Gjenbrukbar logikk |
| 3 | Kommunekart | ✅ Fullført | Nei | Geografisk innsikt |
| 4 | NSF Politikk | ✅ Fullført | Nei | Politisk argumentasjonsverktøy |
| 5 | Storytelling | ⏳ Neste | Nei | AI-differensiator |
| 6 | **Firebase** | ⏳ | ✓ | Persistens når nødvendig |
| 7 | Filopplasting | ⏳ | Ja | Storage-avhengig |
| 8 | Admin-panel | ⏳ | Ja | Auth-avhengig |

---

## Neste Steg

**🎯 Fase 5: Storytelling-motor**
1. Opprette API-route for Claude
2. Bygge prompt-templates for ulike formater
3. Implementere story-generator UI
4. Legge til eksport-funksjonalitet

**Gjenstående fra Fase 4:**
- Fremskrivnings-gap-visualisering (tidslinje 2024-2040)
- PDF-eksport for argumenter
- Sykepleiermangel-barometer
