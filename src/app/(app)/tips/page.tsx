import { Card } from "@/components/ui/card";
import { Eyebrow } from "@/components/eyebrow";
import { loadTips } from "./lib/data";
import { TipsView } from "./components/tips-view";

export const dynamic = "force-dynamic";

export default async function TipsPage() {
  const categories = await loadTips();

  if (categories.length === 0) {
    return (
      <div className="tips-shell">
        <div className="tips-titlerow">
          <div>
            <Eyebrow>Guía compartida</Eyebrow>
            <h1 className="text-h1">Tips</h1>
          </div>
        </div>
        <Card>
          <p className="text-muted">
            Aún no hay tips cargados. Cuando estén disponibles, verás aquí la
            guía compartida: salsas, bebidas, porciones y más.
          </p>
        </Card>
      </div>
    );
  }

  return <TipsView categories={categories} />;
}
