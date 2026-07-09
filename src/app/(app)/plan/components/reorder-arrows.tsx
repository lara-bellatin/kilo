"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";

export function ReorderArrows({
  label,
  canUp,
  canDown,
  onMove,
}: {
  label: string;
  canUp: boolean;
  canDown: boolean;
  onMove: (dir: -1 | 1) => void;
}) {
  return (
    <span className="plan-reorder">
      <IconButton
        aria-label={`Subir ${label}`}
        disabled={!canUp}
        onClick={() => onMove(-1)}
        className="h-11 w-11"
      >
        <ChevronUp size={18} strokeWidth={1.5} />
      </IconButton>
      <IconButton
        aria-label={`Bajar ${label}`}
        disabled={!canDown}
        onClick={() => onMove(1)}
        className="h-11 w-11"
      >
        <ChevronDown size={18} strokeWidth={1.5} />
      </IconButton>
    </span>
  );
}
