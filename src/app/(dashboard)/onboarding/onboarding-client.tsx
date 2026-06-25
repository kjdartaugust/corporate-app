"use client";

import { useState } from "react";
import {
  Briefcase,
  Check,
  GraduationCap,
  Laptop,
  PartyPopper,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { OnboardingTask } from "@/lib/types";

const categoryMeta: Record<
  OnboardingTask["category"],
  { label: string; icon: LucideIcon }
> = {
  paperwork: { label: "Paperwork", icon: Briefcase },
  it: { label: "IT & Access", icon: Laptop },
  training: { label: "Training", icon: GraduationCap },
  social: { label: "Meet the team", icon: PartyPopper },
};

export function OnboardingClient({ initial }: { initial: OnboardingTask[] }) {
  const [tasks, setTasks] = useState(initial);
  const done = tasks.filter((t) => t.done).length;
  const pct = Math.round((done / tasks.length) * 100);

  function toggle(id: string) {
    setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  const categories = Object.keys(categoryMeta) as OnboardingTask["category"][];

  return (
    <div className="space-y-5">
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-br from-primary to-indigo-600 p-6 text-white">
          <p className="text-sm text-white/80">Welcome to Northwind 👋</p>
          <h2 className="mt-1 text-2xl font-bold">Your first-week checklist</h2>
          <div className="mt-5 flex items-center gap-4">
            <Progress
              value={pct}
              className="bg-white/25"
              indicatorClassName="bg-white"
            />
            <span className="whitespace-nowrap text-sm font-semibold">
              {done}/{tasks.length} done
            </span>
          </div>
        </div>
      </Card>

      <div className="grid gap-5 md:grid-cols-2">
        {categories.map((cat) => {
          const meta = categoryMeta[cat];
          const items = tasks.filter((t) => t.category === cat);
          return (
            <Card key={cat}>
              <CardHeader className="flex-row items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent text-accent-foreground">
                  <meta.icon className="h-4 w-4" />
                </span>
                <CardTitle>{meta.label}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {items.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => toggle(t.id)}
                    className="flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-secondary/50"
                  >
                    <span
                      className={cn(
                        "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border transition-colors",
                        t.done
                          ? "border-success bg-success text-success-foreground"
                          : "border-muted-foreground/40"
                      )}
                    >
                      {t.done && <Check className="h-3.5 w-3.5" />}
                    </span>
                    <span>
                      <span
                        className={cn(
                          "block text-sm font-medium",
                          t.done && "text-muted-foreground line-through"
                        )}
                      >
                        {t.label}
                      </span>
                      <span className="text-xs text-muted-foreground">{t.description}</span>
                    </span>
                  </button>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
