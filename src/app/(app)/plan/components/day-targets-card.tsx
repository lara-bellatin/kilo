import type { PlanTree } from "../lib/types";
import { DAY_TYPES, DAY_TYPE_LABEL } from "../lib/types";

function formatLitersLabel(liters: number): string {
  return `${liters.toString().replace(".", ",")} L`;
}

export function DayTargetsCard({ plan }: { plan: PlanTree }) {
  return (
    <section className="plan-card">
      <span className="text-eyebrow">Objetivos por día</span>
      <div className="plan-targets">
        {DAY_TYPES.map((dayType) => {
          const target = plan.targets[dayType];
          const total =
            plan.baseKcal === null
              ? null
              : plan.baseKcal + target.kcalAdjustment;
          return (
            <div key={dayType} className="plan-target-row">
              <span className="plan-target-label">
                {DAY_TYPE_LABEL[dayType]}
              </span>
              <span className="plan-target-values">
                {target.kcalAdjustment !== 0 ? (
                  <span className="plan-target-adj">
                    {target.kcalAdjustment > 0 ? "+" : ""}
                    {target.kcalAdjustment}
                  </span>
                ) : null}
                <span className="plan-target-kcal">
                  {total ?? "—"}
                  <span className="unit">kcal</span>
                </span>
                <span className="plan-target-water">
                  {target.waterLiters !== null
                    ? formatLitersLabel(target.waterLiters)
                    : "—"}
                </span>
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
