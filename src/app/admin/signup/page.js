import Link from "next/link";

import Button from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";
import PageShell from "../../../components/layout/PageShell";
import SectionHeader from "../../../components/ui/SectionHeader";

export default function AdminSignupPage() {
  return (
    <PageShell className="flex min-h-[75vh] items-center justify-center">
      <Card className="w-full max-w-2xl overflow-hidden p-0">
        <div className="bg-[var(--hero-gradient)] px-6 py-8 text-center">
          <div className="text-xs uppercase tracking-[0.35em] text-white/70">
            Admin Portal
          </div>
          <div className="mt-3 text-3xl font-semibold text-white">
            Admin sign up
          </div>
          <div className="mt-2 text-sm text-white/70">
            Create credentials for the platform team.
          </div>
        </div>

        <div className="space-y-6 px-6 py-8">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <SectionHeader
              eyebrow="Admin access"
              title="Create admin account"
              subtitle="Use official details to register."
            />
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Input placeholder="First Name" />
              <Input placeholder="Last Name" />
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Input type="email" placeholder="Admin email" />
              <Input type="tel" placeholder="Phone" />
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Input type="password" placeholder="Password" />
              <Input type="password" placeholder="Confirm Password" />
            </div>
            <Link href="/admin/dashboard" className="mt-5 block">
              <Button className="w-full">Create Admin Account</Button>
            </Link>
            <div className="mt-4 text-center text-xs text-[var(--muted)]">
              Already have an admin account?{" "}
              <Link href="/admin/login" className="hover:text-[var(--foreground)]">
                Login
              </Link>
            </div>
          </div>

          <div className="border-t border-white/10 pt-5 text-center">
            <div className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
              Admin only
            </div>
            <p className="mt-2 text-sm text-[var(--muted)]">
              This portal is dedicated to event management tasks.
            </p>
          </div>
        </div>
      </Card>
    </PageShell>
  );
}
