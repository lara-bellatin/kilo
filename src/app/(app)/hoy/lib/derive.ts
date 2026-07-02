import type { DayType, LogEntry, PlanGroup, PlanSection } from "./types";

export type GroupState = "empty" | "partial" | "done" | "over";

export function groupTotal(
  group: PlanGroup,
  entries: LogEntry[],
  occurrence: number,
): number {
  const optionIds = new Set(group.options.map((o) => o.id));
  return entries.reduce((sum, e) => {
    if (e.occurrence !== occurrence) return sum;
    if (!optionIds.has(e.optionId)) return sum;
    return sum + e.servings;
  }, 0);
}

export function optionCount(
  optionId: string,
  entries: LogEntry[],
  occurrence: number,
): number {
  const entry = entries.find(
    (e) => e.optionId === optionId && e.occurrence === occurrence,
  );
  return entry?.servings ?? 0;
}

export function stateForGroup(
  group: PlanGroup,
  entries: LogEntry[],
  occurrence: number,
): GroupState {
  const total = groupTotal(group, entries, occurrence);
  if (total > group.pickCount) return "over";
  if (total >= group.pickCount) return "done";
  if (total > 0) return "partial";
  return "empty";
}

export type SectionStats = {
  picks: number;
  marked: number;
  over: boolean;
  groupsDone: number;
  groups: number;
  done: boolean;
};

export function sectionStats(
  section: PlanSection,
  entries: LogEntry[],
  occurrence: number,
): SectionStats {
  let picks = 0;
  let marked = 0;
  let over = false;
  let groupsDone = 0;
  for (const g of section.groups) {
    const total = groupTotal(g, entries, occurrence);
    picks += g.pickCount;
    marked += Math.min(total, g.pickCount);
    if (total > g.pickCount) over = true;
    if (total >= g.pickCount) groupsDone++;
  }
  return {
    picks,
    marked,
    over,
    groupsDone,
    groups: section.groups.length,
    done: groupsDone === section.groups.length && !over,
  };
}

/** Occurrence keys visible for a section on a given day. `[1]` for normal,
 *  `[1, 2]` when the section repeats on the current day type. */
export function occurrencesForSection(
  section: PlanSection,
  dayType: DayType,
): number[] {
  if (section.repeatWhen?.includes(dayType)) return [1, 2];
  return [1];
}

export function isSectionVisible(
  section: PlanSection,
  dayType: DayType,
): boolean {
  if (!section.visibleWhen || section.visibleWhen.length === 0) return true;
  return section.visibleWhen.includes(dayType);
}

/** Expand sections × occurrences into a flat list of "day units". */
export type DayUnit = {
  key: string;
  section: PlanSection;
  occurrence: number;
  /** stable id for this section instance, used as the id in expand state */
  instanceId: string;
};

export function dayUnits(
  sections: PlanSection[],
  dayType: DayType,
): DayUnit[] {
  const units: DayUnit[] = [];
  for (const section of sections) {
    if (!isSectionVisible(section, dayType)) continue;
    for (const occurrence of occurrencesForSection(section, dayType)) {
      units.push({
        key: `${section.id}:${occurrence}`,
        section,
        occurrence,
        instanceId: `${section.id}:${occurrence}`,
      });
    }
  }
  return units;
}

export function globalStats(
  units: DayUnit[],
  entries: LogEntry[],
): { picks: number; marked: number; over: boolean } {
  let picks = 0;
  let marked = 0;
  let over = false;
  for (const u of units) {
    const s = sectionStats(u.section, entries, u.occurrence);
    picks += s.picks;
    marked += s.marked;
    if (s.over) over = true;
  }
  return { picks, marked, over };
}
