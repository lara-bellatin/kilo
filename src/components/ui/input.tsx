import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "h-11 w-full rounded-input border border-border bg-surface-2 px-3 text-base text-text placeholder:text-faint transition-[border-color,background-color] duration-[var(--duration-fast)] ease-[var(--ease-out)] focus:border-accent focus:outline-none",
      className,
    )}
    {...props}
  />
));
Input.displayName = "Input";
