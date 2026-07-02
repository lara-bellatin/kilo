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
