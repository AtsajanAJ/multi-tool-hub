"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Bell, QrCode } from "lucide-react";
import { cn } from "@/lib/utils";
import { modules } from "@/lib/navigation";

const icons = {
  "/qr": QrCode,
  "/incidents": Bell,
  "/uptime": Activity,
} as const;

type AppSidebarProps = {
  open: boolean;
  onClose: () => void;
};

export function AppSidebar({ open, onClose }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      <button
        type="button"
        aria-label="Close menu"
        className={cn(
          "fixed inset-0 z-40 bg-[#141413]/40 md:hidden",
          open ? "block" : "hidden",
        )}
        onClick={onClose}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-sidebar text-sidebar-foreground transition-transform md:static md:z-0 md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center px-6">
          <Link
            href="/"
            onClick={onClose}
            className="font-heading text-2xl tracking-tight text-sidebar-foreground"
          >
            Multi-Tool Hub
          </Link>
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
          <p className="px-3 pb-2 text-[12px] font-medium tracking-[1.5px] text-[#a09d96] uppercase">
            Modules
          </p>
          {modules.map((item) => {
            const Icon = icons[item.href];
            const isActive =
              item.enabled &&
              (pathname === item.href || pathname.startsWith(`${item.href}/`));

            if (!item.enabled) {
              return (
                <span
                  key={item.href}
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-[#a09d96]"
                >
                  <span className="flex items-center gap-2">
                    <Icon className="size-4" />
                    {item.label}
                  </span>
                  <span className="rounded-full bg-[#252320] px-2 py-0.5 text-[12px] tracking-[1.5px] uppercase">
                    Soon
                  </span>
                </span>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-[#a09d96] hover:bg-sidebar-accent hover:text-sidebar-foreground",
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
