import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { PageHero } from "@/components/ui/page-hero";

export function PagePlaceholder({
  eyebrow,
  title,
  data,
  description,
}: {
  eyebrow?: React.ReactNode;
  title: string;
  data?: Array<{ value: string; label?: string; accent?: boolean }>;
  description: string;
}) {
  return (
    <Container className="py-10 md:py-16">
      <div className="flex flex-col gap-12">
        <PageHero eyebrow={eyebrow} title={title} data={data} />
        <Card>
          <p className="text-muted">{description}</p>
        </Card>
      </div>
    </Container>
  );
}
