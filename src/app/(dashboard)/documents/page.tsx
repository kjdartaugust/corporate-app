import {
  FileSpreadsheet,
  FileText,
  Globe,
  Lock,
  Presentation,
  Upload,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import {
  getCurrentUser,
  getDepartments,
  getDocuments,
  getEmployees,
} from "@/lib/data/queries";
import { formatDate } from "@/lib/utils";
import type { Document } from "@/lib/types";

const typeIcon = {
  pdf: FileText,
  doc: FileText,
  sheet: FileSpreadsheet,
  slide: Presentation,
};

const accessMeta = {
  public: { icon: Globe, label: "Company-wide", cls: "border-success/30 bg-success/15 text-success" },
  department: { icon: Users, label: "Department", cls: "border-primary/30 bg-primary/10 text-primary" },
  restricted: { icon: Lock, label: "Restricted", cls: "border-warning/30 bg-warning/15 text-warning" },
};

export default async function DocumentsPage() {
  const [documents, employees, departments, user] = await Promise.all([
    getDocuments(),
    getEmployees(),
    getDepartments(),
    getCurrentUser(),
  ]);

  // Mirror the RLS rule in the UI: a user sees public docs, their own
  // department's docs, and restricted docs only with admin/executive role.
  const canAccess = (d: Document) => {
    if (d.access === "public") return true;
    if (d.access === "department") return d.department_id === user.department_id || user.role === "admin";
    return user.role === "admin" || user.role === "executive";
  };

  const visible = documents.filter(canAccess);
  const hidden = documents.length - visible.length;

  return (
    <>
      <PageHeader
        title="Documents"
        description="Company files with department-level access control."
      >
        <Button className="gap-2">
          <Upload className="h-4 w-4" /> Upload
        </Button>
      </PageHeader>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>All documents</CardTitle>
          <span className="text-sm text-muted-foreground">
            {visible.length} accessible
            {hidden > 0 && ` · ${hidden} restricted to you`}
          </span>
        </CardHeader>
        <CardContent className="divide-y p-0">
          {visible.map((d) => {
            const Icon = typeIcon[d.type];
            const owner = employees.find((e) => e.id === d.owner_id);
            const dept = departments.find((x) => x.id === d.department_id);
            const access = accessMeta[d.access];
            return (
              <div key={d.id} className="flex flex-wrap items-center gap-4 px-5 py-3.5">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-accent text-accent-foreground">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{d.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {dept?.name ?? "General"} · {d.version} · {(d.size_kb / 1024).toFixed(1)} MB · updated {formatDate(d.updated_at)}
                  </p>
                </div>
                <div className="hidden items-center gap-2 sm:flex">
                  <Avatar src={owner?.avatar_url} name={owner?.full_name ?? "?"} size={28} />
                  <span className="text-xs text-muted-foreground">{owner?.full_name}</span>
                </div>
                <Badge className={access.cls}>
                  <access.icon className="h-3 w-3" /> {access.label}
                </Badge>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {hidden > 0 && (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Lock className="h-4 w-4" />
          {hidden} document{hidden > 1 ? "s are" : " is"} hidden by Row Level Security based on your role and department.
        </p>
      )}
    </>
  );
}
