import { Pencil, Plus } from "lucide-react";
import { Eyebrow } from "@/components/eyebrow";
import type { PlanGroup } from "../lib/types";
import { OptionRow } from "./option-row";
import { ReorderArrows } from "./reorder-arrows";

export type GroupEditProps = {
  onEdit: () => void;
  canUp: boolean;
  canDown: boolean;
  onMove: (dir: -1 | 1) => void;
  onAddOption: () => void;
  onEditOption: (optionId: string) => void;
  onMoveOption: (optionId: string, dir: -1 | 1) => void;
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
        {group.options.map((option, index) => (
          <OptionRow
            key={option.id}
            option={option}
            editing={
              editing
                ? {
                    onEdit: () => editing.onEditOption(option.id),
                    canUp: index > 0,
                    canDown: index < group.options.length - 1,
                    onMove: (dir) => editing.onMoveOption(option.id, dir),
                  }
                : undefined
            }
          />
        ))}
      </div>
      {editing ? (
        <button
          type="button"
          className="plan-add-btn plan-add-btn--inline plan-add-btn--sm"
          onClick={editing.onAddOption}
        >
          <Plus size={16} strokeWidth={1.5} aria-hidden />
          Agregar opción
        </button>
      ) : null}
    </div>
  );
}
