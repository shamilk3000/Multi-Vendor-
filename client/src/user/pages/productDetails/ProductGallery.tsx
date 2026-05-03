import { useEffect, useState } from "react";

interface Product {
  name: string;
  image: string[];
}

interface ProductGalleryProps {
  product: Product;
}

const ProductGallery = ({ product }: ProductGalleryProps) => {
  const [activeImage, setActiveImage] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveImage((prev) => (prev + 1) % product.image.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [product.image.length]);
  return (
    <section className="max-w-6xl mx-auto px-4">
      {/* 🖼 Product Image Section */}
      <div>
        <div className="space-y-4">
          {/* Main Image */}
          <div
            className="relative overflow-hidden rounded-2xl 
                       sm:border group bg-gray-50"
          >
            <img
              src={product.image[activeImage]}
              alt={product.name}
              className="
                w-full h-[300px] sm:h-[420px]
                object-contain sm:object-cover
                transition-all duration-700 ease-out
                sm:group-hover:scale-110
              "
            />

            {/* ✨ Luxury light sweep */}
            <div
              className="
                absolute inset-0 pointer-events-none
                opacity-0 group-hover:opacity-100
                transition duration-700
                bg-linear-to-tr from-transparent via-white/10 to-transparent
              "
            />
          </div>

          {/* 🖼 Thumbnails */}
          <div className="flex gap-3 justify-center flex-wrap">
            {product.image.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`w-16 h-16 rounded-xl overflow-hidden border
                  transition-all duration-300 cursor-pointer
                  ${
                    activeImage === idx
                      ? "border-black scale-105 shadow-lg"
                      : "opacity-60 hover:opacity-100"
                  }`}
              >
                <img
                  src={img}
                  alt={`${product.name} thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductGallery;
