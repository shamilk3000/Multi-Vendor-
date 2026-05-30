import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { pdf } from "@react-pdf/renderer";
import InvoicePDF from "../../components/invoice/InvoicePDF";
import { useOrderByIdForSeller } from "../../../hooks/seller/order/useOrder";
import { ultrateUpdateOrderStatus } from "../../../hooks/seller/order/ultrateOrder";
import SellerOrderDetailsSkeleton from "../../components/skeletons/orderDetailsSkeleton";

import {
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
  FaExclamationTriangle,
  FaCheckCircle,
} from "react-icons/fa";

interface Product {
  customImages?: string[];
  customMessage?: string;
}

const OrderDetails: React.FC = () => {
  const { orderId } = useParams();
  const { data: orderdetails, isLoading } = useOrderByIdForSeller(orderId!);
  const { mutateAsync: updateStatus } = ultrateUpdateOrderStatus();
  // STATES
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [pendingStatus, setPendingStatus] = useState("");
  const [pendingOrderId, setPendingOrderId] = useState("");

  const BASE_URL = import.meta.env.VITE_SERVER_IMAGE_TARGET;
  console.log(orderdetails);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const [status, setStatus] = useState("");
  useEffect(() => {
    if (orderdetails?.orderStatus) {
      setStatus(orderdetails?.orderStatus);
    }
  }, [orderdetails]);
  const handleStatusChange = async (status: string, orderId: string) => {
    try {
      // 🚫 Prevent changing cancelled orders
      if (orderdetails?.orderStatus === "Cancelled") {
        toast.error("Cancelled orders cannot be updated ❌", {
          style: {
            background: "#111",
            color: "#fff",
            border: "1px solid #333",
          },
        });

        return;
      }

      if (orderdetails?.orderStatus === "Delivered") {
        toast.error("Delivered orders cannot be updated ❌", {
          style: {
            background: "#111",
            color: "#fff",
            border: "1px solid #333",
          },
        });

        return;
      }

      // ⚠️ Open modal for cancel confirmation
      if (status === "Cancelled" || status === "Delivered") {
        setPendingStatus(status);
        setPendingOrderId(orderId);
        setShowStatusModal(true);
        return;
      }

      await toast.promise(
        updateStatus({
          orderId,
          status,
        }),
        {
          loading: `Updating to ${status}...`,
          success: `Status updated to ${status} ✅`,
          error: "Update failed ❌",
        },
        {
          style: {
            background: "#111",
            color: "#fff",
            border: "1px solid #333",
          },
        },
      );
    } catch (error) {
      console.error("Status update error:", error);

      toast.error("Something went wrong ❌", {
        style: {
          background: "#111",
          color: "#fff",
          border: "1px solid #333",
        },
      });
    }
  };

  const confirmStatusChange = async () => {
    try {
      setShowStatusModal(false);

      await toast.promise(
        updateStatus({
          orderId: pendingOrderId,
          status: pendingStatus,
        }),
        {
          loading: `Updating to ${pendingStatus}...`,
          success: `Status updated to ${pendingStatus} ✅`,
          error: "Update failed ❌",
        },
        {
          style: {
            background: "#111",
            color: "#fff",
            border: "1px solid #333",
          },
        },
      );
    } catch (error) {
      console.error(error);

      toast.error("Something went wrong ❌", {
        style: {
          background: "#111",
          color: "#fff",
          border: "1px solid #333",
        },
      });
    }
  };

  const steps = [
    { label: "Placed", icon: <FaCheck /> },
    { label: "Confirmed", icon: <FaBox /> },
    { label: "Shipped", icon: <FaShippingFast /> },
    { label: "Delivered", icon: <FaHome /> },
    { label: "Cancelled", icon: <FaTimes /> }, // ✅ NEW
  ];

  const currentStep = steps.findIndex((step) => step.label === status);

  const handleDownloadImage = async (url: string, index: number) => {
    try {
      const res = await fetch(`${BASE_URL}${url}`);
      const blob = await res.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `custom-image-${index + 1}.jpg`;
      link.click();
      toast.success("Image downloaded 📥", {
        icon: <FaCheckCircle className="text-green-500" />,
        style: {
          borderRadius: "12px",
          background: "#111",
          color: "#fff",
          border: "1px solid #333",
          boxShadow: "0 0 10px rgba(255,255,255,0.1)",
        },
        duration: 3500,
      });
    } catch {
      toast.error("Download failed ❌", {
        icon: <FaExclamationTriangle className="text-red-500" />,
        style: {
          borderRadius: "12px",
          background: "#111",
          color: "#fff",
          border: "1px solid #333",
          boxShadow: "0 0 10px rgba(255,255,255,0.1)",
        },
        duration: 3500,
      });
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
    const blob = await pdf(<InvoicePDF order={orderdetails} />).toBlob();

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Invoice-${orderdetails.orderId}.pdf`;
    link.click();
  };

  if (isLoading || !orderdetails) {
    return <SellerOrderDetailsSkeleton />;
  }

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
                onClick={() =>
                  handleStatusChange(step.label, orderdetails?._id)
                }
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
              <span>Name :</span> {orderdetails?.userId?.name}
            </p>

            <p
              className="flex items-center gap-2 group-hover:animate-[wave_0.5s_ease-in-out]"
              style={{ animationDelay: "140ms" }}
            >
              <FaEnvelope />
              <span>Email :</span> {orderdetails?.userId?.email}
            </p>

            <p
              className="flex items-center gap-2 group-hover:animate-[wave_0.5s_ease-in-out]"
              style={{ animationDelay: "200ms" }}
            >
              <FaHashtag />
              <span>Order ID:</span> {orderdetails?.orderId}
            </p>

            <p
              className="flex items-center gap-2 group-hover:animate-[wave_0.5s_ease-in-out]"
              style={{ animationDelay: "260ms" }}
            >
              <FaCalendarAlt />
              <span>Order Date:</span>{" "}
              {new Date(orderdetails?.createdAt).toLocaleString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </p>

            <p
              className="flex items-center gap-2 group-hover:animate-[wave_0.5s_ease-in-out]"
              style={{ animationDelay: "320ms" }}
            >
              <FaInfoCircle />
              <span>Status:</span> {orderdetails?.orderStatus}
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

          <div className="text-sm text-black space-y-2 ms-1 font-medium">
            {/* Name */}
            <p
              className="flex items-center gap-2 group-hover:animate-[wave_0.5s_ease-in-out]"
              style={{ animationDelay: "80ms" }}
            >
              <FaUser />
              <span>Name :</span>
              {orderdetails?.shippingAddress?.name}
            </p>

            {/* Email */}
            <p
              className="flex items-center gap-2 group-hover:animate-[wave_0.5s_ease-in-out]"
              style={{ animationDelay: "120ms" }}
            >
              <FaEnvelope />
              <span>Email :</span>
              {orderdetails?.shippingAddress?.email}
            </p>

            {/* Phone */}
            <p
              className="flex items-center gap-2 group-hover:animate-[wave_0.5s_ease-in-out]"
              style={{ animationDelay: "160ms" }}
            >
              <FaPhone className="rotate-90" />
              <span>Phone :</span>
              {orderdetails?.shippingAddress?.phone}
            </p>

            {/* Flat / Villa */}
            <p
              className="flex items-center gap-2 group-hover:animate-[wave_0.5s_ease-in-out]"
              style={{ animationDelay: "240ms" }}
            >
              <FaMapMarkerAlt />
              <span>Flat / Villa :</span>
              {orderdetails?.shippingAddress?.flatNoOrVillaNo}
            </p>

            {/* Street */}
            <p
              className="flex items-center gap-2 group-hover:animate-[wave_0.5s_ease-in-out]"
              style={{ animationDelay: "280ms" }}
            >
              <FaMapMarkerAlt />
              <span>Street :</span>
              {orderdetails?.shippingAddress?.street}
            </p>

            {/* Area */}
            <p
              className="flex items-center gap-2 group-hover:animate-[wave_0.5s_ease-in-out]"
              style={{ animationDelay: "320ms" }}
            >
              <FaMapMarkerAlt />
              <span>Area :</span>
              {orderdetails?.shippingAddress?.area}
            </p>

            {/* Landmark */}
            <p
              className="flex items-center gap-2 group-hover:animate-[wave_0.5s_ease-in-out]"
              style={{ animationDelay: "360ms" }}
            >
              <FaMapMarkerAlt />
              <span>Landmark :</span>
              {orderdetails?.shippingAddress?.landmark}
            </p>

            {/* City */}
            <p
              className="flex items-center gap-2 group-hover:animate-[wave_0.5s_ease-in-out]"
              style={{ animationDelay: "400ms" }}
            >
              <FaCity />
              <span>City :</span>
              {orderdetails?.shippingAddress?.city}
            </p>

            {/* Emirate / State */}
            <p
              className="flex items-center gap-2 group-hover:animate-[wave_0.5s_ease-in-out]"
              style={{ animationDelay: "440ms" }}
            >
              <FaGlobe />
              <span>State / Emirate :</span>
              {orderdetails?.shippingAddress?.emirate}
            </p>

            {/* Postal Code */}
            <p
              className="flex items-center gap-2 group-hover:animate-[wave_0.5s_ease-in-out]"
              style={{ animationDelay: "480ms" }}
            >
              <FaHashtag />
              <span>Postal Code :</span>
              {orderdetails?.shippingAddress?.postalCode}
            </p>

            {/* Additional Note */}
            <div
              className="flex items-start gap-2 group-hover:animate-[wave_0.5s_ease-in-out]"
              style={{ animationDelay: "520ms" }}
            >
              <FaCommentDots className="mt-1" />
              <div>
                <span>Additional Note :</span>
                <p className="text-gray-600 text-xs mt-1">
                  {orderdetails?.additionalNotes ||
                    "No additional notes provided"}
                </p>
              </div>
            </div>
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
          {orderdetails?.orderItems
            ?.sort((a: any, b: any) =>
              a?.product?.name.localeCompare(b?.product?.name),
            )
            .map((item: any, i: number) => (
              <motion.div
                key={item?.product._id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() =>
                  navigate(`/seller/products/${item?.product._id}`)
                }
                className="flex items-center justify-between rounded-xl p-4 border group cursor-pointer"
              >
                {/* LEFT */}
                <div className="flex items-center gap-3 md:gap-4">
                  <img
                    src={`${BASE_URL}${item?.product.image[0]}`}
                    alt={item?.product.name}
                    className="w-14 h-14 md:w-16 md:h-16 object-cover rounded-lg"
                  />

                  <div>
                    <p
                      className="font-medium text-sm md:text-base group-hover:animate-[wave_0.5s_ease-in-out]"
                      style={{ animationDelay: `${i * 80 + 80}ms` }}
                    >
                      {item?.product.name}
                    </p>
                    <p
                      className="text-xs text-green-500 group-hover:animate-[wave_0.5s_ease-in-out]"
                      style={{ animationDelay: `${i * 80 + 140}ms` }}
                    >
                      ${item?.perItem}
                    </p>
                    <p
                      className="text-xs text-gray-500 group-hover:animate-[wave_0.5s_ease-in-out]"
                      style={{ animationDelay: `${i * 80 + 200}ms` }}
                    >
                      Qty: {item?.quantity}
                    </p>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-4">
                  {((item?.customImages?.length ?? 0) > 0 ||
                    item?.customMessage?.trim()) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProduct(item);
                      }}
                      className="cursor-pointer flex items-center justify-center gap-2 border rounded-lg px-3 py-2 md:px-3 md:py-1 text-sm hover:bg-black hover:text-white transition w-9 h-9 md:w-auto md:h-auto group-hover:animate-[wave_0.5s_ease-in-out]"
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
                    ${item?.totalSellingPrice}
                  </p>
                </div>
              </motion.div>
            ))}
        </div>

        {/* TOTAL */}
        <div
          className="border-t mt-6 pt-4 flex justify-between font-semibold text-base md:text-lg group-hover:animate-[wave_0.5s_ease-in-out]"
          style={{
            animationDelay: `${orderdetails?.orderItems.length * 80 + 300}ms`,
          }}
        >
          <span>Total</span>
          <span>
            {" "}
            {orderdetails.totalSellingPrice} - {orderdetails.stripeFee} = $
            {orderdetails.creditedAmount}{" "}
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

            <h2 className="text-lg font-semibold mb-4 flex flex-row gap-2">
              <FaCog className="text-lg my-auto" />
              Customization
            </h2>

            {/* IMAGES */}
            {selectedProduct.customImages && (
              <div className="grid grid-cols-2 gap-3 mb-4">
                {selectedProduct.customImages.map((img, i) => (
                  <div
                    key={i}
                    className="relative group overflow-hidden rounded-lg border"
                  >
                    <img
                      src={`${BASE_URL}${img}`}
                      alt={`Custom ${i + 1}`}
                      className="w-full h-40 object-cover hover:scale-105 transition duration-300"
                    />

                    {/* Download Button */}
                    <button
                      onClick={() => handleDownloadImage(img, i)}
                      className="cursor-pointer absolute top-2 right-2 bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
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
      {showStatusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl"
          >
            <h2
              className={`text-xl font-semibold mb-3 ${
                pendingStatus === "Cancelled"
                  ? "text-red-500"
                  : "text-green-600"
              }`}
            >
              {pendingStatus === "Cancelled" ? "Cancel Order" : "Deliver Order"}
            </h2>

            <p className="text-sm text-gray-600 mb-6">
              {pendingStatus === "Cancelled"
                ? "Are you sure you want to cancel this order? This action cannot be undone."
                : "Are you sure this order has been delivered successfully?"}
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowStatusModal(false)}
                className="cursor-pointer px-4 py-2 rounded-lg border hover:bg-gray-100"
              >
                No
              </button>

              <button
                onClick={confirmStatusChange}
                className={`cursor-pointer px-4 py-2 rounded-lg text-white ${
                  pendingStatus === "Cancelled"
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                Yes
              </button>
            </div>
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
