import React, { useEffect, useRef, useState } from "react";

type Product = {
  id: number;
  brand: string;
  name: string;
  price: number;
  originalPrice: number;
  discount: number;
  images: string[];
};

// Your products array (same as before)
const products: Product[] = [
  {
    id: 1,
    brand: "Brand",
    name: "Product Name",
    price: 149,
    originalPrice: 199,
    discount: 25,
    images: [
      "https://images.unsplash.com/photo-1646753522408-077ef9839300?auto=format&fit=crop&w=500&q=60",
      "https://images.unsplash.com/photo-1649261191624-ca9f79ca3fc6?auto=format&fit=crop&w=500&q=60",
      "https://images.unsplash.com/photo-1651950519238-15835722f8bb?auto=format&fit=crop&w=500&q=60",
      "https://images.unsplash.com/photo-1651950537598-373e4358d320?auto=format&fit=crop&w=500&q=60",
    ],
  },
  {
    id: 2,
    brand: "Brand",
    name: "Product Name",
    price: 149,
    originalPrice: 199,
    discount: 25,
    images: [
      "https://images.unsplash.com/photo-1651950519238-15835722f8bb?auto=format&fit=crop&w=500&q=60",
      "https://images.unsplash.com/photo-1646753522408-077ef9839300?auto=format&fit=crop&w=500&q=60",
      "https://images.unsplash.com/photo-1649261191624-ca9f79ca3fc6?auto=format&fit=crop&w=500&q=60",
      "https://images.unsplash.com/photo-1651950537598-373e4358d320?auto=format&fit=crop&w=500&q=60",
    ],
  },
  {
    id: 3,
    brand: "Brand",
    name: "Product Name",
    price: 149,
    originalPrice: 199,
    discount: 25,
    images: [
      "https://images.unsplash.com/photo-1651950537598-373e4358d320?auto=format&fit=crop&w=500&q=60",
      "https://images.unsplash.com/photo-1646753522408-077ef9839300?auto=format&fit=crop&w=500&q=60",
      "https://images.unsplash.com/photo-1651950519238-15835722f8bb?auto=format&fit=crop&w=500&q=60",
      "https://images.unsplash.com/photo-1649261191624-ca9f79ca3fc6?auto=format&fit=crop&w=500&q=60",
    ],
  },
  {
    id: 4,
    brand: "Brand",
    name: "Product Name",
    price: 149,
    originalPrice: 199,
    discount: 25,
    images: [
      "https://images.unsplash.com/photo-1651950540805-b7c71869e689?auto=format&fit=crop&w=500&q=60",
      "https://images.unsplash.com/photo-1646753522408-077ef9839300?auto=format&fit=crop&w=500&q=60",
      "https://images.unsplash.com/photo-1651950519238-15835722f8bb?auto=format&fit=crop&w=500&q=60",
      "https://images.unsplash.com/photo-1651950537598-373e4358d320?auto=format&fit=crop&w=500&q=60",
    ],
  },
  {
    id: 5,
    brand: "Brand",
    name: "Product Name",
    price: 149,
    originalPrice: 199,
    discount: 25,
    images: [
      "https://images.unsplash.com/photo-1649261191624-ca9f79ca3fc6?auto=format&fit=crop&w=500&q=60",
      "https://images.unsplash.com/photo-1646753522408-077ef9839300?auto=format&fit=crop&w=500&q=60",
      "https://images.unsplash.com/photo-1651950519238-15835722f8bb?auto=format&fit=crop&w=500&q=60",
      "https://images.unsplash.com/photo-1651950537598-373e4358d320?auto=format&fit=crop&w=500&q=60",
    ],
  },
  {
    id: 6,
    brand: "Brand",
    name: "Product Name",
    price: 149,
    originalPrice: 199,
    discount: 25,
    images: [
      "https://images.unsplash.com/photo-1649261191606-cb2496e97eee?auto=format&fit=crop&w=500&q=60",
      "https://images.unsplash.com/photo-1646753522408-077ef9839300?auto=format&fit=crop&w=500&q=60",
      "https://images.unsplash.com/photo-1651950519238-15835722f8bb?auto=format&fit=crop&w=500&q=60",
      "https://images.unsplash.com/photo-1651950537598-373e4358d320?auto=format&fit=crop&w=500&q=60",
    ],
  },
  {
    id: 7,
    brand: "Brand",
    name: "Product Name",
    price: 149,
    originalPrice: 199,
    discount: 25,
    images: [
      "https://images.unsplash.com/photo-1646753522408-077ef9839300?auto=format&fit=crop&w=500&q=60",
      "https://images.unsplash.com/photo-1649261191624-ca9f79ca3fc6?auto=format&fit=crop&w=500&q=60",
      "https://images.unsplash.com/photo-1651950519238-15835722f8bb?auto=format&fit=crop&w=500&q=60",
      "https://images.unsplash.com/photo-1651950537598-373e4358d320?auto=format&fit=crop&w=500&q=60",
    ],
  },
  {
    id: 8,
    brand: "Brand",
    name: "Product Name",
    price: 149,
    originalPrice: 199,
    discount: 25,
    images: [
      "https://images.unsplash.com/photo-1651950519238-15835722f8bb?auto=format&fit=crop&w=500&q=60",
      "https://images.unsplash.com/photo-1646753522408-077ef9839300?auto=format&fit=crop&w=500&q=60",
      "https://images.unsplash.com/photo-1649261191624-ca9f79ca3fc6?auto=format&fit=crop&w=500&q=60",
      "https://images.unsplash.com/photo-1651950537598-373e4358d320?auto=format&fit=crop&w=500&q=60",
    ],
  },
  {
    id: 9,
    brand: "Brand",
    name: "Product Name",
    price: 149,
    originalPrice: 199,
    discount: 25,
    images: [
      "https://images.unsplash.com/photo-1651950537598-373e4358d320?auto=format&fit=crop&w=500&q=60",
      "https://images.unsplash.com/photo-1646753522408-077ef9839300?auto=format&fit=crop&w=500&q=60",
      "https://images.unsplash.com/photo-1651950519238-15835722f8bb?auto=format&fit=crop&w=500&q=60",
      "https://images.unsplash.com/photo-1649261191624-ca9f79ca3fc6?auto=format&fit=crop&w=500&q=60",
    ],
  },
];

const SuggestedProducts: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const autoScrollRef = useRef<number | null>(null);

  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [imageIndex, setImageIndex] = useState<Record<number, number>>({});
  const [waveId, setWaveId] = useState<number | null>(null);

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

    const speed = 0.5; // px per frame, smaller = slower

    autoScrollRef.current = window.setInterval(() => {
      if (!el) return;

      el.scrollLeft += speed;

      // if reached end, reset to start
      if (el.scrollLeft + el.offsetWidth >= el.scrollWidth) {
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

  const handleHover = (id: number) => {
    setHoveredId(id);
    setWaveId(id);
    stopAutoScroll(); // pause on hover

    setTimeout(() => setWaveId(null), 900);
  };

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

      <p className="text-2xl font-bold mb-4 px-4">You may also like</p>

      <div
        ref={scrollRef}
        onMouseEnter={stopAutoScroll}
        onMouseLeave={startAutoScroll}
        className="flex gap-4 overflow-x-auto pb-4 scroll-hide"
      >
        {products.map((product) => (
          <div
            key={product.id}
            onMouseEnter={() => handleHover(product.id)}
            onMouseLeave={() => setHoveredId(null)}
            className="cursor-pointer min-w-[180px] bg-white rounded-lg shadow-sm hover:shadow-lg hover:scale-[1.04] transition-all duration-300"
          >
            <div
              className={`h-40 rounded-t-lg wave-box ${
                waveId === product.id ? "wave-step" : ""
              }`}
            >
              <img
                src={product.images[imageIndex[product.id] ?? 0]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
              />
            </div>

            <div className="px-3 py-2">
              <p className="text-[10px] uppercase text-gray-400">
                {product.brand}
              </p>
              <p className="text-sm font-semibold truncate">{product.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm font-bold">${product.price}</span>
                <del className="text-xs text-gray-400">
                  ${product.originalPrice}
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
