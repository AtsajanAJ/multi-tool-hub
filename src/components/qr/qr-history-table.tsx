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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { QrCodeRecord } from "@/lib/modules/qr/types";

function isHttpUrl(value: string) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export async function downloadQrImage(imageUrl: string, filename: string) {
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
      <div className="flex flex-col gap-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <Empty className="border border-dashed border-border">
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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>URL</TableHead>
          <TableHead>Created</TableHead>
          <TableHead className="text-right">Download</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="max-w-xs">
              {isHttpUrl(item.url) ? (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate text-primary underline-offset-4 hover:underline"
                >
                  {item.url}
                </a>
              ) : (
                <span className="truncate">{item.url}</span>
              )}
            </TableCell>
            <TableCell>
              {new Date(item.createdAt).toLocaleString()}
            </TableCell>
            <TableCell className="text-right">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  downloadQrImage(item.imageUrl, `qr-${item.id}.png`)
                }
              >
                <Download data-icon="inline-start" />
                Download
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
