import { Pill } from "@/components/pill";
import type { PlanTree } from "../lib/types";

function Macro({ label, grams }: { label: string; grams: number | null }) {
  if (grams === null) return null;
  return (
    <div className="plan-macro">
      <span className="plan-macro-label">{label}</span>
      <span className="plan-macro-value">
        {grams}
        <span className="unit">g</span>
      </span>
    </div>
  );
}

export function PlanHeaderCard({ plan }: { plan: PlanTree }) {
  return (
    <section className="plan-card">
      <div className="plan-card-main">
        <div>
          <span className="text-eyebrow">Objetivo base</span>
          <div className="plan-kcal">
            {plan.baseKcal ?? "—"}
            <span className="unit">kcal</span>
          </div>
        </div>
        <div className="plan-macros">
          <Macro label="Proteína" grams={plan.proteinG} />
          <Macro label="Carbos" grams={plan.carbsG} />
          <Macro label="Grasa" grams={plan.fatG} />
        </div>
      </div>
      {plan.tags.length > 0 ? (
        <div className="plan-tags">
          {plan.tags.map((tag) => (
            <Pill key={tag}>{tag}</Pill>
          ))}
        </div>
      ) : null}
      {plan.notes ? <p className="plan-card-notes">{plan.notes}</p> : null}
    </section>
  );
}
