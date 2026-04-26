"use client";

import { useEffect, useMemo, useState } from "react";

import Button from "../ui/Button";
import Card from "../ui/Card";
import Input from "../ui/Input";
import SectionHeader from "../ui/SectionHeader";
import PageShell from "../layout/PageShell";

const formatReviewDate = (value) => {
  if (!value) {
    return "Recently";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }
  return date.toLocaleDateString();
};

export default function EventReviewsSection({ eventId, eventName }) {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const [reviews, setReviews] = useState([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    rating: "5",
    comment: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const token = useMemo(() => {
    if (typeof window === "undefined") {
      return "";
    }
    return window.localStorage.getItem("authToken") || "";
  }, []);

  const loadReviews = async () => {
    try {
      setIsLoadingReviews(true);
      const response = await fetch(`${apiBaseUrl}/reviews/${eventId}`, {
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error("Failed to load reviews.");
      }
      const payload = await response.json();
      const items = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.reviews)
          ? payload.reviews
          : [];
      setReviews(items);
    } catch {
      setReviews([]);
    } finally {
      setIsLoadingReviews(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [apiBaseUrl, eventId]);

  useEffect(() => {
    const loadCurrentUser = async () => {
      if (!token) {
        setCurrentUser(null);
        return;
      }
      try {
        const response = await fetch(`${apiBaseUrl}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Unauthorized");
        }
        const payload = await response.json();
        setCurrentUser(payload);
      } catch {
        setCurrentUser(null);
      }
    };

    loadCurrentUser();
  }, [apiBaseUrl, token]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    
    // Validate rating field
    if (name === 'rating') {
      const numValue = Number(value);
      if (value === '' || (Number.isInteger(numValue) && numValue >= 1 && numValue <= 5)) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
      return;
    }
    
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!token) {
      setErrorMessage("Please login to submit a review.");
      return;
    }

    if (!currentUser?.id || !currentUser?.email) {
      setErrorMessage("Unable to load current user details.");
      return;
    }

    const ratingValue = Number(formData.rating);
    if (!Number.isInteger(ratingValue) || ratingValue < 1 || ratingValue > 5) {
      setErrorMessage("Rating must be between 1 and 5.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${apiBaseUrl}/reviews`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: currentUser.id,
          user_name: `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim(),
          email: currentUser.email,
          event_id: eventId,
          event_name: eventName,
          rating: ratingValue,
          comment: formData.comment,
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.message || "Failed to submit review.");
      }

      setFormData({ rating: "5", comment: "" });
      setSuccessMessage("Review submitted successfully.");
      setReviews((prev) => [payload, ...prev]);
    } catch (error) {
      setErrorMessage(error.message || "Failed to submit review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-12 bg-gradient-to-b from-[#0f0f14] to-[#0a0a0f]">
      <PageShell className="space-y-8">
        <SectionHeader
          eyebrow="Reviews"
          title="What people are saying"
          subtitle="Read authentic reviews from fellow event-goers."
        />
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            {isLoadingReviews ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-sm text-white/60">Loading reviews...</p>
              </div>
            ) : null}
            {!isLoadingReviews && reviews.length === 0 ? (
              <div className="rounded-2xl border border-white/20 bg-gradient-to-br from-white/8 to-white/5 p-8 text-center">
                <p className="text-sm text-white/60">No reviews yet. Be the first to share!</p>
              </div>
            ) : null}
            {reviews.map((review, index) => (
              <div
                key={review.review_id || review._id || review.id || `review-${index}`}
                className="rounded-2xl border border-white/20 bg-gradient-to-br from-white/12 via-white/8 to-white/5 backdrop-blur-lg p-6 space-y-3 transition-all duration-300 hover:border-[#206eaa]/40 hover:shadow-lg hover:shadow-[#206eaa]/10"
              >
                <div className="text-lg text-[#4a9fd8] font-semibold">
                  {"★".repeat(Number(review.rating) || 0)}
                  {"☆".repeat(5 - (Number(review.rating) || 0))}
                </div>
                <p className="text-sm text-white/85 leading-relaxed">"{review.comment}"</p>
                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <span className="text-xs font-semibold text-[#4a9fd8]">{review.user_name}</span>
                  <span className="text-xs text-white/50">{formatReviewDate(review.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-white/20 bg-gradient-to-br from-white/12 via-white/8 to-white/5 backdrop-blur-lg p-6 space-y-5">
            <div>
              <div className="text-xs uppercase tracking-[0.35em] text-[#4a9fd8] font-semibold">
                Leave a Review
              </div>
            </div>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-white/70 uppercase tracking-wide">Name</label>
                <Input
                  placeholder="Your name"
                  value={
                    currentUser
                      ? `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim()
                      : ""
                  }
                  readOnly
                  className="w-full rounded-lg border border-white/30 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-[#206eaa] focus:bg-white/10"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-white/70 uppercase tracking-wide">Email</label>
                <Input
                  placeholder="Email"
                  value={currentUser?.email || ""}
                  readOnly
                  className="w-full rounded-lg border border-white/30 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-[#206eaa] focus:bg-white/10"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-white/70 uppercase tracking-wide">Rating (1-5)</label>
                <Input
                  type="number"
                  name="rating"
                  min="1"
                  max="5"
                  placeholder="Enter 1-5"
                  value={formData.rating}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-white/30 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-[#206eaa] focus:bg-white/10 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&]:appearance-none"
                />
                {formData.rating && (Number(formData.rating) < 1 || Number(formData.rating) > 5) && (
                  <p className="text-xs text-red-400 font-medium">Rating must be between 1 and 5</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-white/70 uppercase tracking-wide">Your Review</label>
                <textarea
                  name="comment"
                  value={formData.comment}
                  onChange={handleChange}
                  className="min-h-[110px] w-full rounded-lg border border-white/30 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-[#206eaa] focus:bg-white/10 focus:outline-none resize-none transition-colors duration-200"
                  placeholder="Share your thoughts about this event..."
                  required
                />
              </div>
              {errorMessage ? (
                <p className="text-xs text-red-400 font-medium">{errorMessage}</p>
              ) : null}
              {successMessage ? (
                <p className="text-xs text-green-400 font-medium">{successMessage}</p>
              ) : null}
              <Button type="submit" disabled={isSubmitting} className="bg-[#206eaa] hover:bg-[#1a5a8f] text-white font-semibold shadow-lg shadow-[#206eaa]/30 w-full rounded-lg py-2.5">
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </Button>
            </form>
          </div>
        </div>
      </PageShell>
    </section>
  );
}
