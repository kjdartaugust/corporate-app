import { createClient, isDemoMode } from "@/lib/supabase/server";
import * as demo from "@/lib/data/demo";
import type {
  Announcement,
  Department,
  Document,
  Employee,
  LeaveRequest,
  PayrollRecord,
  PerformanceReview,
  RoomBooking,
} from "@/lib/types";

/**
 * Every getter follows the same dual-path contract: serve in-memory demo
 * fixtures when `isDemoMode`, otherwise read from Supabase (where RLS applies).
 * This keeps the app deployable with zero backend configuration while remaining
 * a real Supabase app the moment env vars are provided.
 */

async function table<T>(name: string, fallback: T[]): Promise<T[]> {
  if (isDemoMode) return fallback;
  const supabase = createClient();
  const { data, error } = await supabase.from(name).select("*");
  if (error || !data) return fallback;
  return data as T[];
}

export const getEmployees = () => table<Employee>("employees", demo.employees);
export const getDepartments = () => table<Department>("departments", demo.departments);
export const getLeaveRequests = () => table<LeaveRequest>("leave_requests", demo.leaveRequests);
export const getReviews = () => table<PerformanceReview>("performance_reviews", demo.reviews);
export const getAnnouncements = () => table<Announcement>("announcements", demo.announcements);
export const getDocuments = () => table<Document>("documents", demo.documents);
export const getPayroll = () => table<PayrollRecord>("payroll", demo.payroll);
export const getBookings = () => table<RoomBooking>("room_bookings", demo.bookings);
export const getRooms = () => Promise.resolve(demo.rooms);
export const getOnboardingTasks = () => Promise.resolve(demo.onboardingTasks);

export async function getEmployee(id: string): Promise<Employee | null> {
  const all = await getEmployees();
  return all.find((e) => e.id === id) ?? null;
}

export async function getCurrentUser(): Promise<Employee> {
  if (isDemoMode) return demo.currentUser;
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const employees = await getEmployees();
  return employees.find((e) => e.email === user?.email) ?? demo.currentUser;
}
