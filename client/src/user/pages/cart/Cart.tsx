import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useCart } from "../../../hooks/user/cart/useCart";
import {
  FaTrash,
  FaPlus,
  FaMinus,
  FaShoppingCart,
  FaBoxOpen,
  FaCreditCard,
} from "react-icons/fa";
import Footer from "../footer/Footer";
import Navbar from "../navbar/Navbar";
import {
  ultrateQuantity,
  ultrateDeleteItem,
} from "../../../hooks/user/cart/ultrateCart";
import CartPageSkeleton from "@/user/components/skeletons/cart";

const Cart: React.FC = () => {
  const { mutateAsync: changeQuantity } = ultrateQuantity();
  const { mutateAsync: deleteItem } = ultrateDeleteItem();
  const { sellerId, shopName } = useParams();
  const { data: cart = [], isLoading } = useCart();
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_SERVER_IMAGE_TARGET;

  const increaseQty = async (id: string) => {
    try {
      await toast.promise(
        changeQuantity({
          cartItemId: id,
          action: "inc",
        }),
        {
          loading: "Increasing quantity...",
          success: "Product quantity increased",
          error: (err) =>
            err.response?.data?.message || "Could not increase quantity",
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

  const decreaseQty = async (id: string) => {
    try {
      await toast.promise(
        changeQuantity({
          cartItemId: id,
          action: "dec",
        }),
        {
          loading: "Decreasing quantity...",
          success: "Product quantity decreased",
          error: (err) =>
            err.response?.data?.message || "Could not decrease quantity",
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

  const removeItem = async (id: string) => {
    try {
      await toast.promise(
        deleteItem({
          cartItemId: id,
        }),
        {
          loading: "Removing product from your cart...",
          success: "Product removed successfully 🗑️",
          error: (err) =>
            err.response?.data?.message ||
            "Failed to remove product. Try again later",
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

  if (isLoading) {
    return <CartPageSkeleton />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 p-0">
      <Navbar shopName={shopName!} sellerId={sellerId!} />

      <div className="min-h-[calc(100vh-120px)] md:min-h-[calc(100vh-64px)]  bg-gray-50 p-4 md:p-8">
        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl md:text-3xl font-bold mb-6 flex items-center gap-2 transition-transform duration-300 hover:scale-101 text-black"
        >
          <FaShoppingCart />
          Your Cart
        </motion.h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* CART ITEMS */}
          <div className="md:col-span-2 space-y-5">
            <AnimatePresence>
              {/* EMPTY CART MESSAGE */}
              {cart.items.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white border rounded-xl p-10 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-xl transition group"
                >
                  <FaShoppingCart className="text-5xl text-gray-800 mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1 group-hover:text-black" />

                  <p className="text-gray-800 font-medium transition group-hover:text-black">
                    No items in your cart
                  </p>
                </motion.div>
              )}

              {cart.items.map((item: any) => (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white border rounded-xl p-4 md:p-5 shadow-sm hover:shadow-lg transition group"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* LEFT: Image + ALL DETAILS */}
                    <div
                      onClick={() =>
                        navigate(
                          `/${sellerId}/${shopName}/products/${item.product._id}`,
                        )
                      }
                      className="flex items-center gap-3 flex-1 cursor-pointer "
                    >
                      <motion.img
                        whileHover={{ scale: 1.05 }}
                        src={`${BASE_URL}${item.product.image[0]}`}
                        alt={item.product.name}
                        className="w-16 h-16 md:w-20 md:h-20 rounded-lg object-cover"
                      />

                      <div className="flex flex-col">
                        <h2 className="font-semibold text-sm md:text-base">
                          {item.product.name}
                        </h2>

                        <p className="text-green-700 text-sm">
                          ${item.product.sellingPrice}
                        </p>

                        <p className="text-sm font-medium text-gray-800">
                          Total: $
                          {(item.product.sellingPrice * item.quantity).toFixed(
                            2,
                          )}
                        </p>
                      </div>
                    </div>

                    {/* RIGHT: Quantity + Delete */}
                    <div className="flex items-center justify-between md:justify-end gap-4">
                      {/* Quantity */}
                      <div className="flex items-center bg-gray-100 rounded-full px-2 py-1 shadow-inner">
                        <motion.button
                          whileTap={{ scale: 0.75 }}
                          whileHover={{ scale: 1.1 }}
                          onClick={() => decreaseQty(item._id)}
                          className=" cursor-pointer w-8 h-8 flex items-center justify-center rounded-full hover:bg-black hover:text-white transition"
                        >
                          <FaMinus size={11} />
                        </motion.button>

                        <motion.span
                          key={item.quantity}
                          initial={{ scale: 0.7 }}
                          animate={{ scale: 1 }}
                          className=" cursor-pointer w-8 text-center font-semibold text-sm text-gray-800"
                        >
                          {item.quantity}
                        </motion.span>

                        <motion.button
                          whileTap={{ scale: 0.75 }}
                          whileHover={{ scale: 1.1 }}
                          onClick={() => increaseQty(item._id)}
                          className=" cursor-pointer w-8 h-8 flex items-center justify-center rounded-full hover:bg-black hover:text-white transition"
                        >
                          <FaPlus size={11} />
                        </motion.button>
                      </div>

                      {/* Delete */}
                      <motion.button
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.8 }}
                        onClick={() => removeItem(item._id)}
                        className="text-red-500 hover:text-red-700 cursor-pointer "
                      >
                        <FaTrash />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* ORDER SUMMARY */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white border rounded-xl p-6 shadow-md hover:shadow-2xl transition h-fit"
          >
            <h2 className="group text-lg md:text-xl font-semibold mb-4 flex items-center gap-2 transition-all duration-300 hover:scale-[1.03] hover:text-gray-700">
              <FaBoxOpen className="text-black mt-1 transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-0.5 group-hover:text-gray-600" />
              <span className="transition-all duration-300 group-hover:tracking-wide">
                Order Summary
              </span>
            </h2>

            <div className="space-y-3 mb-4">
              {cart.items.map((item: any) => (
                <div
                  key={item._id}
                  className="flex justify-between text-sm transition-transform duration-300 hover:scale-[1.02] hover:text-black"
                >
                  <span>
                    {item.product.name} x {item.quantity}
                  </span>

                  <span>
                    ${(item.product.sellingPrice * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between mb-3 transition-transform duration-300 hover:scale-[1.03] hover:text-gray-800">
              <span>Subtotal</span>
              <span>${cart.totalSellingPrice.toFixed(2)}</span>
            </div>

            <div className="flex justify-between mb-3 transition-transform duration-300 hover:scale-[1.03] hover:text-gray-800">
              <span>Shipping</span>
              <span className="text-green-600">Free</span>
            </div>

            <div className="border-t pt-4 flex justify-between font-bold text-lg transition-transform duration-300 hover:scale-[1.03] hover:text-gray-900">
              <span>Total</span>
              <span>${cart.totalSellingPrice.toFixed(2)}</span>
            </div>
            <motion.button
              disabled={cart.items.length === 0}
              onClick={() => navigate(`/${sellerId}/${shopName}/checkout`)}
              whileHover={
                cart.items.length > 0
                  ? {
                      scale: 1.03,
                      boxShadow: "0px 12px 30px rgba(0,0,0,0.25)",
                    }
                  : {}
              }
              whileTap={cart.items.length > 0 ? { scale: 0.95 } : {}}
              className={`flex flex-row justify-center gap-2 w-full mt-5 py-3 rounded-lg transition
    ${
      cart.items.length === 0
        ? "bg-gray-400 cursor-not-allowed text-gray-200"
        : "bg-black text-white hover:bg-gray-900 cursor-pointer"
    }`}
            >
              <div className="my-auto">
                <FaCreditCard className="inline mr-2" />
              </div>
              Checkout
            </motion.button>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
