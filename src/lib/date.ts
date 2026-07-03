/** Cookie name the browser sets so the server can compute "today" in the
 *  user's local timezone. See <TzSync/> and getUserTimeZone(). */
export const TZ_COOKIE = "tz";

/** Used until the browser has set the tz cookie (or if it's invalid). */
export const FALLBACK_TIMEZONE = "America/Lima";

export function isValidTimeZone(tz: string): boolean {
  try {
    new Intl.DateTimeFormat("en-CA", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

/** YYYY-MM-DD for the given instant, evaluated in `timeZone`. */
export function toIsoDate(
  date: Date = new Date(),
  timeZone: string = FALLBACK_TIMEZONE,
): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

/** Shift an ISO date (YYYY-MM-DD) by N days without touching timezones. */
export function shiftIsoDate(isoDate: string, deltaDays: number): string {
  const [y, m, d] = isoDate.split("-").map((n) => parseInt(n, 10));
  const base = new Date(Date.UTC(y, m - 1, d));
  base.setUTCDate(base.getUTCDate() + deltaDays);
  const yy = base.getUTCFullYear();
  const mm = String(base.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(base.getUTCDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** Validate a YYYY-MM-DD string with a real calendar day. */
export function isValidIsoDate(value: string): boolean {
  if (!ISO_DATE_RE.test(value)) return false;
  const [y, m, d] = value.split("-").map((n) => parseInt(n, 10));
  const dt = new Date(Date.UTC(y, m - 1, d));
  return (
    dt.getUTCFullYear() === y &&
    dt.getUTCMonth() === m - 1 &&
    dt.getUTCDate() === d
  );
}
