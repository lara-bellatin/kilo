import { Info, Pencil, Plus } from "lucide-react";
import { Pill } from "@/components/pill";
import { SectionIcon } from "@/components/section-icon";
import type { PlanSection } from "../lib/types";
import { repeatLabel, visibilityLabel } from "../lib/labels";
import { GroupBlock } from "./group-block";
import { ReorderArrows } from "./reorder-arrows";

export type SectionEditProps = {
  onEdit: () => void;
  canUp: boolean;
  canDown: boolean;
  onMove: (dir: -1 | 1) => void;
  onAddGroup: () => void;
  onEditGroup: (groupId: string) => void;
  onMoveGroup: (groupId: string, dir: -1 | 1) => void;
  onAddOption: (groupId: string) => void;
  onEditOption: (groupId: string, optionId: string) => void;
  onMoveOption: (groupId: string, optionId: string, dir: -1 | 1) => void;
};

export function PlanSectionCard({
  section,
  editing,
}: {
  section: PlanSection;
  editing?: SectionEditProps;
}) {
  const titles = (
    <>
      <span className="plan-sec-icon" aria-hidden>
        <SectionIcon name={section.icon} />
      </span>
      <div className="plan-sec-titles">
        <h2>{section.label}</h2>
      </div>
    </>
  );

  return (
    <section className="plan-section">
      <div className="plan-sec-head">
        {editing ? (
          <>
            <button
              type="button"
              className="plan-sec-headbtn"
              onClick={editing.onEdit}
              aria-label={`Editar sección ${section.label}`}
            >
              {titles}
              <Pencil
                size={16}
                strokeWidth={1.5}
                className="plan-row-pencil"
                aria-hidden
              />
            </button>
            <ReorderArrows
              label={`sección ${section.label}`}
              canUp={editing.canUp}
              canDown={editing.canDown}
              onMove={editing.onMove}
            />
          </>
        ) : (
          <>
            {titles}
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
          </>
        )}
      </div>
      <div className="plan-sec-body">
        {section.notes ? (
          <p className="plan-note">
            <Info size={14} strokeWidth={1.5} aria-hidden />
            <span>{section.notes}</span>
          </p>
        ) : null}
        {section.groups.map((group, index) => (
          <GroupBlock
            key={group.id}
            group={group}
            editing={
              editing
                ? {
                    onEdit: () => editing.onEditGroup(group.id),
                    canUp: index > 0,
                    canDown: index < section.groups.length - 1,
                    onMove: (dir) => editing.onMoveGroup(group.id, dir),
                    onAddOption: () => editing.onAddOption(group.id),
                    onEditOption: (optionId) =>
                      editing.onEditOption(group.id, optionId),
                    onMoveOption: (optionId, dir) =>
                      editing.onMoveOption(group.id, optionId, dir),
                  }
                : undefined
            }
          />
        ))}
        {editing ? (
          <button
            type="button"
            className="plan-add-btn plan-add-btn--inline"
            onClick={editing.onAddGroup}
          >
            <Plus size={16} strokeWidth={1.5} aria-hidden />
            Agregar grupo
          </button>
        ) : null}
      </div>
    </section>
  );
}
