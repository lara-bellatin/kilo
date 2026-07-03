"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { TZ_COOKIE } from "@/lib/date";

/** Writes the browser's IANA timezone into a cookie the server reads to
 *  anchor "today". Refreshes once if the value was missing or stale so the
 *  current page re-renders with the correct date. */
export function TzSync() {
  const router = useRouter();

  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (!tz) return;

    const current = document.cookie
      .split("; ")
      .find((c) => c.startsWith(`${TZ_COOKIE}=`))
      ?.slice(TZ_COOKIE.length + 1);

    if (current === tz) return;

    const oneYear = 60 * 60 * 24 * 365;
    document.cookie = `${TZ_COOKIE}=${tz}; path=/; max-age=${oneYear}; SameSite=Lax`;
    router.refresh();
  }, [router]);

  return null;
}
