import { Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getEmployees, getReviews } from "@/lib/data/queries";
import { classForStatus, formatDate } from "@/lib/utils";

export default async function ReviewsPage() {
  const [reviews, employees] = await Promise.all([
    getReviews(),
    getEmployees(),
  ]);

  const avg =
    reviews.reduce((s, r) => s + r.rating, 0) / (reviews.length || 1);
  const completed = reviews.filter((r) => r.status === "completed").length;

  return (
    <>
      <PageHeader
        title="Performance reviews"
        description="H1 2026 review cycle progress and ratings."
      >
        <Button>Start review cycle</Button>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">Average rating</p>
          <p className="mt-1 text-2xl font-bold">{avg.toFixed(1)} / 5.0</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">Cycle completion</p>
          <p className="mt-1 text-2xl font-bold">
            {Math.round((completed / reviews.length) * 100)}%
          </p>
          <Progress className="mt-3" value={(completed / reviews.length) * 100} />
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">Reviews in cycle</p>
          <p className="mt-1 text-2xl font-bold">{reviews.length}</p>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reviews</CardTitle>
        </CardHeader>
        <CardContent className="divide-y p-0">
          {reviews.map((r) => {
            const emp = employees.find((e) => e.id === r.employee_id);
            const reviewer = employees.find((e) => e.id === r.reviewer_id);
            return (
              <div key={r.id} className="flex flex-wrap items-center gap-4 px-5 py-4">
                <Avatar src={emp?.avatar_url} name={emp?.full_name ?? "?"} size={44} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{emp?.full_name}</p>
                    <Badge className={classForStatus(r.status)}>{r.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{r.summary}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Reviewer: {reviewer?.full_name} · {r.period} · {formatDate(r.created_at)}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < r.rating ? "fill-warning text-warning" : "text-muted-foreground/40"}`}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </>
  );
}
