import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export const IconButton = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, type = "button", ...props }, ref) => (
  <button
    ref={ref}
    type={type}
    className={cn(
      "inline-flex h-10 w-10 items-center justify-center rounded-input border border-border bg-surface text-muted cursor-pointer transition-[color,background-color] duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:text-text hover:bg-surface-2 active:scale-[0.96] disabled:cursor-default",
      className,
    )}
    {...props}
  />
));
IconButton.displayName = "IconButton";
