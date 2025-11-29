"use client";

import { useState, useEffect, ReactNode } from "react";
import { X, ChevronRight, ChevronLeft, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

interface OnboardingStep {
  id: string;
  title: string;
  content: string;
  target?: string; // CSS selector for highlighting
  position?: "top" | "bottom" | "left" | "right";
}

interface OnboardingTooltipProps {
  steps: OnboardingStep[];
  storageKey: string;
  onComplete?: () => void;
  onSkip?: () => void;
}

export function OnboardingTooltip({
  steps,
  storageKey,
  onComplete,
  onSkip,
}: OnboardingTooltipProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);

  useEffect(() => {
    // Check if user has already completed onboarding
    const completed = localStorage.getItem(`onboarding-${storageKey}`);
    if (completed === "true") {
      setHasCompleted(true);
    } else {
      setIsVisible(true);
    }
  }, [storageKey]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem(`onboarding-${storageKey}`, "true");
    setIsVisible(false);
    setHasCompleted(true);
    onComplete?.();
  };

  const handleSkip = () => {
    localStorage.setItem(`onboarding-${storageKey}`, "true");
    setIsVisible(false);
    setHasCompleted(true);
    onSkip?.();
  };

  if (!isVisible || hasCompleted) return null;

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 pointer-events-auto" onClick={handleSkip} />

      {/* Tooltip card */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 max-w-md w-full mx-4 pointer-events-auto animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white rounded-2xl shadow-elevated p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-mint-100 flex items-center justify-center">
                <Lightbulb size={20} className="text-mint-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800" style={{ fontFamily: "var(--font-outfit)" }}>
                  {step.title}
                </h3>
                <p className="text-xs text-slate-400">
                  Steg {currentStep + 1} av {steps.length}
                </p>
              </div>
            </div>
            <button
              onClick={handleSkip}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Lukk veiledning"
            >
              <X size={18} />
            </button>
          </div>

          {/* Content */}
          <p className="text-sm text-slate-600 mb-6 leading-relaxed">
            {step.content}
          </p>

          {/* Progress dots */}
          <div className="flex items-center justify-center gap-1.5 mb-4">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-200",
                  index === currentStep
                    ? "w-6 bg-mint-500"
                    : index < currentStep
                    ? "bg-mint-300"
                    : "bg-slate-200"
                )}
                aria-label={`Ga til steg ${index + 1}`}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleSkip}
              className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
            >
              Hopp over
            </button>

            <div className="flex items-center gap-2">
              {!isFirstStep && (
                <button
                  onClick={handlePrev}
                  className="flex items-center gap-1 px-3 py-2 text-sm text-slate-600 hover:text-slate-800 transition-colors"
                >
                  <ChevronLeft size={16} />
                  Tilbake
                </button>
              )}
              <button
                onClick={handleNext}
                className="flex items-center gap-1 px-4 py-2 bg-mint-500 text-white rounded-xl text-sm font-medium hover:bg-mint-600 transition-colors"
              >
                {isLastStep ? "Kom i gang" : "Neste"}
                {!isLastStep && <ChevronRight size={16} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Predefined onboarding steps for the simulator
export const simulatorOnboardingSteps: OnboardingStep[] = [
  {
    id: "welcome",
    title: "Velkommen til simulatoren",
    content: "Her kan du utforske hvordan endringer i organisasjonen din påvirker samfunnsøkonomien. La oss ta en rask gjennomgang av verktøyene.",
  },
  {
    id: "input",
    title: "Juster grunndata",
    content: "Start med å angi grunndata som antall ansatte, lønnsnivå og driftsresultat. Bruk glidebryterne eller skriv inn tall direkte for mer presise verdier.",
  },
  {
    id: "scenarios",
    title: "Utforsk scenarier",
    content: "Velg et forhåndsdefinert scenario for å se hva som skjer om du ansetter flere, øker lønninger eller nedbemanner. Du kan også lage egne scenarier.",
  },
  {
    id: "results",
    title: "Forstå resultatene",
    content: "Sankey-diagrammet viser hvordan verdiskapingen flyter gjennom økonomien. Resultatpanelet gir deg detaljerte tall på direkte, indirekte og induserte effekter.",
  },
  {
    id: "save",
    title: "Lagre og sammenlign",
    content: "Bruk verktøylinjen til å lagre beregninger, angre endringer eller eksportere resultater. Du kan også sammenligne ulike beregninger side om side.",
  },
];

// Predefined onboarding steps for the map
export const mapOnboardingSteps: OnboardingStep[] = [
  {
    id: "welcome",
    title: "Kommunekart",
    content: "Her kan du utforske geografisk fordeling av sykepleiere og dekningsgrad pa tvers av norske kommuner.",
  },
  {
    id: "filters",
    title: "Filtrer visningen",
    content: "Bruk fylkefiltrene over kartet for a fokusere pa et bestemt omrade. Du kan ogsa bytte mellom ulike metrikker.",
  },
  {
    id: "interact",
    title: "Utforsk kommuner",
    content: "Klikk pa en kommune for a se detaljert informasjon. Storrelse og farge pa sirklene viser relativ verdi for valgt metrikk.",
  },
];
