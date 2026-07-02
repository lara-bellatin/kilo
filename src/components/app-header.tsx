import Image from "next/image";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { SignOutButton } from "@/components/sign-out-button";
import { DesktopNav } from "@/components/desktop-nav";

export function AppHeader() {
  return (
    <header
      className="sticky top-0 z-30 bg-bg/85 backdrop-blur"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="mx-auto flex max-w-[var(--container-wide)] items-center gap-6 px-4 py-3 sm:px-6">
        <Image
          src="/kilo-icon.svg"
          alt="Kilo"
          width={28}
          height={28}
          className="rounded-[6px]"
        />

        <DesktopNav />

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <SignOutButton />
        </div>
      </div>
    </header>
  );
}
