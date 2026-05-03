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

interface Customer {
  name: string;
  email: string;
}

interface Order {
  id: string;
  date: string;
  status: string;
  customer: Customer;
  products: Product[];
  isNew: boolean;
}
const options = [
  { label: "All Status", value: "All", icon: <FaBox /> },
  { label: "Order Placed", value: "Placed", icon: <FaCheck /> },
  { label: "Processed", value: "Processed", icon: <FaBox /> },
  { label: "Shipped", value: "Shipped", icon: <FaShippingFast /> },
  { label: "Delivered", value: "Delivered", icon: <FaHome /> },
];

const SellerOrders: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [open, setOpen] = useState(false);
  const selected = options.find((opt) => opt.value === statusFilter);

  const orders: Order[] = [
    {
      id: "ORD10001",
      date: "2029-03-02",
      status: "Delivered",
      customer: { name: "Rahul Kumar", email: "rahul@gmail.com" },
      products: [
        {
          id: "1",
          name: "Wireless Mouse",
          price: 25,
          quantity: 2,
          image:
            "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200",
        },
      ],
      isNew: true,
    },
    {
      id: "ORD10002",
      date: "2029-03-05",
      status: "Processed",
      customer: { name: "Anjali Nair", email: "anjali@gmail.com" },
      products: [
        {
          id: "2",
          name: "Mechanical Keyboard",
          price: 80,
          quantity: 1,
          image:
            "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200",
        },
      ],
      isNew: true,
    },
    {
      id: "ORD10003",
      date: "2029-03-07",
      status: "Shipped",
      customer: { name: "Arjun Das", email: "arjun@gmail.com" },
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
      isNew: true,
    },
    {
      id: "ORD10004",
      date: "2029-03-08",
      status: "Cancelled",
      customer: { name: "Sneha Pillai", email: "sneha@gmail.com" },
      products: [
        {
          id: "4",
          name: "Laptop Stand",
          price: 35,
          quantity: 1,
          image:
            "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=200",
        },
      ],
      isNew: true,
    },
    {
      id: "ORD10005",
      date: "2029-03-10",
      status: "Delivered",
      customer: { name: "Vishnu Raj", email: "vishnu@gmail.com" },
      products: [
        {
          id: "5",
          name: "Wireless Mouse",
          price: 25,
          quantity: 3,
          image:
            "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200",
        },
      ],
      isNew: true,
    },
    {
      id: "ORD10006",
      date: "2029-03-12",
      status: "Placed",
      customer: { name: "Meera Nair", email: "meera@gmail.com" },
      products: [
        {
          id: "6",
          name: "Mechanical Keyboard",
          price: 80,
          quantity: 1,
          image:
            "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200",
        },
        {
          id: "7",
          name: "Gaming Headset",
          price: 60,
          quantity: 1,
          image:
            "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=200",
        },
      ],
      isNew: true,
    },
    {
      id: "ORD10007",
      date: "2029-03-14",
      status: "Shipped",
      customer: { name: "Aditya Menon", email: "aditya@gmail.com" },
      products: [
        {
          id: "8",
          name: "Laptop Stand",
          price: 35,
          quantity: 2,
          image:
            "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=200",
        },
      ],
      isNew: true,
    },
    {
      id: "ORD10008",
      date: "2029-03-15",
      status: "Delivered",
      customer: { name: "Kiran Das", email: "kiran@gmail.com" },
      products: [
        {
          id: "9",
          name: "Gaming Headset",
          price: 60,
          quantity: 1,
          image:
            "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=200",
        },
      ],
      isNew: true,
    },
    {
      id: "ORD10009",
      date: "2029-03-16",
      status: "Cancelled",
      customer: { name: "Anu Joseph", email: "anu@gmail.com" },
      products: [
        {
          id: "10",
          name: "Mechanical Keyboard",
          price: 80,
          quantity: 1,
          image:
            "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200",
        },
      ],
      isNew: true,
    },
    {
      id: "ORD10010",
      date: "2029-03-17",
      status: "Placed",
      customer: { name: "Rohit Nair", email: "rohit@gmail.com" },
      products: [
        {
          id: "11",
          name: "Wireless Mouse",
          price: 25,
          quantity: 1,
          image:
            "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200",
        },
      ],
      isNew: true,
    },

    // 🔥 Remaining 10 (shorter but same pattern)
    ...Array.from({ length: 10 }, (_, i) => ({
      id: `ORD100${11 + i}`,
      date: `2029-03-${18 + i}`,
      isNew: i % 2 === 0,
      status: ["Delivered", "Processed", "Shipped", "Cancelled", "Placed"][
        i % 4
      ],
      customer: {
        name: `Customer ${i + 11}`,
        email: `user${i + 11}@gmail.com`,
      },
      products: [
        {
          id: `${i + 20}`,
          name: ["Wireless Mouse", "Keyboard", "Headset", "Laptop Stand"][
            i % 4
          ],
          price: [25, 80, 60, 35][i % 4],
          quantity: (i % 3) + 1,
          image: [
            "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200",
            "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200",
            "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=200",
            "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=200",
          ][i % 4],
        },
      ],
    })),
  ];

  const statusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-600 border-green-300";
      case "Placed":
        return "bg-yellow-100 text-yellow-600 border-yellow-300";
      case "Processed":
        return "bg-black text-white border-black";
      case "Shipped":
        return "bg-blue-100 text-blue-600 border-blue-300";
      default:
        return "bg-red-100 text-red-600 border-red-300";
    }
  };
  const statusIcon = (status: string) => {
    switch (status) {
      case "Delivered":
        return <FaHome />;
      case "Processed":
        return <FaBox />;
      case "Shipped":
        return <FaShippingFast />;
      case "Placed":
        return <FaCheck />;
      default:
        return <FaBox />;
    }
  };
  const filteredOrders = [...orders]
    .filter((order) => {
      const matchSearch =
        order.id.toLowerCase().includes(search.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(search.toLowerCase()) ||
        order.customer.email.toLowerCase().includes(search.toLowerCase()) ||
        order.products.some((product) =>
          product.name.toLowerCase().includes(search.toLowerCase()),
        );

      const matchStatus =
        statusFilter === "All" || order.status === statusFilter;

      return matchSearch && matchStatus;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return (
    <div className="min-h-screen bg-gray-100 md:p-6 p-3">
      {/* TITLE */}
      <div className=" mx-auto ">
        {/* TITLE */}
        <motion.h1 className="text-2xl font-semibold mb-4 mt-2 ms-12 md:ms-0 flex items-center gap-2">
          <FaBoxOpen className=" md:mt-1 mt-0" />
          <span>Seller Orders</span>
        </motion.h1>

        {/* FILTERS */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 mb-5">
          {/* SEARCH */}
          <div className="relative transition-all duration-300 hover:scale-[1.01] w-full md:flex-1">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700" />

            <input
              type="text"
              placeholder="Search by order, name, email, product..."
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
      </div>
      <div className="space-y-5">
        {filteredOrders.map((order) => {
          const total = order.products.reduce(
            (sum, p) => sum + p.price * p.quantity,
            0,
          );

          const itemCount = order.products.reduce(
            (sum, p) => sum + p.quantity,
            0,
          );

          return (
            <motion.div
              key={order.id}
              onClick={() => navigate(`/seller/orders/${order.id}`)}
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
                    <FaBox className="inline mr-2" /> #{order.id}
                  </p>

                  <p
                    className="group-hover:animate-[wave_0.5s_ease-in-out]"
                    style={{ animationDelay: "80ms" }}
                  >
                    <FaRegCalendarAlt className="inline mr-2" /> {order.date}
                  </p>

                  <p
                    className="group-hover:animate-[wave_0.5s_ease-in-out]"
                    style={{ animationDelay: "140ms" }}
                  >
                    <FaUser className="inline mr-2" /> {order.customer.name}
                  </p>

                  <p
                    className="group-hover:animate-[wave_0.5s_ease-in-out]"
                    style={{ animationDelay: "200ms" }}
                  >
                    <FaEnvelope className="inline mr-2" />{" "}
                    {order.customer.email}
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
                      order.status,
                    )}`}
                    style={{ animationDelay: "260ms" }}
                  >
                    {statusIcon(order.status)}
                    {order.status}
                  </span>
                </div>
              </div>
              {/* PRODUCTS */}
              <div className="border-t pt-3 space-y-3">
                {order.products.map((product, i) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between bg-gray-100 border-gray-200 p-3 rounded-lg border group-hover:animate-[wave_0.5s_ease-in-out]"
                    style={{ animationDelay: `${i * 100 + 300}ms` }}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-14 h-14 rounded-md object-cover"
                      />

                      <div>
                        <p className="font-medium text-sm">{product.name}</p>
                        <p className="text-xs text-gray-500">
                          Qty: {product.quantity}
                        </p>
                      </div>
                    </div>

                    <div className="font-semibold text-gray-700 text-sm">
                      ${product.price * product.quantity}
                    </div>
                  </div>
                ))}
              </div>

              {/* FOOTER */}
              <div
                className="border-t mt-3 pt-3 flex justify-between text-sm group-hover:animate-[wave_0.5s_ease-in-out]"
                style={{
                  animationDelay: `${order.products.length * 100 + 350}ms`,
                }}
              >
                <span className="text-gray-500">{itemCount} items</span>

                <span className="font-semibold text-black">
                  Total: ${total}
                </span>
              </div>
            </motion.div>
          );
        })}
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
