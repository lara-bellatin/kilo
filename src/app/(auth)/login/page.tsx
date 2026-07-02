import Link from "next/link";
import { LoginForm } from "./login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <p className="text-eyebrow">
          <span aria-hidden className="text-accent">—</span> Iniciar sesión
        </p>
        <h1 className="text-display">Hola</h1>
      </div>
      <LoginForm next={next} />
      <p className="text-sm text-muted">
        ¿No tienes cuenta?{" "}
        <Link
          href={next ? `/signup?next=${encodeURIComponent(next)}` : "/signup"}
          className="text-text underline underline-offset-4"
        >
          Crear una
        </Link>
      </p>
    </div>
  );
}
