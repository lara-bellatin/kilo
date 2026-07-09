"use client";

import { useState } from "react";
import { Eyebrow } from "@/components/eyebrow";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CreatePlanSheet } from "./sheets/create-plan-sheet";

export function PlanEmptyState() {
  const [open, setOpen] = useState(false);
  return (
    <div className="plan-shell">
      <div className="plan-titlerow">
        <div>
          <Eyebrow>Plan</Eyebrow>
          <h1 className="text-h1">Plan</h1>
        </div>
      </div>
      <Card className="flex flex-col items-start gap-4">
        <p className="text-muted">
          Aún no tienes un plan. Créalo para ver aquí tu guía de comidas y
          empezar a marcar tus días en Hoy.
        </p>
        <Button variant="accent" onClick={() => setOpen(true)}>
          Crear plan
        </Button>
      </Card>
      <CreatePlanSheet open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
