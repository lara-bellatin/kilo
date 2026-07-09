import { Eyebrow } from "@/components/eyebrow";
import { Card } from "@/components/ui/card";

export function PlanEmptyState() {
  return (
    <div className="plan-shell">
      <div className="plan-titlerow">
        <div>
          <Eyebrow>Plan</Eyebrow>
          <h1 className="text-h1">Plan</h1>
        </div>
      </div>
      <Card>
        <p className="text-muted">
          Aún no tienes un plan. Créalo para ver aquí tu guía de comidas y
          empezar a marcar tus días en Hoy.
        </p>
      </Card>
    </div>
  );
}
