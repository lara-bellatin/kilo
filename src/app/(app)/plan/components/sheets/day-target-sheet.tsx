"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldHint } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetFooter } from "@/components/ui/sheet";
import type { DayType, PlanTree } from "../../lib/types";
import { DAY_TYPE_LABEL } from "../../lib/types";
import { upsertDayTargetAction } from "../../lib/actions";
import { errorMessage, toDecimal, toInt } from "../../lib/form";

export function DayTargetSheet({
  plan,
  dayType,
  open,
  onClose,
}: {
  plan: PlanTree;
  dayType: DayType;
  open: boolean;
  onClose: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const target = plan.targets[dayType];

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const fd = new FormData(event.currentTarget);
    startTransition(async () => {
      const result = await upsertDayTargetAction(plan.id, dayType, {
        kcalAdjustment: toInt(fd.get("kcal_adjustment")),
        waterLiters: toDecimal(fd.get("water_liters")),
      });
      if (result?.error) {
        setError(errorMessage(result.error));
        return;
      }
      onClose();
    });
  }

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={`Objetivo — ${DAY_TYPE_LABEL[dayType]}`}
    >
      <form onSubmit={handleSubmit}>
        <div className="ui-sheet-content">
          <Field>
            <Label htmlFor="target-adjustment">
              Ajuste de kcal <span className="text-faint">(±)</span>
            </Label>
            <Input
              id="target-adjustment"
              name="kcal_adjustment"
              inputMode="numeric"
              placeholder="0"
              className="font-mono"
              defaultValue={
                target.kcalAdjustment !== 0
                  ? String(target.kcalAdjustment)
                  : undefined
              }
            />
            <FieldHint>
              Se suma a las kcal base del plan en días de{" "}
              {DAY_TYPE_LABEL[dayType].toLowerCase()}.
            </FieldHint>
          </Field>
          <Field>
            <Label htmlFor="target-water">
              Agua <span className="text-faint">(L)</span>
            </Label>
            <Input
              id="target-water"
              name="water_liters"
              inputMode="decimal"
              placeholder="0,0"
              className="font-mono"
              defaultValue={
                target.waterLiters !== null
                  ? String(target.waterLiters).replace(".", ",")
                  : undefined
              }
            />
          </Field>
          <FieldError>{error}</FieldError>
        </div>
        <SheetFooter>
          <Button type="submit" disabled={pending} full>
            {pending ? "Guardando…" : "Guardar"}
          </Button>
        </SheetFooter>
      </form>
    </Sheet>
  );
}
