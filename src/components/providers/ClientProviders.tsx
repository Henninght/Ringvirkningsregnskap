"use client";

import { ReactNode } from "react";
import { ToastProvider } from "@/components/ui/Toast";
import { ViewModeProvider } from "@/contexts/ViewModeContext";
import { TenantProvider } from "@/contexts/TenantContext";

interface ClientProvidersProps {
  children: ReactNode;
}

export function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <TenantProvider>
      <ViewModeProvider>
        <ToastProvider>{children}</ToastProvider>
      </ViewModeProvider>
    </TenantProvider>
  );
}
