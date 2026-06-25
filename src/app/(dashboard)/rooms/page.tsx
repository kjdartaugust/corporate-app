import { PageHeader } from "@/components/ui/page-header";
import {
  getBookings,
  getCurrentUser,
  getEmployees,
  getRooms,
} from "@/lib/data/queries";
import { RoomsClient } from "./rooms-client";

export default async function RoomsPage() {
  const [rooms, bookings, employees, user] = await Promise.all([
    getRooms(),
    getBookings(),
    getEmployees(),
    getCurrentUser(),
  ]);

  return (
    <>
      <PageHeader
        title="Meeting rooms"
        description="Check availability and book a space for your next meeting."
      />
      <RoomsClient
        rooms={rooms}
        initialBookings={bookings}
        employees={employees}
        user={user}
      />
    </>
  );
}
