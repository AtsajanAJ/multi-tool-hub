"use client";

import { useEffect, useState } from "react";
import { AppNavbar } from "@/components/shared/app-navbar";
import { AppSidebar } from "@/components/shared/app-sidebar";

type DashboardShellProps = {
  userName?: string | null;
  userEmail?: string | null;
  children: React.ReactNode;
};

const STORAGE_KEY = "sidebar-hidden";

export function DashboardShell({
  userName,
  userEmail,
  children,
}: DashboardShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    setHidden(localStorage.getItem(STORAGE_KEY) === "true");
  }, []);

  function hideSidebar() {
    setHidden(true);
    setMobileOpen(false);
    localStorage.setItem(STORAGE_KEY, "true");
  }

  function showSidebar() {
    setHidden(false);
    setMobileOpen(true);
    localStorage.setItem(STORAGE_KEY, "false");
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar
        mobileOpen={mobileOpen}
        hidden={hidden}
        onClose={() => setMobileOpen(false)}
        onHide={hideSidebar}
        userName={userName}
        userEmail={userEmail}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppNavbar
          userName={userName}
          userEmail={userEmail}
          showMenuButton={hidden}
          onMenuClick={showSidebar}
        />
        <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-8 md:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
