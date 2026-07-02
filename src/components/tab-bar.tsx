"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  CalendarCheck2,
  ClipboardList,
  LineChart,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/cn";

type Tab = {
  href: string;
  label: string;
  icon: LucideIcon;
};

const TABS: Tab[] = [
  { href: "/hoy", label: "Hoy", icon: CalendarCheck2 },
  { href: "/plan", label: "Plan", icon: ClipboardList },
  { href: "/evolucion", label: "Evolución", icon: LineChart },
  { href: "/tips", label: "Tips", icon: BookOpen },
];

export function TabBar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navegación principal"
      className="sticky bottom-0 left-0 right-0 z-30 border-t border-border bg-surface/95 backdrop-blur"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto flex max-w-[var(--container-app)] items-stretch justify-between">
        {TABS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-14 flex-col items-center justify-center gap-1 text-xs transition-colors",
                  active ? "text-text" : "text-muted hover:text-text",
                )}
              >
                <Icon size={22} strokeWidth={1.5} aria-hidden />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
