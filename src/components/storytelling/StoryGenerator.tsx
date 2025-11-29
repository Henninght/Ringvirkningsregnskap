"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { RippleCalculation } from "@/types/ripple";
import { formatRippleValue } from "@/lib/calculations";
import {
  Sparkles,
  FileText,
  Newspaper,
  Presentation,
  MessageSquare,
  Copy,
  Check,
  RefreshCw,
  ChevronRight,
  Wand2
} from "lucide-react";
import { cn } from "@/lib/utils";

type StoryFormat = "pressemelding" | "rapport" | "presentasjon" | "some";

interface StoryTemplate {
  id: StoryFormat;
  label: string;
  icon: typeof FileText;
  description: string;
}

const STORY_TEMPLATES: StoryTemplate[] = [
  {
    id: "pressemelding",
    label: "Pressemelding",
    icon: Newspaper,
    description: "Offisiell uttalelse for media"
  },
  {
    id: "rapport",
    label: "Arsrapport",
    icon: FileText,
    description: "Formelt avsnitt til styredokument"
  },
  {
    id: "presentasjon",
    label: "Presentasjon",
    icon: Presentation,
    description: "Punktliste for slides"
  },
  {
    id: "some",
    label: "Sosiale medier",
    icon: MessageSquare,
    description: "Kort innlegg for LinkedIn/X"
  },
];

interface StoryGeneratorProps {
  calculation: RippleCalculation;
  organizationName?: string;
}

// Template-basert story generation (uten API-kall)
function generateStoryTemplate(
  format: StoryFormat,
  calculation: RippleCalculation,
  orgName: string
): string {
  const { totals, directEffect, indirectEffect, inducedEffect } = calculation;
  const valueInBillions = (totals.valueCreation / 1000000000).toFixed(2);
  const employmentEffect = Math.round(totals.employment);
  const taxInMillions = Math.round(totals.taxContribution / 1000000);

  switch (format) {
    case "pressemelding":
      return `PRESSEMELDING

${orgName} bidrar med ${valueInBillions} milliarder kroner til samfunnet

${new Date().toLocaleDateString("nb-NO", { day: "numeric", month: "long", year: "numeric" })} - En ny ringvirkningsanalyse viser at ${orgName} skaper betydelige verdier for det norske samfunnet.

Hovedfunn:
- Total verdiskaping: ${formatRippleValue(totals.valueCreation, "currency")}
- Sysselsettingseffekt: ${employmentEffect} arsverk
- Skattebidrag: ${taxInMillions} millioner kroner
- Multiplikatoreffekt: ${totals.multiplierEffect.toFixed(2)}x

"Disse tallene viser tydelig at var virksomhet ikke bare handler om vare tjenester, men ogsa om a bygge beredskap og verdier for hele samfunnet," sier ledelsen i ${orgName}.

Analysen viser at for hver krone i direkte verdiskaping, genereres totalt ${totals.multiplierEffect.toFixed(2)} kroner i ringvirkninger gjennom leverandorkjeder og lokalt forbruk.

For mer informasjon, kontakt: [kontaktinfo]`;

    case "rapport":
      return `Samfunnsøkonomiske ringvirkninger

${orgName}s aktiviteter genererer betydelige samfunnsmessige verdier ut over den direkte virksomheten. Vår ringvirkningsanalyse dokumenterer følgende effekter:

1. Direkte effekter (${formatRippleValue(directEffect.total, "currency")})
Organisasjonens interne verdiskaping gjennom lønninger (${formatRippleValue(directEffect.wages, "currency")}) og driftsresultat representerer grunnlaget for de videre ringvirkningene.

2. Indirekte effekter (${formatRippleValue(indirectEffect.total, "currency")})
Gjennom vår leverandørkjede skaper vi verdier og arbeidsplasser hos underleverandører og samarbeidspartnere. Estimert sysselsettingseffekt hos leverandører er ${Math.round(indirectEffect.supplierEmployment)} årsverk.

3. Induserte effekter (${formatRippleValue(inducedEffect.total, "currency")})
Ansattes forbruk i lokalsamfunnet bidrar til ytterligere økonomisk aktivitet, med en lokal økonomieffekt på ${formatRippleValue(inducedEffect.localEconomyEffect, "currency")}.

Samlet verdi: ${formatRippleValue(totals.valueCreation, "currency")} med en multiplikatoreffekt på ${totals.multiplierEffect.toFixed(2)}x.`;

    case "presentasjon":
      return `RINGVIRKNINGER - ${orgName.toUpperCase()}

VERDISKAPING
* Total: ${valueInBillions} mrd NOK
* Multiplikator: ${totals.multiplierEffect.toFixed(2)}x

TRE EFFEKTNIVAAER
* Direkte: ${formatRippleValue(directEffect.total, "currency")} (lonn + drift)
* Indirekte: ${formatRippleValue(indirectEffect.total, "currency")} (leverandorer)
* Induserte: ${formatRippleValue(inducedEffect.total, "currency")} (forbruk)

SAMFUNNSBIDRAG
* ${employmentEffect} arsverk totalt
* ${taxInMillions} mill i skattebidrag
* Bygger beredskap og folkehelse

NESTE STEG
* Styrke lokal tilstedevarelse
* Investere i kompetanse
* Oke dekningsgrad`;

    case "some":
      return `Visste du at ${orgName} bidrar med ${valueInBillions} milliarder kroner til det norske samfunnet?

Var ringvirkningsanalyse viser:
- ${employmentEffect} arbeidsplasser
- ${taxInMillions} mill i skattebidrag
- ${totals.multiplierEffect.toFixed(2)}x multiplikatoreffekt

Vi skaper ikke bare verdier - vi bygger beredskap for fremtiden.

#samfunnsansvar #beredskap #verdiskaping #helse`;

    default:
      return "";
  }
}

export function StoryGenerator({
  calculation,
  organizationName = "Organisasjonen"
}: StoryGeneratorProps) {
  const [selectedFormat, setSelectedFormat] = useState<StoryFormat>("pressemelding");
  const [generatedStory, setGeneratedStory] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);

    // Simuler AI-generering (i produksjon: API-kall til Claude)
    await new Promise(resolve => setTimeout(resolve, 800));

    const story = generateStoryTemplate(selectedFormat, calculation, organizationName);
    setGeneratedStory(story);
    setIsGenerating(false);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedStory);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="animate-slide-up">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles size={18} className="text-lavender-400" />
          Storytelling
        </CardTitle>
        <p className="text-sm text-slate-500 mt-1">
          Generer kommunikasjonsinnhold fra ringvirkningsdata
        </p>
      </CardHeader>
      <CardContent>
        {/* Format-velger */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {STORY_TEMPLATES.map((template) => {
            const Icon = template.icon;
            const isSelected = selectedFormat === template.id;

            return (
              <button
                key={template.id}
                onClick={() => setSelectedFormat(template.id)}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-xl border transition-all text-left",
                  isSelected
                    ? "bg-lavender-50 border-lavender-200 ring-2 ring-lavender-300/30"
                    : "bg-white border-slate-200 hover:border-lavender-200 hover:bg-lavender-50/50"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center",
                  isSelected ? "bg-lavender-400 text-white" : "bg-slate-100 text-slate-500"
                )}>
                  <Icon size={16} />
                </div>
                <div>
                  <div className="font-medium text-sm text-slate-800">{template.label}</div>
                  <div className="text-xs text-slate-500">{template.description}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Generer-knapp */}
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full py-3 px-4 bg-gradient-to-r from-lavender-400 to-lavender-500 text-white rounded-xl font-medium text-sm hover:from-lavender-500 hover:to-lavender-600 transition-all duration-300 flex items-center justify-center gap-2 group shadow-soft disabled:opacity-70"
        >
          {isGenerating ? (
            <>
              <RefreshCw size={16} className="animate-spin" />
              <span>Genererer...</span>
            </>
          ) : (
            <>
              <Wand2 size={16} />
              <span>Generer {STORY_TEMPLATES.find(t => t.id === selectedFormat)?.label}</span>
            </>
          )}
        </button>

        {/* Generert innhold */}
        {generatedStory && (
          <div className="mt-4 animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Resultat
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                {copied ? (
                  <>
                    <Check size={14} className="text-mint-500" />
                    <span className="text-mint-600">Kopiert!</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span>Kopier</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <pre className="whitespace-pre-wrap text-sm text-slate-700 font-sans leading-relaxed">
                {generatedStory}
              </pre>
            </div>

            <p className="mt-3 text-xs text-slate-400 flex items-center gap-1.5">
              <Sparkles size={12} />
              Generert basert pa mal. For AI-generert innhold, koble til Claude API.
            </p>
          </div>
        )}

        {/* CTA for full AI-modus */}
        {!generatedStory && (
          <div className="mt-4 p-4 bg-gradient-to-r from-slate-50 to-lavender-50/30 rounded-xl border border-dashed border-slate-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-lavender-100 flex items-center justify-center flex-shrink-0">
                <Sparkles size={18} className="text-lavender-500" />
              </div>
              <div>
                <h4 className="font-medium text-slate-800 text-sm">AI-drevet storytelling</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Koble til Claude API for automatisk generering av skreddersydd innhold
                  tilpasset din tone og formal.
                </p>
                <button className="mt-2 text-xs text-lavender-600 hover:text-lavender-700 font-medium flex items-center gap-1">
                  Konfigurer API-nokkel
                  <ChevronRight size={12} />
                </button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
