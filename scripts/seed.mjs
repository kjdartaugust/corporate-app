// Seed a real Supabase project with the Northwind demo dataset.
//
//   1. Copy .env.example → .env.local and fill in NEXT_PUBLIC_SUPABASE_URL and
//      SUPABASE_SERVICE_ROLE_KEY (service role — server only).
//   2. Run the SQL in supabase/migrations (0001 then 0002) in the SQL editor.
//   3. npm run seed
//
// The script creates an auth user per employee (password: "northwind-demo"),
// links each employees row to its auth user via auth_id, and upserts all the
// reference data so RLS resolves correctly.

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const PASSWORD = "northwind-demo";

const departments = [
  { id: "d-eng", name: "Engineering", slug: "engineering", description: "Builds and maintains the product platform.", color: "#6366f1", budget: 2400000 },
  { id: "d-design", name: "Design", slug: "design", description: "Product design, brand and research.", color: "#ec4899", budget: 900000 },
  { id: "d-sales", name: "Sales", slug: "sales", description: "Revenue, partnerships and customer growth.", color: "#f59e0b", budget: 1500000 },
  { id: "d-hr", name: "People", slug: "people", description: "Talent, culture and employee experience.", color: "#10b981", budget: 700000 },
  { id: "d-finance", name: "Finance", slug: "finance", description: "Accounting, payroll and financial planning.", color: "#0ea5e9", budget: 800000 },
];

const employees = [
  { id: "e-01", full_name: "Amara Okafor", email: "amara.okafor@northwind.co", title: "VP of Engineering", department_id: "d-eng", manager_id: null, role: "executive", location: "San Francisco, CA", salary: 235000 },
  { id: "e-02", full_name: "Daniel Reyes", email: "daniel.reyes@northwind.co", title: "Staff Software Engineer", department_id: "d-eng", manager_id: "e-01", role: "manager", location: "San Francisco, CA", salary: 198000 },
  { id: "e-03", full_name: "Priya Nair", email: "priya.nair@northwind.co", title: "Senior Frontend Engineer", department_id: "d-eng", manager_id: "e-02", role: "employee", location: "Seattle, WA", salary: 172000 },
  { id: "e-04", full_name: "Marcus Lee", email: "marcus.lee@northwind.co", title: "Backend Engineer", department_id: "d-eng", manager_id: "e-02", role: "employee", location: "Austin, TX", salary: 158000 },
  { id: "e-05", full_name: "Sofia Almeida", email: "sofia.almeida@northwind.co", title: "Head of Design", department_id: "d-design", manager_id: null, role: "executive", location: "San Francisco, CA", salary: 210000 },
  { id: "e-06", full_name: "Noah Schmidt", email: "noah.schmidt@northwind.co", title: "Product Designer", department_id: "d-design", manager_id: "e-05", role: "employee", location: "New York, NY", salary: 142000 },
  { id: "e-08", full_name: "Olivia Bennett", email: "olivia.bennett@northwind.co", title: "VP of Sales", department_id: "d-sales", manager_id: null, role: "executive", location: "Chicago, IL", salary: 225000 },
  { id: "e-09", full_name: "James Carter", email: "james.carter@northwind.co", title: "Account Executive", department_id: "d-sales", manager_id: "e-08", role: "employee", location: "Chicago, IL", salary: 135000 },
  { id: "e-12", full_name: "Grace Mensah", email: "grace.mensah@northwind.co", title: "Head of People", department_id: "d-hr", manager_id: null, role: "admin", location: "San Francisco, CA", salary: 205000 },
  { id: "e-15", full_name: "Robert Kim", email: "robert.kim@northwind.co", title: "CFO", department_id: "d-finance", manager_id: null, role: "executive", location: "San Francisco, CA", salary: 280000 },
  { id: "e-16", full_name: "Isabella Rossi", email: "isabella.rossi@northwind.co", title: "Senior Accountant", department_id: "d-finance", manager_id: "e-15", role: "employee", location: "San Francisco, CA", salary: 132000 },
];

const rooms = [
  { id: "room-1", name: "Summit", location: "Floor 4 · North", capacity: 12, amenities: ["4K Display", "Video", "Whiteboard"] },
  { id: "room-2", name: "Cascade", location: "Floor 4 · South", capacity: 6, amenities: ["Display", "Video"] },
  { id: "room-3", name: "Harbor", location: "Floor 3 · East", capacity: 20, amenities: ["Projector", "Video", "Catering"] },
];

const documents = [
  { id: "doc-01", name: "2026 Company Handbook", type: "pdf", department_id: null, owner_id: "e-12", access: "public", size_kb: 2480, version: "v4.2" },
  { id: "doc-02", name: "Platform 3.0 Architecture", type: "doc", department_id: "d-eng", owner_id: "e-01", access: "department", size_kb: 880, version: "v1.8" },
  { id: "doc-03", name: "Q2 Financial Statements", type: "sheet", department_id: "d-finance", owner_id: "e-15", access: "restricted", size_kb: 540, version: "v1.0" },
  { id: "doc-06", name: "Compensation Bands 2026", type: "sheet", department_id: "d-hr", owner_id: "e-12", access: "restricted", size_kb: 410, version: "v1.3" },
];

async function ensureAuthUser(email) {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password: PASSWORD,
    email_confirm: true,
  });
  if (error && !/already been registered/i.test(error.message)) throw error;
  if (data?.user) return data.user.id;
  // Already exists — look it up.
  const { data: list } = await supabase.auth.admin.listUsers();
  return list.users.find((u) => u.email === email)?.id ?? null;
}

async function main() {
  console.log("→ Seeding departments…");
  await supabase.from("departments").upsert(departments);

  console.log("→ Creating auth users + employees…");
  for (const e of employees) {
    const authId = await ensureAuthUser(e.email);
    await supabase.from("employees").upsert({ ...e, auth_id: authId, start_date: "2021-01-01" });
  }

  // Set department leads now that employees exist.
  const leads = { "d-eng": "e-01", "d-design": "e-05", "d-sales": "e-08", "d-hr": "e-12", "d-finance": "e-15" };
  for (const [dept, lead] of Object.entries(leads)) {
    await supabase.from("departments").update({ lead_id: lead }).eq("id", dept);
  }

  console.log("→ Seeding rooms & documents…");
  await supabase.from("meeting_rooms").upsert(rooms);
  await supabase.from("documents").upsert(documents);

  console.log("→ Seeding payroll…");
  const payroll = employees.map((e) => {
    const gross = Math.round(e.salary / 12);
    const tax = Math.round(gross * 0.24);
    const benefits = Math.round(gross * 0.08);
    return { id: `pay-${e.id}`, employee_id: e.id, period: "June 2026", gross, tax, benefits, net: gross - tax - benefits, status: "paid" };
  });
  await supabase.from("payroll").upsert(payroll);

  console.log("✓ Seed complete. Sign in with any seeded email, password:", PASSWORD);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
