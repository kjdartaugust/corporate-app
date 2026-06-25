# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Production build — run this to verify type-safety before committing
npm run start    # Serve the production build
npm run lint     # next lint
npm run seed     # Seed a real Supabase project (needs .env.local with service role key)
```

There is no test suite. `npm run build` is the primary correctness gate (TypeScript is `strict`).

On this Windows machine, npm cert errors are resolved with `NODE_OPTIONS=--use-system-ca npm install`.

## Environment & demo mode

The app is designed to run **with or without** a live Supabase backend, controlled by
`src/lib/supabase/{client,server,middleware}.ts` exporting `isDemoMode`:

- `isDemoMode` is `true` when `NEXT_PUBLIC_DEMO_MODE === "true"` **or** when
  `NEXT_PUBLIC_SUPABASE_URL` is unset.
- In demo mode, middleware auth is bypassed and the data layer serves the in-memory
  fixtures from `src/lib/data/demo.ts` instead of querying Supabase. This is what makes the
  app runnable/deployable with zero configuration.
- When real Supabase env vars are present and demo mode is off, the same data-access
  functions query Postgres through the SSR client and Row Level Security applies.

Any new data-access code must honor this dual path: branch on `isDemoMode` and provide a
demo fixture fallback, otherwise the app breaks when deployed without Supabase.

## Architecture

- **Next.js 14 App Router** under `src/app`. Route groups: `(auth)` for login, and a
  protected dashboard group that shares the app shell (sidebar + topbar + theme toggle).
- **Supabase** via `@supabase/ssr`. Three client factories, each with its own concern:
  `client.ts` (browser components), `server.ts` (Server Components / actions, cookie-bound),
  `middleware.ts` (`updateSession` refreshes the auth cookie and gates protected routes).
  `src/middleware.ts` wires `updateSession` into the request pipeline.
- **Theming**: Tailwind with `darkMode: "class"`. All colors are CSS custom properties
  (`hsl(var(--…))`) defined in `src/app/globals.css` for light and `.dark`. `next-themes`
  toggles the class. Use the semantic tokens (`bg-card`, `text-muted-foreground`, `border`,
  `bg-primary`, status colors `success`/`warning`/`destructive`) — never hard-coded hex —
  so both modes stay correct.
- **Types** live in `src/lib/types.ts` and are the single source of truth shared by the
  demo fixtures, the data layer, and the SQL schema. Keep all three in sync when changing a
  shape.
- **Data privacy** is enforced at the database with department-level Row Level Security
  policies (see `supabase/migrations`). RLS — not application code — is the security
  boundary; app-side filtering is convenience only.

## Conventions

- Use the `cn()` helper (`src/lib/utils.ts`) for conditional class names, and the shared
  formatters there (`formatCurrency`, `formatDate`, `relativeTime`, `initials`,
  `classForStatus`) rather than re-implementing them.
- Import via the `@/*` path alias (maps to `src/*`).
- UI primitives live in `src/components/ui`; compose pages from them rather than restyling
  raw elements, to keep the enterprise look consistent.
