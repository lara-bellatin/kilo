"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useId } from "react";

export type ChartSeries = {
  key: string;
  label: string;
  color: string;
  data: Array<{ date: string; value: number | null }>;
};

type ChartRow = { date: string } & Record<string, number | null | string>;

function toRows(seriesList: ChartSeries[]): ChartRow[] {
  const dates = new Set<string>();
  for (const s of seriesList) for (const p of s.data) dates.add(p.date);
  const sorted = Array.from(dates).sort();
  return sorted.map((date) => {
    const row: ChartRow = { date };
    for (const s of seriesList) {
      const point = s.data.find((p) => p.date === date);
      row[s.key] = point?.value ?? null;
    }
    return row;
  });
}

function formatAxisDate(iso: string): string {
  const [y, m, d] = iso.split("-").map((n) => parseInt(n, 10));
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString("es-PE", { day: "2-digit", month: "short" });
}

function formatTooltipDate(iso: string): string {
  const [y, m, d] = iso.split("-").map((n) => parseInt(n, 10));
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function EvolutionChart({
  title,
  unit,
  digits = 1,
  series,
  height = 240,
  bare = false,
}: {
  title?: string;
  unit: string;
  digits?: number;
  series: ChartSeries[];
  height?: number;
  bare?: boolean;
}) {
  const rows = toRows(series);
  const hasData = rows.some((r) =>
    series.some((s) => typeof r[s.key] === "number"),
  );
  const titleId = useId();

  const body = hasData ? (
    <>
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={rows}
            margin={{ top: 8, right: 12, left: 0, bottom: 4 }}
          >
            <CartesianGrid
              stroke="var(--border)"
              strokeDasharray="2 4"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              stroke="var(--text-faint)"
              fontFamily="var(--font-mono)"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "var(--border)" }}
              tickFormatter={formatAxisDate}
              minTickGap={24}
            />
            <YAxis
              stroke="var(--text-faint)"
              fontFamily="var(--font-mono)"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "var(--border)" }}
              width={44}
              tickFormatter={(v: number) =>
                typeof v === "number" ? v.toFixed(0) : ""
              }
            />
            <Tooltip
              cursor={{ stroke: "var(--border)", strokeDasharray: "2 4" }}
              contentStyle={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                color: "var(--text)",
                boxShadow: "none",
              }}
              labelStyle={{ color: "var(--text-muted)" }}
              labelFormatter={(l) =>
                typeof l === "string" ? formatTooltipDate(l) : ""
              }
              formatter={(v, name) => [
                typeof v === "number"
                  ? `${v.toFixed(digits)} ${unit}`
                  : "—",
                String(name),
              ]}
            />
            {series.map((s) => (
              <Line
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.label}
                stroke={s.color}
                strokeWidth={1.5}
                dot={{ r: 3, fill: s.color, strokeWidth: 0 }}
                activeDot={{ r: 5, strokeWidth: 0 }}
                isAnimationActive={false}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      {series.length > 1 ? (
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs">
          {series.map((s) => (
            <span key={s.key} className="inline-flex items-center gap-2">
              <span
                aria-hidden
                className="inline-block h-[2px] w-4"
                style={{ background: s.color }}
              />
              <span className="text-muted">{s.label}</span>
            </span>
          ))}
        </div>
      ) : null}
    </>
  ) : (
    <p className="py-8 text-center text-sm text-muted">
      Sin datos suficientes.
    </p>
  );

  if (bare) return body;

  return (
    <section
      aria-labelledby={titleId}
      className="rounded-card border border-border bg-surface p-4 sm:p-6"
    >
      <header className="mb-4 flex items-baseline justify-between gap-4">
        <h3 id={titleId} className="text-h2">
          {title}
        </h3>
        <span className="font-mono text-xs text-muted">{unit}</span>
      </header>
      {body}
    </section>
  );
}
