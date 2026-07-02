import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { deriveAll, latest, previous, delta } from "../lib/derive";
import type { Measurement } from "../lib/types";
import { MetricCard } from "./metric-card";
import { ChartsSection } from "./charts-section";
import { MeasurementHistory } from "./measurement-history";

function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map((n) => parseInt(n, 10));
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function EvolucionView({
  measurements,
  heightCm,
}: {
  measurements: Measurement[];
  heightCm: number | null;
}) {
  const derived = deriveAll(measurements, heightCm);

  if (derived.length === 0) {
    return (
      <Container className="py-4 pb-16 sm:py-8">
        <div className="mb-8 flex items-baseline justify-between gap-4">
          <div>
            <span className="text-eyebrow">
              <span className="hoy-dash">— </span>
              Sin mediciones
            </span>
            <h1 className="text-h1">Evolución</h1>
          </div>
        </div>
        <div className="rounded-card border border-border bg-surface p-8 text-center">
          <p className="mb-6 text-muted">
            Registra tu primera medición para ver tu evolución en gráficos y en
            el historial.
          </p>
          <Link href="/evolucion/nueva">
            <Button variant="primary" size="lg">
              <Plus size={20} strokeWidth={1.5} />
              Registrar primera medición
            </Button>
          </Link>
        </div>
      </Container>
    );
  }

  const last = latest(derived)!;
  const prev = previous(derived);

  const lastDate = formatDate(last.measuredAt);

  return (
    <Container className="py-4 pb-16 sm:py-8">
      <div className="mb-6">
        <span className="text-eyebrow">
          <span className="hoy-dash">— </span>
          última medición · {lastDate}
        </span>
        <h1 className="text-h1">Evolución</h1>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MetricCard
          label="Peso"
          value={last.weightKg}
          unit="kg"
          delta={delta(last.weightKg, prev?.weightKg ?? null)}
          deltaTone="down-good"
        />
        <MetricCard
          label="Σ8 pliegues"
          value={last.sum8}
          unit="mm"
          delta={delta(last.sum8, prev?.sum8 ?? null)}
          deltaTone="down-good"
        />
        <MetricCard
          label="Brazo flex."
          value={last.girths.brazo_flexionado}
          unit="cm"
          delta={delta(
            last.girths.brazo_flexionado,
            prev?.girths.brazo_flexionado ?? null,
          )}
          deltaTone="up-good"
        />
        <MetricCard
          label="Muslo medio"
          value={last.girths.muslo_medio_cm}
          unit="cm"
          delta={delta(
            last.girths.muslo_medio_cm,
            prev?.girths.muslo_medio_cm ?? null,
          )}
          deltaTone="up-good"
        />
      </div>

      <div className="mb-8">
        <ChartsSection measurements={derived} />
      </div>

      <MeasurementHistory measurements={derived} />

      <div className="mt-6 flex justify-center">
        <Link href="/evolucion/nueva">
          <Button variant="ghost" size="lg">
            <Plus size={18} strokeWidth={1.5} />
            Nueva medición
          </Button>
        </Link>
      </div>
    </Container>
  );
}
