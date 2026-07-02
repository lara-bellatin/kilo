import { LogOut } from "lucide-react";
import { signOut } from "@/app/(app)/actions";

export function SignOutButton() {
  return (
    <form action={signOut}>
      <button
        type="submit"
        aria-label="Cerrar sesión"
        className="inline-flex h-11 w-11 items-center justify-center rounded-input border border-border bg-surface text-muted transition-colors hover:text-text"
      >
        <LogOut size={20} strokeWidth={1.5} />
      </button>
    </form>
  );
}
