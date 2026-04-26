export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#206eaa] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] disabled:cursor-not-allowed disabled:opacity-60 hover:-translate-y-0.5";

  const variants = {
    primary: "bg-gradient-to-br from-[#206eaa] to-[#1a5a8f] text-white hover:from-[#1a5a8f] hover:to-[#0f3d5c] hover:shadow-xl hover:shadow-[#206eaa]/30 active:scale-95 active:translate-y-1 relative overflow-hidden before:absolute before:inset-0 before:bg-white before:opacity-0 hover:before:opacity-10 before:transition-opacity before:duration-300",
    secondary:
      "border-2 border-[#206eaa] bg-transparent text-[#206eaa] hover:bg-[#206eaa]/10 hover:shadow-lg hover:shadow-[#206eaa]/20 hover:border-[#1a5a8f] active:scale-95 active:translate-y-1",
    ghost: "text-[var(--foreground)] hover:bg-[#206eaa]/10 active:bg-[#206eaa]/20 hover:shadow-md hover:shadow-[#206eaa]/10",
  };

  const sizes = {
    sm: "px-3.5 py-2 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const variantClass = variants[variant] || variants.primary;
  const sizeClass = sizes[size] || sizes.md;

  return (
    <button
      className={`${base} ${variantClass} ${sizeClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
