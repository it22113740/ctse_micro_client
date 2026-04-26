import Link from "next/link";

const adminLinks = [
  { label: "Dashboard", href: "/admin/dashboard" },
  { label: "Events", href: "/admin/events" },
];

export default function AdminFooter() {
  return (
    <footer className="border-t border-white/10 bg-[var(--surface)]/70">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-[var(--muted)] md:flex-row md:items-center md:justify-between">
        <div>© 2026 EventWave Admin. All rights reserved.</div>
        <div className="flex flex-wrap gap-4">
          {adminLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition hover:text-[var(--foreground)]"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
