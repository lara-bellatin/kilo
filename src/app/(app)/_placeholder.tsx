import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";

export function PagePlaceholder({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <Container className="py-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <p className="text-eyebrow">{eyebrow}</p>
          <h1 className="text-h1">{title}</h1>
        </div>
        <Card>
          <p className="text-muted">{description}</p>
        </Card>
      </div>
    </Container>
  );
}
