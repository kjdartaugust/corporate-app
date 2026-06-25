# Northwind — Corporate Workspace

A sophisticated, enterprise-grade corporate management platform built with
**Next.js 14 (App Router)**, **Supabase**, and **Tailwind CSS**. It runs out of the
box in **demo mode** (no backend required) and becomes a real, RLS-secured Supabase
app the moment you add environment variables.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![Supabase](https://img.shields.io/badge/Supabase-Postgres%20%2B%20RLS-3ECF8E)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38BDF8)

## Features

- **Executive analytics dashboard** — ARR, headcount, payroll, attrition, engagement (Recharts)
- **Employee directory & profiles** — searchable, department-filtered, org/reporting view
- **Departments & roles** — budgets, leads, team composition
- **HR suite** — leave balances & requests, manager approvals, performance reviews
- **Announcements / internal news feed** — composer, likes, categories, pinning
- **Meeting room booking** — interactive day-grid scheduler
- **Document management** — public / department / restricted access control
- **Payroll overview** — gross/tax/benefits/net, per-department breakdown, register
- **Onboarding flow** — first-week checklist with progress tracking
- **Premium UI** — dark/light mode, glassmorphism, responsive, accessible
- **Department-level privacy** — enforced at the database with Supabase Row Level Security

## Quick start (demo mode)

```bash
npm install
cp .env.example .env.local   # NEXT_PUBLIC_DEMO_MODE=true is the default
npm run dev                  # http://localhost:3000
```

No Supabase account needed — the app serves rich in-memory data. Click **Sign in** on the
login page (credentials are pre-filled).

## Connecting a real Supabase backend

1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL editor, run `supabase/migrations/0001_schema.sql`, then `0002_rls.sql`.
3. Fill `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
   SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
   NEXT_PUBLIC_DEMO_MODE=false
   ```
4. Seed it: `npm run seed` (creates auth users + data; password `northwind-demo`).
5. `npm run dev` and sign in with any seeded email, e.g. `grace.mensah@northwind.co`.

## How demo mode works

`src/lib/supabase/{client,server,middleware}.ts` export `isDemoMode`, which is true when
`NEXT_PUBLIC_DEMO_MODE=true` or no Supabase URL is set. The data layer
(`src/lib/data/queries.ts`) branches on it: demo fixtures from `src/lib/data/demo.ts`, or
live Supabase queries (where RLS applies). This keeps the app deployable with zero config.

## Row Level Security

`0002_rls.sql` defines the security boundary (not the app). Highlights:

- **Documents** — `public` visible to all, `department` to the same department (or admin),
  `restricted` to executives/admins only.
- **Payroll** — your own record, plus Finance / executives / admins.
- **Leave** — your own requests; managers see their department; executives/admins see all.
- Helper functions (`current_employee_id`, `current_department`, `current_role`,
  `is_privileged`) resolve identity from the auth JWT via `SECURITY DEFINER`.

## Deploy to Vercel

1. Push to GitHub and import the repo into Vercel (framework auto-detected).
2. Add the env vars above in **Project Settings → Environment Variables**
   (or set `NEXT_PUBLIC_DEMO_MODE=true` for a zero-config live demo).
3. Deploy.

## Tech stack

Next.js 14 · React 18 · TypeScript (strict) · Supabase (`@supabase/ssr`) · Tailwind CSS ·
next-themes · Recharts · lucide-react · Zod

## Project structure

```
src/
  app/
    (auth)/login         # SSO-style sign in
    (dashboard)/         # protected shell: dashboard, directory, departments,
                         # hr/{leave,approvals,reviews}, announcements, rooms,
                         # documents, payroll, onboarding, analytics
  components/{ui,layout} # design system + app shell
  lib/{supabase,data}    # clients, demo fixtures, dual-path data layer, types
supabase/migrations      # 0001 schema, 0002 RLS
scripts/seed.mjs         # populate a real Supabase project
```
