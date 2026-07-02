import { Container } from "@/components/ui/container";
import { MeasurementForm } from "../components/measurement-form";
import { loadHeightCm } from "../lib/data";
import { emptyDraft } from "../lib/types";

export const dynamic = "force-dynamic";

function todayIso(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default async function NuevaMedicionPage() {
  const heightCm = await loadHeightCm();
  return (
    <Container className="py-4 pb-16 sm:py-8">
      <MeasurementForm
        mode={{ kind: "create" }}
        initial={emptyDraft(todayIso())}
        heightCm={heightCm}
      />
    </Container>
  );
}
