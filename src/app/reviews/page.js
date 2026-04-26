"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";

const formatDate = (value) => {
  if (!value) {
    return "—";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "—";
  }
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getReviewId = (review) =>
  review.review_id || review._id || review.id || "";

export default function ReviewsPage() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const { user, token, isLoading: authLoading } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ rating: "5", comment: "" });
  const [actionError, setActionError] = useState("");
  const [savingId, setSavingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const userId = user?.id;

  useEffect(() => {
    let isMounted = true;

    const loadReviews = async () => {
      if (authLoading) {
        return;
      }

      if (!token || !userId) {
        if (isMounted) {
          setReviews([]);
          setIsLoading(false);
        }
        return;
      }

      try {
        setIsLoading(true);
        setErrorMessage("");
        const response = await fetch(`${apiBaseUrl}/reviews/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.status === 404) {
          if (isMounted) {
            setReviews([]);
          }
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to load your reviews.");
        }

        const payload = await response.json();
        const items = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.reviews)
            ? payload.reviews
            : [];

        if (isMounted) {
          setReviews(items);
        }
      } catch (error) {
        if (isMounted) {
          setReviews([]);
          setErrorMessage(error.message || "Failed to load reviews.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadReviews();

    return () => {
      isMounted = false;
    };
  }, [apiBaseUrl, authLoading, token, userId]);

  const buildUpdatePayload = (review, rating, comment) => ({
    user_id: user?.id,
    user_name: `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || review.user_name,
    email: user?.email || review.email,
    event_id: review.event_id,
    event_name: review.event_name,
    rating,
    comment,
  });

  const startEdit = (review) => {
    const id = getReviewId(review);
    if (!id) {
      return;
    }
    setActionError("");
    setEditingId(id);
    setEditForm({
      rating: String(Number(review.rating) || 1),
      comment: review.comment || "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ rating: "5", comment: "" });
    setActionError("");
  };

  const handleUpdate = async (review) => {
    const reviewId = getReviewId(review);
    if (!reviewId || !token || !user) {
      setActionError("Unable to update review.");
      return;
    }

    const rating = Number.parseInt(editForm.rating, 10);
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      setActionError("Rating must be between 1 and 5.");
      return;
    }

    setSavingId(reviewId);
    setActionError("");

    try {
      const response = await fetch(`${apiBaseUrl}/reviews/${reviewId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(buildUpdatePayload(review, rating, editForm.comment)),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload?.message || "Failed to update review.");
      }

      setReviews((current) =>
        current.map((item) =>
          getReviewId(item) === reviewId ? { ...item, ...payload, rating, comment: editForm.comment } : item
        )
      );
      cancelEdit();
    } catch (error) {
      setActionError(error.message || "Failed to update review.");
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (review) => {
    const reviewId = getReviewId(review);
    if (!reviewId || !token) {
      return;
    }
    if (!window.confirm("Delete this review? This cannot be undone.")) {
      return;
    }

    setDeletingId(reviewId);
    setActionError("");

    try {
      const response = await fetch(`${apiBaseUrl}/reviews/${reviewId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload?.message || "Failed to delete review.");
      }

      setReviews((current) => current.filter((item) => getReviewId(item) !== reviewId));
      if (editingId === reviewId) {
        cancelEdit();
      }
    } catch (error) {
      setActionError(error.message || "Failed to delete review.");
    } finally {
      setDeletingId(null);
    }
  };

  const stats = useMemo(() => {
    const total = reviews.length;
    const avgRating =
      total > 0
        ? (
            reviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) / total
          ).toFixed(1)
        : "0.0";
    return { total, avgRating };
  }, [reviews]);

  if (!authLoading && !token) {
    return (
      <main className="min-h-screen bg-[#0a0a0f] py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-black text-white mb-2">My Reviews</h1>
          <p className="text-white/60 text-base mb-12">Sign in to see reviews you have submitted.</p>
          <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center">
            <p className="text-white/60 text-sm mb-6">You need to be logged in to view your reviews.</p>
            <Link href="/login">
              <button className="px-6 py-2.5 rounded-lg bg-[#206eaa] hover:bg-[#1a5a8f] text-white text-sm font-bold transition-all">
                Go to login
              </button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0f] py-16 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-black text-white mb-2">
            My Reviews
          </h1>
          <p className="text-white/60 text-base">
            Reviews you have submitted for events.
          </p>
        </div>

        {/* Stats Cards */}
        {!isLoading && !errorMessage && reviews.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-white/50 text-xs font-semibold mb-1">TOTAL REVIEWS</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-white/50 text-xs font-semibold mb-1">AVG RATING</p>
              <p className="text-2xl font-bold text-[#4a9fd8]">{stats.avgRating} ⭐</p>
            </div>
          </div>
        )}

        {/* Reviews Grid */}
        <div className="space-y-6">
          
          {/* Loading State */}
          {isLoading && (
            <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center">
              <div className="inline-block w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin mb-4"></div>
              <p className="text-white/60 text-sm">Loading your reviews...</p>
            </div>
          )}

          {/* Error State */}
          {!isLoading && errorMessage && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-8">
              <p className="text-red-400 font-semibold text-sm">{errorMessage}</p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !errorMessage && reviews.length === 0 && (
            <div className="rounded-xl border border-white/10 bg-white/5 p-12 text-center">
              <div className="text-4xl mb-3">⭐</div>
              <h3 className="text-lg font-bold text-white mb-1">No Reviews Yet</h3>
              <p className="text-white/50 text-sm">Submit a review from an event page.</p>
            </div>
          )}

          {/* Action Error */}
          {actionError && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
              <p className="text-red-400 text-sm">{actionError}</p>
            </div>
          )}

          {/* Review Cards */}
          {reviews.map((review, index) => {
            const rid = getReviewId(review);
            const isEditing = editingId === rid;

            return (
              <div
                key={rid || `review-${index}`}
                className="rounded-xl border border-white/10 bg-white/5 p-6 hover:border-white/20 hover:bg-white/8 transition-all"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-6 pb-4 border-b border-white/10">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">
                      {review.event_name}
                    </h3>
                    <p className="text-white/50 text-xs">
                      Event ID: {review.event_id}
                    </p>
                  </div>
                </div>

                {/* Rating Display */}
                {!isEditing && (
                  <div className="mb-4">
                    <p className="text-lg font-bold text-[#4a9fd8] mb-2">
                      {"⭐".repeat(Number(review.rating) || 0)}
                    </p>
                  </div>
                )}

                {/* Comment */}
                {isEditing ? (
                  <div className="space-y-4 mb-4">
                    <div>
                      <label className="block text-xs font-semibold text-white/60 mb-2">Rating (1-5)</label>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        name="rating"
                        value={editForm.rating}
                        onChange={(e) =>
                          setEditForm((f) => ({ ...f, rating: e.target.value }))
                        }
                        className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:border-[#206eaa] focus:bg-white/15 outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-white/60 mb-2">Comment</label>
                      <textarea
                        name="comment"
                        value={editForm.comment}
                        onChange={(e) =>
                          setEditForm((f) => ({ ...f, comment: e.target.value }))
                        }
                        rows="4"
                        className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-[#206eaa] focus:bg-white/15 outline-none text-sm resize-none"
                        placeholder="Your comment"
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-white/70 text-sm mb-4">{review.comment}</p>
                )}

                {/* Meta Info */}
                <div className="text-xs text-white/50 mb-4 pb-4 border-b border-white/10">
                  {formatDate(review.createdAt)}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  <Link href={`/events/${review.event_id}`}>
                    <button className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-all">
                      View Event
                    </button>
                  </Link>

                  {isEditing ? (
                    <>
                      <button
                        onClick={cancelEdit}
                        disabled={savingId === rid}
                        className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-all disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleUpdate(review)}
                        disabled={savingId === rid}
                        className="px-4 py-2 rounded-lg bg-[#206eaa] hover:bg-[#1a5a8f] text-white text-xs font-bold transition-all disabled:opacity-50"
                      >
                        {savingId === rid ? "Saving..." : "Save"}
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(review)}
                        disabled={Boolean(deletingId) || Boolean(savingId)}
                        className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-all disabled:opacity-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(review)}
                        disabled={deletingId === rid || Boolean(savingId)}
                        className="px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs font-semibold transition-all disabled:opacity-50"
                      >
                        {deletingId === rid ? "Deleting..." : "Delete"}
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
