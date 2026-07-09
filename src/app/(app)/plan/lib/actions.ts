"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type {
  DayType,
  FoodUnit,
  SectionType,
  WeightBasis,
} from "./types";
import { DAY_TYPES } from "./types";

/**
 * Errores esperados (índice único, FK restrict, validación) se devuelven
 * como { error } en vez de throw: los mensajes de errores lanzados se
 * redactan en producción y el cliente no podría distinguirlos.
 */
export type ActionResult = { error: string } | null;

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("no-auth");
  return { supabase, userId: user.id };
}

function revalidate() {
  revalidatePath("/plan");
  revalidatePath("/hoy");
}

function intOrNull(value: number | null): number | null {
  if (value === null || !Number.isFinite(value)) return null;
  return Math.round(value);
}

// -------------------------------------------------------------
// Plan
// -------------------------------------------------------------

export type PlanMetaInput = {
  title: string;
  baseKcal: number | null;
  proteinG: number | null;
  carbsG: number | null;
  fatG: number | null;
};

export type PlanDetailsInput = PlanMetaInput & {
  notes: string | null;
  tags: string[];
};

function normalizeMeta(input: PlanMetaInput) {
  const title = input.title.trim();
  if (!title) return null;
  return {
    title,
    base_kcal: intOrNull(input.baseKcal),
    protein_g: intOrNull(input.proteinG),
    carbs_g: intOrNull(input.carbsG),
    fat_g: intOrNull(input.fatG),
  };
}

export async function createPlanAction(
  input: PlanMetaInput,
): Promise<ActionResult> {
  const meta = normalizeMeta(input);
  if (!meta) return { error: "titulo-requerido" };
  const { supabase, userId } = await requireUser();

  const { data: plan, error } = await supabase
    .from("plans")
    .insert({ user_id: userId, ...meta })
    .select("id")
    .single();
  if (error) {
    if (error.code === "23505") return { error: "plan-activo" };
    throw error;
  }

  const { error: targetsError } = await supabase.from("plan_day_targets").insert(
    DAY_TYPES.map((dayType) => ({
      plan_id: plan.id,
      day_type: dayType,
      kcal_adjustment: 0,
    })),
  );
  if (targetsError) throw targetsError;

  revalidate();
  return null;
}

export async function updatePlanMetaAction(
  planId: string,
  input: PlanDetailsInput,
): Promise<ActionResult> {
  const meta = normalizeMeta(input);
  if (!meta) return { error: "titulo-requerido" };
  const { supabase } = await requireUser();

  const { error } = await supabase
    .from("plans")
    .update({
      ...meta,
      notes: input.notes?.trim() || null,
      tags: input.tags.map((t) => t.trim()).filter(Boolean),
      updated_at: new Date().toISOString(),
    })
    .eq("id", planId);
  if (error) throw error;

  revalidate();
  return null;
}

// -------------------------------------------------------------
// Objetivos por día
// -------------------------------------------------------------

export async function upsertDayTargetAction(
  planId: string,
  dayType: DayType,
  input: { kcalAdjustment: number | null; waterLiters: number | null },
): Promise<ActionResult> {
  const { supabase } = await requireUser();

  const kcalAdjustment = intOrNull(input.kcalAdjustment) ?? 0;
  const waterLiters =
    input.waterLiters !== null &&
    Number.isFinite(input.waterLiters) &&
    input.waterLiters > 0
      ? Math.round(input.waterLiters * 100) / 100
      : null;

  const { error } = await supabase.from("plan_day_targets").upsert(
    {
      plan_id: planId,
      day_type: dayType,
      kcal_adjustment: kcalAdjustment,
      water_liters: waterLiters,
    },
    { onConflict: "plan_id,day_type" },
  );
  if (error) throw error;

  revalidate();
  return null;
}

// -------------------------------------------------------------
// Secciones
// -------------------------------------------------------------

export type SectionDraft = {
  label: string;
  sectionType: SectionType;
  icon: string | null;
  notes: string | null;
  visibleWhen: DayType[] | null;
  repeatWhen: DayType[] | null;
};

function normalizeSection(draft: SectionDraft) {
  const label = draft.label.trim();
  if (!label) return null;
  const days = (arr: DayType[] | null) =>
    arr && arr.length > 0 ? arr : null;
  return {
    label,
    section_type: draft.sectionType,
    icon: draft.icon,
    notes: draft.notes?.trim() || null,
    visible_when: days(draft.visibleWhen),
    repeat_when: days(draft.repeatWhen),
  };
}

export async function createSectionAction(
  planId: string,
  draft: SectionDraft,
  sortOrder: number,
): Promise<ActionResult> {
  const row = normalizeSection(draft);
  if (!row) return { error: "label-requerido" };
  const { supabase } = await requireUser();

  const { error } = await supabase
    .from("plan_sections")
    .insert({ plan_id: planId, ...row, sort_order: sortOrder });
  if (error) throw error;

  revalidate();
  return null;
}

export async function updateSectionAction(
  sectionId: string,
  draft: SectionDraft,
): Promise<ActionResult> {
  const row = normalizeSection(draft);
  if (!row) return { error: "label-requerido" };
  const { supabase } = await requireUser();

  const { error } = await supabase
    .from("plan_sections")
    .update(row)
    .eq("id", sectionId);
  if (error) throw error;

  revalidate();
  return null;
}

export async function deleteSectionAction(
  sectionId: string,
): Promise<ActionResult> {
  const { supabase } = await requireUser();

  const { error } = await supabase
    .from("plan_sections")
    .delete()
    .eq("id", sectionId);
  if (error) {
    // El delete cascadea a food_options; log_entries las protege (restrict).
    if (error.code === "23503") return { error: "tiene-historial" };
    throw error;
  }

  revalidate();
  return null;
}

export async function reorderSectionsAction(
  planId: string,
  orderedIds: string[],
): Promise<ActionResult> {
  const { supabase } = await requireUser();

  const results = await Promise.all(
    orderedIds.map((id, index) =>
      supabase
        .from("plan_sections")
        .update({ sort_order: index })
        .eq("id", id)
        .eq("plan_id", planId),
    ),
  );
  const failed = results.find((r) => r.error);
  if (failed?.error) throw failed.error;

  revalidate();
  return null;
}

// -------------------------------------------------------------
// Grupos
// -------------------------------------------------------------

export type GroupDraft = {
  label: string;
  pickCount: number | null;
};

function normalizeGroup(draft: GroupDraft) {
  const label = draft.label.trim();
  if (!label) return null;
  const pickCount =
    draft.pickCount !== null && Number.isFinite(draft.pickCount)
      ? Math.max(1, Math.round(draft.pickCount))
      : 1;
  return { label, pick_count: pickCount };
}

export async function createGroupAction(
  sectionId: string,
  draft: GroupDraft,
  sortOrder: number,
): Promise<ActionResult> {
  const row = normalizeGroup(draft);
  if (!row) return { error: "label-requerido" };
  const { supabase } = await requireUser();

  const { error } = await supabase
    .from("option_groups")
    .insert({ section_id: sectionId, ...row, sort_order: sortOrder });
  if (error) throw error;

  revalidate();
  return null;
}

export async function updateGroupAction(
  groupId: string,
  draft: GroupDraft,
): Promise<ActionResult> {
  const row = normalizeGroup(draft);
  if (!row) return { error: "label-requerido" };
  const { supabase } = await requireUser();

  const { error } = await supabase
    .from("option_groups")
    .update(row)
    .eq("id", groupId);
  if (error) throw error;

  revalidate();
  return null;
}

export async function deleteGroupAction(
  groupId: string,
): Promise<ActionResult> {
  const { supabase } = await requireUser();

  const { error } = await supabase
    .from("option_groups")
    .delete()
    .eq("id", groupId);
  if (error) {
    if (error.code === "23503") return { error: "tiene-historial" };
    throw error;
  }

  revalidate();
  return null;
}

export async function reorderGroupsAction(
  sectionId: string,
  orderedIds: string[],
): Promise<ActionResult> {
  const { supabase } = await requireUser();

  const results = await Promise.all(
    orderedIds.map((id, index) =>
      supabase
        .from("option_groups")
        .update({ sort_order: index })
        .eq("id", id)
        .eq("section_id", sectionId),
    ),
  );
  const failed = results.find((r) => r.error);
  if (failed?.error) throw failed.error;

  revalidate();
  return null;
}

// -------------------------------------------------------------
// Opciones + componentes
// -------------------------------------------------------------

export type ComponentDraft = {
  quantity: number | null;
  unit: FoodUnit;
  description: string;
  weightBasis: WeightBasis | null;
};

export type OptionDraft = {
  label: string | null;
  notes: string | null;
  components: ComponentDraft[];
};

type NormalizedComponent = {
  quantity: number;
  unit: FoodUnit;
  description: string;
  weight_basis: WeightBasis | null;
  sort_order: number;
};

function normalizeOption(draft: OptionDraft) {
  const components: NormalizedComponent[] = [];
  for (const c of draft.components) {
    const description = c.description.trim();
    const quantity =
      c.quantity !== null && Number.isFinite(c.quantity) && c.quantity > 0
        ? c.quantity
        : null;
    if (!description || quantity === null) continue;
    components.push({
      quantity,
      unit: c.unit,
      description,
      weight_basis: c.weightBasis,
      sort_order: components.length,
    });
  }
  if (components.length === 0) return null;
  return {
    label: draft.label?.trim() || null,
    notes: draft.notes?.trim() || null,
    components,
  };
}

export async function createOptionAction(
  groupId: string,
  draft: OptionDraft,
  sortOrder: number,
): Promise<ActionResult> {
  const normalized = normalizeOption(draft);
  if (!normalized) return { error: "componente-requerido" };
  const { supabase } = await requireUser();

  const { data: option, error } = await supabase
    .from("food_options")
    .insert({
      group_id: groupId,
      label: normalized.label,
      notes: normalized.notes,
      sort_order: sortOrder,
    })
    .select("id")
    .single();
  if (error) throw error;

  const { error: compError } = await supabase
    .from("option_components")
    .insert(normalized.components.map((c) => ({ ...c, option_id: option.id })));
  if (compError) throw compError;

  revalidate();
  return null;
}

/**
 * Regla de edición (issue #4):
 * - label/notas → se mutan in place (cosmético, el historial no cambia de sentido).
 * - componentes cambiados y la opción NUNCA fue loggeada → mutar in place.
 * - componentes cambiados y la opción tiene historial → reemplazar: se inserta
 *   la opción nueva ANTES de desactivar la vieja (un fallo a mitad deja ambas
 *   visibles, nunca ninguna). El historial sigue apuntando a la vieja.
 */
export async function updateOptionAction(
  optionId: string,
  draft: OptionDraft,
): Promise<ActionResult> {
  const normalized = normalizeOption(draft);
  if (!normalized) return { error: "componente-requerido" };
  const { supabase } = await requireUser();

  const { data: existing, error: existingError } = await supabase
    .from("food_options")
    .select(
      "id, group_id, sort_order, option_components(quantity, unit, description, weight_basis, sort_order)",
    )
    .eq("id", optionId)
    .single();
  if (existingError) throw existingError;

  const oldComponents = existing.option_components
    .slice()
    .sort((a, b) => a.sort_order - b.sort_order);
  const sameComponents =
    oldComponents.length === normalized.components.length &&
    oldComponents.every((c, i) => {
      const next = normalized.components[i];
      return (
        Number(c.quantity) === next.quantity &&
        c.unit === next.unit &&
        c.description === next.description &&
        c.weight_basis === next.weight_basis
      );
    });

  if (sameComponents) {
    const { error } = await supabase
      .from("food_options")
      .update({ label: normalized.label, notes: normalized.notes })
      .eq("id", optionId);
    if (error) throw error;
    revalidate();
    return null;
  }

  const { count, error: countError } = await supabase
    .from("log_entries")
    .select("id", { count: "exact", head: true })
    .eq("option_id", optionId);
  if (countError) throw countError;

  if (!count) {
    const { error } = await supabase
      .from("food_options")
      .update({ label: normalized.label, notes: normalized.notes })
      .eq("id", optionId);
    if (error) throw error;
    const { error: deleteError } = await supabase
      .from("option_components")
      .delete()
      .eq("option_id", optionId);
    if (deleteError) throw deleteError;
    const { error: insertError } = await supabase
      .from("option_components")
      .insert(
        normalized.components.map((c) => ({ ...c, option_id: optionId })),
      );
    if (insertError) throw insertError;
  } else {
    const { data: created, error: createError } = await supabase
      .from("food_options")
      .insert({
        group_id: existing.group_id,
        label: normalized.label,
        notes: normalized.notes,
        sort_order: existing.sort_order,
      })
      .select("id")
      .single();
    if (createError) throw createError;
    const { error: compError } = await supabase
      .from("option_components")
      .insert(
        normalized.components.map((c) => ({ ...c, option_id: created.id })),
      );
    if (compError) throw compError;
    const { error: deactivateError } = await supabase
      .from("food_options")
      .update({ is_active: false })
      .eq("id", optionId);
    if (deactivateError) throw deactivateError;
  }

  revalidate();
  return null;
}

/** "Eliminar opción" = soft delete siempre; el historial la sigue referenciando. */
export async function deactivateOptionAction(
  optionId: string,
): Promise<ActionResult> {
  const { supabase } = await requireUser();

  const { error } = await supabase
    .from("food_options")
    .update({ is_active: false })
    .eq("id", optionId);
  if (error) throw error;

  revalidate();
  return null;
}

export async function reorderOptionsAction(
  groupId: string,
  orderedIds: string[],
): Promise<ActionResult> {
  const { supabase } = await requireUser();

  const results = await Promise.all(
    orderedIds.map((id, index) =>
      supabase
        .from("food_options")
        .update({ sort_order: index })
        .eq("id", id)
        .eq("group_id", groupId),
    ),
  );
  const failed = results.find((r) => r.error);
  if (failed?.error) throw failed.error;

  revalidate();
  return null;
}
