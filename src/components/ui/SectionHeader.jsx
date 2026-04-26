export default function SectionHeader({
  title,
  subtitle,
  eyebrow,
  align = "left",
}) {
  const alignClass = align === "center" ? "text-center" : "text-left";

  return (
    <div className={`space-y-2 ${alignClass}`}>
      {eyebrow ? (
        <div className="text-xs uppercase tracking-[0.3em] text-[var(--brand-2)]">
          {eyebrow}
        </div>
      ) : null}
      <h2 className="text-3xl font-bold text-white sm:text-4xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="text-sm text-[var(--muted)] sm:text-base">{subtitle}</p>
      ) : null}
    </div>
  );
}
