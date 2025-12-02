import { Tenant } from "@/types/tenant";

/**
 * Available tenants (customers) in the system
 * This is mock data - will be replaced with database/API later
 */
export const TENANTS: Tenant[] = [
  {
    id: "nsf",
    name: "Norsk Sykepleierforbund",
    shortName: "NSF",
    industry: "Helse",
    primaryColor: "#0D4F4F", // petrol
    description: "Ringvirkningsregnskap for helsesektoren",
    isActive: true,
  },
  {
    id: "eidsiva",
    name: "Eidsiva Energi",
    shortName: "Eidsiva",
    industry: "Energi",
    primaryColor: "#1C1C1E", // mørk, minimalistisk
    description: "Ringvirkningsregnskap for energisektoren",
    isActive: true,
  },
];

/**
 * Get tenant by ID
 */
export function getTenantById(id: string): Tenant | undefined {
  return TENANTS.find((tenant) => tenant.id === id);
}

/**
 * Get all active tenants
 */
export function getActiveTenants(): Tenant[] {
  return TENANTS.filter((tenant) => tenant.isActive);
}
