"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { DayType, FoodUnit } from "./types";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("no-auth");
  return { supabase, userId: user.id };
}

async function ensureDayLog(date: string, dayType: DayType) {
  const { supabase, userId } = await requireUser();

  const { data: existing } = await supabase
    .from("day_logs")
    .select("id, day_type")
    .eq("user_id", userId)
    .eq("date", date)
    .maybeSingle();

  if (existing) return { supabase, dayLogId: existing.id, dayType: existing.day_type };

  const { data: inserted, error } = await supabase
    .from("day_logs")
    .insert({ user_id: userId, date, day_type: dayType })
    .select("id, day_type")
    .single();

  if (error) throw error;
  return { supabase, dayLogId: inserted.id, dayType: inserted.day_type };
}

export async function setDayTypeAction(date: string, dayType: DayType) {
  const { supabase, dayLogId } = await ensureDayLog(date, dayType);
  const { error } = await supabase
    .from("day_logs")
    .update({ day_type: dayType })
    .eq("id", dayLogId);
  if (error) throw error;
  revalidatePath("/hoy");
}

export async function setWaterLitersAction(date: string, waterLiters: number) {
  const clamped = Math.max(0, Number(waterLiters.toFixed(3)));
  const { supabase, dayLogId } = await ensureDayLog(date, "descanso");
  const { error } = await supabase
    .from("day_logs")
    .update({ water_liters: clamped })
    .eq("id", dayLogId);
  if (error) throw error;
  revalidatePath("/hoy");
}

export async function setEntryServingsAction(input: {
  date: string;
  optionId: string;
  occurrence: number;
  servings: number;
  dayType: DayType;
}) {
  const servings = Math.max(0, Math.floor(input.servings));
  const { supabase, dayLogId } = await ensureDayLog(input.date, input.dayType);

  if (servings === 0) {
    const { error } = await supabase
      .from("log_entries")
      .delete()
      .eq("day_log_id", dayLogId)
      .eq("option_id", input.optionId)
      .eq("occurrence", input.occurrence);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("log_entries").upsert(
      {
        day_log_id: dayLogId,
        option_id: input.optionId,
        occurrence: input.occurrence,
        servings,
      },
      { onConflict: "day_log_id,option_id,occurrence" },
    );
    if (error) throw error;
  }
  revalidatePath("/hoy");
}

export type FreeEntryInput = {
  date: string;
  dayType: DayType;
  sectionId: string | null;
  description: string;
  quantity: number | null;
  unit: FoodUnit | null;
  notes: string | null;
};

function normalizeFreeEntry(input: FreeEntryInput) {
  const description = input.description.trim();
  if (!description) throw new Error("description-required");
  const quantity =
    input.quantity !== null && Number.isFinite(input.quantity) && input.quantity > 0
      ? input.quantity
      : null;
  const unit = quantity !== null ? input.unit : null;
  const notes = input.notes?.trim() || null;
  return { description, quantity, unit, notes };
}

export async function createFreeEntryAction(input: FreeEntryInput) {
  const { description, quantity, unit, notes } = normalizeFreeEntry(input);
  const { supabase, dayLogId } = await ensureDayLog(input.date, input.dayType);
  const { error } = await supabase.from("free_entries").insert({
    day_log_id: dayLogId,
    section_id: input.sectionId,
    description,
    quantity,
    unit,
    notes,
  });
  if (error) throw error;
  revalidatePath("/hoy");
}

export async function updateFreeEntryAction(
  id: string,
  input: Omit<FreeEntryInput, "date" | "dayType">,
) {
  const { description, quantity, unit, notes } = normalizeFreeEntry({
    ...input,
    date: "",
    dayType: "descanso",
  });
  const { supabase } = await requireUser();
  const { error } = await supabase
    .from("free_entries")
    .update({
      section_id: input.sectionId,
      description,
      quantity,
      unit,
      notes,
    })
    .eq("id", id);
  if (error) throw error;
  revalidatePath("/hoy");
}

export async function deleteFreeEntryAction(id: string) {
  const { supabase } = await requireUser();
  const { error } = await supabase.from("free_entries").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/hoy");
}
