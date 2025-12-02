"use client";

import Link from "next/link";
import { getActiveTenants } from "@/lib/tenants";
import { ArrowRight, Building2, Zap, Heart, Leaf } from "lucide-react";
import { cn } from "@/lib/utils";

// Ikon-mapping basert på bransje
const industryIcons: Record<string, React.ReactNode> = {
  Helse: <Heart size={24} className="text-petrol-500" />,
  Energi: <Zap size={24} className="text-amber-500" />,
};

export default function LandingPage() {
  const tenants = getActiveTenants();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-petrol-400 to-petrol-600 mb-6">
            <Building2 size={32} className="text-white" />
          </div>
          <h1
            className="text-4xl font-bold text-slate-800 mb-3 tracking-tight"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Ringvirkningsregnskap
          </h1>
          <p className="text-lg text-slate-500">
            Velg kunde for å se deres samfunnsøkonomiske ringvirkninger
          </p>
        </div>

        {/* Tenant Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tenants.map((tenant) => (
            <Link
              key={tenant.id}
              href={`/kunde/${tenant.id}`}
              className={cn(
                "group relative bg-white rounded-2xl p-6 shadow-sm border border-slate-200",
                "hover:shadow-lg hover:border-slate-300 hover:-translate-y-1",
                "transition-all duration-300 ease-out"
              )}
            >
              {/* Color accent */}
              <div
                className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
                style={{ backgroundColor: tenant.primaryColor }}
              />

              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Icon & Industry */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                      {industryIcons[tenant.industry] || (
                        <Building2 size={24} className="text-slate-400" />
                      )}
                    </div>
                    <span className="text-sm font-medium text-slate-400 uppercase tracking-wider">
                      {tenant.industry}
                    </span>
                  </div>

                  {/* Name */}
                  <h2
                    className="text-xl font-semibold text-slate-800 mb-2"
                    style={{ fontFamily: "var(--font-outfit)" }}
                  >
                    {tenant.name}
                  </h2>

                  {/* Description */}
                  <p className="text-sm text-slate-500">{tenant.description}</p>
                </div>

                {/* Arrow */}
                <div className="ml-4 w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                  <ArrowRight
                    size={18}
                    className="text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-slate-400 mt-12">
          Visualiser verdiskaping og samfunnsøkonomiske effekter
        </p>
      </div>
    </div>
  );
}
