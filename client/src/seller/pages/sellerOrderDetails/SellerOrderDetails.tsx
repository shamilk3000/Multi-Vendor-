import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import { pdf } from "@react-pdf/renderer";
import InvoicePDF from "../../components/ivoice/InvoicePDF";

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
  FaDownload,
  FaEnvelope,
  FaCopy,
  FaCog,
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

interface Customer {
  name: string;
  email: string;
}

interface Order {
  id: string;
  date: string;
  status: string;
  products: Product[];
  customer: Customer;
  address: Address;
}

const OrderDetails: React.FC = () => {
  const { id } = useParams();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const order: Order = {
    id: id || "ORD12345",
    date: "2026-03-01",
    status: "Cancelled",
    customer: { name: "Rahul Kumar", email: "rahul@gmail.com" },
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
  const [status, setStatus] = useState(order.status);

  const handleStatusChange = (newStatus: string) => {
    toast.promise(
      new Promise((resolve) => {
        setTimeout(() => {
          setStatus(newStatus);
          resolve(true);
        }, 500);
      }),
      {
        loading: `Updating to ${newStatus}...`,
        success: `Status updated to ${newStatus} ✅`,
        error: "Update failed",
      },
      {
        style: {
          background: "#111",
          color: "#fff",
          border: "1px solid #333",
        },
      },
    );
  };

  const steps = [
    { label: "Order Placed", icon: <FaCheck /> },
    { label: "Processed", icon: <FaBox /> },
    { label: "Shipped", icon: <FaShippingFast /> },
    { label: "Delivered", icon: <FaHome /> },
    { label: "Cancelled", icon: <FaTimes /> }, // ✅ NEW
  ];

  const currentStep = steps.findIndex((step) => step.label === status);
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

  const handleDownloadImage = async (url: string, index: number) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `custom-image-${index + 1}.jpg`;
      link.click();

      toast.success("Image downloaded 📥", {
        style: { background: "#111", color: "#fff" },
      });
    } catch {
      toast.error("Download failed ❌");
    }
  };

  const handleCopyMessage = async () => {
    if (!selectedProduct?.customMessage) return;

    try {
      await navigator.clipboard.writeText(selectedProduct.customMessage);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = selectedProduct.customMessage;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    }

    // show tooltip
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDownloadInvoice = async () => {
    const blob = await pdf(
      <InvoicePDF order={{ ...order, status }} />,
    ).toBlob();

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Invoice-${order.id}.pdf`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-6">
      <div className="mb-6 md:ms-0 ms-10 md:mt-0 mt-1.5 relative">
        <motion.h1 className="text-xl md:text-2xl font-semibold flex items-center gap-2">
          <FaClipboardList /> Order Details{" "}
        </motion.h1>
        <button
          onClick={handleDownloadInvoice}
          className=" cursor-pointer absolute right-0 top-0 bg-black hover:bg-white hover:text-black hover:border hover:border-black text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
        >
          <FaDownload /> Invoice
        </button>
      </div>

      {/* ORDER TRACKING */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        className="bg-white border rounded-2xl p-5 md:p-6 mb-6 shadow-sm  hover:shadow-lg transition group"
      >
        <h2 className="font-semibold mb-4 flex items-center gap-2 ">
          <FaBox className="text-black" />
          Order Status
        </h2>

        <div className="flex justify-between items-center relative">
          {steps.map((step, index) => {
            return (
              <motion.div
                key={index}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.15 }}
                className="flex-1 flex flex-col items-center relative group"
                onClick={() => handleStatusChange(step.label)}
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
                  className={`w-9 h-9 md:w-10 md:h-10 flex items-center justify-center cursor-pointer rounded-full text-sm z-10
      group-hover:animate-[wave_0.5s_ease-in-out]
      ${
        status === "Cancelled"
          ? step.label === "Cancelled"
            ? "bg-red-500 text-white"
            : "bg-gray-200 text-gray-500"
          : index <= currentStep
            ? "bg-black text-white"
            : "bg-gray-200 text-gray-500"
      }`}
                  style={{ animationDelay: `${index * 120}ms` }}
                >
                  {step.icon}
                </div>

                {/* LABEL */}
                <p
                  className="text-[10px] md:text-xs mt-2 text-center font-medium group-hover:animate-[wave_0.5s_ease-in-out]"
                  style={{ animationDelay: `${index * 120 + 80}ms` }}
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
          className="bg-white border rounded-2xl p-5 shadow-sm hover:shadow-lg transition group"
        >
          <h2
            className="font-bold mb-3 flex items-center gap-2 group-hover:animate-[wave_0.5s_ease-in-out]"
            style={{ animationDelay: "0ms" }}
          >
            <FaInfoCircle className="text-black" />
            Order Info :
          </h2>

          <div className="text-black text-sm space-y-1 ms-1 font-medium">
            <p
              className="flex items-center gap-2 group-hover:animate-[wave_0.5s_ease-in-out]"
              style={{ animationDelay: "80ms" }}
            >
              <FaUser />
              <span>Name :</span> {order.customer.name}
            </p>

            <p
              className="flex items-center gap-2 group-hover:animate-[wave_0.5s_ease-in-out]"
              style={{ animationDelay: "140ms" }}
            >
              <FaEnvelope />
              <span>Email :</span> {order.customer.email}
            </p>

            <p
              className="flex items-center gap-2 group-hover:animate-[wave_0.5s_ease-in-out]"
              style={{ animationDelay: "200ms" }}
            >
              <FaHashtag />
              <span>Order ID:</span> {order.id}
            </p>

            <p
              className="flex items-center gap-2 group-hover:animate-[wave_0.5s_ease-in-out]"
              style={{ animationDelay: "260ms" }}
            >
              <FaCalendarAlt />
              <span>Order Date:</span> {formatDate(order.date)}
            </p>

            <p
              className="flex items-center gap-2 group-hover:animate-[wave_0.5s_ease-in-out]"
              style={{ animationDelay: "320ms" }}
            >
              <FaInfoCircle />
              <span>Status:</span> {order.status}
            </p>
          </div>
        </motion.div>
        {/* ADDRESS */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          className="bg-white border rounded-2xl p-5 shadow-sm  hover:shadow-lg transition group"
        >
          <h2
            className="font-bold mb-3 flex items-center gap-2 group-hover:animate-[wave_0.5s_ease-in-out]"
            style={{ animationDelay: "0ms" }}
          >
            <FaHome className="text-black" />
            Shipping Address :
          </h2>

          <div className="text-sm text-black space-y-1 ms-1 font-medium">
            <p
              className="flex items-center gap-2 group-hover:animate-[wave_0.5s_ease-in-out]"
              style={{ animationDelay: "80ms" }}
            >
              <FaUser />
              {order.address.name}
            </p>

            <p
              className="flex items-center gap-2 group-hover:animate-[wave_0.5s_ease-in-out]"
              style={{ animationDelay: "140ms" }}
            >
              <FaPhone className="rotate-90" />
              {order.address.phone}
            </p>

            <p
              className="flex items-center gap-2 group-hover:animate-[wave_0.5s_ease-in-out]"
              style={{ animationDelay: "200ms" }}
            >
              <FaMapMarkerAlt />
              {order.address.street}
            </p>

            <p
              className="flex items-center gap-2 group-hover:animate-[wave_0.5s_ease-in-out]"
              style={{ animationDelay: "260ms" }}
            >
              <FaCity />
              {order.address.city}, {order.address.zip}
            </p>

            <p
              className="flex items-center gap-2 group-hover:animate-[wave_0.5s_ease-in-out]"
              style={{ animationDelay: "320ms" }}
            >
              <FaGlobe />
              {order.address.country}
            </p>
          </div>
        </motion.div>
      </div>

      {/* PRODUCTS */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        className="bg-white border rounded-2xl p-5 md:p-6 shadow-sm  hover:shadow-lg transition group"
      >
        {/* HEADER */}
        <h2
          className="font-semibold mb-4 flex items-center gap-2 group-hover:animate-[wave_0.5s_ease-in-out]"
          style={{ animationDelay: "0ms" }}
        >
          <FaBox className="text-black" />
          Products
        </h2>

        {/* PRODUCT LIST */}
        <div className="space-y-4">
          {order.products.map((product, i) => (
            <motion.div
              key={product.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(`/seller/products/${product.id}`)}
              className="flex items-center justify-between rounded-xl p-4 border group cursor-pointer"
            >
              {/* LEFT */}
              <div className="flex items-center gap-3 md:gap-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-14 h-14 md:w-16 md:h-16 object-cover rounded-lg"
                />

                <div>
                  <p
                    className="font-medium text-sm md:text-base group-hover:animate-[wave_0.5s_ease-in-out]"
                    style={{ animationDelay: `${i * 80 + 80}ms` }}
                  >
                    {product.name}
                  </p>

                  <p
                    className="text-xs text-gray-500 group-hover:animate-[wave_0.5s_ease-in-out]"
                    style={{ animationDelay: `${i * 80 + 140}ms` }}
                  >
                    Qty: {product.quantity}
                  </p>
                </div>
              </div>

              {/* RIGHT */}
              <div className="flex items-center gap-4">
                {(product.customImages || product.customMessage) && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // 🛑 important
                      setSelectedProduct(product);
                    }}
                    className=" cursor-pointer flex items-center justify-center gap-2 border rounded-lg px-3 py-2 md:px-3 md:py-1 text-sm hover:bg-black hover:text-white transition w-9 h-9 md:w-auto md:h-auto group-hover:animate-[wave_0.5s_ease-in-out]"
                    style={{ animationDelay: `${i * 80 + 200}ms` }}
                  >
                    <FaImages className="text-sm" />
                    <span className="hidden md:inline">View Custom</span>
                  </button>
                )}

                <p
                  className="font-semibold group-hover:animate-[wave_0.5s_ease-in-out]"
                  style={{ animationDelay: `${i * 80 + 260}ms` }}
                >
                  ${product.price * product.quantity}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* TOTAL */}
        <div
          className="border-t mt-6 pt-4 flex justify-between font-semibold text-base md:text-lg group-hover:animate-[wave_0.5s_ease-in-out]"
          style={{ animationDelay: `${order.products.length * 80 + 300}ms` }}
        >
          <span>Total</span>
          <span>${total}</span>
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

            <h2 className="text-lg font-semibold mb-4 flex flex-row gap-2">
              <FaCog className="text-lg my-auto" />
              Customization
            </h2>

            {/* IMAGES */}
            {selectedProduct.customImages && (
              <div className="grid grid-cols-2 gap-3 mb-4">
                {selectedProduct.customImages.map((img, i) => (
                  <div key={i} className="relative group">
                    <img
                      src={img}
                      className="rounded-lg object-cover w-full h-full hover:ring hover:ring-black"
                    />

                    {/* Download Button (top-right) */}
                    <button
                      onClick={() => handleDownloadImage(img, i)}
                      className=" cursor-pointer absolute top-2 right-2 bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
                    >
                      <FaDownload className="text-xs" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {/* MESSAGE */}
            {selectedProduct.customMessage && (
              <div className="flex items-start gap-2 bg-gray-100 p-3 rounded-lg border border-gray-300">
                <FaCommentDots className=" text-gray-600 my-auto" />

                <p className="text-sm flex-1 my-auto">
                  {selectedProduct.customMessage}
                </p>

                {/* Copy Button */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={handleCopyMessage}
                    className=" cursor-pointer bg-black text-white p-2 rounded-md hover:bg-white hover:text-black hover:ring hover:ring-black"
                  >
                    <FaCopy className="text-xs" />
                  </button>

                  {/* Tooltip */}
                  {copied && (
                    <span className="absolute -top-8 right-0 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap animate-fadeIn after:content-[''] after:absolute after:top-full after:right-2 after:border-4 after:border-transparent after:border-t-black">
                      Copied!
                    </span>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* <Toaster position="top-right" containerStyle={{ top: 75 }} /> */}
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
            @keyframes fadeIn {
              from {
                opacity: 0;
                transform: translateY(5px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }

            .animate-fadeIn {
              animation: fadeIn 0.2s ease;
            }
        `}
      </style>
    </div>
  );
};

export default OrderDetails;
