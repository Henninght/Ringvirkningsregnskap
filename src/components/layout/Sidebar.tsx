"use client";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Scale,
  Map,
  FileText,
  Settings,
  LogOut,
  Cog,
  Lightbulb,
} from "lucide-react";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  {
    icon: <LayoutDashboard size={20} />,
    label: "Dashboard",
    href: "/",
  },
  {
    icon: <Scale size={20} />,
    label: "NSF Politikk",
    href: "/nsf-politikk",
  },
  {
    icon: <Map size={20} />,
    label: "Kart",
    href: "/kart",
  },
  {
    icon: <Lightbulb size={20} />,
    label: "Innsikt",
    href: "/innsikt",
  },
  {
    icon: <FileText size={20} />,
    label: "Dokumenter",
    href: "/dokumenter",
  },
  {
    icon: <Settings size={20} />,
    label: "Innstillinger",
    href: "/innstillinger",
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-[72px] bg-sidebar flex flex-col items-center py-5 z-50 border-r border-slate-800/30">
      {/* Logo */}
      <div className="mb-8">
        <Link href="/" className="block">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-petrol-400 to-petrol-600 flex items-center justify-center shadow-lg hover:shadow-glow-petrol hover:scale-105 transition-all duration-200">
            <span
              className="text-white font-bold text-lg"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              R
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col items-center gap-1.5">
        {navItems.map((item) => (
          <NavButton key={item.href} item={item} isActive={pathname === item.href} />
        ))}
      </nav>

      {/* Divider */}
      <div className="w-8 h-px bg-slate-700/50 my-3" />

      {/* Bottom Actions */}
      <div className="flex flex-col items-center gap-1.5">
        <button
          className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-300 hover:bg-sidebar-hover transition-all duration-200"
          title="Konfigurasjon"
        >
          <Cog size={20} />
        </button>
        <button
          className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-500 hover:text-sand-400 hover:bg-sidebar-hover transition-all duration-200"
          title="Logg ut"
        >
          <LogOut size={20} />
        </button>
      </div>
    </aside>
  );
}

function NavButton({ item, isActive }: { item: NavItem; isActive: boolean }) {
  return (
    <Link
      href={item.href}
      className={cn(
        "w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 group relative",
        isActive
          ? "bg-petrol-500/15 text-petrol-400"
          : "text-slate-500 hover:text-slate-300 hover:bg-sidebar-hover"
      )}
      title={item.label}
    >
      {item.icon}
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-petrol-400 rounded-r-full" />
      )}

      {/* Tooltip */}
      <span className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-900 text-slate-100 text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-elevated z-50 border border-slate-700/50">
        {item.label}
      </span>
    </Link>
  );
}
