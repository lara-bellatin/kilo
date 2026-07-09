import { Pencil } from "lucide-react";
import { optionName, optionSubnote, primaryQty } from "@/lib/food-format";
import type { PlanOption } from "../lib/types";
import { ReorderArrows } from "./reorder-arrows";

export type OptionEditProps = {
  onEdit: () => void;
  canUp: boolean;
  canDown: boolean;
  onMove: (dir: -1 | 1) => void;
};

export function OptionRow({
  option,
  editing,
}: {
  option: PlanOption;
  editing?: OptionEditProps;
}) {
  const qty = primaryQty(option);
  const name = optionName(option);
  const note = optionSubnote(option);

  const label = (
    <span className="plan-opt-label">
      {qty ? (
        <>
          <span className="qty">{qty}</span>{" "}
        </>
      ) : null}
      {name}
      {note ? <span className="plan-opt-note">{note}</span> : null}
    </span>
  );

  if (editing) {
    return (
      <div className="plan-opt">
        <button
          type="button"
          className="plan-opt-btn"
          onClick={editing.onEdit}
          aria-label={`Editar opción ${name}`}
        >
          {label}
          <Pencil
            size={14}
            strokeWidth={1.5}
            className="plan-row-pencil"
            aria-hidden
          />
        </button>
        <ReorderArrows
          label={`opción ${name}`}
          canUp={editing.canUp}
          canDown={editing.canDown}
          onMove={editing.onMove}
        />
      </div>
    );
  }

  return <div className="plan-opt">{label}</div>;
}
