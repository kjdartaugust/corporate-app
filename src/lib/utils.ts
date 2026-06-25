import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string | Date, opts?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    ...opts,
  }).format(new Date(date));
}

export function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function relativeTime(date: string | Date) {
  const d = new Date(date).getTime();
  const diff = Date.now() - d;
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(date);
}

export function classForStatus(status: string) {
  const map: Record<string, string> = {
    approved: "bg-success/15 text-success border-success/30",
    active: "bg-success/15 text-success border-success/30",
    completed: "bg-success/15 text-success border-success/30",
    paid: "bg-success/15 text-success border-success/30",
    pending: "bg-warning/15 text-warning border-warning/30",
    "in-review": "bg-warning/15 text-warning border-warning/30",
    draft: "bg-muted text-muted-foreground border-border",
    rejected: "bg-destructive/15 text-destructive border-destructive/30",
    declined: "bg-destructive/15 text-destructive border-destructive/30",
  };
  return map[status] ?? "bg-muted text-muted-foreground border-border";
}
