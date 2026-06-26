// Single source of truth for demo-mode detection, shared by the browser,
// server and edge (middleware) Supabase helpers.
//
// Demo-first: the app runs on in-memory fixtures UNLESS it is explicitly
// pointed at a real Supabase project. This keeps zero-config deploys (e.g.
// Vercel without env vars, or with the placeholder values from .env.example)
// fully working instead of redirecting to a login that has no backend.
//
//   - NEXT_PUBLIC_DEMO_MODE="true"   → always demo
//   - NEXT_PUBLIC_DEMO_MODE="false"  → live, but only if a real URL is set
//   - unset                          → demo unless a real (non-placeholder) URL is set

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const flag = process.env.NEXT_PUBLIC_DEMO_MODE;

const hasRealSupabaseUrl =
  !!url && !url.includes("your-project-ref") && !url.includes("YOUR_");

export const isDemoMode =
  flag === "true" || (flag !== "false" && !hasRealSupabaseUrl);
