"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Field } from "@/components/ui/field";
import {
  GIRTH_KEYS,
  GIRTH_LABEL,
  SKINFOLD_KEYS,
  SKINFOLD_LABEL,
  emptyDraft,
  type GirthKey,
  type MeasurementDraft,
} from "../lib/types";
import {
  createMeasurementAction,
  deleteMeasurementAction,
  updateHeightAction,
  updateMeasurementAction,
} from "../lib/actions";

type Mode = { kind: "create" } | { kind: "edit"; id: string };

function toNumber(raw: string): number | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const n = Number(trimmed.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

function numberInputProps(value: number | null): { defaultValue?: string } {
  if (value === null || value === undefined) return {};
  return { defaultValue: String(value).replace(".", ",") };
}

export function MeasurementForm({
  mode,
  initial,
  heightCm,
}: {
  mode: Mode;
  initial: MeasurementDraft;
  heightCm: number | null;
}) {
  const [pending, startTransition] = useTransition();
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function readDraft(form: HTMLFormElement): MeasurementDraft {
    const fd = new FormData(form);
    const draft = emptyDraft(String(fd.get("measured_at") ?? initial.measuredAt));
    draft.weightKg = toNumber(String(fd.get("weight_kg") ?? ""));
    for (const k of SKINFOLD_KEYS) {
      draft.skinfolds[k] = toNumber(String(fd.get(k) ?? ""));
    }
    for (const k of GIRTH_KEYS) {
      draft.girths[k] = toNumber(String(fd.get(k) ?? ""));
    }
    draft.notes = String(fd.get("notes") ?? "").trim() || null;
    return draft;
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const form = event.currentTarget;
    const draft = readDraft(form);
    const heightRaw = new FormData(form).get("height_cm");
    const heightValue = toNumber(String(heightRaw ?? ""));

    startTransition(async () => {
      try {
        if (heightValue !== heightCm) {
          await updateHeightAction(heightValue);
        }
        if (mode.kind === "create") {
          await createMeasurementAction(draft);
        } else {
          await updateMeasurementAction(mode.id, draft);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "error");
      }
    });
  }

  function handleDelete() {
    if (mode.kind !== "edit") return;
    if (!confirm("¿Borrar esta medición? No se puede deshacer.")) return;
    setDeleting(true);
    startTransition(async () => {
      try {
        await deleteMeasurementAction(mode.id);
      } catch (e) {
        setDeleting(false);
        setError(e instanceof Error ? e.message : "error");
      }
    });
  }

  const heading = mode.kind === "create" ? "Nueva medición" : "Editar medición";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <span className="text-eyebrow">
            <span className="hoy-dash">— </span>
            Evolución
          </span>
          <h1 className="text-h1">{heading}</h1>
        </div>
        <Link
          href="/evolucion"
          className="font-mono text-xs text-muted hover:text-text"
        >
          Cancelar
        </Link>
      </div>

      <section className="flex flex-col gap-4 rounded-card border border-border bg-surface p-4 sm:p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field>
            <Label htmlFor="measured_at">Fecha</Label>
            <Input
              type="date"
              id="measured_at"
              name="measured_at"
              required
              defaultValue={initial.measuredAt}
              className="font-mono"
            />
          </Field>
          <Field>
            <Label htmlFor="weight_kg">
              Peso <span className="text-faint">(kg)</span>
            </Label>
            <Input
              type="text"
              inputMode="decimal"
              id="weight_kg"
              name="weight_kg"
              placeholder="0,0"
              className="font-mono"
              {...numberInputProps(initial.weightKg)}
            />
          </Field>
          <Field className="sm:col-span-2">
            <Label htmlFor="height_cm">
              Estatura <span className="text-faint">(cm) — usada para IMC</span>
            </Label>
            <Input
              type="text"
              inputMode="decimal"
              id="height_cm"
              name="height_cm"
              placeholder="0"
              className="font-mono"
              {...numberInputProps(heightCm)}
            />
          </Field>
        </div>
      </section>

      <section className="flex flex-col gap-4 rounded-card border border-border bg-surface p-4 sm:p-6">
        <header>
          <span className="text-eyebrow">Pliegues</span>
          <h2 className="text-h2 mt-1">Ocho pliegues ISAK (mm)</h2>
        </header>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {SKINFOLD_KEYS.map((k) => (
            <Field key={k}>
              <Label htmlFor={k}>{SKINFOLD_LABEL[k]}</Label>
              <Input
                type="text"
                inputMode="decimal"
                id={k}
                name={k}
                placeholder="0,0"
                className="font-mono"
                {...numberInputProps(initial.skinfolds[k])}
              />
            </Field>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4 rounded-card border border-border bg-surface p-4 sm:p-6">
        <header>
          <span className="text-eyebrow">Perímetros</span>
          <h2 className="text-h2 mt-1">Circunferencias (cm)</h2>
        </header>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {GIRTH_KEYS.map((k: GirthKey) => (
            <Field key={k}>
              <Label htmlFor={k}>{GIRTH_LABEL[k]}</Label>
              <Input
                type="text"
                inputMode="decimal"
                id={k}
                name={k}
                placeholder="0,0"
                className="font-mono"
                {...numberInputProps(initial.girths[k])}
              />
            </Field>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4 rounded-card border border-border bg-surface p-4 sm:p-6">
        <Field>
          <Label htmlFor="notes">Notas</Label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            defaultValue={initial.notes ?? ""}
            placeholder="Contexto, condiciones, observaciones…"
            className="min-h-24 w-full rounded-input border border-border bg-surface-2 p-3 text-base text-text placeholder:text-faint focus:border-accent focus:outline-none"
          />
        </Field>
      </section>

      {error ? (
        <p className="text-sm text-over">
          Hubo un error al guardar ({error}). Revisa los datos e intenta de
          nuevo.
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={pending}
        >
          {pending
            ? "Guardando…"
            : mode.kind === "create"
              ? "Guardar medición"
              : "Guardar cambios"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="lg"
          onClick={() => history.back()}
        >
          Cancelar
        </Button>
        {mode.kind === "edit" ? (
          <button
            type="button"
            onClick={handleDelete}
            disabled={pending || deleting}
            className="ml-auto inline-flex items-center gap-2 rounded-input border border-border px-4 py-2 font-body text-sm text-over transition-colors hover:bg-over/10 disabled:opacity-50"
          >
            <Trash2 size={16} strokeWidth={1.5} />
            {deleting ? "Borrando…" : "Borrar medición"}
          </button>
        ) : null}
      </div>
    </form>
  );
}
