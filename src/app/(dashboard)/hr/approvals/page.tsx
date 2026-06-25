import { PageHeader } from "@/components/ui/page-header";
import { getEmployees, getLeaveRequests } from "@/lib/data/queries";
import { ApprovalsClient } from "./approvals-client";

export default async function ApprovalsPage() {
  const [requests, employees] = await Promise.all([
    getLeaveRequests(),
    getEmployees(),
  ]);

  return (
    <>
      <PageHeader
        title="Approvals"
        description="Review and action time-off requests from your reports."
      />
      <ApprovalsClient initial={requests} employees={employees} />
    </>
  );
}
