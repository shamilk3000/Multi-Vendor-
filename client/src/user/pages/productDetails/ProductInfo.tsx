import { useState } from "react";
import type Product from "./Product";
import { ShoppingCart, Zap, Minus, Plus, Star } from "lucide-react";

const ProductInfo = ({ product }: { product: Product }) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState(false);

  const decreaseQty = () => {
    setQuantity((prev) => (prev <= 1 ? 1 : prev - 1));
  };

  const increaseQty = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleAddToCart = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1200);
  };

  const rating = product.ratingAverage;

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

          <span className="text-sm text-gray-400">({product.ratingCount})</span>
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

      {/* Quantity */}
      <div className="space-y-1 mb-6">
        <p className="text-sm font-bold">Quantity</p>
        <div
          className="inline-flex items-center gap-2
                     border-3 rounded-md px-2 py-1
                     hover:scale-[1.03]
                     hover:shadow-[0_0_12px_rgba(0,0,0,0.15)]
                     transition-all"
        >
          <button
            onClick={decreaseQty}
            className="w-6 h-6 flex items-center justify-center
                       hover:bg-black hover:text-white rounded transition cursor-pointer"
          >
            <Minus size={12} />
          </button>

          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
            className="w-10 text-center font-semibold bg-transparent outline-none"
          />

          <button
            onClick={increaseQty}
            className="w-6 h-6 flex items-center justify-center
                       hover:bg-black hover:text-white rounded transition cursor-pointer"
          >
            <Plus size={12} />
          </button>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col md:flex-row gap-4">
        <button
          onClick={handleAddToCart}
          disabled={loading}
          className="group bg-black text-white py-3 px-6 rounded-md
                     flex items-center justify-center gap-3
                     hover:-translate-y-0.5
                     hover:shadow-[0_0_20px_rgba(0,0,0,0.6)]
                     transition-all cursor-pointer"
        >
          <ShoppingCart
            size={20}
            className={`transition-all me-2 md:me-0 ${
              loading
                ? "animate-bounce"
                : "group-hover:translate-x-2 group-hover:scale-125"
            }`}
          />
          {loading ? "Adding..." : "Add to Cart"}
        </button>

        <button
          className="group border border-black py-3 px-6 rounded-md
                     flex items-center justify-center gap-3
                     hover:bg-black hover:text-white
                     transition-all cursor-pointer"
        >
          <Zap
            size={20}
            className="group-hover:rotate-12 group-hover:scale-125 transition"
          />
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default ProductInfo;
