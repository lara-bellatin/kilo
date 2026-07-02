"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import type { FreeEntry } from "../lib/types";
import { FreeEntryForm, type FreeEntryDraft } from "./free-entry-form";
import { FreeEntryRow } from "./free-entry-row";

export function FreeEntries({
  entries,
  onCreate,
  onUpdate,
  onDelete,
  addLabel = "Fuera del plan",
}: {
  entries: FreeEntry[];
  onCreate: (draft: FreeEntryDraft) => void;
  onUpdate: (id: string, draft: FreeEntryDraft) => void;
  onDelete: (id: string) => void;
  addLabel?: string;
}) {
  const [adding, setAdding] = useState(false);

  return (
    <div className="hoy-free-list">
      {entries.map((entry) => (
        <FreeEntryRow
          key={entry.id}
          entry={entry}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
      {adding ? (
        <div className="hoy-free-row is-editing">
          <FreeEntryForm
            onSubmit={(draft) => {
              setAdding(false);
              onCreate(draft);
            }}
            onCancel={() => setAdding(false)}
          />
        </div>
      ) : (
        <button
          type="button"
          className="hoy-free-add"
          onClick={() => setAdding(true)}
        >
          <Plus size={16} strokeWidth={1.75} aria-hidden />
          {addLabel}
        </button>
      )}
    </div>
  );
}
