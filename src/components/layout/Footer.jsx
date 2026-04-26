import Link from "next/link";
import { useState } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";

const footerLinks = [
  {
    title: "Explore",
    links: [
      { label: "Home", href: "/" },
      { label: "Events", href: "/events" },
      { label: "Blog", href: "/blogs" },
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", href: "/help" },
      { label: "FAQs", href: "/faqs" },
      { label: "Refund Policy", href: "/refund" },
    ],
  },
];

const socials = [
  { label: "Instagram", href: "#", icon: "📷" },
  { label: "TikTok", href: "#", icon: "🎵" },
  { label: "YouTube", href: "#", icon: "📺" },
  { label: "Twitter", href: "#", icon: "🐦" },
  { label: "Facebook", href: "#", icon: "📘" },
];

export default function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState(null);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Simulate API call
    setNewsletterStatus("sending");
    setTimeout(() => {
      setNewsletterStatus("success");
      setNewsletterEmail("");
      setTimeout(() => setNewsletterStatus(null), 3000);
    }, 1000);
  };

  return (
    <footer className="relative border-t border-white/10 bg-gradient-to-b from-[#0a0a0f] to-[#050508] overflow-hidden">
      {/* Decorative glow */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#206eaa] rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-600 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-12 lg:py-16">
        {/* Main footer grid */}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#206eaa] to-[#1a5a8f] text-xs font-bold text-white shadow-md">
                EW
              </div>
              <span className="text-lg font-bold text-white">EventWave</span>
            </Link>
            <p className="text-sm text-white/60 leading-relaxed">
              Discover unforgettable festivals, live shows, and immersive experiences
              with tickets that move as fast as the beat.
            </p>
            <div className="flex gap-3 pt-2">
              {socials.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/70 transition-all hover:bg-[#206eaa] hover:border-[#206eaa] hover:text-white hover:scale-110"
                  aria-label={social.label}
                >
                  <span className="text-base">{social.icon}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {footerLinks.map((section) => (
            <div key={section.title} className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#206eaa]">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 transition-colors hover:text-[#206eaa] hover:translate-x-0.5 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter column */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#206eaa]">
              Stay in the loop
            </h3>
            <p className="text-sm text-white/60">
              Get early bird access, exclusive deals, and event drops.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  type="email"
                  placeholder="Your email address"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#206eaa]"
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={newsletterStatus === "sending"}
                  className="whitespace-nowrap bg-[#206eaa] hover:bg-[#1a5a8f] text-white"
                >
                  {newsletterStatus === "sending" ? "Sending..." : "Subscribe"}
                </Button>
              </div>
              {newsletterStatus === "success" && (
                <p className="text-xs text-green-400">Thanks for subscribing! 🎉</p>
              )}
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-white/40">
          <div>© 2026 EventWave. All rights reserved.</div>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white/80 transition">Privacy</Link>
            <Link href="/terms" className="hover:text-white/80 transition">Terms</Link>
            <Link href="/cookies" className="hover:text-white/80 transition">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}