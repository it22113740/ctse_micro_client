"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import SectionHeader from "../../components/ui/SectionHeader";
import PageShell from "../../components/layout/PageShell";

const filters = [
  "All",
  "Electro",
  "House",
  "Indie",
  "Day Parties",
  "Sunset",
  "VIP",
];

const formatDateRange = (start, end) => {
  if (!start || !end) {
    return "Date not available";
  }

  const startDate = new Date(start);
  const endDate = new Date(end);

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return "Date not available";
  }

  const startLabel = startDate.toLocaleString();
  const endLabel = endDate.toLocaleString();
  return `${startLabel} - ${endLabel}`;
};

const formatLowestSeatPrice = (seats) => {
  if (!Array.isArray(seats) || seats.length === 0) {
    return "Price unavailable";
  }

  const prices = seats
    .map((seat) => Number(seat?.price))
    .filter((price) => Number.isFinite(price));

  if (!prices.length) {
    return "Price unavailable";
  }

  return `LKR ${Math.min(...prices).toLocaleString()}+`;
};

// Helper to get category from first tag
const getCategoryFromTags = (tags) => {
  if (!tags || tags.length === 0) return "🎫 Event";
  const primaryTag = tags[0].toLowerCase();
  const categoryMap = {
    music: "🎵 Music",
    concert: "🎤 Concert",
    festival: "🎉 Festival",
    party: "🎊 Party",
    sports: "⚽ Sports",
  };
  return categoryMap[primaryTag] || `🎫 ${tags[0].charAt(0).toUpperCase() + tags[0].slice(1)}`;
};

export default function EventsPage() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All"); // UI only – not used for filtering yet
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // 4 rows × 3 columns

  useEffect(() => {
    let isMounted = true;

    const loadEvents = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const response = await fetch(`${apiBaseUrl}/events`);
        if (!response.ok) {
          throw new Error("Failed to load events.");
        }

        const payload = await response.json();
        const nextEvents = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.events)
            ? payload.events
            : [];

        if (isMounted) {
          setEvents(nextEvents);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error.message || "Failed to load events.");
          setEvents([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadEvents();

    return () => {
      isMounted = false;
    };
  }, [apiBaseUrl]);

  const filteredEvents = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    if (!normalizedSearch) {
      return events;
    }

    return events.filter((event) => {
      const title = event?.title?.toLowerCase() || "";
      const location = event?.location?.toLowerCase() || "";
      const tags = Array.isArray(event?.tags)
        ? event.tags.join(" ").toLowerCase()
        : "";
      return (
        title.includes(normalizedSearch) ||
        location.includes(normalizedSearch) ||
        tags.includes(normalizedSearch)
      );
    });
  }, [events, searchTerm]);

  // Reset pagination when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Pagination logic
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEvents = filteredEvents.slice(startIndex, startIndex + itemsPerPage);

  // Smart page numbers with ellipsis
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div>
      {/* Header Section with gradient */}
      <section className="border-b border-white/10 bg-gradient-to-b from-[#0a0a0f] to-[#0f0f14]">
        <PageShell className="space-y-8 py-12">
          <SectionHeader
            eyebrow="Discover"
            title="Events listing"
            subtitle="Browse every festival drop and lock your tickets in seconds."
          />

          {/* Search Bar – clean design */}
          <div className="flex flex-col gap-3 rounded-xl p-4 md:flex-row md:items-center">
            <Input
              placeholder="Search by event, city, or tag"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="flex-1 bg-white/10 border border-white/20 text-white placeholder:text-white/50 rounded-lg p-3 focus:outline-none focus:border-white/40 transition-colors"
            />
            <Button className="shrink-0 bg-white/15 hover:bg-white/20 text-white rounded-lg px-6 py-3 font-medium transition-colors" type="button">
              Search
            </Button>
          </div>

          {/* Filter Chips – interactive */}
          <div className="flex flex-wrap gap-3">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`
                  rounded-full px-4 py-2 text-xs font-medium transition-all duration-200
                  ${activeFilter === filter
                    ? "bg-[#206eaa] text-white shadow-lg shadow-[#206eaa]/30"
                    : "border border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                  }
                `}
              >
                {filter}
              </button>
            ))}
          </div>
        </PageShell>
      </section>

      {/* Events Grid */}
      <section className="py-12 bg-gradient-to-b from-[#0f0f14] to-[#0a0a0f]">
        <PageShell>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading ? (
              // Loading skeletons (6 cards)
              [...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden animate-pulse"
                >
                  <div className="h-48 bg-white/10" />
                  <div className="p-5 space-y-3">
                    <div className="h-5 bg-white/10 rounded w-3/4" />
                    <div className="h-4 bg-white/10 rounded w-1/2" />
                    <div className="h-4 bg-white/10 rounded w-2/3" />
                    <div className="h-6 bg-white/10 rounded w-1/3 mt-4" />
                  </div>
                </div>
              ))
            ) : errorMessage ? (
              <Card className="md:col-span-2 lg:col-span-3 text-center py-12">
                <p className="text-red-400">{errorMessage}</p>
              </Card>
            ) : filteredEvents.length === 0 ? (
              <Card className="md:col-span-2 lg:col-span-3 text-center py-12">
                <p className="text-white/60">No events found for your search.</p>
              </Card>
            ) : (
              paginatedEvents.map((event) => {
                // Real data helpers (same as homepage)
                const availableSeats = event.seats?.filter(s => s.bookingStatus === 'available').length || 0;
                const totalSeats = event.seats?.length || 0;
                const isSellingFast = availableSeats > 0 && (availableSeats / totalSeats) < 0.2;
                const daysLeft = Math.ceil((new Date(event.start) - new Date()) / (1000 * 60 * 60 * 24));

                // Image: coverImage (skip placeholder) or gallery first or fallback
                const cardImage = event.coverImage && event.coverImage !== 'https://example.com/summerfest-cover.jpg'
                  ? event.coverImage
                  : (event.galleryImages?.[0] || 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80');

                return (
                  <Link
                    href={`/events/${event._id}`}
                    key={event._id}
                    className="group relative rounded-2xl bg-gradient-to-br from-white/12 via-white/8 to-white/5 backdrop-blur-lg border border-white/20 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:border-[#206eaa]/60 hover:shadow-2xl hover:shadow-[#206eaa]/25 hover:bg-gradient-to-br hover:from-white/15 hover:via-white/10 hover:to-white/8"
                  >
                    {/* Image Section */}
                    <div className="relative h-48 overflow-hidden">
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                        style={{ backgroundImage: `url("${cardImage}")` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                      {/* Category Badge */}
                      <div className="absolute top-3 left-3 z-10">
                        <span className="inline-flex items-center gap-1 rounded-full bg-black/60 backdrop-blur px-2.5 py-1 text-xs font-medium text-white shadow-lg">
                          {getCategoryFromTags(event.tags)}
                        </span>
                      </div>

                      {/* Selling Fast Badge */}
                      {isSellingFast && (
                        <div className="absolute top-3 right-3 z-10">
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-500/90 backdrop-blur px-2.5 py-1 text-xs font-bold text-white shadow-lg animate-pulse">
                            🔥 Selling Fast
                          </span>
                        </div>
                      )}

                      {/* Price Tag */}
                      <div className="absolute bottom-3 right-3 z-10 transition-all duration-300 group-hover:scale-110">
                        <span className="inline-flex items-center rounded-full bg-black/80 backdrop-blur px-3 py-1.5 text-sm font-bold text-white border border-white/20">
                          {formatLowestSeatPrice(event.seats)}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-3">
                      <h3 className="text-lg font-bold text-white group-hover:text-[#4a9fd8] transition-colors line-clamp-1">
                        {event.title}
                      </h3>

                      {/* Date */}
                      <div className="flex items-center gap-2 text-sm text-white/75 font-medium">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="truncate">{formatDateRange(event.start, event.end)}</span>
                      </div>

                      {/* Location */}
                      <div className="flex items-center gap-2 text-sm text-white/75 font-medium">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="truncate">{event.location || "TBD"}</span>
                      </div>

                      {/* Tags */}
                      {event.tags && event.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {event.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full border border-white/20 bg-white/8 px-2 py-0.5 text-xs text-white/70 font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Availability & Countdown */}
                      <div className="flex items-center justify-between pt-2 border-t border-white/10">
                        <div className="flex items-center gap-1.5 text-xs text-white/70 font-medium">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                          </svg>
                          <span className="text-[#4a9fd8]">{availableSeats}</span>
                          <span>tickets left</span>
                        </div>
                        <div className="text-xs text-white/60 font-medium">
                          ⏱️ {daysLeft > 0 ? daysLeft : 0} days
                        </div>
                      </div>

                      {/* "View Event" indicator */}
                      <div className="mt-3 text-sm font-semibold text-white/50 group-hover:text-[#4a9fd8] transition-colors flex items-center gap-1">
                        View event
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && !isLoading && !errorMessage && (
            <div className="mt-12 space-y-4">
              {/* Navigation Buttons & Page Numbers */}
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {/* Previous Button */}
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg border border-white/20 bg-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/15 transition-colors font-medium"
                >
                  ← Previous
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {getPageNumbers().map((page, idx) => {
                    if (page === '...') {
                      return (
                        <span key={`ellipsis-${idx}`} className="px-2 text-white/40 font-medium">⋯</span>
                      );
                    }
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          currentPage === page
                            ? 'bg-[#206eaa] text-white shadow-lg shadow-[#206eaa]/30'
                            : 'border border-white/20 bg-white/10 text-white hover:bg-white/15'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg border border-white/20 bg-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/15 transition-colors font-medium"
                >
                  Next →
                </button>
              </div>

              {/* Page Indicator */}
              <div className="text-center text-sm text-white/60 font-medium">
                Page {currentPage} of {totalPages} • {filteredEvents.length} total events
              </div>
            </div>
          )}
        </PageShell>
      </section>
    </div>
  );
}