import { AppHeader } from "@/components/app-header";
import { TabBar } from "@/components/tab-bar";
import { TzSync } from "@/components/tz-sync";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <TzSync />
      <AppHeader />
      <main className="flex-1">{children}</main>
      <TabBar />
    </div>
  );
}
