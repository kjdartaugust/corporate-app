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
