"use client";

import { Download, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import type { QrCodeRecord } from "@/lib/modules/qr/types";
import { isHttpUrl, isTrustedQrImageUrl } from "@/lib/url";

export async function downloadQrImage(imageUrl: string, filename: string) {
  if (!isTrustedQrImageUrl(imageUrl)) {
    throw new Error("QR image URL is not trusted.");
  }

  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error("Could not download QR image.");
  }

  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(objectUrl);
}

type QrHistoryTableProps = {
  items: QrCodeRecord[];
  loading: boolean;
};

export function QrHistoryTable({ items, loading }: QrHistoryTableProps) {
  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-14 w-full rounded-xl bg-background" />
        <Skeleton className="h-14 w-full rounded-xl bg-background" />
        <Skeleton className="h-14 w-full rounded-xl bg-background" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <Empty className="border border-dashed border-border bg-background/60">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <QrCode />
          </EmptyMedia>
          <EmptyTitle>No QR codes yet</EmptyTitle>
          <EmptyDescription>
            Generate a QR code from a URL and it will show up here.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="hidden px-2 text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase sm:grid sm:grid-cols-[5.5rem_minmax(0,1fr)_9rem_5rem_2.75rem] sm:gap-3">
        <span>Key</span>
        <span>Destination</span>
        <span>Created</span>
        <span>Status</span>
        <span className="text-right">Action</span>
      </div>
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li
            key={item.id}
            className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-xl bg-background px-3 py-3 sm:grid-cols-[5.5rem_minmax(0,1fr)_9rem_5rem_2.75rem] sm:gap-3"
          >
            <span className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-lg bg-[#efe9de] text-[#8f4a32]">
                <QrCode className="size-3.5" />
              </span>
              <span className="hidden font-mono text-[11px] text-muted-foreground sm:inline">
                {item.id.slice(-6)}
              </span>
            </span>
            <div className="min-w-0">
              {isHttpUrl(item.url) ? (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block truncate text-sm text-foreground underline-offset-4 hover:underline"
                >
                  {item.url}
                </a>
              ) : (
                <span className="block truncate text-sm">{item.url}</span>
              )}
              <p className="truncate text-[11px] text-muted-foreground sm:hidden">
                {new Date(item.createdAt).toLocaleString()}
              </p>
            </div>
            <span className="hidden truncate text-sm text-muted-foreground sm:block">
              {new Date(item.createdAt).toLocaleString()}
            </span>
            <span className="hidden text-sm text-[#5db872] sm:block">Ready</span>
            <div className="flex justify-end">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-10"
                aria-label={`Download QR for ${item.url}`}
                onClick={() =>
                  void downloadQrImage(item.imageUrl, `qr-${item.id}.png`)
                }
              >
                <Download />
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
