"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Mail, MapPin, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { cn, classForStatus } from "@/lib/utils";
import type { Department, Employee } from "@/lib/types";

export function DirectoryClient({
  employees,
  departments,
}: {
  employees: Employee[];
  departments: Department[];
}) {
  const [query, setQuery] = useState("");
  const [dept, setDept] = useState<string>("all");

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return employees.filter((e) => {
      const matchesDept = dept === "all" || e.department_id === dept;
      const matchesQuery =
        !q ||
        e.full_name.toLowerCase().includes(q) ||
        e.title.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q);
      return matchesDept && matchesQuery;
    });
  }, [employees, query, dept]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, title or email…"
            className="h-10 w-full rounded-md border bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          <FilterChip active={dept === "all"} onClick={() => setDept("all")}>
            All
          </FilterChip>
          {departments.map((d) => (
            <FilterChip key={d.id} active={dept === d.id} onClick={() => setDept(d.id)}>
              {d.name}
            </FilterChip>
          ))}
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        {filtered.length} {filtered.length === 1 ? "person" : "people"}
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((e) => {
          const d = departments.find((x) => x.id === e.department_id);
          return (
            <Link key={e.id} href={`/directory/${e.id}`}>
              <Card className="group h-full p-5 transition-all hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-start justify-between">
                  <Avatar src={e.avatar_url} name={e.full_name} size={52} />
                  <Badge className={classForStatus(e.status)}>{e.status}</Badge>
                </div>
                <h3 className="mt-3 font-semibold leading-tight group-hover:text-primary">
                  {e.full_name}
                </h3>
                <p className="text-sm text-muted-foreground">{e.title}</p>
                <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                  <p className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ background: d?.color }} />
                    {d?.name}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" /> {e.location}
                  </p>
                  <p className="flex items-center gap-1.5 truncate">
                    <Mail className="h-3.5 w-3.5" /> {e.email}
                  </p>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-muted-foreground hover:bg-secondary"
      )}
    >
      {children}
    </button>
  );
}
