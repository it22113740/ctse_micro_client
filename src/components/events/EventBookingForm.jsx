"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import Button from "../ui/Button";
import Card from "../ui/Card";
import Input from "../ui/Input";

const formatPrice = (value) => {
  const amount = Number(value);
  if (!Number.isFinite(amount)) {
    return "LKR 0";
  }
  return `LKR ${amount.toLocaleString()}`;
};

export default function EventBookingForm({ event }) {
  const router = useRouter();
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const [formData, setFormData] = useState({
    customer_name: "",
    email: "",
    phone_number: "",
    seat_number: "",
    ticket_price: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const availableSeats = useMemo(() => {
    return Array.isArray(event?.seats)
      ? event.seats.filter((seat) => seat?.bookingStatus === "available")
      : [];
  }, [event?.seats]);

  const handleChange = (eventInput) => {
    const { name, value } = eventInput.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (eventInput) => {
    eventInput.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const token = window.localStorage.getItem("authToken");
    if (!token) {
      setErrorMessage("Please login first to continue booking.");
      return;
    }

    const payload = {
      customer_name: formData.customer_name,
      email: formData.email,
      phone_number: formData.phone_number,
      event_id: event._id,
      event_name: event.title,
    };

    if (event.isSeated) {
      if (!formData.seat_number) {
        setErrorMessage("Please select a seat.");
        return;
      }
      const selectedSeat = availableSeats.find(
        (seat) => seat.seatNumber === formData.seat_number,
      );
      const seatPrice = Number(selectedSeat?.price);
      if (!Number.isFinite(seatPrice) || seatPrice <= 0) {
        setErrorMessage("Could not read ticket price for the selected seat.");
        return;
      }
      payload.seat_number = formData.seat_number;
      payload.ticket_price = seatPrice;
    } else {
      const ticketPrice = Number(formData.ticket_price);
      if (!Number.isFinite(ticketPrice) || ticketPrice <= 0) {
        setErrorMessage("Please enter a valid ticket price.");
        return;
      }
      payload.ticket_price = ticketPrice;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${apiBaseUrl}/bookings`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responsePayload = await response.json();
      if (!response.ok) {
        throw new Error(responsePayload?.message || "Booking failed.");
      }

      setSuccessMessage("Booking created successfully.");
      router.push("/bookings");
    } catch (error) {
      setErrorMessage(error.message || "Booking failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="space-y-5">
      <div className="space-y-1">
        <div className="text-xs uppercase tracking-[0.3em] text-[var(--brand-2)]">
          Booking
        </div>
        <div className="text-2xl font-semibold">Book this event</div>
        <div className="text-sm text-[var(--muted)]">
          Fill attendee details and confirm your booking.
        </div>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            name="customer_name"
            placeholder="Customer Name"
            value={formData.customer_name}
            onChange={handleChange}
            required
          />
          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <Input
          type="tel"
          name="phone_number"
          placeholder="Phone Number"
          value={formData.phone_number}
          onChange={handleChange}
          required
        />

        {event.isSeated ? (
          <div className="space-y-2">
            <div className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
              Select Seat
            </div>
            <select
              name="seat_number"
              value={formData.seat_number}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/10 bg-[var(--surface)]/80 px-4 py-2 text-sm text-[var(--foreground)] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
              required
            >
              <option value="">Choose an available seat</option>
              {availableSeats.map((seat) => (
                <option key={seat.seatNumber} value={seat.seatNumber}>
                  {seat.seatNumber} - {seat.type} - {formatPrice(seat.price)}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <Input
            type="number"
            min="1"
            step="1"
            name="ticket_price"
            placeholder="Ticket Price"
            value={formData.ticket_price}
            onChange={handleChange}
            required
          />
        )}

        {errorMessage ? <p className="text-xs text-red-400">{errorMessage}</p> : null}
        {successMessage ? (
          <p className="text-xs text-green-400">{successMessage}</p>
        ) : null}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Booking..." : "Confirm Booking"}
        </Button>
      </form>
    </Card>
  );
}
