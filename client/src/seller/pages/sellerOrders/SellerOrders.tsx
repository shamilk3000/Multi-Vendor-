import React, { useState } from "react";
import {
  FaBox,
  FaBoxOpen,
  FaRegCalendarAlt,
  FaUser,
  FaEnvelope,
  FaSearch,
  FaFilter,
  FaCheck,
  FaShippingFast,
  FaHome,
  FaTimes,
  FaList,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useOrderForSeller } from "../../../hooks/seller/order/useOrder";
import SellerOrdersSkeleton from "../../components/skeletons/ordersSkeleton";

const options = [
  { label: "All Status", value: "All", icon: <FaList /> },
  { label: "Order Placed", value: "Placed", icon: <FaCheck /> },
  { label: "Confirmed", value: "Confirmed", icon: <FaBox /> },
  { label: "Shipped", value: "Shipped", icon: <FaShippingFast /> },
  { label: "Delivered", value: "Delivered", icon: <FaHome /> },
  { label: "Cancelled", value: "Cancelled", icon: <FaTimes /> },
];

const SellerOrders: React.FC = () => {
  const navigate = useNavigate();
  const { data: orderdetails = [], isLoading } = useOrderForSeller();
  const BASE_URL = import.meta.env.VITE_SERVER_IMAGE_TARGET;

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [open, setOpen] = useState(false);
  const selected = options.find((opt) => opt.value === statusFilter);

  const statusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-600 border-green-300";
      case "Placed":
        return "bg-yellow-100 text-yellow-600 border-yellow-300";
      case "Confirmed":
        return "bg-black text-white border-black";
      case "Shipped":
        return "bg-blue-100 text-blue-600 border-blue-300";
      case "Cancelled":
        return "bg-red-100 text-red-600 border-red-300";
      default:
        return "bg-red-100 text-red-600 border-red-300";
    }
  };
  const statusIcon = (status: string) => {
    switch (status) {
      case "Delivered":
        return <FaHome />;
      case "Confirmed":
        return <FaBox />;
      case "Shipped":
        return <FaShippingFast />;
      case "Placed":
        return <FaCheck />;
      case "Cancelled":
        return <FaTimes />;
      default:
        return <FaBox />;
    }
  };
  const filteredOrders = [...(orderdetails || [])]
    .filter((order) => {
      const formattedDate = new Date(order.createdAt).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      const matchSearch =
        order.orderId.toLowerCase().includes(search.toLowerCase()) ||
        order.userId.name.toLowerCase().includes(search.toLowerCase()) ||
        order.userId.email.toLowerCase().includes(search.toLowerCase()) ||
        formattedDate.toLowerCase().includes(search.toLowerCase()) ||
        order.orderItems.some((product: any) =>
          product.product.name.toLowerCase().includes(search.toLowerCase()),
        );

      const matchStatus =
        statusFilter === "All" || order.orderStatus === statusFilter;

      return matchSearch && matchStatus;
    })
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

  return (
    <div className="min-h-screen bg-gray-100 md:p-6 p-3">
      {/* TITLE */}
      <div className=" mx-auto ">
        {/* TITLE */}
        <motion.h1 className="text-2xl font-semibold mb-4 mt-2 ms-12 md:ms-0 flex items-center gap-2">
          <FaBoxOpen className=" md:mt-1 mt-0" />
          <span>Seller Orders</span>
        </motion.h1>
      </div>
      <div className="space-y-5">
        {isLoading ? (
          <SellerOrdersSkeleton />
        ) : filteredOrders.length === 0 ? (
          <>
            {/* FILTERS */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 mb-5">
              {/* SEARCH */}
              <div className="relative transition-all duration-300 hover:scale-[1.01] w-full md:flex-1">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700" />

                <input
                  type="text"
                  placeholder="Search by order, name, email, product, date..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className=" focus:ring-2 focus:ring-black border border-gray-500  pl-10 pr-3 py-2 rounded-lg text-sm w-full "
                />
              </div>

              <div className="relative w-full md:w-48">
                {/* FILTER ICON */}
                <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />

                {/* BUTTON */}
                <div
                  onClick={() => setOpen(!open)}
                  className="w-full flex items-center justify-between border border-gray-500 p-2 pl-10 rounded-lg text-sm cursor-pointer "
                >
                  <div className="flex items-center gap-2">
                    {selected?.icon}
                    <span>{selected?.label}</span>
                  </div>
                  <span className="text-gray-500">▼</span>
                </div>

                {/* DROPDOWN */}
                {open && (
                  <div className="absolute z-10 mt-2 w-full bg-gray-200 border border-gray-300 rounded-lg shadow-lg">
                    {options.map((opt) => (
                      <div
                        key={opt.value}
                        onClick={() => {
                          setStatusFilter(opt.value);
                          setOpen(false);
                        }}
                        className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-600 hover:text-white cursor-pointer rounded-lg "
                      >
                        {opt.icon}
                        {opt.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col items-center justify-center border border-dashed border-gray-400 rounded-xl p-8 bg-white text-center">
              {/* ICON */}
              <div className="bg-gray-100 p-4 rounded-full ">
                <FaBox className="text-2xl text-gray-600" />
              </div>

              {/* TITLE */}
              <h2 className="text-lg font-semibold mb-1">No Orders Found</h2>

              {/* SUBTEXT */}
              <p className="text-sm text-gray-700 ">
                Looks like you don't have any orders yet.
              </p>
              <p className="text-sm text-gray-700">OR</p>
              <p className="text-sm text-gray-700 ">
                Try changing filters or search
              </p>
            </div>
          </>
        ) : (
          <>
            {/* FILTERS */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 mb-5">
              {/* SEARCH */}
              <div className="relative transition-all duration-300 hover:scale-[1.01] w-full md:flex-1">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700" />

                <input
                  type="text"
                  placeholder="Search by order, name, email, product, date..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className=" focus:ring-2 focus:ring-black border border-gray-500  pl-10 pr-3 py-2 rounded-lg text-sm w-full "
                />
              </div>

              <div className="relative w-full md:w-48">
                {/* FILTER ICON */}
                <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />

                {/* BUTTON */}
                <div
                  onClick={() => setOpen(!open)}
                  className="w-full flex items-center justify-between border border-gray-500 p-2 pl-10 rounded-lg text-sm cursor-pointer "
                >
                  <div className="flex items-center gap-2">
                    {selected?.icon}
                    <span>{selected?.label}</span>
                  </div>
                  <span className="text-gray-500">▼</span>
                </div>

                {/* DROPDOWN */}
                {open && (
                  <div className="absolute z-10 mt-2 w-full bg-gray-200 border border-gray-300 rounded-lg shadow-lg">
                    {options.map((opt) => (
                      <div
                        key={opt.value}
                        onClick={() => {
                          setStatusFilter(opt.value);
                          setOpen(false);
                        }}
                        className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-600 hover:text-white cursor-pointer rounded-lg "
                      >
                        {opt.icon}
                        {opt.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {filteredOrders.map((order) => {
              return (
                <motion.div
                  key={order._id}
                  onClick={() => navigate(`/seller/orders/${order._id}`)}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-xl p-5 shadow-sm  hover:shadow-lg transition cursor-pointer group"
                >
                  {/* HEADER */}
                  <div className=" flex justify-between items-start text-sm mb-2 text-black">
                    <div className="font-medium space-y-0.5 text-sm">
                      <p
                        className="group-hover:animate-[wave_0.5s_ease-in-out]"
                        style={{ animationDelay: "0ms" }}
                      >
                        <FaBox className="inline mr-2" /> {order.orderId}
                      </p>

                      <p
                        className="group-hover:animate-[wave_0.5s_ease-in-out]"
                        style={{ animationDelay: "80ms" }}
                      >
                        <FaRegCalendarAlt className="inline mr-2" />{" "}
                        {new Date(order.createdAt).toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </p>

                      <p
                        className="group-hover:animate-[wave_0.5s_ease-in-out]"
                        style={{ animationDelay: "140ms" }}
                      >
                        <FaUser className="inline mr-2" /> {order.userId.name}
                      </p>

                      <p
                        className="group-hover:animate-[wave_0.5s_ease-in-out]"
                        style={{ animationDelay: "200ms" }}
                      >
                        <FaEnvelope className="inline mr-2" />{" "}
                        {order.userId.email}
                      </p>
                    </div>

                    {/* 🔥 INLINE STATUS + NEW */}
                    <div className="flex items-center gap-2">
                      {order.isNew == true && (
                        <span
                          style={{ animationDelay: "260ms" }}
                          className="group-hover:animate-[wave_0.5s_ease-in-out] px-1 py-0.5 text-[10px] font-semibold text-white rounded bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.9)] animate-[pulse_1s_infinite]"
                        >
                          NEW
                        </span>
                      )}

                      <span
                        className={`px-2 py-0.5 text-lg rounded-full font-semibold flex items-center gap-1.5 text-[12.5px] border group-hover:animate-[wave_0.5s_ease-in-out] ${statusColor(
                          order.orderStatus,
                        )}`}
                        style={{ animationDelay: "260ms" }}
                      >
                        {statusIcon(order.orderStatus)}
                        {order.orderStatus}
                      </span>
                    </div>
                  </div>
                  {/* PRODUCTS */}
                  <div className="border-t pt-3 space-y-3">
                    {order.orderItems.map((product: any, i: number) => (
                      <div
                        key={product.product._id}
                        className="flex items-center justify-between bg-gray-100 border-gray-200 p-3 rounded-lg border group-hover:animate-[wave_0.5s_ease-in-out]"
                        style={{ animationDelay: `${i * 100 + 300}ms` }}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={`${BASE_URL}${product.product.image[0]}`}
                            alt={product.product.name}
                            className="w-14 h-14 rounded-md object-cover"
                          />

                          <div>
                            <p className="font-medium text-sm">
                              {product.product.name}
                            </p>
                            <p className="font-medium text-green-500 text-xs">
                              {product.perItem}
                            </p>
                            <p className="text-xs text-gray-500">
                              Qty: {product.quantity}
                            </p>
                          </div>
                        </div>

                        <div className="font-semibold text-gray-900 text-sm">
                          ${product.totalSellingPrice}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* FOOTER */}
                  <div
                    className="border-t mt-3 pt-3 flex justify-between text-sm group-hover:animate-[wave_0.5s_ease-in-out]"
                    style={{
                      animationDelay: `${order.orderItems.length * 100 + 350}ms`,
                    }}
                  >
                    <span className="text-gray-500">
                      {order.totalItems} items
                    </span>

                    <span className="font-semibold text-black">
                      Total: {order.totalSellingPrice} - {order.stripeFee} = $
                      {order.creditedAmount}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </>
        )}
      </div>
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

export default SellerOrders;
