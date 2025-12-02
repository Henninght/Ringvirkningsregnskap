"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Tenant, TenantContextType } from "@/types/tenant";
import { TENANTS, getTenantById as getTenant } from "@/lib/tenants";

const TenantContext = createContext<TenantContextType | undefined>(undefined);

const STORAGE_KEY = "ringvirkning-current-tenant";

interface TenantProviderProps {
  children: ReactNode;
}

export function TenantProvider({ children }: TenantProviderProps) {
  const [currentTenant, setCurrentTenantState] = useState<Tenant | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const tenant = getTenant(stored);
      if (tenant) {
        setCurrentTenantState(tenant);
      }
    }
    setIsHydrated(true);
  }, []);

  const setCurrentTenant = (tenant: Tenant | null) => {
    setCurrentTenantState(tenant);
    if (tenant) {
      localStorage.setItem(STORAGE_KEY, tenant.id);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const getTenantById = (id: string): Tenant | undefined => {
    return getTenant(id);
  };

  // Prevent hydration mismatch
  if (!isHydrated) {
    return null;
  }

  return (
    <TenantContext.Provider
      value={{
        currentTenant,
        availableTenants: TENANTS,
        setCurrentTenant,
        getTenantById,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant(): TenantContextType {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return context;
}
