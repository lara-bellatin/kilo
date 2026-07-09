import {
  Dumbbell,
  Moon,
  Pill,
  Sunrise,
  Utensils,
  Zap,
} from "lucide-react";

export const SECTION_ICON_NAMES = [
  "sunrise",
  "utensils",
  "zap",
  "moon",
  "pill",
  "dumbbell",
] as const;

export type SectionIconName = (typeof SECTION_ICON_NAMES)[number];

export function SectionIcon({
  name,
  size = 18,
}: {
  name: string | null;
  size?: number;
}) {
  const stroke = 1.5;
  switch (name) {
    case "sunrise":
      return <Sunrise size={size} strokeWidth={stroke} />;
    case "utensils":
      return <Utensils size={size} strokeWidth={stroke} />;
    case "zap":
      return <Zap size={size} strokeWidth={stroke} />;
    case "moon":
      return <Moon size={size} strokeWidth={stroke} />;
    case "pill":
      return <Pill size={size} strokeWidth={stroke} />;
    case "dumbbell":
      return <Dumbbell size={size} strokeWidth={stroke} />;
    default:
      return <Utensils size={size} strokeWidth={stroke} />;
  }
}
