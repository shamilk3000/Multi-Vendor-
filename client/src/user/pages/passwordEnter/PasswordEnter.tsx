import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "../footer/Footer";
import Navbar from "../navbar/Navbar";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaTimesCircle,
  FaLock,
  FaEdit,
  FaExclamationTriangle,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import api from "../../../features/axios";

const ChangePassword: React.FC = () => {
     const sellerId = useSelector((state: any) => state.auth.sellerId);
      const shopName = useSelector((state: any) => state.auth.shopName);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  type FpData = string;

  const [FpData, setFpData] = useState<FpData | null>(null);

  useEffect(() => {
    if (location.state?.FpData) {
      setFpData(location.state.FpData);

      // ✅ clear state after reading
      navigate(location.pathname, { replace: true, state: {} });
    } else {
      // ❌ no data → redirect
      navigate(`/${sellerId}/${shopName}/login`, { replace: true });
    }
  }, []);
  const [showNewPassSuccess, setShowNewPassSuccess] = useState(true);
  const [showConfirmPassSuccess, setShowConfirmPassSuccess] = useState(true);

  const minLengthValid = newPassword.length >= 6;
  const passwordsMatch =
    confirmPassword.length > 0 && newPassword === confirmPassword;
  const passwordsNotMatch =
    confirmPassword.length > 0 && newPassword !== confirmPassword;

  useEffect(() => {
    if (minLengthValid) {
      setShowNewPassSuccess(true);
      const timer = setTimeout(() => setShowNewPassSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [minLengthValid]);

  useEffect(() => {
    if (passwordsMatch) {
      setShowConfirmPassSuccess(true);
      const timer = setTimeout(() => setShowConfirmPassSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [passwordsMatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!minLengthValid) {
      toast.error("Password must be at least 6 characters", {
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

    if (!passwordsMatch) {
      toast.error("Passwords do not match", {
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
      const promise = api.post(`/${sellerId}/${shopName}/user-reset-password`, {
        email: FpData,
        password: newPassword,
      });

      await toast.promise(
        promise,
        {
          loading: "Changing password...",
          success: (res) => res.data.message || "Password changed successfully",
          error: (err) =>
            err.response?.data?.message || "Failed to change password",
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
  
      navigate(`/${sellerId}/${shopName}/login`);
    } catch (error: any) {
      console.log("PASSWORD CHANGING ERROR 👉", error?.response?.data);
    }
  };

  const inputStyle =
    "w-full border rounded-lg p-2.5 pl-9 text-sm transition-all duration-300 focus:ring-2 focus:ring-black focus:scale-[1.02] hover:border-black hover:scale-[1.01]";

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* ✅ NAVBAR */}
      <Navbar shopName={shopName!} />

      {/* ✅ MAIN CONTENT */}
      <div className="flex flex-1 items-center justify-center px-2 md:px-4 py-10 bg-gray-100">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full md:max-w-lg bg-white md:min-h-2 p-4 md:p-6 rounded-3xl shadow-lg border border-gray-200"
        >
          {/* TITLE */}
          <h1 className="text-2xl sm:text-3xl font-bold mb-5 text-center flex items-center justify-center gap-2 wave-hover">
            <FaLock size={25} />
            Change Password
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* NEW PASSWORD */}
            <div className="wave-hover">
              <label className="text-sm font-medium text-gray-700">
                New Password
              </label>

              <div className="relative mt-1">
                <FaLock className="absolute left-3 top-3 text-gray-400" />
                <input
                  type={showNewPass ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className={inputStyle}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  className="absolute right-3 top-3.5 text-gray-500"
                >
                  {showNewPass ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <AnimatePresence>
                {newPassword.length > 0 && (
                  <>
                    {!minLengthValid && (
                      <motion.p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                        <FaTimesCircle />
                        Password must be at least 6 characters
                      </motion.p>
                    )}
                    {minLengthValid && showNewPassSuccess && (
                      <motion.p className="text-green-600 text-sm mt-2 flex items-center gap-1">
                        <FaCheckCircle />
                        Password length is valid
                      </motion.p>
                    )}
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="wave-hover">
              <label className="text-sm font-medium text-gray-700">
                Confirm Password
              </label>

              <div className="relative mt-1">
                <FaLock className="absolute left-3 top-3 text-gray-400" />
                <input
                  type={showConfirmPass ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  className={inputStyle}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  className="absolute right-3 top-3.5 text-gray-500"
                >
                  {showConfirmPass ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <AnimatePresence>
                {confirmPassword.length > 0 && (
                  <>
                    {passwordsNotMatch && (
                      <motion.p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                        <FaTimesCircle />
                        Passwords do not match
                      </motion.p>
                    )}
                    {passwordsMatch && showConfirmPassSuccess && (
                      <motion.p className="text-green-600 text-sm mt-2 flex items-center gap-1">
                        <FaCheckCircle />
                        Passwords match
                      </motion.p>
                    )}
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* BUTTON */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              className={
                "w-full py-3 flex justify-center gap-2 rounded-xl font-semibold bg-black text-white"
              }
            >
              <FaEdit className="my-auto" />
              Update Password
            </motion.button>
          </form>
        </motion.div>
      </div>

      {/* ✅ FOOTER */}
      <Footer />
      {/* <Toaster containerStyle={{ top: 75 }} position="top-right" /> */}

      {/* 🎯 WAVE ANIMATION */}
      <style>
        {`
          .wave-hover:hover {
            animation: wave 0.5s ease-in-out;
          }

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

export default ChangePassword;
