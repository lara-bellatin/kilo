import { Pencil } from "lucide-react";
import { Eyebrow } from "@/components/eyebrow";
import type { PlanGroup } from "../lib/types";
import { OptionRow } from "./option-row";
import { ReorderArrows } from "./reorder-arrows";

export type GroupEditProps = {
  onEdit: () => void;
  canUp: boolean;
  canDown: boolean;
  onMove: (dir: -1 | 1) => void;
};

export function GroupBlock({
  group,
  editing,
}: {
  group: PlanGroup;
  editing?: GroupEditProps;
}) {
  const eyebrow = (
    <Eyebrow>
      {group.label.toLowerCase()} · escoge{" "}
      <span className="n">{group.pickCount}</span>
    </Eyebrow>
  );

  return (
    <div className="plan-group">
      <div className="plan-group-head">
        {editing ? (
          <>
            <button
              type="button"
              className="plan-group-headbtn"
              onClick={editing.onEdit}
              aria-label={`Editar grupo ${group.label}`}
            >
              {eyebrow}
              <Pencil
                size={14}
                strokeWidth={1.5}
                className="plan-row-pencil"
                aria-hidden
              />
            </button>
            <ReorderArrows
              label={`grupo ${group.label}`}
              canUp={editing.canUp}
              canDown={editing.canDown}
              onMove={editing.onMove}
            />
          </>
        ) : (
          eyebrow
        )}
      </div>
      <div className="plan-opts">
        {group.options.map((option) => (
          <OptionRow key={option.id} option={option} />
        ))}
      </div>
    </div>
  );
}
