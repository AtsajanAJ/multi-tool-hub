"use client";

import { LogOut, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signOutAction } from "@/lib/actions/sign-out";

type AppNavbarProps = {
  userName?: string | null;
  userEmail?: string | null;
  showMenuButton?: boolean;
  onMenuClick: () => void;
};

export function AppNavbar({
  userName,
  userEmail,
  showMenuButton = false,
  onMenuClick,
}: AppNavbarProps) {
  const label = userName || userEmail || "Signed in";

  return (
    <header className="flex h-16 items-center justify-between gap-4 border-b border-border bg-background px-4 md:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={showMenuButton ? undefined : "md:hidden"}
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu />
        </Button>
        <p className="hidden truncate text-sm text-muted-foreground md:block">
          Internal tools{" "}
          <span className="text-foreground/70">/ Workspace</span>
        </p>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="relative hidden md:block">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search tools…"
            className="h-9 w-56 rounded-full bg-secondary pl-8"
            disabled
          />
        </div>
        <span className="hidden rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground sm:inline">
          {label}
        </span>
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
