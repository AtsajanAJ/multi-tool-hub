"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Bell,
  Hash,
  PanelLeft,
  QrCode,
  Terminal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { modules, type Module } from "@/lib/navigation";
import { BrandMark } from "@/components/shared/brand-mark";

const icons = {
  qr: QrCode,
  incidents: Bell,
  uptime: Activity,
  api: Terminal,
  hash: Hash,
} as const;

type AppSidebarProps = {
  mobileOpen: boolean;
  hidden: boolean;
  onClose: () => void;
  onHide: () => void;
  userName?: string | null;
  userEmail?: string | null;
};

export function AppSidebar({
  mobileOpen,
  hidden,
  onClose,
  onHide,
  userName,
  userEmail,
}: AppSidebarProps) {
  const pathname = usePathname();
  const label = userName || userEmail || "Signed in";
  const initial = label.slice(0, 1).toUpperCase();
  const core = modules.filter((item) => item.group === "featured");
  const suite = modules.filter((item) => item.group === "additional");

  return (
    <>
      <button
        type="button"
        aria-label="Close menu"
        className={cn(
          "fixed inset-0 z-40 bg-[#141413]/40",
          mobileOpen || !hidden ? "md:hidden" : "",
          mobileOpen ? "block" : "hidden",
        )}
        onClick={onClose}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[272px] flex-col bg-[#111110] text-sidebar-foreground transition-transform",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          hidden ? "md:hidden" : "md:static md:z-0 md:translate-x-0",
        )}
      >
        <div className="flex items-start justify-between px-5 pt-5 pb-4">
          <Link href="/" onClick={onClose} className="flex items-center gap-2.5">
            <BrandMark size={26} />
            <div className="leading-tight">
              <p className="font-heading text-[22px] tracking-tight">
                Multi-Tool Hub
              </p>
              <p className="text-[11px] text-[#8a8680]">v0.1.0 · CORE</p>
            </div>
          </Link>
          <button
            type="button"
            onClick={hidden ? onClose : onHide}
            aria-label="Hide sidebar"
            className="mt-1 flex size-7 items-center justify-center rounded-md text-[#8a8680] hover:bg-[#1c1b19] hover:text-[#f3efe8]"
          >
            <PanelLeft className="size-4" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-6 overflow-y-auto px-3 pb-4">
          <NavSection
            title="Core modules"
            count={core.length}
            items={core}
            pathname={pathname}
            onClose={onClose}
          />
          <NavSection
            title="Developer suite"
            count={suite.length}
            items={suite}
            pathname={pathname}
            onClose={onClose}
          />
        </nav>

        <div className="px-3 pb-4">
          <div className="rounded-2xl bg-[#1b1a18] px-3 py-3">
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-full bg-[#2a211c] font-medium text-[#d8a48c]">
                {initial}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-[#f3efe8]">{label}</p>
                <p className="text-[11px] text-[#8a8680]">Workspace · 1 seat</p>
              </div>
            </div>
            <div className="mt-3 h-1 overflow-hidden rounded-full bg-[#2a2926]">
              <div className="h-full w-1/4 rounded-full bg-[#c57a5c]" />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

function NavSection({
  title,
  count,
  items,
  pathname,
  onClose,
}: {
  title: string;
  count: number;
  items: readonly Module[];
  pathname: string;
  onClose: () => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between px-2 pb-1">
        <p className="text-[10px] font-medium tracking-[0.16em] text-[#7d7973] uppercase">
          {title}
        </p>
        <span className="text-[10px] text-[#7d7973]">{count}</span>
      </div>
      {items.map((item) => (
        <NavItem
          key={item.href}
          item={item}
          pathname={pathname}
          onClose={onClose}
        />
      ))}
    </div>
  );
}

function NavItem({
  item,
  pathname,
  onClose,
}: {
  item: Module;
  pathname: string;
  onClose: () => void;
}) {
  const Icon = icons[item.icon];
  const isActive =
    item.enabled &&
    (pathname === item.href || pathname.startsWith(`${item.href}/`));
  const name = "shortLabel" in item ? item.shortLabel : item.label;
  const hint = "sidebarHint" in item ? item.sidebarHint : null;

  const className = cn(
    "flex items-center gap-3 rounded-xl px-2 py-2",
    isActive ? "bg-[#1c1b19]" : "text-[#9c9892]",
  );

  const body = (
    <>
      <span
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-lg",
          isActive ? "bg-[#2a211c] text-[#d8a48c]" : "bg-[#1c1b19] text-[#8a8680]",
        )}
      >
        <Icon className="size-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span
          className={cn(
            "block text-sm",
            isActive ? "text-[#f3efe8]" : "text-[#c4c0b8]",
          )}
        >
          {name}
        </span>
        {isActive && hint ? (
          <span className="block text-[11px] text-[#8a8680]">{hint}</span>
        ) : null}
      </span>
      <span
        className={cn(
          "rounded-full px-2 py-0.5 text-[9px] font-medium tracking-[0.12em] uppercase",
          isActive
            ? "bg-[#2a211c] text-[#d8a48c]"
            : "bg-[#1c1b19] text-[#7d7973]",
        )}
      >
        {item.enabled ? "Active" : "Soon"}
      </span>
    </>
  );

  if (!item.enabled) {
    return <span className={className}>{body}</span>;
  }

  return (
    <Link href={item.href} onClick={onClose} className={className}>
      {body}
    </Link>
  );
}
