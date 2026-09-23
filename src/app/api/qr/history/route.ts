import { NextResponse } from "next/server";
import { getQrHistory } from "@/lib/modules/qr/service";
import { requireUserId } from "@/lib/require-user";

export async function GET() {
  const userId = await requireUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const history = await getQrHistory(userId);
  return NextResponse.json(history);
}
