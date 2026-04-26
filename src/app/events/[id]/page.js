import Link from "next/link";
import { notFound } from "next/navigation";

import Button from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";
import SectionHeader from "../../../components/ui/SectionHeader";
import PageShell from "../../../components/layout/PageShell";
import EventReviewsSection from "../../../components/events/EventReviewsSection";
import TheatreSeatingMap from "../../../components/events/TheatreSeatingMap";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";

const formatDateTime = (value) => {
  if (!value) {
    return "Date unavailable";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return date.toLocaleString();
};

const formatPrice = (value) => {
  const amount = Number(value);
  if (!Number.isFinite(amount)) {
    return "Price unavailable";
  }
  return `LKR ${amount.toLocaleString()}`;
};

const findLowestSeatPrice = (seats) => {
  if (!Array.isArray(seats) || seats.length === 0) {
    return "Price unavailable";
  }

  const prices = seats
    .map((seat) => Number(seat?.price))
    .filter((price) => Number.isFinite(price));

  if (!prices.length) {
    return "Price unavailable";
  }

  return `LKR ${Math.min(...prices).toLocaleString()}`;
};

export default async function EventDetailPage({ params }) {
  const { id } = await params;

  const eventResponse = await fetch(`${apiBaseUrl}/events/${id}`, {
    cache: "no-store",
  });

  if (!eventResponse.ok) {
    notFound();
  }

  const eventPayload = await eventResponse.json();
  const event = eventPayload?.event || eventPayload;

  if (!event) {
    notFound();
  }

  let relatedEvents = [];
  try {
    const eventsResponse = await fetch(`${apiBaseUrl}/events`, {
      cache: "no-store",
    });
    if (eventsResponse.ok) {
      const eventsPayload = await eventsResponse.json();
      const allEvents = Array.isArray(eventsPayload)
        ? eventsPayload
        : Array.isArray(eventsPayload?.events)
          ? eventsPayload.events
          : [];
      
      // Get current time for filtering past events
      const now = new Date();
      
      // Filter: exclude current event, exclude past events, optionally match tags
      relatedEvents = allEvents
        .filter((item) => item?._id !== event._id) // exclude current event
        .filter((item) => {
          // exclude past events (end time is before now)
          const itemEndDate = new Date(item?.end);
          return itemEndDate > now;
        })
        .filter((item) => {
          // prefer events with matching tags
          const currentTags = event?.tags || [];
          const itemTags = item?.tags || [];
          return currentTags.some((tag) => itemTags.includes(tag)) || true; // if no common tags, still include
        })
        .sort((a, b) => {
          // sort by start date (upcoming first)
          const dateA = new Date(a?.start);
          const dateB = new Date(b?.start);
          return dateA - dateB;
        })
        .slice(0, 3); // take first 3
    }
  } catch {}

  return (
    <div>
      <section className="border-b border-white/10 bg-gradient-to-b from-[#0a0a0f] to-[#0f0f14]">
        <PageShell className="grid gap-8 py-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#206eaa]/30 bg-[#206eaa]/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-[#4a9fd8] font-medium">
              {event.status}
            </div>
            <h1 className="text-4xl font-bold text-white sm:text-5xl">
              {event.title}
            </h1>
            <p className="text-base text-white/75 sm:text-lg leading-relaxed">
              {event.description}
            </p>
            <div className="flex flex-wrap gap-3 text-sm text-white/70 font-medium">
              <span className="flex items-center gap-2">
                📅 {formatDateTime(event.start)} - {formatDateTime(event.end)}
              </span>
              <span className="flex items-center gap-2">📍 {event.location}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {(event.tags || []).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[#206eaa]/30 bg-[#206eaa]/10 px-3 py-1 text-xs text-[#4a9fd8] font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href={`/ticket-selection?eventId=${encodeURIComponent(event._id)}&title=${encodeURIComponent(event.title)}&date=${encodeURIComponent(formatDateTime(event.start))}&location=${encodeURIComponent(event.location)}&image=${encodeURIComponent(event.galleryImages?.[0] || event.coverImage || "")}`}
              >
                <Button variant="primary" size="lg" className="bg-[#206eaa] hover:bg-[#1a5a8f] text-white font-semibold shadow-lg shadow-[#206eaa]/30">
                  Book Tickets
                </Button>
              </Link>
              <a href="#seatMap">
                <Button variant="secondary" size="lg" className="border border-white/20 bg-white/10 hover:bg-white/15 text-white font-medium">
                  View Seat Map
                </Button>
              </a>
            </div>
          </div>
          <div
            className="relative min-h-[380px] overflow-hidden rounded-3xl border border-white/20 bg-cover bg-center p-8 shadow-2xl shadow-[#206eaa]/20"
            style={{
              backgroundImage: event?.coverImage
                ? `url("${event.coverImage}")`
                : undefined,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="relative flex h-full min-h-[300px] items-end">
              <div className="space-y-3">
                <div className="text-xs uppercase tracking-[0.35em] text-white/80 font-semibold">
                  Starting from
                </div>
                <div className="text-4xl font-bold text-white">
                  {findLowestSeatPrice(event.seats)}
                </div>
                <div className="text-sm text-white/80 font-medium">
                  General admission available
                </div>
              </div>
            </div>
          </div>
        </PageShell>
      </section>

      <section className="py-12 bg-gradient-to-b from-[#0f0f14] to-[#0a0a0f]">
        <PageShell className="space-y-8">
          <SectionHeader
            eyebrow="Gallery"
            title="Event gallery"
            subtitle="Swipe through the visual vibe before you book."
          />
          <div className="grid gap-6 md:grid-cols-3">
            {(event.galleryImages || []).map((imageUrl, index) => (
              <div
                key={`${imageUrl}-${index}`}
                className="group relative rounded-2xl bg-gradient-to-br from-white/12 via-white/8 to-white/5 overflow-hidden border border-white/20 transition-all duration-300 hover:-translate-y-2 hover:border-[#206eaa]/60 hover:shadow-2xl hover:shadow-[#206eaa]/25 h-56"
              >
                <img
                  src={imageUrl}
                  alt={`${event.title} gallery ${index + 1}`}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
            ))}
          </div>
        </PageShell>
      </section>

      {event.isSeated ? (
        <section id="seatMap" className="border-y border-white/10 bg-gradient-to-b from-[#0a0a0f] to-[#0f0f14] py-12">
          <PageShell className="space-y-6">
            <SectionHeader
              eyebrow="Seat Map"
              title="Choose your seat"
              subtitle="Pick the spot that matches your energy."
            />
            <TheatreSeatingMap seats={event.seats} />
          </PageShell>
        </section>
      ) : null}

      <section className="py-12 bg-gradient-to-b from-[#0f0f14] to-[#0a0a0f]">
        <PageShell className="space-y-8">
          <SectionHeader
            eyebrow="Related"
            title="Related events"
            subtitle="Keep the night rolling with these picks."
          />
          <div className="grid gap-6 md:grid-cols-3">
            {relatedEvents.map((item) => (
              <Link key={item._id} href={`/events/${item._id}`}>
                <div className="group relative rounded-2xl bg-gradient-to-br from-white/12 via-white/8 to-white/5 backdrop-blur-lg border border-white/20 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:border-[#206eaa]/60 hover:shadow-2xl hover:shadow-[#206eaa]/25 h-full flex flex-col cursor-pointer">
                  <div className="relative h-40 overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                      style={{
                        backgroundImage: item?.coverImage
                          ? `url("${item.coverImage}")`
                          : "linear-gradient(135deg, rgba(32, 110, 170, 0.1) 0%, rgba(32, 110, 170, 0.05) 100%)",
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                  <div className="p-4 flex-1 flex flex-col gap-3">
                    <h3 className="text-lg font-bold text-white group-hover:text-[#4a9fd8] transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <div className="text-xs text-white/75 font-medium space-y-1">
                      <div className="flex items-center gap-1">📅 {formatDateTime(item.start)}</div>
                      <div className="flex items-center gap-1">📍 {item.location}</div>
                    </div>
                    <div className="mt-auto text-sm font-semibold text-white/50 group-hover:text-[#4a9fd8] transition-colors flex items-center gap-1">
                      View event
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </PageShell>
      </section>

      <EventReviewsSection eventId={id} eventName={event.title} />
    </div>
  );
}
