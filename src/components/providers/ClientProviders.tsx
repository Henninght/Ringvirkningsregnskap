"use client";

import { ReactNode } from "react";
import { ToastProvider } from "@/components/ui/Toast";
import { ViewModeProvider } from "@/contexts/ViewModeContext";

interface ClientProvidersProps {
  children: ReactNode;
}

export function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <ViewModeProvider>
      <ToastProvider>{children}</ToastProvider>
    </ViewModeProvider>
  );
}
