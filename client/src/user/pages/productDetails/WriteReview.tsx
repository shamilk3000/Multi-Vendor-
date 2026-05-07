import { useState } from "react";
import api from "../../../features/axios";
import toast from "react-hot-toast";
import { FaExclamationTriangle } from "react-icons/fa";
import { ultrateAddReview } from "../../../hooks/user/review/ultrateReviews";

interface ReviewFormProps {
  productId: string;
}

const WriteReview: React.FC<ReviewFormProps> = ({ productId }) => {
  const { mutateAsync: addReview } = ultrateAddReview();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!rating) {
      toast.error("Please select a rating", {
        icon: <FaExclamationTriangle className="text-red-500" />,
        style: {
          borderRadius: "12px",
          background: "#111",
          color: "#fff",
          border: "1px solid #333",
          boxShadow: "0 0 10px rgba(255,255,255,0.1)",
        },
        duration: 3500,
      });
      return;
    }

    if (!reviewText.trim()) {
      toast.error("Review cannot be empty", {
        icon: <FaExclamationTriangle className="text-red-500" />,
        style: {
          borderRadius: "12px",
          background: "#111",
          color: "#fff",
          border: "1px solid #333",
          boxShadow: "0 0 10px rgba(255,255,255,0.1)",
        },
        duration: 3500,
      });
      return;
    }

    setSubmitting(true);

    const data = { productId, rating, review: reviewText };

    try {
      await toast.promise(
        addReview(data),
        {
          loading: "Submitting review...",
          success: "Review added successfully 🎉",
          error: "Failed to submit review ❌",
        },
        {
          style: {
            background: "#111",
            color: "#fff",
            border: "1px solid #333",
          },
        },
      );
      // Reset only on success
      setRating(0);
      setHoverRating(0);
      setReviewText("");
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center px-2 md:px-0 py-5">
      <form
        onSubmit={handleSubmit}
        className="
          group bg-white px-7 py-5 sm:px-8 sm:py-6 rounded-2xl max-w-md w-full space-y-5 border border-gray-200
          shadow-md shadow-black/10 transition-all duration-300 transform
          hover:scale-105 hover:shadow-2xl hover:shadow-black/25
        "
      >
        {/* Heading with wave */}
        <h2
          className="
            text-2xl sm:text-3xl font-bold text-black text-center
            group-hover:animate-[wave_0.6s_ease-in-out]
          "
          style={{ animationDelay: "0ms" }}
        >
          Write a Review
        </h2>

        {/* Star Rating */}
        <div
          className="flex justify-center gap-2 text-2xl sm:text-3xl
            group-hover:animate-[wave_0.6s_ease-in-out]"
          style={{ animationDelay: "100ms" }}
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className={`transition-all duration-300 cursor-pointer ${
                star <= (hoverRating || rating)
                  ? "text-yellow-400 drop-shadow-[0_0_8px_rgba(255,215,0,0.9)] scale-110"
                  : "text-gray-400 hover:text-yellow-400 hover:scale-105"
              }`}
            >
              <svg
                className="w-6 h-6 sm:w-7 sm:h-7"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
              </svg>
            </button>
          ))}
        </div>

        {/* Review Textarea */}
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          rows={3}
          placeholder="Write your thoughts..."
          className="
            w-full p-3 sm:p-4 text-black placeholder-gray-500 bg-gray-100 rounded-xl
            border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black
            resize-none transition-all duration-300 hover:scale-[1.01]
            group-hover:animate-[wave_0.6s_ease-in-out]
          "
          style={{ animationDelay: "200ms" }}
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className="
            w-full flex items-center justify-center gap-2 bg-black text-white font-semibold py-2 sm:py-3 rounded-xl
            shadow-lg transition-all duration-300 hover:bg-white hover:text-black hover:border-2 hover:border-black group
            disabled:opacity-50 disabled:cursor-not-allowed
            group-hover:animate-[wave_0.6s_ease-in-out] cursor-pointer
          "
          style={{ animationDelay: "300ms" }}
        >
          {submitting ? (
            <>
              Submitting...
              <svg
                className="w-5 h-5 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                ></path>
              </svg>
            </>
          ) : (
            <>
              Submit Review
              <svg
                className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12 group-hover:translate-x-1"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M2.01 21l20.99-9L2.01 3v7l15 2-15 2v7z" />
              </svg>
            </>
          )}
        </button>

        {/* Wave animation */}
        <style>
          {`
            @keyframes wave {
              0% { transform: translateY(0); }
              25% { transform: translateY(-4px); }
              50% { transform: translateY(4px); }
              75% { transform: translateY(-2px); }
              100% { transform: translateY(0); }
            }
          `}
        </style>
      </form>
    </div>
  );
};

export default WriteReview;
