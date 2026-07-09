import { loadPlanTree } from "./lib/data";
import { PlanEmptyState } from "./components/empty-state";
import { PlanView } from "./components/plan-view";

export const dynamic = "force-dynamic";

export default async function PlanPage() {
  const plan = await loadPlanTree();
  if (!plan) return <PlanEmptyState />;
  return <PlanView plan={plan} initialEditMode={plan.sections.length === 0} />;
}
