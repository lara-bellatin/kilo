import type { DayType } from "./types";
import { DAY_TYPE_SHORT } from "./types";

function dayList(days: DayType[]): string {
  const shorts = days.map((d) => DAY_TYPE_SHORT[d]);
  if (shorts.length <= 1) return shorts[0] ?? "";
  return `${shorts.slice(0, -1).join(", ")} y ${shorts[shorts.length - 1]}`;
}

/** "solo entreno" | "entreno y doble" — para visible_when ≠ null. */
export function visibilityLabel(visibleWhen: DayType[]): string {
  if (visibleWhen.length === 1) return `solo ${DAY_TYPE_SHORT[visibleWhen[0]]}`;
  return dayList(visibleWhen);
}

/** "se repite en doble" — para repeat_when ≠ null. */
export function repeatLabel(repeatWhen: DayType[]): string {
  return `se repite en ${dayList(repeatWhen)}`;
}
