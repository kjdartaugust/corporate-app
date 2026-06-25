import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Briefcase,
  CalendarDays,
  Mail,
  MapPin,
  Phone,
  Star,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  getDepartments,
  getEmployee,
  getEmployees,
  getReviews,
} from "@/lib/data/queries";
import { classForStatus, formatDate } from "@/lib/utils";

export default async function ProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const [employee, employees, departments, reviews] = await Promise.all([
    getEmployee(params.id),
    getEmployees(),
    getDepartments(),
    getReviews(),
  ]);

  if (!employee) notFound();

  const dept = departments.find((d) => d.id === employee.department_id);
  const manager = employees.find((e) => e.id === employee.manager_id);
  const reports = employees.filter((e) => e.manager_id === employee.id);
  const review = reviews.find((r) => r.employee_id === employee.id);

  return (
    <>
      <Link
        href="/directory"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to directory
      </Link>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardContent className="flex flex-col items-center pt-6 text-center">
            <Avatar src={employee.avatar_url} name={employee.full_name} size={96} />
            <h2 className="mt-4 text-xl font-bold">{employee.full_name}</h2>
            <p className="text-sm text-muted-foreground">{employee.title}</p>
            <Badge className={`mt-3 ${classForStatus(employee.status)}`}>
              {employee.status}
            </Badge>
            <div className="mt-5 grid w-full gap-2.5 text-left text-sm">
              <Info icon={Mail} value={employee.email} />
              <Info icon={Phone} value={employee.phone} />
              <Info icon={MapPin} value={employee.location} />
              <Info icon={Briefcase} value={dept?.name ?? "—"} />
              <Info icon={CalendarDays} value={`Joined ${formatDate(employee.start_date)}`} />
            </div>
            <div className="mt-5 flex w-full gap-2">
              <Button className="flex-1 gap-2">
                <Mail className="h-4 w-4" /> Message
              </Button>
              <Button variant="outline" className="flex-1">
                Org chart
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-5 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{employee.bio}</p>
              <div className="flex flex-wrap gap-2">
                {employee.skills.map((s) => (
                  <Badge key={s} className="border-transparent bg-secondary text-secondary-foreground">
                    {s}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-5 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Reporting</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">Manager</p>
                  {manager ? (
                    <Link href={`/directory/${manager.id}`} className="mt-1.5 flex items-center gap-2.5 hover:text-primary">
                      <Avatar src={manager.avatar_url} name={manager.full_name} size={34} />
                      <div>
                        <p className="text-sm font-medium">{manager.full_name}</p>
                        <p className="text-xs text-muted-foreground">{manager.title}</p>
                      </div>
                    </Link>
                  ) : (
                    <p className="mt-1.5 text-sm text-muted-foreground">Executive leadership</p>
                  )}
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Direct reports ({reports.length})
                  </p>
                  <div className="mt-1.5 space-y-1.5">
                    {reports.length === 0 && (
                      <p className="text-sm text-muted-foreground">None</p>
                    )}
                    {reports.map((r) => (
                      <Link key={r.id} href={`/directory/${r.id}`} className="flex items-center gap-2.5 hover:text-primary">
                        <Avatar src={r.avatar_url} name={r.full_name} size={30} />
                        <span className="text-sm">{r.full_name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Latest review</CardTitle>
              </CardHeader>
              <CardContent>
                {review ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{review.period}</span>
                      <Badge className={classForStatus(review.status)}>{review.status}</Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < review.rating ? "fill-warning text-warning" : "text-muted-foreground/40"}`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">{review.summary}</p>
                    <p className="text-xs text-muted-foreground">
                      {review.goals_met} goals met
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No reviews on record.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}

function Info({
  icon: Icon,
  value,
}: {
  icon: typeof Mail;
  value: string;
}) {
  return (
    <p className="flex items-center gap-2.5 text-muted-foreground">
      <Icon className="h-4 w-4 shrink-0" />
      <span className="truncate text-foreground">{value}</span>
    </p>
  );
}
