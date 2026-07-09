"use client";

import { SECTION_ICON_NAMES, SectionIcon } from "@/components/section-icon";

const ICON_LABEL: Record<(typeof SECTION_ICON_NAMES)[number], string> = {
  sunrise: "Amanecer",
  utensils: "Cubiertos",
  zap: "Rayo",
  moon: "Luna",
  pill: "Pastilla",
  dumbbell: "Pesa",
};

export function IconPicker({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (next: string) => void;
}) {
  return (
    <div className="plan-iconpicker" role="radiogroup" aria-label="Ícono">
      {SECTION_ICON_NAMES.map((name) => (
        <button
          key={name}
          type="button"
          role="radio"
          aria-checked={value === name}
          aria-label={ICON_LABEL[name]}
          className="plan-iconpick"
          onClick={() => onChange(name)}
        >
          <SectionIcon name={name} size={20} />
        </button>
      ))}
    </div>
  );
}
