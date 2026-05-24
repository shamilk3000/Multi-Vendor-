import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import { FaLayerGroup, FaSearch } from "react-icons/fa";
import type { Product } from "@/types/product";
import { useDispatch } from "react-redux";
import { setSellerId } from "../../../../redux/authSlice";
// GRID (UNCHANGED)
const ProductGrid: React.FC<{
  currentPage: number;
  itemsPerPage: number;
  data: Product[];
  sellerId?: string;
  shopName?: string;
}> = ({ currentPage, itemsPerPage, data, shopName, sellerId }) => {
  const [imageIndex, setImageIndex] = useState<Record<string, number>>(
    data.reduce((acc, p) => ({ ...acc, [p._id]: 0 }), {}),
  );
  const navigate = useNavigate();
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

      const delay = idx * 3500;

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
        }, 5000);
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

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = data.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 
  grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 md:gap-6 gap-3"
    >
      {paginatedProducts.map((product) => {
        const index = imageIndex[product._id] ?? 0;

        return (
          <div
            onClick={() =>
              navigate(`/${sellerId}/${shopName}/products/${product._id}`)
            }
            key={product._id}
            onMouseEnter={() => setPausedIds((prev) => [...prev, product._id])}
            onMouseLeave={() =>
              setPausedIds((prev) => prev.filter((id) => id !== product._id))
            }
            className="group cursor-pointer w-full rounded-2xl overflow-hidden 
          bg-linear-to-br from-white to-gray-100 border border-gray-400 shadow-lg 
          hover:shadow-3xl transition-all duration-500 hover:scale-105"
          >
            {/* IMAGE */}
            <div className="relative h-48 sm:h-64 lg:h-72 overflow-hidden">
              {/* Gradient overlay */}
              {/* <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-60 z-10" /> */}

              {/* Discount badge */}
              {product.discountPercentage > 0 && (
                <span className="absolute top-2 left-2 z-10 bg-red-500 text-white text-xs px-2 py-1 rounded">
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
                transition-all duration-700 group-hover:scale-110 ${
                  i === index ? "opacity-100" : "opacity-0"
                }`}
                />
              ))}

              {/* Hover overlay */}
              {/* <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition duration-500 z-10" /> */}
            </div>

            {/* CONTENT */}
            <div className="p-3 bg-white/80 backdrop-blur-md">
              
              {/* Title */}
              <p className="font-semibold text-sm truncate text-gray-800 group-hover:text-black transition">
                {product.name}
              </p>
              
{/* Category */}
              <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                <FaLayerGroup className="text-gray-500 text-[10px]" />
                {product.category?.name}/{product.subCategory?.name}
              </p>

              {/* Price */}
              <div className="flex items-center gap-2 mt-1">
                <span className="text-lg font-bold text-green-600">
                  ₹{product.sellingPrice}
                </span>

                <del className=" text-red-600 text-sm">₹{product.mrpPrice}</del>
              </div>

              {/* Bottom animation line */}
              <div className="h-[2px] w-0 mt-1 bg-linear-to-r from-gray-200 via-gray-500 to-gray-900 group-hover:w-full transition-all duration-500" />
            </div>
          </div>
        );
      })}
    </section>
  );
};

// MAIN
import { useProductsForUser } from "../../../../hooks/user/product/useProducts";
import ProductSkeletonGrid from "@/user/components/skeletons/productList";

const ProductCardsWithPagination: React.FC<{
  sellerId?: string;
  shopName?: string;
  hideSearch?: boolean;
  search?: string;
}> = ({ hideSearch, sellerId, shopName }) => {
  const dispatch = useDispatch();
  const { data: products = [], isLoading } = useProductsForUser(
    sellerId ?? "",
    shopName ?? "",
  );
useEffect(() => {

  if (sellerId && shopName) {
    dispatch(setSellerId({ sellerId, shopName }));
  }
}, [sellerId, shopName, dispatch]);
  const location = useLocation();
  const navigate = useNavigate();
  const [openSearch, setOpenSearch] = useState(false);

  const filteredProducts = products.sort(
    (a: Product, b: Product) => b.sale - a.sale,
  ); // 👈 highest sales first

  const query = new URLSearchParams(location.search);
  const page = parseInt(query.get("page") || "1", 10);

  const itemsPerPage = 12;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  if (isLoading) {
    return <ProductSkeletonGrid count={12} />;
  }
  return (
    <>
      {/* ✅ YOUR ORIGINAL SEARCH */}
      {!hideSearch && (
        <div className="ms-auto max-w-12/12 md:max-w-6/12 px-4 md:px-6 lg:px-12 mb-6">
          <div className="md:hidden">
            <div
              onClick={() => navigate(`/${sellerId}/${shopName}/shop?focus=1`)}
              className="hover:border-black flex items-center bg-white border shadow-xl border-gray-400 rounded-xl px-4 py-3 cursor-pointer"
            >
              <FaSearch className="text-black mr-2" />
              <input
                type="text"
                placeholder="Search products..."
                onFocus={() =>
                  navigate(`/${sellerId}/${shopName}/shop?focus=1`)
                }
                readOnly
                className="w-full outline-none text-sm bg-transparent cursor-pointer"
              />
            </div>
          </div>

          <div className="hidden md:flex justify-end">
            {!openSearch && (
              <button
                onClick={() =>
                  navigate(`/${sellerId}/${shopName}/shop?focus=1`)
                }
                className="cursor-pointer p-3 rounded-full border border-gray-400 text-white bg-black"
              >
                <FaSearch />
              </button>
            )}

            {openSearch && (
              <div className="hover:border-black flex items-center bg-white border border-gray-400 rounded-xl px-4 py-3 ml-2 w-72">
                <FaSearch className="text-black mr-2" />
                <input
                  type="text"
                  placeholder="Search products..."
                  readOnly
                  onClick={() =>
                    navigate(`/${sellerId}/${shopName}/shop?focus=1`)
                  }
                  className="w-full outline-none text-sm bg-transparent cursor-pointer"
                />
                <button
                  onClick={() => setOpenSearch(false)}
                  className="cursor-pointer ml-2 text-gray-500"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ✅ EMPTY STATE */}
      {!isLoading && filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
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
            sellerId={sellerId}
            shopName={shopName}
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
                  to={`/${sellerId}/${shopName}/${item.page === 1 ? "" : `?page=${item.page}`}`}
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
