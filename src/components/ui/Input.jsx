export default function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full rounded-2xl border border-white/10 bg-[var(--surface)]/80 px-4 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--ring)] ${className}`}
      {...props}
    />
  );
}
