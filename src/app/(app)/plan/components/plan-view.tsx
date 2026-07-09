"use client";

import { useOptimistic, useState, useTransition } from "react";
import { Check, Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/eyebrow";
import type { DayType, PlanTree } from "../lib/types";
import {
  reorderGroupsAction,
  reorderOptionsAction,
  reorderSectionsAction,
} from "../lib/actions";
import { PlanHeaderCard } from "./plan-header-card";
import { DayTargetsCard } from "./day-targets-card";
import { PlanSectionCard } from "./section-card";
import { PlanMetaSheet } from "./sheets/plan-meta-sheet";
import { DayTargetSheet } from "./sheets/day-target-sheet";
import { SectionSheet } from "./sheets/section-sheet";
import { GroupSheet } from "./sheets/group-sheet";
import { OptionSheet } from "./sheets/option-sheet";

type ActiveSheet =
  | { kind: "plan-meta" }
  | { kind: "day-target"; dayType: DayType }
  | { kind: "section"; sectionId: string | null }
  | { kind: "group"; sectionId: string; groupId: string | null }
  | { kind: "option"; groupId: string; optionId: string | null }
  | null;

type ReorderPatch =
  | { kind: "sections"; orderedIds: string[] }
  | { kind: "groups"; sectionId: string; orderedIds: string[] }
  | { kind: "options"; groupId: string; orderedIds: string[] };

function reorderList<T extends { id: string }>(
  list: T[],
  orderedIds: string[],
): T[] {
  const byId = new Map(list.map((item) => [item.id, item]));
  const next = orderedIds
    .map((id) => byId.get(id))
    .filter((item): item is T => item !== undefined);
  return next.length === list.length ? next : list;
}

function applyReorderPatch(plan: PlanTree, patch: ReorderPatch): PlanTree {
  if (patch.kind === "sections") {
    return { ...plan, sections: reorderList(plan.sections, patch.orderedIds) };
  }
  if (patch.kind === "groups") {
    return {
      ...plan,
      sections: plan.sections.map((section) =>
        section.id === patch.sectionId
          ? {
              ...section,
              groups: reorderList(section.groups, patch.orderedIds),
            }
          : section,
      ),
    };
  }
  return {
    ...plan,
    sections: plan.sections.map((section) => ({
      ...section,
      groups: section.groups.map((group) =>
        group.id === patch.groupId
          ? { ...group, options: reorderList(group.options, patch.orderedIds) }
          : group,
      ),
    })),
  };
}

function nextSortOrder(items: Array<{ sortOrder: number }>): number {
  return items.reduce((max, item) => Math.max(max, item.sortOrder), -1) + 1;
}

export function PlanView({
  plan,
  initialEditMode = false,
}: {
  plan: PlanTree;
  initialEditMode?: boolean;
}) {
  const [editMode, setEditMode] = useState(initialEditMode);
  const [active, setActive] = useState<ActiveSheet>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [openCount, setOpenCount] = useState(0);
  const [optimisticPlan, applyReorder] = useOptimistic(
    plan,
    applyReorderPatch,
  );
  const [, startTransition] = useTransition();

  function openSheet(next: NonNullable<ActiveSheet>) {
    setActive(next);
    setSheetOpen(true);
    setOpenCount((c) => c + 1);
  }

  function closeSheet() {
    setSheetOpen(false);
  }

  function moveSection(sectionId: string, dir: -1 | 1) {
    const ids = optimisticPlan.sections.map((s) => s.id);
    const from = ids.indexOf(sectionId);
    const to = from + dir;
    if (from < 0 || to < 0 || to >= ids.length) return;
    [ids[from], ids[to]] = [ids[to], ids[from]];
    startTransition(async () => {
      applyReorder({ kind: "sections", orderedIds: ids });
      await reorderSectionsAction(plan.id, ids);
    });
  }

  function moveGroup(sectionId: string, groupId: string, dir: -1 | 1) {
    const section = optimisticPlan.sections.find((s) => s.id === sectionId);
    if (!section) return;
    const ids = section.groups.map((g) => g.id);
    const from = ids.indexOf(groupId);
    const to = from + dir;
    if (from < 0 || to < 0 || to >= ids.length) return;
    [ids[from], ids[to]] = [ids[to], ids[from]];
    startTransition(async () => {
      applyReorder({ kind: "groups", sectionId, orderedIds: ids });
      await reorderGroupsAction(sectionId, ids);
    });
  }

  function moveOption(groupId: string, optionId: string, dir: -1 | 1) {
    const group = optimisticPlan.sections
      .flatMap((s) => s.groups)
      .find((g) => g.id === groupId);
    if (!group) return;
    const ids = group.options.map((o) => o.id);
    const from = ids.indexOf(optionId);
    const to = from + dir;
    if (from < 0 || to < 0 || to >= ids.length) return;
    [ids[from], ids[to]] = [ids[to], ids[from]];
    startTransition(async () => {
      applyReorder({ kind: "options", groupId, orderedIds: ids });
      await reorderOptionsAction(groupId, ids);
    });
  }

  const activeSection =
    active?.kind === "section" && active.sectionId
      ? (plan.sections.find((s) => s.id === active.sectionId) ?? null)
      : null;
  const groupParent =
    active?.kind === "group"
      ? plan.sections.find((s) => s.id === active.sectionId)
      : undefined;
  const activeGroup =
    active?.kind === "group" && active.groupId
      ? (groupParent?.groups.find((g) => g.id === active.groupId) ?? null)
      : null;
  const optionParent =
    active?.kind === "option"
      ? plan.sections
          .flatMap((s) => s.groups)
          .find((g) => g.id === active.groupId)
      : undefined;
  const activeOption =
    active?.kind === "option" && active.optionId
      ? (optionParent?.options.find((o) => o.id === active.optionId) ?? null)
      : null;

  return (
    <div className="plan-shell">
      <div className="plan-titlerow">
        <div>
          <Eyebrow>Plan</Eyebrow>
          <h1 className="text-h1">{plan.title}</h1>
        </div>
        <Button
          variant={editMode ? "primary" : "ghost"}
          onClick={() => setEditMode((v) => !v)}
        >
          {editMode ? (
            <>
              <Check size={16} strokeWidth={1.5} aria-hidden />
              Listo
            </>
          ) : (
            <>
              <Pencil size={16} strokeWidth={1.5} aria-hidden />
              Editar
            </>
          )}
        </Button>
      </div>

      <PlanHeaderCard
        plan={plan}
        onEdit={editMode ? () => openSheet({ kind: "plan-meta" }) : undefined}
      />
      <DayTargetsCard
        plan={plan}
        onEditDay={
          editMode
            ? (dayType) => openSheet({ kind: "day-target", dayType })
            : undefined
        }
      />

      {optimisticPlan.sections.map((section, index) => (
        <PlanSectionCard
          key={section.id}
          section={section}
          editing={
            editMode
              ? {
                  onEdit: () =>
                    openSheet({ kind: "section", sectionId: section.id }),
                  canUp: index > 0,
                  canDown: index < optimisticPlan.sections.length - 1,
                  onMove: (dir) => moveSection(section.id, dir),
                  onAddGroup: () =>
                    openSheet({
                      kind: "group",
                      sectionId: section.id,
                      groupId: null,
                    }),
                  onEditGroup: (groupId) =>
                    openSheet({ kind: "group", sectionId: section.id, groupId }),
                  onMoveGroup: (groupId, dir) =>
                    moveGroup(section.id, groupId, dir),
                  onAddOption: (groupId) =>
                    openSheet({ kind: "option", groupId, optionId: null }),
                  onEditOption: (groupId, optionId) =>
                    openSheet({ kind: "option", groupId, optionId }),
                  onMoveOption: moveOption,
                }
              : undefined
          }
        />
      ))}

      {editMode ? (
        <button
          type="button"
          className="plan-add-btn"
          onClick={() => openSheet({ kind: "section", sectionId: null })}
        >
          <Plus size={16} strokeWidth={1.5} aria-hidden />
          Agregar sección
        </button>
      ) : null}

      {active?.kind === "plan-meta" ? (
        <PlanMetaSheet
          key={openCount}
          plan={plan}
          open={sheetOpen}
          onClose={closeSheet}
        />
      ) : null}
      {active?.kind === "day-target" ? (
        <DayTargetSheet
          key={openCount}
          plan={plan}
          dayType={active.dayType}
          open={sheetOpen}
          onClose={closeSheet}
        />
      ) : null}
      {active?.kind === "section" ? (
        <SectionSheet
          key={openCount}
          planId={plan.id}
          section={activeSection}
          nextSortOrder={nextSortOrder(plan.sections)}
          open={sheetOpen}
          onClose={closeSheet}
        />
      ) : null}
      {active?.kind === "group" && groupParent ? (
        <GroupSheet
          key={openCount}
          sectionId={groupParent.id}
          group={activeGroup}
          nextSortOrder={nextSortOrder(groupParent.groups)}
          open={sheetOpen}
          onClose={closeSheet}
        />
      ) : null}
      {active?.kind === "option" && optionParent ? (
        <OptionSheet
          key={openCount}
          groupId={optionParent.id}
          option={activeOption}
          nextSortOrder={nextSortOrder(optionParent.options)}
          open={sheetOpen}
          onClose={closeSheet}
        />
      ) : null}
    </div>
  );
}
