import { Pencil } from "lucide-react";
import type { DayType, PlanTree } from "../lib/types";
import { DAY_TYPES, DAY_TYPE_LABEL } from "../lib/types";

function formatLitersLabel(liters: number): string {
  return `${liters.toString().replace(".", ",")} L`;
}

export function DayTargetsCard({
  plan,
  onEditDay,
}: {
  plan: PlanTree;
  onEditDay?: (dayType: DayType) => void;
}) {
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
          const row = (
            <>
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
                {onEditDay ? (
                  <Pencil
                    size={16}
                    strokeWidth={1.5}
                    className="plan-row-pencil"
                    aria-hidden
                  />
                ) : null}
              </span>
            </>
          );
          if (onEditDay) {
            return (
              <button
                key={dayType}
                type="button"
                className="plan-target-row plan-editable-row"
                onClick={() => onEditDay(dayType)}
                aria-label={`Editar objetivo de ${DAY_TYPE_LABEL[dayType]}`}
              >
                {row}
              </button>
            );
          }
          return (
            <div key={dayType} className="plan-target-row">
              {row}
            </div>
          );
        })}
      </div>
    </section>
  );
}
