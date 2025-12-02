/**
 * Tenant (kunde) type definitions for multi-tenant support
 */

export interface Tenant {
  id: string;           // URL-friendly ID: "nsf", "eidsiva"
  name: string;         // Full name: "Norsk Sykepleierforbund"
  shortName: string;    // Short name: "NSF"
  industry: string;     // Industry: "Helse", "Energi"
  logo?: string;        // Logo URL (optional)
  primaryColor: string; // Theme color
  description: string;  // Brief description
  isActive: boolean;    // Whether tenant is active
}

export interface TenantContextType {
  currentTenant: Tenant | null;
  availableTenants: Tenant[];
  setCurrentTenant: (tenant: Tenant | null) => void;
  getTenantById: (id: string) => Tenant | undefined;
}
