"use client";

import { Eyebrow } from "@/components/eyebrow";
import type { PlanTree } from "../lib/types";
import { PlanHeaderCard } from "./plan-header-card";
import { DayTargetsCard } from "./day-targets-card";
import { PlanSectionCard } from "./section-card";

export function PlanView({ plan }: { plan: PlanTree }) {
  return (
    <div className="plan-shell">
      <div className="plan-titlerow">
        <div>
          <Eyebrow>Plan</Eyebrow>
          <h1 className="text-h1">{plan.title}</h1>
        </div>
      </div>
      <PlanHeaderCard plan={plan} />
      <DayTargetsCard plan={plan} />
      {plan.sections.map((section) => (
        <PlanSectionCard key={section.id} section={section} />
      ))}
    </div>
  );
}
