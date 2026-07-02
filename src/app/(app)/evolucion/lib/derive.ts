import {
  SUM6_KEYS,
  SUM8_KEYS,
  type Measurement,
  type MeasurementDerived,
  type SkinfoldKey,
} from "./types";

function sumFolds(m: Measurement, keys: SkinfoldKey[]): number | null {
  const values = keys.map((k) => m.skinfolds[k]);
  if (values.some((v) => v === null)) return null;
  return values.reduce<number>((s, v) => s + (v ?? 0), 0);
}

export function computeSum6(m: Measurement): number | null {
  return sumFolds(m, SUM6_KEYS);
}

export function computeSum8(m: Measurement): number | null {
  return sumFolds(m, SUM8_KEYS);
}

export function computeBMI(
  weightKg: number | null,
  heightCm: number | null,
): number | null {
  if (!weightKg || !heightCm) return null;
  const meters = heightCm / 100;
  if (meters <= 0) return null;
  return weightKg / (meters * meters);
}

export function derive(
  m: Measurement,
  heightCm: number | null,
): MeasurementDerived {
  return {
    ...m,
    sum6: computeSum6(m),
    sum8: computeSum8(m),
    bmi: computeBMI(m.weightKg, heightCm),
  };
}

export function deriveAll(
  measurements: Measurement[],
  heightCm: number | null,
): MeasurementDerived[] {
  return measurements.map((m) => derive(m, heightCm));
}

/** Latest = last item in ascending order. */
export function latest<T>(items: T[]): T | null {
  return items.length > 0 ? items[items.length - 1] : null;
}

export function previous<T>(items: T[]): T | null {
  return items.length > 1 ? items[items.length - 2] : null;
}

export function delta(
  current: number | null,
  prev: number | null,
): number | null {
  if (current === null || prev === null) return null;
  return current - prev;
}
