"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Card from "../../components/ui/Card";
import PageShell from "../../components/layout/PageShell";
import SectionHeader from "../../components/ui/SectionHeader";

export default function SignupPage() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    imageUrl: "",
    password: "",
    confirmPassword: "",
  });
  const [imagePreview, setImagePreview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (event) => {
    const { name, value, type, files } = event.target;
    
    if (type === "file" && files) {
      const file = files[0];
      if (file) {
        // Compress image before encoding
        const reader = new FileReader();
        reader.onloadend = () => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement("canvas");
            let width = img.width;
            let height = img.height;
            
            // Reduce size if too large
            if (width > 800) {
              height = (height * 800) / width;
              width = 800;
            }
            
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);
            
            // Compress with quality 0.7
            const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
            setImagePreview(compressedBase64);
            setFormData((prev) => ({
              ...prev,
              imageUrl: compressedBase64,
            }));
          };
          img.src = reader.result;
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${apiBaseUrl}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          address: formData.address,
          imageUrl: formData.imageUrl,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        throw new Error("Registration failed. Please check details and try again.");
      }

      router.push("/login");
    } catch (error) {
      setErrorMessage(error.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#0f1419] to-[#050609] relative overflow-hidden">
      {/* Animated Background Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#206eaa]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#1a5a8f]/15 rounded-full blur-3xl" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#4a9fd8]/10 rounded-full blur-3xl" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-5xl grid gap-8 lg:gap-0 lg:grid-cols-2 items-center">
          
          {/* Left Side - Visual */}
          <div className="hidden lg:flex flex-col items-center justify-center space-y-8 px-8">
            <div className="relative">
              <div className="absolute -inset-20 bg-gradient-to-r from-[#206eaa]/20 to-[#1a5a8f]/10 rounded-full blur-3xl"></div>
              <div className="relative text-7xl animate-bounce" style={{ animationDuration: '3s' }}>🎫</div>
            </div>
            <div className="text-center space-y-3 max-w-sm">
              <h2 className="text-3xl font-black bg-gradient-to-r from-white via-[#4a9fd8] to-white/60 bg-clip-text text-transparent">
                Join the Event Community
              </h2>
              <p className="text-sm text-white/70">Create your account and start discovering amazing events near you.</p>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center w-full">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="text-2xl mb-2">📅</div>
                <p className="text-xs text-white/60">Events</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="text-2xl mb-2">🎭</div>
                <p className="text-xs text-white/60">Categories</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="text-2xl mb-2">🌟</div>
                <p className="text-xs text-white/60">Premium</p>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="space-y-6">
            <div className="space-y-3">
              <h1 className="text-4xl font-black text-white">Create Account</h1>
              <p className="text-sm text-white/70">Sign up to get started</p>
            </div>

            <div className="rounded-2xl border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-white/[0.02] backdrop-blur-xl p-6 space-y-4 shadow-lg shadow-[#206eaa]/20">
              
              <form className="space-y-4" onSubmit={handleSubmit}>
                
                {/* Name Fields */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-bold text-white/70 block mb-1.5">First Name</label>
                    <Input
                      name="firstName"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-white/15 bg-white/6 px-3 py-2.5 text-xs text-white placeholder:text-white/30 focus:border-[#4a9fd8] focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-[#206eaa]/40 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-white/70 block mb-1.5">Last Name</label>
                    <Input
                      name="lastName"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-white/15 bg-white/6 px-3 py-2.5 text-xs text-white placeholder:text-white/30 focus:border-[#4a9fd8] focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-[#206eaa]/40 transition-all"
                    />
                  </div>
                </div>

                {/* Email & Phone */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-bold text-white/70 block mb-1.5">📧 Email</label>
                    <Input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-white/15 bg-white/6 px-3 py-2.5 text-xs text-white placeholder:text-white/30 focus:border-[#4a9fd8] focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-[#206eaa]/40 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-white/70 block mb-1.5">📱 Phone</label>
                    <Input
                      type="tel"
                      name="phone"
                      placeholder="Phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-white/15 bg-white/6 px-3 py-2.5 text-xs text-white placeholder:text-white/30 focus:border-[#4a9fd8] focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-[#206eaa]/40 transition-all"
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="text-xs font-bold text-white/70 block mb-1.5">📍 Address</label>
                  <Input
                    name="address"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-white/15 bg-white/6 px-3 py-2.5 text-xs text-white placeholder:text-white/30 focus:border-[#4a9fd8] focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-[#206eaa]/40 transition-all"
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="text-xs font-bold text-white/70 block mb-1.5">🖼️ Profile Picture</label>
                  <div className="relative">
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-white/15 bg-white/6 px-3 py-2.5 text-xs text-white placeholder:text-white/30 focus:border-[#4a9fd8] focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-[#206eaa]/40 transition-all cursor-pointer file:cursor-pointer file:border-0 file:bg-[#206eaa]/30 file:text-white file:text-xs file:font-bold file:mr-2 file:px-2 file:py-1 file:rounded"
                    />
                  </div>
                  {imagePreview && (
                    <div className="mt-2 flex items-center gap-3 p-2 rounded-lg bg-white/5 border border-white/10">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="h-12 w-12 rounded-lg object-cover border border-[#206eaa]/40"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-white font-bold truncate">Image selected</p>
                        <p className="text-xs text-white/50">Ready to upload</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Password Fields */}
                <div className="grid gap-3 sm:grid-cols-2 pt-2 border-t border-white/10">
                  <div>
                    <label className="text-xs font-bold text-white/70 block mb-1.5">🔐 Password</label>
                    <Input
                      type="password"
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-white/15 bg-white/6 px-3 py-2.5 text-xs text-white placeholder:text-white/30 focus:border-[#4a9fd8] focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-[#206eaa]/40 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-white/70 block mb-1.5">✓ Confirm</label>
                    <Input
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-white/15 bg-white/6 px-3 py-2.5 text-xs text-white placeholder:text-white/30 focus:border-[#4a9fd8] focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-[#206eaa]/40 transition-all"
                    />
                  </div>
                </div>

                {/* Error Message */}
                {errorMessage && (
                  <div className="rounded-lg bg-red-500/20 border border-red-400/40 px-3 py-2.5">
                    <p className="text-xs text-red-300">⚠️ {errorMessage}</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-lg bg-gradient-to-r from-[#206eaa] via-[#2a7bc4] to-[#1f5a9e] hover:from-[#1a5a8f] hover:via-[#206eaa] hover:to-[#0f3d5a] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 transition-all duration-300 shadow-lg shadow-[#206eaa]/40 hover:shadow-xl hover:shadow-[#206eaa]/60 text-xs uppercase tracking-wider border border-[#4a9fd8]/30 hover:border-[#4a9fd8]/60 hover:-translate-y-0.5 active:translate-y-0"
                >
                  {isLoading ? "⚙️ Creating..." : "🚀 Create Account"}
                </button>
              </form>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-gradient-to-br from-white/10 via-white/5 to-white/[0.02] px-2 text-white/50">OR</span>
                </div>
              </div>

              {/* Sign In Link */}
              <Link href="/login" className="block">
                <button
                  type="button"
                  className="w-full rounded-lg border-2 border-[#206eaa]/50 bg-gradient-to-r from-[#206eaa]/15 to-[#1a5a8f]/10 hover:from-[#206eaa]/30 hover:to-[#1a5a8f]/20 text-[#4a9fd8] hover:text-white font-bold py-2.5 transition-all duration-300 text-xs uppercase tracking-wider hover:border-[#4a9fd8]/60"
                >
                  Sign In Instead
                </button>
              </Link>
            </div>

            {/* Footer Text */}
            <p className="text-xs text-white/50 text-center">
              By signing up, you agree to our terms and privacy policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
