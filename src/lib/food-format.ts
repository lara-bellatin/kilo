import type { Database } from "@/types/database";

type FoodUnit = Database["public"]["Enums"]["food_unit"];
type WeightBasis = Database["public"]["Enums"]["weight_basis"];

/** Structural shapes so both Hoy and Plan option types satisfy these helpers. */
export type FoodComponentLike = {
  quantity: number;
  unit: FoodUnit;
  description?: string | null;
  weight_basis?: WeightBasis | null;
};

export type FoodOptionLike = {
  label: string | null;
  notes: string | null;
  components: FoodComponentLike[];
};

export const UNIT_LABELS: Record<FoodUnit, string> = {
  g: "g",
  ml: "ml",
  taza: "taza",
  unidad: "unidad",
  cda: "cda",
  cdta: "cdta",
  scoop: "scoop",
  rebanada: "rebanada",
  lata: "lata",
  tab: "tab",
  porcion: "porción",
};

const UNIT_PLURALS: Partial<Record<FoodUnit, string>> = {
  taza: "tazas",
  unidad: "unidades",
  cda: "cdas",
  cdta: "cdtas",
  scoop: "scoops",
  rebanada: "rebanadas",
  lata: "latas",
  tab: "tabs",
  porcion: "porciones",
};

/** Format quantity + unit: `250 g`, `1 unidad`, `2 unidades`. */
export function formatComponent(quantity: number, unit: FoodUnit): string {
  const isPlural = Math.abs(quantity) !== 1;
  const label =
    isPlural && UNIT_PLURALS[unit] ? UNIT_PLURALS[unit]! : UNIT_LABELS[unit];
  return `${formatQuantity(quantity)} ${label}`;
}

function formatQuantity(q: number): string {
  if (Number.isInteger(q)) return String(q);
  // Common fraction approximations
  const eps = 1e-3;
  if (Math.abs(q - 0.5) < eps) return "½";
  if (Math.abs(q - 0.25) < eps) return "¼";
  if (Math.abs(q - 0.75) < eps) return "¾";
  if (Math.abs(q - 1 / 3) < eps) return "⅓";
  if (Math.abs(q - 2 / 3) < eps) return "⅔";
  return q.toString().replace(".", ",");
}

/** First component determines the row quantity+unit prefix (mono chunk). */
export function primaryQty(option: FoodOptionLike): string | null {
  const first = option.components[0];
  if (!first) return null;
  return formatComponent(first.quantity, first.unit);
}

/** Best-effort human label from the first component's description or the option label. */
export function optionName(option: FoodOptionLike): string {
  const first = option.components[0];
  if (first?.description) return first.description;
  return option.label ?? "";
}

/** Extra info line under the row: additional components + weight_basis + option notes. */
export function optionSubnote(option: FoodOptionLike): string | null {
  const parts: string[] = [];
  for (const [i, c] of option.components.entries()) {
    if (i === 0) {
      if (c.weight_basis) parts.push(`peso ${c.weight_basis}`);
      continue;
    }
    let piece = `+ ${formatComponent(c.quantity, c.unit)}`;
    if (c.description) piece += ` ${c.description}`;
    if (c.weight_basis) piece += ` (${c.weight_basis})`;
    parts.push(piece);
  }
  if (option.notes) parts.push(option.notes);
  return parts.length > 0 ? parts.join(" · ") : null;
}
