"use client";

import { useState } from "react";
import { Eyebrow } from "@/components/eyebrow";
import type { TipCategory } from "../lib/data";
import { CategoryCard } from "./category-card";

export function TipsView({ categories }: { categories: TipCategory[] }) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() =>
    categories[0] ? { [categories[0].category]: true } : {},
  );

  return (
    <div className="tips-shell">
      <div className="tips-titlerow">
        <div>
          <Eyebrow>Guía compartida</Eyebrow>
          <h1 className="text-h1">Tips</h1>
        </div>
      </div>
      {categories.map((category) => (
        <CategoryCard
          key={category.category}
          category={category}
          expanded={!!expanded[category.category]}
          onToggle={() =>
            setExpanded((prev) => ({
              ...prev,
              [category.category]: !prev[category.category],
            }))
          }
        />
      ))}
    </div>
  );
}
