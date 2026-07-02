import { cn } from "@/lib/cn";

type Tone = "neutral" | "up-good" | "down-good";

function formatNumber(n: number, digits: number): string {
  return n.toFixed(digits).replace(".", ",");
}

function deltaTone(delta: number | null, tone: Tone): string {
  if (delta === null || delta === 0) return "text-faint";
  if (tone === "neutral") return "text-muted";
  const up = delta > 0;
  const good = (tone === "up-good" && up) || (tone === "down-good" && !up);
  return good ? "text-done" : "text-over";
}

export function MetricCard({
  label,
  value,
  unit,
  digits = 1,
  delta,
  deltaTone: tone = "neutral",
  emptyLabel = "—",
}: {
  label: string;
  value: number | null;
  unit: string;
  digits?: number;
  delta: number | null;
  deltaTone?: Tone;
  emptyLabel?: string;
}) {
  const deltaText =
    delta === null
      ? null
      : delta === 0
        ? "±0"
        : `${delta > 0 ? "+" : "−"}${formatNumber(Math.abs(delta), digits)}`;

  return (
    <div className="flex flex-col justify-between rounded-card border border-border bg-surface p-4">
      <span className="text-eyebrow">{label}</span>
      <div className="mt-2 flex items-baseline gap-1.5">
        <span className="font-mono text-[1.75rem] font-semibold leading-none tracking-tight tabular-nums text-text">
          {value === null ? emptyLabel : formatNumber(value, digits)}
        </span>
        <span className="font-mono text-sm text-muted">{unit}</span>
      </div>
      <div
        className={cn(
          "mt-3 font-mono text-xs tabular-nums",
          deltaTone(delta, tone),
        )}
      >
        {deltaText ? `${deltaText} ${unit}` : "sin comparación"}
      </div>
    </div>
  );
}
