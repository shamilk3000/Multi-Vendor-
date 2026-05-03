import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Footer from "../sellerFooter/SellerFooter";
import Navbar from "../sellerNavbar/SellerNavbar";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  FaClock,
  FaExclamationCircle,
  FaExclamationTriangle,
  FaKey,
  FaShieldAlt,
  FaUserShield,
} from "react-icons/fa";
import axios from "axios";

const OTPVerification: React.FC = () => {
  const OTP_TIME = 300; // 5 minutes
  const location = useLocation();
  const navigate = useNavigate();
  type SellerFpData = string;

  const [sellerFpData, setSellerFpData] = useState<SellerFpData | null>(null);

  useEffect(() => {
    if (location.state?.sellerFpData) {
      setSellerFpData(location.state.sellerFpData);

      // ✅ clear state after reading
      navigate(location.pathname, { replace: true, state: {} });
    } else {
      // ❌ no data → redirect
      navigate("/seller/login", { replace: true });
    }
  }, []);
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(OTP_TIME);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      setExpired(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleChange = (value: string, index: number) => {
    if (expired) return;

    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      next?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`);
      prev?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (expired) return;

    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      toast.error("Enter full OTP", {
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
      return;
    }

    try {
      const promise = axios.post(
        "/api/seller/seller-forget-password-otp-verify",
        {
          email: sellerFpData,
          otp: enteredOtp,
        },
      );

      await toast.promise(
        promise,
        {
          loading: "Verifying OTP...",
          success: (res) => res.data.message || "OTP verified successfully",
          error: (err) =>
            err.response?.data?.message || "OTP verification failed",
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
    navigate("/seller/forgot-password", {
        state: { FpData: sellerFpData },
      });
    } catch (error: any) {
      console.log("OTP VERIFY ERROR 👉", error?.response?.data);
    }
  };

  const handleResend = async () => {
    if (!expired) return;
    if (!sellerFpData) return;

    try {
      const promise = axios.post(
        "/api/seller/seller-forget-password-otp-send",
        {
          email: sellerFpData,
        },
      );

      await toast.promise(
        promise,
        {
          loading: "Resending OTP....",
          success: () => "OTP Resent Successful 📩 ",
          error: () => "Failed to resent OTP",
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

      setOtp(["", "", "", "", "", ""]);
      setTimeLeft(OTP_TIME);
      setExpired(false);
    } catch (error: any) {
      console.log(error.response?.data);
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className=" flex flex-col bg-gray-50 p-0">
      <Navbar />

      <div className="py-18 flex justify-center items-center  bg-gray-100 px-4 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-sm sm:max-w-md bg-white rounded-3xl p-6 md:p-15 shadow-lg border border-gray-200 max-h-[90vh] overflow-y-auto"
        >
          {/* Title */}

          <motion.h1
            whileHover={{ scale: 1.05 }}
            className="group text-2xl sm:text-3xl font-bold text-center text-black mb-2 flex items-center justify-center gap-2"
          >
            <FaUserShield className="text-black transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-0.5" />

            <span className="transition-all duration-300 group-hover:tracking-wide">
              OTP Verification
            </span>
          </motion.h1>

          <p className="text-gray-500 text-xs sm:text-sm text-center mb-6">
            Enter the 6 digit code sent to your email
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP INPUTS */}

            <div className="flex justify-center gap-2 sm:gap-3">
              {otp.map((digit, index) => (
                <motion.input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  disabled={expired}
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  whileFocus={{ scale: 1.1 }}
                  className={`w-10 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14
                text-center text-lg sm:text-xl font-semibold
                rounded-xl border tracking-widest
                transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-black
                ${
                  expired
                    ? "bg-gray-200 cursor-not-allowed"
                    : "bg-gray-50 hover:bg-white"
                }`}
                />
              ))}
            </div>

            {/* TIMER */}

            <div className="text-center text-xs sm:text-sm flex items-center justify-center gap-1">
              {!expired ? (
                <motion.span
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                  className="text-gray-600 flex items-center gap-1"
                >
                  <FaClock className="text-gray-500" />
                  Expires in{" "}
                  <span className="font-semibold text-black">
                    {minutes}:{seconds.toString().padStart(2, "0")}
                  </span>
                </motion.span>
              ) : (
                <span className="text-red-500 font-medium flex items-center justify-center gap-1">
                  <FaExclamationCircle />
                  OTP expired
                </span>
              )}
            </div>

            {/* VERIFY BUTTON */}

            <motion.button
              whileHover={{ scale: expired ? 1 : 1.03 }}
              whileTap={{ scale: expired ? 1 : 0.95 }}
              disabled={expired}
              className={`w-full py-3 rounded-xl font-semibold text-sm transition flex items-center justify-center gap-2
  ${
    expired
      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
      : "bg-black text-white shadow-md hover:shadow-lg cursor-pointer"
  }`}
            >
              <FaShieldAlt className="text-sm" />
              Verify OTP
            </motion.button>

            {/* RESEND BUTTON */}

            <button
              type="button"
              onClick={handleResend}
              disabled={!expired}
              className={`w-full text-xs sm:text-sm font-medium transition flex items-center justify-center gap-2
  ${
    expired
      ? "text-black hover:underline cursor-pointer"
      : "text-gray-400 cursor-not-allowed"
  }`}
            >
              <FaKey className="text-xs" />
              Resend OTP
            </button>
          </form>
        </motion.div>
      </div>
      {/* <Toaster containerStyle={{ top: 75 }} position="top-right" /> */}

      <Footer />
    </div>
  );
};

export default OTPVerification;
