"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetFooter } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import type { DayType, PlanSection, SectionType } from "../../lib/types";
import {
  createSectionAction,
  deleteSectionAction,
  updateSectionAction,
} from "../../lib/actions";
import { errorMessage, toText } from "../../lib/form";
import { ChipToggle, DayTypePicker } from "../day-type-picker";
import { IconPicker } from "../icon-picker";

export function SectionSheet({
  planId,
  section,
  nextSortOrder,
  open,
  onClose,
}: {
  planId: string;
  /** null = crear sección nueva */
  section: PlanSection | null;
  nextSortOrder: number;
  open: boolean;
  onClose: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sectionType, setSectionType] = useState<SectionType>(
    section?.sectionType ?? "comida",
  );
  const [icon, setIcon] = useState<string | null>(section?.icon ?? "utensils");
  const [visibleWhen, setVisibleWhen] = useState<DayType[]>(
    section?.visibleWhen ?? [],
  );
  const [repeatWhen, setRepeatWhen] = useState<DayType[]>(
    section?.repeatWhen ?? [],
  );

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const fd = new FormData(event.currentTarget);
    const draft = {
      label: String(fd.get("label") ?? ""),
      sectionType,
      icon,
      notes: toText(fd.get("notes")),
      visibleWhen: visibleWhen.length > 0 ? visibleWhen : null,
      repeatWhen: repeatWhen.length > 0 ? repeatWhen : null,
    };
    startTransition(async () => {
      const result = section
        ? await updateSectionAction(section.id, draft)
        : await createSectionAction(planId, draft, nextSortOrder);
      if (result?.error) {
        setError(errorMessage(result.error));
        return;
      }
      onClose();
    });
  }

  function handleDelete() {
    if (!section) return;
    if (!confirm(`¿Eliminar la sección "${section.label}" y todo su contenido?`))
      return;
    setError(null);
    setDeleting(true);
    startTransition(async () => {
      const result = await deleteSectionAction(section.id);
      if (result?.error) {
        setDeleting(false);
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
      title={section ? "Editar sección" : "Nueva sección"}
    >
      <form onSubmit={handleSubmit}>
        <div className="ui-sheet-content">
          <Field>
            <Label htmlFor="section-label">Nombre</Label>
            <Input
              id="section-label"
              name="label"
              required
              placeholder="Desayuno"
              defaultValue={section?.label}
            />
          </Field>
          <Field>
            <Label>Tipo</Label>
            <div className="plan-chips">
              <ChipToggle
                pressed={sectionType === "comida"}
                onToggle={() => setSectionType("comida")}
              >
                Comida
              </ChipToggle>
              <ChipToggle
                pressed={sectionType === "suplemento"}
                onToggle={() => setSectionType("suplemento")}
              >
                Suplemento
              </ChipToggle>
            </div>
          </Field>
          <Field>
            <Label>Ícono</Label>
            <IconPicker value={icon} onChange={setIcon} />
          </Field>
          <DayTypePicker
            legend="¿Cuándo se ve?"
            emptyLabel="Sin selección se ve todos los días."
            value={visibleWhen}
            onChange={setVisibleWhen}
          />
          <DayTypePicker
            legend="¿Se repite?"
            emptyLabel="Sin selección nunca se repite."
            value={repeatWhen}
            onChange={setRepeatWhen}
          />
          <Field>
            <Label htmlFor="section-notes">Notas</Label>
            <Textarea
              id="section-notes"
              name="notes"
              rows={2}
              placeholder="Indicaciones de la sección…"
              defaultValue={section?.notes ?? ""}
            />
          </Field>
          <FieldError>{error}</FieldError>
        </div>
        <SheetFooter>
          {section ? (
            <button
              type="button"
              onClick={handleDelete}
              disabled={pending || deleting}
              className="inline-flex h-11 items-center gap-2 rounded-input border border-border px-4 font-body text-sm text-over transition-colors hover:bg-over/10 disabled:opacity-50"
            >
              <Trash2 size={16} strokeWidth={1.5} aria-hidden />
              {deleting ? "Eliminando…" : "Eliminar"}
            </button>
          ) : null}
          <Button type="submit" disabled={pending} className="flex-1">
            {pending && !deleting ? "Guardando…" : "Guardar"}
          </Button>
        </SheetFooter>
      </form>
    </Sheet>
  );
}
