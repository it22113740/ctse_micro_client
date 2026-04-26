"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import SectionHeader from "../../components/ui/SectionHeader";
import PageShell from "../../components/layout/PageShell";
import { useAuth } from "../../context/AuthContext";

export default function ProfilePage() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const { user, isLoading, token } = useAuth();
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    imageUrl: "",
  });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  useEffect(() => {
    setProfileForm({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phone: user?.phone || "",
      address: user?.address || "",
      imageUrl: user?.imageUrl || "",
    });
  }, [user]);

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setProfileForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    setProfileError("");
    setProfileSuccess("");

    if (!token) {
      setProfileError("You must be logged in to update profile.");
      return;
    }

    setIsUpdatingProfile(true);

    try {
      const response = await fetch(`${apiBaseUrl}/users/me`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: profileForm.firstName,
          lastName: profileForm.lastName,
          phone: profileForm.phone,
          address: profileForm.address,
          imageUrl: profileForm.imageUrl,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload?.message || "Failed to update profile.");
      }

      setProfileSuccess(payload?.message || "Profile updated successfully.");
    } catch (error) {
      setProfileError(error.message || "Failed to update profile.");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswordForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    if (!token) {
      setPasswordError("You must be logged in to change the password.");
      return;
    }

    setIsChangingPassword(true);

    try {
      const response = await fetch(`${apiBaseUrl}/auth/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword: passwordForm.oldPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.message || "Failed to change password.");
      }

      setPasswordSuccess(payload?.message || "Password changed successfully");
      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      setPasswordError(error.message || "Failed to change password.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#0f1419] to-[#050609] p-4">
      {/* Background Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#206eaa]/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-[#1a5a8f]/10 rounded-full blur-3xl" style={{ animationDelay: '1s' }}></div>
      </div>

      <PageShell className="relative z-10 space-y-8 py-8">
        
        {/* Header */}
        <div className="space-y-3 mb-8">
          <h1 className="text-4xl font-black bg-gradient-to-r from-white via-[#4a9fd8] to-white/60 bg-clip-text text-transparent drop-shadow-lg">
            Account Settings
          </h1>
          <p className="text-sm text-white/60 font-medium">Manage your profile and security</p>
        </div>

        {/* Main Grid */}
        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          
          {/* Profile Card */}
          <div className="rounded-2xl border border-white/25 bg-gradient-to-br from-white/12 via-white/6 to-white/[0.01] backdrop-blur-2xl p-8 space-y-6 shadow-2xl shadow-[#206eaa]/25 hover:border-white/35 hover:shadow-2xl hover:shadow-[#206eaa]/35 transition-all duration-500">
            
            {/* Header */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-[#4a9fd8] uppercase tracking-widest">👤 Profile</div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">Account Details</h2>
              <p className="text-sm text-white/60">Update your personal information and preferences</p>
            </div>

            {/* Loading State */}
            {isLoading ? (
              <div className="py-8 text-center">
                <p className="text-sm text-white/70 font-medium">⏳ Loading your profile...</p>
              </div>
            ) : (
              <>
                {/* Avatar Display */}
                <div className="flex items-center gap-4 p-4 rounded-xl border border-white/15 bg-white/5">
                  <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-gradient-to-br from-[#206eaa]/40 to-[#1a5a8f]/30 text-2xl font-bold text-[#4a9fd8] border border-[#206eaa]/40 shadow-lg shadow-[#206eaa]/20">
                    {profileForm.firstName?.[0] || user?.firstName?.[0] || "👤"}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-white">{profileForm.firstName || user?.firstName || "User"} {profileForm.lastName || user?.lastName || ""}</div>
                    <div className="text-xs text-white/60 mt-1">{user?.email || "No email"}</div>
                  </div>
                </div>

                {/* Profile Form */}
                <form className="space-y-4" onSubmit={handleProfileSubmit}>
                  
                  {/* First & Last Name */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="relative group">
                      <label className="text-xs font-bold text-white/70 uppercase tracking-wider block mb-2">First Name</label>
                      <Input
                        name="firstName"
                        value={profileForm.firstName}
                        onChange={handleProfileChange}
                        placeholder="First Name"
                        required
                        className="w-full rounded-lg border border-white/20 bg-white/7 px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-[#4a9fd8] focus:bg-white/12 focus:outline-none focus:ring-1 focus:ring-[#206eaa]/50 transition-all duration-300 group-hover:border-white/30"
                      />
                    </div>
                    <div className="relative group">
                      <label className="text-xs font-bold text-white/70 uppercase tracking-wider block mb-2">Last Name</label>
                      <Input
                        name="lastName"
                        value={profileForm.lastName}
                        onChange={handleProfileChange}
                        placeholder="Last Name"
                        required
                        className="w-full rounded-lg border border-white/20 bg-white/7 px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-[#4a9fd8] focus:bg-white/12 focus:outline-none focus:ring-1 focus:ring-[#206eaa]/50 transition-all duration-300 group-hover:border-white/30"
                      />
                    </div>
                  </div>

                  {/* Email & Phone */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="relative group">
                      <label className="text-xs font-bold text-white/70 uppercase tracking-wider block mb-2">Email</label>
                      <Input
                        type="email"
                        value={user?.email || ""}
                        placeholder="Email"
                        readOnly
                        className="w-full rounded-lg border border-white/20 bg-white/7 px-4 py-3 text-sm text-white/70 placeholder:text-white/35 cursor-not-allowed opacity-70 transition-all duration-300"
                      />
                    </div>
                    <div className="relative group">
                      <label className="text-xs font-bold text-white/70 uppercase tracking-wider block mb-2">Phone</label>
                      <Input
                        type="tel"
                        name="phone"
                        value={profileForm.phone}
                        onChange={handleProfileChange}
                        placeholder="Phone Number"
                        required
                        className="w-full rounded-lg border border-white/20 bg-white/7 px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-[#4a9fd8] focus:bg-white/12 focus:outline-none focus:ring-1 focus:ring-[#206eaa]/50 transition-all duration-300 group-hover:border-white/30"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div className="relative group">
                    <label className="text-xs font-bold text-white/70 uppercase tracking-wider block mb-2">Address</label>
                    <Input
                      name="address"
                      value={profileForm.address}
                      onChange={handleProfileChange}
                      placeholder="Your Address"
                      required
                      className="w-full rounded-lg border border-white/20 bg-white/7 px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-[#4a9fd8] focus:bg-white/12 focus:outline-none focus:ring-1 focus:ring-[#206eaa]/50 transition-all duration-300 group-hover:border-white/30"
                    />
                  </div>

                  {/* Image URL */}
                  <div className="relative group">
                    <label className="text-xs font-bold text-white/70 uppercase tracking-wider block mb-2">Profile Image URL</label>
                    <Input
                      name="imageUrl"
                      value={profileForm.imageUrl}
                      onChange={handleProfileChange}
                      placeholder="https://example.com/image.jpg"
                      required
                      className="w-full rounded-lg border border-white/20 bg-white/7 px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-[#4a9fd8] focus:bg-white/12 focus:outline-none focus:ring-1 focus:ring-[#206eaa]/50 transition-all duration-300 group-hover:border-white/30"
                    />
                  </div>

                  {/* Role & Status */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="relative group">
                      <label className="text-xs font-bold text-white/70 uppercase tracking-wider block mb-2">Role</label>
                      <Input
                        value={user?.role || "—"}
                        placeholder="Role"
                        readOnly
                        className="w-full rounded-lg border border-white/20 bg-white/7 px-4 py-3 text-sm text-white/70 placeholder:text-white/35 cursor-not-allowed opacity-70 transition-all duration-300"
                      />
                    </div>
                    <div className="relative group">
                      <label className="text-xs font-bold text-white/70 uppercase tracking-wider block mb-2">Status</label>
                      <Input
                        value={user?.isActive ? "🟢 Active" : "🔴 Inactive"}
                        placeholder="Account Status"
                        readOnly
                        className="w-full rounded-lg border border-white/20 bg-white/7 px-4 py-3 text-sm text-white/70 placeholder:text-white/35 cursor-not-allowed opacity-70 transition-all duration-300"
                      />
                    </div>
                  </div>

                  {/* Messages */}
                  {profileError && (
                    <div className="rounded-lg bg-red-500/25 border border-red-400/50 px-4 py-2.5 animate-pulse">
                      <p className="text-xs text-red-300 font-medium flex items-center gap-2">
                        <span>⚠️</span> {profileError}
                      </p>
                    </div>
                  )}
                  {profileSuccess && (
                    <div className="rounded-lg bg-green-500/25 border border-green-400/50 px-4 py-2.5">
                      <p className="text-xs text-green-300 font-medium flex items-center gap-2">
                        <span>✅</span> {profileSuccess}
                      </p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isUpdatingProfile}
                    className="w-full rounded-lg bg-gradient-to-r from-[#206eaa] via-[#2a7bc4] to-[#1f5a9e] hover:from-[#1a5a8f] hover:via-[#206eaa] hover:to-[#0f3d5a] disabled:from-[#206eaa]/40 disabled:via-[#2a7bc4]/40 disabled:to-[#1f5a9e]/40 disabled:cursor-not-allowed text-white font-bold py-3 transition-all duration-300 shadow-lg shadow-[#206eaa]/50 hover:shadow-2xl hover:shadow-[#206eaa]/70 text-sm uppercase tracking-widest border border-[#4a9fd8]/30 hover:border-[#4a9fd8]/60 relative group/btn overflow-hidden"
                  >
                    <span className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></span>
                    <span className="relative">{isUpdatingProfile ? "⏳ Updating..." : "✅ Update Profile"}</span>
                  </button>
                </form>
              </>
            )}
          </div>

          {/* Password Card */}
          <div className="rounded-2xl border border-white/25 bg-gradient-to-br from-white/12 via-white/6 to-white/[0.01] backdrop-blur-2xl p-8 space-y-6 shadow-2xl shadow-[#206eaa]/25 hover:border-white/35 hover:shadow-2xl hover:shadow-[#206eaa]/35 transition-all duration-500">
            
            {/* Header */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-[#4a9fd8] uppercase tracking-widest">🔐 Security</div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">Change Password</h2>
              <p className="text-sm text-white/60">Update your password regularly to stay secure</p>
            </div>

            {/* Password Form */}
            <form className="space-y-4" onSubmit={handlePasswordSubmit}>
              
              {/* Current Password */}
              <div className="relative group">
                <label className="text-xs font-bold text-white/70 uppercase tracking-wider block mb-2">Current Password</label>
                <Input
                  type="password"
                  name="oldPassword"
                  placeholder="Enter current password"
                  value={passwordForm.oldPassword}
                  onChange={handlePasswordChange}
                  required
                  className="w-full rounded-lg border border-white/20 bg-white/7 px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-[#4a9fd8] focus:bg-white/12 focus:outline-none focus:ring-1 focus:ring-[#206eaa]/50 transition-all duration-300 group-hover:border-white/30"
                />
              </div>

              {/* New Password */}
              <div className="relative group">
                <label className="text-xs font-bold text-white/70 uppercase tracking-wider block mb-2">New Password</label>
                <Input
                  type="password"
                  name="newPassword"
                  placeholder="Enter new password"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  required
                  className="w-full rounded-lg border border-white/20 bg-white/7 px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-[#4a9fd8] focus:bg-white/12 focus:outline-none focus:ring-1 focus:ring-[#206eaa]/50 transition-all duration-300 group-hover:border-white/30"
                />
              </div>

              {/* Confirm Password */}
              <div className="relative group">
                <label className="text-xs font-bold text-white/70 uppercase tracking-wider block mb-2">Confirm Password</label>
                <Input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm new password"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  className="w-full rounded-lg border border-white/20 bg-white/7 px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-[#4a9fd8] focus:bg-white/12 focus:outline-none focus:ring-1 focus:ring-[#206eaa]/50 transition-all duration-300 group-hover:border-white/30"
                />
              </div>

              {/* Messages */}
              {passwordError && (
                <div className="rounded-lg bg-red-500/25 border border-red-400/50 px-4 py-2.5 animate-pulse">
                  <p className="text-xs text-red-300 font-medium flex items-center gap-2">
                    <span>⚠️</span> {passwordError}
                  </p>
                </div>
              )}
              {passwordSuccess && (
                <div className="rounded-lg bg-green-500/25 border border-green-400/50 px-4 py-2.5">
                  <p className="text-xs text-green-300 font-medium flex items-center gap-2">
                    <span>✅</span> {passwordSuccess}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isChangingPassword}
                className="w-full rounded-lg bg-gradient-to-r from-[#206eaa] via-[#2a7bc4] to-[#1f5a9e] hover:from-[#1a5a8f] hover:via-[#206eaa] hover:to-[#0f3d5a] disabled:from-[#206eaa]/40 disabled:via-[#2a7bc4]/40 disabled:to-[#1f5a9e]/40 disabled:cursor-not-allowed text-white font-bold py-3 transition-all duration-300 shadow-lg shadow-[#206eaa]/50 hover:shadow-2xl hover:shadow-[#206eaa]/70 text-sm uppercase tracking-widest border border-[#4a9fd8]/30 hover:border-[#4a9fd8]/60 relative group/btn overflow-hidden"
              >
                <span className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></span>
                <span className="relative">{isChangingPassword ? "⏳ Changing..." : "🔐 Change Password"}</span>
              </button>
            </form>
          </div>
        </section>

        {/* Quick Links Section */}
        <section className="grid gap-4 md:grid-cols-2">
          
          {/* Bookings Card */}
          <Link href="/bookings" className="group">
            <div className="h-full rounded-2xl border border-white/25 bg-gradient-to-br from-white/12 via-white/6 to-white/[0.01] backdrop-blur-2xl p-8 shadow-2xl shadow-[#206eaa]/25 group-hover:border-white/35 group-hover:shadow-2xl group-hover:shadow-[#206eaa]/40 transition-all duration-500 flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold text-[#4a9fd8] uppercase tracking-widest mb-2">📅 Bookings</div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent mb-2">View My Bookings</h3>
                <p className="text-sm text-white/60">Check your ticket details, dates, and booking status</p>
              </div>
              <div className="mt-6">
                <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#206eaa] via-[#2a7bc4] to-[#1f5a9e] hover:from-[#1a5a8f] hover:via-[#206eaa] hover:to-[#0f3d5a] text-white font-bold text-sm transition-all duration-300 shadow-lg shadow-[#206eaa]/50 group-hover:shadow-xl group-hover:shadow-[#206eaa]/70 uppercase tracking-wider border border-[#4a9fd8]/30 hover:border-[#4a9fd8]/60">
                  Go to Bookings →
                </button>
              </div>
            </div>
          </Link>

          {/* Reviews Card */}
          <Link href="/reviews" className="group">
            <div className="h-full rounded-2xl border border-white/25 bg-gradient-to-br from-white/12 via-white/6 to-white/[0.01] backdrop-blur-2xl p-8 shadow-2xl shadow-[#206eaa]/25 group-hover:border-white/35 group-hover:shadow-2xl group-hover:shadow-[#206eaa]/40 transition-all duration-500 flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold text-[#4a9fd8] uppercase tracking-widest mb-2">⭐ Reviews</div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent mb-2">View My Reviews</h3>
                <p className="text-sm text-white/60">Manage your ratings and feedback submissions</p>
              </div>
              <div className="mt-6">
                <button className="px-6 py-3 rounded-lg border-2 border-[#206eaa]/50 bg-gradient-to-r from-[#206eaa]/15 to-[#1a5a8f]/10 hover:from-[#206eaa]/30 hover:to-[#1a5a8f]/20 text-[#4a9fd8] hover:text-white font-bold text-sm transition-all duration-300 shadow-lg shadow-[#206eaa]/20 group-hover:shadow-xl group-hover:shadow-[#206eaa]/30 uppercase tracking-wider group-hover:border-[#4a9fd8]/60">
                  Go to Reviews →
                </button>
              </div>
            </div>
          </Link>
        </section>
      </PageShell>
    </div>
  );
}
