"use client";

import { ChevronDown } from "lucide-react";
import type { TipCategory } from "../lib/data";
import { categoryMeta } from "../lib/categories";
import { TipMarkdown } from "./tip-markdown";

export function CategoryCard({
  category,
  expanded,
  onToggle,
}: {
  category: TipCategory;
  expanded: boolean;
  onToggle: () => void;
}) {
  const meta = categoryMeta(category.category);
  const Icon = meta.icon;

  return (
    <section className={"tips-section" + (expanded ? "" : " collapsed")}>
      <button
        type="button"
        className="tips-sec-head"
        aria-expanded={expanded}
        onClick={onToggle}
      >
        <span className="tips-sec-icon" aria-hidden>
          <Icon size={18} strokeWidth={1.5} />
        </span>
        <div className="tips-sec-titles">
          <h2>{meta.label}</h2>
        </div>
        <div className="tips-sec-meta">
          <span className="tips-sec-count">{category.tips.length}</span>
          <ChevronDown
            size={18}
            strokeWidth={1.5}
            className="tips-chev"
            aria-hidden
          />
        </div>
      </button>
      <div className={"tips-collapse" + (expanded ? " open" : "")}>
        <div className="tips-collapse-inner">
          <div className="tips-sec-body">
            {category.tips.map((tip) => (
              <article key={tip.id} className="tips-tip">
                <h3>{tip.title}</h3>
                <TipMarkdown body={tip.body} />
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
