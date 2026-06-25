import Link from "next/link";
import { ArrowRight, BarChart3, Hexagon, Lock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";

const features = [
  { icon: Users, title: "People & HR", desc: "Directory, leave, approvals and performance reviews in one place." },
  { icon: BarChart3, title: "Executive analytics", desc: "Headcount, payroll and engagement insights for leadership." },
  { icon: Lock, title: "Department privacy", desc: "Row Level Security keeps sensitive data scoped to the right teams." },
];

export default function Landing() {
  return (
    <div className="grid-bg min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Hexagon className="h-5 w-5" />
          </span>
          <span className="font-bold">Northwind</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/login">
            <Button variant="outline" size="sm">Sign in</Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6">
        <section className="py-20 text-center sm:py-28">
          <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-success" /> Enterprise workspace · v3.0
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-6xl">
            The operating system for your{" "}
            <span className="bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent">
              entire company
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-balance text-lg text-muted-foreground">
            People, HR, announcements, room booking, documents, payroll and executive
            analytics — unified in one premium, secure platform.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link href="/dashboard">
              <Button size="lg" className="gap-2">
                Enter workspace <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline">Sign in</Button>
            </Link>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Live demo — no account required.
          </p>
        </section>

        <section className="grid gap-5 pb-24 sm:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-lg border bg-card p-6 text-left shadow-sm">
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-accent text-accent-foreground">
                <f.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
