import { Activity, DollarSign, TrendingUp, UserMinus, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { AreaTrend, BarSeries, Donut } from "@/components/charts";
import { getDepartments, getEmployees, getPayroll } from "@/lib/data/queries";
import { formatCurrency } from "@/lib/utils";

const revenueTrend = [
  { label: "Q1 '25", value: 4.1 },
  { label: "Q2 '25", value: 4.6 },
  { label: "Q3 '25", value: 5.2 },
  { label: "Q4 '25", value: 6.0 },
  { label: "Q1 '26", value: 6.8 },
  { label: "Q2 '26", value: 8.0 },
];

const engagementTrend = [
  { label: "Jan", value: 72 },
  { label: "Feb", value: 74 },
  { label: "Mar", value: 71 },
  { label: "Apr", value: 78 },
  { label: "May", value: 81 },
  { label: "Jun", value: 84 },
];

export default async function AnalyticsPage() {
  const [employees, departments, payroll] = await Promise.all([
    getEmployees(),
    getDepartments(),
    getPayroll(),
  ]);

  const annualPayroll = payroll.reduce((s, p) => s + p.gross, 0) * 12;
  const headcountByDept = departments.map((d) => ({
    label: d.name,
    value: employees.filter((e) => e.department_id === d.id).length,
  }));
  const tenureDonut = [
    { name: "0–1 yr", value: 5, color: "#6366f1" },
    { name: "1–3 yr", value: 6, color: "#ec4899" },
    { name: "3–5 yr", value: 3, color: "#f59e0b" },
    { name: "5+ yr", value: 2, color: "#10b981" },
  ];

  return (
    <>
      <PageHeader
        title="Executive analytics"
        description="Company-wide health metrics for leadership."
      >
        <Badge className="border-primary/30 bg-primary/10 text-primary">Live · Q2 2026</Badge>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="ARR" value="$8.0M" icon={DollarSign} delta={17.6} accent="text-success" />
        <StatCard label="Headcount" value={String(employees.length)} icon={Users} delta={4.3} />
        <StatCard label="Annual payroll" value={formatCurrency(annualPayroll)} icon={TrendingUp} delta={6.1} />
        <StatCard label="Attrition (TTM)" value="6.2%" icon={UserMinus} delta={-1.4} accent="text-warning" />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue (ARR, $M)</CardTitle>
            <p className="text-sm text-muted-foreground">Trailing six quarters</p>
          </CardHeader>
          <CardContent>
            <AreaTrend data={revenueTrend} dataKey="value" color="hsl(var(--success))" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tenure mix</CardTitle>
          </CardHeader>
          <CardContent>
            <Donut data={tenureDonut} />
            <div className="mt-2 grid grid-cols-2 gap-2">
              {tenureDonut.map((d) => (
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

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Headcount by department</CardTitle>
          </CardHeader>
          <CardContent>
            <BarSeries data={headcountByDept} dataKey="value" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Employee engagement</CardTitle>
            <Badge className="border-success/30 bg-success/15 text-success">
              <Activity className="h-3 w-3" /> 84% favorable
            </Badge>
          </CardHeader>
          <CardContent>
            <AreaTrend data={engagementTrend} dataKey="value" color="hsl(var(--primary))" />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
