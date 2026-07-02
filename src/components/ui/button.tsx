import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-input font-body font-medium transition-[background-color,color,transform] duration-[var(--duration-fast)] ease-[var(--ease-out)] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
  {
    variants: {
      variant: {
        primary:
          "bg-text text-bg hover:bg-text/90 active:bg-text/80",
        ghost:
          "bg-transparent border border-border text-text hover:bg-surface-2 active:bg-surface-2/70",
        accent:
          "bg-accent text-bg hover:bg-accent-dim active:bg-accent-dim",
      },
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-11 px-4 text-base",
        lg: "h-12 px-5 text-base",
      },
      full: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      full: false,
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, full, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size, full }), className)}
      {...props}
    />
  ),
);
Button.displayName = "Button";
