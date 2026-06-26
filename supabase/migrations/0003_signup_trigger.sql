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
