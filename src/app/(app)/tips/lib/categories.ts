import {
  Apple,
  BookOpen,
  CupSoda,
  Lightbulb,
  MapPin,
  Nut,
  Pill,
  Soup,
  type LucideIcon,
} from "lucide-react";

export type CategoryMeta = { label: string; icon: LucideIcon };

/**
 * Metadata curada para las categorías conocidas. Cualquier categoría nueva
 * en global_tips se muestra igual sin tocar código: label auto-formateado
 * desde el slug + ícono genérico.
 */
const KNOWN: Record<string, CategoryMeta> = {
  lineamientos: { label: "Lineamientos generales", icon: BookOpen },
  salsas: { label: "Salsas", icon: Soup },
  bebidas: { label: "Bebidas", icon: CupSoda },
  fuera_de_casa: { label: "Fuera de casa", icon: MapPin },
  frutos_secos: { label: "Frutos secos", icon: Nut },
  porciones_fruta: { label: "Porciones de fruta", icon: Apple },
  suplementacion: { label: "Suplementación", icon: Pill },
};

const KNOWN_ORDER = Object.keys(KNOWN);

export function categoryMeta(category: string): CategoryMeta {
  const known = KNOWN[category];
  if (known) return known;
  const label = category.replaceAll("_", " ");
  return {
    label: label.charAt(0).toUpperCase() + label.slice(1),
    icon: Lightbulb,
  };
}

/** Conocidas en orden curado; desconocidas después (se ordenan alfabéticamente aparte). */
export function categoryRank(category: string): number {
  const index = KNOWN_ORDER.indexOf(category);
  return index === -1 ? KNOWN_ORDER.length : index;
}
