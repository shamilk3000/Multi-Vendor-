import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "../footer/Footer";
import Navbar from "../navbar/Navbar";
import api from "../../../features/axios";
import {
  FaEnvelope,
  FaPaperPlane,
  FaTimesCircle,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
// import OTPVerification from "../verifyOtp/VerifyOtp"; // your OTP page
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const EmailOTPPage: React.FC = () => {
  const sellerId = useSelector((state: any) => state.auth.sellerId);
  const shopName = useSelector((state: any) => state.auth.shopName);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  // const [otpSent, setOtpSent] = useState(false);
  const [errors, setErrors] = useState<{ email?: string }>({});
  const [visibleWarnings, setVisibleWarnings] = useState<{ email: boolean }>({
    email: false,
  });

  const validateEmail = (value: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  };

  const handleChange = (value: string) => {
    setEmail(value);
    if (!value) {
      setErrors({ email: "Email is required" });
      setVisibleWarnings({ email: true });
      return;
    }

    if (!validateEmail(value)) {
      setErrors({ email: "Enter a valid email" });
      setVisibleWarnings({ email: true });
    } else {
      setErrors({});
      setVisibleWarnings({ email: true });
      // Hide success message after 5 seconds
      setTimeout(() => setVisibleWarnings({ email: false }), 5000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      toast.error("Enter a valid email", {
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
      setErrors({ email: "Enter a valid email" });
      setVisibleWarnings({ email: true });
      return;
    }
    setErrors({});

    try {
      const promise = api.post(
        `/${sellerId}/${shopName}/user-forget-password-otp-send`,
        {
          email,
        },
      );

      await toast.promise(
        promise,
        {
          loading: "Sending OTP...",
          success: (res) => res.data.message || "OTP sent successfully",
          error: (err) => err.response?.data?.message || "Failed to send OTP",
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

      navigate(`/${sellerId}/${shopName}/fp-otp-verification`, {
        state: { userFpData: email },
      });
    } catch (error: any) {
      console.log("OTP SENDING ERROR 👉", error?.response?.data);
    }
  };

  const inputStyle = `
  w-full border rounded-lg p-2.5 pl-9 text-sm 
  transition-all duration-300 
  focus:ring-2 focus:ring-black focus:scale-[1.02] 
  hover:border-black hover:scale-[1.01]
`;

  return (
    <div className=" flex flex-col bg-gray-50">
      <Navbar shopName={shopName!} sellerId={sellerId!} />

      <div className="   min-h-[calc(100vh-300px)] md:min-h-[calc(100vh-230px)] flex justify-center items-center bg-gray-100 px-4">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          whileHover={{ scale: 1.03 }}
          className="w-full max-w-sm sm:max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-lg border border-gray-200"
        >
          <motion.h1
            whileHover={{ scale: 1.05 }}
            className="group text-xl sm:text-2xl font-bold text-center text-black mb-4 flex items-center justify-center gap-2"
          >
            <FaEnvelope
              className="text-black transition-all duration-300 group-hover:scale-110"
              size={25}
            />
            Enter Your Email
          </motion.h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative group mb-2">
              <FaEnvelope className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-black transition transform group-hover:scale-105  group-hover:text-black " />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => handleChange(e.target.value)}
                className={inputStyle}
              />

              {/* Animated Warning / Success */}
              <AnimatePresence mode="wait">
                {(errors.email || (email && visibleWarnings.email)) && (
                  <motion.p
                    key={errors.email ? "error" : "success"}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={
                      errors.email ? { opacity: 0 } : { opacity: 0, y: -20 }
                    }
                    transition={{ duration: 0.23, ease: "easeOut" }}
                    className={`text-xs mb-2 mt-2 ml-1 flex items-center gap-1 ${
                      errors.email ? "text-red-500" : "text-green-600"
                    }`}
                  >
                    {errors.email ? <FaTimesCircle /> : <FaCheckCircle />}
                    {errors.email ? errors.email : "Valid email"}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className=" cursor-pointer mt-4 mx-auto w-80 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 bg-black text-white shadow-md hover:shadow-lg"
            >
              <FaPaperPlane />
              Send OTP
            </motion.button>
          </form>
        </motion.div>
      </div>

      <Footer sellerId={sellerId!} />
    </div>
  );
};

export default EmailOTPPage;
