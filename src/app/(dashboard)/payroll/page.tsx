import { Banknote, PiggyBank, Receipt, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { BarSeries } from "@/components/charts";
import {
  getDepartments,
  getEmployees,
  getPayroll,
} from "@/lib/data/queries";
import { classForStatus, formatCurrency } from "@/lib/utils";

export default async function PayrollPage() {
  const [payroll, employees, departments] = await Promise.all([
    getPayroll(),
    getEmployees(),
    getDepartments(),
  ]);

  const gross = payroll.reduce((s, p) => s + p.gross, 0);
  const tax = payroll.reduce((s, p) => s + p.tax, 0);
  const benefits = payroll.reduce((s, p) => s + p.benefits, 0);
  const net = payroll.reduce((s, p) => s + p.net, 0);

  const byDept = departments.map((d) => {
    const ids = employees.filter((e) => e.department_id === d.id).map((e) => e.id);
    const total = payroll
      .filter((p) => ids.includes(p.employee_id))
      .reduce((s, p) => s + p.gross, 0);
    return { label: d.name, value: total };
  });

  return (
    <>
      <PageHeader
        title="Payroll overview"
        description="June 2026 payroll summary across the organization."
      >
        <Badge className="border-warning/30 bg-warning/15 text-warning">
          <Wallet className="h-3 w-3" /> Finance & exec only
        </Badge>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Gross payroll" value={formatCurrency(gross)} icon={Banknote} delta={6.1} />
        <StatCard label="Tax withheld" value={formatCurrency(tax)} icon={Receipt} accent="text-warning" />
        <StatCard label="Benefits" value={formatCurrency(benefits)} icon={PiggyBank} accent="text-success" />
        <StatCard label="Net disbursed" value={formatCurrency(net)} icon={Wallet} delta={5.4} />
      </div>

      <div className="grid gap-5 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Gross payroll by department</CardTitle>
          </CardHeader>
          <CardContent>
            <BarSeries data={byDept} dataKey="value" />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Cost breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            {[
              { label: "Net pay", value: net, color: "hsl(var(--success))" },
              { label: "Tax", value: tax, color: "hsl(var(--warning))" },
              { label: "Benefits", value: benefits, color: "hsl(var(--primary))" },
            ].map((row) => (
              <div key={row.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{row.label}</span>
                  <span className="font-medium">{formatCurrency(row.value)}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${(row.value / gross) * 100}%`, background: row.color }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payroll register</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase text-muted-foreground">
                <th className="px-5 py-3 font-medium">Employee</th>
                <th className="px-5 py-3 font-medium">Gross</th>
                <th className="px-5 py-3 font-medium">Tax</th>
                <th className="px-5 py-3 font-medium">Benefits</th>
                <th className="px-5 py-3 font-medium">Net</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {payroll.map((p) => {
                const emp = employees.find((e) => e.id === p.employee_id);
                return (
                  <tr key={p.id} className="hover:bg-secondary/40">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar src={emp?.avatar_url} name={emp?.full_name ?? "?"} size={30} />
                        <span className="font-medium">{emp?.full_name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">{formatCurrency(p.gross)}</td>
                    <td className="px-5 py-3 text-muted-foreground">{formatCurrency(p.tax)}</td>
                    <td className="px-5 py-3 text-muted-foreground">{formatCurrency(p.benefits)}</td>
                    <td className="px-5 py-3 font-medium">{formatCurrency(p.net)}</td>
                    <td className="px-5 py-3">
                      <Badge className={classForStatus(p.status)}>{p.status}</Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </>
  );
}
