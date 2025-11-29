"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { HeroStat } from "@/components/ui/HeroStat";
import { AdvancedOnly } from "@/contexts/ViewModeContext";
import { TallMedKilde } from "@/components/kilde";
import { NSF_DATA, formaterKroner, getAlleKilderBrukt } from "@/lib/nsfData";
import { ARGUMENT_MALER, ArgumentMal } from "@/types/nsf";
import {
  FileText,
  Copy,
  Check,
  Download,
  MessageSquare,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function ArgumenterTab() {
  const [selectedArguments, setSelectedArguments] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const toggleArgument = (id: string) => {
    if (selectedArguments.includes(id)) {
      setSelectedArguments(selectedArguments.filter(a => a !== id));
    } else {
      setSelectedArguments([...selectedArguments, id]);
    }
  };

  const selectedMaler = ARGUMENT_MALER.filter(m => selectedArguments.includes(m.id));

  // Samle alle kilder fra valgte argumenter
  const alleKildeIder = selectedMaler.flatMap(m => m.datapunkter);
  const unikeKildeIder = Array.from(new Set(alleKildeIder));
  const unikeKilder = getAlleKilderBrukt(unikeKildeIder);

  const generateText = () => {
    if (selectedMaler.length === 0) return "";

    let text = "NSF ARGUMENTER\n";
    text += "=".repeat(50) + "\n\n";

    selectedMaler.forEach((mal, index) => {
      text += `${index + 1}. ${mal.tittel}\n`;
      text += "-".repeat(30) + "\n";
      text += `Motargument: "${mal.motargument}"\n\n`;
      text += `NSF svar: ${mal.nsftSvar}\n\n`;
    });

    text += "\nKILDER\n";
    text += "=".repeat(50) + "\n";
    unikeKilder.forEach(kilde => {
      text += `${kilde.sitatnokkel} ${kilde.tittel}. ${kilde.utgiver}, ${kilde.ar}.\n`;
      text += `   ${kilde.url}\n\n`;
    });

    return text;
  };

  const handleCopy = async () => {
    const text = generateText();
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const text = generateText();
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nsf-argumenter-${new Date().toISOString().split("T")[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Hero-seksjon */}
      <HeroStat
        title="Argumenter valgt"
        value={selectedMaler.length.toString()}
        description="Velg argumenter for å generere tekst med kilder"
        secondaryValue={`${unikeKilder.length} kilder`}
        secondaryDescription="tilknyttet"
        icon={<FileText size={24} />}
        variant="petrol"
      />

      <div className="grid grid-cols-12 gap-6">
        {/* Argument-velger */}
        <div className="col-span-5">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare size={18} className="text-petrol-500" />
              Velg argumenter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-500 mb-4">
              Velg argumentene du vil bruke. Tekst og kilder genereres automatisk.
            </p>

            <div className="space-y-3">
              {ARGUMENT_MALER.map((mal) => (
                <ArgumentCard
                  key={mal.id}
                  mal={mal}
                  isSelected={selectedArguments.includes(mal.id)}
                  onToggle={() => toggleArgument(mal.id)}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Nøkkeltall - kun i avansert modus */}
        <AdvancedOnly showMoreText="Vis nøkkeltall">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-sm">Nøkkeltall</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <div className="text-slate-500 text-xs mb-1">Sykepleiermangel</div>
                  <TallMedKilde
                    verdi={NSF_DATA.mangel.sykepleiereOgJordmodre.verdi.toLocaleString("nb-NO")}
                    kildeId="nav-mangel-2025"
                    className="font-semibold text-slate-800"
                  />
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <div className="text-slate-500 text-xs mb-1">Utenfor sektor</div>
                  <TallMedKilde
                    verdi={NSF_DATA.mangel.utenforSektor.verdi.toLocaleString("nb-NO")}
                    kildeId="ssb-utenfor-sektor"
                    className="font-semibold text-slate-800"
                  />
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <div className="text-slate-500 text-xs mb-1">Vikarbruk 2023</div>
                  <TallMedKilde
                    verdi={formaterKroner(NSF_DATA.vikar.total2023.verdi)}
                    kildeId="nsf-vikar-firedoblet"
                    className="font-semibold text-slate-800"
                  />
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <div className="text-slate-500 text-xs mb-1">Mangel 2040</div>
                  <TallMedKilde
                    verdi={NSF_DATA.mangel.fremskriving2040.verdi.toLocaleString("nb-NO")}
                    kildeId="ssb-fremskriving-2040"
                    className="font-semibold text-slate-800"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </AdvancedOnly>
      </div>

      {/* Generert tekst */}
      <div className="col-span-7">
        <Card className="h-full flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText size={18} className="text-petrol-500" />
                Generert tekst
              </CardTitle>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  disabled={selectedMaler.length === 0}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {copied ? <Check size={14} className="text-mint-500" /> : <Copy size={14} />}
                  {copied ? "Kopiert!" : "Kopier"}
                </button>
                <button
                  onClick={handleDownload}
                  disabled={selectedMaler.length === 0}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-petrol-500 text-white rounded-lg hover:bg-petrol-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download size={14} />
                  Last ned
                </button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            {selectedMaler.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-400 text-center">
                <div>
                  <MessageSquare size={48} className="mx-auto mb-3 opacity-50" />
                  <p>Velg argumenter fra listen til venstre</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Argumenter */}
                {selectedMaler.map((mal, index) => (
                  <div key={mal.id} className="p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-petrol-500 text-white text-sm flex items-center justify-center flex-shrink-0">
                        {index + 1}
                      </span>
                      <div>
                        <h4 className="font-semibold text-slate-800 mb-2">{mal.tittel}</h4>
                        <div className="bg-coral-50 border-l-4 border-coral-400 p-3 mb-3 rounded-r">
                          <p className="text-sm text-coral-700 italic">"{mal.motargument}"</p>
                        </div>
                        <div className="bg-mint-50 border-l-4 border-mint-400 p-3 rounded-r">
                          <p className="text-sm text-mint-800">{mal.nsftSvar}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Kilder */}
                {unikeKilder.length > 0 && (
                  <div className="border-t border-slate-200 pt-4">
                    <h4 className="font-medium text-slate-700 mb-3">Kilder</h4>
                    <div className="space-y-2">
                      {unikeKilder.map((kilde) => (
                        <div key={kilde.id} className="flex items-start gap-2 text-sm">
                          <span className="text-slate-400 font-mono">{kilde.sitatnokkel}</span>
                          <div className="flex-1">
                            <span className="text-slate-700">{kilde.tittel}.</span>
                            <span className="text-slate-500 ml-1">{kilde.utgiver}, {kilde.ar}.</span>
                            <a
                              href={kilde.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ml-2 inline-flex items-center gap-1 text-petrol-600 hover:text-petrol-700"
                            >
                              <ExternalLink size={12} />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  );
}

interface ArgumentCardProps {
  mal: ArgumentMal;
  isSelected: boolean;
  onToggle: () => void;
}

function ArgumentCard({ mal, isSelected, onToggle }: ArgumentCardProps) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "w-full p-4 rounded-xl border text-left transition-all",
        isSelected
          ? "bg-petrol-50 border-petrol-300 ring-2 ring-petrol-200"
          : "bg-white border-slate-200 hover:border-petrol-200"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="font-medium text-slate-800 mb-1">{mal.tittel}</h4>
          <p className="text-xs text-slate-500 italic mb-2">"{mal.motargument}"</p>
          <p className="text-sm text-slate-600 line-clamp-2">{mal.nsftSvar}</p>
        </div>
        <div className={cn(
          "w-5 h-5 rounded flex items-center justify-center flex-shrink-0",
          isSelected ? "bg-petrol-500 text-white" : "bg-slate-100"
        )}>
          {isSelected && <Check size={14} />}
        </div>
      </div>
    </button>
  );
}
