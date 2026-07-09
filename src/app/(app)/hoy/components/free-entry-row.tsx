"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import type { FoodUnit, FreeEntry } from "../lib/types";
import { formatComponent } from "@/lib/food-format";
import { FreeEntryForm, type FreeEntryDraft } from "./free-entry-form";

function summary(entry: FreeEntry): string | null {
  if (entry.quantity != null && entry.unit) {
    return formatComponent(entry.quantity, entry.unit as FoodUnit);
  }
  return null;
}

export function FreeEntryRow({
  entry,
  onUpdate,
  onDelete,
}: {
  entry: FreeEntry;
  onUpdate: (id: string, draft: FreeEntryDraft) => void;
  onDelete: (id: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const qty = summary(entry);

  if (editing) {
    return (
      <div className="hoy-free-row is-editing">
        <FreeEntryForm
          initial={{
            description: entry.description,
            quantity: entry.quantity,
            unit: entry.unit,
            notes: entry.notes,
          }}
          submitLabel="Actualizar"
          onSubmit={(draft) => {
            setEditing(false);
            onUpdate(entry.id, draft);
          }}
          onCancel={() => setEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="hoy-free-row">
      <span className="hoy-free-icon" aria-hidden>
        <Pencil size={14} strokeWidth={1.75} />
      </span>
      <div className="hoy-free-body">
        <span className="hoy-free-desc">
          {qty ? <span className="qty">{qty}</span> : null}
          {qty ? " " : null}
          {entry.description}
        </span>
        {entry.notes ? (
          <span className="hoy-free-notes">{entry.notes}</span>
        ) : null}
      </div>
      <div className="hoy-free-row-actions">
        <button
          type="button"
          className="hoy-free-icon-btn"
          aria-label="Editar"
          onClick={() => setEditing(true)}
        >
          <Pencil size={16} strokeWidth={1.5} />
        </button>
        <button
          type="button"
          className="hoy-free-icon-btn"
          aria-label="Borrar"
          onClick={() => onDelete(entry.id)}
        >
          <Trash2 size={16} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
