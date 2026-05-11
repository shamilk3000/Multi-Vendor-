import { useEffect, useState } from "react";

type RatingBreakdownItem = {
  stars: number;
  count: number;
};

type RatingChartProps = {
  average: number;
  totalRatings: number;
  breakdown: RatingBreakdownItem[];
};

const RatingChart = ({
  average,
  totalRatings,
  breakdown,
}: RatingChartProps) => {
  const [shine, setShine] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setShine((prev) => !prev), 800);
    return () => clearInterval(interval);
  }, []);

  const getPercentage = (count: number) => {
    if (totalRatings === 0) return 0;
    return Math.round((count / totalRatings) * 100);
  };

  const renderStar = (index: number) => {
    if (index < Math.floor(average)) {
      return (
        <span
          key={index}
          className={`text-yellow-400 inline-block transition-all duration-500 ${
            shine ? "animate-pulse" : ""
          }`}
          style={{
            textShadow: shine
              ? "0 0 6px rgba(255,215,0,0.9), 0 0 12px rgba(255,215,0,0.7)"
              : "",
          }}
        >
          ★
        </span>
      );
    } else if (index < average) {
      return (
        <span key={index} className="relative inline-block text-gray-300">
          <span
            className={`absolute left-0 top-0 overflow-hidden text-yellow-400 ${
              shine ? "animate-pulse" : ""
            }`}
            style={{
              width: "50%",
              textShadow: "0 0 6px rgba(255,215,0,0.8)",
            }}
          >
            ★
          </span>
          ★
        </span>
      );
    } else {
      return (
        <span key={index} className="text-gray-300 inline-block">
          ★
        </span>
      );
    }
  };

  return (
    <div
      className="
        group w-full max-w-md py-5 px-5 space-y-6 bg-white rounded-2xl
        border border-gray-200

        shadow-md shadow-black/10
        transition-all duration-300 ease-out

        hover:shadow-2xl hover:shadow-black/25
        hover:scale-[1.04]
      "
    >
      {/* Heading */}
      <h2
        className="
          text-2xl sm:text-3xl font-bold text-center text-black
          group-hover:animate-[wave_0.6s_ease-in-out]
        "
        style={{ animationDelay: "0ms" }}
      >
        Customer Rating
      </h2>

      {/* Average Rating */}
      <div
        className="
          flex items-center gap-4
          group-hover:animate-[wave_0.6s_ease-in-out]
        "
        style={{ animationDelay: "120ms" }}
      >
        <div
          className="
            px-4 py-2 rounded-xl border-2 border-yellow-400
            text-3xl font-bold bg-white
            transition-transform duration-300
            group-hover:scale-110
          "
        >
            {/* {average.toFixed(1)} */}
          {average}
        </div>

        {/* ⭐ Shining Stars */}
        <div className="flex text-2xl sm:text-3xl">
          {[0, 1, 2, 3, 4].map((i) => renderStar(i))}
        </div>

        <span className="text-sm text-gray-500 ml-auto">
          {totalRatings} ratings
        </span>
      </div>

      {/* Rating Breakdown */}
      <div className="space-y-3">
        {breakdown.map(({ stars, count }, index) => {
          const percentage = getPercentage(count);
          return (
            <div
              key={stars}
              className="
                flex items-center gap-2
                group-hover:animate-[wave_0.6s_ease-in-out]
              "
              style={{ animationDelay: `${220 + index * 90}ms` }}
            >
              <span className="w-12 text-sm font-bold text-gray-700 flex items-center gap-2">
                {stars}
                <span
                  className={`text-yellow-400 ${shine ? "animate-pulse" : ""}`}
                  style={{
                    textShadow:
                      "0 0 6px rgba(255,215,0,0.9), 0 0 12px rgba(255,215,0,0.7)",
                  }}
                >
                  ★
                </span>
              </span>

              <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 transition-all duration-700"
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <span className="w-10 text-sm text-gray-600 text-right">
                {percentage}%
              </span>
            </div>
          );
        })}
      </div>

      {/* Wave animation */}
      <style>
        {`
          @keyframes wave {
            0%   { transform: translateY(0); }
            25%  { transform: translateY(-4px); }
            50%  { transform: translateY(4px); }
            75%  { transform: translateY(-2px); }
            100% { transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
};

export default RatingChart;
