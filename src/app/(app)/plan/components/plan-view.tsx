"use client";

import { useState } from "react";
import { Check, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/eyebrow";
import type { DayType, PlanTree } from "../lib/types";
import { PlanHeaderCard } from "./plan-header-card";
import { DayTargetsCard } from "./day-targets-card";
import { PlanSectionCard } from "./section-card";
import { PlanMetaSheet } from "./sheets/plan-meta-sheet";
import { DayTargetSheet } from "./sheets/day-target-sheet";

type ActiveSheet =
  | { kind: "plan-meta" }
  | { kind: "day-target"; dayType: DayType }
  | null;

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

  function openSheet(next: NonNullable<ActiveSheet>) {
    setActive(next);
    setSheetOpen(true);
    setOpenCount((c) => c + 1);
  }

  function closeSheet() {
    setSheetOpen(false);
  }

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
      {plan.sections.map((section) => (
        <PlanSectionCard key={section.id} section={section} />
      ))}

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
    </div>
  );
}
