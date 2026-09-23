import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { signIn, auth } from "@/lib/auth";
import { BrandMark } from "@/components/shared/brand-mark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

async function login(formData: FormData) {
  "use server";

  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect("/login?error=InvalidCredentials");
    }
    throw error;
  }
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await auth();
  if (session?.user) {
    redirect("/");
  }

  const { error } = await searchParams;
  const year = new Date().getFullYear();

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="flex h-16 items-center justify-between px-6 md:px-10">
        <div className="flex items-center gap-3">
          <BrandMark size={22} />
          <span className="font-heading text-2xl tracking-tight">
            Multi-Tool Hub
          </span>
          <span className="hidden rounded-full border border-border px-2.5 py-0.5 text-[11px] font-medium tracking-[0.12em] text-muted-foreground uppercase sm:inline">
            Multi-tool
          </span>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        <div className="mb-8 flex flex-col items-center gap-5 text-center">
          <BrandMark size={40} />
          <div className="flex flex-col gap-3">
            <h1 className="font-heading text-4xl tracking-tight sm:text-5xl">
              Welcome to Multi-Tool Hub
            </h1>
            <p className="max-w-md text-base leading-relaxed text-muted-foreground">
              Your unified workspace for digital utilities, productivity tools,
              and internal workflows.
            </p>
          </div>
        </div>

        <div className="w-full max-w-[420px] rounded-2xl bg-[#efe9de] p-6 sm:p-8">
          <form action={login} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@company.com"
                className="h-11 rounded-lg border-transparent bg-background px-3"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="h-11 rounded-lg border-transparent bg-background px-3"
              />
            </div>
            {error ? (
              <p className="text-sm text-destructive">
                Invalid email or password.
              </p>
            ) : null}
            <Button
              type="submit"
              className="h-11 rounded-lg bg-[#8f4a32] text-white hover:bg-[#7a3e2a]"
            >
              Sign in
            </Button>
          </form>
        </div>

        <p className="mt-10 text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
          Modular workspace & utility platform
        </p>
      </main>

      <footer className="px-6 py-6 text-sm text-muted-foreground md:px-10">
        <p>© {year} Multi-Tool Hub. Internal use only.</p>
      </footer>
    </div>
  );
}
