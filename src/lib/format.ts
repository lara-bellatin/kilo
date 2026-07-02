const SHORT = new Intl.DateTimeFormat("es-PE", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const LONG = new Intl.DateTimeFormat("es-PE", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

export function formatShortDate(date: Date = new Date()): string {
  return SHORT.format(date).replace(/\//g, ".");
}

/** e.g. "miércoles, 1 de julio" — lowercase per Spanish convention. */
export function formatLongDate(date: Date = new Date()): string {
  return LONG.format(date);
}

/** es-PE thousand separator: "2506" → "2.506". */
export function formatKcal(n: number): string {
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/** e.g. 1.5 → "1,5" (one decimal, comma). */
export function formatLiters(n: number): string {
  return n.toFixed(1).replace(".", ",");
}

