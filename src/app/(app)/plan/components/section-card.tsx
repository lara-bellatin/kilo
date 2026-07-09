import { Info } from "lucide-react";
import { Pill } from "@/components/pill";
import { SectionIcon } from "@/components/section-icon";
import type { PlanSection } from "../lib/types";
import { repeatLabel, visibilityLabel } from "../lib/labels";
import { GroupBlock } from "./group-block";

export function PlanSectionCard({ section }: { section: PlanSection }) {
  return (
    <section className="plan-section">
      <div className="plan-sec-head">
        <span className="plan-sec-icon" aria-hidden>
          <SectionIcon name={section.icon} />
        </span>
        <div className="plan-sec-titles">
          <h2>{section.label}</h2>
        </div>
        <div className="plan-sec-meta">
          {section.sectionType === "suplemento" ? (
            <Pill>suplemento</Pill>
          ) : null}
          {section.visibleWhen ? (
            <Pill>{visibilityLabel(section.visibleWhen)}</Pill>
          ) : null}
          {section.repeatWhen ? (
            <Pill>{repeatLabel(section.repeatWhen)}</Pill>
          ) : null}
        </div>
      </div>
      <div className="plan-sec-body">
        {section.notes ? (
          <p className="plan-note">
            <Info size={14} strokeWidth={1.5} aria-hidden />
            <span>{section.notes}</span>
          </p>
        ) : null}
        {section.groups.map((group) => (
          <GroupBlock key={group.id} group={group} />
        ))}
      </div>
    </section>
  );
}
