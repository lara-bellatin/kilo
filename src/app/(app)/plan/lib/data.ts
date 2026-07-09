import { createClient } from "@/lib/supabase/server";
import type { DayType, PlanDayTarget, PlanSection, PlanTree } from "./types";
import { DAY_TYPES } from "./types";

/**
 * Carga el árbol completo del plan activo para la página Plan.
 * A diferencia de loadPlanForDay (Hoy), incluye notes, tags y sort_order
 * en todos los niveles; las opciones inactivas quedan fuera (son historial).
 */
export async function loadPlanTree(): Promise<PlanTree | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: plan } = await supabase
    .from("plans")
    .select(
      "id, title, base_kcal, protein_g, carbs_g, fat_g, tags, notes, plan_day_targets(day_type, kcal_adjustment, water_liters), plan_sections(id, label, section_type, icon, notes, visible_when, repeat_when, sort_order, option_groups(id, label, pick_count, sort_order, food_options(id, label, notes, sort_order, is_active, option_components(id, quantity, unit, description, weight_basis, sort_order))))",
    )
    .eq("user_id", user.id)
    .eq("is_active", true)
    .maybeSingle();

  if (!plan) return null;

  const targets: Record<DayType, PlanDayTarget> = {} as Record<
    DayType,
    PlanDayTarget
  >;
  for (const dt of DAY_TYPES) {
    const row = plan.plan_day_targets.find((t) => t.day_type === dt);
    targets[dt] = {
      dayType: dt,
      kcalAdjustment: row?.kcal_adjustment ?? 0,
      waterLiters: row?.water_liters === null || row?.water_liters === undefined
        ? null
        : Number(row.water_liters),
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
      sortOrder: s.sort_order,
      groups: s.option_groups
        .slice()
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((g) => ({
          id: g.id,
          label: g.label,
          pickCount: g.pick_count,
          sortOrder: g.sort_order,
          options: g.food_options
            .filter((o) => o.is_active)
            .slice()
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((o) => ({
              id: o.id,
              label: o.label,
              notes: o.notes,
              sortOrder: o.sort_order,
              components: o.option_components
                .slice()
                .sort((a, b) => a.sort_order - b.sort_order)
                .map((c) => ({
                  id: c.id,
                  quantity: Number(c.quantity),
                  unit: c.unit,
                  description: c.description,
                  weight_basis: c.weight_basis,
                  sortOrder: c.sort_order,
                })),
            })),
        })),
    }));

  return {
    id: plan.id,
    title: plan.title,
    baseKcal: plan.base_kcal,
    proteinG: plan.protein_g,
    carbsG: plan.carbs_g,
    fatG: plan.fat_g,
    tags: plan.tags,
    notes: plan.notes,
    targets,
    sections,
  };
}
