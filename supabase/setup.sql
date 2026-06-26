-- Northwind — full setup. Paste this entire file into the Supabase SQL editor and Run.
-- Safe to re-run any number of times (idempotent).

-- Northwind Corporate Workspace — schema
-- Run in the Supabase SQL editor (or via the Supabase CLI) before 0002_rls.sql.

create extension if not exists "pgcrypto";

-- Departments ---------------------------------------------------------------
create table if not exists public.departments (
  id          text primary key,
  name        text not null,
  slug        text not null unique,
  description text default '',
  headcount   int  default 0,
  lead_id     text,
  color       text default '#6366f1',
  budget      bigint default 0,
  created_at  timestamptz default now()
);

-- Employees -----------------------------------------------------------------
-- `auth_id` links a row to a Supabase Auth user (auth.users.id) so RLS can
-- resolve "who am I" from the JWT.
create table if not exists public.employees (
  id            text primary key,
  auth_id       uuid unique references auth.users (id) on delete set null,
  full_name     text not null,
  email         text not null unique,
  title         text not null,
  department_id text references public.departments (id),
  manager_id    text references public.employees (id),
  role          text not null default 'employee'
                  check (role in ('admin','executive','manager','employee')),
  avatar_url    text default '',
  phone         text default '',
  location      text default '',
  start_date    date not null default current_date,
  status        text not null default 'active'
                  check (status in ('active','onboarding','leave')),
  salary        bigint default 0,
  bio           text default '',
  skills        text[] default '{}',
  created_at    timestamptz default now()
);

alter table public.departments drop constraint if exists departments_lead_fk;
alter table public.departments
  add constraint departments_lead_fk
  foreign key (lead_id) references public.employees (id) deferrable initially deferred;

create index if not exists employees_department_idx on public.employees (department_id);
create index if not exists employees_auth_idx on public.employees (auth_id);

-- Leave requests ------------------------------------------------------------
create table if not exists public.leave_requests (
  id          text primary key default gen_random_uuid()::text,
  employee_id text not null references public.employees (id) on delete cascade,
  type        text not null check (type in ('vacation','sick','personal','parental')),
  start_date  date not null,
  end_date    date not null,
  days        int  not null,
  reason      text default '',
  status      text not null default 'pending'
                check (status in ('pending','approved','rejected')),
  approver_id text references public.employees (id),
  created_at  timestamptz default now()
);

-- Performance reviews -------------------------------------------------------
create table if not exists public.performance_reviews (
  id          text primary key default gen_random_uuid()::text,
  employee_id text not null references public.employees (id) on delete cascade,
  reviewer_id text not null references public.employees (id),
  period      text not null,
  rating      int  check (rating between 1 and 5),
  status      text not null default 'draft'
                check (status in ('draft','in-review','completed')),
  summary     text default '',
  goals_met   int default 0,
  created_at  timestamptz default now()
);

-- Announcements -------------------------------------------------------------
create table if not exists public.announcements (
  id         text primary key default gen_random_uuid()::text,
  author_id  text not null references public.employees (id),
  title      text not null,
  body       text not null,
  category   text not null default 'company'
               check (category in ('company','product','people','event')),
  pinned     boolean default false,
  likes      int default 0,
  comments   int default 0,
  created_at timestamptz default now()
);

-- Meeting rooms & bookings --------------------------------------------------
create table if not exists public.meeting_rooms (
  id        text primary key,
  name      text not null,
  location  text default '',
  capacity  int default 4,
  amenities text[] default '{}'
);

create table if not exists public.room_bookings (
  id           text primary key default gen_random_uuid()::text,
  room_id      text not null references public.meeting_rooms (id) on delete cascade,
  organizer_id text not null references public.employees (id),
  title        text not null,
  "start"      timestamptz not null,
  "end"        timestamptz not null,
  attendees    int default 1
);

-- Documents -----------------------------------------------------------------
create table if not exists public.documents (
  id            text primary key default gen_random_uuid()::text,
  name          text not null,
  type          text not null check (type in ('pdf','doc','sheet','slide')),
  department_id text references public.departments (id),
  owner_id      text not null references public.employees (id),
  access        text not null default 'public'
                  check (access in ('public','department','restricted')),
  size_kb       int default 0,
  version       text default 'v1.0',
  updated_at    timestamptz default now()
);

-- Payroll -------------------------------------------------------------------
create table if not exists public.payroll (
  id          text primary key default gen_random_uuid()::text,
  employee_id text not null references public.employees (id) on delete cascade,
  period      text not null,
  gross       bigint not null,
  tax         bigint not null,
  benefits    bigint not null,
  net         bigint not null,
  status      text not null default 'pending' check (status in ('paid','pending'))
);


-- Northwind Corporate Workspace — Row Level Security
-- Department-level data privacy. Run after 0001_schema.sql.
-- Safe to re-run: every policy is dropped first.

-- Helper functions ----------------------------------------------------------
-- Resolve the calling user's employee record from their auth JWT. Marked
-- SECURITY DEFINER + STABLE so policies can call them without recursing into
-- the very policies being evaluated.

create or replace function public.current_employee_id()
returns text language sql stable security definer set search_path = public as $$
  select id from public.employees where auth_id = auth.uid()
$$;

create or replace function public.current_department()
returns text language sql stable security definer set search_path = public as $$
  select department_id from public.employees where auth_id = auth.uid()
$$;

create or replace function public.current_role()
returns text language sql stable security definer set search_path = public as $$
  select role from public.employees where auth_id = auth.uid()
$$;

create or replace function public.is_privileged()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(public.current_role() in ('admin','executive'), false)
$$;

-- Enable RLS ----------------------------------------------------------------
alter table public.departments         enable row level security;
alter table public.employees           enable row level security;
alter table public.leave_requests      enable row level security;
alter table public.performance_reviews enable row level security;
alter table public.announcements       enable row level security;
alter table public.meeting_rooms       enable row level security;
alter table public.room_bookings       enable row level security;
alter table public.documents           enable row level security;
alter table public.payroll             enable row level security;

-- Departments ---------------------------------------------------------------
drop policy if exists "departments read" on public.departments;
create policy "departments read"  on public.departments
  for select to authenticated using (true);
drop policy if exists "departments write" on public.departments;
create policy "departments write" on public.departments
  for all to authenticated using (public.current_role() = 'admin')
  with check (public.current_role() = 'admin');

-- Employees -----------------------------------------------------------------
drop policy if exists "employees read" on public.employees;
create policy "employees read" on public.employees
  for select to authenticated using (true);
drop policy if exists "employees self-update" on public.employees;
create policy "employees self-update" on public.employees
  for update to authenticated
  using (auth_id = auth.uid() or public.current_role() = 'admin')
  with check (auth_id = auth.uid() or public.current_role() = 'admin');

-- Leave ---------------------------------------------------------------------
drop policy if exists "leave read" on public.leave_requests;
create policy "leave read" on public.leave_requests
  for select to authenticated using (
    employee_id = public.current_employee_id()
    or public.is_privileged()
    or exists (
      select 1 from public.employees e
      where e.id = leave_requests.employee_id
        and e.department_id = public.current_department()
        and public.current_role() = 'manager'
    )
  );
drop policy if exists "leave insert own" on public.leave_requests;
create policy "leave insert own" on public.leave_requests
  for insert to authenticated
  with check (employee_id = public.current_employee_id());
drop policy if exists "leave decide" on public.leave_requests;
create policy "leave decide" on public.leave_requests
  for update to authenticated using (
    public.is_privileged()
    or exists (
      select 1 from public.employees e
      where e.id = leave_requests.employee_id
        and e.department_id = public.current_department()
        and public.current_role() = 'manager'
    )
  );

-- Performance reviews -------------------------------------------------------
drop policy if exists "reviews read" on public.performance_reviews;
create policy "reviews read" on public.performance_reviews
  for select to authenticated using (
    employee_id = public.current_employee_id()
    or reviewer_id = public.current_employee_id()
    or public.is_privileged()
  );
drop policy if exists "reviews manage" on public.performance_reviews;
create policy "reviews manage" on public.performance_reviews
  for all to authenticated
  using (reviewer_id = public.current_employee_id() or public.is_privileged())
  with check (reviewer_id = public.current_employee_id() or public.is_privileged());

-- Announcements -------------------------------------------------------------
drop policy if exists "announcements read" on public.announcements;
create policy "announcements read" on public.announcements
  for select to authenticated using (true);
drop policy if exists "announcements write" on public.announcements;
create policy "announcements write" on public.announcements
  for all to authenticated
  using (author_id = public.current_employee_id() or public.current_role() = 'admin')
  with check (author_id = public.current_employee_id() or public.current_role() = 'admin');

-- Rooms & bookings ----------------------------------------------------------
drop policy if exists "rooms read" on public.meeting_rooms;
create policy "rooms read" on public.meeting_rooms
  for select to authenticated using (true);
drop policy if exists "bookings read" on public.room_bookings;
create policy "bookings read" on public.room_bookings
  for select to authenticated using (true);
drop policy if exists "bookings manage" on public.room_bookings;
create policy "bookings manage" on public.room_bookings
  for all to authenticated
  using (organizer_id = public.current_employee_id() or public.is_privileged())
  with check (organizer_id = public.current_employee_id() or public.is_privileged());

-- Documents: the core department-privacy rule ------------------------------
--   public      → everyone
--   department  → same department (or admin)
--   restricted  → privileged (admin/executive) only
drop policy if exists "documents read" on public.documents;
create policy "documents read" on public.documents
  for select to authenticated using (
    access = 'public'
    or (access = 'department' and (department_id = public.current_department() or public.current_role() = 'admin'))
    or (access = 'restricted' and public.is_privileged())
  );
drop policy if exists "documents write" on public.documents;
create policy "documents write" on public.documents
  for all to authenticated
  using (owner_id = public.current_employee_id() or public.is_privileged())
  with check (owner_id = public.current_employee_id() or public.is_privileged());

-- Payroll: highly sensitive -------------------------------------------------
drop policy if exists "payroll read" on public.payroll;
create policy "payroll read" on public.payroll
  for select to authenticated using (
    employee_id = public.current_employee_id()
    or public.is_privileged()
    or exists (
      select 1 from public.employees e
      where e.auth_id = auth.uid() and e.department_id = 'd-finance'
    )
  );
drop policy if exists "payroll write" on public.payroll;
create policy "payroll write" on public.payroll
  for all to authenticated
  using (public.is_privileged())
  with check (public.is_privileged());


-- Auto-provision an employees row whenever a new auth user signs up.
-- Runs after 0001_schema.sql / 0002_rls.sql.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.employees (id, auth_id, full_name, email, title, role, status, start_date)
  values (
    new.id::text,
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email,
    coalesce(nullif(new.raw_user_meta_data->>'title', ''), 'New Employee'),
    'employee',
    'onboarding',
    current_date
  )
  -- If the email was pre-seeded as an employee, just link the auth account.
  on conflict (email) do update set auth_id = excluded.auth_id;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- Reference / demo data so the workspace is populated on first run.
-- Idempotent: safe to run more than once. Auth users are created via sign-up
-- (the on_auth_user_created trigger links them by email).

insert into public.departments (id, name, slug, description, color, budget) values
  ('d-eng','Engineering','engineering','Builds and maintains the product platform.','#6366f1',2400000),
  ('d-design','Design','design','Product design, brand and research.','#ec4899',900000),
  ('d-sales','Sales','sales','Revenue, partnerships and customer growth.','#f59e0b',1500000),
  ('d-hr','People','people','Talent, culture and employee experience.','#10b981',700000),
  ('d-finance','Finance','finance','Accounting, payroll and financial planning.','#0ea5e9',800000)
on conflict (id) do nothing;

insert into public.employees (id, full_name, email, title, department_id, manager_id, role, avatar_url, phone, location, start_date, status, salary, bio, skills) values
  ('e-01','Amara Okafor','amara.okafor@northwind.co','VP of Engineering','d-eng',null,'executive','https://i.pravatar.cc/160?img=5','+1 415 555 0101','San Francisco, CA','2019-03-04','active',235000,'Leads platform and infrastructure.','{"Distributed Systems","Leadership","Go","Kubernetes"}'),
  ('e-02','Daniel Reyes','daniel.reyes@northwind.co','Staff Software Engineer','d-eng','e-01','manager','https://i.pravatar.cc/160?img=12','+1 415 555 0102','San Francisco, CA','2020-06-15','active',198000,'Owns the payments and billing services.','{"TypeScript","Node.js","PostgreSQL"}'),
  ('e-03','Priya Nair','priya.nair@northwind.co','Senior Frontend Engineer','d-eng','e-02','employee','https://i.pravatar.cc/160?img=20','+1 206 555 0103','Seattle, WA','2021-09-01','active',172000,'React performance and design systems specialist.','{"React","Next.js","Accessibility"}'),
  ('e-04','Marcus Lee','marcus.lee@northwind.co','Backend Engineer','d-eng','e-02','employee','https://i.pravatar.cc/160?img=33','+1 512 555 0104','Austin, TX','2022-01-10','active',158000,'Works on data pipelines and API platform.','{"Python","Kafka","AWS"}'),
  ('e-05','Sofia Almeida','sofia.almeida@northwind.co','Head of Design','d-design',null,'executive','https://i.pravatar.cc/160?img=9','+1 415 555 0105','San Francisco, CA','2019-11-20','active',210000,'Builds the design org and brand language.','{"Product Design","Brand","Figma"}'),
  ('e-06','Noah Schmidt','noah.schmidt@northwind.co','Product Designer','d-design','e-05','employee','https://i.pravatar.cc/160?img=15','+1 718 555 0106','New York, NY','2023-02-13','active',142000,'End-to-end product flows and prototyping.','{"Figma","Prototyping","Research"}'),
  ('e-07','Yuki Tanaka','yuki.tanaka@northwind.co','UX Researcher','d-design','e-05','employee','https://i.pravatar.cc/160?img=24','+1 415 555 0107','Remote','2024-04-08','onboarding',128000,'Qualitative and quantitative user research.','{"User Research","Surveys","Analysis"}'),
  ('e-08','Olivia Bennett','olivia.bennett@northwind.co','VP of Sales','d-sales',null,'executive','https://i.pravatar.cc/160?img=16','+1 312 555 0108','Chicago, IL','2020-02-18','active',225000,'Scales the enterprise sales motion.','{"Enterprise Sales","Negotiation","Strategy"}'),
  ('e-09','James Carter','james.carter@northwind.co','Account Executive','d-sales','e-08','employee','https://i.pravatar.cc/160?img=11','+1 312 555 0109','Chicago, IL','2022-07-25','active',135000,'Mid-market and enterprise accounts.','{"SaaS Sales","Demos","CRM"}'),
  ('e-10','Fatima Zahra','fatima.zahra@northwind.co','Sales Development Rep','d-sales','e-08','employee','https://i.pravatar.cc/160?img=45','+1 305 555 0110','Miami, FL','2023-10-02','leave',92000,'Outbound pipeline generation.','{"Prospecting","Outreach","Qualification"}'),
  ('e-11','Liam O''Connor','liam.oconnor@northwind.co','Solutions Engineer','d-sales','e-08','employee','https://i.pravatar.cc/160?img=51','+1 617 555 0111','Boston, MA','2021-05-19','active',148000,'Technical pre-sales and integrations.','{"Solutions","APIs","Demos"}'),
  ('e-12','Grace Mensah','grace.mensah@northwind.co','Head of People','d-hr',null,'admin','https://i.pravatar.cc/160?img=31','+1 415 555 0112','San Francisco, CA','2019-08-12','active',205000,'Owns talent, culture and total rewards.','{"People Ops","Hiring","Culture"}'),
  ('e-13','Ethan Wright','ethan.wright@northwind.co','Talent Partner','d-hr','e-12','employee','https://i.pravatar.cc/160?img=53','+1 415 555 0113','Remote','2022-03-30','active',118000,'Full-cycle technical recruiting.','{"Recruiting","Sourcing","Interviewing"}'),
  ('e-14','Chloe Martin','chloe.martin@northwind.co','People Operations Specialist','d-hr','e-12','employee','https://i.pravatar.cc/160?img=44','+1 415 555 0114','San Francisco, CA','2023-06-05','active',98000,'Onboarding, benefits and HRIS.','{"Onboarding","Benefits","HRIS"}'),
  ('e-15','Robert Kim','robert.kim@northwind.co','CFO','d-finance',null,'executive','https://i.pravatar.cc/160?img=60','+1 415 555 0115','San Francisco, CA','2018-10-01','active',280000,'Financial strategy and investor relations.','{"FP&A","Strategy","Fundraising"}'),
  ('e-16','Isabella Rossi','isabella.rossi@northwind.co','Senior Accountant','d-finance','e-15','employee','https://i.pravatar.cc/160?img=47','+1 415 555 0116','San Francisco, CA','2021-11-15','active',132000,'Payroll, AP/AR and reporting.','{"Accounting","Payroll","Excel"}')
on conflict (id) do nothing;

update public.departments set lead_id = 'e-01' where id = 'd-eng';
update public.departments set lead_id = 'e-05' where id = 'd-design';
update public.departments set lead_id = 'e-08' where id = 'd-sales';
update public.departments set lead_id = 'e-12' where id = 'd-hr';
update public.departments set lead_id = 'e-15' where id = 'd-finance';

insert into public.meeting_rooms (id, name, location, capacity, amenities) values
  ('room-1','Summit','Floor 4 · North',12,'{"4K Display","Video","Whiteboard"}'),
  ('room-2','Cascade','Floor 4 · South',6,'{"Display","Video"}'),
  ('room-3','Harbor','Floor 3 · East',20,'{"Projector","Video","Catering"}'),
  ('room-4','Atrium','Floor 2 · Center',4,'{"Display"}'),
  ('room-5','Beacon','Floor 3 · West',8,'{"4K Display","Whiteboard"}')
on conflict (id) do nothing;

insert into public.room_bookings (id, room_id, organizer_id, title, "start", "end", attendees) values
  ('b-01','room-1','e-01','Platform launch sync','2026-06-24T09:00:00','2026-06-24T10:00:00',9),
  ('b-02','room-1','e-08','Enterprise pipeline review','2026-06-24T11:00:00','2026-06-24T12:00:00',6),
  ('b-03','room-3','e-12','All-hands rehearsal','2026-06-24T14:00:00','2026-06-24T15:30:00',18),
  ('b-04','room-2','e-05','Design critique','2026-06-24T13:00:00','2026-06-24T14:00:00',4),
  ('b-05','room-5','e-02','1:1 — Priya','2026-06-24T15:00:00','2026-06-24T15:30:00',2)
on conflict (id) do nothing;

insert into public.documents (id, name, type, department_id, owner_id, access, size_kb, version, updated_at) values
  ('doc-01','2026 Company Handbook','pdf',null,'e-12','public',2480,'v4.2','2026-06-01'),
  ('doc-02','Platform 3.0 Architecture','doc','d-eng','e-01','department',880,'v1.8','2026-06-20'),
  ('doc-03','Q2 Financial Statements','sheet','d-finance','e-15','restricted',540,'v1.0','2026-06-23'),
  ('doc-04','Brand Guidelines','slide','d-design','e-05','public',12400,'v3.0','2026-05-18'),
  ('doc-05','Enterprise Sales Playbook','doc','d-sales','e-08','department',1320,'v2.5','2026-06-15'),
  ('doc-06','Compensation Bands 2026','sheet','d-hr','e-12','restricted',410,'v1.3','2026-06-10'),
  ('doc-07','Security & Compliance Policy','pdf',null,'e-12','public',760,'v2.1','2026-04-22')
on conflict (id) do nothing;

insert into public.announcements (id, author_id, title, body, category, pinned, likes, comments, created_at) values
  ('a-01','e-15','Q2 earnings beat targets by 18%','Thanks to a record enterprise quarter, we exceeded our Q2 revenue plan by 18%. Details in the all-hands on Friday.','company',true,142,23,'2026-06-23T09:00:00'),
  ('a-02','e-01','Platform 3.0 ships next week','The new real-time platform rolls out to all customers on July 1. Expect 3x faster sync and a redesigned API console.','product',true,98,17,'2026-06-22T13:30:00'),
  ('a-03','e-12','Welcome our newest team members','Please join us in welcoming Yuki Tanaka (UX Research) to Northwind!','people',false,76,31,'2026-06-21T11:15:00'),
  ('a-04','e-12','Summer offsite — save the date','Our company offsite is August 14–16 in Lake Tahoe. Travel and lodging covered.','event',false,120,44,'2026-06-19T15:45:00'),
  ('a-05','e-08','New enterprise logo: Meridian Bank','We just closed our largest deal to date with Meridian Bank. Massive credit to the sales and solutions team.','company',false,88,12,'2026-06-17T10:05:00')
on conflict (id) do nothing;

insert into public.leave_requests (id, employee_id, type, start_date, end_date, days, reason, status, approver_id, created_at) values
  ('l-01','e-03','vacation','2026-07-06','2026-07-10',5,'Family trip to Portugal.','pending','e-02','2026-06-18T10:00:00'),
  ('l-02','e-10','sick','2026-06-22','2026-06-26',5,'Medical leave.','approved','e-08','2026-06-15T08:30:00'),
  ('l-03','e-06','personal','2026-07-01','2026-07-01',1,'Moving apartments.','pending','e-05','2026-06-20T14:12:00'),
  ('l-04','e-04','vacation','2026-08-11','2026-08-22',10,'Honeymoon.','pending','e-02','2026-06-21T09:45:00'),
  ('l-05','e-09','parental','2026-09-01','2026-11-24',60,'Parental leave.','approved','e-08','2026-05-30T11:00:00'),
  ('l-06','e-13','vacation','2026-06-12','2026-06-13',2,'Long weekend.','rejected','e-12','2026-06-01T16:20:00')
on conflict (id) do nothing;

insert into public.performance_reviews (id, employee_id, reviewer_id, period, rating, status, summary, goals_met, created_at) values
  ('r-01','e-03','e-02','H1 2026',5,'completed','Exceptional impact on the design system migration. Promotion candidate.',6,'2026-06-10'),
  ('r-02','e-04','e-02','H1 2026',4,'in-review','Strong delivery on the data pipeline. Growing into ownership.',5,'2026-06-12'),
  ('r-03','e-06','e-05','H1 2026',4,'completed','Consistent, high-quality design output.',4,'2026-06-08'),
  ('r-04','e-09','e-08','H1 2026',3,'draft','Met quota. Opportunity to improve pipeline hygiene.',3,'2026-06-19'),
  ('r-05','e-11','e-08','H1 2026',5,'completed','Outstanding technical pre-sales. Key to two enterprise wins.',6,'2026-06-05')
on conflict (id) do nothing;

insert into public.payroll (id, employee_id, period, gross, tax, benefits, net, status)
select
  'pay-' || id,
  id,
  'June 2026',
  (salary / 12.0)::bigint,
  (salary / 12.0 * 0.24)::bigint,
  (salary / 12.0 * 0.08)::bigint,
  (salary / 12.0 - salary / 12.0 * 0.24 - salary / 12.0 * 0.08)::bigint,
  'paid'
from public.employees
on conflict (id) do nothing;
