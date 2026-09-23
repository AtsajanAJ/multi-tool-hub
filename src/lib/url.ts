export function isHttpUrl(value: string) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function isTrustedQrImageUrl(value: string) {
  try {
    const parsed = new URL(value);
    return (
      parsed.protocol === "https:" && parsed.hostname === "api.qrserver.com"
    );
  } catch {
    return false;
  }
}
