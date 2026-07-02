"use client";

import { useMounted } from "../lib/motion";
import { cn } from "@/lib/cn";

export function ProgressBar({
  pct,
  water = false,
  notches = [],
}: {
  pct: number;
  water?: boolean;
  notches?: number[];
}) {
  const mounted = useMounted();
  const width = Math.min(100, Math.max(0, mounted ? pct : 0));
  return (
    <div className={cn("hoy-bar", water && "agua")} aria-hidden>
      <div className="fill" style={{ width: `${width}%` }} />
      {notches.map((p, i) => (
        <span key={i} className="notch" style={{ left: `${p}%` }} />
      ))}
    </div>
  );
}
