"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  GIRTH_KEYS,
  SKINFOLD_KEYS,
  type MeasurementDraft,
} from "./types";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("no-auth");
  return { supabase, userId: user.id };
}

function normalizeDraft(input: MeasurementDraft) {
  const measuredAt = input.measuredAt;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(measuredAt)) {
    throw new Error("date-required");
  }
  const row: Record<string, number | string | null> = {
    measured_at: measuredAt,
    weight_kg: input.weightKg ?? null,
    notes: input.notes?.trim() || null,
  };
  for (const k of SKINFOLD_KEYS) row[k] = input.skinfolds[k];
  for (const k of GIRTH_KEYS) row[k] = input.girths[k];
  return row;
}

export async function createMeasurementAction(input: MeasurementDraft) {
  const { supabase, userId } = await requireUser();
  const row = normalizeDraft(input);
  const { error } = await supabase
    .from("measurements")
    .insert({ ...row, user_id: userId } as never);
  if (error) throw error;
  revalidatePath("/evolucion");
  redirect("/evolucion");
}

export async function updateMeasurementAction(
  id: string,
  input: MeasurementDraft,
) {
  const { supabase } = await requireUser();
  const row = normalizeDraft(input);
  const { error } = await supabase
    .from("measurements")
    .update(row as never)
    .eq("id", id);
  if (error) throw error;
  revalidatePath("/evolucion");
  redirect("/evolucion");
}

export async function deleteMeasurementAction(id: string) {
  const { supabase } = await requireUser();
  const { error } = await supabase.from("measurements").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/evolucion");
  redirect("/evolucion");
}

export async function updateHeightAction(heightCm: number | null) {
  const { supabase, userId } = await requireUser();
  const value =
    heightCm !== null && Number.isFinite(heightCm) && heightCm > 0
      ? heightCm
      : null;
  const { error } = await supabase
    .from("profiles")
    .update({ height_cm: value })
    .eq("id", userId);
  if (error) throw error;
  revalidatePath("/evolucion");
}
