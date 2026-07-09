"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldHint } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetFooter } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import type { PlanTree } from "../../lib/types";
import { updatePlanMetaAction } from "../../lib/actions";
import { errorMessage, toInt, toText } from "../../lib/form";

function numberDefault(value: number | null): string | undefined {
  return value === null ? undefined : String(value);
}

export function PlanMetaSheet({
  plan,
  open,
  onClose,
}: {
  plan: PlanTree;
  open: boolean;
  onClose: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const fd = new FormData(event.currentTarget);
    startTransition(async () => {
      const result = await updatePlanMetaAction(plan.id, {
        title: String(fd.get("title") ?? ""),
        baseKcal: toInt(fd.get("base_kcal")),
        proteinG: toInt(fd.get("protein_g")),
        carbsG: toInt(fd.get("carbs_g")),
        fatG: toInt(fd.get("fat_g")),
        notes: toText(fd.get("notes")),
        tags: String(fd.get("tags") ?? "")
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      });
      if (result?.error) {
        setError(errorMessage(result.error));
        return;
      }
      onClose();
    });
  }

  return (
    <Sheet open={open} onClose={onClose} title="Editar plan">
      <form onSubmit={handleSubmit}>
        <div className="ui-sheet-content">
          <Field>
            <Label htmlFor="meta-title">Título</Label>
            <Input
              id="meta-title"
              name="title"
              required
              defaultValue={plan.title}
            />
          </Field>
          <Field>
            <Label htmlFor="meta-kcal">
              kcal base <span className="text-faint">(por día)</span>
            </Label>
            <Input
              id="meta-kcal"
              name="base_kcal"
              inputMode="numeric"
              placeholder="0"
              className="font-mono"
              defaultValue={numberDefault(plan.baseKcal)}
            />
          </Field>
          <div className="grid grid-cols-3 gap-3">
            <Field>
              <Label htmlFor="meta-protein">
                Proteína <span className="text-faint">(g)</span>
              </Label>
              <Input
                id="meta-protein"
                name="protein_g"
                inputMode="numeric"
                placeholder="0"
                className="font-mono"
                defaultValue={numberDefault(plan.proteinG)}
              />
            </Field>
            <Field>
              <Label htmlFor="meta-carbs">
                Carbos <span className="text-faint">(g)</span>
              </Label>
              <Input
                id="meta-carbs"
                name="carbs_g"
                inputMode="numeric"
                placeholder="0"
                className="font-mono"
                defaultValue={numberDefault(plan.carbsG)}
              />
            </Field>
            <Field>
              <Label htmlFor="meta-fat">
                Grasa <span className="text-faint">(g)</span>
              </Label>
              <Input
                id="meta-fat"
                name="fat_g"
                inputMode="numeric"
                placeholder="0"
                className="font-mono"
                defaultValue={numberDefault(plan.fatG)}
              />
            </Field>
          </div>
          <Field>
            <Label htmlFor="meta-tags">Tags</Label>
            <Input
              id="meta-tags"
              name="tags"
              placeholder="volumen, sin lácteos"
              defaultValue={plan.tags.join(", ")}
            />
            <FieldHint>Separados por comas.</FieldHint>
          </Field>
          <Field>
            <Label htmlFor="meta-notes">Notas</Label>
            <Textarea
              id="meta-notes"
              name="notes"
              rows={3}
              placeholder="Indicaciones generales del plan…"
              defaultValue={plan.notes ?? ""}
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
