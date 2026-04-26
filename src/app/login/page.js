"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Card from "../../components/ui/Card";
import PageShell from "../../components/layout/PageShell";
import SectionHeader from "../../components/ui/SectionHeader";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const router = useRouter();
  const { saveToken } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const response = await fetch(`${apiBaseUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        throw new Error("Invalid email or password.");
      }

      const payload = await response.json();
      const token =
        payload?.accessToken || payload?.token || payload?.data?.accessToken;

      if (!token) {
        throw new Error("Login succeeded but token was not returned.");
      }

      saveToken(token);
      router.push("/");
    } catch (error) {
      setErrorMessage(error.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0f] via-[#0f1419] to-[#050609] p-4 relative overflow-hidden">
      {/* Premium Background Glows */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#206eaa]/15 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-[#1a5a8f]/10 rounded-full blur-3xl pointer-events-none" style={{ animationDelay: '1s' }}></div>

      <PageShell>
        <div className="flex flex-col lg:flex-row gap-12 items-center justify-center w-full max-w-6xl relative z-10">
          
          {/* Left - Minimalist Visual */}
          <div className="hidden lg:flex flex-col items-center justify-center w-1/3 space-y-8">
            <style>{`
              @keyframes float-smooth {
                0%, 100% { transform: translateY(0px) scale(1); }
                50% { transform: translateY(-15px) scale(1.02); }
              }
              @keyframes glow-pulse {
                0%, 100% { box-shadow: 0 0 30px rgba(32, 110, 170, 0.4), inset 0 0 30px rgba(32, 110, 170, 0.1); }
                50% { box-shadow: 0 0 60px rgba(32, 110, 170, 0.6), inset 0 0 30px rgba(32, 110, 170, 0.2); }
              }
              @keyframes rotate-slow {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
              .float-smooth { animation: float-smooth 4s ease-in-out infinite; }
              .glow-pulse { animation: glow-pulse 3s ease-in-out infinite; }
              .rotate-slow { animation: rotate-slow 20s linear infinite; }
            `}</style>

            {/* Main Visual Container */}
            <div className="relative w-56 h-56">
              {/* Rotating Ring Background */}
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#206eaa]/50 border-r-[#206eaa]/30 rotate-slow"></div>
              
              {/* Center Badge with Glow */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="glow-pulse w-40 h-40 bg-gradient-to-br from-[#206eaa]/40 to-[#0f3d5a]/30 rounded-full border-2 border-[#4a9fd8]/60 flex items-center justify-center">
                  <div className="text-5xl">🎭</div>
                </div>
              </div>

              {/* Floating Ticket */}
              <div className="absolute -top-8 -left-8 float-smooth">
                <div className="w-24 h-32 bg-gradient-to-br from-[#4a9fd8]/50 to-[#206eaa]/40 rounded-lg border border-[#206eaa]/50 p-3 flex items-center justify-center shadow-lg shadow-[#206eaa]/30 transform -rotate-12">
                  <div className="text-4xl">🎫</div>
                </div>
              </div>

              {/* Floating Calendar */}
              <div className="absolute -bottom-6 -right-6 float-smooth" style={{ animationDelay: '0.8s' }}>
                <div className="w-24 h-24 bg-gradient-to-br from-[#1a5a8f]/50 to-[#0f3d5a]/40 rounded-lg border border-[#206eaa]/40 p-3 flex items-center justify-center shadow-lg shadow-[#1a5a8f]/30 transform rotate-12">
                  <div className="text-4xl">📅</div>
                </div>
              </div>
            </div>

            {/* Stats - Minimal Style */}
            <div className="flex gap-4 text-center w-full max-w-sm">
              <div className="flex-1 rounded-xl bg-gradient-to-br from-white/8 to-white/3 border border-white/15 backdrop-blur-sm p-3 hover:border-[#4a9fd8]/40 hover:from-white/12 transition-all duration-300">
                <p className="text-sm font-bold text-[#4a9fd8]">50K+</p>
                <p className="text-xs text-white/50 mt-1">Events</p>
              </div>
              <div className="flex-1 rounded-xl bg-gradient-to-br from-white/8 to-white/3 border border-white/15 backdrop-blur-sm p-3 hover:border-[#4a9fd8]/40 hover:from-white/12 transition-all duration-300">
                <p className="text-sm font-bold text-[#4a9fd8]">1M+</p>
                <p className="text-xs text-white/50 mt-1">Users</p>
              </div>
              <div className="flex-1 rounded-xl bg-gradient-to-br from-white/8 to-white/3 border border-white/15 backdrop-blur-sm p-3 hover:border-[#4a9fd8]/40 hover:from-white/12 transition-all duration-300">
                <p className="text-sm font-bold text-[#4a9fd8]">4.8★</p>
                <p className="text-xs text-white/50 mt-1">Rating</p>
              </div>
            </div>
          </div>

          {/* Right - Compact Premium Form */}
          <div className="w-full lg:w-auto">
            <div className="rounded-2xl border border-white/25 bg-gradient-to-br from-white/12 via-white/6 to-white/[0.01] backdrop-blur-2xl p-7 space-y-6 shadow-2xl shadow-[#206eaa]/25 max-w-sm hover:border-white/35 hover:shadow-2xl hover:shadow-[#206eaa]/35 transition-all duration-500">
              
              {/* Minimalist Header */}
              <div className="space-y-1 text-center">
                <h1 className="text-3xl font-black bg-gradient-to-r from-white via-[#4a9fd8] to-white/70 bg-clip-text text-transparent drop-shadow-lg">
                  Welcome
                </h1>
                <p className="text-xs text-white/60 font-medium tracking-wide">Sign in to your account</p>
              </div>

              {/* Sleek Form */}
              <form className="space-y-4" onSubmit={handleSubmit}>
                {/* Email Input - Minimal */}
                <div className="relative group">
                  <span className="absolute left-3.5 top-3 text-lg opacity-60 group-focus-within:opacity-100 transition-opacity">📧</span>
                  <Input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-white/20 bg-white/7 pl-11 pr-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-[#4a9fd8] focus:bg-white/12 focus:outline-none focus:ring-1 focus:ring-[#206eaa]/50 transition-all duration-300 group-hover:border-white/30"
                  />
                </div>

                {/* Password Input - Minimal */}
                <div className="relative group">
                  <span className="absolute left-3.5 top-3 text-lg opacity-60 group-focus-within:opacity-100 transition-opacity">🔐</span>
                  <Input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-white/20 bg-white/7 pl-11 pr-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-[#4a9fd8] focus:bg-white/12 focus:outline-none focus:ring-1 focus:ring-[#206eaa]/50 transition-all duration-300 group-hover:border-white/30"
                  />
                </div>

                {/* Forgot Password */}
                <div className="text-right pt-1">
                  <Link href="/forgot-password" className="text-xs font-medium text-[#4a9fd8] hover:text-[#206eaa] transition-colors duration-200">
                    Forgot password?
                  </Link>
                </div>

                {/* Error Message */}
                {errorMessage && (
                  <div className="rounded-lg bg-red-500/25 border border-red-400/50 px-4 py-2.5 animate-pulse">
                    <p className="text-xs text-red-300 font-medium flex items-center gap-2">
                      <span>⚠️</span> {errorMessage}
                    </p>
                  </div>
                )}

                {/* Submit Button - Premium */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-lg bg-gradient-to-r from-[#206eaa] via-[#2a7bc4] to-[#1f5a9e] hover:from-[#1a5a8f] hover:via-[#206eaa] hover:to-[#0f3d5a] disabled:from-[#206eaa]/40 disabled:via-[#2a7bc4]/40 disabled:to-[#1f5a9e]/40 disabled:cursor-not-allowed text-white font-bold py-3 transition-all duration-300 shadow-lg shadow-[#206eaa]/50 hover:shadow-2xl hover:shadow-[#206eaa]/70 border border-[#4a9fd8]/30 hover:border-[#4a9fd8]/60 text-sm uppercase tracking-widest relative group/btn overflow-hidden mt-2"
                >
                  <span className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative flex items-center justify-center gap-2">
                    {isLoading ? (
                      <>
                        <span className="animate-spin">⚙️</span>
                        <span>Signing In</span>
                      </>
                    ) : (
                      <>
                        <span>🚀</span>
                        <span>Sign In</span>
                      </>
                    )}
                  </span>
                </button>
              </form>

              {/* Minimal Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                <span className="text-xs text-white/40 font-medium">OR</span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              </div>

              {/* Sign Up - Minimal */}
              <Link href="/signup" className="block group/signup">
                <button className="w-full rounded-lg border-2 border-[#206eaa]/50 bg-gradient-to-r from-[#206eaa]/15 to-[#1a5a8f]/10 hover:from-[#206eaa]/30 hover:to-[#1a5a8f]/20 text-[#4a9fd8] hover:text-white font-bold py-2.5 transition-all duration-300 text-sm uppercase tracking-widest group-hover/signup:border-[#4a9fd8]/60 group-hover/signup:shadow-lg group-hover/signup:shadow-[#206eaa]/30">
                  ✨ Create Account
                </button>
              </Link>
            </div>

            {/* Footer Text */}
            <p className="text-center text-xs text-white/40 mt-4 font-light">
              By signing in, you agree to our <span className="text-white/60 cursor-pointer hover:text-white transition-colors">Terms</span> & <span className="text-white/60 cursor-pointer hover:text-white transition-colors">Privacy</span>
            </p>
          </div>

        </div>
      </PageShell>
    </div>
  );
}
