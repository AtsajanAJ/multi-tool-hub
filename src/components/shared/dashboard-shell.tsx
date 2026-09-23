"use client";

import { useState } from "react";
import { AppNavbar } from "@/components/shared/app-navbar";
import { AppSidebar } from "@/components/shared/app-sidebar";

type DashboardShellProps = {
  userName?: string | null;
  userEmail?: string | null;
  children: React.ReactNode;
};

export function DashboardShell({
  userName,
  userEmail,
  children,
}: DashboardShellProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar
        open={open}
        onClose={() => setOpen(false)}
        userName={userName}
        userEmail={userEmail}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppNavbar
          userName={userName}
          userEmail={userEmail}
          onMenuClick={() => setOpen(true)}
        />
        <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-8 md:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
