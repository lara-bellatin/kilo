"use client";

import { useState } from "react";
import {
  SKINFOLD_KEYS,
  SKINFOLD_LABEL,
  type MeasurementDerived,
  type SkinfoldKey,
} from "../lib/types";
import { EvolutionChart, type ChartSeries } from "./evolution-chart";

/** Palette drawn from design tokens; distinct hues for multi-series charts. */
const SKINFOLD_COLOR: Record<SkinfoldKey, string> = {
  tricipital: "var(--text)",
  bicipital: "var(--info)",
  subescapular: "var(--accent)",
  cresta_iliaca: "var(--warn)",
  supraespinal: "var(--done)",
  abdominal_mm: "var(--over)",
  muslo_medio_mm: "var(--accent-dim)",
  pantorrilla_mm: "var(--text-muted)",
};

export function ChartsSection({
  measurements,
}: {
  measurements: MeasurementDerived[];
}) {
  const [visibleFolds, setVisibleFolds] = useState<Set<SkinfoldKey>>(
    () => new Set(SKINFOLD_KEYS),
  );

  const dates = measurements.map((m) => m.measuredAt);

  const weightSeries: ChartSeries[] = [
    {
      key: "weight",
      label: "Peso",
      color: "var(--text)",
      data: measurements.map((m, i) => ({
        date: dates[i],
        value: m.weightKg,
      })),
    },
  ];

  const sumsSeries: ChartSeries[] = [
    {
      key: "sum6",
      label: "Σ6 pliegues",
      color: "var(--info)",
      data: measurements.map((m, i) => ({ date: dates[i], value: m.sum6 })),
    },
    {
      key: "sum8",
      label: "Σ8 pliegues",
      color: "var(--accent)",
      data: measurements.map((m, i) => ({ date: dates[i], value: m.sum8 })),
    },
  ];

  const musclesSeries: ChartSeries[] = [
    {
      key: "brazo_flex",
      label: "Brazo flex.",
      color: "var(--text)",
      data: measurements.map((m, i) => ({
        date: dates[i],
        value: m.girths.brazo_flexionado,
      })),
    },
    {
      key: "muslo_medio_cm",
      label: "Muslo medio",
      color: "var(--info)",
      data: measurements.map((m, i) => ({
        date: dates[i],
        value: m.girths.muslo_medio_cm,
      })),
    },
    {
      key: "pantorrilla_cm",
      label: "Pantorrilla",
      color: "var(--accent)",
      data: measurements.map((m, i) => ({
        date: dates[i],
        value: m.girths.pantorrilla_cm,
      })),
    },
  ];

  const cinturaCaderaSeries: ChartSeries[] = [
    {
      key: "cintura",
      label: "Cintura",
      color: "var(--text)",
      data: measurements.map((m, i) => ({
        date: dates[i],
        value: m.girths.cintura,
      })),
    },
    {
      key: "cadera",
      label: "Cadera",
      color: "var(--info)",
      data: measurements.map((m, i) => ({
        date: dates[i],
        value: m.girths.cadera,
      })),
    },
  ];

  const foldsSeries: ChartSeries[] = SKINFOLD_KEYS.filter((k) =>
    visibleFolds.has(k),
  ).map((k) => ({
    key: k,
    label: SKINFOLD_LABEL[k],
    color: SKINFOLD_COLOR[k],
    data: measurements.map((m, i) => ({
      date: dates[i],
      value: m.skinfolds[k],
    })),
  }));

  function toggleFold(k: SkinfoldKey) {
    setVisibleFolds((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <section className="rounded-card border border-border bg-surface p-4 sm:p-6">
        <header className="mb-3 flex items-baseline justify-between gap-4">
          <h3 className="text-h2">Pliegues individuales</h3>
          <span className="font-mono text-xs text-muted">mm</span>
        </header>
        <div className="mb-4 flex flex-wrap gap-2">
          {SKINFOLD_KEYS.map((k) => {
            const on = visibleFolds.has(k);
            return (
              <button
                key={k}
                type="button"
                onClick={() => toggleFold(k)}
                aria-pressed={on}
                className="inline-flex items-center gap-2 rounded-pill border px-3 py-1 font-mono text-xs transition-colors"
                style={{
                  borderColor: on ? SKINFOLD_COLOR[k] : "var(--border)",
                  color: on ? "var(--text)" : "var(--text-faint)",
                  background: on
                    ? "color-mix(in srgb, var(--surface-2) 60%, transparent)"
                    : "transparent",
                }}
              >
                <span
                  aria-hidden
                  className="inline-block h-[2px] w-3"
                  style={{ background: SKINFOLD_COLOR[k] }}
                />
                {SKINFOLD_LABEL[k]}
              </button>
            );
          })}
        </div>
        <EvolutionChart
          bare
          unit="mm"
          series={foldsSeries}
          height={320}
        />
      </section>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <EvolutionChart title="Peso corporal" unit="kg" series={weightSeries} />
        <EvolutionChart
          title="Σ6 y Σ8 pliegues"
          unit="mm"
          digits={0}
          series={sumsSeries}
        />
        <EvolutionChart
          title="Perímetros musculares"
          unit="cm"
          series={musclesSeries}
        />
        <EvolutionChart
          title="Cintura y cadera"
          unit="cm"
          series={cinturaCaderaSeries}
        />
      </div>
    </div>
  );
}
