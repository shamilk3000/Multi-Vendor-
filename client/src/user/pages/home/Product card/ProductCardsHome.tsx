import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaLayerGroup, FaSearch } from "react-icons/fa";
import type { Product } from "@/types/product";
import { useDispatch } from "react-redux";
import { setSellerId } from "../../../../redux/authSlice";
import { useProductsForUser } from "../../../../hooks/user/product/useProducts";
import ProductSkeletonGrid from "@/user/components/skeletons/productList";

/* ================= PRODUCT GRID (UNCHANGED) ================= */
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

  const intervalsRef = useRef<Record<string, number>>({});
  const timeoutsRef = useRef<number[]>([]);
  const pausedRef = useRef<string[]>([]);

  useEffect(() => {
    pausedRef.current = pausedIds;
  }, [pausedIds]);

  const paginatedProducts = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  useEffect(() => {
    Object.values(intervalsRef.current).forEach(clearInterval);
    timeoutsRef.current.forEach(clearTimeout);

    intervalsRef.current = {};
    timeoutsRef.current = [];

    paginatedProducts.forEach((product, idx) => {
      if (!product.image || product.image.length <= 1) return;

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
      }, idx * 3500);

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
    <section
      className="mx-auto max-w-7xl px-1 sm:px-6 lg:px-12 
      grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 md:gap-6 gap-3"
    >
      {paginatedProducts.map((product) => {
        const index = imageIndex[product._id] ?? 0;

        return (
          <div
            key={product._id}
            onClick={() =>
              navigate(`/${sellerId}/${shopName}/products/${product._id}`)
            }
            onMouseEnter={() => setPausedIds((prev) => [...prev, product._id])}
            onMouseLeave={() =>
              setPausedIds((prev) => prev.filter((id) => id !== product._id))
            }
            className="group cursor-pointer w-full rounded-2xl overflow-hidden 
            bg-linear-to-br from-white to-gray-100 border border-gray-400 shadow-lg 
            hover:shadow-3xl transition-all duration-500 hover:scale-105"
          >
            <div className="relative h-48 sm:h-64 lg:h-72 overflow-hidden">
              {product.discountPercentage > 0 && (
                <span className="absolute top-2 left-2 z-10 bg-red-500 text-white text-xs px-2 py-1 rounded">
                  {product.discountPercentage}% OFF
                </span>
              )}

              {product.image.map((img, i) => (
                <img
                  key={i}
                  src={getImageUrl(img)}
                  alt={product.name}
                  className={`absolute inset-0 w-full h-full object-cover 
                  transition-all duration-700 group-hover:scale-110 
                  ${i === index ? "opacity-100" : "opacity-0"}`}
                />
              ))}
            </div>

            <div className="p-3 bg-white/80 backdrop-blur-md">
              <p className="font-semibold text-sm truncate text-gray-800">
                {product.name}
              </p>

              <p className="text-xs text-gray-600 flex items-center gap-1">
                <FaLayerGroup className="text-gray-500 text-[10px]" />
                {product.category?.name}/{product.subCategory?.name}
              </p>

              <div className="flex items-center gap-2 mt-1">
                <span className="text-lg font-bold text-green-600">
                  &#1583;&#46;&#1573; {product.sellingPrice}
                </span>
                <del className="text-red-600 text-sm">
                  &#1583;&#46;&#1573; {product.mrpPrice}
                </del>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
};

/* ================= MAIN COMPONENT ================= */
const ProductCardsWithPagination: React.FC<{
  sellerId?: string;
  shopName?: string;
  hideSearch?: boolean;
}> = ({ hideSearch, sellerId, shopName }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [openSearch, setOpenSearch] = useState(false);

  const { data: products = [], isLoading } = useProductsForUser(
    sellerId ?? "",
    shopName ?? "",
  );

  useEffect(() => {
    if (sellerId && shopName) {
      dispatch(setSellerId({ sellerId, shopName }));
    }
  }, [sellerId, shopName, dispatch]);

  /* ================= SORT BY SALE ================= */
  const filteredProducts = [...products].sort(
    (a: Product, b: Product) => b.sale - a.sale,
  );

  /* ================= GROUP BY CATEGORY ================= */
  const groupedProducts = filteredProducts.reduce(
    (acc: any, product: Product) => {
      const id = product.category?._id || "uncategorized";

      if (!acc[id]) {
        acc[id] = {
          name: product.category?.name || "Other",
          items: [],
        };
      }

      acc[id].items.push(product);
      return acc;
    },
    {},
  );

  if (isLoading) {
    return <ProductSkeletonGrid count={12} />;
  }

  return (
    <>
      {/* ✅ YOUR ORIGINAL SEARCH */}
      {!hideSearch && (
        <div className="ms-auto max-w-12/12 md:max-w-6/12 px-4 md:px-6 lg:px-12 mb-6 ">
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

      {/* EMPTY */}
      {!isLoading && filteredProducts.length === 0 ? (
        <div className="text-center py-20">
          <h2 className="text-xl font-semibold text-gray-700">
            No products found 😕
          </h2>
        </div>
      ) : (
        <>
          {/* ================= CATEGORY SECTIONS ================= */}
          {Object.entries(groupedProducts).map(([id, group]: any) => (
            <div
              key={id}
              className="mb-8 mx-2 md:mx-5  bg-gray-250 rounded-3xl py-5 border border-gray-300 shadow-xl transition-all duration-500 hover:shadow-2xl "
            >
              {/* CATEGORY TITLE */}
              <div className="mb-4 group ">
                <div className="flex items-center gap-2 ps-10 pb-5 justify-between ">
                  {/* ICON BADGE */}
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-full bg-black group-hover:bg-black transition-all duration-300">
                      <FaLayerGroup className="text-white group-hover:text-white text-lg transition-all duration-300" />
                    </div>

                    {/* TITLE */}
                    <h2 className="text-2xl font-bold text-black group-hover:text-black transition-all duration-300 relative">
                      {group.name}

                      {/* underline animation */}
                      {/* <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-black group-hover:w-full transition-all duration-300"></span> */}
                    </h2>
                  </div>
                  {/* PRODUCT COUNT */}
                  <div className="rounded-full bg-black px-5 py-2 me-5 text-sm font-semibold text-white shadow-md">
                    {group.items.length} Products
                  </div>
                </div>
              </div>

              {/* SHOW ALL PRODUCTS (NO PAGINATION) */}
              <ProductGrid
                sellerId={sellerId}
                shopName={shopName}
                currentPage={1}
                itemsPerPage={group.items.length}
                data={group.items}
              />
            </div>
          ))}
        </>
      )}
    </>
  );
};

export default ProductCardsWithPagination;
