"use client";

import { ReactNode } from "react";
import { ToastProvider } from "@/components/ui/Toast";

interface ClientProvidersProps {
  children: ReactNode;
}

export function ClientProviders({ children }: ClientProvidersProps) {
  return <ToastProvider>{children}</ToastProvider>;
}
