"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { CheckCircle, Circle, Loader2 } from "lucide-react";

interface ProgressStep {
  id: string;
  label: string;
  description?: string;
}

interface StepProgressProps {
  steps: ProgressStep[];
  currentStep: number;
  className?: string;
}

export function StepProgress({ steps, currentStep, className }: StepProgressProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const isPending = index > currentStep;

        return (
          <div key={step.id} className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
                  isCompleted && "bg-mint-500 text-white",
                  isCurrent && "bg-mint-100 text-mint-600 border-2 border-mint-500",
                  isPending && "bg-slate-100 text-slate-400"
                )}
              >
                {isCompleted ? (
                  <CheckCircle size={18} />
                ) : isCurrent ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Circle size={18} />
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "w-0.5 h-8 mt-1 transition-colors duration-300",
                    isCompleted ? "bg-mint-500" : "bg-slate-200"
                  )}
                />
              )}
            </div>
            <div className={cn("pt-1", isPending && "opacity-50")}>
              <div className="font-medium text-sm text-slate-800">{step.label}</div>
              {step.description && (
                <div className="text-xs text-slate-500 mt-0.5">{step.description}</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

interface LinearProgressProps {
  progress: number; // 0-100
  label?: string;
  showPercentage?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "success" | "warning" | "error";
  className?: string;
  animated?: boolean;
}

export function LinearProgress({
  progress,
  label,
  showPercentage = true,
  size = "md",
  variant = "default",
  className,
  animated = true,
}: LinearProgressProps) {
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => setDisplayProgress(progress), 100);
      return () => clearTimeout(timer);
    } else {
      setDisplayProgress(progress);
    }
  }, [progress, animated]);

  const sizeClasses = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  };

  const variantClasses = {
    default: "bg-mint-500",
    success: "bg-green-500",
    warning: "bg-amber-500",
    error: "bg-coral-500",
  };

  return (
    <div className={cn("space-y-2", className)}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between text-sm">
          {label && <span className="text-slate-600">{label}</span>}
          {showPercentage && (
            <span className="font-medium text-slate-700">{Math.round(displayProgress)}%</span>
          )}
        </div>
      )}
      <div className={cn("w-full bg-slate-200 rounded-full overflow-hidden", sizeClasses[size])}>
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            variantClasses[variant]
          )}
          style={{ width: `${displayProgress}%` }}
          role="progressbar"
          aria-valuenow={displayProgress}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}

interface CalculationProgressProps {
  isCalculating: boolean;
  steps?: string[];
  currentStepIndex?: number;
}

export function CalculationProgress({
  isCalculating,
  steps = ["Beregner direkte effekter", "Beregner indirekte effekter", "Beregner induserte effekter", "Genererer resultater"],
  currentStepIndex = 0,
}: CalculationProgressProps) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!isCalculating) {
      setProgress(0);
      setCurrentStep(0);
      return;
    }

    const stepDuration = 300; // ms per step
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        const next = prev + 1;
        if (next >= steps.length) {
          clearInterval(interval);
          return prev;
        }
        return next;
      });
    }, stepDuration);

    return () => clearInterval(interval);
  }, [isCalculating, steps.length]);

  useEffect(() => {
    setProgress(((currentStep + 1) / steps.length) * 100);
  }, [currentStep, steps.length]);

  if (!isCalculating) return null;

  return (
    <div className="p-4 bg-mint-50 border border-mint-200 rounded-xl animate-fade-in">
      <div className="flex items-center gap-3 mb-3">
        <Loader2 size={18} className="text-mint-600 animate-spin" />
        <span className="text-sm font-medium text-mint-700">
          {steps[currentStep]}...
        </span>
      </div>
      <LinearProgress progress={progress} showPercentage={false} size="sm" />
    </div>
  );
}
