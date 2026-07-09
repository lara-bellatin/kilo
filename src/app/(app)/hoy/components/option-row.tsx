"use client";

import { Check, Minus, Plus } from "lucide-react";
import type { PlanOption } from "../lib/types";
import { optionName, optionSubnote, primaryQty } from "@/lib/food-format";

function Label({ opt }: { opt: PlanOption }) {
  const qty = primaryQty(opt);
  const name = optionName(opt);
  const note = optionSubnote(opt);
  return (
    <span className="hoy-opt-label">
      {qty ? (
        <>
          <span className="qty">{qty}</span>{" "}
        </>
      ) : null}
      {name}
      {note ? <span className="hoy-opt-note">{note}</span> : null}
    </span>
  );
}

export function CheckRow({
  opt,
  checked,
  onToggle,
}: {
  opt: PlanOption;
  checked: boolean;
  onToggle: (next: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      className="hoy-check-row"
      onClick={() => onToggle(!checked)}
    >
      <span className="hoy-check-box" aria-hidden>
        <Check size={14} strokeWidth={2.5} />
      </span>
      <Label opt={opt} />
    </button>
  );
}

export function StepRow({
  opt,
  count,
  onChange,
}: {
  opt: PlanOption;
  count: number;
  onChange: (next: number) => void;
}) {
  const on = count > 0;
  const name = optionName(opt);
  return (
    <div className={"hoy-opt" + (on ? " is-on" : "")}>
      <span className="hoy-opt-check" aria-hidden>
        <Check size={14} strokeWidth={2.5} />
      </span>
      <Label opt={opt} />
      <div className="hoy-stepper" aria-label={`Cantidad de ${name}`}>
        <button
          type="button"
          aria-label={`Restar ${name}`}
          disabled={count === 0}
          onClick={() => onChange(Math.max(0, count - 1))}
        >
          <Minus size={20} strokeWidth={1.5} />
        </button>
        <span className="value">{count}</span>
        <button
          type="button"
          aria-label={`Sumar ${name}`}
          onClick={() => onChange(count + 1)}
        >
          <Plus size={20} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
