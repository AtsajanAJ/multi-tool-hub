import { DashboardShell } from "@/components/shared/dashboard-shell";
import { auth } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <DashboardShell
      userName={session?.user?.name}
      userEmail={session?.user?.email}
    >
      {children}
    </DashboardShell>
  );
}
