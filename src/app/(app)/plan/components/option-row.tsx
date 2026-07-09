import { optionName, optionSubnote, primaryQty } from "@/lib/food-format";
import type { PlanOption } from "../lib/types";

export function OptionRow({ option }: { option: PlanOption }) {
  const qty = primaryQty(option);
  const name = optionName(option);
  const note = optionSubnote(option);
  return (
    <div className="plan-opt">
      <span className="plan-opt-label">
        {qty ? (
          <>
            <span className="qty">{qty}</span>{" "}
          </>
        ) : null}
        {name}
        {note ? <span className="plan-opt-note">{note}</span> : null}
      </span>
    </div>
  );
}
