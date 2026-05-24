import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { useOrderByIdForUser } from "../../../hooks/user/order/useOrder";
import InvoicePDF from "../../components/invoice/InvoicePDF";
import { pdf } from "@react-pdf/renderer";
import OrderDetailsSkeleton from "../../components/skeletons/orderDetailsSkeleton";

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
} from "react-icons/fa";

interface Product {
  customImages?: string[];
  customMessage?: string;
}

const OrderDetails: React.FC = () => {
  const { sellerId, shopName, orderId } = useParams();
  const navigate = useNavigate();
  const { data: orderdata, isLoading } = useOrderByIdForUser(orderId!);
  const BASE_URL = import.meta.env.VITE_SERVER_IMAGE_TARGET;
const orderdetails = orderdata?.order
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const steps = [
    { label: "Placed", icon: <FaCheck /> },
    { label: "Confirmed", icon: <FaBox /> },
    { label: "Shipped", icon: <FaShippingFast /> },
    { label: "Delivered", icon: <FaHome /> },
    { label: "Cancelled", icon: <FaTimes /> }, // ✅ NEW
  ];

  const currentStep = steps.findIndex(
    (step) => step.label === orderdetails?.orderStatus,
  );


  const handleDownloadInvoice = async () => {
    const blob = await pdf(<InvoicePDF order={orderdetails} />).toBlob();

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Invoice-${orderdetails.orderId}.pdf`;
    link.click();
  };
console.log(orderdetails);

  if (isLoading || !orderdetails) {
    return <OrderDetailsSkeleton />;
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
            return (
              <motion.div
                key={index}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.15 }}
                className="flex-1 flex flex-col items-center relative group"
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
                 orderdetails?.orderStatus === "Cancelled"
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
           {orderdetails?.orderItems
            ?.sort((a: any, b: any) =>
              a?.product?.name.localeCompare(b?.product?.name),
            ) .map((item: any, i: number) => (
            <motion.div
              onClick={() => navigate(`/${sellerId}/${shopName}/products/${item.product._id}`)}
              key={item.product._id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-between rounded-xl p-4 border cursor-pointer"
            >
              <div className="flex items-center gap-3 md:gap-4">
                <img
                  src={`${BASE_URL}${item?.product.image[0]}`}
                    alt={item?.product.name}
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
                   {item?.product.name}
                  </p>
                <p
                    className="font-medium  text-xs text-green-500 md:text-xs
              group-hover:animate-[wave_0.5s_ease-in-out]"
                    style={{ animationDelay: `${i * 160}ms` }}
                  >
                      ${item?.product.sellingPrice}
                    </p>
                  <p
                    className="text-xs text-gray-500
              group-hover:animate-[wave_0.5s_ease-in-out]"
                    style={{ animationDelay: `${i * 180}ms` }}
                  >
                    Qty: {item?.quantity}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {((item?.customImages?.length ?? 0) > 0 ||
                    item?.customMessage?.trim()) && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // 🔥 prevent parent click
                      setSelectedProduct(item);
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
                  ${item?.totalSellingPrice}
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
            ${orderdetails?.totalSellingPrice}
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
            <div className="grid grid-cols-2 gap-3 mb-4">
                {selectedProduct.customImages?.map((img, i) => (
                  <div
                    key={i}
                    className="relative group overflow-hidden rounded-lg border"
                  >
                    <img
                      src={`${BASE_URL}${img}`}
                      alt={`Custom ${i + 1}`}
                      className="w-full h-40 object-cover hover:scale-105 transition duration-300"
                    />
                  </div>
                ))}
              </div>

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
