import { prisma } from "@/lib/db";

const QR_API_BASE = "https://api.qrserver.com/v1/create-qr-code/";
const QR_API_TIMEOUT_MS = 8000;

export class QrServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "QrServiceError";
  }
}

type QrImageOptions = {
  size?: number;
  color?: string;
  ecc?: "L" | "M" | "Q" | "H";
  margin?: number;
};

function buildQrImageUrl(url: string, options: QrImageOptions = {}) {
  const size = options.size ?? 300;
  const imageUrl = new URL(QR_API_BASE);
  imageUrl.searchParams.set("size", `${size}x${size}`);
  imageUrl.searchParams.set("data", url);
  imageUrl.searchParams.set("format", "png");
  imageUrl.searchParams.set("bgcolor", "ffffff");

  if (options.color) {
    imageUrl.searchParams.set("color", options.color);
  }
  if (options.ecc) {
    imageUrl.searchParams.set("ecc", options.ecc);
  }
  if (options.margin !== undefined) {
    imageUrl.searchParams.set("margin", String(options.margin));
  }

  return imageUrl.toString();
}

async function assertQrApiAvailable(imageUrl: string) {
  try {
    const response = await fetch(imageUrl, {
      method: "GET",
      signal: AbortSignal.timeout(QR_API_TIMEOUT_MS),
    });

    if (!response.ok) {
      throw new QrServiceError("QR service returned an error. Try again later.");
    }
  } catch (error) {
    if (error instanceof QrServiceError) {
      throw error;
    }

    throw new QrServiceError(
      "QR service is unavailable or timed out. Try again later.",
    );
  }
}

export async function generateQr({
  url,
  userId,
  size,
  color,
  ecc,
  margin,
}: {
  url: string;
  userId: string;
  size?: number;
  color?: string;
  ecc?: "L" | "M" | "Q" | "H";
  margin?: number;
}) {
  const imageUrl = buildQrImageUrl(url, { size, color, ecc, margin });
  await assertQrApiAvailable(imageUrl);

  return prisma.qrCode.create({
    data: {
      url,
      imageUrl,
      createdBy: userId,
    },
  });
}

export async function getQrHistory(userId: string) {
  return prisma.qrCode.findMany({
    where: { createdBy: userId },
    orderBy: { createdAt: "desc" },
  });
}
