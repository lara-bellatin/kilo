import { Card } from "@/components/ui/card";

export function PagePlaceholder({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="hoy-shell">
      <div className="hoy-titlerow">
        <div>
          {eyebrow ? (
            <span className="text-eyebrow">
              <span className="hoy-dash">— </span>
              {eyebrow}
            </span>
          ) : null}
          <h1 className="text-h1">{title}</h1>
        </div>
      </div>
      <Card>
        <p className="text-muted">{description}</p>
      </Card>
    </div>
  );
}
