import { cn } from "@/lib/utils";
import { LucideIcon, TrendingDown, TrendingUp } from "lucide-react";
import { Card } from "./card";

export function StatCard({
  label,
  value,
  icon: Icon,
  delta,
  accent = "text-primary",
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  delta?: number;
  accent?: string;
}) {
  const up = (delta ?? 0) >= 0;
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold tracking-tight">{value}</p>
        </div>
        <span className={cn("rounded-lg bg-accent/60 p-2.5", accent)}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
      {delta !== undefined && (
        <div className="mt-3 flex items-center gap-1 text-xs">
          <span
            className={cn(
              "inline-flex items-center gap-0.5 font-semibold",
              up ? "text-success" : "text-destructive"
            )}
          >
            {up ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
            {Math.abs(delta)}%
          </span>
          <span className="text-muted-foreground">vs last quarter</span>
        </div>
      )}
    </Card>
  );
}
