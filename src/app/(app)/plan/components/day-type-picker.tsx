"use client";

import type { DayType } from "../lib/types";
import { DAY_TYPES, DAY_TYPE_LABEL } from "../lib/types";

/** Chip presionable genérico (día, tipo de sección, etc.). */
export function ChipToggle({
  pressed,
  onToggle,
  children,
}: {
  pressed: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className="plan-chip"
      aria-pressed={pressed}
      onClick={onToggle}
    >
      {children}
    </button>
  );
}

/**
 * Selector de tipos de día para visible_when / repeat_when.
 * Ningún chip seleccionado = el valor "vacío" (siempre / nunca).
 */
export function DayTypePicker({
  legend,
  emptyLabel,
  value,
  onChange,
}: {
  legend: string;
  emptyLabel: string;
  value: DayType[];
  onChange: (next: DayType[]) => void;
}) {
  function toggle(dayType: DayType) {
    onChange(
      value.includes(dayType)
        ? value.filter((d) => d !== dayType)
        : [...value, dayType],
    );
  }

  return (
    <fieldset className="plan-daypicker">
      <legend className="plan-daypicker-legend">{legend}</legend>
      <div className="plan-chips">
        {DAY_TYPES.map((dayType) => (
          <ChipToggle
            key={dayType}
            pressed={value.includes(dayType)}
            onToggle={() => toggle(dayType)}
          >
            {DAY_TYPE_LABEL[dayType]}
          </ChipToggle>
        ))}
      </div>
      <p className="plan-daypicker-hint">
        {value.length === 0 ? emptyLabel : " "}
      </p>
    </fieldset>
  );
}
