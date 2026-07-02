import { Check, TriangleAlert, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

type Tone = "neutral" | "done" | "warn" | "accent";
type IconName = "check" | "triangle-alert";

const ICONS: Record<IconName, LucideIcon> = {
  check: Check,
  "triangle-alert": TriangleAlert,
};

export function Pill({
  tone = "neutral",
  icon,
  className,
  children,
}: {
  tone?: Tone;
  icon?: IconName;
  className?: string;
  children: React.ReactNode;
}) {
  const Icon = icon ? ICONS[icon] : null;
  return (
    <span
      className={cn(
        "hoy-pill",
        tone !== "neutral" && `tone-${tone}`,
        className,
      )}
    >
      {Icon ? <Icon size={12} strokeWidth={2} aria-hidden /> : null}
      {children}
    </span>
  );
}
