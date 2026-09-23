import { NextResponse } from "next/server";
import { generateQr, QrServiceError } from "@/lib/modules/qr/service";
import { generateQrSchema } from "@/lib/modules/qr/validation";
import { requireUserId } from "@/lib/require-user";
import { parseJsonBody } from "@/lib/validations/http";

export async function POST(request: Request) {
  const userId = await requireUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = await parseJsonBody(generateQrSchema, request);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const qrCode = await generateQr({
      url: parsed.data.url,
      userId,
    });

    return NextResponse.json(qrCode, { status: 201 });
  } catch (error) {
    if (error instanceof QrServiceError) {
      return NextResponse.json({ error: error.message }, { status: 502 });
    }

    return NextResponse.json(
      { error: "Failed to generate QR code" },
      { status: 500 },
    );
  }
}
