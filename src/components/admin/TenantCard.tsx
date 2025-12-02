"use client";

import { Tenant } from "@/types/tenant";
import { Building2, ArrowRight } from "lucide-react";
import Link from "next/link";

interface TenantCardProps {
  tenant: Tenant;
}

export function TenantCard({ tenant }: TenantCardProps) {
  return (
    <Link
      href={`/kunde/${tenant.id}`}
      className="group block"
    >
      <div
        className="relative bg-white rounded-2xl border border-slate-200 p-6
                   transition-all duration-300 ease-out
                   hover:shadow-lg hover:shadow-slate-200/50 hover:border-slate-300
                   hover:-translate-y-1"
      >
        {/* Color accent bar */}
        <div
          className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
          style={{ backgroundColor: tenant.primaryColor }}
        />

        {/* Logo placeholder */}
        <div
          className="w-16 h-16 rounded-xl flex items-center justify-center mb-4
                     transition-transform duration-300 group-hover:scale-105"
          style={{ backgroundColor: `${tenant.primaryColor}15` }}
        >
          {tenant.logo ? (
            <img
              src={tenant.logo}
              alt={tenant.name}
              className="w-10 h-10 object-contain"
            />
          ) : (
            <Building2
              size={28}
              style={{ color: tenant.primaryColor }}
            />
          )}
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-slate-800">
            {tenant.shortName}
          </h3>
          <p className="text-sm text-slate-500">{tenant.name}</p>

          {/* Industry badge */}
          <span
            className="inline-block text-xs font-medium px-2.5 py-1 rounded-full"
            style={{
              backgroundColor: `${tenant.primaryColor}15`,
              color: tenant.primaryColor,
            }}
          >
            {tenant.industry}
          </span>
        </div>

        {/* Description */}
        <p className="mt-4 text-sm text-slate-600 line-clamp-2">
          {tenant.description}
        </p>

        {/* Action */}
        <div
          className="mt-6 flex items-center gap-2 text-sm font-medium
                     transition-colors duration-200"
          style={{ color: tenant.primaryColor }}
        >
          <span>Åpne dashboard</span>
          <ArrowRight
            size={16}
            className="transition-transform duration-200 group-hover:translate-x-1"
          />
        </div>

        {/* Status indicator */}
        {tenant.isActive && (
          <div className="absolute top-4 right-4">
            <span className="flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
