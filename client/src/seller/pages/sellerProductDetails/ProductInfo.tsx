// import { useState } from "react";
import type Product from "./Product";
import { Star } from "lucide-react";
import { FaChartLine, FaEdit, FaTrash, FaUndo } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  ultrateDeleteProduct,
  ultrateRestoreProduct,
} from "../../../hooks/seller/product/ultrateProducts";
import toast from "react-hot-toast";

const ProductInfo = ({ product }: { product: Product }) => {
  const rating = product.ratingAverage;
  const navigate = useNavigate();
  const { mutateAsync: deleteProduct } = ultrateDeleteProduct();
  const { mutateAsync: restoreProduct } = ultrateRestoreProduct();
  // 🔥 delete (SOFT DELETE)
  const handleDelete = async (id: string) => {
    try {
      await toast.promise(
        deleteProduct({ productId: id }),
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
          duration: 3500,
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
        restoreProduct({ productId: id }),
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
          duration: 3500,
        },
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Product Name */}
      <h2
        className="text-2xl md:text-3xl font-semibold tracking-wide uppercase
                   text-black transition-all duration-300
                   hover:tracking-widest hover:text-gray-800"
      >
        {product.name}
      </h2>

      {/* Price Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-3 flex-wrap">
          <span
            className="text-2xl md:text-3xl font-bold text-black
                       relative transition-all duration-300
                       hover:scale-105
                       hover:text-gray-900
                       after:absolute after:inset-0
                       after:blur-xl after:opacity-20
                       after:animate-pulse"
          >
            &#1583;&#46;&#1573; {product.sellingPrice}
          </span>

          <span className="text-sm text-gray-400 line-through">
            &#1583;&#46;&#1573; {product.mrpPrice}
          </span>

          {product.discountPercentage > 0 && (
            <span
              className="text-sm font-semibold text-green-700
                         bg-green-100 px-2 py-1 rounded-md
                         animate-bounce shadow-sm"
            >
              {product.discountPercentage}% OFF
            </span>
          )}
        </div>

        {/* ⭐ Rating – bigger + value */}
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => {
            // FULL STAR
            if (rating >= star) {
              return (
                <Star
                  key={star}
                  size={22}
                  className="fill-yellow-300
                             stroke-gray-400
                             animate-pulse
                             hover:scale-125
                             drop-shadow-[0_0_4px_rgba(250,204,21,0.35)]
                             transition-all"
                />
              );
            }

            // HALF STAR
            if (rating >= star - 0.5) {
              return (
                <span
                  key={star}
                  className="relative inline-block w-[22px] h-[22px]"
                >
                  {/* Outline */}
                  <Star
                    size={22}
                    className="absolute inset-0 stroke-gray-400 text-transparent"
                  />

                  {/* Half fill */}
                  <span className="absolute inset-0 w-1/2 overflow-hidden">
                    <Star
                      size={22}
                      className="fill-yellow-300
                                 stroke-gray-400
                                 animate-pulse
                                 drop-shadow-[0_0_4px_rgba(250,204,21,0.35)]"
                    />
                  </span>
                </span>
              );
            }

            // EMPTY STAR
            return (
              <Star
                key={star}
                size={22}
                className="stroke-gray-400 text-transparent
                           hover:scale-110
                           transition-all"
              />
            );
          })}

          {/* Rating text */}
          <span className="ml-2 text-sm text-gray-600 font-medium">
            {rating.toFixed(1)} / 5
          </span>

          <span className="text-sm text-gray-400">
            ({product.totalRatings})
          </span>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2 mb-6 p-1">
        <p className="text-sm font-bold text-gray-800">Product Details:</p>
        <ul className="space-y-2">
          {product.description?.map((point, idx) => (
            <li
              key={idx}
              className="flex gap-2 text-gray-600
               hover:translate-x-1 hover:text-black
               transition"
            >
              <span className="text-yellow-400 animate-pulse">•</span>
              <span className="max-w-screen">{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* STOCK */}
      <div className="flex flex-row gap-2">
        {/* Stock Status */}
        <div>
          <span
            className={`inline-block px-3 py-1 text-sm font-semibold rounded-full transition-all duration-300 hover:scale-[1.03] 
      ${
        product.stock === 0
          ? "bg-red-100 text-red-600 border border-red-600"
          : product.stock < 10
            ? "bg-yellow-100 text-yellow-600 border border-yellow-600"
            : "bg-green-100 text-green-600 border border-green-600"
      }`}
          >
            {product.stock === 0
              ? "Out of Stock"
              : product.stock < 10
                ? `Low Stock (${product.stock})`
                : `In Stock (${product.stock})`}
          </span>
        </div>

        {/* Sales Info */}
        <div className="flex items-center gap-2 px-3 py-1 bg-green-100 border border-green-600 rounded-full w-fit transition-all duration-300 hover:scale-[1.03]">
          <FaChartLine className="text-green-600 text-sm" />
          <span className="text-sm font-medium text-green-700">
            {product.sale} sold
          </span>
        </div>
      </div>
      <div className="w-full pt-1 flex justify-start">
        {/* ACTIONS */}
        {product.isActive ? (
          <div className="flex gap-2 w-fit">
            <button
              className="
          cursor-pointer h-10 min-w-[110px]
          bg-black text-white rounded-lg
          flex items-center justify-center gap-1.5
          text-sm font-medium px-3
          shadow-sm hover:shadow-md
          transition-all duration-300
          hover:scale-[1.02]
          active:scale-[0.98]
        "
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/seller/edit-product/${product._id}?from=details`);
              }}
            >
              <FaEdit />
              Edit
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(product._id);
              }}
              className="
          cursor-pointer h-10 min-w-[110px]
          bg-red-500 text-white rounded-lg
          flex items-center justify-center gap-1.5
          text-sm font-medium px-3
          shadow-sm hover:shadow-md
          transition-all duration-300
          hover:scale-[1.02]
          active:scale-[0.98]
        "
            >
              <FaTrash />
              Delete
            </button>
          </div>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleRestore(product._id);
            }}
            className="
        cursor-pointer h-10 min-w-[110px]
        bg-green-700 text-white rounded-lg
        flex items-center justify-center gap-1.5
        text-sm font-medium px-3
        shadow-sm hover:shadow-md
        transition-all duration-300
        hover:scale-[1.02]
        active:scale-[0.98]
      "
          >
            <FaUndo />
            Restore
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductInfo;
