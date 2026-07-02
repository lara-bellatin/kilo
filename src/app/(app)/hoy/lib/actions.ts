"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { DayType } from "./types";

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
