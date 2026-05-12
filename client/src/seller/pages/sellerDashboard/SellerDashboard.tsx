// import React from "react";
import {
  FaBox,
  FaShoppingCart,
  FaRupeeSign,
  FaUsers,
  FaTags,
  FaClock,
  FaThLarge,
  FaTachometerAlt,
  FaRegCopy,
  FaCheck,
  FaCheckCircle,
} from "react-icons/fa";

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { logout, setSeller } from "@/redux/authSlice";
import { useDispatch } from "react-redux";
// import api from "../../../features/axios";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
  Tooltip,
  Legend,
);

const SellerDashboard = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const [copied, setCopied] = useState(false);
  const [sellerSubStatus, setSellerSubStatus] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const statusSub = searchParams.get("statusSub");

    const checkSession = async () => {
      try {
        const res = await axios.get("/api/seller/coockie-test", {
          withCredentials: true,
        });
        if (res.data.success == true) {
          dispatch(setSeller(res.data.seller));
          setSellerSubStatus(true);
        } else {
          if (res.data?.status == "PENDING_PAYMENT") {
            dispatch(setSeller(res.data.seller));
            navigate("/seller/subscription");
          } else {
            dispatch(logout());
            navigate("/seller/login");
          }
        }
      } catch (err) {
        dispatch(logout());
        navigate("/seller/login");
      }
    };
    checkSession();

    if (statusSub === "true" && sellerSubStatus == true) {
      toast.dismiss();
      toast.success("Subscription activated successfully", {
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
      navigate("/seller", { replace: true });
    }
  }, [searchParams, sellerSubStatus]);
  const handleCopy = async () => {
    try {
      const textToCopy = webURL ?? "";

      if (!textToCopy) return;

      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = textToCopy;

        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }

      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.log("Copy failed:", err);
    }
  };

  const stats = [
    { title: "Total Revenue", value: "₹45,000", icon: <FaRupeeSign /> },
    { title: "Total Orders", value: "120", icon: <FaShoppingCart /> },
    { title: "Pending Orders", value: "18", icon: <FaClock /> },
    { title: "Customers", value: "80", icon: <FaUsers /> },
    { title: "Products", value: "35", icon: <FaBox /> },
    { title: "Categories", value: "12", icon: <FaTags /> },
  ];

  const topProducts = [
    { name: "Wireless Mouse", sales: 40 },
    { name: "Keyboard", sales: 30 },
    { name: "Headphones", sales: 25 },
    { name: "Laptop", sales: 20 },
    { name: "Charger", sales: 15 },
    { name: "Charger", sales: 15 },
    { name: "Charger", sales: 15 },
    { name: "Charger", sales: 15 },
  ];

  const categories = [
    {
      name: "Electronics",
      sales: 60,
      children: ["Mobiles", "Laptops", "Accessories"],
    },
    {
      name: "Fashion",
      sales: 45,
      children: ["Men", "Women", "Kids"],
    },
    {
      name: "Home",
      sales: 30,
      children: ["Furniture", "Kitchen"],
    },
    {
      name: "Sports",
      sales: 25,
      children: ["Fitness", "Outdoor"],
    },
  ];

  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
    datasets: [
      {
        data: [12, 19, 15, 25, 22, 30, 28, 35],
        borderColor: "black",
        backgroundColor: "rgba(1,6,148,0.15)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "gray",
        pointBorderColor: "black",
        pointBorderWidth: 3,
        pointRadius: 5,
      },
    ],
  };

  const webURL = "https://www.dummy.com";

  const chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      {/* Heading */}
      <h1 className="flex items-center gap-2 md:ms-0 ms-11 md:mt-0 mt-1 text-2xl md:text-3xl font-bold mb-6">
        <FaThLarge className="text-black" />
        Seller Dashboard
      </h1>

      {/* ✅ PERFECT ICON ALIGNMENT */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-white p-4 pb-2 rounded-xl shadow-sm hover:shadow-xl transition  hover:scale-[1.01]"
          >
            {/* Top Row */}
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-black font-medium">{item.title}</p>

              {/* 🔥 ICON FIX */}
              <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-black text-white">
                {item.icon}
              </div>
            </div>

            {/* Value */}
            <h2 className="text-xl font-semibold text-gray-900">
              {item.value}
            </h2>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl p-2.5 md:p-5 pt-4 shadow-sm mb-6 hover:shadow-xl transition  hover:scale-[1.01]">
        {/* 🔥 FIXED HEADER */}
        <div className="flex items-center justify-between mb-4">
          {/* Title + Icon together */}
          <div className="flex items-center gap-2">
            <FaTachometerAlt className="text-black text-lg" />
            <h2 className="font-semibold text-gray-800">Revenue Growth</h2>
          </div>
        </div>

        {/* Chart */}
        <div className="h-64">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 ">
        {/* 🔥 Top Products (FIXED HEIGHT + SCROLL) */}
        <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-xl transition  hover:scale-[1.01]">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <FaBox /> Top Products
          </h2>

          <div className="space-y-4 h-64 overflow-y-auto pr-2">
            {topProducts.map((product, index) => (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">{product.name}</span>
                  <span className="text-sm font-medium">
                    {product.sales} sales
                  </span>
                </div>

                <div className="w-full bg-gray-200 h-2 rounded-full">
                  <div
                    className="bg-black h-2 rounded-full"
                    style={{ width: `${product.sales}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 🔥 Top Categories (FIXED HEIGHT + SCROLL) */}
        <div className="bg-white rounded-2xl p-5 hover:shadow-xl transition  hover:scale-[1.01]">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <FaTags /> Top Categories
          </h2>

          <div className="space-y-4 h-64 overflow-y-auto pr-2">
            {categories.map((cat, index) => (
              <div key={index} className="border-b pb-3">
                <div className="flex justify-between mb-1">
                  <span className="font-medium">{cat.name}</span>
                  <span className="text-sm">{cat.sales}%</span>
                </div>

                <div className="w-full bg-gray-200 h-2 rounded-full mb-2">
                  <div
                    className="bg-black h-2 rounded-full"
                    style={{ width: `${cat.sales}%` }}
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {cat.children.map((child, i) => (
                    <span
                      key={i}
                      className="text-xs bg-gray-200 hover:bg-black hover:text-white  px-2 py-1 rounded-full"
                    >
                      {child}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-5">
        <label className="font-bold">Website URL</label>
        <div className="flex font-bold mt-2 items-center rounded-xl overflow-hidden bg-black border border-black">
          <input
            type="text"
            value={webURL}
            readOnly
            className="w-full px-3 py-2 bg-white text-gray-800 outline-none"
          />

          <button
            onClick={handleCopy}
            className="cursor-pointer px-3 py-2 bg-black text-white hover:bg-gray-800 transition flex items-center gap-2"
          >
            {copied ? <FaCheck /> : <FaRegCopy />}
            <span className="text-sm p-0 m-0">
              {copied ? "Copied" : "Copy"}
            </span>
          </button>
        </div>
      </div>
      {/* <Toaster containerStyle={{ top: 75 }} position="top-right" /> */}
    </div>
  );
};

export default SellerDashboard;
