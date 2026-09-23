import { prisma } from "@/lib/db";

const QR_API_BASE = "https://api.qrserver.com/v1/create-qr-code/";
const QR_API_TIMEOUT_MS = 8000;

export class QrServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "QrServiceError";
  }
}

function buildQrImageUrl(url: string) {
  const imageUrl = new URL(QR_API_BASE);
  imageUrl.searchParams.set("size", "300x300");
  imageUrl.searchParams.set("data", url);
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
}: {
  url: string;
  userId: string;
}) {
  const imageUrl = buildQrImageUrl(url);
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
