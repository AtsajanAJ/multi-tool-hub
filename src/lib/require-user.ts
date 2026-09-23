import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function requireUserId() {
  const session = await auth();
  if (!session?.user) {
    return null;
  }

  if (session.user.id) {
    return session.user.id;
  }

  if (!session.user.email) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  return user?.id ?? null;
}
