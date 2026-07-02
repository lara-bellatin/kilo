"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { IconButton } from "@/components/ui/icon-button";

function subscribe() {
  return () => {};
}

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <IconButton
      aria-label={isDark ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={className}
    >
      {mounted ? (
        isDark ? (
          <Sun size={18} strokeWidth={1.5} />
        ) : (
          <Moon size={18} strokeWidth={1.5} />
        )
      ) : (
        <span className="block h-[18px] w-[18px]" />
      )}
    </IconButton>
  );
}
