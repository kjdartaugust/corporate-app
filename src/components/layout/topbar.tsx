"use client";

import { Bell, Menu, Search } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { ThemeToggle } from "./theme-toggle";
import type { Employee } from "@/lib/types";

export function Topbar({
  user,
  onMenu,
}: {
  user: Employee;
  onMenu?: () => void;
}) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b glass px-4 lg:px-6">
      <button className="lg:hidden" onClick={onMenu} aria-label="Open menu">
        <Menu className="h-5 w-5" />
      </button>

      <div className="relative hidden max-w-md flex-1 sm:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          placeholder="Search people, documents, rooms…"
          className="h-9 w-full rounded-md border bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <ThemeToggle />
        <button
          className="relative grid h-9 w-9 place-items-center rounded-md hover:bg-secondary"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
        </button>
        <div className="ml-1 flex items-center gap-2.5 pl-1">
          <Avatar src={user.avatar_url} name={user.full_name} size={36} />
          <div className="hidden leading-tight md:block">
            <p className="text-sm font-semibold">{user.full_name}</p>
            <p className="text-xs text-muted-foreground">{user.title}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
