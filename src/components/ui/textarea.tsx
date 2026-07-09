import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "min-h-24 w-full rounded-input border border-border bg-surface-2 p-3 text-base text-text placeholder:text-faint transition-[border-color,background-color] duration-[var(--duration-fast)] ease-[var(--ease-out)] focus:border-accent focus:outline-none",
      className,
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";
