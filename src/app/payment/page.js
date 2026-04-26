"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const toApiSeatNumber = (seatId) => {
  const s = String(seatId ?? "").trim();
  if (/^[A-Za-z]+-\d+$/.test(s)) return s;
  const m = /^([A-Za-z]+)(\d+)$/.exec(s);
  return m ? `${m[1].toUpperCase()}-${m[2]}` : s;
};

const normalizeLkPhone = (phone) => {
  const d = String(phone || "").replace(/\D/g, "");
  if (d.startsWith("94") && d.length >= 11) return `0${d.slice(2)}`.slice(0, 11);
  if (d.startsWith("0") && d.length >= 10) return d.slice(0, 10);
  if (d.length === 9) return `0${d}`;
  return d;
};

function PaymentContent() {
  const router = useRouter();
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const searchParams = useSearchParams();
  const eventId = searchParams.get("eventId") || "";
  const eventTitle = searchParams.get("title") || "Event Title";
  const eventDate = searchParams.get("date") || "Event Date";
  const eventLocation = searchParams.get("location") || "Event Location";
  const eventImage = searchParams.get("image") || "https://images.unsplash.com/photo-1464983953574-0892a7162a1e?auto=format&fit=crop&w=400&q=80";

  const vipCount = parseInt(searchParams.get("vipCount"), 10) || 0;
  const standardCount = parseInt(searchParams.get("standardCount"), 10) || 0;
  const totalTickets = vipCount + standardCount;
  const seats = searchParams.get("seats") || "";

  const selectedSeatKeys = seats
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const [pricedLines, setPricedLines] = useState([]);
  const [pricingLoading, setPricingLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const seatList = seats
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (!eventId || !apiBaseUrl || seatList.length === 0) {
      setPricedLines([]);
      setPricingLoading(false);
      return;
    }

    setPricingLoading(true);

    (async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/events/${eventId}`, {
          cache: "no-store",
        });
        const payload = await response.json();
        const event = payload?.event ?? payload;
        const apiSeats = Array.isArray(event?.seats) ? event.seats : [];
        const lines = seatList.map((sn) => {
          const key = toApiSeatNumber(sn);
          const found = apiSeats.find(
            (s) => String(s.seatNumber).toUpperCase() === key.toUpperCase(),
          );
          const price = Number(found?.price);
          return {
            seatNumber: found?.seatNumber || key,
            price: Number.isFinite(price) ? price : 0,
            available: found?.bookingStatus === "available",
          };
        });
        if (!cancelled) setPricedLines(lines);
      } catch {
        if (!cancelled) setPricedLines([]);
      } finally {
        if (!cancelled) setPricingLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [eventId, seats, apiBaseUrl]);

  const ticketPrice = pricedLines.reduce((sum, line) => sum + line.price, 0);

  const userName = searchParams.get("fullName") || "";
  const userPhone = searchParams.get("phone") || "";
  const userEmail = searchParams.get("email") || "";

  const bookingQueryBase = `eventId=${encodeURIComponent(eventId)}&title=${encodeURIComponent(eventTitle)}&date=${encodeURIComponent(eventDate)}&location=${encodeURIComponent(eventLocation)}&image=${encodeURIComponent(eventImage)}`;

  const handlePrevious = () =>
    router.push(
      `/details?${bookingQueryBase}&vipCount=${vipCount}&standardCount=${standardCount}&seats=${encodeURIComponent(seats)}`,
    );

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    const token = typeof window !== "undefined" ? window.localStorage.getItem("authToken") : null;
    if (!token) {
      setErrorMessage("Please log in to complete your booking.");
      return;
    }

    if (!eventId) {
      setErrorMessage("Missing event. Start again from the event page.");
      return;
    }

    const seatList = seats
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .sort();

    if (seatList.length === 0) {
      setErrorMessage("No seats selected.");
      return;
    }

    setIsSubmitting(true);

    try {
      const eventResponse = await fetch(`${apiBaseUrl}/events/${eventId}`, {
        cache: "no-store",
      });
      if (!eventResponse.ok) {
        throw new Error("Could not verify seats for this event.");
      }
      const eventPayload = await eventResponse.json();
      const event = eventPayload?.event ?? eventPayload;
      const apiSeats = Array.isArray(event?.seats) ? event.seats : [];

      const bookingIds = [];

      for (let i = 0; i < seatList.length; i += 1) {
        const key = toApiSeatNumber(seatList[i]);
        const found = apiSeats.find(
          (s) => String(s.seatNumber).toUpperCase() === key.toUpperCase(),
        );
        if (!found) {
          throw new Error(`Seat ${key} was not found on this event.`);
        }
        if (found.bookingStatus !== "available") {
          throw new Error(`Seat ${found.seatNumber} is no longer available.`);
        }
        const unitPrice = Number(found.price);
        if (!Number.isFinite(unitPrice) || unitPrice <= 0) {
          throw new Error(`Invalid price for seat ${found.seatNumber}.`);
        }

        const payload = {
          customer_name: userName,
          email: userEmail,
          phone_number: normalizeLkPhone(userPhone),
          event_id: eventId,
          event_name: eventTitle,
          seat_number: found.seatNumber,
          ticket_price: unitPrice,
        };

        const response = await fetch(`${apiBaseUrl}/bookings`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const responsePayload = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(responsePayload?.message || responsePayload?.error || "Booking failed.");
        }

        const id = responsePayload?.booking_id || responsePayload?.id;
        if (id) {
          bookingIds.push(id);
        }
      }

      const idsParam = bookingIds.length ? `&bookingIds=${encodeURIComponent(bookingIds.join(","))}` : "";

      router.push(
        `/confirmation?${bookingQueryBase}&vipCount=${vipCount}&standardCount=${standardCount}&seats=${encodeURIComponent(seats)}&fullName=${encodeURIComponent(userName)}&phone=${encodeURIComponent(userPhone)}&email=${encodeURIComponent(userEmail)}${idsParam}`,
      );
    } catch (err) {
      setErrorMessage(err.message || "Booking failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#0f1419] to-[#050609] relative overflow-hidden py-12 px-4">
      
      {/* Subtle Background Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#206eaa]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        
        {/* Main Container - Two Column */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* Left - Booking Summary */}
          <div className="hidden md:block">
            <div className="sticky top-12">
              {/* Event Image */}
              <div className="relative mb-6 overflow-hidden rounded-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-[#206eaa]/40 to-[#1a5a8f]/20 rounded-2xl blur-2xl"></div>
                <img
                  src={eventImage}
                  alt={eventTitle}
                  className="relative w-full h-72 object-cover rounded-2xl border border-white/15 shadow-2xl shadow-[#206eaa]/30"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white font-bold text-lg">{eventTitle}</p>
                  <p className="text-white/60 text-xs mt-1">{eventDate}</p>
                </div>
              </div>

              {/* Booking Details Card */}
              <div className="rounded-2xl border border-white/15 bg-gradient-to-br from-white/8 via-white/3 to-white/[0.01] backdrop-blur-lg p-6 shadow-2xl shadow-[#206eaa]/20">
                <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wide">Booking Summary</h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">Tickets</span>
                    <span className="text-white font-semibold">
                      {totalTickets || selectedSeatKeys.length}
                    </span>
                  </div>
                  {pricingLoading ? (
                    <p className="text-white/45 text-xs">Loading prices…</p>
                  ) : (
                    pricedLines.map((line) => (
                      <div
                        key={line.seatNumber}
                        className="flex justify-between items-center gap-2 text-xs"
                      >
                        <span className="text-white/60 shrink-0">{line.seatNumber}</span>
                        <span className="text-white font-semibold">
                          {line.price > 0
                            ? `${line.price.toLocaleString()} LKR`
                            : "—"}
                        </span>
                      </div>
                    ))
                  )}
                  <div className="h-px bg-white/10 my-2" />
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">Attendee</span>
                    <span className="text-white font-semibold text-xs">{userName}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Confirm booking */}
          <div>
            <div className="rounded-2xl border border-white/15 bg-gradient-to-br from-white/8 via-white/3 to-white/[0.01] backdrop-blur-lg p-8 shadow-2xl shadow-[#206eaa]/20">
              
              {/* Header */}
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-white mb-1">Confirm booking</h1>
                <p className="text-white/50 text-xs">Review and submit to reserve your seats</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {errorMessage ? (
                  <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                    {errorMessage}
                  </div>
                ) : null}

                {/* Price Summary */}
                <div className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/60">Tickets</span>
                    <span className="text-white font-semibold">{ticketPrice.toLocaleString()} LKR</span>
                  </div>
                  <div className="h-px bg-white/10" />
                  <div className="flex justify-between items-center">
                    <span className="text-white font-semibold">Total</span>
                    <span className="text-2xl font-black text-[#4a9fd8]">{ticketPrice.toLocaleString()} LKR</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="px-6 py-2.5 rounded-lg border border-white/20 text-white text-sm font-semibold hover:bg-white/10 transition-all"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#206eaa] to-[#1a5a8f] hover:from-[#1a5a8f] hover:to-[#0f3d5a] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all shadow-lg shadow-[#206eaa]/40"
                  >
                    {isSubmitting ? "Booking…" : "Confirm booking"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
          <p className="text-white/60 text-sm">Loading…</p>
        </main>
      }
    >
      <PaymentContent />
    </Suspense>
  );
}
