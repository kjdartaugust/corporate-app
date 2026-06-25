import Link from "next/link";
import {
  ArrowUpRight,
  Building2,
  CalendarClock,
  CheckCircle2,
  DollarSign,
  Plane,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { PageHeader } from "@/components/ui/page-header";
import { AreaTrend, Donut } from "@/components/charts";
import {
  getAnnouncements,
  getBookings,
  getCurrentUser,
  getDepartments,
  getEmployees,
  getLeaveRequests,
  getPayroll,
} from "@/lib/data/queries";
import { employeeById, rooms } from "@/lib/data/demo";
import { classForStatus, formatCurrency, relativeTime } from "@/lib/utils";

const headcountTrend = [
  { label: "Jan", value: 18 },
  { label: "Feb", value: 19 },
  { label: "Mar", value: 21 },
  { label: "Apr", value: 22 },
  { label: "May", value: 23 },
  { label: "Jun", value: 24 },
];

export default async function DashboardPage() {
  const [user, employees, departments, leave, payroll, announcements, bookings] =
    await Promise.all([
      getCurrentUser(),
      getEmployees(),
      getDepartments(),
      getLeaveRequests(),
      getPayroll(),
      getAnnouncements(),
      getBookings(),
    ]);

  const monthlyPayroll = payroll.reduce((s, p) => s + p.gross, 0);
  const pendingLeave = leave.filter((l) => l.status === "pending");
  const deptDonut = departments.map((d) => ({
    name: d.name,
    value: employees.filter((e) => e.department_id === d.id).length,
    color: d.color,
  }));

  return (
    <>
      <PageHeader
        title={`Welcome back, ${user.full_name.split(" ")[0]}`}
        description="Here's what's happening across the company today."
      >
        <Badge className="bg-accent text-accent-foreground border-transparent">
          {user.role.charAt(0).toUpperCase() + user.role.slice(1)} access
        </Badge>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total headcount" value={String(employees.length)} icon={Users} delta={4.3} />
        <StatCard label="Departments" value={String(departments.length)} icon={Building2} delta={0} />
        <StatCard label="Monthly payroll" value={formatCurrency(monthlyPayroll)} icon={DollarSign} delta={6.1} accent="text-success" />
        <StatCard label="Pending leave" value={String(pendingLeave.length)} icon={Plane} delta={-2} accent="text-warning" />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Headcount growth</CardTitle>
              <p className="text-sm text-muted-foreground">Active employees · last 6 months</p>
            </div>
            <Badge className="border-success/30 bg-success/15 text-success">
              <ArrowUpRight className="h-3 w-3" /> +33% YoY
            </Badge>
          </CardHeader>
          <CardContent>
            <AreaTrend data={headcountTrend} dataKey="value" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>By department</CardTitle>
            <p className="text-sm text-muted-foreground">Distribution of {employees.length} people</p>
          </CardHeader>
          <CardContent>
            <Donut data={deptDonut} />
            <div className="mt-2 grid grid-cols-2 gap-2">
              {deptDonut.map((d) => (
                <div key={d.name} className="flex items-center gap-2 text-xs">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} />
                  <span className="text-muted-foreground">{d.name}</span>
                  <span className="ml-auto font-medium">{d.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Latest announcements</CardTitle>
            <Link href="/announcements" className="text-sm font-medium text-primary hover:underline">
              View all
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {announcements.slice(0, 3).map((a) => {
              const author = employeeById(a.author_id);
              return (
                <div key={a.id} className="flex gap-3">
                  <Avatar src={author?.avatar_url} name={author?.full_name ?? "?"} size={40} />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-medium">{a.title}</p>
                      {a.pinned && <Badge className="border-primary/30 bg-primary/10 text-primary">Pinned</Badge>}
                    </div>
                    <p className="line-clamp-2 text-sm text-muted-foreground">{a.body}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {author?.full_name} · {relativeTime(a.created_at)}
                    </p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <div className="space-y-5">
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Pending approvals</CardTitle>
              <Link href="/hr/approvals" className="text-sm font-medium text-primary hover:underline">
                Review
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {pendingLeave.slice(0, 3).map((l) => {
                const emp = employeeById(l.employee_id);
                return (
                  <div key={l.id} className="flex items-center gap-3">
                    <Avatar src={emp?.avatar_url} name={emp?.full_name ?? "?"} size={34} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{emp?.full_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {l.type} · {l.days}d
                      </p>
                    </div>
                    <Badge className={classForStatus(l.status)}>{l.status}</Badge>
                  </div>
                );
              })}
              {pendingLeave.length === 0 && (
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-success" /> All caught up.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Today&apos;s meetings</CardTitle>
              <Link href="/rooms" className="text-sm font-medium text-primary hover:underline">
                Rooms
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {bookings.slice(0, 3).map((b) => {
                const room = rooms.find((r) => r.id === b.room_id);
                return (
                  <div key={b.id} className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-md bg-accent text-accent-foreground">
                      <CalendarClock className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{b.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {room?.name} ·{" "}
                        {new Date(b.start).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
