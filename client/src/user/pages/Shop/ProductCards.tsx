import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import { FaSearch } from "react-icons/fa";
import type { Product } from "@/types/product";
import { useProductsForUser } from "../../../hooks/user/product/useProducts";
import ProductSkeletonGrid from "@/user/components/skeletons/productList";

// GRID (UNCHANGED)
const ProductGrid: React.FC<{
  currentPage: number;
  itemsPerPage: number;
  data: Product[];
}> = ({ currentPage, itemsPerPage, data }) => {
  const [imageIndex, setImageIndex] = useState<Record<string, number>>(
    data.reduce((acc, p) => ({ ...acc, [p._id]: 0 }), {}),
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = data.slice(startIndex, startIndex + itemsPerPage);
  const [pausedIds, setPausedIds] = useState<string[]>([]);
  const BASE_URL = import.meta.env.VITE_SERVER_IMAGE_TARGET;
  const intervalsRef = useRef<Record<string, ReturnType<typeof setInterval>>>(
    {},
  );
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const pausedRef = useRef<string[]>([]);

  // ================== KEEP PAUSED IDS ==================
  // ✅ keep pausedIds in ref
  useEffect(() => {
    pausedRef.current = pausedIds;
  }, [pausedIds]);

  useEffect(() => {
    // cleanup old timers
    Object.values(intervalsRef.current).forEach(clearInterval);
    timeoutsRef.current.forEach(clearTimeout);

    intervalsRef.current = {};
    timeoutsRef.current = [];

    paginatedProducts.forEach((product, idx) => {
      if (!product.image || product.image.length <= 1) return;

      const delay = idx * 2000;

      const timeout = window.setTimeout(() => {
        intervalsRef.current[product._id] = window.setInterval(() => {
          setImageIndex((prev) => {
            if (pausedRef.current.includes(product._id)) return prev;

            const current = prev[product._id] ?? 0;

            return {
              ...prev,
              [product._id]: (current + 1) % product.image.length,
            };
          });
        }, 2000);
      }, delay);

      timeoutsRef.current.push(timeout);
    });

    return () => {
      Object.values(intervalsRef.current).forEach(clearInterval);
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, [data, currentPage]); // 👈 IMPORTANT FIX

  const getImageUrl = (img: string) =>
    img.startsWith("http") ? img : `${BASE_URL}${img}`;

  return (
    <section
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 
    grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6"
    >
      {paginatedProducts.map((product) => {
        const index = imageIndex[product._id] ?? 0;

        return (
          <div
            key={product._id}
            onMouseEnter={() =>
              setPausedIds((prev) =>
                prev.includes(product._id) ? prev : [...prev, product._id],
              )
            }
            onMouseLeave={() =>
              setPausedIds((prev) => prev.filter((id) => id !== product._id))
            }
            className="group cursor-pointer w-full rounded-2xl overflow-hidden 
          bg-linear-to-br from-white via-gray-50 to-gray-100
          border border-gray-200 shadow-md 
          hover:shadow-2xl hover:shadow-blue-200/40
          transition-all duration-500 hover:scale-[1.04]"
          >
            {/* IMAGE */}
            <div className="relative h-44 sm:h-60 lg:h-72 overflow-hidden">
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent opacity-70 z-10" />

              {/* Discount badge */}
              {product.discountPercentage > 0 && (
                <span
                  className="absolute top-2 left-2 z-20 
                bg-red-500/90 backdrop-blur text-white text-xs px-2 py-1 rounded-md shadow"
                >
                  {product.discountPercentage}% OFF
                </span>
              )}

              {/* Images */}
              {product.image.map((img, i) => (
                <img
                  key={i}
                  src={getImageUrl(img)}
                  alt={product.name}
                  className={`absolute inset-0 w-full h-full object-cover 
                transition-all duration-700 ease-in-out
                ${i === index ? "opacity-100 scale-100" : "opacity-0 scale-110"}
                group-hover:scale-110`}
                />
              ))}

              {/* Hover dark layer */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition duration-500 z-10" />
            </div>

            {/* CONTENT */}
            <div className="p-4 bg-white/70 backdrop-blur-md">
              {/* Category */}
              <p className="text-xs text-gray-400 mb-1 tracking-wide">
                {product.category?.name}/{product.subCategory?.name}
              </p>

              {/* Title */}
              <p className="font-semibold text-sm truncate text-gray-800 group-hover:text-black transition">
                {product.name}
              </p>

              {/* Price */}
              <div className="flex items-center gap-2 mt-1">
                <span className="text-lg font-bold text-green-600">
                  ₹{product.sellingPrice}
                </span>

                <del className="text-gray-400 text-sm">₹{product.mrpPrice}</del>
              </div>

              {/* Animated underline */}
              <div
                className="h-[2px] w-0 mt-2 
              bg-linear-to-r from-green-400 via-blue-500 to-purple-500
              group-hover:w-full transition-all duration-500"
              />
            </div>
          </div>
        );
      })}
    </section>
  );
};

// MAIN
const ProductCardsWithPagination: React.FC<{
  hideSearch?: boolean;
  search?: string;
  sellerId?: string;
  shopName?: string;
}> = ({ hideSearch, search, sellerId, shopName }) => {
  const { data: products = [], isLoading } = useProductsForUser(
    sellerId ?? "",
    shopName ?? "",
  );
  const location = useLocation();
  const navigate = useNavigate();

  // const [page, setPage] = useState(1);

  const query = new URLSearchParams(location.search);
  const page = parseInt(query.get("page") || "1", 10);

  // ✅ REALTIME FILTER (URL based)
  const filteredProducts = products
    .filter((product: Product) => {
      const queryWord = search?.toLowerCase() ?? "";

      return (
        product.name.toLowerCase().includes(queryWord) ||
        product.category.name.toLowerCase().includes(queryWord) ||
        product.subCategory.name.toLowerCase().includes(queryWord)
      );
    })
    .sort((a: Product, b: Product) => b.sale - a.sale);

  const itemsPerPage = 12;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  if (isLoading) {
    return <ProductSkeletonGrid count={12} />;
  }
  return (
    <>
      {!hideSearch && (
        <div className="ms-auto max-w-12/12 md:max-w-6/12 px-4 md:px-6 lg:px-12 mb-6">
          <div className="md:hidden">
            <div
              onClick={() => navigate("/products")}
              className="hover:border-black flex items-center bg-white border shadow-xl border-gray-400 rounded-xl px-4 py-3 cursor-pointer"
            >
              <FaSearch className="text-black mr-2" />
              <input
                type="text"
                placeholder="Search products..."
                readOnly
                className="w-full outline-none text-sm bg-transparent"
              />
            </div>
          </div>
        </div>
      )}

      {/* ✅ EMPTY STATE */}
      {!isLoading && filteredProducts.length === 0 ? (
        <div className=" min-h-[calc(100vh-400px)] flex flex-col items-center justify-center py-20 text-center">
          <h2 className="text-xl font-semibold text-gray-700">
            No products found 😕
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Try changing your search or filters
          </p>
        </div>
      ) : (
        <>
          {/* GRID */}
          <ProductGrid
            currentPage={page}
            itemsPerPage={itemsPerPage}
            data={filteredProducts}
          />

          {/* PAGINATION */}
          <div className="flex justify-center mt-7 mb-5">
            <Pagination
              page={page}
              count={totalPages}
              renderItem={(item) => (
                <PaginationItem
                  component={Link}
                  to={`/${sellerId}/${shopName}/shop/${item.page === 1 ? "" : `?page=${item.page}`}`}
                  {...item}
                />
              )}
            />
          </div>
        </>
      )}
    </>
  );
};

export default ProductCardsWithPagination;
