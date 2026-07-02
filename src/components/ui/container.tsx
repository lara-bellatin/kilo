import { cn } from "@/lib/cn";

export function Container({
  className,
  wide,
  children,
}: {
  className?: string;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-6",
        wide ? "max-w-[var(--container-chart)]" : "max-w-[var(--container-app)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
