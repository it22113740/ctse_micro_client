"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function DetailsContent() {
  const router = useRouter();
  const [formValues, setFormValues] = useState({
    fullName: "",
    phone: "",
    email: "",
  });
  const searchParams = useSearchParams();
  const eventId = searchParams.get("eventId") || "";
  const eventTitle = searchParams.get("title") || "Event Title";
  const eventDate = searchParams.get("date") || "Event Date";
  const eventLocation = searchParams.get("location") || "Event Location";
  const eventImage = searchParams.get("image") || "https://images.unsplash.com/photo-1464983953574-0892a7162a1e?auto=format&fit=crop&w=400&q=80";
  const vipCount = parseInt(searchParams.get("vipCount")) || 0;
  const standardCount = parseInt(searchParams.get("standardCount")) || 0;
  const totalTickets = vipCount + standardCount;
  const seats = searchParams.get("seats") || "";

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  // Removed duplicate handlePrevious declaration
  const bookingQueryBase = `eventId=${encodeURIComponent(eventId)}&title=${encodeURIComponent(eventTitle)}&date=${encodeURIComponent(eventDate)}&location=${encodeURIComponent(eventLocation)}&image=${encodeURIComponent(eventImage)}`;

  const handlePrevious = () =>
    router.push(
      `/seat-selection?${bookingQueryBase}&vipCount=${vipCount}&standardCount=${standardCount}&seats=${encodeURIComponent(seats)}`,
    );

  const handleSubmit = (event) => {
    event.preventDefault();
    router.push(
      `/payment?${bookingQueryBase}&vipCount=${vipCount}&standardCount=${standardCount}&seats=${encodeURIComponent(seats)}&fullName=${encodeURIComponent(formValues.fullName)}&phone=${encodeURIComponent(formValues.phone)}&email=${encodeURIComponent(formValues.email)}`,
    );
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#0f1419] to-[#050609] relative overflow-hidden py-12 px-4">
      
      {/* Subtle Background Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#206eaa]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        
        {/* Main Container - Two Column */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          
          {/* Left - Event Image */}
          <div className="hidden md:flex items-center justify-center">
            <div className="relative w-full max-w-sm">
              <div className="absolute inset-0 bg-gradient-to-r from-[#206eaa]/40 to-[#1a5a8f]/20 rounded-2xl blur-2xl"></div>
              <img
                src={eventImage}
                alt={eventTitle}
                className="relative w-full h-96 object-cover rounded-2xl border border-white/15 shadow-2xl shadow-[#206eaa]/30"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-2xl"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-white font-bold text-lg">{eventTitle}</p>
                <p className="text-white/60 text-xs mt-1">{eventDate}</p>
              </div>
            </div>
          </div>

          {/* Right - Form Card */}
          <div>
            <div className="rounded-2xl border border-white/15 bg-gradient-to-br from-white/8 via-white/3 to-white/[0.01] backdrop-blur-lg p-8 shadow-2xl shadow-[#206eaa]/20">
              
              {/* Header */}
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-white mb-1">Attendee Details</h1>
                <p className="text-white/50 text-xs">{eventTitle}</p>
              </div>

              {/* Summary */}
              <div className="p-3 rounded-lg bg-white/5 border border-white/10 mb-6 text-center">
                <p className="text-white/60 text-xs">{eventDate} • {totalTickets} Ticket{totalTickets !== 1 ? 's' : ''}</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1 uppercase tracking-wide">Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formValues.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-[#206eaa] focus:bg-white/15 focus:ring-1 focus:ring-[#206eaa]/40 transition-all outline-none text-sm"
                    required
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1 uppercase tracking-wide">Phone</label>
                  <div className="flex items-center px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 focus-within:border-[#206eaa] focus-within:bg-white/15 focus-within:ring-1 focus-within:ring-[#206eaa]/40 transition-all">
                    <span className="text-xs font-semibold text-white/60 mr-2">+94</span>
                    <input
                      type="tel"
                      name="phone"
                      value={formValues.phone}
                      onChange={handleChange}
                      placeholder="(555) 000-0000"
                      className="flex-1 bg-transparent text-white placeholder-white/40 outline-none text-sm"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1 uppercase tracking-wide">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formValues.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-[#206eaa] focus:bg-white/15 focus:ring-1 focus:ring-[#206eaa]/40 transition-all outline-none text-sm"
                    required
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="px-6 py-2.5 rounded-lg border border-white/20 text-white text-sm font-semibold hover:bg-white/10 transition-all"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={!eventId}
                    className="flex-1 px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#206eaa] to-[#1a5a8f] hover:from-[#1a5a8f] hover:to-[#0f3d5a] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all shadow-lg shadow-[#206eaa]/40"
                  >
                    Continue
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

export default function DetailsPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
          <p className="text-white/60 text-sm">Loading…</p>
        </main>
      }
    >
      <DetailsContent />
    </Suspense>
  );
}
