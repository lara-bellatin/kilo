import { Eyebrow } from "@/components/eyebrow";
import type { PlanGroup } from "../lib/types";
import { OptionRow } from "./option-row";

export function GroupBlock({ group }: { group: PlanGroup }) {
  return (
    <div className="plan-group">
      <div className="plan-group-head">
        <Eyebrow>
          {group.label.toLowerCase()} · escoge{" "}
          <span className="n">{group.pickCount}</span>
        </Eyebrow>
      </div>
      <div className="plan-opts">
        {group.options.map((option) => (
          <OptionRow key={option.id} option={option} />
        ))}
      </div>
    </div>
  );
}
