"use client";

import { useSyncExternalStore } from "react";
import { formatLongDate } from "@/lib/format";

function subscribe() {
  return () => {};
}

export function TodayDate() {
  const today = useSyncExternalStore(
    subscribe,
    () => formatLongDate(),
    () => "\u00a0",
  );
  return <span suppressHydrationWarning>{today}</span>;
}
