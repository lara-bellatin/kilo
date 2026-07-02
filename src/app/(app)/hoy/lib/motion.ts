"use client";

import { useEffect, useRef, useState } from "react";

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Trigger a boolean pulse (500ms) when `active` transitions from false to true. */
export function usePop(active: boolean, enabled: boolean = true): boolean {
  const [pop, setPop] = useState(false);
  const prev = useRef(active);

  useEffect(() => {
    if (enabled && active && !prev.current && !prefersReducedMotion()) {
      setPop(true);
      const t = window.setTimeout(() => setPop(false), 500);
      prev.current = active;
      return () => window.clearTimeout(t);
    }
    prev.current = active;
  }, [active, enabled]);

  return pop;
}

/** Count up to `target` when it changes; `~450ms` cubic ease-out. */
export function useCountUp(target: number, ms: number = 450): number {
  const [val, setVal] = useState(target);
  const prevRef = useRef(target);

  useEffect(() => {
    const from = prevRef.current;
    prevRef.current = target;
    if (from === target) return;
    if (prefersReducedMotion()) {
      // Snap to the new target — this is the whole point of the hook.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVal(target);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / ms);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(from + (target - from) * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);

  return val;
}

/** false → true one frame after mount, so CSS transitions animate the initial fill. */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);
  return mounted;
}
