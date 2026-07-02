"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type Ctx = { pct: number | null; setPct: (v: number | null) => void };

const HoyProgressContext = createContext<Ctx>({
  pct: null,
  setPct: () => {},
});

export function HoyProgressProvider({ children }: { children: ReactNode }) {
  const [pct, setPct] = useState<number | null>(null);
  return (
    <HoyProgressContext.Provider value={{ pct, setPct }}>
      {children}
    </HoyProgressContext.Provider>
  );
}

/** Set from the Hoy page; reset to null when unmounted. */
export function HoyProgressLine({ pct }: { pct: number }) {
  const { setPct } = useContext(HoyProgressContext);
  useEffect(() => {
    setPct(pct);
    return () => setPct(null);
  }, [pct, setPct]);
  return null;
}

/** Rendered inside AppHeader; shows the bar when a Hoy view is mounted. */
export function AppHeaderProgress() {
  const { pct } = useContext(HoyProgressContext);
  if (pct === null) return null;
  const width = Math.min(100, Math.max(0, pct));
  return (
    <div className="hoy-header-progress" aria-hidden>
      <span style={{ width: `${width}%` }} />
    </div>
  );
}
