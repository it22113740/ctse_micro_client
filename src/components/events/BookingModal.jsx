"use client";

import { useState } from "react";

import Button from "../ui/Button";
import Card from "../ui/Card";
import Input from "../ui/Input";

export default function BookingModal({ event }) {
  const [open, setOpen] = useState(false);

  const handleSubmit = (eventForm) => {
    eventForm.preventDefault();
    setOpen(false);
  };

  return (
    <>
      <Button size="lg" onClick={() => setOpen(true)}>
        Book Now
      </Button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-8">
          <Card className="w-full max-w-2xl space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-xs uppercase tracking-[0.3em] text-[var(--brand-2)]">
                  Booking
                </div>
                <div className="text-2xl font-semibold">Confirm your spot</div>
                <div className="text-sm text-[var(--muted)]">
                  Complete the details to reserve tickets.
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-white/10 px-3 py-1 text-xs text-[var(--muted)] transition hover:text-[var(--foreground)]"
              >
                Close
              </button>
            </div>

            <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 sm:grid-cols-2">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                  Event
                </div>
                <div className="text-sm font-semibold text-[var(--foreground)]">
                  {event.title}
                </div>
                <div className="text-xs text-[var(--muted)]">ID: {event.id}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                  Ticket Price
                </div>
                <div className="text-sm font-semibold text-[var(--foreground)]">
                  {event.ticketPrice}
                </div>
              </div>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input name="customer_name" placeholder="Customer Name" required />
                <Input type="email" name="email" placeholder="Email" required />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  type="tel"
                  name="phone_number"
                  placeholder="Phone Number"
                  required
                />
                <Input
                  type="date"
                  name="booking_date"
                  placeholder="Booking Date"
                  required
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  type="time"
                  name="booking_time"
                  placeholder="Booking Time"
                  required
                />
                <Input
                  name="event_name"
                  defaultValue={event.title}
                  readOnly
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input name="event_id" defaultValue={event.id} readOnly />
                <Input
                  name="ticket_price"
                  defaultValue={event.ticketPrice}
                  readOnly
                />
              </div>
              <div className="flex flex-wrap items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Confirm Booking</Button>
              </div>
            </form>
          </Card>
        </div>
      ) : null}
    </>
  );
}
