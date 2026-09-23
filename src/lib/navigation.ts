export const modules = [
  {
    href: "/qr",
    label: "QR Codes",
    description:
      "Generate and export QR codes from URLs, plus history you can download later.",
    enabled: true,
    group: "featured",
    icon: "qr",
    sidebarHint: "URL / generator",
  },
  {
    href: "/incidents",
    label: "Incidents",
    description:
      "Notification escalation, triage paging, and post-incident status summaries.",
    enabled: false,
    group: "featured",
    icon: "incidents",
  },
  {
    href: "/uptime",
    label: "Uptime Monitor",
    description:
      "Heartbeat ping diagnostics, regional latency watches, and public uptime pages.",
    enabled: false,
    group: "featured",
    icon: "uptime",
  },
  {
    href: "/api-tester",
    label: "API Tester & Mock Runner",
    description:
      "Lightweight HTTP/2 runner with JSON schema validation, latency watermarks, and JWT auth testing.",
    enabled: false,
    group: "additional",
    icon: "api",
    footnote: "REST / GraphQL",
    shortLabel: "API Tester",
  },
  {
    href: "/hash",
    label: "Hash & Cryptographic Suite",
    description:
      "Client-side digest calculation, SHA-256, HMAC key signing, and Base64 format conversion.",
    enabled: false,
    group: "additional",
    icon: "hash",
    footnote: "SHA-256 · HMAC",
    shortLabel: "Hash & Encrypt",
  },
] as const;

export type Module = (typeof modules)[number];
