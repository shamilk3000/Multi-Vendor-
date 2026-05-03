import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import { FaSearch } from "react-icons/fa";
import type { Product } from "@/types/product";
import { useProducts } from "../../../hooks/user/product/useProducts";
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
                {product.category.name}/{product.subCategory.name}
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
const ProductCardsWithPagination: React.FC<{
  hideSearch?: boolean;
  search?: string;
  sellerId?: string;
  shopName?: string;
}> = ({ hideSearch, search, sellerId,shopName }) => {
  const { data: products = [], isLoading } = useProducts(sellerId,shopName);
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
