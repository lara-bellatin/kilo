import { LogOut } from "lucide-react";
import { signOut } from "@/app/(app)/actions";
import { IconButton } from "@/components/ui/icon-button";

export function SignOutButton() {
  return (
    <form action={signOut}>
      <IconButton type="submit" aria-label="Cerrar sesión">
        <LogOut size={18} strokeWidth={1.5} />
      </IconButton>
    </form>
  );
}
