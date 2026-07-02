import { createClient } from "@/lib/supabase/server";
import { rowToMeasurement, type Measurement } from "./types";

export async function loadMeasurements(): Promise<Measurement[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("measurements")
    .select(
      "id, measured_at, weight_kg, notes, tricipital, bicipital, subescapular, cresta_iliaca, supraespinal, abdominal_mm, muslo_medio_mm, pantorrilla_mm, brazo_relajado, brazo_flexionado, cintura, cadera, muslo_medio_cm, pantorrilla_cm, user_id, created_at",
    )
    .eq("user_id", user.id)
    .order("measured_at", { ascending: true })
    .order("created_at", { ascending: true });

  return (data ?? []).map(rowToMeasurement);
}

export async function loadMeasurement(id: string): Promise<Measurement | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("measurements")
    .select(
      "id, measured_at, weight_kg, notes, tricipital, bicipital, subescapular, cresta_iliaca, supraespinal, abdominal_mm, muslo_medio_mm, pantorrilla_mm, brazo_relajado, brazo_flexionado, cintura, cadera, muslo_medio_cm, pantorrilla_cm, user_id, created_at",
    )
    .eq("user_id", user.id)
    .eq("id", id)
    .maybeSingle();

  return data ? rowToMeasurement(data) : null;
}

export async function loadHeightCm(): Promise<number | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("height_cm")
    .eq("id", user.id)
    .maybeSingle();

  return data?.height_cm ?? null;
}
