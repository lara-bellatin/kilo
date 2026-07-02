"use client";

import { DAY_TYPES, DAY_TYPE_LABEL, type DayType, type PlanForDay } from "../lib/types";
import { formatKcal } from "@/lib/format";

export function DayTypeSelector({
  plan,
  active,
  onChange,
}: {
  plan: PlanForDay;
  active: DayType;
  onChange: (dayType: DayType) => void;
}) {
  const idx = Math.max(0, DAY_TYPES.indexOf(active));
  return (
    <div
      className="hoy-daytype"
      role="radiogroup"
      aria-label="Tipo de día"
    >
      <span
        className="hoy-daytype-thumb"
        aria-hidden
        style={{ transform: `translateX(${idx * 100}%)` }}
      />
      {DAY_TYPES.map((dt) => {
        const target = plan.targets[dt];
        const checked = dt === active;
        return (
          <button
            key={dt}
            type="button"
            role="radio"
            aria-checked={checked}
            onClick={() => onChange(dt)}
          >
            {DAY_TYPE_LABEL[dt]}
            <span className="kcal">{formatKcal(target.kcalTotal)} kcal</span>
          </button>
        );
      })}
    </div>
  );
}
