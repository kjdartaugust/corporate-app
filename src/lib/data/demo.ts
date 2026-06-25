import type {
  Announcement,
  Department,
  Document,
  Employee,
  LeaveRequest,
  MeetingRoom,
  OnboardingTask,
  PayrollRecord,
  PerformanceReview,
  RoomBooking,
} from "@/lib/types";

const avatar = (n: number) => `https://i.pravatar.cc/160?img=${n}`;

export const departments: Department[] = [
  { id: "d-eng", name: "Engineering", slug: "engineering", description: "Builds and maintains the product platform.", headcount: 8, lead_id: "e-01", color: "#6366f1", budget: 2400000 },
  { id: "d-design", name: "Design", slug: "design", description: "Product design, brand and research.", headcount: 4, lead_id: "e-05", color: "#ec4899", budget: 900000 },
  { id: "d-sales", name: "Sales", slug: "sales", description: "Revenue, partnerships and customer growth.", headcount: 6, lead_id: "e-08", color: "#f59e0b", budget: 1500000 },
  { id: "d-hr", name: "People", slug: "people", description: "Talent, culture and employee experience.", headcount: 3, lead_id: "e-12", color: "#10b981", budget: 700000 },
  { id: "d-finance", name: "Finance", slug: "finance", description: "Accounting, payroll and financial planning.", headcount: 3, lead_id: "e-15", color: "#0ea5e9", budget: 800000 },
];

export const employees: Employee[] = [
  { id: "e-01", full_name: "Amara Okafor", email: "amara.okafor@northwind.co", title: "VP of Engineering", department_id: "d-eng", manager_id: null, role: "executive", avatar_url: avatar(5), phone: "+1 415 555 0101", location: "San Francisco, CA", start_date: "2019-03-04", status: "active", salary: 235000, bio: "Leads platform and infrastructure. Previously staff engineer at a fintech unicorn.", skills: ["Distributed Systems", "Leadership", "Go", "Kubernetes"] },
  { id: "e-02", full_name: "Daniel Reyes", email: "daniel.reyes@northwind.co", title: "Staff Software Engineer", department_id: "d-eng", manager_id: "e-01", role: "manager", avatar_url: avatar(12), phone: "+1 415 555 0102", location: "San Francisco, CA", start_date: "2020-06-15", status: "active", salary: 198000, bio: "Owns the payments and billing services.", skills: ["TypeScript", "Node.js", "PostgreSQL"] },
  { id: "e-03", full_name: "Priya Nair", email: "priya.nair@northwind.co", title: "Senior Frontend Engineer", department_id: "d-eng", manager_id: "e-02", role: "employee", avatar_url: avatar(20), phone: "+1 206 555 0103", location: "Seattle, WA", start_date: "2021-09-01", status: "active", salary: 172000, bio: "React performance and design systems specialist.", skills: ["React", "Next.js", "Accessibility"] },
  { id: "e-04", full_name: "Marcus Lee", email: "marcus.lee@northwind.co", title: "Backend Engineer", department_id: "d-eng", manager_id: "e-02", role: "employee", avatar_url: avatar(33), phone: "+1 512 555 0104", location: "Austin, TX", start_date: "2022-01-10", status: "active", salary: 158000, bio: "Works on data pipelines and API platform.", skills: ["Python", "Kafka", "AWS"] },
  { id: "e-05", full_name: "Sofia Almeida", email: "sofia.almeida@northwind.co", title: "Head of Design", department_id: "d-design", manager_id: null, role: "executive", avatar_url: avatar(9), phone: "+1 415 555 0105", location: "San Francisco, CA", start_date: "2019-11-20", status: "active", salary: 210000, bio: "Builds the design org and brand language.", skills: ["Product Design", "Brand", "Figma"] },
  { id: "e-06", full_name: "Noah Schmidt", email: "noah.schmidt@northwind.co", title: "Product Designer", department_id: "d-design", manager_id: "e-05", role: "employee", avatar_url: avatar(15), phone: "+1 718 555 0106", location: "New York, NY", start_date: "2023-02-13", status: "active", salary: 142000, bio: "End-to-end product flows and prototyping.", skills: ["Figma", "Prototyping", "Research"] },
  { id: "e-07", full_name: "Yuki Tanaka", email: "yuki.tanaka@northwind.co", title: "UX Researcher", department_id: "d-design", manager_id: "e-05", role: "employee", avatar_url: avatar(24), phone: "+1 415 555 0107", location: "Remote", start_date: "2024-04-08", status: "onboarding", salary: 128000, bio: "Qualitative and quantitative user research.", skills: ["User Research", "Surveys", "Analysis"] },
  { id: "e-08", full_name: "Olivia Bennett", email: "olivia.bennett@northwind.co", title: "VP of Sales", department_id: "d-sales", manager_id: null, role: "executive", avatar_url: avatar(16), phone: "+1 312 555 0108", location: "Chicago, IL", start_date: "2020-02-18", status: "active", salary: 225000, bio: "Scales the enterprise sales motion.", skills: ["Enterprise Sales", "Negotiation", "Strategy"] },
  { id: "e-09", full_name: "James Carter", email: "james.carter@northwind.co", title: "Account Executive", department_id: "d-sales", manager_id: "e-08", role: "employee", avatar_url: avatar(11), phone: "+1 312 555 0109", location: "Chicago, IL", start_date: "2022-07-25", status: "active", salary: 135000, bio: "Mid-market and enterprise accounts.", skills: ["SaaS Sales", "Demos", "CRM"] },
  { id: "e-10", full_name: "Fatima Zahra", email: "fatima.zahra@northwind.co", title: "Sales Development Rep", department_id: "d-sales", manager_id: "e-08", role: "employee", avatar_url: avatar(45), phone: "+1 305 555 0110", location: "Miami, FL", start_date: "2023-10-02", status: "leave", salary: 92000, bio: "Outbound pipeline generation.", skills: ["Prospecting", "Outreach", "Qualification"] },
  { id: "e-11", full_name: "Liam O'Connor", email: "liam.oconnor@northwind.co", title: "Solutions Engineer", department_id: "d-sales", manager_id: "e-08", role: "employee", avatar_url: avatar(51), phone: "+1 617 555 0111", location: "Boston, MA", start_date: "2021-05-19", status: "active", salary: 148000, bio: "Technical pre-sales and integrations.", skills: ["Solutions", "APIs", "Demos"] },
  { id: "e-12", full_name: "Grace Mensah", email: "grace.mensah@northwind.co", title: "Head of People", department_id: "d-hr", manager_id: null, role: "admin", avatar_url: avatar(31), phone: "+1 415 555 0112", location: "San Francisco, CA", start_date: "2019-08-12", status: "active", salary: 205000, bio: "Owns talent, culture and total rewards.", skills: ["People Ops", "Hiring", "Culture"] },
  { id: "e-13", full_name: "Ethan Wright", email: "ethan.wright@northwind.co", title: "Talent Partner", department_id: "d-hr", manager_id: "e-12", role: "employee", avatar_url: avatar(53), phone: "+1 415 555 0113", location: "Remote", start_date: "2022-03-30", status: "active", salary: 118000, bio: "Full-cycle technical recruiting.", skills: ["Recruiting", "Sourcing", "Interviewing"] },
  { id: "e-14", full_name: "Chloe Martin", email: "chloe.martin@northwind.co", title: "People Operations Specialist", department_id: "d-hr", manager_id: "e-12", role: "employee", avatar_url: avatar(44), phone: "+1 415 555 0114", location: "San Francisco, CA", start_date: "2023-06-05", status: "active", salary: 98000, bio: "Onboarding, benefits and HRIS.", skills: ["Onboarding", "Benefits", "HRIS"] },
  { id: "e-15", full_name: "Robert Kim", email: "robert.kim@northwind.co", title: "CFO", department_id: "d-finance", manager_id: null, role: "executive", avatar_url: avatar(60), phone: "+1 415 555 0115", location: "San Francisco, CA", start_date: "2018-10-01", status: "active", salary: 280000, bio: "Financial strategy and investor relations.", skills: ["FP&A", "Strategy", "Fundraising"] },
  { id: "e-16", full_name: "Isabella Rossi", email: "isabella.rossi@northwind.co", title: "Senior Accountant", department_id: "d-finance", manager_id: "e-15", role: "employee", avatar_url: avatar(47), phone: "+1 415 555 0116", location: "San Francisco, CA", start_date: "2021-11-15", status: "active", salary: 132000, bio: "Payroll, AP/AR and reporting.", skills: ["Accounting", "Payroll", "Excel"] },
];

export const leaveRequests: LeaveRequest[] = [
  { id: "l-01", employee_id: "e-03", type: "vacation", start_date: "2026-07-06", end_date: "2026-07-10", days: 5, reason: "Family trip to Portugal.", status: "pending", approver_id: "e-02", created_at: "2026-06-18T10:00:00Z" },
  { id: "l-02", employee_id: "e-10", type: "sick", start_date: "2026-06-22", end_date: "2026-06-26", days: 5, reason: "Medical leave.", status: "approved", approver_id: "e-08", created_at: "2026-06-15T08:30:00Z" },
  { id: "l-03", employee_id: "e-06", type: "personal", start_date: "2026-07-01", end_date: "2026-07-01", days: 1, reason: "Moving apartments.", status: "pending", approver_id: "e-05", created_at: "2026-06-20T14:12:00Z" },
  { id: "l-04", employee_id: "e-04", type: "vacation", start_date: "2026-08-11", end_date: "2026-08-22", days: 10, reason: "Honeymoon.", status: "pending", approver_id: "e-02", created_at: "2026-06-21T09:45:00Z" },
  { id: "l-05", employee_id: "e-09", type: "parental", start_date: "2026-09-01", end_date: "2026-11-24", days: 60, reason: "Parental leave.", status: "approved", approver_id: "e-08", created_at: "2026-05-30T11:00:00Z" },
  { id: "l-06", employee_id: "e-13", type: "vacation", start_date: "2026-06-12", end_date: "2026-06-13", days: 2, reason: "Long weekend.", status: "rejected", approver_id: "e-12", created_at: "2026-06-01T16:20:00Z" },
];

export const reviews: PerformanceReview[] = [
  { id: "r-01", employee_id: "e-03", reviewer_id: "e-02", period: "H1 2026", rating: 5, status: "completed", summary: "Exceptional impact on the design system migration. Promotion candidate.", goals_met: 6, created_at: "2026-06-10T00:00:00Z" },
  { id: "r-02", employee_id: "e-04", reviewer_id: "e-02", period: "H1 2026", rating: 4, status: "in-review", summary: "Strong delivery on the data pipeline. Growing into ownership.", goals_met: 5, created_at: "2026-06-12T00:00:00Z" },
  { id: "r-03", employee_id: "e-06", reviewer_id: "e-05", period: "H1 2026", rating: 4, status: "completed", summary: "Consistent, high-quality design output. Great cross-functional partner.", goals_met: 4, created_at: "2026-06-08T00:00:00Z" },
  { id: "r-04", employee_id: "e-09", reviewer_id: "e-08", period: "H1 2026", rating: 3, status: "draft", summary: "Met quota. Opportunity to improve pipeline hygiene.", goals_met: 3, created_at: "2026-06-19T00:00:00Z" },
  { id: "r-05", employee_id: "e-11", reviewer_id: "e-08", period: "H1 2026", rating: 5, status: "completed", summary: "Outstanding technical pre-sales. Key to two enterprise wins.", goals_met: 6, created_at: "2026-06-05T00:00:00Z" },
];

export const announcements: Announcement[] = [
  { id: "a-01", author_id: "e-15", title: "Q2 earnings beat targets by 18%", body: "Thanks to a record enterprise quarter, we exceeded our Q2 revenue plan by 18%. A huge thank you to the whole team — details in the all-hands on Friday.", category: "company", pinned: true, likes: 142, comments: 23, created_at: "2026-06-23T09:00:00Z" },
  { id: "a-02", author_id: "e-01", title: "Platform 3.0 ships next week", body: "After six months of work, the new real-time platform rolls out to all customers on July 1. Expect 3x faster sync and a redesigned API console.", category: "product", pinned: true, likes: 98, comments: 17, created_at: "2026-06-22T13:30:00Z" },
  { id: "a-03", author_id: "e-12", title: "Welcome our newest team members", body: "Please join us in welcoming Yuki Tanaka (UX Research) to Northwind. Say hi in the #welcome channel!", category: "people", pinned: false, likes: 76, comments: 31, created_at: "2026-06-21T11:15:00Z" },
  { id: "a-04", author_id: "e-12", title: "Summer offsite — save the date", body: "Our company offsite is happening August 14–16 in Lake Tahoe. Travel and lodging covered. RSVP form going out next week.", category: "event", pinned: false, likes: 120, comments: 44, created_at: "2026-06-19T15:45:00Z" },
  { id: "a-05", author_id: "e-08", title: "New enterprise logo: Meridian Bank", body: "We just closed our largest deal to date with Meridian Bank. Massive credit to the sales and solutions team.", category: "company", pinned: false, likes: 88, comments: 12, created_at: "2026-06-17T10:05:00Z" },
];

export const rooms: MeetingRoom[] = [
  { id: "room-1", name: "Summit", location: "Floor 4 · North", capacity: 12, amenities: ["4K Display", "Video", "Whiteboard"] },
  { id: "room-2", name: "Cascade", location: "Floor 4 · South", capacity: 6, amenities: ["Display", "Video"] },
  { id: "room-3", name: "Harbor", location: "Floor 3 · East", capacity: 20, amenities: ["Projector", "Video", "Catering"] },
  { id: "room-4", name: "Atrium", location: "Floor 2 · Center", capacity: 4, amenities: ["Display"] },
  { id: "room-5", name: "Beacon", location: "Floor 3 · West", capacity: 8, amenities: ["4K Display", "Whiteboard"] },
];

const today = "2026-06-24";
export const bookings: RoomBooking[] = [
  { id: "b-01", room_id: "room-1", organizer_id: "e-01", title: "Platform launch sync", start: `${today}T09:00:00`, end: `${today}T10:00:00`, attendees: 9 },
  { id: "b-02", room_id: "room-1", organizer_id: "e-08", title: "Enterprise pipeline review", start: `${today}T11:00:00`, end: `${today}T12:00:00`, attendees: 6 },
  { id: "b-03", room_id: "room-3", organizer_id: "e-12", title: "All-hands rehearsal", start: `${today}T14:00:00`, end: `${today}T15:30:00`, attendees: 18 },
  { id: "b-04", room_id: "room-2", organizer_id: "e-05", title: "Design critique", start: `${today}T13:00:00`, end: `${today}T14:00:00`, attendees: 4 },
  { id: "b-05", room_id: "room-5", organizer_id: "e-02", title: "1:1 — Priya", start: `${today}T15:00:00`, end: `${today}T15:30:00`, attendees: 2 },
];

export const documents: Document[] = [
  { id: "doc-01", name: "2026 Company Handbook", type: "pdf", department_id: null, owner_id: "e-12", access: "public", size_kb: 2480, updated_at: "2026-06-01T00:00:00Z", version: "v4.2" },
  { id: "doc-02", name: "Platform 3.0 Architecture", type: "doc", department_id: "d-eng", owner_id: "e-01", access: "department", size_kb: 880, updated_at: "2026-06-20T00:00:00Z", version: "v1.8" },
  { id: "doc-03", name: "Q2 Financial Statements", type: "sheet", department_id: "d-finance", owner_id: "e-15", access: "restricted", size_kb: 540, updated_at: "2026-06-23T00:00:00Z", version: "v1.0" },
  { id: "doc-04", name: "Brand Guidelines", type: "slide", department_id: "d-design", owner_id: "e-05", access: "public", size_kb: 12400, updated_at: "2026-05-18T00:00:00Z", version: "v3.0" },
  { id: "doc-05", name: "Enterprise Sales Playbook", type: "doc", department_id: "d-sales", owner_id: "e-08", access: "department", size_kb: 1320, updated_at: "2026-06-15T00:00:00Z", version: "v2.5" },
  { id: "doc-06", name: "Compensation Bands 2026", type: "sheet", department_id: "d-hr", owner_id: "e-12", access: "restricted", size_kb: 410, updated_at: "2026-06-10T00:00:00Z", version: "v1.3" },
  { id: "doc-07", name: "Security & Compliance Policy", type: "pdf", department_id: null, owner_id: "e-12", access: "public", size_kb: 760, updated_at: "2026-04-22T00:00:00Z", version: "v2.1" },
];

export const payroll: PayrollRecord[] = employees.map((e, i) => {
  const gross = Math.round(e.salary / 12);
  const tax = Math.round(gross * 0.24);
  const benefits = Math.round(gross * 0.08);
  return {
    id: `pay-${i + 1}`,
    employee_id: e.id,
    period: "June 2026",
    gross,
    tax,
    benefits,
    net: gross - tax - benefits,
    status: i % 7 === 0 ? "pending" : "paid",
  };
});

export const onboardingTasks: OnboardingTask[] = [
  { id: "on-1", label: "Sign offer & employment agreement", description: "Complete e-signature in the documents portal.", category: "paperwork", done: true },
  { id: "on-2", label: "Submit tax & banking details", description: "For payroll setup with Finance.", category: "paperwork", done: true },
  { id: "on-3", label: "Set up company laptop", description: "Collect device and enroll in MDM.", category: "it", done: true },
  { id: "on-4", label: "Configure SSO & 2FA", description: "Access email, Slack and the internal portal.", category: "it", done: false },
  { id: "on-5", label: "Complete security awareness training", description: "30-minute course in the learning portal.", category: "training", done: false },
  { id: "on-6", label: "Read the company handbook", description: "Culture, values and policies.", category: "training", done: false },
  { id: "on-7", label: "Meet your onboarding buddy", description: "Grab a coffee with your assigned buddy.", category: "social", done: false },
  { id: "on-8", label: "Join team standup", description: "Introduce yourself to the team.", category: "social", done: false },
];

// helpers
export const employeeById = (id: string | null) =>
  employees.find((e) => e.id === id) ?? null;
export const departmentById = (id: string | null) =>
  departments.find((d) => d.id === id) ?? null;

export const currentUser = employees.find((e) => e.id === "e-12")!; // Grace Mensah, Head of People (admin)
