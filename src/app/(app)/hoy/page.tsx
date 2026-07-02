import { Card } from "@/components/ui/card";
import { TodayDate } from "@/components/today-date";
import { HoyView } from "./components/hoy-view";
import { loadDayLog, loadPlanForDay, toIsoDate } from "./lib/data";

export const dynamic = "force-dynamic";

export default async function HoyPage() {
  const plan = await loadPlanForDay();
  const isoDate = toIsoDate(new Date());

  if (!plan) {
    return (
      <div className="hoy-shell">
        <div className="hoy-titlerow">
          <div>
            <span className="text-eyebrow">
              <span className="hoy-dash">— </span>
              <TodayDate />
            </span>
            <h1 className="text-h1">Hoy</h1>
          </div>
        </div>
        <Card>
          <p className="text-muted">
            Aún no tienes un plan activo. Cuando lo cargues, verás aquí las
            secciones del día para marcar lo que comes.
          </p>
        </Card>
      </div>
    );
  }

  const dayLog = await loadDayLog(isoDate);

  return <HoyView plan={plan} dayLog={dayLog} isoDate={isoDate} />;
}
