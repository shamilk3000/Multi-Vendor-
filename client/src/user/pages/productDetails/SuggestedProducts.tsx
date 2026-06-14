import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Product } from "../../../types/product";
import { ShoppingBag } from "lucide-react";
import { useProductsInCategory } from "../../../hooks/user/product/useProducts";

interface CategoryIdProps {
  category: string;
  shopName: string;
  sellerId: string;
  productId: string;
}

const SuggestedProducts: React.FC<CategoryIdProps> = ({
  category,
  sellerId,
  shopName,
  productId,
}) => {
  const BASE_URL = import.meta.env.VITE_SERVER_IMAGE_TARGET;
  const { data: products = [], isLoading } = useProductsInCategory(category);
  let filteredProducts = [];
  if (!isLoading) {
    filteredProducts = products.filter(
      (product: Product) => product._id !== productId,
    );
  }
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const autoScrollRef = useRef<number | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [waveId, setWaveId] = useState<string | null>(null);
  const [imageIndex, setImageIndex] = useState<Record<string, number>>({});

  /* IMAGE SWAP ON HOVER */
  useEffect(() => {
    if (!hoveredId) return;

    const interval = window.setInterval(() => {
      setImageIndex((prev) => ({
        ...prev,
        [hoveredId]: ((prev[hoveredId] ?? 0) + 1) % 2,
      }));
    }, 1400);

    return () => clearInterval(interval);
  }, [hoveredId]);

  /* AUTO SCROLL FUNCTION */
  const startAutoScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    stopAutoScroll();

    const isMobile = window.innerWidth < 768;

    const speed = isMobile ? 1 : 0.5;

    autoScrollRef.current = window.setInterval(() => {
      if (!el) return;

      el.scrollLeft += speed;

      const maxScrollLeft = el.scrollWidth - el.clientWidth;

      if (el.scrollLeft >= maxScrollLeft - 2) {
        el.scrollLeft = 0;
      }
    }, 16);
  };

  const stopAutoScroll = () => {
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current);
    }
  };

  useEffect(() => {
    startAutoScroll();
    return stopAutoScroll;
  }, []);

  const handleHover = (id: string) => {
    setHoveredId(id);
    setWaveId(id);
    stopAutoScroll(); // pause on hover

    setTimeout(() => setWaveId(null), 900);
  };

  if (!isLoading && filteredProducts.length == 0) {
    return;
  }

  return (
    <section className="mt-5">
      <style>
        {`
        .scroll-hide {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .scroll-hide::-webkit-scrollbar {
          display: none;
        }

        .wave-box {
          position: relative;
          overflow: hidden;
        }

        .wave-box::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            120deg,
            transparent 35%,
            rgba(255,255,255,0.25),
            transparent 65%
          );
          transform: translateX(-120%);
        }

        .wave-step::after {
          animation: waveStep 0.9s ease-out forwards;
        }

        @keyframes waveStep {
          0% { transform: translateX(-120%); }
          50% { transform: translateX(40%); }
          100% { transform: translateX(140%); }
        }
        `}
      </style>

      <p className="text-2xl font-bold mb-4 px-4 flex items-center gap-2">
        <ShoppingBag />
        You may also like
      </p>

      <div
        ref={scrollRef}
        onMouseEnter={stopAutoScroll}
        onMouseLeave={startAutoScroll}
        className="flex overflow-x-auto pb-4 scroll-hide"
      >
        {/* {products.map((product: Product) => ( */}
        {filteredProducts.map((product: Product) => (
          <div
            onClick={() =>
              navigate(`/${sellerId}/${shopName}/products/${product._id}`)
            }
            key={product._id}
            onMouseEnter={() => handleHover(product._id)}
            onMouseLeave={() => setHoveredId(null)}
            className="mx-2 cursor-pointer min-w-[180px] bg-white rounded-lg shadow-sm hover:shadow-lg hover:scale-[1.04] transition-all duration-300"
          >
            <div
              className={`h-40 rounded-t-lg wave-box ${
                waveId === product._id ? "wave-step" : ""
              }`}
            >
              {product.discountPercentage > 0 && (
                <span className="absolute top-2 left-2 z-10 bg-red-500 text-white text-xs px-1 py-1 rounded">
                  {product.discountPercentage}% OFF
                </span>
              )}
              <img
                src={`${BASE_URL}${product.image[imageIndex[product._id] ?? 0]}`}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
              />
            </div>

            <div className="px-3 py-2">
              <p className="text-sm font-semibold truncate">{product.name}</p>
              <p className="text-[10px] uppercase text-gray-400">
                {product.category.name} / {product.subCategory.name}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm font-bold text-green-400">
                  &#1583;&#46;&#1573; {product.sellingPrice}
                </span>
                <del className="text-xs text-red-400">
                  &#1583;&#46;&#1573; {product.mrpPrice}
                </del>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SuggestedProducts;
