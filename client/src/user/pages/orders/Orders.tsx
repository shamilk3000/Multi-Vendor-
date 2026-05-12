import React from "react";
import {
  FaBox,
  FaBoxOpen,
  FaCheck,
  FaHome,
  FaRegCalendarAlt,
  FaShippingFast,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  id: string;
  date: string;
  status: string;
  products: Product[];
}

const Orders: React.FC = () => {
  const navigate = useNavigate();

  const orders: Order[] = [
    {
      id: "ORD10001",
      date: "2026-03-01",
      status: "Delivered",
      products: [
        {
          id: "1",
          name: "Wireless Mouse",
          price: 25,
          quantity: 1,
          image:
            "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200",
        },
        {
          id: "2",
          name: "Mechanical Keyboard",
          price: 80,
          quantity: 1,
          image:
            "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200",
        },
      ],
    },
    {
      id: "ORD10002",
      date: "2026-03-02",
      status: "Confirmed",
      products: [
        {
          id: "3",
          name: "Gaming Headset",
          price: 60,
          quantity: 1,
          image:
            "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=200",
        },
      ],
    },
    {
      id: "ORD10003",
      date: "2026-03-03",
      status: "Shipped",
      products: [
        {
          id: "4",
          name: "Laptop Stand",
          price: 35,
          quantity: 2,
          image:
            "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=200",
        },
      ],
    },

    // 🔥 AUTO 17 MORE
    ...Array.from({ length: 17 }, (_, i) => {
      const names = [
        "Wireless Mouse",
        "Mechanical Keyboard",
        "Gaming Headset",
        "Laptop Stand",
      ];

      const prices = [25, 80, 60, 35];

      const images = [
        "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200",
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200",
        "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=200",
        "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=200",
      ];

      return {
        id: `ORD100${4 + i}`,
        date: `2026-03-${String(4 + i).padStart(2, "0")}`,
        status: ["Delivered", "Confirmed", "Shipped", "Cancelled"][i % 4],
        products: [
          {
            id: `${i + 10}`,
            name: names[i % 4],
            price: prices[i % 4],
            quantity: (i % 3) + 1,
            image: images[i % 4],
          },
          {
            id: `${i + 20}`,
            name: names[(i + 1) % 4],
            price: prices[(i + 1) % 4],
            quantity: 1,
            image: images[(i + 1) % 4],
          },
        ],
      };
    }),
  ];

  const statusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-600 border-green-300";
      case "Confirmed":
        return "bg-yellow-100 text-yellow-600 border-yellow-300";
      case "Shipped":
        return "bg-blue-100 text-blue-600 border-blue-300";
      default:
        return "bg-gray-100 text-gray-600 border-gray-300";
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
      default:
        return <FaBox />;
    }
  };

  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
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
        {sortedOrders.map((order) => {
          const itemCount = order.products.reduce(
            (sum, p) => sum + p.quantity,
            0,
          );
          const total = order.products.reduce(
            (sum, p) => sum + p.price * p.quantity,
            0,
          );

          return (
            <motion.div
              key={order.id}
              onClick={() => navigate(`/dashboard/orders/${order.id}`)}
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
                      Order #{order.id}
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
                      {order.date}
                    </p>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 text-sm rounded-full font-semibold flex items-center gap-1.5 text-[12.5px] border ${statusColor(
                    order.status,
                  )} group-hover:animate-[wave_0.5s_ease-in-out]`}
                  style={{ animationDelay: "260ms" }}
                >
                  {statusIcon(order.status)}
                  {order.status}
                </span>
              </div>

              {/* Products */}
              <div className="border-t pt-3 space-y-3">
                {order.products.map((product, i) => (
                  <motion.div
                    key={product.id}
                    className="flex items-center justify-between bg-gray-100 border-gray-200 p-3 rounded-lg border"
                  >
                    <div className="flex items-center gap-3">
                      <motion.img
                        whileHover={{ scale: 1.1 }}
                        src={product.image}
                        alt={product.name}
                        className="w-14 h-14 rounded-md object-cover
              group-hover:animate-[wave_0.5s_ease-in-out]"
                        style={{ animationDelay: `${i * 120}ms` }}
                      />

                      <div>
                        <p
                          className="font-medium text-sm group-hover:animate-[wave_0.5s_ease-in-out]"
                          style={{ animationDelay: `${i * 140}ms` }}
                        >
                          {product.name}
                        </p>

                        <p
                          className="text-xs text-gray-500 group-hover:animate-[wave_0.5s_ease-in-out]"
                          style={{ animationDelay: `${i * 160}ms` }}
                        >
                          Qty: {product.quantity}
                        </p>
                      </div>
                    </div>

                    <div
                      className="font-semibold text-gray-700 text-sm group-hover:animate-[wave_0.5s_ease-in-out]"
                      style={{ animationDelay: `${i * 180}ms` }}
                    >
                      ${product.price * product.quantity}
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
                  {itemCount} items
                </span>

                <span
                  className="font-semibold text-black group-hover:animate-[wave_0.5s_ease-in-out]"
                  style={{ animationDelay: "160ms" }}
                >
                  Total: ${total}
                </span>
              </div>
            </motion.div>
          );
        })}
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
