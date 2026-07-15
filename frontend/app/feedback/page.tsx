"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  MessageSquare,
  Star,
  Send,
  CheckCircle2,
} from "lucide-react";
import { useTheme } from "@/context/context";
import { page } from "../styles/styleclass";
import { SendEmail } from "./action";

export default function FeedbackPage() {
  const { dark } = useTheme();
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 && !comment.trim()) return;

    const emailResult = await SendEmail(rating, comment);
    if (emailResult.success) {
      setIsSubmitted(true);
    } else {
      window.alert("Failed to send feedback.");
    }
  };

  return (
    <div className={`${page(dark)} flex flex-col min-h-0 flex-1`}>
      {/* Back Navigation Bar */}
      <div
        className={`px-4 sm:px-6 py-4 flex items-center border-b ${
          dark ? "bg-gray-900 border-green-950" : "bg-white border-green-100"
        }`}
      >
        <Link
          href="/"
          className={`flex items-center gap-2 text-xs sm:text-sm font-medium transition-colors ${
            dark
              ? "text-gray-400 hover:text-emerald-400"
              : "text-gray-600 hover:text-emerald-600"
          }`}
        >
          <ArrowLeft size={16} />
          Back to Chat
        </Link>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto px-4 py-8 sm:py-12">
        <div className="max-w-xl mx-auto space-y-8">
          {/* Header Introduction */}
          <div className="space-y-2">
            <h1
              className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                dark ? "text-emerald-400" : "text-emerald-600"
              }`}
            >
              Share Your Feedback
            </h1>
            <p
              className={`text-sm leading-relaxed ${dark ? "text-gray-400" : "text-gray-600"}`}
            >
              Let me know how BioMate is working for you or if you encountered
              any issues with syllabus answers.
            </p>
          </div>

          {/* Form / Success Card View */}
          <div
            className={`p-6 sm:p-8 rounded-2xl border shadow-sm transition-all duration-300 ${
              dark
                ? "bg-gray-900 border-gray-800 text-gray-100"
                : "bg-white border-green-100 text-gray-800"
            }`}
          >
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* 1. Star Rating Section */}
                <div className="space-y-2.5">
                  <label
                    className={`text-xs font-bold uppercase tracking-wider ${dark ? "text-gray-400" : "text-gray-500"}`}
                  >
                    Rate Your Experience
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 transition-transform active:scale-90 cursor-pointer"
                      >
                        <Star
                          size={28}
                          className={`transition-colors duration-150 ${
                            star <= (hoverRating || rating)
                              ? "fill-amber-400 text-amber-400"
                              : dark
                                ? "text-gray-700 fill-gray-800"
                                : "text-gray-200 fill-gray-50"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Feedback Comment Area */}
                <div className="space-y-2.5">
                  <label
                    className={`text-xs font-bold uppercase tracking-wider ${dark ? "text-gray-400" : "text-gray-500"}`}
                  >
                    Your Thoughts or Suggestions
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="What did you like? Is there anything missing from the vectorized units?..."
                    rows={5}
                    className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all resize-none ${
                      dark
                        ? "border-gray-700 bg-gray-800 text-gray-100 placeholder-gray-500 focus:border-emerald-600"
                        : "border-green-200 bg-white text-gray-800 placeholder-gray-400 focus:border-emerald-400"
                    }`}
                  />
                </div>

                {/* 3. Submit Button */}
                <button
                  type="submit"
                  disabled={rating === 0 && !comment.trim()}
                  className={`w-full h-11 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 ${
                    dark
                      ? "bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800"
                      : "bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700"
                  }`}
                >
                  <Send size={16} />
                  Submit Feedback
                </button>
              </form>
            ) : (
              /* Success Screen Intermission */
              <div className="text-center py-6 space-y-4 animate-fade-in">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-500 dark:text-emerald-400 mx-auto">
                  <CheckCircle2 size={24} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold">Thank You!</h3>
                  <p
                    className={`text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
                  >
                    Your feedback helps fine-tune the app structure.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    setRating(0);
                    setComment("");
                  }}
                  className={`inline-flex text-xs font-semibold px-4 py-2 border rounded-xl transition ${
                    dark
                      ? "border-gray-700 hover:bg-gray-800 text-gray-300"
                      : "border-green-200 hover:bg-green-50 text-gray-600"
                  }`}
                >
                  Send another response
                </button>
              </div>
            )}
          </div>

          {/* Footer Subtext */}
          <div className="text-center">
            <p
              className={`text-[11px] font-medium tracking-wide uppercase ${dark ? "text-gray-600" : "text-gray-400"}`}
            >
              BioMate Interactive Feedback Loop
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
