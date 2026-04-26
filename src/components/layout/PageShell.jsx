export default function PageShell({ children, className = "" }) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-4 py-10 ${className}`}>
      {children}
    </div>
  );
}
