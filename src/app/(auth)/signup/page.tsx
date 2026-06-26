import Link from "next/link";
import { Hexagon } from "lucide-react";
import { SignupForm } from "./signup-form";

export default function SignupPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-primary via-indigo-600 to-pink-600 lg:block">
        <div className="grid-bg absolute inset-0 opacity-30" />
        <div className="relative flex h-full flex-col justify-end p-12 text-white">
          <blockquote className="text-2xl font-semibold leading-snug">
            “Everything your team needs — people, HR, documents, payroll and analytics — in one
            secure workspace.”
          </blockquote>
          <p className="mt-4 text-sm text-white/80">Northwind Corporate Workspace</p>
        </div>
      </div>

      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-8">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground">
              <Hexagon className="h-5 w-5" />
            </span>
            <span className="font-bold">Northwind</span>
          </Link>
          <div className="space-y-1.5">
            <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
            <p className="text-sm text-muted-foreground">
              Join your company&apos;s workspace in seconds.
            </p>
          </div>
          <SignupForm />
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
