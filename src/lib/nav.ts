import {
  BookOpen,
  CalendarCheck2,
  ClipboardList,
  LineChart,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const NAV_ITEMS: NavItem[] = [
  { href: "/hoy", label: "Hoy", icon: CalendarCheck2 },
  { href: "/plan", label: "Plan", icon: ClipboardList },
  { href: "/evolucion", label: "Evolución", icon: LineChart },
  { href: "/tips", label: "Tips", icon: BookOpen },
];
