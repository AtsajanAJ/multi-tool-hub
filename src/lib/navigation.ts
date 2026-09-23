export const modules = [
  {
    href: "/qr",
    label: "QR Codes",
    description: "Generate QR codes from URLs",
    enabled: true,
  },
  {
    href: "/incidents",
    label: "Incidents",
    description: "Notification system",
    enabled: false,
  },
  {
    href: "/uptime",
    label: "Uptime",
    description: "Status dashboard",
    enabled: false,
  },
] as const;
