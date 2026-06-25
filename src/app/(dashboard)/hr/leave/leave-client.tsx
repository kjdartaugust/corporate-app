"use client";

import { useState } from "react";
import { CalendarPlus, Plane } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { classForStatus, formatDate } from "@/lib/utils";
import type { Employee, LeaveRequest } from "@/lib/types";

const BALANCE = { vacation: 20, sick: 10, personal: 5 };

export function LeaveClient({
  initial,
  employees,
  user,
}: {
  initial: LeaveRequest[];
  employees: Employee[];
  user: Employee;
}) {
  const [requests, setRequests] = useState(initial);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<LeaveRequest["type"]>("vacation");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [reason, setReason] = useState("");

  const usedVacation = requests
    .filter((r) => r.employee_id === user.id && r.type === "vacation" && r.status !== "rejected")
    .reduce((s, r) => s + r.days, 0);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!start || !end) return;
    const days =
      Math.max(
        1,
        Math.round((new Date(end).getTime() - new Date(start).getTime()) / 86400000) + 1
      );
    const next: LeaveRequest = {
      id: `l-${Date.now()}`,
      employee_id: user.id,
      type,
      start_date: start,
      end_date: end,
      days,
      reason,
      status: "pending",
      approver_id: user.manager_id,
      created_at: new Date().toISOString(),
    };
    setRequests([next, ...requests]);
    setOpen(false);
    setStart("");
    setEnd("");
    setReason("");
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        {(["vacation", "sick", "personal"] as const).map((t) => {
          const total = BALANCE[t];
          const used = t === "vacation" ? usedVacation : t === "sick" ? 2 : 1;
          return (
            <Card key={t} className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium capitalize text-muted-foreground">{t}</p>
                <Plane className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="mt-2 text-2xl font-bold">
                {total - used}
                <span className="text-base font-normal text-muted-foreground"> / {total} days</span>
              </p>
              <Progress className="mt-3" value={((total - used) / total) * 100} />
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Leave requests</CardTitle>
          <Button className="gap-2" onClick={() => setOpen((o) => !o)}>
            <CalendarPlus className="h-4 w-4" /> Request leave
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {open && (
            <form
              onSubmit={submit}
              className="grid gap-3 rounded-lg border bg-secondary/40 p-4 sm:grid-cols-2"
            >
              <label className="space-y-1.5 text-sm">
                <span className="font-medium">Type</span>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as LeaveRequest["type"])}
                  className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="vacation">Vacation</option>
                  <option value="sick">Sick</option>
                  <option value="personal">Personal</option>
                  <option value="parental">Parental</option>
                </select>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="space-y-1.5 text-sm">
                  <span className="font-medium">Start</span>
                  <input
                    type="date"
                    value={start}
                    onChange={(e) => setStart(e.target.value)}
                    className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                    required
                  />
                </label>
                <label className="space-y-1.5 text-sm">
                  <span className="font-medium">End</span>
                  <input
                    type="date"
                    value={end}
                    onChange={(e) => setEnd(e.target.value)}
                    className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                    required
                  />
                </label>
              </div>
              <label className="space-y-1.5 text-sm sm:col-span-2">
                <span className="font-medium">Reason</span>
                <input
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Optional note for your manager"
                  className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </label>
              <div className="flex gap-2 sm:col-span-2">
                <Button type="submit">Submit request</Button>
                <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          )}

          <div className="divide-y">
            {requests.map((r) => {
              const emp = employees.find((e) => e.id === r.employee_id);
              return (
                <div key={r.id} className="flex flex-wrap items-center gap-3 py-3">
                  <Avatar src={emp?.avatar_url} name={emp?.full_name ?? "?"} size={38} />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{emp?.full_name}</p>
                    <p className="text-xs capitalize text-muted-foreground">
                      {r.type} · {formatDate(r.start_date)} → {formatDate(r.end_date)}
                    </p>
                  </div>
                  <span className="text-sm font-medium">{r.days}d</span>
                  <Badge className={classForStatus(r.status)}>{r.status}</Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
