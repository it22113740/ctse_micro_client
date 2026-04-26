"use client";

import { useEffect, useState } from "react";

export default function BookingsPage() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadBookings = async () => {
      const token = window.localStorage.getItem("authToken");
      if (!token) {
        if (isMounted) {
          setBookings([]);
          setIsLoading(false);
        }
        return;
      }

      try {
        setIsLoading(true);
        setErrorMessage("");
        const response = await fetch(`${apiBaseUrl}/bookings`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch bookings.");
        }

        const payload = await response.json();
        const items = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.bookings)
            ? payload.bookings
            : [];
        if (isMounted) {
          setBookings(items);
        }
      } catch (error) {
        if (isMounted) {
          setBookings([]);
          setErrorMessage(error.message || "Failed to fetch bookings.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadBookings();

    return () => {
      isMounted = false;
    };
  }, [apiBaseUrl]);

  return (
    <main className="min-h-screen bg-[#0a0a0f] py-16 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-black text-white mb-2">
            My Bookings
          </h1>
          <p className="text-white/60 text-base">
            Track your tickets and upcoming festival moments.
          </p>
        </div>

        {/* Bookings Grid */}
        <div className="space-y-6">
          
          {/* Loading State */}
          {isLoading && (
            <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center">
              <div className="inline-block w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin mb-4"></div>
              <p className="text-white/60 text-sm">Loading your bookings...</p>
            </div>
          )}

          {/* Error State */}
          {!isLoading && errorMessage && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-8">
              <p className="text-red-400 font-semibold text-sm">{errorMessage}</p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !errorMessage && bookings.length === 0 && (
            <div className="rounded-xl border border-white/10 bg-white/5 p-12 text-center">
              <div className="text-4xl mb-3">🎫</div>
              <h3 className="text-lg font-bold text-white mb-1">No Bookings Yet</h3>
              <p className="text-white/50 text-sm">You haven't booked any events yet.</p>
            </div>
          )}

          {/* Booking Cards */}
          {bookings.map((booking) => (
            <div
              key={booking.booking_id || `${booking.event_id}-${booking.email}`}
              className="rounded-xl border border-white/10 bg-white/5 p-6 hover:border-white/20 hover:bg-white/8 transition-all"
            >
              
              {/* Header */}
              <div className="flex items-start justify-between gap-4 mb-6 pb-4 border-b border-white/10">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    {booking.event_name}
                  </h3>
                  <p className="text-white/50 text-xs">
                    Event ID: {booking.event_id}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold">
                  Confirmed
                </span>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-sm">
                
                <div>
                  <p className="text-white/50 text-xs font-semibold mb-1">CUSTOMER</p>
                  <p className="text-white font-semibold">{booking.customer_name || "-"}</p>
                </div>

                <div>
                  <p className="text-white/50 text-xs font-semibold mb-1">EMAIL</p>
                  <p className="text-white/80 font-semibold break-all">{booking.email || "-"}</p>
                </div>

                <div>
                  <p className="text-white/50 text-xs font-semibold mb-1">PHONE</p>
                  <p className="text-white font-semibold">{booking.phone_number || "-"}</p>
                </div>

                <div>
                  <p className="text-white/50 text-xs font-semibold mb-1">TICKET PRICE</p>
                  <p className="text-[#4a9fd8] font-bold">LKR {Number(booking.ticket_price || 0).toLocaleString()}</p>
                </div>

                <div>
                  <p className="text-white/50 text-xs font-semibold mb-1">BOOKING DATE</p>
                  <p className="text-white font-semibold">
                    {booking.booking_date
                      ? new Date(booking.booking_date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "-"}
                  </p>
                </div>

                <div>
                  <p className="text-white/50 text-xs font-semibold mb-1">BOOKING TIME</p>
                  <p className="text-white font-semibold">{booking.booking_time || "-"}</p>
                </div>

                <div>
                  <p className="text-white/50 text-xs font-semibold mb-1">SEAT</p>
                  <p className="text-white font-semibold">{booking.seat_number || "-"}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
