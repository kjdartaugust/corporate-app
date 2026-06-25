export type Role = "admin" | "executive" | "manager" | "employee";

export interface Department {
  id: string;
  name: string;
  slug: string;
  description: string;
  headcount: number;
  lead_id: string | null;
  color: string;
  budget: number;
}

export interface Employee {
  id: string;
  full_name: string;
  email: string;
  title: string;
  department_id: string;
  manager_id: string | null;
  role: Role;
  avatar_url: string;
  phone: string;
  location: string;
  start_date: string;
  status: "active" | "onboarding" | "leave";
  salary: number;
  bio: string;
  skills: string[];
}

export interface LeaveRequest {
  id: string;
  employee_id: string;
  type: "vacation" | "sick" | "personal" | "parental";
  start_date: string;
  end_date: string;
  days: number;
  reason: string;
  status: "pending" | "approved" | "rejected";
  approver_id: string | null;
  created_at: string;
}

export interface PerformanceReview {
  id: string;
  employee_id: string;
  reviewer_id: string;
  period: string;
  rating: number; // 1-5
  status: "draft" | "in-review" | "completed";
  summary: string;
  goals_met: number;
  created_at: string;
}

export interface Announcement {
  id: string;
  author_id: string;
  title: string;
  body: string;
  category: "company" | "product" | "people" | "event";
  pinned: boolean;
  likes: number;
  comments: number;
  created_at: string;
}

export interface MeetingRoom {
  id: string;
  name: string;
  location: string;
  capacity: number;
  amenities: string[];
}

export interface RoomBooking {
  id: string;
  room_id: string;
  organizer_id: string;
  title: string;
  start: string;
  end: string;
  attendees: number;
}

export interface Document {
  id: string;
  name: string;
  type: "pdf" | "doc" | "sheet" | "slide";
  department_id: string | null;
  owner_id: string;
  access: "public" | "department" | "restricted";
  size_kb: number;
  updated_at: string;
  version: string;
}

export interface PayrollRecord {
  id: string;
  employee_id: string;
  period: string;
  gross: number;
  tax: number;
  benefits: number;
  net: number;
  status: "paid" | "pending";
}

export interface OnboardingTask {
  id: string;
  label: string;
  description: string;
  category: "paperwork" | "it" | "training" | "social";
  done: boolean;
}
