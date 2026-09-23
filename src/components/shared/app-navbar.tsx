"use client";

import { LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/lib/actions/sign-out";

type AppNavbarProps = {
  userName?: string | null;
  userEmail?: string | null;
  onMenuClick: () => void;
};

export function AppNavbar({
  userName,
  userEmail,
  onMenuClick,
}: AppNavbarProps) {
  const label = userName || userEmail || "Signed in";

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-background px-4 md:px-8">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu />
        </Button>
        <p className="hidden text-sm text-muted-foreground md:block">
          Internal tools
        </p>
      </div>
      <div className="flex items-center gap-3">
        <p className="max-w-24 truncate text-sm text-foreground sm:max-w-48">
          {label}
        </p>
        <form action={signOutAction}>
          <Button type="submit" variant="outline" size="sm">
            <LogOut data-icon="inline-start" />
            <span className="hidden sm:inline">Sign out</span>
          </Button>
        </form>
      </div>
    </header>
  );
}
