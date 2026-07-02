import type { Database } from "@/types/database";

export type DayType = Database["public"]["Enums"]["day_type"];
export type SectionType = Database["public"]["Enums"]["section_type"];
export type FoodUnit = Database["public"]["Enums"]["food_unit"];
export type WeightBasis = Database["public"]["Enums"]["weight_basis"];

export type PlanOption = {
  id: string;
  label: string | null;
  notes: string | null;
  components: Array<{
    id: string;
    quantity: number;
    unit: FoodUnit;
    description: string;
    weight_basis: WeightBasis | null;
  }>;
};

export type PlanGroup = {
  id: string;
  label: string;
  pickCount: number;
  options: PlanOption[];
};

export type PlanSection = {
  id: string;
  label: string;
  sectionType: SectionType;
  icon: string | null;
  notes: string | null;
  visibleWhen: DayType[] | null;
  repeatWhen: DayType[] | null;
  groups: PlanGroup[];
};

export type DayTargets = {
  dayType: DayType;
  kcalTotal: number;
  kcalAdjustment: number;
  waterLiters: number;
};

export type PlanForDay = {
  planId: string;
  title: string;
  baseKcal: number;
  proteinG: number | null;
  carbsG: number | null;
  fatG: number | null;
  targets: Record<DayType, DayTargets>;
  sections: PlanSection[];
};

export type LogEntry = {
  optionId: string;
  occurrence: number;
  servings: number;
};

export type FreeEntry = {
  id: string;
  sectionId: string | null;
  description: string;
  quantity: number | null;
  unit: FoodUnit | null;
  notes: string | null;
};

export type DayLog = {
  id: string | null;
  date: string;
  dayType: DayType;
  waterLiters: number;
  entries: LogEntry[];
  freeEntries: FreeEntry[];
};

export const DAY_TYPES: DayType[] = ["descanso", "entreno", "doble_entreno"];

export const DAY_TYPE_LABEL: Record<DayType, string> = {
  descanso: "Descanso",
  entreno: "Entreno",
  doble_entreno: "Doble",
};
