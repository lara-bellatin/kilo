import { EvolucionView } from "./components/evolucion-view";
import { loadHeightCm, loadMeasurements } from "./lib/data";

export const dynamic = "force-dynamic";

export default async function EvolucionPage() {
  const [measurements, heightCm] = await Promise.all([
    loadMeasurements(),
    loadHeightCm(),
  ]);
  return <EvolucionView measurements={measurements} heightCm={heightCm} />;
}
