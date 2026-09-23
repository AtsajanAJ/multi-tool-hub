import { signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";

async function logout() {
  "use server";
  await signOut({ redirectTo: "/login" });
}

export default function LogoutPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <form action={logout}>
        <Button type="submit">Sign out</Button>
      </form>
    </main>
  );
}
