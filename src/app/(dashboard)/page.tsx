import { ToolsBoard } from "@/components/shared/tools-board";
import { getQrHistory } from "@/lib/modules/qr/service";
import { requireUserId } from "@/lib/require-user";

export default async function DashboardPage() {
  const userId = await requireUserId();
  const history = userId ? await getQrHistory(userId) : [];

  const activity = history.slice(0, 4).map((item) => ({
    title: "QR Code generated",
    detail: item.url,
    when: new Date(item.createdAt).toLocaleString(),
    status: "Success",
  }));

  return <ToolsBoard activity={activity} />;
}
