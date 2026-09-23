"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Bell,
  ChevronsUpDown,
  Hash,
  QrCode,
  Terminal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { modules } from "@/lib/navigation";
import { BrandMark } from "@/components/shared/brand-mark";

const icons = {
  qr: QrCode,
  incidents: Bell,
  uptime: Activity,
  api: Terminal,
  hash: Hash,
} as const;

type AppSidebarProps = {
  open: boolean;
  onClose: () => void;
  userName?: string | null;
  userEmail?: string | null;
};

export function AppSidebar({
  open,
  onClose,
  userName,
  userEmail,
}: AppSidebarProps) {
  const pathname = usePathname();
  const label = userName || userEmail || "Signed in";

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
        <div className="flex h-16 items-center gap-2 px-5">
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center gap-2 font-heading text-xl tracking-tight text-sidebar-foreground"
          >
            <BrandMark size={22} />
            Multi-Tool Hub
          </Link>
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-3 py-2">
          <p className="px-3 pb-2 text-[11px] font-medium tracking-[0.16em] text-[#a09d96] uppercase">
            Modules
          </p>
          {modules.map((item) => {
            const Icon = icons[item.icon];
            const isActive =
              item.enabled &&
              (pathname === item.href || pathname.startsWith(`${item.href}/`));

            const rowClass = cn(
              "flex items-center justify-between rounded-lg px-3 py-2 text-sm",
              isActive
                ? "bg-sidebar-accent text-sidebar-foreground"
                : "text-[#a09d96]",
            );

            const content = (
              <>
                <span className="flex items-center gap-2">
                  <Icon className="size-4" />
                  {item.label}
                </span>
                {item.enabled ? null : (
                  <span className="rounded-full bg-[#252320] px-2 py-0.5 text-[10px] tracking-[0.12em] uppercase">
                    Soon
                  </span>
                )}
              </>
            );

            if (!item.enabled) {
              return (
                <span key={item.href} className={rowClass}>
                  {content}
                </span>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(rowClass, "font-medium")}
              >
                {content}
              </Link>
            );
          })}
        </nav>
        <div className="p-3">
          <div className="flex items-center gap-2 rounded-xl bg-[#252320] px-3 py-2">
            <BrandMark size={22} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-sidebar-foreground">{label}</p>
              <p className="text-[11px] text-[#a09d96]">Connected</p>
            </div>
            <ChevronsUpDown className="size-4 text-[#a09d96]" />
          </div>
        </div>
      </aside>
    </>
  );
}
