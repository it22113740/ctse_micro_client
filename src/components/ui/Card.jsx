export default function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-3xl border border-white/10 bg-[var(--surface)]/70 p-5 shadow-[0_20px_50px_-30px_rgba(127,0,255,0.45)] ${className}`}
    >
      {children}
    </div>
  );
}
