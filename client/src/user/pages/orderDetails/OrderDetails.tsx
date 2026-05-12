import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";


import {
  //   FaArrowLeft,
  FaCheck,
  FaBox,
  FaShippingFast,
  FaHome,
  FaImages,
  FaTimes,
  FaCommentDots,
  FaClipboardList,
  FaMapMarkerAlt,
  FaCity,
  FaGlobe,
  FaPhone,
  FaUser,
  FaCalendarAlt,
  FaHashtag,
  FaInfoCircle,
} from "react-icons/fa";

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;

  customImages?: string[];
  customMessage?: string;
}

interface Address {
  name: string;
  phone: string;
  street: string;
  city: string;
  country: string;
  zip: string;
}

interface Order {
  id: string;
  date: string;
  status: string;
  products: Product[];
  address: Address;
}

const OrderDetails: React.FC = () => {
  const { id } = useParams();
    const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const order: Order = {
    id: id || "ORD12345",
    date: "2026-03-01",
    status: "Shipped",
    address: {
      name: "John Doe",
      phone: "+1 555 234 8899",
      street: "221B Baker Street",
      city: "London",
      country: "United Kingdom",
      zip: "NW16XE",
    },
    products: [
      {
        id: "1",
        name: "Wireless Mouse",
        price: 25,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200",
        customImages: [
          "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200",
          "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200",
          "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200",
          "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200",
        ],
        customMessage: "Happy Birthday! 🎉",
      },
      {
        id: "2",
        name: "Mechanical Keyboard",
        price: 80,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200",
        customMessage: "Happy Birthday! 🎉",
      },
      {
        id: "3",
        name: "Gaming Headset",
        price: 60,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=200",
        customImages: [
          "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200",
          "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200",
          "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200",
          "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200",
        ],
      },
    ],
  };

  const steps = [
    { label: "Order Placed", icon: <FaCheck /> },
    { label: "Confirmed", icon: <FaBox /> },
    { label: "Shipped", icon: <FaShippingFast /> },
    { label: "Delivered", icon: <FaHome /> },
  ];

  const currentStep = steps.findIndex((step) => step.label === order.status);

  const total = order.products.reduce(
    (sum, p) => sum + p.price * p.quantity,
    0,
  );

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-6">
      <div className="mb-6">
        {/* PAGE TITLE */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl md:text-2xl font-semibold mt-1.5 ms-11 md:mt-0 md:ms-0 flex items-center gap-2 group hover:animate-[wave_0.5s_ease-in-out]"
        >
          <FaClipboardList className="text-black" />
          Order Details
        </motion.h1>
      </div>

      {/* ORDER TRACKING */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        className="bg-white border rounded-2xl p-5 md:p-6 mb-6 shadow-sm group  hover:shadow-lg transition "
      >
        {/* TITLE */}
        <h2 className="font-semibold mb-4 flex items-center gap-1">
          <FaMapMarkerAlt
            className="text-black group-hover:animate-[wave_0.5s_ease-in-out]"
            style={{ animationDelay: "0ms" }}
          />
          <span
            className="group-hover:animate-[wave_0.5s_ease-in-out]"
            style={{ animationDelay: "80ms" }}
          >
            Track Order
          </span>
        </h2>

        {/* STEPS */}
        <div className="flex justify-between items-center relative">
          {steps.map((step, index) => {
            const active = index <= currentStep;

            return (
              <motion.div
                key={index}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.2 }}
                className="flex-1 flex flex-col items-center relative"
              >
                {/* LINE */}
                {index !== steps.length - 1 && (
                  <div
                    className={`absolute top-5 left-1/2 w-full h-0.5 z-0
              ${index < currentStep ? "bg-black" : "bg-gray-300"}`}
                  />
                )}

                {/* ICON */}
                <div
                  className={`w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full text-sm z-10 transition
            ${active ? "bg-black text-white" : "bg-gray-200 text-gray-500"}
            group-hover:animate-[wave_0.5s_ease-in-out]
            `}
                  style={{ animationDelay: `${index * 120}ms` }}
                >
                  {step.icon}
                </div>

                {/* LABEL */}
                <p
                  className="text-[10px] md:text-xs mt-2 text-center font-medium
            group-hover:animate-[wave_0.5s_ease-in-out]"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {step.label}
                </p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* ADDRESS + ORDER INFO */}
      <div className="grid gap-5 md:grid-cols-2 mb-6">
        {/* ORDER INFO */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          className="bg-white border rounded-2xl p-5 shadow-sm group hover:shadow-lg transition "
        >
          {/* TITLE */}
          <h2 className="font-bold mb-3 flex items-center gap-2">
            <FaInfoCircle
              className="text-black group-hover:animate-[wave_0.5s_ease-in-out]"
              style={{ animationDelay: "0ms" }}
            />
            <span
              className="group-hover:animate-[wave_0.5s_ease-in-out]"
              style={{ animationDelay: "80ms" }}
            >
              Order Info :
            </span>
          </h2>

          {/* CONTENT */}
          <div className="text-sm text-black space-y-1 ms-1 font-medium">
            <p className="flex items-center gap-2">
              <FaHashtag
                className="text-black group-hover:animate-[wave_0.5s_ease-in-out]"
                style={{ animationDelay: "120ms" }}
              />
              <span
                className="group-hover:animate-[wave_0.5s_ease-in-out]"
                style={{ animationDelay: "160ms" }}
              >
                Order ID:
              </span>
              <span
                className="group-hover:animate-[wave_0.5s_ease-in-out]"
                style={{ animationDelay: "200ms" }}
              >
                {order.id}
              </span>
            </p>

            <p className="flex items-center gap-2">
              <FaCalendarAlt
                className="text-black group-hover:animate-[wave_0.5s_ease-in-out]"
                style={{ animationDelay: "240ms" }}
              />
              <span
                className="group-hover:animate-[wave_0.5s_ease-in-out]"
                style={{ animationDelay: "280ms" }}
              >
                Order Date:
              </span>
              <span
                className="group-hover:animate-[wave_0.5s_ease-in-out]"
                style={{ animationDelay: "320ms" }}
              >
                {formatDate(order.date)}
              </span>
            </p>

            <p className="flex items-center gap-2">
              <FaInfoCircle
                className="text-black group-hover:animate-[wave_0.5s_ease-in-out]"
                style={{ animationDelay: "360ms" }}
              />
              <span
                className="group-hover:animate-[wave_0.5s_ease-in-out]"
                style={{ animationDelay: "400ms" }}
              >
                Status:
              </span>
              <span
                className="group-hover:animate-[wave_0.5s_ease-in-out]"
                style={{ animationDelay: "440ms" }}
              >
                {order.status}
              </span>
            </p>
          </div>
        </motion.div>

        {/* ADDRESS */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          className="bg-white border rounded-2xl p-5 shadow-sm group hover:shadow-lg transition "
        >
          {/* TITLE */}
          <h2 className="font-bold mb-3 flex items-center gap-2">
            <FaHome
              className="text-black group-hover:animate-[wave_0.5s_ease-in-out]"
              style={{ animationDelay: "0ms" }}
            />
            <span
              className="group-hover:animate-[wave_0.5s_ease-in-out]"
              style={{ animationDelay: "80ms" }}
            >
              Shipping Address :
            </span>
          </h2>

          {/* CONTENT */}
          <div className="text-sm space-y-1 ms-1 font-medium text-black">
            <p className="flex items-center gap-2">
              <FaUser
                className="text-black group-hover:animate-[wave_0.5s_ease-in-out]"
                style={{ animationDelay: "120ms" }}
              />
              <span
                className="group-hover:animate-[wave_0.5s_ease-in-out]"
                style={{ animationDelay: "160ms" }}
              >
                {order.address.name}
              </span>
            </p>

            <p className="flex items-center gap-2">
              <FaPhone
                className="text-black rotate-90 group-hover:animate-[wave_0.5s_ease-in-out]"
                style={{ animationDelay: "200ms" }}
              />
              <span
                className="group-hover:animate-[wave_0.5s_ease-in-out]"
                style={{ animationDelay: "240ms" }}
              >
                {order.address.phone}
              </span>
            </p>

            <p className="flex items-center gap-2">
              <FaMapMarkerAlt
                className="text-black group-hover:animate-[wave_0.5s_ease-in-out]"
                style={{ animationDelay: "280ms" }}
              />
              <span
                className="group-hover:animate-[wave_0.5s_ease-in-out]"
                style={{ animationDelay: "320ms" }}
              >
                {order.address.street}
              </span>
            </p>

            <p className="flex items-center gap-2">
              <FaCity
                className="text-black group-hover:animate-[wave_0.5s_ease-in-out]"
                style={{ animationDelay: "360ms" }}
              />
              <span
                className="group-hover:animate-[wave_0.5s_ease-in-out]"
                style={{ animationDelay: "400ms" }}
              >
                {order.address.city}, {order.address.zip}
              </span>
            </p>

            <p className="flex items-center gap-2">
              <FaGlobe
                className="text-black group-hover:animate-[wave_0.5s_ease-in-out]"
                style={{ animationDelay: "440ms" }}
              />
              <span
                className="group-hover:animate-[wave_0.5s_ease-in-out]"
                style={{ animationDelay: "480ms" }}
              >
                {order.address.country}
              </span>
            </p>
          </div>
        </motion.div>
      </div>

      {/* PRODUCTS */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        className="bg-white border rounded-2xl p-5 md:p-6 shadow-sm group hover:shadow-lg transition "
      >
        {/* TITLE */}
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <FaBox
            className="text-black group-hover:animate-[wave_0.5s_ease-in-out]"
            style={{ animationDelay: "0ms" }}
          />
          <span
            className="group-hover:animate-[wave_0.5s_ease-in-out]"
            style={{ animationDelay: "80ms" }}
          >
            Products
          </span>
        </h2>

        {/* PRODUCTS */}
        <div className="space-y-4">
          {order.products.map((product, i) => (
            <motion.div
              onClick={() => navigate(`/products/${product.id}`)}
              key={product.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-between rounded-xl p-4 border cursor-pointer"
            >
              <div className="flex items-center gap-3 md:gap-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-14 h-14 md:w-16 md:h-16 object-cover rounded-lg
              group-hover:animate-[wave_0.5s_ease-in-out]"
                  style={{ animationDelay: `${i * 120}ms` }}
                />

                <div>
                  <p
                    className="font-medium text-sm md:text-base
              group-hover:animate-[wave_0.5s_ease-in-out]"
                    style={{ animationDelay: `${i * 140}ms` }}
                  >
                    {product.name}
                  </p>

                  <p
                    className="text-xs text-gray-500
              group-hover:animate-[wave_0.5s_ease-in-out]"
                    style={{ animationDelay: `${i * 160}ms` }}
                  >
                    Qty: {product.quantity}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {(product.customImages || product.customMessage) && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // 🔥 prevent parent click
                      setSelectedProduct(product);
                    }}
                    className="flex items-center justify-center gap-2 border rounded-lg px-3 py-2 md:px-3 md:py-1 text-sm hover:bg-black hover:text-white transition w-9 h-9 md:w-auto md:h-auto
                group-hover:animate-[wave_0.5s_ease-in-out] cursor-pointer"
                    style={{ animationDelay: `${i * 180}ms` }}
                  >
                    <FaImages className="text-sm" />
                    <span className="hidden md:inline">View Custom</span>
                  </button>
                )}

                <p
                  className="font-semibold
            group-hover:animate-[wave_0.5s_ease-in-out]"
                  style={{ animationDelay: `${i * 200}ms` }}
                >
                  ${product.price * product.quantity}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* TOTAL */}
        <div className="border-t mt-6 pt-4 flex justify-between font-semibold text-base md:text-lg">
          <span
            className="group-hover:animate-[wave_0.5s_ease-in-out]"
            style={{ animationDelay: "100ms" }}
          >
            Total
          </span>

          <span
            className="group-hover:animate-[wave_0.5s_ease-in-out]"
            style={{ animationDelay: "160ms" }}
          >
            ${total}
          </span>
        </div>
      </motion.div>

      {/* CUSTOMIZATION MODAL */}

      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 max-w-lg w-full relative"
          >
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black cursor-pointer"
            >
              <FaTimes />
            </button>

            <h2 className="text-lg font-semibold mb-4">Customization</h2>

            {/* IMAGES */}
            {selectedProduct.customImages && (
              <div className="grid grid-cols-2 gap-3 mb-4">
                {selectedProduct.customImages.map((img, i) => (
                  <img key={i} src={img} className="rounded-lg object-cover" />
                ))}
              </div>
            )}

            {/* MESSAGE */}
            {selectedProduct.customMessage && (
              <div className="flex items-start gap-2 bg-gray-100 p-3 rounded-lg">
                <FaCommentDots className="mt-1 text-gray-600" />

                <p className="text-sm">{selectedProduct.customMessage}</p>
              </div>
            )}
          </motion.div>
        </div>
      )}
      {/* Wave animation */}
      <style>
        {`
          @keyframes wave {
            0%   { transform: translateY(0); }
            25%  { transform: translateY(-4px); }
            50%  { transform: translateY(4px); }
            75%  { transform: translateY(-2px); }
            100% { transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
};

export default OrderDetails;
