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
  FaDownload,
  FaLink,
  FaQrcode,
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
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { logout, setSeller } from "@/redux/authSlice";
import { useDispatch } from "react-redux";
import QRCode from "react-qr-code";
import QRCodeGenerator from "qrcode";
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

  const qrRef = useRef<HTMLDivElement>(null);

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

  const handleDownloadQR = async () => {
    try {
      // QR Canvas
      const qrCanvas = document.createElement("canvas");

      await QRCodeGenerator.toCanvas(qrCanvas, webURL, {
        width: 1000,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      });

      // Final Canvas
      const finalCanvas = document.createElement("canvas");

      const ctx = finalCanvas.getContext("2d");

      if (!ctx) return;

      finalCanvas.width = 1200;
      finalCanvas.height = 1500;

      // Background
      ctx.fillStyle = "#f3f4f6";
      ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);

      // 🔥 Top Title
      ctx.fillStyle = "#000000";
      ctx.font = "bold 72px Arial";
      ctx.textAlign = "center";

      ctx.fillText("Dummy Shop", 600, 120);

      // Subtitle
      ctx.fillStyle = "#444444";
      ctx.font = "36px Arial";

      ctx.fillText("Scan this QR code to visit our online store", 600, 190);

      // QR White Area ONLY
      ctx.fillStyle = "#ffffff";

      ctx.beginPath();
      ctx.roundRect(180, 260, 840, 840, 40);
      ctx.fill();

      // QR
      ctx.drawImage(qrCanvas, 230, 310, 740, 740);

      // Main Text
      ctx.fillStyle = "#111111";
      ctx.font = "bold 46px Arial";

      ctx.fillText("Scan Me", 600, 1190);

      // Description
      ctx.fillStyle = "#666666";
      ctx.font = "30px Arial";

      ctx.fillText(
        "You can view products, prices and shop details easily",
        600,
        1260,
      );

      ctx.fillText("through our online store using this QR code.", 600, 1310);

      // Bottom URL
      ctx.fillStyle = "#000000";
      ctx.font = "bold 24px Arial";

      ctx.fillText(webURL, 600, 1410);

      // Download
      const link = document.createElement("a");

      link.href = finalCanvas.toDataURL("image/png", 1.0);

      link.download = "MyShop-online-store-qrcode.png";

      link.click();
    } catch (err) {
      console.log(err);
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

  const webURL = " http://192.168.31.97:5173/6a05f01e58620d7a7e6349f6/SML";

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
            className="bg-white p-4 pb-2 rounded-xl shadow-sm hover:shadow-xl transition hover:scale-[1.01]"
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

      <div className="bg-white rounded-2xl p-2.5 md:p-5 pt-4 shadow-sm mb-6 hover:shadow-xl transition hover:scale-[1.01]">
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
        {/* 🔥 Top Products */}
        <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-xl transition hover:scale-[1.01]">
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

        {/* 🔥 Top Categories */}
        <div className="bg-white rounded-2xl p-5 hover:shadow-xl transition hover:scale-[1.01]">
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
                      className="text-xs bg-gray-200 hover:bg-black hover:text-white px-2 py-1 rounded-full"
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

      <div className="border rounded-xl p-5 mb-5 bg-white hover:shadow-2xl transition mt-6">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <FaLink className="text-black" />
            Website URL
          </h2>

          <button
            onClick={handleCopy}
            className="cursor-pointer px-3 py-2 rounded-lg bg-black text-white hover:bg-white hover:text-black border border-black transition flex items-center gap-2"
          >
            {copied ? <FaCheck /> : <FaRegCopy />}
            <span className="text-sm">{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>

        {/* URL BOX */}
        <div className="border rounded-xl md:p-4 p-2 bg-gray-50 flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center shrink-0">
            <FaLink />
          </div>

          <div className="overflow-hidden">
            <p className="text-xs text-gray-500 mb-1">Online Store Link</p>

            <p
              onClick={() => window.open(webURL, "_blank")}
              className="font-medium text-sm break-all text-black cursor-pointer hover:underline hover:text-blue-600 transition"
            >
              {webURL}
            </p>
          </div>
        </div>
      </div>

      {/* QR CODE SECTION */}
      <div className="mt-6 bg-white rounded-2xl p-5 shadow-sm hover:shadow-xl transition hover:scale-[1.01] flex flex-col items-center">
        <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <FaQrcode className="text-black" />
          Scan To Visit Our Online Store
        </h2>

        <div
          ref={qrRef}
          style={{
            background: "linear-gradient(135deg, #000000 0%, #1f1f1f 100%)",
            color: "#ffffff",
          }}
          className="p-6 rounded-3xl flex flex-col items-center text-center"
        >
          {/* SHOP NAME */}
          <h2 className="text-2xl font-bold tracking-wide">Dummy Store</h2>

          {/* SUB TEXT */}
          <p className="text-sm text-gray-300 mt-2 max-w-[300px] leading-relaxed">
            Scan this QR code to visit our online store
          </p>

          {/* QR CODE BOX */}
          <div className="bg-white p-4 rounded-2xl mt-5 shadow-xl">
            <QRCode value={webURL} size={240} />
          </div>

          {/* SCAN TEXT */}
          <p className="mt-5 text-xl font-semibold tracking-wide">Scan Me</p>

          <p className="text-sm text-gray-300 mt-1">
            You can view products, prices and shop details easily through our
            online store using this QR code.
          </p>

          {/* WEBSITE LINK */}
          <p
            className="mt-5 text-xs text-gray-200 break-all max-w-[280px] cursor-pointer hover:underline hover:text-blue-600 transition"
            onClick={() => window.open(webURL, "_blank")}
          >
            {webURL}
          </p>
        </div>

        <button
          onClick={handleDownloadQR}
          className="mt-5 bg-black text-white border border-black px-5 py-2 rounded-xl flex items-center gap-2 hover:bg-white hover:text-black transition"
        >
          <FaDownload />
          Download QR Code
        </button>
      </div>
    </div>
  );
};

export default SellerDashboard;
