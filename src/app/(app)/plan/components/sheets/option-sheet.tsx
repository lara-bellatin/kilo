"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldHint } from "@/components/ui/field";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Sheet, SheetFooter } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { UNIT_LABELS } from "@/lib/food-format";
import type { FoodUnit, PlanOption, WeightBasis } from "../../lib/types";
import { FOOD_UNITS, WEIGHT_BASES } from "../../lib/types";
import {
  createOptionAction,
  deactivateOptionAction,
  updateOptionAction,
  type ComponentDraft,
} from "../../lib/actions";
import { errorMessage, toText } from "../../lib/form";

type ComponentField = {
  key: string;
  quantity: string;
  unit: FoodUnit;
  description: string;
  weightBasis: "" | WeightBasis;
};

function emptyComponent(): ComponentField {
  return {
    key: crypto.randomUUID(),
    quantity: "",
    unit: "g",
    description: "",
    weightBasis: "",
  };
}

function fromOption(option: PlanOption): ComponentField[] {
  if (option.components.length === 0) return [emptyComponent()];
  return option.components.map((c) => ({
    key: c.id,
    quantity: String(c.quantity).replace(".", ","),
    unit: c.unit,
    description: c.description,
    weightBasis: c.weight_basis ?? "",
  }));
}

function toDraft(field: ComponentField): ComponentDraft {
  const raw = field.quantity.trim().replace(",", ".");
  const quantity = raw ? Number(raw) : null;
  return {
    quantity: quantity !== null && Number.isFinite(quantity) ? quantity : null,
    unit: field.unit,
    description: field.description,
    weightBasis: field.weightBasis === "" ? null : field.weightBasis,
  };
}

export function OptionSheet({
  groupId,
  option,
  nextSortOrder,
  open,
  onClose,
}: {
  groupId: string;
  /** null = crear opción nueva */
  option: PlanOption | null;
  nextSortOrder: number;
  open: boolean;
  onClose: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [components, setComponents] = useState<ComponentField[]>(
    option ? fromOption(option) : [emptyComponent()],
  );

  function patchComponent(key: string, patch: Partial<ComponentField>) {
    setComponents((prev) =>
      prev.map((c) => (c.key === key ? { ...c, ...patch } : c)),
    );
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const fd = new FormData(event.currentTarget);
    const draft = {
      label: toText(fd.get("label")),
      notes: toText(fd.get("notes")),
      components: components.map(toDraft),
    };
    startTransition(async () => {
      const result = option
        ? await updateOptionAction(option.id, draft)
        : await createOptionAction(groupId, draft, nextSortOrder);
      if (result?.error) {
        setError(errorMessage(result.error));
        return;
      }
      onClose();
    });
  }

  function handleDelete() {
    if (!option) return;
    if (!confirm("¿Eliminar esta opción? Se ocultará del plan; tu historial no cambia."))
      return;
    setError(null);
    setDeleting(true);
    startTransition(async () => {
      const result = await deactivateOptionAction(option.id);
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
      title={option ? "Editar opción" : "Nueva opción"}
    >
      <form onSubmit={handleSubmit}>
        <div className="ui-sheet-content">
          <Field>
            <Label>Componentes</Label>
            <div className="plan-comps">
              {components.map((component, index) => (
                <div key={component.key} className="plan-comp">
                  <div className="plan-comp-toprow">
                    <Input
                      aria-label={`Descripción del componente ${index + 1}`}
                      placeholder="Arroz cocido"
                      value={component.description}
                      onChange={(e) =>
                        patchComponent(component.key, {
                          description: e.target.value,
                        })
                      }
                    />
                    {components.length > 1 ? (
                      <IconButton
                        aria-label={`Quitar componente ${index + 1}`}
                        onClick={() =>
                          setComponents((prev) =>
                            prev.filter((c) => c.key !== component.key),
                          )
                        }
                      >
                        <X size={16} strokeWidth={1.5} />
                      </IconButton>
                    ) : null}
                  </div>
                  <div className="plan-comp-qtyrow">
                    <Input
                      aria-label={`Cantidad del componente ${index + 1}`}
                      inputMode="decimal"
                      placeholder="0"
                      className="plan-comp-qty font-mono"
                      value={component.quantity}
                      onChange={(e) =>
                        patchComponent(component.key, {
                          quantity: e.target.value,
                        })
                      }
                    />
                    <Select
                      aria-label={`Unidad del componente ${index + 1}`}
                      value={component.unit}
                      onChange={(e) =>
                        patchComponent(component.key, {
                          unit: e.target.value as FoodUnit,
                        })
                      }
                    >
                      {FOOD_UNITS.map((unit) => (
                        <option key={unit} value={unit}>
                          {UNIT_LABELS[unit]}
                        </option>
                      ))}
                    </Select>
                    <Select
                      aria-label={`Peso del componente ${index + 1}`}
                      value={component.weightBasis}
                      onChange={(e) =>
                        patchComponent(component.key, {
                          weightBasis: e.target.value as "" | WeightBasis,
                        })
                      }
                    >
                      <option value="">peso —</option>
                      {WEIGHT_BASES.map((basis) => (
                        <option key={basis} value={basis}>
                          {basis}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="plan-add-btn plan-add-btn--inline"
              onClick={() =>
                setComponents((prev) => [...prev, emptyComponent()])
              }
            >
              <Plus size={16} strokeWidth={1.5} aria-hidden />
              Agregar componente
            </button>
          </Field>
          <Field>
            <Label htmlFor="option-label">Nombre</Label>
            <Input
              id="option-label"
              name="label"
              placeholder="Bowl de arroz"
              defaultValue={option?.label ?? ""}
            />
            <FieldHint>
              Opcional — si queda vacío se muestra el primer componente.
            </FieldHint>
          </Field>
          <Field>
            <Label htmlFor="option-notes">Notas</Label>
            <Textarea
              id="option-notes"
              name="notes"
              rows={2}
              placeholder="Sin aceite, a la plancha…"
              defaultValue={option?.notes ?? ""}
            />
          </Field>
          <FieldError>{error}</FieldError>
        </div>
        <SheetFooter>
          {option ? (
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
