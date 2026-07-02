import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { SignOutButton } from "@/components/sign-out-button";

export async function AppHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const displayName =
    user?.user_metadata?.name ?? user?.email?.split("@")[0] ?? "";

  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-[var(--container-app)] items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <Image
            src="/kilo-icon.svg"
            alt=""
            width={28}
            height={28}
            className="rounded-[6px]"
          />
          <span className="text-eyebrow">Kilo</span>
          {displayName ? (
            <span className="ml-2 text-sm text-muted">· {displayName}</span>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <SignOutButton />
        </div>
      </div>
    </header>
  );
}
