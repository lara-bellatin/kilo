import { cn } from "@/lib/cn";

export function Field({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("flex flex-col gap-2", className)}>{children}</div>;
}

export function FieldError({ children }: { children?: React.ReactNode }) {
  if (!children) return null;
  return <p className="text-sm text-over">{children}</p>;
}

export function FieldHint({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-muted">{children}</p>;
}
