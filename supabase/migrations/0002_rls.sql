-- Northwind Corporate Workspace — Row Level Security
-- Department-level data privacy. Run after 0001_schema.sql.

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

-- Departments: readable by all authenticated users; only admins write -------
create policy "departments read"  on public.departments
  for select to authenticated using (true);
create policy "departments write" on public.departments
  for all to authenticated using (public.current_role() = 'admin')
  with check (public.current_role() = 'admin');

-- Employees: the directory is company-wide readable. A user may edit their
-- own profile; admins may edit anyone.
create policy "employees read" on public.employees
  for select to authenticated using (true);
create policy "employees self-update" on public.employees
  for update to authenticated
  using (auth_id = auth.uid() or public.current_role() = 'admin')
  with check (auth_id = auth.uid() or public.current_role() = 'admin');

-- Leave: you see your own; managers/HR see their department; privileged see all
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
create policy "leave insert own" on public.leave_requests
  for insert to authenticated
  with check (employee_id = public.current_employee_id());
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

-- Performance reviews: subject, reviewer, or privileged --------------------
create policy "reviews read" on public.performance_reviews
  for select to authenticated using (
    employee_id = public.current_employee_id()
    or reviewer_id = public.current_employee_id()
    or public.is_privileged()
  );
create policy "reviews manage" on public.performance_reviews
  for all to authenticated
  using (reviewer_id = public.current_employee_id() or public.is_privileged())
  with check (reviewer_id = public.current_employee_id() or public.is_privileged());

-- Announcements: company-wide read; author or admin writes -----------------
create policy "announcements read" on public.announcements
  for select to authenticated using (true);
create policy "announcements write" on public.announcements
  for all to authenticated
  using (author_id = public.current_employee_id() or public.current_role() = 'admin')
  with check (author_id = public.current_employee_id() or public.current_role() = 'admin');

-- Rooms & bookings: all read; organizer/privileged manage own booking ------
create policy "rooms read" on public.meeting_rooms
  for select to authenticated using (true);
create policy "bookings read" on public.room_bookings
  for select to authenticated using (true);
create policy "bookings manage" on public.room_bookings
  for all to authenticated
  using (organizer_id = public.current_employee_id() or public.is_privileged())
  with check (organizer_id = public.current_employee_id() or public.is_privileged());

-- Documents: the core department-privacy rule ------------------------------
--   public      → everyone
--   department  → same department (or admin)
--   restricted  → privileged (admin/executive) only
create policy "documents read" on public.documents
  for select to authenticated using (
    access = 'public'
    or (access = 'department' and (department_id = public.current_department() or public.current_role() = 'admin'))
    or (access = 'restricted' and public.is_privileged())
  );
create policy "documents write" on public.documents
  for all to authenticated
  using (owner_id = public.current_employee_id() or public.is_privileged())
  with check (owner_id = public.current_employee_id() or public.is_privileged());

-- Payroll: highly sensitive. Own record, or finance/exec/admin -------------
create policy "payroll read" on public.payroll
  for select to authenticated using (
    employee_id = public.current_employee_id()
    or public.is_privileged()
    or exists (
      select 1 from public.employees e
      where e.auth_id = auth.uid() and e.department_id = 'd-finance'
    )
  );
create policy "payroll write" on public.payroll
  for all to authenticated
  using (public.is_privileged())
  with check (public.is_privileged());
