import Link from "next/link";
import { LoginForm } from "./login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <p className="text-eyebrow">Iniciar sesión</p>
        <h1 className="text-h1">Hola.</h1>
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
