"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import SectionHeader from "../components/ui/SectionHeader";
import PageShell from "../components/layout/PageShell";

const formatEventDate = (dateValue) => {
  if (!dateValue) {
    return "Date unavailable";
  }

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return date.toLocaleString();
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

const getEventKey = (event, fallbackIndex, suffix = "") => {
  const base = event?._id || `${event?.title || "event"}-${event?.start || fallbackIndex}`;
  return suffix ? `${base}-${suffix}` : base;
};

export default function Home() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const [events, setEvents] = useState([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [currentTrendingIndex, setCurrentTrendingIndex] = useState(0);
  const [trendingCardsToShow, setTrendingCardsToShow] = useState(3);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [reviewsToShow, setReviewsToShow] = useState(3);

  useEffect(() => {
    let isMounted = true;

    const loadEvents = async () => {
      try {
        setIsLoadingEvents(true);
        const response = await fetch(`${apiBaseUrl}/events`);

        if (!response.ok) {
          throw new Error("Failed to load events.");
        }

        const payload = await response.json();
        const eventList = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.events)
            ? payload.events
            : [];

        if (isMounted) {
          setEvents(eventList);
        }
      } catch {
        if (isMounted) {
          setEvents([]);
        }
      } finally {
        if (isMounted) {
          setIsLoadingEvents(false);
        }
      }
    };

    loadEvents();

    return () => {
      isMounted = false;
    };
  }, [apiBaseUrl]);

  useEffect(() => {
    let isMounted = true;

    const loadReviews = async () => {
      try {
        setIsLoadingReviews(true);
        const response = await fetch(`${apiBaseUrl}/reviews`);
        if (!response.ok) {
          throw new Error("Failed to load reviews.");
        }

        const payload = await response.json();
        const reviewList = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.data)
            ? payload.data
            : Array.isArray(payload?.reviews)
              ? payload.reviews
              : [];

        if (isMounted) {
          setReviews(reviewList);
        }
      } catch {
        if (isMounted) {
          setReviews([]);
        }
      } finally {
        if (isMounted) {
          setIsLoadingReviews(false);
        }
      }
    };

    loadReviews();

    return () => {
      isMounted = false;
    };
  }, [apiBaseUrl]);

  // Handle responsive number of cards for trending carousel
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setTrendingCardsToShow(1);
      else if (window.innerWidth < 1024) setTrendingCardsToShow(2);
      else setTrendingCardsToShow(3);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle responsive number of cards for reviews carousel
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setReviewsToShow(1);
      else if (window.innerWidth < 1024) setReviewsToShow(2);
      else setReviewsToShow(3);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sortedEvents = useMemo(() => {
    const now = new Date();
    const futureEvents = events.filter(event => new Date(event.start) > now);
    return futureEvents.sort(
      (left, right) => new Date(left.start).getTime() - new Date(right.start).getTime()
    );
  }, [events]);

  const featuredEvents = useMemo(() => sortedEvents.slice(0, 3), [sortedEvents]);
  const upcomingEvents = useMemo(() => sortedEvents.slice(3, 6), [sortedEvents]);
  const trendingEvents = useMemo(() => {
    return [...sortedEvents]
      .sort((a, b) => {
        const aBooked = a.seats?.filter(s => s.bookingStatus === 'booked').length || 0;
        const bBooked = b.seats?.filter(s => s.bookingStatus === 'booked').length || 0;
        return bBooked - aBooked;
      })
      .slice(0, 3);
  }, [sortedEvents]);

  // Autoplay carousel
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentTrendingIndex + trendingCardsToShow < trendingEvents.length) {
        setCurrentTrendingIndex((prev) => prev + trendingCardsToShow);
      } else {
        setCurrentTrendingIndex(0);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [currentTrendingIndex, trendingCardsToShow, trendingEvents.length]);

  const prevTrendingSlide = () => {
    setCurrentTrendingIndex((prev) => Math.max(0, prev - trendingCardsToShow));
  };

  const nextTrendingSlide = () => {
    setCurrentTrendingIndex((prev) =>
      Math.min(prev + trendingCardsToShow, trendingEvents.length - trendingCardsToShow)
    );
  };

  // Review carousel navigation
  const prevReviewSlide = () => {
    setCurrentReviewIndex((prev) => Math.max(0, prev - reviewsToShow));
  };

  const nextReviewSlide = () => {
    setCurrentReviewIndex((prev) =>
      Math.min(prev + reviewsToShow, reviews.length - reviewsToShow)
    );
  };

  const carouselReviews = useMemo(() => {
    if (reviews.length <= 3) {
      return reviews;
    }

    const items = [];
    for (let i = 0; i < 3; i += 1) {
      const nextIndex = (reviewIndex + i) % reviews.length;
      items.push(reviews[nextIndex]);
    }
    return items;
  }, [reviewIndex, reviews]);

  return (
    <div>
      <section className="relative overflow-hidden">
        {/* Background image with overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
        
        <PageShell className="relative py-12 md:py-26">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] items-center">
            {/* Left side: Text & CTAs */}
            <div className="space-y-6 text-white">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-2 text-xs uppercase tracking-[0.3em]">
                🔥 Festival Season 2026
              </div>
              <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                Discover festivals that hit <span className="text-[#206eaa]">different.</span>
              </h1>
              <p className="max-w-xl text-base text-white/80 sm:text-lg">
                Book the boldest experiences across Sri Lanka. Curated lineups,
                VIP upgrades, and instant access to the most electric nights.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/events">
                  <Button size="lg" className="bg-[#206eaa] hover:bg-[#1a5a8f] text-white">
                    Explore Events
                  </Button>
                </Link>
                <Link href="/events">
                  <Button variant="secondary" size="lg" className="border-white/30 text-white hover:bg-white/10">
                    View Lineup
                  </Button>
                </Link>
              </div>
              
              {/* Search bar */}
              <div className="mt-8 rounded-2xl bg-white/10 backdrop-blur-md p-1 sm:flex">
                <Input 
                  placeholder="Search by event, city, or vibe" 
                  className="w-full border-0 bg-transparent text-white placeholder:text-white/60 focus:ring-0"
                />
                <Button size="md" className="w-full sm:w-auto bg-[#206eaa] hover:bg-[#1a5a8f] mt-2 sm:mt-0">
                  Search
                </Button>
              </div>
            </div>

            {/* Right side: Trending events card */}
            <div className="rounded-2xl border border-white/20 bg-black/40 backdrop-blur-md p-4 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="text-xs uppercase tracking-[0.35em] text-white/70">
                  🔥 Trending Now
                </div>
                <Link href="/events" className="text-xs text-[#206eaa] hover:underline">
                  See all →
                </Link>
              </div>
              <div className="space-y-3">
                {isLoadingEvents ? (
                  // Loading skeletons
                  [...Array(3)].map((_, i) => (
                    <div key={i} className="flex gap-3 p-3 rounded-xl bg-white/5 animate-pulse">
                      <div className="w-16 h-16 rounded-lg bg-white/10" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-white/10 rounded w-3/4" />
                        <div className="h-3 bg-white/10 rounded w-1/2" />
                      </div>
                    </div>
                  ))
                ) : (
                  trendingEvents.slice(0, 3).map((event) => (
                    <Link 
                      href={`/events/${event._id}`} 
                      key={event._id}
                      className="flex gap-3 p-3 rounded-xl transition-all hover:bg-white/10 group"
                    >
                      <div 
                        className="w-16 h-16 rounded-lg bg-cover bg-center shrink-0"
                        style={{
                          backgroundImage: (event.coverImage && event.coverImage.trim() && !event.coverImage.includes('example.com') && !event.coverImage.includes('placeholder')) 
                            ? `url("${event.coverImage}")` 
                            : "url('https://images.unsplash.com/photo-1459749411175-04bf5292ceea?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80')"
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-white text-sm truncate">
                          {event.title}
                        </div>
                        <div className="text-xs text-white/60 truncate">
                          {formatEventDate(event.start)} · {event.location}
                        </div>
                        <div className="text-xs font-semibold text-[#206eaa] mt-1">
                          {formatLowestSeatPrice(event.seats)}
                        </div>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>
        </PageShell>
      </section>

      {/* Featured Events Section */}
   <section className="relative py-16 bg-gradient-to-b from-[#0a0a0f] to-[#0f0f14]">
  <PageShell>
    {/* Section Header */}
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-12">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs uppercase tracking-[0.3em] text-[#206eaa]">
          ✨ Featured
        </div>
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Events for your crew
        </h2>
        <p className="text-white/60 max-w-2xl">
          Handpicked festivals that sell out fast. Grab your spot before it's gone.
        </p>
      </div>
      <Link href="/events">
        <Button variant="secondary" size="md" className="border-white/20 text-white hover:bg-white/10 group">
          View all events
          <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </Link>
    </div>

    {/* Event Grid */}
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {isLoadingEvents ? (
        [...Array(3)].map((_, i) => (
          <div key={i} className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden animate-pulse">
            <div className="h-56 bg-white/10" />
            <div className="p-5 space-y-3">
              <div className="h-5 bg-white/10 rounded w-3/4" />
              <div className="h-4 bg-white/10 rounded w-1/2" />
              <div className="h-4 bg-white/10 rounded w-2/3" />
              <div className="h-6 bg-white/10 rounded w-1/3 mt-4" />
            </div>
          </div>
        ))
      ) : (
        featuredEvents.map((event, index) => {
          // Real data helpers
          const availableSeats = event.seats?.filter(s => s.bookingStatus === 'available').length || 0;
          const totalSeats = event.seats?.length || 0;
          const isSellingFast = availableSeats > 0 && (availableSeats / totalSeats) < 0.2;
          const daysLeft = Math.ceil((new Date(event.start) - new Date()) / (1000 * 60 * 60 * 24));
          
          // Category from first tag
          const primaryTag = event.tags?.[0] || '';
          const categoryMap = {
            music: '🎵 Music Festival',
            concert: '🎤 Concert',
            festival: '🎉 Festival',
            party: '🎊 Party',
            sports: '⚽ Sports',
          };
          const category = categoryMap[primaryTag.toLowerCase()] || `🎫 ${primaryTag.charAt(0).toUpperCase() + primaryTag.slice(1)}`;

          // Image: coverImage (if real) or galleryImage or fallback
          const cardImage = event.coverImage && event.coverImage !== 'https://example.com/summerfest-cover.jpg'
            ? event.coverImage
            : (event.galleryImages?.[0] || 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80');

          return (
            <Link
              href={`/events/${event._id}`}
              key={getEventKey(event, index, 'featured')}
              className="group relative rounded-2xl bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-sm border border-white/10 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:border-[#206eaa]/50 hover:shadow-2xl hover:shadow-[#206eaa]/20"
            >
              {/* Image Section */}
              <div className="relative h-56 overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url("${cardImage}")` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Category Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="inline-flex items-center gap-1 rounded-full bg-black/60 backdrop-blur px-2.5 py-1 text-xs font-medium text-white shadow-lg">
                    {category}
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
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-xl font-bold text-white group-hover:text-[#206eaa] transition-colors line-clamp-1">
                    {event.title}
                  </h3>
                  {/* Like button placeholder */}
                  <button 
                    className="p-1 rounded-full hover:bg-white/10 transition-colors"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                  >
                    <svg className="w-5 h-5 text-white/60 hover:text-red-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>

                {/* Date */}
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{formatEventDate(event.start)}</span>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="truncate">{event.location || "TBD"}</span>
                </div>

                {/* Availability & Countdown */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-1.5 text-xs text-white/50">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                    </svg>
                    <span>{availableSeats} tickets left</span>
                  </div>
                  <div className="text-xs text-white/40">
                    ⏱️ {daysLeft > 0 ? daysLeft : 0} days left
                  </div>
                </div>

                {/* Animated decorative line */}
                <div className="w-12 h-0.5 bg-gradient-to-r from-[#206eaa] to-transparent rounded-full transition-all duration-500 group-hover:w-full" />
              </div>
            </Link>
          );
        })
      )}
    </div>
  </PageShell>
</section>

      {/* <section>
        <PageShell className="space-y-8">
          <SectionHeader
            eyebrow="Featured"
            title="Featured events for your crew"
            subtitle="Handpicked festivals that sell out fast."
          />
          <div className="grid gap-6 md:grid-cols-3">
            {isLoadingEvents ? (
              <Card className="md:col-span-3">
                <p className="text-sm text-[var(--muted)]">Loading featured events...</p>
              </Card>
            ) : null}
            {featuredEvents.map((event, index) => (
              <Card key={getEventKey(event, index, "featured")} className="space-y-4">
                <div
                  className="h-40 rounded-2xl bg-[var(--surface-2)]/80 bg-cover bg-center"
                  style={{
                    backgroundImage: event?.coverImage
                      ? `url("${event.coverImage}")`
                      : "none",
                  }}
                />
                <div className="space-y-2">
                  <div className="text-lg font-semibold">{event.title}</div>
                  <div className="text-sm text-[var(--muted)]">
                    {formatEventDate(event.start)} · {event.location}
                  </div>
                  <div className="text-sm font-semibold text-[var(--brand)]">
                    {formatLowestSeatPrice(event.seats)}
                  </div>
                </div>
                <Link href={`/events/${event._id}`}>
                  <Button size="sm">View Event</Button>
                </Link>
              </Card>
            ))}
          </div>
        </PageShell>
      </section> */}

     <section className="relative py-16 bg-gradient-to-b from-[#0f0f14] to-[#0a0a0f]">
  <PageShell>
    {/* Section Header */}
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-12">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs uppercase tracking-[0.3em] text-[#206eaa]">
          📅 Upcoming
        </div>
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Events on the horizon
        </h2>
        <p className="text-white/60 max-w-2xl">
          Fresh drops every week. Grab tickets before the buzz.
        </p>
      </div>
      <Link href="/events">
        <Button variant="secondary" size="md" className="border-white/20 text-white hover:bg-white/10 group">
          Browse calendar
          <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </Link>
    </div>

    {/* Event Grid */}
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {isLoadingEvents ? (
        // Loading skeletons
        [...Array(3)].map((_, i) => (
          <div key={i} className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden animate-pulse">
            <div className="h-48 bg-white/10" />
            <div className="p-5 space-y-3">
              <div className="h-5 bg-white/10 rounded w-3/4" />
              <div className="h-4 bg-white/10 rounded w-1/2" />
              <div className="h-4 bg-white/10 rounded w-2/3" />
              <div className="h-6 bg-white/10 rounded w-1/3 mt-4" />
            </div>
          </div>
        ))
      ) : (
        upcomingEvents.map((event, index) => {
          // Real data helpers
          const availableSeats = event.seats?.filter(s => s.bookingStatus === 'available').length || 0;
          const totalSeats = event.seats?.length || 0;
          const isSellingFast = availableSeats > 0 && (availableSeats / totalSeats) < 0.2;
          const daysLeft = Math.ceil((new Date(event.start) - new Date()) / (1000 * 60 * 60 * 24));
          
          // Category from first tag
          const primaryTag = event.tags?.[0] || '';
          const categoryMap = {
            music: '🎵 Music',
            concert: '🎤 Concert',
            festival: '🎉 Festival',
            party: '🎊 Party',
            sports: '⚽ Sports',
          };
          const category = categoryMap[primaryTag.toLowerCase()] || `🎫 ${primaryTag.charAt(0).toUpperCase() + primaryTag.slice(1)}`;

          // Image: coverImage (if real) or galleryImage or fallback
          const cardImage = event.coverImage && event.coverImage !== 'https://example.com/summerfest-cover.jpg'
            ? event.coverImage
            : (event.galleryImages?.[0] || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80');

          return (
            <Link
              href={`/events/${event._id}`}
              key={getEventKey(event, index, 'upcoming')}
              className="group relative rounded-2xl bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-sm border border-white/10 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:border-[#206eaa]/50 hover:shadow-2xl hover:shadow-[#206eaa]/20"
            >
              {/* Image Section */}
              <div className="relative h-48 overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url("${cardImage}")` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Category Badge (slightly different style for upcoming) */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#206eaa]/80 backdrop-blur px-2.5 py-1 text-xs font-medium text-white shadow-lg">
                    {category}
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
                <h3 className="text-xl font-bold text-white group-hover:text-[#206eaa] transition-colors line-clamp-1">
                  {event.title}
                </h3>

                {/* Date */}
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{formatEventDate(event.start)}</span>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="truncate">{event.location || "TBD"}</span>
                </div>

                {/* Availability & Countdown */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-1.5 text-xs text-white/50">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                    </svg>
                    <span>{availableSeats} tickets left</span>
                  </div>
                  <div className="text-xs text-white/40">
                    ⏱️ {daysLeft > 0 ? daysLeft : 0} days left
                  </div>
                </div>

                {/* Animated decorative line */}
                <div className="w-12 h-0.5 bg-gradient-to-r from-[#206eaa] to-transparent rounded-full transition-all duration-500 group-hover:w-full" />
              </div>
            </Link>
          );
        })
      )}
    </div>
  </PageShell>
</section>

      {/* <section className="border-y border-white/10 bg-[var(--surface)]/50">
        <PageShell className="space-y-8">
          <SectionHeader
            eyebrow="Upcoming"
            title="Upcoming events"
            subtitle="Fresh drops every week. Grab tickets before the buzz.
            "
          />
          <div className="grid gap-6 md:grid-cols-3">
            {upcomingEvents.map((event, index) => (
              <Card key={getEventKey(event, index, "upcoming")} className="space-y-4">
                <div
                  className="h-36 rounded-2xl bg-[var(--surface-2)]/80 bg-cover bg-center"
                  style={{
                    backgroundImage: event?.coverImage
                      ? `url("${event.coverImage}")`
                      : "none",
                  }}
                />
                <div className="space-y-2">
                  <div className="text-lg font-semibold">{event.title}</div>
                  <p className="text-sm text-[var(--muted)]">
                    {event.description}
                  </p>
                  <div className="text-sm text-[var(--muted)]">
                    {formatEventDate(event.start)} · {event.location}
                  </div>
                  <div className="text-sm font-semibold text-[var(--brand)]">
                    {formatLowestSeatPrice(event.seats)}
                  </div>
                </div>
                <Link href={`/events/${event._id}`}>
                  <Button size="sm" variant="secondary">
                    View Details
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </PageShell>
      </section> */}

      <section className="relative py-16 bg-gradient-to-b from-[#0a0a0f] to-[#0f0f14] overflow-hidden">
        <PageShell className="relative z-10">
          <SectionHeader
            eyebrow="Trending"
            title="Trending events carousel"
            subtitle="Swipe through the hottest stages right now."
          />

          {/* Carousel Container */}
          <div className="relative mt-8">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentTrendingIndex * (100 / trendingCardsToShow)}%)` }}
              >
                {trendingEvents.map((event, idx) => (
                  <Link
                    href={`/events/${event._id}`}
                    key={getEventKey(event, idx, "trending-carousel")}
                    className="flex-shrink-0 w-full md:w-1/2 lg:w-1/3 px-3"
                    style={{ flex: `0 0 ${100 / trendingCardsToShow}%` }}
                  >
                    <div className="group relative rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:border-[#206eaa]/50">
                      {/* Image */}
                      <div className="relative h-64 overflow-hidden">
                        <div
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                          style={{
                            backgroundImage: event?.coverImage
                              ? `url("${event.coverImage}")`
                              : "url('https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')",
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                        
                        {/* Trending Badge */}
                        <div className="absolute top-3 left-3 z-10">
                          <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-red-500 to-orange-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
                            🔥 Trending
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <h3 className="text-lg font-semibold text-white group-hover:text-[#206eaa] transition-colors line-clamp-1">
                          {event.title}
                        </h3>
                        <div className="mt-2 flex items-center gap-2 text-sm text-white/60">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{formatEventDate(event.start)}</span>
                        </div>
                        <div className="mt-1 flex items-center justify-between">
                          <div className="text-sm font-semibold text-[#206eaa]">
                            {formatLowestSeatPrice(event.seats)}
                          </div>
                          <div className="text-xs text-white/40 group-hover:text-[#206eaa] transition-colors">
                            Book now →
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={prevTrendingSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-black/50 backdrop-blur rounded-full p-2 text-white hover:bg-[#206eaa] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentTrendingIndex === 0}
              aria-label="Previous slide"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextTrendingSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-black/50 backdrop-blur rounded-full p-2 text-white hover:bg-[#206eaa] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentTrendingIndex >= trendingEvents.length - trendingCardsToShow}
              aria-label="Next slide"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Dots Indicators */}
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: Math.ceil(trendingEvents.length / trendingCardsToShow) }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentTrendingIndex(idx * trendingCardsToShow)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    Math.floor(currentTrendingIndex / trendingCardsToShow) === idx
                      ? "w-6 bg-[#206eaa]"
                      : "bg-white/30 hover:bg-white/50"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </PageShell>
      </section>

      <section className="relative border-y border-white/10 bg-gradient-to-br from-[#0a0a0f] to-[#0f0f14] overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#206eaa] rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-600 rounded-full blur-3xl" />
        </div>

        <PageShell className="relative z-10 py-16">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-start">
            {/* Left side: Filter section */}
            <div className="space-y-8">
              <SectionHeader
                eyebrow="Filters"
                title="Find your perfect vibe"
                subtitle="Sort by mood, genre, or crowd energy."
                className="!text-left"
              />
              
              {/* Tag cloud with icons */}
              <div className="flex flex-wrap gap-3">
                {[
                  { name: "Electro", icon: "⚡", active: true },
                  { name: "House", icon: "🏠", active: false },
                  { name: "Afro Beats", icon: "🥁", active: false },
                  { name: "Indie", icon: "🎸", active: false },
                  { name: "Day Parties", icon: "☀️", active: false },
                  { name: "Sunset Sessions", icon: "🌅", active: false },
                  { name: "Tech House", icon: "🔊", active: false },
                  { name: "Live Bands", icon: "🎤", active: false },
                ].map((tag) => (
                  <button
                    key={tag.name}
                    className={`
                      group relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300
                      ${tag.active
                        ? 'bg-[#206eaa] text-white shadow-lg shadow-[#206eaa]/30 scale-105'
                        : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:border-[#206eaa]/50 hover:text-white'
                      }
                    `}
                  >
                    <span className="text-base">{tag.icon}</span>
                    {tag.name}
                    {tag.active && (
                      <span className="absolute -top-1 -right-1 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#206eaa] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#206eaa]"></span>
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Additional filter options */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-sm text-white/60 mb-4">Crowd energy</p>
                <div className="flex gap-4">
                  {["Chill", "Energetic", "Rave"].map((energy) => (
                    <label key={energy} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="energy" className="w-4 h-4 accent-[#206eaa]" />
                      <span className="text-sm text-white/80">{energy}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Right side: Premium Newsletter card */}
            <Card className="relative overflow-hidden bg-gradient-to-br from-[#0f0f14] via-[#0a0a0f] to-[#1a1a22] backdrop-blur-xl border-2 border-[#206eaa]/40 rounded-3xl shadow-2xl shadow-[#206eaa]/20 hover:border-[#206eaa]/70 hover:shadow-2xl hover:shadow-[#206eaa]/40 transition-all duration-500 group">
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#206eaa]/20 to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
              
              {/* Blue accent corner */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#206eaa]/20 to-transparent rounded-full blur-3xl" />

              <div className="relative p-8 space-y-6">
                {/* Header with icon */}
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-xs uppercase tracking-widest font-bold text-[#206eaa] opacity-80 group-hover:opacity-100 transition-opacity">
                      ⭐ Newsletter
                    </div>
                  </div>
                  <div className="text-4xl transform group-hover:scale-110 transition-transform duration-300">📬</div>
                </div>

                {/* Main headline */}
                <div className="space-y-2">
                  <h3 className="text-3xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-[#206eaa] group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">
                    Get the first drop.
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed font-medium">
                    Weekly lineup reveals, early bird codes, and backstage perks — straight to your inbox.
                  </p>
                </div>

                {/* Subscribe form */}
                <div className="space-y-3 pt-2">
                  <div className="flex flex-col gap-3">
                    <Input
                      placeholder="Your email address"
                      className="bg-white/5 border border-[#206eaa]/30 text-white placeholder:text-white/40 focus:border-[#206eaa]/80 focus:bg-white/10 rounded-xl transition-all duration-300 h-11 text-sm"
                    />
                    <Button className="bg-gradient-to-r from-[#206eaa] to-[#1a5a8f] hover:from-[#2577bb] hover:to-[#206eaa] text-white font-semibold rounded-xl h-11 transition-all duration-300 shadow-lg shadow-[#206eaa]/30 hover:shadow-xl hover:shadow-[#206eaa]/50">
                      Subscribe
                    </Button>
                  </div>
                </div>

                {/* Footer text */}
                <div className="text-xs text-white/40 flex items-center gap-1 group-hover:text-white/60 transition-colors">
                  <svg className="w-3.5 h-3.5 text-[#206eaa]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span>No spam, unsubscribe anytime.</span>
                </div>
              </div>
            </Card>
          </div>
        </PageShell>
      </section>

      <section className="relative py-20 bg-gradient-to-b from-[#0a0a0f] via-[#0f0f14] to-[#0a0a0f] overflow-hidden">
        {/* Premium background with animated gradients */}
        <div className="absolute inset-0 opacity-50">
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-gradient-to-b from-[#206eaa] to-transparent rounded-full blur-3xl opacity-20 animate-pulse" />
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-to-t from-purple-600 to-transparent rounded-full blur-3xl opacity-15" />
          <div className="absolute top-1/2 left-0 w-72 h-72 bg-gradient-to-r from-[#206eaa]/20 to-transparent rounded-full blur-3xl" />
        </div>

        <PageShell className="relative z-10">
          {/* Premium section header */}
          <div className="text-center space-y-3 mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#206eaa]/30 bg-[#206eaa]/10 px-4 py-2 text-sm font-semibold text-[#206eaa] uppercase tracking-wider">
              ⭐ Testimonials
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white">
              Loved by thousands of{" "}
              <span className="bg-gradient-to-r from-[#206eaa] to-purple-500 bg-clip-text text-transparent">
                event lovers
              </span>
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Real reviews from real attendees. See why people choose EventWave for their unforgettable nights.
            </p>
          </div>

          {/* Carousel Container */}
          <div className="relative">
            <div className="overflow-hidden rounded-3xl">
              <div
                className="flex transition-transform duration-700 ease-out"
                style={{ transform: `translateX(-${currentReviewIndex * (100 / reviewsToShow)}%)` }}
              >
                {isLoadingReviews ? (
                  [...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="flex-shrink-0 px-4"
                      style={{ flex: `0 0 ${100 / reviewsToShow}%` }}
                    >
                      <div className="h-80 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 animate-pulse" />
                    </div>
                  ))
                ) : !isLoadingReviews && reviews.length === 0 ? (
                  <div className="w-full text-center py-20">
                    <p className="text-white/50 text-lg">No reviews yet. Be the first to share!</p>
                  </div>
                ) : (
                  reviews.map((review, idx) => (
                    <div
                      key={review.review_id || review._id || idx}
                      className="flex-shrink-0 px-4"
                      style={{ flex: `0 0 ${100 / reviewsToShow}%` }}
                    >
                      <div className="group relative h-full rounded-2xl bg-white/[0.03] backdrop-blur-xl border-2 border-white/5 hover:border-[#206eaa]/50 transition-all duration-500 overflow-hidden hover:shadow-2xl hover:shadow-[#206eaa]/20 flex flex-col p-8">
                        {/* Animated gradient background on hover */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#206eaa]/5 via-transparent to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        {/* Accent line */}
                        <div className="absolute top-0 left-0 w-0 h-1 bg-gradient-to-r from-[#206eaa] to-purple-500 group-hover:w-12 transition-all duration-500" />

                        <div className="relative z-10 flex flex-col h-full">
                          {/* Star rating - Premium styling */}
                          <div className="flex items-center gap-2 mb-6">
                            <div className="flex gap-1">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`w-5 h-5 transition-all ${
                                    i < (review.rating || 5)
                                      ? "text-yellow-400 fill-current drop-shadow-lg"
                                      : "text-white/10"
                                  }`}
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                              ))}
                            </div>
                            {review.rating && (
                              <span className="text-sm font-bold text-white/70 group-hover:text-[#206eaa] transition-colors">
                                {review.rating}.0
                              </span>
                            )}
                          </div>

                          {/* Review comment */}
                          <p className="text-white/75 text-base leading-relaxed font-medium flex-grow group-hover:text-white transition-colors mb-6">
                            "{review.comment}"
                          </p>

                          {/* Divider */}
                          <div className="h-px bg-gradient-to-r from-white/10 to-transparent mb-6" />

                          {/* User info - Bottom section */}
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#206eaa] to-[#1a5a8f] flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-[#206eaa]/40 group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                              {review.user_name?.charAt(0).toUpperCase() || 'A'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-bold text-white group-hover:text-[#206eaa] transition-colors truncate">
                                {review.user_name || "Anonymous Guest"}
                              </div>
                              {review.createdAt && (
                                <div className="text-xs text-white/40 group-hover:text-white/60 transition-colors">
                                  {new Date(review.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Navigation: Prev Button */}
            {!isLoadingReviews && reviews.length > reviewsToShow && (
              <>
                <button
                  onClick={prevReviewSlide}
                  disabled={currentReviewIndex === 0}
                  className="absolute -left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-[#206eaa] to-[#1a5a8f] text-white shadow-lg shadow-[#206eaa]/30 hover:shadow-2xl hover:shadow-[#206eaa]/50 hover:scale-110 disabled:opacity-40 disabled:scale-100 transition-all duration-300 group"
                  aria-label="Previous reviews"
                >
                  <svg className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Navigation: Next Button */}
                <button
                  onClick={nextReviewSlide}
                  disabled={currentReviewIndex >= reviews.length - reviewsToShow}
                  className="absolute -right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-[#206eaa] to-[#1a5a8f] text-white shadow-lg shadow-[#206eaa]/30 hover:shadow-2xl hover:shadow-[#206eaa]/50 hover:scale-110 disabled:opacity-40 disabled:scale-100 transition-all duration-300 group"
                  aria-label="Next reviews"
                >
                  <svg className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </div>

          {/* Dot Indicators - Premium Style */}
          {!isLoadingReviews && reviews.length > reviewsToShow && (
            <div className="flex justify-center gap-3 mt-12">
              {Array.from({ length: Math.ceil(reviews.length / reviewsToShow) }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentReviewIndex(idx * reviewsToShow)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    Math.floor(currentReviewIndex / reviewsToShow) === idx
                      ? "w-8 bg-gradient-to-r from-[#206eaa] to-purple-500 shadow-lg shadow-[#206eaa]/50"
                      : "w-2.5 bg-white/20 hover:bg-white/40"
                  }`}
                  aria-label={`Go to review page ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </PageShell>
      </section>
    </div>
  );
}
