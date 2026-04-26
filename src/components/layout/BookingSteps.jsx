import Link from "next/link";

export const BOOKING_STEPS = [
  { label: "Select Tickets", href: "/ticket-selection", icon: "🎟️" },
  { label: "Seat Selection", href: "/seat-selection", icon: "🪑" },
  { label: "Details", href: "/details", icon: "📝" },
  { label: "Confirm", href: "/payment", icon: "✓" },
  { label: "Confirmation", href: "/confirmation", icon: "💙" },
];

const pillBase =
  "flex w-full flex-col items-center gap-2 rounded-2xl border px-4 py-3 text-center text-xs font-semibold tracking-wide transition duration-200 will-change-transform";

export default function BookingSteps({ currentStep, className = "" }) {
  const currentIndex = Math.max(
    BOOKING_STEPS.findIndex((step) => step.href === currentStep),
    0,
  );

  return (
    <nav
      aria-label="Booking steps"
      className={`relative w-full overflow-hidden rounded-3xl border border-white/30 bg-white/80 p-5 shadow-[0_25px_60px_-30px_rgba(15,23,42,0.55)] backdrop-blur ${className}`.trim()}
    >
      <div className="pointer-events-none absolute -top-10 left-[-5%] h-36 w-36 rounded-full bg-gradient-to-br from-sky-200/80 to-indigo-200/70 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-14 right-[-5%] h-32 w-32 rounded-full bg-gradient-to-br from-violet-200/70 to-fuchsia-200/60 blur-3xl" />
      <ol className="relative flex flex-wrap items-stretch gap-4">
        {BOOKING_STEPS.map((step, index) => {
          const isCurrent = step.href === currentStep;
          const isComplete = index < currentIndex;
          const pillColors = isCurrent
            ? "border-blue-500/70 bg-gradient-to-b from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-200"
            : isComplete
            ? "border-blue-200 bg-blue-50 text-blue-700 shadow-sm"
            : "border-gray-200 bg-white text-gray-500 hover:text-gray-700";

          return (
            <li key={step.href} className="flex min-w-[160px] flex-1 items-center gap-4">
              <Link
                href={step.href}
                aria-current={isCurrent ? "step" : undefined}
                className={`${pillBase} ${pillColors} ${isCurrent ? "scale-[1.03]" : "scale-100 hover:-translate-y-[1px]"}`}
              >
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-full text-base ${
                    isCurrent
                      ? "bg-white/20 text-white"
                      : isComplete
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {step.icon}
                </span>
                {step.label}
              </Link>
              {index < BOOKING_STEPS.length - 1 ? (
                <span
                  className={`hidden h-1 flex-1 rounded-full md:block ${
                    index < currentIndex
                      ? "bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-300"
                      : "bg-gray-200"
                  }`}
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
