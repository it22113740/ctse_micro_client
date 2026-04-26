"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`${apiBaseUrl}/auth/forget-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.message || "Failed to send reset instructions.");
      }

      setSuccessMessage(
        payload?.message ||
          "If an account with this email exists, you will receive an email with instructions to reset your password."
      );
      setTimeout(() => {
        router.push("/reset-password");
      }, 700);
    } catch (error) {
      setErrorMessage(error.message || "Failed to send reset instructions.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#0f1419] to-[#050609] relative overflow-hidden py-12 px-4 flex items-center justify-center">
      
      {/* Subtle Background Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#206eaa]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        
        {/* Main Card */}
        <div className="rounded-2xl border border-white/15 bg-gradient-to-br from-white/8 via-white/3 to-white/[0.01] backdrop-blur-lg p-8 shadow-2xl shadow-[#206eaa]/20">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
            <p className="text-white/50 text-sm">Enter your email to receive reset instructions</p>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            
            {/* Email Input */}
            <div>
              <label className="block text-xs font-semibold text-white/70 mb-2 uppercase tracking-wide">Email</label>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-[#206eaa] focus:bg-white/15 focus:ring-1 focus:ring-[#206eaa]/40 transition-all outline-none text-sm"
              />
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                {errorMessage}
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-xs">
                {successMessage}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#206eaa] to-[#1a5a8f] hover:from-[#1a5a8f] hover:to-[#0f3d5a] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all shadow-lg shadow-[#206eaa]/40"
            >
              {isSubmitting ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          {/* Divider */}
          <div className="border-t border-white/10 my-6" />

          {/* Footer Link */}
          <div className="text-center">
            <p className="text-white/60 text-xs mb-2">Remembered your password?</p>
            <Link
              href="/login"
              className="text-[#4a9fd8] hover:text-[#6ba5d4] font-semibold text-sm transition-colors"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
