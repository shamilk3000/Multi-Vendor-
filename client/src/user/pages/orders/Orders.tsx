import React from "react";
import {
  FaBox,
  FaBoxOpen,
  FaCheck,
  FaHome,
  FaRegCalendarAlt,
  FaShippingFast,
  FaTimes,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAllOrderForUser } from "../../../hooks/user/order/useOrder";
import { useParams } from "react-router-dom";
import OrdersSkeleton from "../../components/skeletons/orderSkeleton";

const Orders: React.FC = () => {
  const navigate = useNavigate();
  const { data: orderdetails, isLoading } = useAllOrderForUser();
  const { sellerId, shopName } = useParams();
  const BASE_URL = import.meta.env.VITE_SERVER_IMAGE_TARGET;

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

  const sortedOrders = [...(orderdetails?.orders || [])].sort(
    (a: any, b: any) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <div className="min-h-screen bg-gray-100 md:p-6 p-3">
      {/* Title */}

      <motion.h1
        className="text-2xl font-semibold mb-6 flex items-center gap-2 ms-13 mt-2 md:mt-0 md:ms-0
             group hover:animate-[wave_0.5s_ease-in-out]"
      >
        <FaBoxOpen className="text-back" />
        My Orders
      </motion.h1>

      <div className="space-y-5">
        {isLoading ? (
          <OrdersSkeleton />
        ) : sortedOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center border border-dashed border-gray-400 rounded-xl p-8 bg-white text-center">
            {/* ICON */}
            <div className="bg-gray-100 p-4 rounded-full ">
              <FaBox className="text-2xl text-gray-600" />
            </div>

            {/* TITLE */}
            <h2 className="text-lg font-semibold mb-1">No Orders Yet</h2>

            {/* SUBTEXT */}
            <p className="text-sm text-gray-700 ">
              Your order list is feeling lonely.
            </p>
            <p className="text-sm text-gray-700 ">
              Discover amazing products and place your first order today!
            </p>
          </div>
        ) : (
          sortedOrders.map((order) => {
            return (
              <motion.div
                key={order._id}
                onClick={() =>
                  navigate(
                    `/${sellerId}/${shopName}/dashboard/orders/${order._id}`,
                  )
                }
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-xl shadow-sm p-5 hover:shadow-lg transition cursor-pointer group"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1 text-black">
                      <FaBox
                        size={15}
                        className="group-hover:animate-[wave_0.5s_ease-in-out]"
                        style={{ animationDelay: "0ms" }}
                      />
                      <p
                        className="font-semibold text-sm group-hover:animate-[wave_0.5s_ease-in-out]"
                        style={{ animationDelay: "80ms" }}
                      >
                        Order {order.orderId}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-black">
                      <FaRegCalendarAlt
                        size={15}
                        className="group-hover:animate-[wave_0.5s_ease-in-out]"
                        style={{ animationDelay: "140ms" }}
                      />
                      <p
                        className="text-xs font-medium group-hover:animate-[wave_0.5s_ease-in-out]"
                        style={{ animationDelay: "200ms" }}
                      >
                        {new Date(order.createdAt).toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 text-sm rounded-full font-semibold flex items-center gap-1.5 text-[12.5px] border ${statusColor(
                      order.orderStatus,
                    )} group-hover:animate-[wave_0.5s_ease-in-out]`}
                    style={{ animationDelay: "260ms" }}
                  >
                    {statusIcon(order.orderStatus)}
                    {order.orderStatus}
                  </span>
                </div>

                {/* Products */}
                <div className="border-t pt-3 space-y-3">
                  {order.orderItems.map((product: any, i: number) => (
                    <motion.div
                      key={product.product._id}
                      className="flex items-center justify-between bg-gray-100 border-gray-200 p-3 rounded-lg border"
                    >
                      <div className="flex items-center gap-3">
                        <motion.img
                          whileHover={{ scale: 1.1 }}
                          src={`${BASE_URL}${product.product.image[0]}`}
                          alt={product.product.name}
                          className="w-14 h-14 rounded-md object-cover
              group-hover:animate-[wave_0.5s_ease-in-out]"
                          style={{ animationDelay: `${i * 120}ms` }}
                        />

                        <div>
                          <p
                            className="font-medium text-sm group-hover:animate-[wave_0.5s_ease-in-out]"
                            style={{ animationDelay: `${i * 140}ms` }}
                          >
                            {product.product.name}
                          </p>
                          <p className="font-medium text-green-500 text-xs group-hover:animate-[wave_0.5s_ease-in-out]"
                            style={{ animationDelay: `${i * 160}ms` }} >
                            {product.product.sellingPrice}
                          </p>
                          <p
                            className="text-xs text-gray-500 group-hover:animate-[wave_0.5s_ease-in-out]"
                            style={{ animationDelay: `${i * 180}ms` }}
                          >
                            Qty: {product.quantity}
                          </p>
                        </div>
                      </div>

                      <div
                        className="font-semibold text-gray-700 text-sm group-hover:animate-[wave_0.5s_ease-in-out]"
                        style={{ animationDelay: `${i * 200}ms` }}
                      >
                        ${product.totalSellingPrice}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Total */}
                <div className="border-t mt-3 pt-3 flex justify-between text-sm">
                  <span
                    className="text-gray-500 group-hover:animate-[wave_0.5s_ease-in-out]"
                    style={{ animationDelay: "100ms" }}
                  >
                    {order.totalItems} items
                  </span>

                  <span
                    className="font-semibold text-black group-hover:animate-[wave_0.5s_ease-in-out]"
                    style={{ animationDelay: "160ms" }}
                  >
                    Total: ${order.totalSellingPrice}
                  </span>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
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

export default Orders;
