import { useState } from "react";
import { Star } from "lucide-react";
import { useReviewForSeller } from "../../../hooks/seller/review/useReviews";

const Reviews = (productId: any) => {
  const { data: reviewsData = [], isLoading } = useReviewForSeller(
    productId.productId,
  );
  const [showAll, setShowAll] = useState(false);
  const reviewsToShow = showAll ? reviewsData : reviewsData.slice(0, 4);
 

  return (
    <section className="mt-1">
      <h3 className="text-lg md:text-xl font-semibold mb-6">Product Reviews</h3>

      <div className="space-y-6">
        {!isLoading && reviewsData.length === 0 && (
          <div
            className="relative overflow-hidden rounded-2xl border border-gray-200
               bg-linear-to-br from-gray-50 to-white
               p-8 flex flex-col items-center justify-center text-center
               shadow-sm transition-all duration-500
               hover:shadow-xl hover:-translate-y-1"
          >
            {/* Decorative glow */}
            <div
              className="absolute inset-0 opacity-0 hover:opacity-100
                 transition duration-500
                 bg-linear-to-r from-yellow-100/40 via-transparent to-yellow-100/40"
            />

            {/* Empty stars */}
            <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  fill="currentColor"
                   className="text-yellow-400 w-5 h-5 
                                   animate-pulse drop-shadow-[0_0_10px_rgba(250,204,21,0.7)]
                                   hover:scale-125 hover:drop-shadow-[0_0_22px_rgba(250,204,21,1)]"
                  strokeWidth={1.5}
                />
              ))}
            </div>

            {/* Title */}
            <h4 className="text-xl font-semibold text-gray-800 mb-2">
              No Reviews Yet
            </h4>

            {/* Subtitle */}
            <p className="text-gray-500 text-sm md:text-base max-w-md leading-relaxed">
             No customer reviews yet. Customer reviews will appear here once buyers start sharing their experiences with this product.
            </p>

            {/* Optional animated pulse */}
            {/* <div
      className="mt-5 px-4 py-2 rounded-full bg-yellow-100 text-yellow-700
                 text-sm font-medium animate-pulse"
    >
      Start the conversation ✨
    </div> */}
          </div>
        )}
        {reviewsToShow.map((review: any, i: any) => (
          <div
            key={i}
            className="group relative border-b 
                       rounded-lg p-4
                       border-2
                       transition-all duration-500
                       hover:-translate-y-1 hover:scale-[1.01]
                       hover:shadow-[0_12px_30px_rgba(0,0,0,0.12)]
                       hover:bg-linear-to-br hover:from-yellow-50 hover:to-white"
          >
            {/* Glow border */}
            <div
              className="pointer-events-none absolute inset-0 rounded-lg
                         opacity-0 group-hover:opacity-100
                         transition duration-500
                         ring-1 ring-yellow-300/40"
            />

            {/* Email – staggered wave */}
            <p
              className="font-semibold text-black text-sm md:text-base
                         group-hover:animate-[wave_0.6s_ease-in-out] mb-2"
              style={{ animationDelay: "0ms" }}
            >
              {review.username} -{" "}
              <span className="text-gray-600 text-sm">{review.email}</span>
            </p>

            {/* Stars – staggered wave */}
            <div
              className="flex items-center gap-1 mb-1
                         transition-transform duration-500
                         group-hover:animate-[wave_0.6s_ease-in-out]"
              style={{ animationDelay: "100ms" }}
            >
              {[...Array(5)].map((_, idx) => {
                const fullStar = idx + 1 <= Math.floor(review.rating);
                const halfStar = idx + 0.5 === review.rating;

                return (
                  <div key={idx} className="relative w-5 h-5">
                    {/* Gray star background */}
                    <Star
                      fill="currentColor"
                      strokeWidth={1.5}
                      className="text-gray-300 w-5 h-5 absolute top-0 left-0"
                    />

                    {/* Full yellow star */}
                    {fullStar && (
                      <Star
                        fill="currentColor"
                        strokeWidth={1.5}
                        className="text-yellow-400 w-5 h-5 absolute top-0 left-0
                                   animate-pulse drop-shadow-[0_0_10px_rgba(250,204,21,0.7)]
                                   hover:scale-125 hover:drop-shadow-[0_0_22px_rgba(250,204,21,1)]"
                      />
                    )}

                    {/* Half yellow star */}
                    {halfStar && (
                      <div className="absolute overflow-hidden w-1/2 top-0 left-0 h-full">
                        <Star
                          fill="currentColor"
                          strokeWidth={1.5}
                          className="text-yellow-400 w-5 h-5 animate-pulse drop-shadow-[0_0_10px_rgba(250,204,21,0.7)]"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Review text – staggered wave */}
            <p
              className="text-gray-600 text-sm md:text-base
                         transition-all duration-500
                         group-hover:text-gray-800
                         group-hover:translate-x-1
                         group-hover:animate-[wave_0.6s_ease-in-out]"
              style={{ animationDelay: "200ms" }}
            >
              {review.review}
            </p>
          </div>
        ))}
      </div>

      {/* Show More / Less */}
      {reviewsData.length > 4 && (
        <div className="flex justify-center mt-6 mb-6">
          <button
            onClick={() => setShowAll((prev) => !prev)}
            className="px-6 py-2 bg-black text-white border border-black rounded-md shadow-lg
                       hover:bg-black/90 hover:text-white hover:shadow-xl
                       transition-all transform hover:-translate-y-1 hover:scale-105
                       flex items-center gap-2 font-semibold cursor-pointer"
          >
            {showAll ? "Show Less" : `Show More`}
            <span
              className={`inline-block transition-transform duration-500
                         ${showAll ? "rotate-180" : "rotate-0"}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </span>
          </button>
        </div>
      )}

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
    </section>
  );
};

export default Reviews;
