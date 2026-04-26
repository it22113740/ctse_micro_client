"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function ConfirmationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventTitle = searchParams.get("title") || "Event Title";
  const eventDate = searchParams.get("date") || "Event Date";
  const eventLocation = searchParams.get("location") || "Event Location";
  const eventImage = searchParams.get("image") || "https://images.unsplash.com/photo-1464983953574-0892a7162a1e?auto=format&fit=crop&w=400&q=80";

  const userName = searchParams.get("fullName") || "";
  const userPhone = searchParams.get("phone") || "";
  const userEmail = searchParams.get("email") || "";

  const seatsParam = searchParams.get("seats") || "";
  const bookingIdsParam = searchParams.get("bookingIds") || "";
  const bookingIds = bookingIdsParam ? bookingIdsParam.split(",").filter(Boolean) : [];
  const seatNumbers = seatsParam ? seatsParam.split(",") : [];
  const purchasedTickets = seatNumbers.map((seat) => ({
    title: eventTitle,
    date: eventDate,
    time: "9:00 PM",
    zone: seat[0],
    row: seat[0],
    seat,
    location: eventLocation,
    holder: userName,
    phone: userPhone,
    email: userEmail,
    image: eventImage,
  }));

  const handleDownload = () => alert("Downloading ticket...");
  const handleShare = () => alert("Sharing ticket via email...");
  const handleHome = () => router.push("/");

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#0f1419] to-[#050609] relative overflow-hidden py-12 px-4 flex items-center justify-center">
      
      {/* Subtle Background Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#206eaa]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        
        {/* Main Card */}
        <div className="rounded-2xl border border-white/15 bg-gradient-to-br from-white/8 via-white/3 to-white/[0.01] backdrop-blur-lg p-8 shadow-2xl shadow-[#206eaa]/20">
          
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#206eaa]/30 to-[#1a5a8f]/20 border border-[#206eaa]/40 flex items-center justify-center text-3xl">
              ✓
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-1">Confirmed!</h1>
            <p className="text-white/50 text-xs">
              {bookingIds.length
                ? bookingIds.map((id) => `#${id}`).join(" · ")
                : `#BK${Math.random().toString(36).slice(2, 11).toUpperCase()}`}
            </p>
          </div>

          {/* Details */}
          <div className="space-y-3 mb-8">
            
            <div className="rounded-lg bg-white/5 border border-white/10 p-3">
              <p className="text-xs font-semibold text-white/70 uppercase tracking-wide mb-1">Event</p>
              <p className="text-white font-semibold text-sm">{eventTitle}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-white/5 border border-white/10 p-3">
                <p className="text-xs font-semibold text-white/70 uppercase tracking-wide mb-1">Date</p>
                <p className="text-white font-semibold text-sm">{eventDate}</p>
              </div>
              <div className="rounded-lg bg-white/5 border border-white/10 p-3">
                <p className="text-xs font-semibold text-white/70 uppercase tracking-wide mb-1">Seats</p>
                <p className="text-[#4a9fd8] font-bold text-sm">{seatNumbers.join(", ")}</p>
              </div>
            </div>

            <div className="rounded-lg bg-white/5 border border-white/10 p-3">
              <p className="text-xs font-semibold text-white/70 uppercase tracking-wide mb-1">Name</p>
              <p className="text-white font-semibold text-sm">{userName}</p>
            </div>

            <div className="rounded-lg bg-white/5 border border-white/10 p-3">
              <p className="text-xs font-semibold text-white/70 uppercase tracking-wide mb-1">Email</p>
              <p className="text-white font-semibold text-xs truncate">{userEmail}</p>
            </div>
          </div>

          {/* Message */}
          <div className="text-center mb-8 p-3 rounded-lg bg-[#206eaa]/10 border border-[#206eaa]/20">
            <p className="text-white/70 text-xs">✓ Confirmation email sent</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleDownload}
              className="flex-1 px-6 py-2.5 rounded-lg border border-white/20 text-white text-sm font-semibold hover:bg-white/10 transition-all"
            >
              📥 Download
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="flex-1 px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#206eaa] to-[#1a5a8f] hover:from-[#1a5a8f] hover:to-[#0f3d5a] text-white text-sm font-semibold transition-all shadow-lg shadow-[#206eaa]/40"
            >
              ✉️ Share
            </button>
          </div>

          {/* Home Button */}
          <button
            type="button"
            onClick={handleHome}
            className="w-full px-6 py-2.5 rounded-lg border border-white/20 text-white text-sm font-semibold hover:bg-white/10 transition-all mt-4"
          >
            🏠 Back to Home
          </button>
        </div>
      </div>
    </main>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
          <p className="text-white/60 text-sm">Loading confirmation…</p>
        </main>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}
