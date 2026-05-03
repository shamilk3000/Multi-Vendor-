import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import SellerFilterButton, {
  type ProductFilters,
} from "../../components/filter/SellerFilterButton";
import { useProducts } from "../../../hooks/seller/product/useProducts";
import type { Product } from "@/types/product";
import { useNavigate } from "react-router-dom";
import ProductListSkeleton from "@/seller/components/skeletons/productSkeleton";
import { ultrateDeleteProduct , ultrateRestoreProduct} from "../../../hooks/seller/product/ultrateProducts";

import {
  FaTrash,
  FaBoxOpen,
  FaEdit,
  FaRupeeSign,
  FaLayerGroup,
  FaStar,
  FaChartLine,
  FaUndo,
  FaSearch,
  FaPlus,
} from "react-icons/fa";
import { Pagination } from "@mui/material";


const SellerProducts = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All"); // All | Active | Deleted
  const { data: products = [], isLoading } = useProducts();
  const BASE_URL = import.meta.env.VITE_SERVER_IMAGE_TARGET;
  const navigate = useNavigate();
  const { mutateAsync: deleteProduct } = ultrateDeleteProduct();
  const { mutateAsync: restoreProduct } = ultrateRestoreProduct();

  const [advancedFilters, setAdvancedFilters] = useState<ProductFilters | null>(
    null,
  );
  const [page, setPage] = useState(1);
  useEffect(() => {
    setPage(1);
  }, [search, filter, advancedFilters]);

 

 
  // 🔥 delete (SOFT DELETE)
  const handleDelete = async ( id: string ) => {
    try {
      await toast.promise(
        deleteProduct({ productId:id}),
        {
        loading: "Deleting product...",
        success: "Product deleted 🗑️",
        error: "Delete failed",
      },
      {
        style: {
          background: "#111",
          color: "#fff",
          border: "1px solid #333",
        },
      },
      );
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 RESTORE (ADDED)
  const handleRestore = async (id: string) => {
    try {
      await toast.promise(
        restoreProduct({ productId:id}),
        {
        loading: "Restoring product...",
        success: "Product restored ♻️",
        error: (err) => err.response?.data?.message || "Restore failed",
      },
      {
        style: {
          background: "#111",
          color: "#fff",
          border: "1px solid #333",
        },
      },
      );
    } catch (err) {
      console.error(err);
    }
  };


  // ✅ base filtered (same logic you already have BEFORE filter buttons)
  const baseFiltered = products.filter((p :Product) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.name.toLowerCase().includes(search.toLowerCase()) ||
      p.subCategory.name.toLowerCase().includes(search.toLowerCase());

    if (!advancedFilters) return matchSearch;

    const { category, subCategory, price, stock } = advancedFilters;

    const matchCategory = !category || p.category._id === category;
    const matchSubCategory = !subCategory || p.subCategory._id === subCategory;

    const matchPrice = p.sellingPrice >= price[0] && p.sellingPrice <= price[1];

    const matchStock =
      !stock ||
      (stock === "out" && p.stock === 0) ||
      (stock === "low" && p.stock > 0 && p.stock < 10) ||
      (stock === "in" && p.stock >= 10);

    return (
      matchSearch &&
      matchCategory &&
      matchSubCategory &&
      matchPrice &&
      matchStock
    );
  });

  // ✅ now apply status filter
  const totalCount = baseFiltered.length;

  const activeCount = baseFiltered.filter((p:Product) => p.isActive).length;

  const deletedCount = baseFiltered.filter((p:Product) => !p.isActive).length;

  // ✅ your actual displayed products (IMPORTANT)
  const filteredProducts = baseFiltered.filter((p:Product) => {
    if (filter === "All") return true;
    if (filter === "Active") return p.isActive;
    if (filter === "Deleted") return !p.isActive;
    return true;
  });
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    // ✅ If user selected a sort → use that
    if (advancedFilters?.sort) {
      switch (advancedFilters.sort) {
        case "price_low_high":
          return a.sellingPrice - b.sellingPrice;

        case "price_high_low":
          return b.sellingPrice - a.sellingPrice;

        case "rating":
          return b.ratingAverage - a.ratingAverage;

        case "name_a_z":
          return a.name.localeCompare(b.name);

        case "stock_low_high":
          return a.stock - b.stock;

        case "stock_high_low":
          return b.stock - a.stock;

        case "sales_high_low":
          return b.sale - a.sale;

        case "date_new_old":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

        default:
          return 0;
      }
    }

    // ✅ DEFAULT SORT (when no filter selected)
    return b.sale - a.sale; // 🔥 highest sales first
  });

  // ✅ PAGINATION LOGIC

  const itemsPerPage = 12;

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage) || 1;

  const paginatedProducts = sortedProducts.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );
  
  if (isLoading) return <ProductListSkeleton />;
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-[calc(100vh-120px)] md:min-h-[calc(110vh)] bg-gray-50 p-4 md:p-6"
    >
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl md:ms-0 ms-12 md:text-2xl font-bold flex items-center gap-2 transition-all duration-300 hover:scale-[1.03] ">
          <FaBoxOpen /> Product List
        </h1>

        <div className="z-1 ">
          <SellerFilterButton onApply={setAdvancedFilters} />{" "}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3 mb-3">
        {/* 🔍 SEARCH */}
        <div className="relative w-full md:flex-1 transition-all duration-300 hover:scale-[1.01]">
          <FaSearch className="absolute left-3 top-3 text-gray-700" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full  pl-9 p-2 text-sm rounded-lg focus:ring-2 focus:ring-black border border-gray-500"
          />
        </div>

        {/* 🎯 FILTER */}
        <div className="flex gap-2 ">
          {["All", "Active", "Deleted"].map((f) => {
            const count =
              f === "All"
                ? totalCount
                : f === "Active"
                  ? activeCount
                  : deletedCount;

            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-2 rounded-lg text-sm border border-black transition ${
                  filter === f
                    ? "bg-black text-white  cursor-pointer"
                    : "bg-white text-black  hover:bg-black hover:text-white  cursor-pointer"
                }`}
              >
                {f} - {count}
              </button>
            );
          })}
        </div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {paginatedProducts.map((product) => {
          const discount = Math.round(
            ((product.mrpPrice - product.sellingPrice) / product.mrpPrice) *
              100,
          );

          return (
            <motion.div
              key={product._id}
              whileHover={product.isActive ? { scale: 1.03 } : {}}
              onClick={() => navigate(`/seller/products/${product._id}`)}
              className={` cursor-pointer border rounded-xl p-3 shadow-sm transition ${
                product.isActive
                  ? "bg-white hover:shadow-lg"
                  : "bg-red-100 border-red-400 opacity-80"
              }`}
            >
              {/* IMAGE */}
              <img
                src={`${BASE_URL}${product.image[0]}`}
                alt={product.name}
                className="w-full h-60 object-cover rounded-lg mb-3 transition-all duration-300 hover:scale-[1.03]"
              />

              {/* NAME */}
              <h2 className="font-semibold text-lg mb-1 flex items-center gap-1 transition-all duration-300 hover:scale-[1.03]">
                {product.name}
                {!product.isActive && (
                  <span className="text-xs text-red-500">(Deleted)</span>
                )}
              </h2>

              {/* CATEGORY */}
              <p className="text-xs text-gray-500 flex items-center gap-1 mb-2 transition-all duration-300 hover:scale-[1.03]">
                <FaLayerGroup /> {product.category.name} / {product.subCategory.name}
              </p>

              {/* PRICE */}
              <div className="flex justify-between">
                <div className="flex items-center gap-2 mb-0">
                  <span className="font-bold text-lg flex items-center gap-1 transition-all duration-300 hover:scale-[1.07]">
                    <FaRupeeSign /> {product.sellingPrice}
                  </span>
                  <span className="line-through text-green-600 text-sm transition-all duration-300 hover:scale-[1.07]">
                    {product.mrpPrice}
                  </span>
                  <span className="text-red-600 text-sm transition-all duration-300 hover:scale-[1.07]">
                    {discount}% OFF
                  </span>
                </div>
                <p className="text-xs text-gray-500 flex items-center gap-1 mb-2 transition-all duration-300 hover:scale-[1.03]">
                  <FaStar className="text-yellow-600 mb-0.5 md:mb-0" />{" "}
                  {product.ratingAverage} /10
                </p>
              </div>

              {/* STOCK */}
              <div className="flex justify-between">
                <p
                  className={`text-sm mb-3 transition-all duration-300 hover:scale-[1.03] ${
                    product.stock === 0
                      ? "text-red-500"
                      : product.stock < 10
                        ? "text-yellow-500"
                        : "text-green-600"
                  }`}
                >
                  {product.stock === 0
                    ? "Out of Stock"
                    : product.stock < 10
                      ? `Low Stock (${product.stock})`
                      : `In Stock (${product.stock})`}
                </p>

                <p className="text-xs text-gray-500 flex items-center gap-1 transition-all duration-300 hover:scale-[1.07]">
                  <FaChartLine className="text-green-500 mb-0.5 md:mb-0" />
                  {product.sale} sold
                </p>
              </div>

              {/* ACTIONS */}
              {product.isActive ? (
                <div className="flex gap-2">
                  <button
                    className=" cursor-pointer flex-1 bg-black text-white py-1.5 rounded-lg flex items-center justify-center gap-2 text-sm transition-all duration-300 hover:scale-[1.03]"
                    onClick={(e) => {
                      e.stopPropagation(); // 🛑 STOP parent click
                      navigate(`/seller/edit-product/${product._id}`);
                    }}
                  >
                    <FaEdit /> Edit
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // 🛑 STOP parent click
                      handleDelete(product._id);
                    }}
                    className=" cursor-pointer flex-1 bg-red-500 text-white py-1.5 rounded-lg flex items-center justify-center gap-2 text-sm transition-all duration-300 hover:scale-[1.03]"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // 🛑 STOP parent click
                    handleRestore(product._id);
                  }}
                  className=" cursor-pointer w-full bg-green-700 text-white py-1.5 rounded-lg flex items-center justify-center gap-2 text-sm transition-all duration-300 hover:scale-[1.03]"
                >
                  <FaUndo /> Restore
                </button>
              )}
            </motion.div>
          );
{/* ✅ PAGINATION UI */}
      <div className="flex justify-center mt-7">
        <Pagination
          page={page}
          count={totalPages}
          onChange={(_, value) => setPage(value)}
        />
      </div>
        })}
      </div>

      {/* EMPTY */}
      {products.length === 0 && (
         <div className="flex flex-col items-center justify-center border border-dashed border-gray-400 rounded-xl p-8 bg-white text-center">
            {/* ICON */}
            <div className="bg-gray-100 p-4 rounded-full mb-4">
              <FaLayerGroup className="text-2xl text-gray-600" />
            </div>

            {/* TITLE */}
            <h2 className="text-lg font-semibold mb-1">No Products Found</h2>

            {/* SUBTEXT */}
            <p className="text-sm text-gray-500 mb-4">
              Looks like you haven’t added any products yet.
            </p>

            {/* BUTTON */}
            <button
                    onClick={() =>navigate("/seller/add-product") }
                    className=" cursor-pointer bg-black text-white hover:bg-white hover:text-black hover:ring hover:ring-black px-2 text-sm md:px-4 py-2 rounded-lg flex items-center gap-2 hover:scale-[1.03] transition"
                  >
                    <FaPlus /> Add Product
                  </button>
          </div>
      )}

      

     
    </motion.div>
  );
};

export default SellerProducts;
