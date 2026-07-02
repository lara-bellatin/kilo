import Link from "next/link";
import { SignupForm } from "./signup-form";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <p className="text-eyebrow">
          <span aria-hidden className="text-accent">—</span> Nueva cuenta
        </p>
        <h1 className="text-display">Empieza</h1>
      </div>
      <SignupForm next={next} />
      <p className="text-sm text-muted">
        ¿Ya tienes cuenta?{" "}
        <Link
          href={next ? `/login?next=${encodeURIComponent(next)}` : "/login"}
          className="text-text underline underline-offset-4"
        >
          Iniciar sesión
        </Link>
      </p>
    </div>
  );
}
