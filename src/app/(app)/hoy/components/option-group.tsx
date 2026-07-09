"use client";

import { TriangleAlert } from "lucide-react";
import type { LogEntry, PlanGroup } from "../lib/types";
import { groupTotal, optionCount, stateForGroup } from "../lib/derive";
import { usePop } from "../lib/motion";
import { Eyebrow } from "@/components/eyebrow";
import { Pill } from "@/components/pill";
import { CheckRow, StepRow } from "./option-row";

/** Any option in the group with more than 1 component effectively acts like a "portion" stepper. */
function isStepControl(group: PlanGroup): boolean {
  if (group.pickCount > 1) return true;
  // pickCount === 1 with a single option → stepper (Fruta 2 con 1 opción)
  if (group.pickCount === 1 && group.options.length <= 1) {
    // If there's ambiguity, checkbox is simpler; but README says pick > 1 always stepper
    return false;
  }
  return false;
}

export function OptionGroup({
  group,
  entries,
  occurrence,
  onChangeCount,
}: {
  group: PlanGroup;
  entries: LogEntry[];
  occurrence: number;
  onChangeCount: (optionId: string, next: number) => void;
}) {
  const state = stateForGroup(group, entries, occurrence);
  const total = groupTotal(group, entries, occurrence);
  const pop = usePop(state === "done");
  const stepControl = isStepControl(group);

  return (
    <div className="hoy-group">
      <div className="hoy-group-head">
        <Eyebrow>
          {group.label.toLowerCase()} · escoge{" "}
          <span className="n">{group.pickCount}</span>
        </Eyebrow>
        {state === "over" ? (
          <Pill tone="warn" icon="triangle-alert">
            {total}/{group.pickCount}
          </Pill>
        ) : state === "done" ? (
          <Pill tone="done" icon="check" className={pop ? "hoy-pop" : undefined}>
            {total}/{group.pickCount}
          </Pill>
        ) : (
          <Pill>
            {total}/{group.pickCount}
          </Pill>
        )}
      </div>
      {state === "over" ? (
        <p className="hoy-warn-msg" role="status">
          <TriangleAlert size={14} strokeWidth={1.75} aria-hidden />
          Marcaste {total} de {group.pickCount} — más de lo que indica el plan.
        </p>
      ) : null}
      <div className="hoy-opts">
        {group.options.map((opt) => {
          const count = optionCount(opt.id, entries, occurrence);
          if (stepControl) {
            return (
              <StepRow
                key={opt.id}
                opt={opt}
                count={count}
                onChange={(v) => onChangeCount(opt.id, v)}
              />
            );
          }
          return (
            <CheckRow
              key={opt.id}
              opt={opt}
              checked={count > 0}
              onToggle={(next) => onChangeCount(opt.id, next ? 1 : 0)}
            />
          );
        })}
      </div>
    </div>
  );
}
