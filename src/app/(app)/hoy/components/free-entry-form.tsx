"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FoodUnit } from "../lib/types";

const UNIT_OPTIONS: { value: FoodUnit; label: string }[] = [
  { value: "g", label: "g" },
  { value: "ml", label: "ml" },
  { value: "unidad", label: "unidad" },
  { value: "porcion", label: "porción" },
  { value: "taza", label: "taza" },
  { value: "cda", label: "cda" },
  { value: "cdta", label: "cdta" },
  { value: "rebanada", label: "rebanada" },
  { value: "lata", label: "lata" },
  { value: "scoop", label: "scoop" },
  { value: "tab", label: "tab" },
];

export type FreeEntryDraft = {
  description: string;
  quantity: number | null;
  unit: FoodUnit | null;
  notes: string | null;
};

export function FreeEntryForm({
  initial,
  submitLabel = "Guardar",
  onSubmit,
  onCancel,
  pending,
}: {
  initial?: Partial<FreeEntryDraft>;
  submitLabel?: string;
  onSubmit: (draft: FreeEntryDraft) => void;
  onCancel: () => void;
  pending?: boolean;
}) {
  const [description, setDescription] = useState(initial?.description ?? "");
  const [qtyText, setQtyText] = useState(
    initial?.quantity != null ? String(initial.quantity) : "",
  );
  const [unit, setUnit] = useState<FoodUnit | "">(initial?.unit ?? "");
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [showDetail, setShowDetail] = useState(
    Boolean(initial?.quantity != null || initial?.unit || initial?.notes),
  );

  const canSave = description.trim().length > 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSave) return;
    const qty = qtyText.trim() ? Number(qtyText.replace(",", ".")) : NaN;
    onSubmit({
      description: description.trim(),
      quantity: Number.isFinite(qty) && qty > 0 ? qty : null,
      unit: unit || null,
      notes: notes.trim() || null,
    });
  }

  return (
    <form className="hoy-free-form" onSubmit={handleSubmit}>
      <input
        autoFocus
        type="text"
        className="hoy-free-input"
        placeholder="¿Qué comiste? (ej. fideos con ragú)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        aria-label="Descripción"
      />

      {showDetail ? (
        <div className="hoy-free-detail">
          <div className="hoy-free-qtyrow">
            <input
              type="text"
              inputMode="decimal"
              className="hoy-free-input hoy-free-qty"
              placeholder="cantidad"
              value={qtyText}
              onChange={(e) => setQtyText(e.target.value)}
              aria-label="Cantidad"
            />
            <select
              className="hoy-free-input hoy-free-unit"
              value={unit}
              onChange={(e) => setUnit(e.target.value as FoodUnit | "")}
              aria-label="Unidad"
            >
              <option value="">—</option>
              {UNIT_OPTIONS.map((u) => (
                <option key={u.value} value={u.value}>
                  {u.label}
                </option>
              ))}
            </select>
          </div>
          <input
            type="text"
            className="hoy-free-input"
            placeholder="notas (opcional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            aria-label="Notas"
          />
        </div>
      ) : (
        <button
          type="button"
          className="hoy-free-detail-toggle"
          onClick={() => setShowDetail(true)}
        >
          <ChevronDown size={14} strokeWidth={1.75} aria-hidden />
          agregar detalle
        </button>
      )}

      <div className="hoy-free-actions">
        <button
          type="button"
          className="hoy-free-btn ghost"
          onClick={onCancel}
          disabled={pending}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="hoy-free-btn primary"
          disabled={!canSave || pending}
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
