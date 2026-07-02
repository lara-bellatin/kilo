import Link from "next/link";
import { Pencil } from "lucide-react";
import type { MeasurementDerived } from "../lib/types";

function formatValue(v: number | null, digits: number): string {
  return v === null ? "—" : v.toFixed(digits).replace(".", ",");
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map((n) => parseInt(n, 10));
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function MeasurementHistory({
  measurements,
}: {
  measurements: MeasurementDerived[];
}) {
  const rows = [...measurements].reverse();

  return (
    <section
      aria-labelledby="historial-title"
      className="rounded-card border border-border bg-surface p-4 sm:p-6"
    >
      <header className="mb-4 flex items-baseline justify-between gap-4">
        <h3 id="historial-title" className="text-h2">
          Historial
        </h3>
        <span className="font-mono text-xs text-muted">
          {measurements.length}{" "}
          {measurements.length === 1 ? "medición" : "mediciones"}
        </span>
      </header>

      <div className="-mx-4 overflow-x-auto sm:-mx-6">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead>
            <tr className="text-eyebrow text-left">
              <th className="px-4 py-2 font-normal sm:px-6">Fecha</th>
              <th className="px-3 py-2 text-right font-normal">Peso</th>
              <th className="px-3 py-2 text-right font-normal">Σ6</th>
              <th className="px-3 py-2 text-right font-normal">Σ8</th>
              <th className="px-3 py-2 text-right font-normal">IMC</th>
              <th className="px-3 py-2 text-right font-normal">Brazo flex.</th>
              <th className="px-3 py-2 text-right font-normal">Cintura</th>
              <th className="px-3 py-2 text-right font-normal">Cadera</th>
              <th className="w-10 px-3 py-2 sm:px-6"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((m) => (
              <tr
                key={m.id}
                className="border-t border-border/60 font-mono tabular-nums"
              >
                <td className="whitespace-nowrap px-4 py-3 text-text sm:px-6">
                  {formatDate(m.measuredAt)}
                </td>
                <td className="px-3 py-3 text-right text-text">
                  {formatValue(m.weightKg, 1)}
                </td>
                <td className="px-3 py-3 text-right text-text">
                  {formatValue(m.sum6, 1)}
                </td>
                <td className="px-3 py-3 text-right text-text">
                  {formatValue(m.sum8, 1)}
                </td>
                <td className="px-3 py-3 text-right text-text">
                  {formatValue(m.bmi, 1)}
                </td>
                <td className="px-3 py-3 text-right text-text">
                  {formatValue(m.girths.brazo_flexionado, 1)}
                </td>
                <td className="px-3 py-3 text-right text-text">
                  {formatValue(m.girths.cintura, 1)}
                </td>
                <td className="px-3 py-3 text-right text-text">
                  {formatValue(m.girths.cadera, 1)}
                </td>
                <td className="px-3 py-3 text-right sm:px-6">
                  <Link
                    href={`/evolucion/${m.id}`}
                    aria-label={`Editar medición del ${formatDate(m.measuredAt)}`}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-input text-faint transition-colors hover:bg-surface-2 hover:text-text"
                  >
                    <Pencil size={16} strokeWidth={1.5} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
