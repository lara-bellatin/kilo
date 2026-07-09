"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { DayType } from "./types";
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
