import Link from "next/link";
import { ArrowUpRight, Users } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AvatarGroup } from "@/components/ui/avatar";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { getDepartments, getEmployees } from "@/lib/data/queries";
import { formatCurrency } from "@/lib/utils";

export default async function DepartmentsPage() {
  const [departments, employees] = await Promise.all([
    getDepartments(),
    getEmployees(),
  ]);

  return (
    <>
      <PageHeader
        title="Departments & roles"
        description="Org structure, leadership and team composition."
      >
        <Button variant="outline">Manage roles</Button>
      </PageHeader>

      <div className="grid gap-5 md:grid-cols-2">
        {departments.map((d) => {
          const members = employees.filter((e) => e.department_id === d.id);
          const lead = employees.find((e) => e.id === d.lead_id);
          return (
            <Card key={d.id} className="overflow-hidden">
              <div className="h-1.5" style={{ background: d.color }} />
              <CardHeader className="flex-row items-start justify-between">
                <div className="flex items-start gap-3">
                  <span
                    className="grid h-11 w-11 place-items-center rounded-lg text-white"
                    style={{ background: d.color }}
                  >
                    <Users className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-semibold">{d.name}</h3>
                    <p className="text-sm text-muted-foreground">{d.description}</p>
                  </div>
                </div>
                <Badge className="border-transparent bg-secondary text-secondary-foreground">
                  {members.length} people
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-secondary/60 p-3">
                    <p className="text-xs text-muted-foreground">Annual budget</p>
                    <p className="font-semibold">{formatCurrency(d.budget)}</p>
                  </div>
                  <div className="rounded-lg bg-secondary/60 p-3">
                    <p className="text-xs text-muted-foreground">Department lead</p>
                    <p className="truncate font-semibold">{lead?.full_name ?? "—"}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <AvatarGroup
                    people={members.map((m) => ({ name: m.full_name, avatar_url: m.avatar_url }))}
                    max={6}
                  />
                  <Link
                    href={`/directory?dept=${d.id}`}
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                  >
                    View team <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
}
