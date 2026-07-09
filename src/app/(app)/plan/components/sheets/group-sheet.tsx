"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldHint } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetFooter } from "@/components/ui/sheet";
import type { PlanGroup } from "../../lib/types";
import {
  createGroupAction,
  deleteGroupAction,
  updateGroupAction,
} from "../../lib/actions";
import { errorMessage, toInt } from "../../lib/form";

export function GroupSheet({
  sectionId,
  group,
  nextSortOrder,
  open,
  onClose,
}: {
  sectionId: string;
  /** null = crear grupo nuevo */
  group: PlanGroup | null;
  nextSortOrder: number;
  open: boolean;
  onClose: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const fd = new FormData(event.currentTarget);
    const draft = {
      label: String(fd.get("label") ?? ""),
      pickCount: toInt(fd.get("pick_count")),
    };
    startTransition(async () => {
      const result = group
        ? await updateGroupAction(group.id, draft)
        : await createGroupAction(sectionId, draft, nextSortOrder);
      if (result?.error) {
        setError(errorMessage(result.error));
        return;
      }
      onClose();
    });
  }

  function handleDelete() {
    if (!group) return;
    if (!confirm(`¿Eliminar el grupo "${group.label}" y sus opciones?`)) return;
    setError(null);
    setDeleting(true);
    startTransition(async () => {
      const result = await deleteGroupAction(group.id);
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
      title={group ? "Editar grupo" : "Nuevo grupo"}
    >
      <form onSubmit={handleSubmit}>
        <div className="ui-sheet-content">
          <Field>
            <Label htmlFor="group-label">Nombre</Label>
            <Input
              id="group-label"
              name="label"
              required
              placeholder="Proteína"
              defaultValue={group?.label}
            />
          </Field>
          <Field>
            <Label htmlFor="group-pick">Escoge</Label>
            <Input
              id="group-pick"
              name="pick_count"
              inputMode="numeric"
              placeholder="1"
              className="font-mono"
              defaultValue={group ? String(group.pickCount) : undefined}
            />
            <FieldHint>
              Cuántas opciones de este grupo van en cada comida.
            </FieldHint>
          </Field>
          <FieldError>{error}</FieldError>
        </div>
        <SheetFooter>
          {group ? (
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
