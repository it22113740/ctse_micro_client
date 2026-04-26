"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

import Button from "../ui/Button";
import { useAuth } from "../../context/AuthContext";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Events", href: "/events" },
  { label: "Blog", href: "/blog" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };

    if (userDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userDropdownOpen]);

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    router.push("/login");
  };

  // Helper to determine if a link is active
  const isLinkActive = (href) => {
    if (href === "/") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#206eaa]/20 bg-gradient-to-b from-white/95 to-white/90 backdrop-blur-sm shadow-md dark:from-[#0b0b12]/95 dark:to-[#0b0b12]/90 dark:border-[#206eaa]/30 transition-all duration-300 hover:shadow-lg hover:shadow-[#206eaa]/10">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        {/* Logo & Branding */}
        <Link href="/" className="flex items-center gap-3 flex-shrink-0 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#206eaa] to-[#1a5a8f] text-sm font-bold text-white shadow-lg shadow-[#206eaa]/30 group-hover:shadow-xl group-hover:shadow-[#206eaa]/50 group-hover:scale-110 transition-all duration-300">
            EW
          </div>
          <div className="hidden sm:block group-hover:translate-x-1 transition-transform duration-300">
            <div className="text-base font-bold text-[#171717] dark:text-[#f5f5f5]">
              EventWave
            </div>
            <div className="text-xs font-medium tracking-wider text-[#206eaa]">
              EVENTS
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map((link) => {
            const active = isLinkActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  text-sm font-semibold transition-all duration-300 relative group
                  ${active 
                    ? "text-[#206eaa] font-bold" 
                    : "text-[#6b7280] hover:text-[#4a90c2]"
                  }
                `}
                aria-current={active ? "page" : undefined}
              >
                {link.label}
                <span
                  className={`
                    absolute bottom-0 left-0 h-0.5 rounded-full
                    transition-all duration-300
                    ${active 
                      ? "w-full bg-gradient-to-r from-[#206eaa] via-[#1a5a8f] to-[#206eaa] shadow-lg shadow-[#206eaa]/50" 
                      : "w-0 group-hover:w-full bg-gradient-to-r from-[#4a90c2] to-[#206eaa]"
                    }
                  `}
                />
              </Link>
            );
          })}
        </nav>

        {/* Desktop Auth Section */}
        <div className="hidden md:flex items-center gap-4">
          {isLoading ? null : isAuthenticated ? (
            /* User Dropdown Menu */
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#206eaa]/20 to-[#1a5a8f]/10 border border-[#206eaa]/30 hover:border-[#206eaa]/60 hover:bg-gradient-to-r hover:from-[#206eaa]/30 hover:to-[#1a5a8f]/20 transition-all duration-300 group"
              >
                <span className="text-lg">👤</span>
                <span className="text-sm font-semibold text-[#206eaa]">Account</span>
                <svg
                  className={`w-4 h-4 text-[#206eaa] transition-transform duration-300 ${
                    userDropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 rounded-2xl border border-white/15 bg-gradient-to-br from-white/95 to-white/90 dark:from-[#0f1419] dark:to-[#050609] backdrop-blur-lg shadow-2xl shadow-[#206eaa]/20 dark:border-[#206eaa]/30 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  
                  {/* Dropdown Header */}
                  <div className="px-6 py-4 border-b border-[#206eaa]/10">
                    <p className="text-xs font-semibold text-[#206eaa] uppercase tracking-wider">
                      My Account
                    </p>
                  </div>

                  {/* Dropdown Items */}
                  <div className="py-2">
                    {/* My Bookings */}
                    <Link
                      href="/bookings"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-3 px-6 py-3 text-sm font-semibold text-[#1f2937] dark:text-white hover:bg-[#206eaa]/10 dark:hover:bg-[#206eaa]/20 transition-all duration-200"
                    >
                      <span className="text-lg">🎫</span>
                      <span>My Bookings</span>
                    </Link>

                    {/* My Reviews */}
                    <Link
                      href="/reviews"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-3 px-6 py-3 text-sm font-semibold text-[#1f2937] dark:text-white hover:bg-[#206eaa]/10 dark:hover:bg-[#206eaa]/20 transition-all duration-200"
                    >
                      <span className="text-lg">⭐</span>
                      <span>My Reviews</span>
                    </Link>

                    {/* My Profile */}
                    <Link
                      href="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-3 px-6 py-3 text-sm font-semibold text-[#1f2937] dark:text-white hover:bg-[#206eaa]/10 dark:hover:bg-[#206eaa]/20 transition-all duration-200"
                    >
                      <span className="text-lg">👤</span>
                      <span>My Profile</span>
                    </Link>

                    {/* Divider */}
                    <div className="my-2 border-t border-[#206eaa]/10"></div>

                    {/* Logout */}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-6 py-3 text-sm font-semibold text-red-600 hover:bg-red-500/10 dark:hover:bg-red-500/20 transition-all duration-200"
                    >
                      <span className="text-lg">🚪</span>
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Login & Signup Buttons */
            <>
              <Link href="/login">
                <Button variant="secondary" size="md">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="md">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 hover:bg-[#206eaa]/10 rounded-lg transition-all duration-300 hover:shadow-md active:scale-95"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
        >
          <svg
            className="w-6 h-6 text-[#206eaa]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#206eaa]/20 bg-white dark:bg-[#141421] px-6 py-4 space-y-3 shadow-lg animate-in fade-in slide-in-from-top-2 duration-300">
          {navLinks.map((link) => {
            const active = isLinkActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`
                  block py-3 px-4 text-sm font-semibold transition-all duration-300 rounded-lg
                  ${active 
                    ? "text-[#206eaa] bg-[#206eaa]/10 border-l-4 border-[#206eaa] font-bold" 
                    : "text-[#6b7280] hover:text-[#4a90c2] hover:bg-[#4a90c2]/5 hover:border-l-4 hover:border-[#4a90c2]"
                  }
                `}
                aria-current={active ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}

          {/* Mobile User Section */}
          <div className="border-t border-[#206eaa]/20 pt-4 space-y-2">
            {isLoading ? null : isAuthenticated ? (
              <>
                {/* My Bookings */}
                <Link href="/bookings" onClick={() => setMobileMenuOpen(false)}>
                  <div className="block w-full py-3 px-4 text-sm font-semibold text-[#206eaa] hover:bg-[#206eaa]/10 rounded-lg transition-all">
                    🎫 My Bookings
                  </div>
                </Link>

                {/* My Reviews */}
                <Link href="/reviews" onClick={() => setMobileMenuOpen(false)}>
                  <div className="block w-full py-3 px-4 text-sm font-semibold text-[#206eaa] hover:bg-[#206eaa]/10 rounded-lg transition-all">
                    ⭐ My Reviews
                  </div>
                </Link>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/30 hover:border-red-500/60 text-red-600 dark:text-red-400 font-semibold text-sm transition-all duration-300"
                >
                  🚪 Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="secondary" size="md" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button size="md" className="w-full">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}