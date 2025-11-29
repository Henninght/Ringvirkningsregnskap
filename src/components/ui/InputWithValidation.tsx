"use client";

import { useState, useEffect, useRef, InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle } from "lucide-react";
import { HelpTooltip } from "./Tooltip";

interface InputWithValidationProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  helpText?: string;
  icon?: ReactNode;
  formatDisplay?: (value: number) => string;
  validateOnBlur?: boolean;
  showSlider?: boolean;
  errorMessage?: string;
}

export function InputWithValidation({
  label,
  value,
  onChange,
  min = 0,
  max = Infinity,
  step = 1,
  unit,
  helpText,
  icon,
  formatDisplay,
  validateOnBlur = true,
  showSlider = true,
  errorMessage,
  className,
  ...rest
}: InputWithValidationProps) {
  const [localValue, setLocalValue] = useState(value.toString());
  const [error, setError] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync local value with prop
  useEffect(() => {
    if (!isDirty) {
      setLocalValue(value.toString());
    }
  }, [value, isDirty]);

  const validate = (val: number): string | null => {
    if (isNaN(val)) {
      return "Ugyldig verdi";
    }
    if (val < min) {
      return `Minimum verdi er ${formatDisplay ? formatDisplay(min) : min}`;
    }
    if (val > max) {
      return `Maksimum verdi er ${formatDisplay ? formatDisplay(max) : max}`;
    }
    return null;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    setIsDirty(true);

    const numericValue = parseFloat(newValue);
    if (!isNaN(numericValue)) {
      // Real-time validation
      const validationError = validate(numericValue);
      setError(validationError);

      // Only update parent if valid
      if (!validationError) {
        onChange(numericValue);
      }
    } else if (newValue === "" || newValue === "-") {
      // Allow empty or negative sign while typing
      setError(null);
    } else {
      setError("Ugyldig verdi");
    }
  };

  const handleBlur = () => {
    setIsDirty(false);
    const numericValue = parseFloat(localValue);

    if (isNaN(numericValue) || localValue === "") {
      // Reset to previous valid value
      setLocalValue(value.toString());
      setError(null);
      return;
    }

    // Clamp value to valid range
    const clampedValue = Math.min(Math.max(numericValue, min), max);
    setLocalValue(clampedValue.toString());
    setError(null);
    onChange(clampedValue);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    setLocalValue(newValue.toString());
    setError(null);
    onChange(newValue);
  };

  const displayValue = formatDisplay ? formatDisplay(value) : value.toString();
  const isValid = error === null;
  const hasCustomError = errorMessage !== undefined;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
          {icon && <span className="text-slate-400">{icon}</span>}
          {label}
          {helpText && <HelpTooltip content={helpText} />}
        </label>
        <div className="flex items-center gap-2">
          <span className={cn(
            "text-sm font-semibold transition-colors",
            error ? "text-coral-500" : "text-mint-600"
          )}>
            {displayValue}
            {unit && <span className="text-slate-400 font-normal ml-1">{unit}</span>}
          </span>
          {!error && isDirty && (
            <CheckCircle size={14} className="text-mint-500" />
          )}
        </div>
      </div>

      {showSlider && min !== -Infinity && max !== Infinity && (
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleSliderChange}
          className={cn(
            "w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer",
            "accent-mint-500",
            "focus:outline-none focus:ring-2 focus:ring-mint-500/20"
          )}
          aria-label={label}
        />
      )}

      <div className="relative">
        <input
          ref={inputRef}
          type="number"
          value={localValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          min={min}
          max={max}
          step={step}
          className={cn(
            "w-full px-3 py-2 text-sm border rounded-lg transition-colors",
            "focus:outline-none focus:ring-2",
            error
              ? "border-coral-300 focus:ring-coral-500/20 focus:border-coral-500 bg-coral-50"
              : "border-slate-200 focus:ring-mint-500/20 focus:border-mint-500 bg-white"
          )}
          aria-invalid={!isValid}
          aria-describedby={error ? `${label}-error` : undefined}
          {...rest}
        />
        {error && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <AlertCircle size={16} className="text-coral-500" />
          </div>
        )}
      </div>

      {(error || hasCustomError) && (
        <p
          id={`${label}-error`}
          className="text-xs text-coral-500 flex items-center gap-1"
          role="alert"
        >
          <AlertCircle size={12} />
          {error || errorMessage}
        </p>
      )}

      {showSlider && min !== -Infinity && max !== Infinity && (
        <div className="flex justify-between text-xs text-slate-400">
          <span>{formatDisplay ? formatDisplay(min) : min}</span>
          <span>{formatDisplay ? formatDisplay(max) : max}</span>
        </div>
      )}
    </div>
  );
}
