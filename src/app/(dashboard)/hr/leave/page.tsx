import { PageHeader } from "@/components/ui/page-header";
import {
  getCurrentUser,
  getEmployees,
  getLeaveRequests,
} from "@/lib/data/queries";
import { LeaveClient } from "./leave-client";

export default async function LeavePage() {
  const [requests, employees, user] = await Promise.all([
    getLeaveRequests(),
    getEmployees(),
    getCurrentUser(),
  ]);

  return (
    <>
      <PageHeader
        title="Leave & time off"
        description="Track balances and submit time-off requests."
      />
      <LeaveClient initial={requests} employees={employees} user={user} />
    </>
  );
}
