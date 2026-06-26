import Link from "next/link";
import { Hexagon } from "lucide-react";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-8">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground">
              <Hexagon className="h-5 w-5" />
            </span>
            <span className="font-bold">Northwind</span>
          </Link>
          <div className="space-y-1.5">
            <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-sm text-muted-foreground">
              Sign in to your corporate workspace.
            </p>
          </div>
          <LoginForm />
          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-medium text-primary hover:underline">
              Create one
            </Link>
          </p>
          <p className="text-center text-xs text-muted-foreground">
            Protected by SSO &amp; 2FA · Department-level data privacy
          </p>
        </div>
      </div>

      <div className="relative hidden overflow-hidden bg-gradient-to-br from-primary via-indigo-600 to-pink-600 lg:block">
        <div className="grid-bg absolute inset-0 opacity-30" />
        <div className="relative flex h-full flex-col justify-end p-12 text-white">
          <blockquote className="text-2xl font-semibold leading-snug">
            “Northwind unified eight tools into one workspace. Our people finally have a
            single source of truth.”
          </blockquote>
          <p className="mt-4 text-sm text-white/80">
            Grace Mensah · Head of People
          </p>
        </div>
      </div>
    </div>
  );
}
