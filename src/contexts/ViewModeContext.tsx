"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export type ViewMode = "simple" | "advanced";

interface ViewModeContextType {
  mode: ViewMode;
  setMode: (mode: ViewMode) => void;
  toggleMode: () => void;
  isSimple: boolean;
  isAdvanced: boolean;
}

const ViewModeContext = createContext<ViewModeContextType | undefined>(
  undefined
);

const STORAGE_KEY = "nsf-view-mode";

interface ViewModeProviderProps {
  children: ReactNode;
  defaultMode?: ViewMode;
}

export function ViewModeProvider({
  children,
  defaultMode = "simple",
}: ViewModeProviderProps) {
  const [mode, setModeState] = useState<ViewMode>(defaultMode);
  const [isHydrated, setIsHydrated] = useState(false);

  // Les fra localStorage ved hydration
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "simple" || stored === "advanced") {
      setModeState(stored);
    }
    setIsHydrated(true);
  }, []);

  // Lagre til localStorage ved endring
  const setMode = (newMode: ViewMode) => {
    setModeState(newMode);
    localStorage.setItem(STORAGE_KEY, newMode);
  };

  const toggleMode = () => {
    setMode(mode === "simple" ? "advanced" : "simple");
  };

  // Unngå hydration mismatch
  if (!isHydrated) {
    return (
      <ViewModeContext.Provider
        value={{
          mode: defaultMode,
          setMode: () => {},
          toggleMode: () => {},
          isSimple: defaultMode === "simple",
          isAdvanced: defaultMode === "advanced",
        }}
      >
        {children}
      </ViewModeContext.Provider>
    );
  }

  return (
    <ViewModeContext.Provider
      value={{
        mode,
        setMode,
        toggleMode,
        isSimple: mode === "simple",
        isAdvanced: mode === "advanced",
      }}
    >
      {children}
    </ViewModeContext.Provider>
  );
}

export function useViewMode() {
  const context = useContext(ViewModeContext);
  if (context === undefined) {
    throw new Error("useViewMode must be used within a ViewModeProvider");
  }
  return context;
}

/**
 * Komponent som kun rendrer children i avansert modus.
 * I enkel modus vises en "Vis mer"-knapp som bytter til avansert.
 */
interface AdvancedOnlyProps {
  children: ReactNode;
  /** Tekst på "vis mer"-knappen */
  showMoreText?: string;
  /** Om det skal vises en knapp i enkel modus */
  showButton?: boolean;
  /** Ekstra klasser på wrapper */
  className?: string;
}

export function AdvancedOnly({
  children,
  showMoreText = "Vis flere innstillinger",
  showButton = true,
  className,
}: AdvancedOnlyProps) {
  const { isAdvanced, setMode } = useViewMode();

  if (isAdvanced) {
    return <div className={className}>{children}</div>;
  }

  if (showButton) {
    return (
      <button
        onClick={() => setMode("advanced")}
        className="w-full py-3 px-4 text-sm text-slate-500 hover:text-petrol-600 hover:bg-slate-50 rounded-lg transition-colors flex items-center justify-center gap-2 border border-dashed border-slate-200 hover:border-petrol-300"
      >
        <span>▼</span>
        <span>{showMoreText}</span>
      </button>
    );
  }

  return null;
}

/**
 * Komponent som kun rendrer children i enkel modus.
 */
interface SimpleOnlyProps {
  children: ReactNode;
  className?: string;
}

export function SimpleOnly({ children, className }: SimpleOnlyProps) {
  const { isSimple } = useViewMode();

  if (!isSimple) {
    return null;
  }

  return <div className={className}>{children}</div>;
}
