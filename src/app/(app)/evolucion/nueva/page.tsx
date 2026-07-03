import { Container } from "@/components/ui/container";
import { MeasurementForm } from "../components/measurement-form";
import { loadHeightCm } from "../lib/data";
import { emptyDraft } from "../lib/types";
import { getTodayIsoDate } from "@/lib/date-server";

export const dynamic = "force-dynamic";

export default async function NuevaMedicionPage() {
  const [heightCm, today] = await Promise.all([
    loadHeightCm(),
    getTodayIsoDate(),
  ]);
  return (
    <Container className="py-4 pb-16 sm:py-8">
      <MeasurementForm
        mode={{ kind: "create" }}
        initial={emptyDraft(today)}
        heightCm={heightCm}
      />
    </Container>
  );
}
