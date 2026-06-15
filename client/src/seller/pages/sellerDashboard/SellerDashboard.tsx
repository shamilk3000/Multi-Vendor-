// import React from "react";
import {
  FaBox,
  FaShoppingCart,
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
  FaWallet,
  FaArrowDown,
  FaPercent,
  FaImage,
  FaTrash,
  FaExclamationTriangle,
} from "react-icons/fa";

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
  Tooltip as ChartTooltip,
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
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";
import { useSellerDashboard } from "../../../hooks/seller/profile/useProfile";
import SellerDashboardSkeleton from "@/seller/components/skeletons/dashboardSkeleton";
import { ultrateUpdateBanner } from "../../../hooks/seller/profile/ultrateProfile";
import { ultrateDeleteBanner } from "../../../hooks/seller/profile/ultrateProfile";

// import api from "../../../features/axios";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
  ChartTooltip,
  Legend,
);

const SellerDashboard = () => {
  const { data: dashboardData, isLoading } = useSellerDashboard();
  const { mutateAsync: updateBanner } = ultrateUpdateBanner();
  const { mutateAsync: deleteBanner } = ultrateDeleteBanner();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const [banner, setBanner] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [sellerSubStatus, setSellerSubStatus] = useState(false);
  const navigate = useNavigate();
  const [openTooltip, setOpenTooltip] = useState<number | null>(null);
  const BASE_URL = import.meta.env.VITE_SERVER_DAGHBOARD;
  const BASE_URL_IMG = import.meta.env.VITE_SERVER_IMAGE_TARGET;

  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;
  const qrRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (dashboardData?.seller?.banner) {
      setBanner(dashboardData.seller.banner);
    }
  }, [dashboardData]);
  useEffect(() => {
    const statusSub = searchParams.get("statusSub");

    const checkSession = async () => {
      try {
        const res = await axios.get("/api/seller/coockie-test", {
          withCredentials: true,
        });

        if (res.data.success == true) {
          if (res.data.seller.isComplete == false) {
            navigate("/seller/details-entry", {
              state: { sellerEmail: res.data.seller.email },
            });
          }
          dispatch(setSeller(res.data.seller));
          setSellerSubStatus(true);
        } else {
          if (res.data?.status == "PENDING_PAYMENT") {
            dispatch(setSeller(res.data.seller));
            navigate("/seller/subscription");
          } else {
            dispatch(logout());
            navigate("/");
          }
        }
      } catch (err) {
        dispatch(logout());
        navigate("/");
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

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];

      if (!file) return;

      const formData = new FormData();
      formData.append("banner", file);

      const res = await toast.promise(
        updateBanner(formData),
        {
          loading: "Uploading banner...",
          success: "Banner updated successfully",
          error: "Failed to update banner",
        },
        {
          style: {
            background: "#111",
            color: "#fff",
            border: "1px solid #333",
          },
          duration: 3500,
        },
      );

      if (res.success) {
        setBanner(res.banner);
      }
    } catch (error) {
      console.error("Banner upload error:", error);
      toast.error(`Banner upload error: ${error}`, {
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

  const handleBannerDelete = async () => {
    try {
      const res = await toast.promise(
        deleteBanner(banner),
        {
          loading: "Deleting banner...",
          success: "Banner deleted successfully",
          error: "Failed to delete banner",
        },
        {
          style: {
            background: "#111",
            color: "#fff",
            border: "1px solid #333",
          },
          duration: 3500,
        },
      );

      if (res.success) {
        setBanner(null);
      }
    } catch (error) {
      console.error("Banner delete error:", error);
      toast.error(`Banner delete error: ${error}`, {
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
    } catch (err: any) {
      console.error("Copy failed:", err);
      toast.error(`Copy failed: ${err}`, {
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

  const handleDownloadQR = async () => {
    if (!webURL) return;
    const downloadPromise = new Promise(async (resolve, reject) => {
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

        if (!ctx) {
          reject(new Error("Canvas context not found"));
          return;
        }

        finalCanvas.width = 1200;
        finalCanvas.height = 1500;

        // Background
        ctx.fillStyle = "#f3f4f6";
        ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);

        // Title
        ctx.fillStyle = "#000";
        ctx.font = "bold 72px Arial";
        ctx.textAlign = "center";
        ctx.fillText(
          `${dashboardData?.seller?.businessDetails?.bussinessName}`,
          600,
          120,
        );

        // Subtitle
        ctx.fillStyle = "#444";
        ctx.font = "36px Arial";
        ctx.fillText("Scan this QR code to visit our online store", 600, 190);

        // QR background
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.roundRect(180, 260, 840, 840, 40);
        ctx.fill();

        // QR
        ctx.drawImage(qrCanvas, 230, 310, 740, 740);

        // Text
        ctx.fillStyle = "#111";
        ctx.font = "bold 46px Arial";
        ctx.fillText("Scan Me", 600, 1190);

        ctx.fillStyle = "#666";
        ctx.font = "30px Arial";
        ctx.fillText(
          "You can view products, prices and shop details easily",
          600,
          1260,
        );
        ctx.fillText("through our online store using this QR code.", 600, 1310);

        // URL
        ctx.fillStyle = "#000";
        ctx.font = "bold 24px Arial";
        ctx.fillText(webURL, 600, 1410);

        // Download
        const link = document.createElement("a");
        link.href = finalCanvas.toDataURL("image/png", 1.0);
        link.download = `${dashboardData?.seller?.businessDetails?.bussinessName}-online-store-qrcode.png`;
        link.click();

        resolve("Downloaded");
      } catch (err) {
        reject(err);
      }
    });

    await toast.promise(
      downloadPromise,
      {
        loading: "Generating QR code...",
        success: "QR code downloaded successfully 🎉",
        error: (err) => err.message || "Failed to download QR code",
      },
      {
        style: {
          background: "#111",
          color: "#fff",
          border: "1px solid #333",
        },
        duration: 3500,
      },
    );
  };

  if (isLoading || !dashboardData) return <SellerDashboardSkeleton />;

  const stats = [
    {
      title: "Total Revenue",
      value: dashboardData?.revenue?.creditedAmount,
      icon: <FaWallet />,
      tooltip: `Total credited: ${dashboardData?.revenue?.totalAmount}, Stripe fee: ${dashboardData?.revenue?.stripeFee}, Available balance: ${dashboardData?.revenue?.creditedAmount}`,
    },
    {
      title: "Total Orders",
      value: dashboardData?.orderStats?.totalOrders,
      icon: <FaShoppingCart />,
      tooltip: ` ${dashboardData?.orderStats?.totalOrders} orders were placed in your store, and ${dashboardData?.orderStats?.cancelledOrders} were cancelled `,
    },
    {
      title: "New Orders",
      value: dashboardData?.orderStats?.pendingOrders,
      icon: <FaClock />,
      tooltip: "Orders waiting for confirmation",
    },
    {
      title: "Customers",
      value: dashboardData?.customers,
      icon: <FaUsers />,
      tooltip: "Total customers who purchased from your store",
    },
    {
      title: "Products",
      value: dashboardData?.productStats?.totalProducts,
      icon: <FaBox />,
      tooltip: `Your store currently has ${dashboardData?.productStats?.activeProducts} active products and ${dashboardData?.productStats?.deletedProducts} deleted products`,
    },
    {
      title: "Categories",
      value: dashboardData?.categoryStats?.totalCategories,
      icon: <FaTags />,
      tooltip: `Your store currently has ${dashboardData?.categoryStats?.parentCategories} parent categories and ${dashboardData?.categoryStats?.childCategories} child categories`,
    },
  ];
  const topProducts = dashboardData?.topProducts;

  const categories = dashboardData?.categories;

  const chartData = {
    labels: dashboardData?.chartData?.labels,

    datasets: [
      {
        data: dashboardData?.chartData?.datasets,
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

  const webURL =
    BASE_URL &&
    dashboardData?.seller?._id &&
    dashboardData?.seller?.businessDetails?.bussinessName
      ? `${BASE_URL}/${dashboardData.seller._id}/${dashboardData.seller.businessDetails.bussinessName}`
      : "";

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
        {stats?.map((item, index) => (
          <Tooltip
            key={index}
            arrow
            title={item.tooltip}
            open={isMobile ? openTooltip === index : undefined}
            onClose={() => setOpenTooltip(null)}
            disableHoverListener={isMobile}
            disableTouchListener={!isMobile}
            TransitionComponent={Zoom}
            slotProps={{
              popper: {
                modifiers: [
                  {
                    name: "offset",
                    options: {
                      offset: [0, -8],
                    },
                  },
                ],
              },
            }}
          >
            <div
              onClick={() => {
                if (isMobile) {
                  setOpenTooltip(openTooltip === index ? null : index);
                }
              }}
              className="bg-white p-4 pb-2 rounded-xl shadow-sm hover:shadow-xl transition hover:scale-[1.01] cursor-pointer"
            >
              {/* Top Row */}
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-black font-medium">{item.title}</p>

                {/* ICON */}
                <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-black text-white">
                  {item.icon}
                </div>
              </div>

              {/* Value */}
              <h2 className="text-xl font-semibold text-gray-900">
                {item.value}
              </h2>
            </div>
          </Tooltip>
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
            {topProducts?.length > 0 ? (
              topProducts?.map((product: any, index: number) => (
                <div
                  key={index}
                  onClick={() => navigate(`/seller/products/${product._id}`)}
                  className="cursor-pointer border-b pb-3"
                >
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">{product.name}</span>

                    <span className="text-sm font-medium">
                      {product.sales} sales - {product.percentage}%
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 h-2 rounded-full">
                    <div
                      className="bg-black h-2 rounded-full"
                      style={{ width: `${product.percentage}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500 text-sm">
                No products added yet
              </div>
            )}
          </div>
        </div>

        {/* 🔥 Top Categories */}
        <div className="bg-white rounded-2xl p-5 hover:shadow-xl transition hover:scale-[1.01]">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <FaTags /> Top Categories
          </h2>

          <div className="space-y-4 h-64 overflow-y-auto pr-2">
            {categories?.length > 0 ? (
              categories?.map((cat: any, index: number) => (
                <div key={index} className="border-b pb-3">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">{cat.name}</span>

                    <span className="text-sm font-medium">
                      {cat.sales} sales - {cat.percentage}%
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 h-2 rounded-full mb-2">
                    <div
                      className="bg-black h-2 rounded-full"
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {cat.children?.map((child: any, i: number) => (
                      <span
                        key={i}
                        className="text-xs bg-gray-200 hover:bg-black hover:text-white px-2 py-1 rounded-full"
                      >
                        {child.name} - {child.sales}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500 text-sm">
                No categories added yet
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 items-center ">
        {/* WALLET CARD */}
        <div className="border rounded-xl p-4 bg-white hover:shadow-2xl transition">
          <h2 className="font-semibold text-lg mb-5 flex items-center gap-2">
            <FaWallet className="text-black" />
            Wallet
          </h2>

          <div className="space-y-1">
            <div className="flex justify-between items-center border rounded-lg p-2 bg-gray-50">
              <div>
                <p className="text-xs text-gray-500">Amount To Credited </p>
                <p className="font-semibold text-lg text-green-600">
                  {dashboardData?.seller?.wallet?.creditedAmount || 0}
                </p>
              </div>

              <FaArrowDown className="text-xl text-green-600" />
            </div>

            <div className="flex justify-between items-center border rounded-lg p-2 bg-gray-50">
              <div>
                <p className="text-xs text-gray-500">Stripe Fee</p>
                <p className="font-semibold text-lg text-red-500">
                  {dashboardData?.seller?.wallet?.stripeFee || 0}
                </p>
              </div>

              <FaPercent className="text-xl text-red-500" />
            </div>

            <div className="flex justify-between items-center border rounded-lg p-2 bg-gray-50">
              <div>
                <p className="text-xs text-gray-500">Total Amount</p>
                <p className="font-semibold text-lg">
                  {dashboardData?.seller?.wallet?.total || 0}
                </p>
              </div>

              <FaWallet className="text-xl text-black" />
            </div>
          </div>
        </div>

        {/* WEBSITE URL CARD */}
        <div className="border rounded-xl p-5 bg-white hover:shadow-2xl transition lg:col-span-2 ">
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

            <div className="overflow-hidden w-full">
              <p className="text-xs text-gray-500 mb-1">Online Store Link</p>

              <p
                onClick={() => window.open(webURL, "_blank")}
                className="font-medium text-sm truncate text-black cursor-pointer hover:underline hover:text-blue-600 transition"
              >
                {webURL}
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* BANNER */}
      <div className="mb-6 mt-6">
        {banner ? (
          <div className="relative overflow-hidden rounded-3xl shadow-sm hover:shadow-xl transition hover:scale-[1.01]">
            <img
              src={`${BASE_URL_IMG}${banner}`}
              alt="Banner"
              className="w-full h-[150px] md:h-[300px] object-cover"
            />

            <button
              onClick={handleBannerDelete}
              className="
          absolute top-2 left-2
          bg-black text-white font-semibold
          px-4 py-2 rounded-xl text-sm
          flex items-center gap-2 border border-black
          hover:bg-white hover:text-black transition
        "
            >
              <FaTrash />
              Delete Banner
            </button>
          </div>
        ) : (
          <label
            className="
    cursor-pointer
    bg-white
    border-2 border-dashed border-gray-500
    rounded-3xl
    h-[150px] md:h-[300px]
    flex flex-col items-center justify-center
    hover:border-black
    hover:shadow-xl
    transition text-gray-700 hover:text-black
  "
          >
            <FaImage className="text-5xl mb-4" />

            <h2 className="font-bold text-xl text-black">
              Click To Add Banner
            </h2>

            <p className="text-gray-800 hover:text-black text-sm mt-2">
              Maximum 1 image
            </p>

            <p className="text-gray-800 hover:text-black text-xs mt-1 text-center px-4">
              Recommended size:{" "}
              <span className="font-medium">1920 × 600 px</span>. Use a
              high-quality wide image for the best display across all devices.
            </p>

            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleBannerUpload}
            />
          </label>
        )}
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
          <h2 className="text-2xl font-bold tracking-wide">
            {dashboardData?.seller?.businessDetails?.bussinessName}
          </h2>

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
            className="mt-5 text-xs text-gray-200 break-all cursor-pointer hover:underline hover:text-blue-600 transition"
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
