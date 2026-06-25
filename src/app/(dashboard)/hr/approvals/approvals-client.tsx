"use client";

import { useState } from "react";
import { Check, CheckCircle2, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { classForStatus, formatDate } from "@/lib/utils";
import type { Employee, LeaveRequest } from "@/lib/types";

export function ApprovalsClient({
  initial,
  employees,
}: {
  initial: LeaveRequest[];
  employees: Employee[];
}) {
  const [requests, setRequests] = useState(initial);

  function decide(id: string, status: "approved" | "rejected") {
    setRequests((rs) => rs.map((r) => (r.id === id ? { ...r, status } : r)));
  }

  const pending = requests.filter((r) => r.status === "pending");
  const decided = requests.filter((r) => r.status !== "pending");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Awaiting your decision ({pending.length})
        </h2>
        {pending.length === 0 ? (
          <Card>
            <CardContent className="flex items-center gap-2 py-8 text-sm text-muted-foreground">
              <CheckCircle2 className="h-5 w-5 text-success" /> Everything is reviewed. Nice work.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {pending.map((r) => {
              const emp = employees.find((e) => e.id === r.employee_id);
              return (
                <Card key={r.id}>
                  <CardContent className="flex flex-wrap items-center gap-4 py-4">
                    <Avatar src={emp?.avatar_url} name={emp?.full_name ?? "?"} size={44} />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">{emp?.full_name}</p>
                      <p className="text-sm capitalize text-muted-foreground">
                        {r.type} · {r.days} days · {formatDate(r.start_date)} → {formatDate(r.end_date)}
                      </p>
                      {r.reason && (
                        <p className="mt-1 text-sm text-muted-foreground">“{r.reason}”</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="success" className="gap-1.5" onClick={() => decide(r.id, "approved")}>
                        <Check className="h-4 w-4" /> Approve
                      </Button>
                      <Button size="sm" variant="outline" className="gap-1.5" onClick={() => decide(r.id, "rejected")}>
                        <X className="h-4 w-4" /> Decline
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Recently decided
        </h2>
        <Card>
          <CardContent className="divide-y p-0">
            {decided.map((r) => {
              const emp = employees.find((e) => e.id === r.employee_id);
              return (
                <div key={r.id} className="flex items-center gap-3 px-5 py-3">
                  <Avatar src={emp?.avatar_url} name={emp?.full_name ?? "?"} size={34} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{emp?.full_name}</p>
                    <p className="text-xs capitalize text-muted-foreground">
                      {r.type} · {r.days}d
                    </p>
                  </div>
                  <Badge className={classForStatus(r.status)}>{r.status}</Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
