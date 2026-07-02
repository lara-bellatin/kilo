import Image from "next/image";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-1 flex-col lg:flex-row">
      {/* Brand panel — desktop only */}
      <aside
        aria-hidden
        className="relative hidden lg:flex lg:w-[45%] xl:w-[42%] flex-col justify-between overflow-hidden bg-surface p-12"
      >
        <div className="flex items-center gap-3">
          <Image
            src="/kilo-icon.svg"
            alt=""
            width={36}
            height={36}
            className="rounded-[8px]"
          />
          <span className="text-eyebrow">Kilo</span>
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-eyebrow">
            <span className="text-accent">—</span> Tracking nutricional
          </p>
          <h2 className="text-hero max-w-md">
            Marca<br />tu día.
          </h2>
        </div>

        <p className="max-w-xs text-sm text-muted">
          Cada usuario carga su propio plan, marca lo que comió y registra sus
          mediciones en el tiempo.
        </p>
      </aside>

      {/* Form panel */}
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2 lg:hidden">
            <Image
              src="/kilo-icon.svg"
              alt=""
              width={28}
              height={28}
              className="rounded-[6px]"
            />
            <span className="text-eyebrow">Kilo</span>
          </div>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </header>
        <main className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6">
          <div className="w-full max-w-sm animate-in">{children}</div>
        </main>
      </div>
    </div>
  );
}
