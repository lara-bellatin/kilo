import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { MeasurementForm } from "../components/measurement-form";
import { loadHeightCm, loadMeasurement } from "../lib/data";

export const dynamic = "force-dynamic";

export default async function EditarMedicionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [measurement, heightCm] = await Promise.all([
    loadMeasurement(id),
    loadHeightCm(),
  ]);
  if (!measurement) notFound();

  return (
    <Container className="py-4 pb-16 sm:py-8">
      <MeasurementForm
        mode={{ kind: "edit", id: measurement.id }}
        initial={{
          measuredAt: measurement.measuredAt,
          weightKg: measurement.weightKg,
          notes: measurement.notes,
          skinfolds: measurement.skinfolds,
          girths: measurement.girths,
        }}
        heightCm={heightCm}
      />
    </Container>
  );
}
