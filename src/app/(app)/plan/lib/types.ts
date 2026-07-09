import { Constants, type Database } from "@/types/database";

export type DayType = Database["public"]["Enums"]["day_type"];
export type SectionType = Database["public"]["Enums"]["section_type"];
export type FoodUnit = Database["public"]["Enums"]["food_unit"];
export type WeightBasis = Database["public"]["Enums"]["weight_basis"];

export const DAY_TYPES = Constants.public.Enums.day_type;
export const FOOD_UNITS = Constants.public.Enums.food_unit;
export const WEIGHT_BASES = Constants.public.Enums.weight_basis;

export const DAY_TYPE_LABEL: Record<DayType, string> = {
  descanso: "Descanso",
  entreno: "Entreno",
  doble_entreno: "Doble entreno",
};

export const DAY_TYPE_SHORT: Record<DayType, string> = {
  descanso: "descanso",
  entreno: "entreno",
  doble_entreno: "doble",
};

export type PlanComponent = {
  id: string;
  quantity: number;
  unit: FoodUnit;
  description: string;
  weight_basis: WeightBasis | null;
  sortOrder: number;
};

export type PlanOption = {
  id: string;
  label: string | null;
  notes: string | null;
  sortOrder: number;
  components: PlanComponent[];
};

export type PlanGroup = {
  id: string;
  label: string;
  pickCount: number;
  sortOrder: number;
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
  sortOrder: number;
  groups: PlanGroup[];
};

export type PlanDayTarget = {
  dayType: DayType;
  kcalAdjustment: number;
  waterLiters: number | null;
};

export type PlanTree = {
  id: string;
  title: string;
  baseKcal: number | null;
  proteinG: number | null;
  carbsG: number | null;
  fatG: number | null;
  tags: string[];
  notes: string | null;
  targets: Record<DayType, PlanDayTarget>;
  sections: PlanSection[];
};
