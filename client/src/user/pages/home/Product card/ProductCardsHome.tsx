import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import { FaSearch } from "react-icons/fa";
import type { Product } from "@/types/product";

// GRID (UNCHANGED)
const ProductGrid: React.FC<{
  currentPage: number;
  itemsPerPage: number;
  data: Product[];
}> = ({ currentPage, itemsPerPage, data }) => {
  const [imageIndex, setImageIndex] = useState<Record<string, number>>(
    data.reduce((acc, p) => ({ ...acc, [p._id]: 0 }), {}),
  );
  const [pausedIds, setPausedIds] = useState<string[]>([]);
  const BASE_URL = import.meta.env.VITE_SERVER_IMAGE_TARGET;

  useEffect(() => {
    const intervals = data.map((product, idx) => {
      const delay = idx * 600;
      return setTimeout(() => {
        const interval = setInterval(() => {
          setImageIndex((prev) => {
            if (pausedIds.includes(product._id)) return prev;

            const currentIndex = prev[product._id] ?? 0;
            const nextIndex = (currentIndex + 1) % product.image.length;

            return {
              ...prev,
              [product._id]: nextIndex,
            };
          });
        }, 4000);
        (product as any).intervalId = interval;
      }, delay);
    });

    return () => {
      intervals.forEach((timeoutId, idx) => {
        clearTimeout(timeoutId);
        const interval = (data[idx] as any).intervalId;
        if (interval) clearInterval(interval);
      });
    };
  }, [pausedIds, data]);
  const getImageUrl = (img: string) =>
    img.startsWith("http") ? img : `${BASE_URL}${img}`;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = data.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
      {paginatedProducts.map((product) => {
        const index = imageIndex[product._id] ?? 0;

        return (
          <div
            key={product._id}
            onMouseEnter={() => setPausedIds((prev) => [...prev, product._id])}
            onMouseLeave={() =>
              setPausedIds((prev) => prev.filter((id) => id !== product._id))
            }
            className="cursor-pointer w-40 sm:w-60 lg:w-72 bg-white rounded-xl shadow-md hover:shadow-xl transition-transform duration-300 hover:scale-105"
          >
            <div className="relative h-48 sm:h-64 lg:h-80 overflow-hidden rounded-t-xl">
              {product.discountPercentage > 0 && (
                <span className="absolute top-2 left-2 z-10 bg-red-500 text-white text-xs px-2 py-1 rounded">
                  {product.discountPercentage}% OFF
                </span>
              )}
              {product.image.map((img, i) => (
                <img
                  key={i}
                  src={getImageUrl(img)}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                    i === index ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))}
            </div>
            <div className="p-3">
              <p className="text-xs text-gray-400">
                {product.category.name}/{product.subCategory.name}{" "}
              </p>
              <p className="font-bold text-sm truncate">{product.name}</p>
              <div className="flex gap-2">
                <span>${product.sellingPrice}</span>
                <del className="text-gray-400">${product.mrpPrice}</del>
              </div>
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
const { data: products = [], isLoading } = useProductsForUser(
  sellerId ?? "",
  shopName ?? ""
);
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
