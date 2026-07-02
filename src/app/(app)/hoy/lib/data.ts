import { createClient } from "@/lib/supabase/server";
import type {
  DayLog,
  DayTargets,
  DayType,
  FreeEntry,
  LogEntry,
  PlanForDay,
  PlanSection,
} from "./types";
import { DAY_TYPES } from "./types";

/** YYYY-MM-DD in the caller's timezone. Server invokes it with a local Date. */
export function toIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export async function loadPlanForDay(): Promise<PlanForDay | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: plan } = await supabase
    .from("plans")
    .select(
      "id, title, base_kcal, protein_g, carbs_g, fat_g, plan_day_targets(day_type, kcal_adjustment, water_liters), plan_sections(id, label, section_type, icon, notes, visible_when, repeat_when, sort_order, option_groups(id, label, pick_count, sort_order, food_options(id, label, notes, sort_order, is_active, option_components(id, quantity, unit, description, weight_basis, sort_order))))",
    )
    .eq("user_id", user.id)
    .eq("is_active", true)
    .maybeSingle();

  if (!plan) return null;

  const baseKcal = plan.base_kcal ?? 0;
  const targets: Record<DayType, DayTargets> = {} as Record<
    DayType,
    DayTargets
  >;
  for (const dt of DAY_TYPES) {
    const row = plan.plan_day_targets.find((t) => t.day_type === dt);
    const adjustment = row?.kcal_adjustment ?? 0;
    targets[dt] = {
      dayType: dt,
      kcalTotal: baseKcal + adjustment,
      kcalAdjustment: adjustment,
      waterLiters: row?.water_liters ?? 0,
    };
  }

  const sections: PlanSection[] = plan.plan_sections
    .slice()
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((s) => ({
      id: s.id,
      label: s.label,
      sectionType: s.section_type,
      icon: s.icon,
      notes: s.notes,
      visibleWhen: s.visible_when,
      repeatWhen: s.repeat_when,
      groups: s.option_groups
        .slice()
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((g) => ({
          id: g.id,
          label: g.label,
          pickCount: g.pick_count,
          options: g.food_options
            .filter((o) => o.is_active)
            .slice()
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((o) => ({
              id: o.id,
              label: o.label,
              notes: o.notes,
              components: o.option_components
                .slice()
                .sort((a, b) => a.sort_order - b.sort_order)
                .map((c) => ({
                  id: c.id,
                  quantity: c.quantity,
                  unit: c.unit,
                  description: c.description,
                  weight_basis: c.weight_basis,
                })),
            })),
        })),
    }));

  return {
    planId: plan.id,
    title: plan.title,
    baseKcal,
    proteinG: plan.protein_g,
    carbsG: plan.carbs_g,
    fatG: plan.fat_g,
    targets,
    sections,
  };
}

export async function loadDayLog(date: string): Promise<DayLog> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return {
      id: null,
      date,
      dayType: "descanso",
      waterLiters: 0,
      entries: [],
      freeEntries: [],
    };
  }

  const { data: log } = await supabase
    .from("day_logs")
    .select(
      "id, day_type, water_liters, log_entries(option_id, occurrence, servings), free_entries(id, section_id, description, quantity, unit, notes, created_at)",
    )
    .eq("user_id", user.id)
    .eq("date", date)
    .maybeSingle();

  if (!log) {
    return {
      id: null,
      date,
      dayType: "descanso",
      waterLiters: 0,
      entries: [],
      freeEntries: [],
    };
  }

  const entries: LogEntry[] = log.log_entries.map((e) => ({
    optionId: e.option_id,
    occurrence: e.occurrence,
    servings: Number(e.servings),
  }));

  const freeEntries: FreeEntry[] = log.free_entries
    .slice()
    .sort((a, b) => a.created_at.localeCompare(b.created_at))
    .map((f) => ({
      id: f.id,
      sectionId: f.section_id,
      description: f.description,
      quantity: f.quantity === null ? null : Number(f.quantity),
      unit: f.unit,
      notes: f.notes,
    }));

  return {
    id: log.id,
    date,
    dayType: log.day_type,
    waterLiters: Number(log.water_liters ?? 0),
    entries,
    freeEntries,
  };
}
