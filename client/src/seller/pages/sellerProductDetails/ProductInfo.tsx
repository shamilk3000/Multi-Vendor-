// import { useState } from "react";
import type Product from "./Product";
import { Star } from "lucide-react";
import { FaChartLine } from "react-icons/fa";

const ProductInfo = ({ product }: { product: Product }) => {
  const rating = product.average;

  return (
    <div className="space-y-8">
      {/* Product Name */}
      <h2
        className="text-2xl md:text-3xl font-semibold tracking-wide uppercase
                   text-black transition-all duration-300
                   hover:tracking-widest hover:text-gray-800"
      >
        {product.name}
      </h2>

      {/* Price Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-3 flex-wrap">
          <span
            className="text-2xl md:text-3xl font-bold text-black
                       relative transition-all duration-300
                       hover:scale-105
                       hover:text-gray-900
                       after:absolute after:inset-0
                       after:blur-xl after:opacity-20
                       after:animate-pulse"
          >
            £{product.sellingPrice}
          </span>

          <span className="text-sm text-gray-400 line-through">
            £{product.mrpPrice}
          </span>

          {product.discountPercentage > 0 && (
            <span
              className="text-sm font-semibold text-green-700
                         bg-green-100 px-2 py-1 rounded-md
                         animate-bounce shadow-sm"
            >
              {product.discountPercentage}% OFF
            </span>
          )}
        </div>

        {/* ⭐ Rating – bigger + value */}
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => {
            // FULL STAR
            if (rating >= star) {
              return (
                <Star
                  key={star}
                  size={22}
                  className="fill-yellow-300
                             stroke-gray-400
                             animate-pulse
                             hover:scale-125
                             drop-shadow-[0_0_4px_rgba(250,204,21,0.35)]
                             transition-all"
                />
              );
            }

            // HALF STAR
            if (rating >= star - 0.5) {
              return (
                <span
                  key={star}
                  className="relative inline-block w-[22px] h-[22px]"
                >
                  {/* Outline */}
                  <Star
                    size={22}
                    className="absolute inset-0 stroke-gray-400 text-transparent"
                  />

                  {/* Half fill */}
                  <span className="absolute inset-0 w-1/2 overflow-hidden">
                    <Star
                      size={22}
                      className="fill-yellow-300
                                 stroke-gray-400
                                 animate-pulse
                                 drop-shadow-[0_0_4px_rgba(250,204,21,0.35)]"
                    />
                  </span>
                </span>
              );
            }

            // EMPTY STAR
            return (
              <Star
                key={star}
                size={22}
                className="stroke-gray-400 text-transparent
                           hover:scale-110
                           transition-all"
              />
            );
          })}

          {/* Rating text */}
          <span className="ml-2 text-sm text-gray-600 font-medium">
            {rating.toFixed(1)} / 5
          </span>

          <span className="text-sm text-gray-400">
            ({product.totalRatings})
          </span>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2 mb-6">
        <p className="text-sm font-bold text-gray-800">Product Details:</p>
        <ul className="space-y-2">
          {product.description
            .split(".")
            .filter((p) => p.trim())
            .map((point, idx) => (
              <li
                key={idx}
                className="flex gap-2 text-gray-600
                           hover:translate-x-1 hover:text-black
                           transition"
              >
                <span className="text-yellow-400 animate-pulse">•</span>
                <span>{point.trim()}.</span>
              </li>
            ))}
        </ul>
      </div>

      {/* STOCK */}
      <div className="flex flex-row gap-2">
        {/* Stock Status */}
        <div>
          <span
            className={`inline-block px-3 py-1 text-sm font-semibold rounded-full transition-all duration-300 hover:scale-[1.03] 
      ${
        product.stock === 0
          ? "bg-red-100 text-red-600 border border-red-600"
          : product.stock < 10
            ? "bg-yellow-100 text-yellow-600 border border-yellow-600"
            : "bg-green-100 text-green-600 border border-green-600"
      }`}
          >
            {product.stock === 0
              ? "Out of Stock"
              : product.stock < 10
                ? `Low Stock (${product.stock})`
                : `In Stock (${product.stock})`}
          </span>
        </div>

        {/* Sales Info */}
        <div className="flex items-center gap-2 px-3 py-1 bg-green-100 border border-green-600 rounded-full w-fit transition-all duration-300 hover:scale-[1.03]">
          <FaChartLine className="text-green-600 text-sm" />
          <span className="text-sm font-medium text-green-700">
            {product.sale} sold
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
