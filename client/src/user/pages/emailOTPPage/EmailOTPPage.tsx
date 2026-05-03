import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "../footer/Footer";
import Navbar from "../navbar/Navbar";
import {
  FaEnvelope,
  FaPaperPlane,
  FaTimesCircle,
  FaCheckCircle,
} from "react-icons/fa";
import OTPVerification from "../verifyOtp/VerifyOtp"; // your OTP page

const EmailOTPPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setErrors({ email: "Enter a valid email" });
      setVisibleWarnings({ email: true });
      return;
    }
    setErrors({});
    setOtpSent(true);
    alert(`OTP sent to ${email} 📩`);
  };

  if (otpSent) return <OTPVerification />;

  const inputStyle = `
  w-full border rounded-lg p-2.5 pl-9 text-sm 
  transition-all duration-300 
  focus:ring-2 focus:ring-black focus:scale-[1.02] 
  hover:border-black hover:scale-[1.01]
`;

  return (
    <div className=" flex flex-col bg-gray-50">
      <Navbar />

      <div className="min-h-[calc(100vh-350px)] md:min-h-[calc(100vh-250px)] flex justify-center items-center bg-gray-100 px-4">
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

      <Footer />
    </div>
  );
};

export default EmailOTPPage;
