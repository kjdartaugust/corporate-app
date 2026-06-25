import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { getDepartments, getEmployees } from "@/lib/data/queries";
import { DirectoryClient } from "./directory-client";

export default async function DirectoryPage() {
  const [employees, departments] = await Promise.all([
    getEmployees(),
    getDepartments(),
  ]);

  return (
    <>
      <PageHeader
        title="Employee directory"
        description="Find and connect with everyone across the company."
      >
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" /> Add employee
        </Button>
      </PageHeader>
      <DirectoryClient employees={employees} departments={departments} />
    </>
  );
}
