"use client";

import { useState } from "react";
import { Users, Wifi } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Employee, MeetingRoom, RoomBooking } from "@/lib/types";

const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
const fmtHour = (h: number) =>
  `${((h + 11) % 12) + 1}${h < 12 ? "am" : "pm"}`;

export function RoomsClient({
  rooms,
  initialBookings,
  employees,
  user,
}: {
  rooms: MeetingRoom[];
  initialBookings: RoomBooking[];
  employees: Employee[];
  user: Employee;
}) {
  const [bookings, setBookings] = useState(initialBookings);
  const today = "2026-06-24";

  function hourOf(iso: string) {
    return new Date(iso).getHours();
  }

  function bookingAt(roomId: string, hour: number) {
    return bookings.find(
      (b) =>
        b.room_id === roomId &&
        hourOf(b.start) <= hour &&
        hourOf(b.end) > hour
    );
  }

  function book(roomId: string, hour: number) {
    if (bookingAt(roomId, hour)) return;
    const next: RoomBooking = {
      id: `b-${Date.now()}`,
      room_id: roomId,
      organizer_id: user.id,
      title: "New meeting",
      start: `${today}T${String(hour).padStart(2, "0")}:00:00`,
      end: `${today}T${String(hour + 1).padStart(2, "0")}:00:00`,
      attendees: 2,
    };
    setBookings([...bookings, next]);
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rooms.map((r) => (
          <Card key={r.id} className="p-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold">{r.name}</p>
              <Badge className="border-transparent bg-secondary text-secondary-foreground">
                <Users className="h-3 w-3" /> {r.capacity}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">{r.location}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {r.amenities.map((a) => (
                <span
                  key={a}
                  className="inline-flex items-center gap-1 rounded bg-accent/60 px-1.5 py-0.5 text-[11px] text-accent-foreground"
                >
                  <Wifi className="h-3 w-3" /> {a}
                </span>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Today&apos;s schedule</CardTitle>
          <p className="text-sm text-muted-foreground">
            Click an open slot to book · {today}
          </p>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <div className="min-w-[760px]">
            <div className="grid grid-cols-[120px_repeat(10,1fr)] gap-1">
              <div />
              {HOURS.map((h) => (
                <div key={h} className="pb-2 text-center text-xs text-muted-foreground">
                  {fmtHour(h)}
                </div>
              ))}
              {rooms.map((r) => (
                <Row
                  key={r.id}
                  room={r}
                  hours={HOURS}
                  bookingAt={bookingAt}
                  employees={employees}
                  onBook={book}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Row({
  room,
  hours,
  bookingAt,
  employees,
  onBook,
}: {
  room: MeetingRoom;
  hours: number[];
  bookingAt: (roomId: string, hour: number) => RoomBooking | undefined;
  employees: Employee[];
  onBook: (roomId: string, hour: number) => void;
}) {
  return (
    <>
      <div className="flex items-center text-sm font-medium">{room.name}</div>
      {hours.map((h) => {
        const b = bookingAt(room.id, h);
        const isStart = b && new Date(b.start).getHours() === h;
        const organizer = b && employees.find((e) => e.id === b.organizer_id);
        return (
          <button
            key={h}
            onClick={() => onBook(room.id, h)}
            disabled={!!b}
            title={b ? `${b.title} · ${organizer?.full_name}` : "Available"}
            className={cn(
              "h-12 rounded-md border text-left text-[11px] transition-colors",
              b
                ? "cursor-default border-primary/30 bg-primary/15 px-2 text-primary"
                : "border-dashed border-border bg-secondary/30 hover:border-primary hover:bg-accent/40"
            )}
          >
            {isStart && (
              <span className="line-clamp-2 font-medium leading-tight">{b!.title}</span>
            )}
          </button>
        );
      })}
    </>
  );
}
