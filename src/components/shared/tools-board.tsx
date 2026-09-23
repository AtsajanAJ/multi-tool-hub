"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Activity, ArrowRight, Bell, Hash, QrCode, Terminal } from "lucide-react";
import { modules } from "@/lib/navigation";
import { cn } from "@/lib/utils";

const icons = {
  qr: QrCode,
  incidents: Bell,
  uptime: Activity,
  api: Terminal,
  hash: Hash,
} as const;

type Filter = "all" | "active" | "soon";

type ActivityItem = {
  title: string;
  detail: string;
  when: string;
  status: string;
};

type ToolsBoardProps = {
  activity: ActivityItem[];
};

export function ToolsBoard({ activity }: ToolsBoardProps) {
  const [filter, setFilter] = useState<Filter>("all");
  const featured = modules.filter((item) => item.group === "featured");
  const additional = modules.filter((item) => item.group === "additional");
  const activeCount = modules.filter((item) => item.enabled).length;
  const soonCount = modules.filter((item) => !item.enabled).length;

  const visibleFeatured = useMemo(() => {
    if (filter === "active") return featured.filter((item) => item.enabled);
    if (filter === "soon") return featured.filter((item) => !item.enabled);
    return featured;
  }, [featured, filter]);

  const visibleAdditional = useMemo(() => {
    if (filter === "active") return additional.filter((item) => item.enabled);
    if (filter === "soon") return additional.filter((item) => !item.enabled);
    return additional;
  }, [additional, filter]);

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3">
          <h1 className="font-heading text-4xl tracking-tight sm:text-5xl">
            Tools
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
            Choose a module from the sidebar or the cards below. More platform
            tools will appear here as they are deployed.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <FilterPill
            active={filter === "all"}
            onClick={() => setFilter("all")}
          >
            All Tools ({modules.length})
          </FilterPill>
          <FilterPill
            active={filter === "active"}
            onClick={() => setFilter("active")}
          >
            Active ({activeCount})
          </FilterPill>
          <FilterPill
            active={filter === "soon"}
            onClick={() => setFilter("soon")}
          >
            In Development ({soonCount})
          </FilterPill>
        </div>
      </div>

      {visibleFeatured.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visibleFeatured.map((item) => (
            <ModuleCard key={item.href} item={item} />
          ))}
        </div>
      ) : null}

      {visibleAdditional.length > 0 ? (
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <p className="text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
              Additional modules
            </p>
            <p className="text-[11px] text-muted-foreground">Planned releases</p>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {visibleAdditional.map((item) => (
              <ModuleCard key={item.href} item={item} wide />
            ))}
          </div>
        </section>
      ) : null}

      <section className="rounded-2xl bg-[#efe9de] p-5 sm:p-6">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="font-heading text-xl tracking-tight">Recent activity</h2>
            <p className="text-sm text-muted-foreground">
              Workspace actions from this account
            </p>
          </div>
          <span className="rounded-full bg-background px-2.5 py-1 text-[11px] text-[#5db872]">
            All systems nominal
          </span>
        </div>
        {activity.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No activity yet. Generate a QR code to see it here.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {activity.map((item) => (
              <li
                key={`${item.title}-${item.when}`}
                className="flex flex-wrap items-center justify-between gap-2 border-b border-border/70 pb-3 last:border-b-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm text-foreground">{item.title}</p>
                  <p className="truncate text-sm text-muted-foreground">
                    {item.detail}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-muted-foreground">{item.when}</span>
                  <span className="text-[#5db872]">{item.status}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full px-3 py-1.5 text-sm",
        active
          ? "bg-foreground text-background"
          : "border border-border bg-background text-muted-foreground",
      )}
    >
      {children}
    </button>
  );
}

function ModuleCard({
  item,
  wide = false,
}: {
  item: (typeof modules)[number];
  wide?: boolean;
}) {
  const Icon = icons[item.icon];
  const footnote = "footnote" in item ? item.footnote : null;

  const body = (
    <article
      className={cn(
        "flex h-full flex-col gap-4 rounded-2xl bg-[#efe9de] p-5",
        item.enabled && "transition-colors hover:bg-[#e8e0d2]",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="flex size-9 items-center justify-center rounded-lg bg-background text-primary">
          <Icon className="size-4" />
        </span>
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-[10px] font-medium tracking-[0.12em] uppercase",
            item.enabled
              ? "bg-background text-primary"
              : "bg-background text-muted-foreground",
          )}
        >
          {item.enabled ? "Active" : "Soon"}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2">
        <h2 className="font-heading text-2xl tracking-tight">{item.label}</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {item.description}
        </p>
      </div>
      <div className="flex items-center justify-between gap-3">
        <p className="flex items-center gap-1 text-sm text-foreground">
          {item.enabled ? (
            <>
              Open module
              <ArrowRight className="size-3.5" />
            </>
          ) : (
            "Coming soon"
          )}
        </p>
        {wide && footnote ? (
          <p className="text-[11px] text-muted-foreground">{footnote}</p>
        ) : null}
      </div>
    </article>
  );

  if (!item.enabled) {
    return body;
  }

  return (
    <Link href={item.href} className="block h-full">
      {body}
    </Link>
  );
}
