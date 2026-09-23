"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { generateQrSchema } from "@/lib/modules/qr/validation";
import type { QrCodeRecord } from "@/lib/modules/qr/types";
import { isTrustedQrImageUrl } from "@/lib/url";
import {
  downloadQrImage,
  QrHistoryTable,
} from "@/components/qr/qr-history-table";

export function QrWorkspace() {
  const [url, setUrl] = useState("");
  const [urlError, setUrlError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [latest, setLatest] = useState<QrCodeRecord | null>(null);
  const [history, setHistory] = useState<QrCodeRecord[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [generating, setGenerating] = useState(false);

  async function loadHistory() {
    setLoadingHistory(true);
    try {
      const response = await fetch("/api/qr/history");
      if (!response.ok) {
        throw new Error("Could not load QR history.");
      }
      const data = (await response.json()) as QrCodeRecord[];
      setHistory(data);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Could not load QR history.",
      );
    } finally {
      setLoadingHistory(false);
    }
  }

  useEffect(() => {
    void loadHistory();
  }, []);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const trimmed = url.trim();
    if (!trimmed) {
      setUrlError("Enter a URL");
      return;
    }

    const parsed = generateQrSchema.safeParse({ url: trimmed });
    if (!parsed.success) {
      setUrlError(parsed.error.issues[0]?.message ?? "Enter a valid URL, including https://");
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
      setUrl("");
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
      <div className="flex flex-col gap-2">
        <h1 className="font-heading text-3xl tracking-tight sm:text-4xl">
          QR Codes
        </h1>
        <p className="text-base text-muted-foreground">
          Turn a URL into a QR code and keep a history of what you generate.
        </p>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Generate</CardTitle>
            <CardDescription>
              Paste a full URL. We validate it before calling the QR service.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit}>
              <FieldGroup>
                <Field data-invalid={urlError ? true : undefined}>
                  <FieldLabel htmlFor="url">URL</FieldLabel>
                  <Input
                    id="url"
                    name="url"
                    type="url"
                    placeholder="https://example.com"
                    value={url}
                    onChange={(event) => setUrl(event.target.value)}
                    aria-invalid={urlError ? true : undefined}
                    autoComplete="url"
                  />
                  {urlError ? <FieldError>{urlError}</FieldError> : null}
                </Field>
                <Button type="submit" disabled={generating}>
                  {generating ? <Spinner data-icon="inline-start" /> : null}
                  {generating ? "Generating" : "Generate"}
                </Button>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>
              The latest QR code from this session.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {latest ? (
              <div className="flex flex-col items-start gap-4">
                {isTrustedQrImageUrl(latest.imageUrl) ? (
                  <img
                    src={latest.imageUrl}
                    alt={`QR code for ${latest.url}`}
                    width={300}
                    height={300}
                    className="h-auto w-full max-w-[300px] rounded-lg bg-background ring-1 ring-border"
                  />
                ) : (
                  <p className="text-sm text-destructive">
                    QR image URL is not trusted.
                  </p>
                )}
                <p className="max-w-full truncate text-sm text-muted-foreground">
                  {latest.url}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    downloadQrImage(latest.imageUrl, `qr-${latest.id}.png`)
                  }
                >
                  <Download data-icon="inline-start" />
                  Download
                </Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Generate a URL to see the QR image here.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>History</CardTitle>
          <CardDescription>Your previously generated QR codes.</CardDescription>
        </CardHeader>
        <CardContent>
          <QrHistoryTable items={history} loading={loadingHistory} />
        </CardContent>
      </Card>
    </div>
  );
}
