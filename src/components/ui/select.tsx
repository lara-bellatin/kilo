import { forwardRef, type SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

export const Select = forwardRef<
  HTMLSelectElement,
  SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
  <span className={cn("relative block w-full", className)}>
    <select
      ref={ref}
      className="h-11 w-full appearance-none rounded-input border border-border bg-surface-2 pl-3 pr-9 text-base text-text transition-[border-color,background-color] duration-[var(--duration-fast)] ease-[var(--ease-out)] focus:border-accent focus:outline-none"
      {...props}
    >
      {children}
    </select>
    <ChevronDown
      size={16}
      strokeWidth={1.5}
      aria-hidden
      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted"
    />
  </span>
));
Select.displayName = "Select";
