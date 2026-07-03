import { Card } from "@/components/ui/card";
import { TodayDate } from "@/components/today-date";
import { isValidIsoDate } from "@/lib/date";
import { getTodayIsoDate } from "@/lib/date-server";
import { HoyView } from "./components/hoy-view";
import { loadDayLog, loadPlanForDay } from "./lib/data";

export const dynamic = "force-dynamic";

export default async function HoyPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string | string[] }>;
}) {
  const plan = await loadPlanForDay();
  const today = await getTodayIsoDate();
  const raw = (await searchParams).date;
  const requested = Array.isArray(raw) ? raw[0] : raw;
  const isoDate = requested && isValidIsoDate(requested) ? requested : today;

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

  return (
    <HoyView
      plan={plan}
      dayLog={dayLog}
      isoDate={isoDate}
      todayIsoDate={today}
    />
  );
}
