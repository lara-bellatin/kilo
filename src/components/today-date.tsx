"use client";

import { useEffect, useState } from "react";
import { formatLongDate } from "@/lib/format";

export function TodayDate() {
  const [today, setToday] = useState<string | null>(null);
  useEffect(() => setToday(formatLongDate()), []);
  return <span suppressHydrationWarning>{today ?? "\u00a0"}</span>;
}
