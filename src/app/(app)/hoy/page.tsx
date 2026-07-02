import { PagePlaceholder } from "../_placeholder";
import { TodayDate } from "@/components/today-date";

export default function HoyPage() {
  return (
    <PagePlaceholder
      eyebrow={<TodayDate />}
      title="Hoy"
      data={[
        { value: "—", label: "kcal" },
        { value: "—", label: "P" },
        { value: "—", label: "C" },
        { value: "—", label: "G" },
      ]}
      description="Aquí vas a ver tu plan del día y marcar lo que comiste. En construcción."
    />
  );
}
