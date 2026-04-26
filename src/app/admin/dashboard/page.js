import Link from "next/link";

import Button from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";
import PageShell from "../../../components/layout/PageShell";
import SectionHeader from "../../../components/ui/SectionHeader";
import eventsData from "../../../data/events";

const { events } = eventsData;

export default function AdminDashboardPage() {
  const activeEvents = events.filter((event) => event.status === "active");
  const seatedEvents = events.filter((event) => event.isSeated);

  return (
    <PageShell className="space-y-10">
      <SectionHeader
        eyebrow="Admin"
        title="Dashboard"
        subtitle="Monitor activity and launch quick actions."
      />

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="space-y-2">
          <div className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
            Total events
          </div>
          <div className="text-2xl font-semibold">{events.length}</div>
        </Card>
        <Card className="space-y-2">
          <div className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
            Active events
          </div>
          <div className="text-2xl font-semibold">{activeEvents.length}</div>
        </Card>
        <Card className="space-y-2">
          <div className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
            Seated events
          </div>
          <div className="text-2xl font-semibold">{seatedEvents.length}</div>
        </Card>
        <Card className="space-y-2">
          <div className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
            Reviews pending
          </div>
          <div className="text-2xl font-semibold">12</div>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="space-y-4">
          <div className="text-xs uppercase tracking-[0.3em] text-[var(--brand-2)]">
            Quick actions
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link href="/admin/events">
              <Button className="w-full">Manage Events</Button>
            </Link>
            <Link href="/admin/events">
              <Button variant="secondary" className="w-full">
                Event Status
              </Button>
            </Link>
          </div>
        </Card>

        <Card className="space-y-4">
          <div className="text-xs uppercase tracking-[0.3em] text-[var(--brand-2)]">
            Latest events
          </div>
          <div className="space-y-3">
            {events.slice(0, 3).map((event) => (
              <div key={event.id} className="space-y-1">
                <div className="text-sm font-semibold">{event.title}</div>
                <div className="text-xs text-[var(--muted)]">
                  {event.startDate} · {event.location}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </PageShell>
  );
}
