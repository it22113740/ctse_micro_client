"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function groupSeatsByRow(apiSeats) {
  if (!Array.isArray(apiSeats) || apiSeats.length === 0) {
    return { rows: {}, rowOrder: [], maxColumn: 0 };
  }
  const grouped = {};
  for (const seat of apiSeats) {
    const r = String(seat.row ?? "");
    if (!grouped[r]) grouped[r] = [];
    grouped[r].push(seat);
  }
  const rowKeys = Object.keys(grouped).sort((a, b) => Number(a) - Number(b));
  const rows = {};
  for (const k of rowKeys) {
    rows[k] = grouped[k].sort((a, b) => (a.column || 0) - (b.column || 0));
  }
  const maxColumn = Math.max(...apiSeats.map((s) => Number(s.column) || 0));
  return { rows, rowOrder: rowKeys, maxColumn };
}

function rowLabel(rowSeats) {
  const first = rowSeats?.[0];
  if (first?.seatNumber && String(first.seatNumber).includes("-")) {
    return String(first.seatNumber).split("-")[0];
  }
  return String(first?.row ?? "");
}

function SeatSelectionContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";

  const seatsParam = searchParams.get("seats") || "";
  const eventId = searchParams.get("eventId") || "";
  const eventTitle = searchParams.get("title") || "Event";
  const eventDate = searchParams.get("date") || "";
  const eventTime = searchParams.get("time") || "";
  const eventLocation = searchParams.get("location") || "";
  const eventImage =
    searchParams.get("image") ||
    "https://images.unsplash.com/photo-1470223991230-32aaa7d6c9b7?auto=format&fit=crop&w=400&q=80";

  const vipCount = parseInt(searchParams.get("vipCount"), 10) || 0;
  const standardCount = parseInt(searchParams.get("standardCount"), 10) || 0;
  const maxSeats = Math.max(1, vipCount + standardCount);

  const [eventSeats, setEventSeats] = useState([]);
  const [loadError, setLoadError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [selectedSeats, setSelectedSeats] = useState(() => {
    const initial = seatsParam
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    return new Set(initial);
  });

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!eventId || !apiBaseUrl) {
        setIsLoading(false);
        setEventSeats([]);
        if (!eventId) setLoadError("Missing event. Open an event and use Book Tickets.");
        else setLoadError("API URL is not configured.");
        return;
      }

      setIsLoading(true);
      setLoadError("");

      try {
        const response = await fetch(`${apiBaseUrl}/events/${eventId}`, {
          cache: "no-store",
        });
        if (!response.ok) {
          throw new Error("Could not load event seats.");
        }
        const payload = await response.json();
        const event = payload?.event ?? payload;
        const list = Array.isArray(event?.seats) ? event.seats : [];
        if (!cancelled) {
          setEventSeats(list);
        }
      } catch (e) {
        if (!cancelled) {
          setEventSeats([]);
          setLoadError(e.message || "Could not load event seats.");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [eventId, apiBaseUrl]);

  const { rows, rowOrder, maxColumn } = useMemo(
    () => groupSeatsByRow(eventSeats),
    [eventSeats],
  );

  const seatByNumber = useMemo(() => {
    const map = new Map();
    for (const s of eventSeats) {
      if (s?.seatNumber) map.set(String(s.seatNumber).toUpperCase(), s);
    }
    return map;
  }, [eventSeats]);

  useEffect(() => {
    if (!eventSeats.length) return;
    setSelectedSeats((prev) => {
      const next = new Set();
      for (const id of prev) {
        const key = String(id).toUpperCase();
        const seat = seatByNumber.get(key);
        if (seat && seat.bookingStatus === "available") {
          next.add(seat.seatNumber);
        }
      }
      return next;
    });
  }, [eventSeats, seatByNumber]);

  const toggleSeat = useCallback(
    (seat) => {
      if (!seat || seat.bookingStatus !== "available") return;
      const id = seat.seatNumber;
      setSelectedSeats((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else if (next.size < maxSeats) {
          next.add(id);
        }
        return next;
      });
    },
    [maxSeats],
  );

  const bookingQueryBase = `eventId=${encodeURIComponent(eventId)}&title=${encodeURIComponent(eventTitle)}&date=${encodeURIComponent(eventDate)}&location=${encodeURIComponent(eventLocation)}&image=${encodeURIComponent(eventImage)}`;

  const handlePrevious = () => {
    router.push(
      `/ticket-selection?${bookingQueryBase}&vipCount=${vipCount}&standardCount=${standardCount}`,
    );
  };

  const handleNext = () => {
    const seatCsv = Array.from(selectedSeats).sort().join(",");
    router.push(
      `/details?${bookingQueryBase}&vipCount=${vipCount}&standardCount=${standardCount}&seats=${encodeURIComponent(seatCsv)}`,
    );
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#0f1419] to-[#050609] relative overflow-hidden py-12 px-4 flex items-center justify-center">
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#206eaa]/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-4xl">
        <div className="rounded-2xl border border-white/15 bg-gradient-to-br from-white/8 via-white/3 to-white/[0.01] backdrop-blur-lg p-8 shadow-2xl shadow-[#206eaa]/20">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-white mb-1">Select seats</h1>
            <p className="text-white/50 text-sm">{eventTitle}</p>
          </div>

          <div className="flex gap-3 text-xs text-white/60 mb-8 pb-6 border-b border-white/10 flex-wrap justify-center">
            {eventDate ? <span>📅 {eventDate}</span> : null}
            {eventDate && eventTime ? <span>•</span> : null}
            {eventTime ? <span>⏰ {eventTime}</span> : null}
            {(eventDate || eventTime) && eventLocation ? <span>•</span> : null}
            {eventLocation ? <span>📍 {eventLocation}</span> : null}
          </div>

          {isLoading ? (
            <div className="py-16 text-center text-white/60 text-sm">Loading seat map…</div>
          ) : loadError ? (
            <div className="py-12 text-center rounded-lg border border-red-500/30 bg-red-500/10 px-4">
              <p className="text-red-300 text-sm">{loadError}</p>
            </div>
          ) : maxColumn === 0 ? (
            <div className="py-12 text-center text-white/50 text-sm">No seats defined for this event.</div>
          ) : (
            <>
              <div className="flex items-center justify-center gap-6 text-xs mb-6">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-white/20 border border-white/40" />
                  <span className="text-white/60">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-amber-500/60" />
                  <span className="text-white/60">Unavailable</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-[#4a9fd8]" />
                  <span className="text-white/60">Selected</span>
                </div>
              </div>

              <div className="mb-2 text-center text-xs text-white/40 font-semibold uppercase tracking-widest">
                Screen
              </div>

              <div className="p-6 rounded-lg bg-white/5 border border-white/10 flex justify-center overflow-x-auto mb-8">
                <div className="space-y-2">
                  {rowOrder.map((rowKey) => {
                    const rowSeats = rows[rowKey] || [];
                    const label = rowLabel(rowSeats);
                    return (
                      <div key={rowKey} className="flex items-center gap-3 justify-center">
                        <span className="w-6 text-center text-xs font-bold text-white/40 shrink-0">
                          {label}
                        </span>
                        <div className="flex gap-2 flex-wrap justify-center">
                          {Array.from({ length: maxColumn }).map((_, colIndex) => {
                            const col = colIndex + 1;
                            const seat = rowSeats.find((s) => Number(s.column) === col);

                            if (maxColumn >= 4 && col % 4 === 0 && col !== maxColumn) {
                              return (
                                <div
                                  key={`aisle-${rowKey}-${col}`}
                                  className="w-2 shrink-0"
                                  aria-hidden
                                />
                              );
                            }

                            if (!seat) {
                              return (
                                <div
                                  key={`empty-${rowKey}-${col}`}
                                  className="w-9 h-9 shrink-0"
                                />
                              );
                            }

                            const available = seat.bookingStatus === "available";
                            const selected = selectedSeats.has(seat.seatNumber);
                            let seatClasses =
                              "w-9 h-9 rounded text-[10px] font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4a9fd8] shrink-0 flex items-center justify-center";

                            if (!available) {
                              seatClasses +=
                                " bg-amber-500/50 text-white/90 border border-amber-500/40 cursor-not-allowed";
                            } else if (selected) {
                              seatClasses +=
                                " bg-[#4a9fd8] text-white border border-[#206eaa] shadow-lg shadow-[#206eaa]/40";
                            } else {
                              seatClasses +=
                                " bg-white/10 text-white/70 border border-white/20 hover:border-white/40 hover:bg-white/15";
                            }

                            return (
                              <button
                                key={seat.seatNumber}
                                type="button"
                                className={seatClasses}
                                title={`${seat.seatNumber} · ${seat.type || "Seat"} · LKR ${Number(seat.price || 0).toLocaleString()}`}
                                onClick={() => toggleSeat(seat)}
                                disabled={!available}
                                aria-pressed={selected}
                                aria-label={`Seat ${seat.seatNumber}${!available ? " unavailable" : ""}`}
                              >
                                {col}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          <div className="p-4 rounded-lg bg-gradient-to-r from-[#206eaa]/20 to-[#1a5a8f]/10 border border-[#206eaa]/20 mb-8">
            <div className="flex flex-col items-center justify-center gap-3 text-center">
              <span className="text-white/70 text-sm">
                Seats: {selectedSeats.size}/{maxSeats}
              </span>
              <div className="flex flex-wrap gap-2 justify-center">
                {Array.from(selectedSeats)
                  .sort()
                  .map((seatNum) => {
                    const s = seatByNumber.get(String(seatNum).toUpperCase());
                    const price = s ? Number(s.price) : null;
                    return (
                      <span
                        key={seatNum}
                        className="px-2 py-1 rounded text-xs font-semibold bg-[#206eaa]/40 text-[#4a9fd8] border border-[#206eaa]/30"
                      >
                        {seatNum}
                        {Number.isFinite(price) ? ` · LKR ${price.toLocaleString()}` : ""}
                      </span>
                    );
                  })}
                {selectedSeats.size === 0 && (
                  <span className="text-white/50 text-xs">No seats selected</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handlePrevious}
              className="px-6 py-3 rounded-lg border border-white/20 text-white text-sm font-semibold hover:bg-white/10 transition-all"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={!eventId || selectedSeats.size === 0 || isLoading || !!loadError}
              className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-[#206eaa] to-[#1a5a8f] hover:from-[#1a5a8f] hover:to-[#0f3d5a] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all shadow-lg shadow-[#206eaa]/40"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function SeatSelectionPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
          <p className="text-white/60 text-sm">Loading seats…</p>
        </main>
      }
    >
      <SeatSelectionContent />
    </Suspense>
  );
}
