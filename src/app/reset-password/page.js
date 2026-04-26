"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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
    setSuccessMessage("");

    if (formData.newPassword !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${apiBaseUrl}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          otp: formData.otp,
          newPassword: formData.newPassword,
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.message || "Failed to reset password.");
      }

      setSuccessMessage(
        payload?.message ||
          "Password reset successfully. Please login with your new password"
      );
      setTimeout(() => router.push("/login"), 1200);
    } catch (error) {
      setErrorMessage(error.message || "Failed to reset password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0f] py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          
          {/* Left Side - Image */}
          <div className="hidden md:block">
            <div className="rounded-xl overflow-hidden h-96 relative bg-gradient-to-br from-[#206eaa]/30 to-[#1a5a8f]/20 border border-white/10 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">🔐</div>
                <h3 className="text-xl font-bold text-white mb-2">Password Security</h3>
                <p className="text-white/60 text-sm max-w-xs">Your account is protected with encrypted passwords</p>
              </div>
            </div>
            <div className="mt-6">
              <h2 className="text-2xl font-bold text-white mb-3">Secure Your Account</h2>
              <p className="text-white/60 text-sm leading-relaxed">
                Create a strong password to protect your EventWave account and keep your bookings safe.
              </p>
            </div>
          </div>

          {/* Right Side - Form */}
          <div>
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-black text-white mb-2">
                Reset Password
              </h1>
              <p className="text-white/60 text-sm">
                Choose a new password for your account.
              </p>
            </div>

            {/* Form Card */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-8">
              <form className="space-y-5" onSubmit={handleSubmit}>
                
                {/* Email Input */}
                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-2 uppercase tracking-wide">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-[#206eaa] focus:bg-white/15 focus:ring-1 focus:ring-[#206eaa]/40 transition-all outline-none text-sm"
                  />
                </div>

                {/* OTP Input */}
                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-2 uppercase tracking-wide">
                    OTP Code
                  </label>
                  <input
                    type="text"
                    name="otp"
                    placeholder="Enter OTP code"
                    value={formData.otp}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-[#206eaa] focus:bg-white/15 focus:ring-1 focus:ring-[#206eaa]/40 transition-all outline-none text-sm"
                  />
                </div>

                {/* New Password Input */}
                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-2 uppercase tracking-wide">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    placeholder="Enter new password"
                    value={formData.newPassword}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-[#206eaa] focus:bg-white/15 focus:ring-1 focus:ring-[#206eaa]/40 transition-all outline-none text-sm"
                  />
                </div>

                {/* Confirm Password Input */}
                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-2 uppercase tracking-wide">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm new password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-[#206eaa] focus:bg-white/15 focus:ring-1 focus:ring-[#206eaa]/40 transition-all outline-none text-sm"
                  />
                </div>

                {/* Error Message */}
                {errorMessage && (
                  <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-3">
                    <p className="text-red-400 text-xs">{errorMessage}</p>
                  </div>
                )}

                {/* Success Message */}
                {successMessage && (
                  <div className="rounded-lg bg-green-500/10 border border-green-500/30 p-3">
                    <p className="text-green-400 text-xs">{successMessage}</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-[#206eaa] to-[#1a5a8f] hover:from-[#1a5a8f] hover:to-[#0f3d5a] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold transition-all shadow-lg shadow-[#206eaa]/40"
                >
                  {isSubmitting ? "Resetting..." : "Reset Password"}
                </button>
              </form>

              {/* Back to Login Link */}
              <div className="text-center mt-6 pt-6 border-t border-white/10">
                <Link href="/login" className="text-xs text-white/60 hover:text-[#4a9fd8] transition-all">
                  Back to Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
