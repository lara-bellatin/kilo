import { cn } from "@/lib/cn";

export function PageHero({
  eyebrow,
  title,
  data,
  actions,
  className,
}: {
  /** Small mono label above the title. Rendered verbatim. Optional. */
  eyebrow?: React.ReactNode;
  /** Large display headline. */
  title: string;
  /** Optional mono data row shown below the title. */
  data?: Array<{ value: string; label?: string; accent?: boolean }>;
  /** Actions rendered on the right side of the eyebrow row. */
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("flex flex-col gap-6 animate-in", className)}>
      {eyebrow || actions ? (
        <div className="flex items-center justify-between gap-4">
          {eyebrow ? <p className="text-eyebrow">{eyebrow}</p> : <span />}
          {actions ? (
            <div className="flex items-center gap-2">{actions}</div>
          ) : null}
        </div>
      ) : null}

      <h1 className="text-hero text-text">{title}</h1>

      {data && data.length > 0 ? (
        <dl className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
          {data.map(({ value, label, accent }, i) => (
            <div
              key={`${value}-${i}`}
              className="flex items-baseline gap-2"
            >
              <dt className="sr-only">{label ?? value}</dt>
              <dd
                className={cn(
                  "text-data-lg",
                  accent ? "text-accent" : "text-text",
                )}
              >
                {value}
              </dd>
              {label ? (
                <span className="font-mono text-sm text-muted">{label}</span>
              ) : null}
            </div>
          ))}
        </dl>
      ) : null}
    </section>
  );
}
