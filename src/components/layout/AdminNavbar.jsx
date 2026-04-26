import Link from "next/link";

import Button from "../ui/Button";

const adminLinks = [
  { label: "Dashboard", href: "/admin/dashboard" },
  { label: "Events", href: "/admin/events" },
  { label: "User Portal", href: "/" },
];

export default function AdminNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[var(--surface)]/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[var(--brand-2)] text-sm font-semibold text-white shadow-[0_10px_30px_-12px_rgba(56,189,248,0.7)]">
            AD
          </div>
          <div>
            <div className="text-sm font-semibold">EventWave</div>
            <div className="text-[11px] uppercase tracking-[0.25em] text-[var(--muted)]">
              Admin
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-[var(--muted)] md:flex">
          {adminLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition hover:text-[var(--foreground)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/admin/login">
            <Button variant="secondary" size="sm">
              Admin Login
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
