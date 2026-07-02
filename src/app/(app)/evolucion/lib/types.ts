import type { Database } from "@/types/database";

type Row = Database["public"]["Tables"]["measurements"]["Row"];

/** ISAK skinfold fields (mm). */
export const SKINFOLD_KEYS = [
  "tricipital",
  "bicipital",
  "subescapular",
  "cresta_iliaca",
  "supraespinal",
  "abdominal_mm",
  "muslo_medio_mm",
  "pantorrilla_mm",
] as const;
export type SkinfoldKey = (typeof SKINFOLD_KEYS)[number];

/** Sum-6 ISAK: tricipital, subescapular, supraespinal, abdominal, muslo medio, pantorrilla. */
export const SUM6_KEYS: SkinfoldKey[] = [
  "tricipital",
  "subescapular",
  "supraespinal",
  "abdominal_mm",
  "muslo_medio_mm",
  "pantorrilla_mm",
];

/** Sum-8 ISAK: the 6 above + bicipital + cresta iliaca. */
export const SUM8_KEYS: SkinfoldKey[] = [...SKINFOLD_KEYS];

export const SKINFOLD_LABEL: Record<SkinfoldKey, string> = {
  tricipital: "Tricipital",
  bicipital: "Bicipital",
  subescapular: "Subescapular",
  cresta_iliaca: "Cresta ilíaca",
  supraespinal: "Supraespinal",
  abdominal_mm: "Abdominal",
  muslo_medio_mm: "Muslo medio",
  pantorrilla_mm: "Pantorrilla",
};

/** Girth (perímetros) fields in cm. */
export const GIRTH_KEYS = [
  "brazo_relajado",
  "brazo_flexionado",
  "cintura",
  "cadera",
  "muslo_medio_cm",
  "pantorrilla_cm",
] as const;
export type GirthKey = (typeof GIRTH_KEYS)[number];

export const GIRTH_LABEL: Record<GirthKey, string> = {
  brazo_relajado: "Brazo relajado",
  brazo_flexionado: "Brazo flexionado",
  cintura: "Cintura",
  cadera: "Cadera",
  muslo_medio_cm: "Muslo medio",
  pantorrilla_cm: "Pantorrilla",
};

export type Measurement = {
  id: string;
  measuredAt: string; // YYYY-MM-DD
  weightKg: number | null;
  notes: string | null;
  skinfolds: Record<SkinfoldKey, number | null>;
  girths: Record<GirthKey, number | null>;
};

export type MeasurementDerived = Measurement & {
  sum6: number | null;
  sum8: number | null;
  bmi: number | null;
};

/** Draft used by the form; everything optional except date. */
export type MeasurementDraft = {
  measuredAt: string;
  weightKg: number | null;
  notes: string | null;
  skinfolds: Record<SkinfoldKey, number | null>;
  girths: Record<GirthKey, number | null>;
};

export function rowToMeasurement(row: Row): Measurement {
  const skinfolds = {} as Record<SkinfoldKey, number | null>;
  for (const k of SKINFOLD_KEYS) {
    skinfolds[k] = row[k] === null ? null : Number(row[k]);
  }
  const girths = {} as Record<GirthKey, number | null>;
  for (const k of GIRTH_KEYS) {
    girths[k] = row[k] === null ? null : Number(row[k]);
  }
  return {
    id: row.id,
    measuredAt: row.measured_at,
    weightKg: row.weight_kg === null ? null : Number(row.weight_kg),
    notes: row.notes,
    skinfolds,
    girths,
  };
}

export function emptyDraft(measuredAt: string): MeasurementDraft {
  const skinfolds = {} as Record<SkinfoldKey, number | null>;
  for (const k of SKINFOLD_KEYS) skinfolds[k] = null;
  const girths = {} as Record<GirthKey, number | null>;
  for (const k of GIRTH_KEYS) girths[k] = null;
  return {
    measuredAt,
    weightKg: null,
    notes: null,
    skinfolds,
    girths,
  };
}
