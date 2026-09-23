"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Check, Copy, Download, Link2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { BrandMark } from "@/components/shared/brand-mark";
import {
  downloadQrImage,
  QrHistoryTable,
} from "@/components/qr/qr-history-table";
import {
  generateQrSchema,
  QR_ECC_LEVELS,
  QR_SIZES,
} from "@/lib/modules/qr/validation";
import type { QrCodeRecord } from "@/lib/modules/qr/types";
import { cn } from "@/lib/utils";
import { isTrustedQrImageUrl } from "@/lib/url";

const ECC_LABELS: Record<(typeof QR_ECC_LEVELS)[number], string> = {
  L: "L · 7%",
  M: "M · 15%",
  Q: "Q · 25%",
  H: "H · 30%",
};

export function QrWorkspace() {
  const [url, setUrl] = useState("");
  const [urlError, setUrlError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [latest, setLatest] = useState<QrCodeRecord | null>(null);
  const [history, setHistory] = useState<QrCodeRecord[]>([]);
  const [historyQuery, setHistoryQuery] = useState("");
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [ecc, setEcc] = useState<(typeof QR_ECC_LEVELS)[number]>("M");
  const [size, setSize] = useState<(typeof QR_SIZES)[number]>(192);
  const [color, setColor] = useState("#141413");
  const [highDensity, setHighDensity] = useState(true);
  const [centerHub, setCenterHub] = useState(false);
  const [quietZone, setQuietZone] = useState(true);
  const [copied, setCopied] = useState<"url" | "data" | null>(null);

  const filteredHistory = useMemo(() => {
    const query = historyQuery.trim().toLowerCase();
    if (!query) return history;
    return history.filter((item) => item.url.toLowerCase().includes(query));
  }, [history, historyQuery]);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/qr/history")
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Could not load QR history.");
        }
        return (await response.json()) as QrCodeRecord[];
      })
      .then((data) => {
        if (!cancelled) {
          setHistory(data);
        }
      })
      .catch((loadError) => {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Could not load QR history.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingHistory(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function markCopied(key: "url" | "data") {
    setCopied(key);
    window.setTimeout(() => setCopied(null), 1600);
  }

  async function copyText(value: string, key: "url") {
    try {
      await navigator.clipboard.writeText(value);
      await markCopied(key);
    } catch {
      setError("Could not copy to the clipboard.");
    }
  }

  async function copyDataUri(imageUrl: string) {
    if (!isTrustedQrImageUrl(imageUrl)) {
      setError("QR image URL is not trusted.");
      return;
    }

    try {
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error("Could not read the QR image.");
      }
      const blob = await response.blob();
      const dataUri = await blobToDataUri(blob);
      await navigator.clipboard.writeText(dataUri);
      await markCopied("data");
    } catch {
      setError("Could not copy a data URI for this QR image.");
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const trimmed = url.trim();
    if (!trimmed) {
      setUrlError("Enter a URL");
      return;
    }

    const parsed = generateQrSchema.safeParse({
      url: trimmed,
      ecc: centerHub ? "H" : ecc,
      size,
      color,
      margin: quietZone ? 10 : 1,
    });

    if (!parsed.success) {
      setUrlError(
        parsed.error.issues[0]?.message ??
          "Enter a valid URL, including https://",
      );
      return;
    }

    setUrlError(null);
    setGenerating(true);

    try {
      const response = await fetch("/api/qr/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error("Too many requests. Wait a minute and try again.");
        }
        const message =
          typeof data.error === "string"
            ? data.error
            : "Could not generate a QR code.";
        throw new Error(message);
      }

      setLatest(data as QrCodeRecord);
      setHistory((current) => [data as QrCodeRecord, ...current]);
    } catch (generateError) {
      setError(
        generateError instanceof Error
          ? generateError.message
          : "Could not generate a QR code.",
      );
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex max-w-2xl flex-col gap-3">
          <p className="text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
            Core utilities
            <span className="ml-2 rounded-full bg-[#efe9de] px-2 py-0.5 tracking-[0.08em] text-[#8f4a32]">
              01
            </span>
          </p>
          <h1 className="font-heading text-4xl tracking-tight sm:text-5xl">
            QR Codes
          </h1>
          <p className="text-base leading-relaxed text-muted-foreground">
            Generate a QR code from a URL, preview the matrix, and keep a
            downloadable history on this workspace.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            className="h-10 rounded-full bg-background px-4"
            onClick={() => void copyText((latest?.url ?? url).trim(), "url")}
            disabled={!(latest?.url ?? url).trim()}
          >
            {copied === "url" ? (
              <Check data-icon="inline-start" />
            ) : (
              <Copy data-icon="inline-start" />
            )}
            Copy URL
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-10 rounded-full bg-background px-4"
            disabled={!latest}
            onClick={() =>
              latest
                ? void downloadQrImage(latest.imageUrl, `qr-${latest.id}.png`)
                : undefined
            }
          >
            <Download data-icon="inline-start" />
            Download PNG
          </Button>
        </div>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <section className="rounded-2xl bg-[#efe9de] p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <p className="text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
              Generator
            </p>
            <span className="text-[11px] text-muted-foreground">
              Target URL
            </span>
          </div>

          <form onSubmit={onSubmit} className="flex flex-col gap-5">
            <FieldBlock
              label="Destination URL"
              htmlFor="url"
              invalid={Boolean(urlError)}
              hint={urlError}
            >
              <div className="flex gap-2">
                <Input
                  id="url"
                  name="url"
                  type="url"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(event) => setUrl(event.target.value)}
                  aria-invalid={urlError ? true : undefined}
                  autoComplete="url"
                  className="h-10 bg-background"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="size-10 bg-background"
                  onClick={() => void copyText(url.trim(), "url")}
                  disabled={!url.trim()}
                  aria-label="Copy URL"
                >
                  {copied === "url" ? <Check /> : <Copy />}
                </Button>
              </div>
            </FieldBlock>

            <div className="grid gap-4 sm:grid-cols-2">
              <FieldBlock label="Error correction" htmlFor="ecc">
                <select
                  id="ecc"
                  value={centerHub ? "H" : ecc}
                  onChange={(event) =>
                    setEcc(event.target.value as (typeof QR_ECC_LEVELS)[number])
                  }
                  disabled={centerHub}
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-60"
                >
                  {QR_ECC_LEVELS.map((level) => (
                    <option key={level} value={level}>
                      {ECC_LABELS[level]}
                    </option>
                  ))}
                </select>
              </FieldBlock>

              <FieldBlock label="Matrix tone" htmlFor="qr-color">
                <div className="flex items-center gap-2">
                  <label className="relative size-10 shrink-0 overflow-hidden rounded-full bg-background ring-1 ring-border">
                    <span
                      aria-hidden
                      className="absolute inset-1 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <input
                      id="qr-color"
                      type="color"
                      value={color}
                      onChange={(event) => setColor(event.target.value)}
                      className="absolute inset-0 cursor-pointer opacity-0"
                    />
                    <span className="sr-only">QR color</span>
                  </label>
                  <div className="flex min-w-0 flex-1 flex-wrap gap-1.5">
                    {QR_SIZES.map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setSize(value)}
                        className={cn(
                          "rounded-full px-2.5 py-1 text-xs",
                          size === value
                            ? "bg-foreground text-background"
                            : "bg-background text-muted-foreground",
                        )}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
              </FieldBlock>
            </div>

            <label className="flex cursor-pointer items-start gap-3 text-sm">
              <input
                type="checkbox"
                checked={highDensity}
                onChange={(event) => setHighDensity(event.target.checked)}
                className="mt-0.5 size-4 accent-[#8f4a32]"
              />
              <span>
                <span className="block text-foreground">
                  High-density preview
                </span>
                <span className="block text-muted-foreground">
                  Show a larger live output without changing the export size.
                </span>
              </span>
            </label>

            <ToggleRow
              checked={centerHub}
              onCheckedChange={(next) => {
                setCenterHub(next);
                if (next) setEcc("H");
              }}
              label="Center hub"
              hint="Places the workspace mark over the preview. Download stays a clean QR."
            />

            <ToggleRow
              checked={quietZone}
              onCheckedChange={setQuietZone}
              label="Quiet-zone margin"
              hint="Keeps a white border so scanners can lock onto the matrix."
            />

            <Button
              type="submit"
              disabled={generating}
              className="h-11 w-full rounded-lg bg-[#8f4a32] text-white hover:bg-[#7a3e2a]"
            >
              {generating ? <Spinner data-icon="inline-start" /> : null}
              {generating
                ? "Generating"
                : latest
                  ? "Regenerate"
                  : "Generate"}
            </Button>
          </form>
        </section>

        <section className="rounded-2xl bg-[#efe9de] p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <p className="text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
              Live output
            </p>
            <span className="rounded-full bg-background px-2.5 py-1 text-[11px] text-muted-foreground">
              {latest ? "Ready" : "Preview"}
            </span>
          </div>

          <div className="flex flex-col items-center gap-5">
            <div
              className={cn(
                "relative flex aspect-square w-full items-center justify-center rounded-2xl bg-background",
                highDensity ? "max-w-[360px]" : "max-w-[240px]",
              )}
            >
              {latest && isTrustedQrImageUrl(latest.imageUrl) ? (
                <>
                  <img
                    src={latest.imageUrl}
                    alt={`QR code for ${latest.url}`}
                    width={size}
                    height={size}
                    className="h-auto w-[78%] rounded-lg"
                  />
                  {centerHub ? (
                    <span className="absolute flex size-[18%] items-center justify-center rounded-full bg-background shadow-sm">
                      <BrandMark size={22} />
                    </span>
                  ) : null}
                </>
              ) : latest ? (
                <p className="px-6 text-center text-sm text-destructive">
                  QR image URL is not trusted.
                </p>
              ) : (
                <QrIdleMark />
              )}
            </div>

            <div className="flex w-full flex-col items-center gap-3">
              <p className="text-sm text-muted-foreground">
                {size} × {size} px
              </p>
              <p className="max-w-full truncate text-sm text-muted-foreground">
                {latest?.url || url.trim() || "https://"}
              </p>
              <div className="flex w-full flex-col gap-2 sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 flex-1 bg-background"
                  disabled={!latest}
                  onClick={() =>
                    latest
                      ? void downloadQrImage(
                          latest.imageUrl,
                          `qr-${latest.id}.png`,
                        )
                      : undefined
                  }
                >
                  <Download data-icon="inline-start" />
                  Download
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 flex-1 bg-background"
                  disabled={!latest}
                  onClick={() =>
                    latest
                      ? void downloadQrImage(
                          latest.imageUrl,
                          `qr-${latest.id}.png`,
                        )
                      : undefined
                  }
                >
                  <Download data-icon="inline-start" />
                  Download PNG
                </Button>
              </div>
              <Button
                type="button"
                variant="outline"
                className="h-10 w-full bg-background"
                disabled={!latest}
                onClick={() =>
                  latest ? void copyDataUri(latest.imageUrl) : undefined
                }
              >
                {copied === "data" ? (
                  <Check data-icon="inline-start" />
                ) : (
                  <Copy data-icon="inline-start" />
                )}
                {copied === "data" ? "Copied" : "Copy data URI"}
              </Button>
            </div>
          </div>
        </section>
      </div>

      <section className="rounded-2xl bg-[#efe9de] p-5 sm:p-6">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
              Encoded memory
              <span className="ml-2 tracking-normal text-foreground">
                {history.length}
              </span>
            </p>
            <h2 className="font-heading mt-1 text-xl tracking-tight">
              History
            </h2>
          </div>
          <div className="relative w-full sm:max-w-xs">
            <Link2 className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              value={historyQuery}
              onChange={(event) => setHistoryQuery(event.target.value)}
              placeholder="Filter records"
              className="h-10 bg-background pl-8"
              aria-label="Filter QR history"
            />
          </div>
        </div>
        <QrHistoryTable items={filteredHistory} loading={loadingHistory} />
      </section>
    </div>
  );
}

function FieldBlock({
  label,
  htmlFor,
  invalid,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  invalid?: boolean;
  hint?: string | null;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={htmlFor}
        className="text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase"
      >
        {label}
      </label>
      {children}
      {invalid && hint ? (
        <p className="text-sm text-destructive">{hint}</p>
      ) : null}
    </div>
  );
}

function ToggleRow({
  checked,
  onCheckedChange,
  label,
  hint,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
  hint: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className="flex min-h-11 w-full items-center justify-between gap-4 text-left"
    >
      <span>
        <span className="block text-sm text-foreground">{label}</span>
        <span className="block text-sm text-muted-foreground">{hint}</span>
      </span>
      <span
        aria-hidden
        className={cn(
          "relative h-6 w-10 shrink-0 rounded-full transition-colors",
          checked ? "bg-[#c17a5e]" : "bg-[#d4cdc2]",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 size-5 rounded-full bg-white transition-[left]",
            checked ? "left-[18px]" : "left-0.5",
          )}
        />
      </span>
    </button>
  );
}

function QrIdleMark() {
  return (
    <Image
      src="/qr_workspace.png"
      alt=""
      width={360}
      height={360}
      className="h-auto w-[86%]"
      priority
    />
  );
}

function blobToDataUri(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }
      reject(new Error("Could not encode image."));
    };
    reader.onerror = () => reject(new Error("Could not encode image."));
    reader.readAsDataURL(blob);
  });
}
