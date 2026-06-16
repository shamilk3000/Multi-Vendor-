import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import { FaLayerGroup } from "react-icons/fa";
import type { Product } from "@/types/product";
import { useProductsForUser } from "../../../hooks/user/product/useProducts";
import ProductSkeletonGrid from "@/user/components/skeletons/productList";
import type { ProductFilters } from "./FilterButton";
import { useNavigate } from "react-router-dom";

/* ================= GRID (UNCHANGED UI) ================= */

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

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = data.slice(startIndex, startIndex + itemsPerPage);

  const [pausedIds, setPausedIds] = useState<string[]>([]);
  const BASE_URL = import.meta.env.VITE_SERVER_IMAGE_TARGET;

  const intervalsRef = useRef<Record<string, number>>({});
  const timeoutsRef = useRef<number[]>([]);
  const pausedRef = useRef<string[]>([]);

  useEffect(() => {
    pausedRef.current = pausedIds;
  }, [pausedIds]);

  useEffect(() => {
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
  }, [data, currentPage]);

  const getImageUrl = (img: string) =>
    img.startsWith("http") ? img : `${BASE_URL}${img}`;

  return (
    <section className="md:min-h-[300px] min-h-[400px] ">
      <div className="mx-auto max-w-7xl px-4 lg:px-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 md:gap-6 gap-3">
        {paginatedProducts.map((product) => {
          const index = imageIndex[product._id] ?? 0;

          return (
            <div
              onClick={() =>
                navigate(`/${sellerId}/${shopName}/products/${product._id}`)
              }
              key={product._id}
              onMouseEnter={() =>
                setPausedIds((prev) =>
                  prev.includes(product._id) ? prev : [...prev, product._id],
                )
              }
              onMouseLeave={() =>
                setPausedIds((prev) => prev.filter((id) => id !== product._id))
              }
              className="group cursor-pointer w-full rounded-2xl overflow-hidden bg-linear-to-br from-white via-gray-50 to-gray-100 border border-gray-400 shadow-lg hover:shadow-3xl hover:shadow-blue-200/40 transition-all duration-500 hover:scale-[1.04]"
            >
              {/* IMAGE */}
              <div className="relative h-48 sm:h-60 lg:h-72 overflow-hidden">
                {/* <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent opacity-70 z-10" /> */}

                {product.discountPercentage > 0 && (
                  <span className="absolute top-2 left-2 z-20 bg-red-500/90 backdrop-blur text-white text-xs px-2 py-1 rounded-md shadow">
                    {product.discountPercentage}% OFF
                  </span>
                )}

                {product.image.map((img, i) => (
                  <img
                    key={i}
                    src={getImageUrl(img)}
                    alt={product.name}
                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out ${
                      i === index
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-110"
                    } group-hover:scale-110`}
                  />
                ))}

                {/* <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition duration-500 z-10" /> */}
              </div>

              {/* CONTENT */}
              <div className="p-3 bg-white/80 backdrop-blur-md">
                <p className="font-semibold text-sm truncate">{product.name}</p>
                <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                  <FaLayerGroup className="text-gray-500 text-[10px]" />
                  {product.category?.name}/{product.subCategory?.name}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-lg font-bold text-green-600">
                    &#1583;&#46;&#1573; {product.sellingPrice}
                  </span>

                  <del className=" text-red-600 text-sm">
                    &#1583;&#46;&#1573; {product.mrpPrice}
                  </del>
                </div>
                <div className="h-[2px] w-0 mt-1 bg-linear-to-r from-gray-200 via-gray-500 to-gray-900 group-hover:w-full transition-all duration-500" />{" "}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

/* ================= MAIN PAGE ================= */

const ProductCardsWithPagination: React.FC<{
  hideSearch?: boolean;
  search?: string;
  sellerId?: string;
  shopName?: string;
  filters?: ProductFilters | null; // ✅ NEW
  categoryId?: string;
}> = ({ search, sellerId, shopName, filters, categoryId }) => {
  const { data: products = [], isLoading } = useProductsForUser(
    sellerId ?? "",
    shopName ?? "",
    categoryId ?? "",
  );

  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const page = parseInt(query.get("page") || "1", 10);

  /* ================= FILTER LOGIC ================= */

  const filteredProducts = products.filter((product: Product) => {
    const queryWord = search?.toLowerCase() ?? "";

    const matchSearch =
      product.name.toLowerCase().includes(queryWord) ||
      product.category.name.toLowerCase().includes(queryWord) ||
      product.subCategory.name.toLowerCase().includes(queryWord);

    const matchCategory =
      !filters?.category || product.category._id === filters.category;

    const matchSubCategory =
      !filters?.subCategory || product.subCategory._id === filters.subCategory;

    const matchPrice =
      !filters ||
      (product.sellingPrice >= filters.price[0] &&
        product.sellingPrice <= filters.price[1]);

    return matchSearch && matchCategory && matchSubCategory && matchPrice;
  });

  /* ================= SORT ================= */

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (filters?.sort) {
      switch (filters.sort) {
        case "price_low_high":
          return a.sellingPrice - b.sellingPrice;

        case "price_high_low":
          return b.sellingPrice - a.sellingPrice;

        case "rating":
          return b.ratingAverage - a.ratingAverage;

        case "name_a_z":
          return a.name.localeCompare(b.name);

        case "sales_high_low":
          return b.sale - a.sale;

        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

        default:
          return 0;
      }
    }

    return b.sale - a.sale;
  });

  const itemsPerPage = 12;
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

  if (isLoading) return <ProductSkeletonGrid count={12} />;

  return (
    <>
      {/* EMPTY STATE */}
      {!isLoading && sortedProducts.length === 0 ? (
        <div className="md:min-h-[300px] min-h-[500px] flex flex-col items-center justify-center text-center">
          <h2 className="text-xl font-semibold">No products found 😕</h2>
          <p className="text-sm text-gray-500">
            Try changing filters or search
          </p>
        </div>
      ) : (
        <>
          <ProductGrid
            sellerId={sellerId}
            shopName={shopName}
            currentPage={page}
            itemsPerPage={itemsPerPage}
            data={sortedProducts}
          />

          <div className="flex justify-center mt-7 mb-5">
            <Pagination
              page={page}
              count={totalPages}
              renderItem={(item) => (
                <PaginationItem
                  component={Link}
                  to={`/${sellerId}/${shopName}/shop/${
                    item.page === 1 ? "" : `?page=${item.page}`
                  }`}
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
