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

  if (!user) return demo.currentUser;

  // Prefer the employees row linked to this auth user (created by the
  // on_auth_user_created trigger); fall back to an email match.
  const { data } = await supabase
    .from("employees")
    .select("*")
    .or(`auth_id.eq.${user.id},email.eq.${user.email}`)
    .limit(1)
    .maybeSingle();

  if (data) return data as Employee;

  // Brand-new user whose profile row hasn't materialized yet — synthesize a
  // minimal profile from the auth metadata so the app still renders.
  const meta = (user.user_metadata ?? {}) as { full_name?: string; title?: string };
  return {
    id: user.id,
    full_name: meta.full_name ?? user.email?.split("@")[0] ?? "New Employee",
    email: user.email ?? "",
    title: meta.title ?? "New Employee",
    department_id: "",
    manager_id: null,
    role: "employee",
    avatar_url: "",
    phone: "",
    location: "",
    start_date: new Date().toISOString().slice(0, 10),
    status: "onboarding",
    salary: 0,
    bio: "",
    skills: [],
  };
}
