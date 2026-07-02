"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/nav";
import { cn } from "@/lib/cn";

export function DesktopNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Navegación principal" className="hidden md:block">
      <ul className="flex items-center gap-6">
        {NAV_ITEMS.map(({ href, label }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative inline-flex h-14 items-center text-sm transition-colors duration-[var(--duration-fast)]",
                  active ? "text-text" : "text-muted hover:text-text",
                )}
              >
                {label}
                <span
                  aria-hidden
                  className={cn(
                    "absolute -bottom-px left-0 right-0 h-px transition-colors duration-[var(--duration-fast)]",
                    active ? "bg-accent" : "bg-transparent",
                  )}
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
