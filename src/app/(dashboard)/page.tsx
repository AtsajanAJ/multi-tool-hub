import Link from "next/link";
import { modules } from "@/lib/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-heading text-4xl tracking-tight text-foreground">
          Tools
        </h1>
        <p className="text-base text-muted-foreground">
          Choose a module from the sidebar. More tools will appear here as they
          are added.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {modules.map((item) => {
          const card = (
            <Card className="h-full">
              <CardHeader>
                <CardTitle>{item.label}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {item.enabled ? "Open module" : "Coming soon"}
                </p>
              </CardContent>
            </Card>
          );

          if (!item.enabled) {
            return <div key={item.href}>{card}</div>;
          }

          return (
            <Link key={item.href} href={item.href} className="block">
              {card}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
