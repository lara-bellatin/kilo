"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetFooter } from "@/components/ui/sheet";
import { createPlanAction } from "../../lib/actions";
import { errorMessage, toInt } from "../../lib/form";

export function CreatePlanSheet({
  open,
  onClose,
}: {
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
      const result = await createPlanAction({
        title: String(fd.get("title") ?? ""),
        baseKcal: toInt(fd.get("base_kcal")),
        proteinG: toInt(fd.get("protein_g")),
        carbsG: toInt(fd.get("carbs_g")),
        fatG: toInt(fd.get("fat_g")),
      });
      if (result?.error) {
        setError(errorMessage(result.error));
        return;
      }
      onClose();
    });
  }

  return (
    <Sheet open={open} onClose={onClose} title="Crear plan">
      <form onSubmit={handleSubmit}>
        <div className="ui-sheet-content">
          <Field>
            <Label htmlFor="create-title">Título</Label>
            <Input
              id="create-title"
              name="title"
              required
              placeholder="Plan de alimentación"
            />
          </Field>
          <Field>
            <Label htmlFor="create-kcal">
              kcal base <span className="text-faint">(por día)</span>
            </Label>
            <Input
              id="create-kcal"
              name="base_kcal"
              inputMode="numeric"
              placeholder="0"
              className="font-mono"
            />
          </Field>
          <div className="grid grid-cols-3 gap-3">
            <Field>
              <Label htmlFor="create-protein">
                Proteína <span className="text-faint">(g)</span>
              </Label>
              <Input
                id="create-protein"
                name="protein_g"
                inputMode="numeric"
                placeholder="0"
                className="font-mono"
              />
            </Field>
            <Field>
              <Label htmlFor="create-carbs">
                Carbos <span className="text-faint">(g)</span>
              </Label>
              <Input
                id="create-carbs"
                name="carbs_g"
                inputMode="numeric"
                placeholder="0"
                className="font-mono"
              />
            </Field>
            <Field>
              <Label htmlFor="create-fat">
                Grasa <span className="text-faint">(g)</span>
              </Label>
              <Input
                id="create-fat"
                name="fat_g"
                inputMode="numeric"
                placeholder="0"
                className="font-mono"
              />
            </Field>
          </div>
          <FieldError>{error}</FieldError>
        </div>
        <SheetFooter>
          <Button type="submit" disabled={pending} full>
            {pending ? "Creando…" : "Crear plan"}
          </Button>
        </SheetFooter>
      </form>
    </Sheet>
  );
}
