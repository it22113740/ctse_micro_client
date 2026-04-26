"use client";

import { useState } from "react";

import Button from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";
import SectionHeader from "../../../components/ui/SectionHeader";
import PageShell from "../../../components/layout/PageShell";
import eventsData from "../../../data/events";

const emptyEvent = {
  id: "",
  title: "",
  description: "",
  startDate: "",
  endDate: "",
  location: "",
  status: "active",
  ticketPrice: "",
  tags: "",
  isSeated: false,
};

const cardClassName =
  "border-black/10 bg-white/85 shadow-[0_22px_45px_-30px_rgba(15,23,42,0.35)]";
const fieldClassName =
  "border-black/15 bg-white text-slate-900 placeholder:text-slate-500 shadow-sm";
const selectClassName =
  "w-full rounded-2xl border border-black/15 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--ring)]";

export default function AdminEventsPage() {
  const [events, setEvents] = useState(eventsData.events);
  const [form, setForm] = useState(emptyEvent);
  const [editingId, setEditingId] = useState(null);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const tags = form.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    const payload = {
      id: form.id.trim(),
      title: form.title.trim(),
      description: form.description.trim(),
      startDate: form.startDate.trim(),
      endDate: form.endDate.trim(),
      location: form.location.trim(),
      status: form.status,
      ticketPrice: form.ticketPrice.trim(),
      tags,
      isSeated: form.isSeated,
    };

    if (editingId) {
      setEvents((current) =>
        current.map((item) =>
          item.id === editingId
            ? {
                ...item,
                ...payload,
              }
            : item
        )
      );
    } else {
      setEvents((current) => [
        {
          ...payload,
          galleryImages: [],
          seats: [],
        },
        ...current,
      ]);
    }

    setForm(emptyEvent);
    setEditingId(null);
  };

  const startEdit = (eventItem) => {
    setEditingId(eventItem.id);
    setForm({
      id: eventItem.id,
      title: eventItem.title,
      description: eventItem.description,
      startDate: eventItem.startDate,
      endDate: eventItem.endDate,
      location: eventItem.location,
      status: eventItem.status,
      ticketPrice: eventItem.ticketPrice,
      tags: eventItem.tags.join(", "),
      isSeated: eventItem.isSeated,
    });
  };

  const removeEvent = (eventId) => {
    setEvents((current) => current.filter((item) => item.id !== eventId));
    if (editingId === eventId) {
      setEditingId(null);
      setForm(emptyEvent);
    }
  };

  const toggleStatus = (eventId) => {
    setEvents((current) =>
      current.map((item) =>
        item.id === eventId
          ? {
              ...item,
              status: item.status === "active" ? "inactive" : "active",
            }
          : item
      )
    );
  };

  const resetForm = () => {
    setForm(emptyEvent);
    setEditingId(null);
  };

  return (
    <PageShell className="space-y-10">
      <SectionHeader
        eyebrow="Admin"
        title="Event management"
        subtitle="Create, edit, and control event listings."
      />

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          {events.length === 0 ? (
            <Card className={`text-sm text-[var(--muted)] ${cardClassName}`}>
              No events yet. Create a new event to get started.
            </Card>
          ) : null}

          {events.map((item) => (
            <Card key={item.id} className={`space-y-4 ${cardClassName}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-lg font-semibold text-slate-900">
                    {item.title}
                  </div>
                  <div className="text-xs text-slate-500">ID: {item.id}</div>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    item.status === "active"
                      ? "bg-green-500/15 text-green-600"
                      : "bg-slate-500/15 text-slate-500"
                  }`}
                >
                  {item.status}
                </span>
              </div>

              <p className="text-sm text-slate-600">{item.description}</p>

              <div className="flex flex-wrap gap-3 text-sm text-slate-500">
                <span>
                  {item.startDate} · {item.endDate}
                </span>
                <span>· {item.location}</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs text-slate-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-3">
                  <span className="text-slate-900">{item.ticketPrice}</span>
                  <span>{item.isSeated ? "Seated" : "General"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => startEdit(item)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => toggleStatus(item.id)}
                  >
                    {item.status === "active" ? "Deactivate" : "Activate"}
                  </Button>
                  <Button size="sm" onClick={() => removeEvent(item.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="space-y-6">
          <Card className={`space-y-4 ${cardClassName}`}>
            <div className="text-xs uppercase tracking-[0.3em] text-[var(--brand-2)]">
              {editingId ? "Edit event" : "New event"}
            </div>
            <form className="space-y-3" onSubmit={handleSubmit}>
              <Input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Event name"
                className={fieldClassName}
                required
              />
              <Input
                name="id"
                value={form.id}
                onChange={handleChange}
                placeholder="Event ID (slug)"
                className={fieldClassName}
                required
              />
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="min-h-[120px] w-full rounded-2xl border border-black/15 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm placeholder:text-slate-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                placeholder="Event description"
                required
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  placeholder="Start date"
                  className={fieldClassName}
                  required
                />
                <Input
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                  placeholder="End date"
                  className={fieldClassName}
                  required
                />
              </div>
              <Input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Location"
                className={fieldClassName}
                required
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  name="ticketPrice"
                  value={form.ticketPrice}
                  onChange={handleChange}
                  placeholder="Ticket price"
                  className={fieldClassName}
                  required
                />
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className={selectClassName}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <Input
                name="tags"
                value={form.tags}
                onChange={handleChange}
                placeholder="Tags (comma separated)"
                className={fieldClassName}
              />
              <label className="flex items-center gap-3 text-sm text-slate-600">
                <input
                  type="checkbox"
                  name="isSeated"
                  checked={form.isSeated}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border border-black/20"
                />
                Seated event
              </label>
              <div className="flex flex-wrap items-center gap-2">
                <Button type="button" variant="secondary" onClick={resetForm}>
                  Reset
                </Button>
                <Button type="submit">
                  {editingId ? "Update Event" : "Create Event"}
                </Button>
              </div>
            </form>
          </Card>

          <Card className={`space-y-3 ${cardClassName}`}>
            <div className="text-xs uppercase tracking-[0.3em] text-[var(--brand-2)]">
              Event stats
            </div>
            <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
              <div>
                <div className="text-xs uppercase tracking-[0.2em]">Total</div>
                <div className="text-base text-slate-900">{events.length}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.2em]">Active</div>
                <div className="text-base text-slate-900">
                  {events.filter((item) => item.status === "active").length}
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.2em]">Inactive</div>
                <div className="text-base text-slate-900">
                  {events.filter((item) => item.status === "inactive").length}
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.2em]">Seated</div>
                <div className="text-base text-slate-900">
                  {events.filter((item) => item.isSeated).length}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </PageShell>
  );
}
