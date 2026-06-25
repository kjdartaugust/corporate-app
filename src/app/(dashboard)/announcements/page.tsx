import { PageHeader } from "@/components/ui/page-header";
import {
  getAnnouncements,
  getCurrentUser,
  getEmployees,
} from "@/lib/data/queries";
import { AnnouncementsClient } from "./announcements-client";

export default async function AnnouncementsPage() {
  const [announcements, employees, user] = await Promise.all([
    getAnnouncements(),
    getEmployees(),
    getCurrentUser(),
  ]);

  return (
    <>
      <PageHeader
        title="Company news"
        description="Announcements, updates and what's happening across Northwind."
      />
      <AnnouncementsClient initial={announcements} employees={employees} user={user} />
    </>
  );
}
