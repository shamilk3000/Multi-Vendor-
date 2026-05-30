import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaSignInAlt,
  FaUserShield,
  FaTimesCircle,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import Navbar from "../navbar/adminNavbar";
import Footer from "../../../seller/pages/sellerFooter/SellerFooter";
import toast from "react-hot-toast";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {}, []);

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [success, setSuccess] = useState({
    email: false,
    password: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear errors & success if input is empty
    if (value.trim() === "") {
      setErrors((prev) => ({ ...prev, [name]: "" }));
      setSuccess((prev) => ({ ...prev, [name]: false }));
      return;
    }

    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(value)) {
        setErrors((prev) => ({
          ...prev,
          email: "Invalid email address",
        }));

        setSuccess((prev) => ({
          ...prev,
          email: false,
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          email: "",
        }));

        setSuccess((prev) => ({
          ...prev,
          email: true,
        }));

        setTimeout(() => {
          setSuccess((prev) => ({
            ...prev,
            email: false,
          }));
        }, 5000);
      }
    }

    if (name === "password") {
      if (value.length < 6) {
        setErrors((prev) => ({
          ...prev,
          password: "Password must be at least 6 characters",
        }));

        setSuccess((prev) => ({
          ...prev,
          password: false,
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          password: "",
        }));

        setSuccess((prev) => ({
          ...prev,
          password: true,
        }));

        setTimeout(() => {
          setSuccess((prev) => ({
            ...prev,
            password: false,
          }));
        }, 5000);
      }
    }
  };

  const handleLogin = async () => {
    if (errors.email || errors.password) {
      return toast.error(errors.email || errors.password, {
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
    if (formData.email.length === 0 || formData.password.length === 0) {
      return toast.error("Please fill all fields", {
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

    try {
      const promise = axios.post("/api/admin/admin-login", {
        email: formData.email,
        password: formData.password,
      });

      const res = await toast.promise(
        promise,
        {
          loading: "Loging in...",
          success: "Welcome back 👋! Login successful",
          error: (err) => err.response?.data?.message || "Failed to login",
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
      navigate("/admin/home", {
        state: { admin: res.data.admin },
      });
    } catch (error: any) {
      console.log(error.response?.data);
    }
  };

  const inputStyle =
    "w-full border rounded-lg p-2.5 pl-9 text-sm transition-all duration-300 focus:ring-2 focus:ring-black focus:scale-[1.02] hover:border-black hover:scale-[1.01]";

  const wave = {
    hover: {
      transition: { staggerChildren: 0.05 },
    },
  };

  const letter = {
    initial: { y: 0 },
    hover: {
      y: [-2, -6, 0],
      transition: { duration: 0.4 },
    },
  };

  const WaveText = ({
    text,
    className,
  }: {
    text: string;
    className?: string;
  }) => {
    return (
      <motion.div
        variants={wave}
        initial="initial"
        whileHover="hover"
        className={`inline-block cursor-pointer ${className}`}
      >
        {text.split("").map((char, index) => (
          <motion.span key={index} variants={letter} className="inline-block">
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </motion.div>
    );
  };

  return (
    <div className=" flex flex-col bg-gray-50 p-0">
      <Navbar />

      <div className="md:py-5 flex   min-h-[calc(100vh-300px)] md:min-h-[calc(100vh-250px)] items-center justify-center bg-gray-50 relative overflow-hidden">
        <motion.div
          animate={{ x: [0, 80, 0], y: [0, -60, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute w-96 h-96 bg-gray-300 rounded-full blur-3xl opacity-20 top-[-100px] left-[-100px]"
        />

        <motion.div
          animate={{ x: [0, -70, 0], y: [0, 50, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute w-96 h-96 bg-gray-400 rounded-full blur-3xl opacity-20 bottom-[-120px] right-[-120px]"
        />

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -8, boxShadow: "0px 25px 60px rgba(0,0,0,0.25)" }}
          transition={{ duration: 0.35 }}
          className="bg-white shadow-xl md:rounded-2xl p-7 w-full max-w-md relative z-10"
        >
          <div className="flex flex-col items-center mb-6">
            <motion.div
              whileHover={{ rotate: 10, scale: 1.1 }}
              className="bg-black text-white p-3 rounded-full mb-3"
            >
              <FaUserShield />
            </motion.div>

            <WaveText text="Welcome Back" className="text-2xl font-semibold" />
            <WaveText
              text="Login to your account"
              className="text-gray-500 text-sm"
            />
          </div>

          <div className="space-y-3">
            {/* EMAIL */}

            <div>
              <div className="relative group">
                <FaEnvelope className="absolute left-3 top-3 text-gray-400 group-focus-within:text-black transition transform group-hover:scale-105  group-hover:text-black" />

                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  onChange={handleChange}
                  className={inputStyle}
                />
              </div>

              <AnimatePresence mode="wait">
                {(errors.email || success.email) && (
                  <motion.p
                    key={errors.email ? "error" : "success"}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={
                      errors.email
                        ? { opacity: 0 } // error disappears without slide
                        : { opacity: 0, y: -20 } // success slides up when leaving
                    }
                    transition={{ duration: 0.23, ease: "easeOut" }}
                    className={`text-xs mt-2 ml-1 flex items-center gap-1 ${
                      errors.email ? "text-red-500" : "text-green-600"
                    }`}
                  >
                    {errors.email ? <FaTimesCircle /> : <FaCheckCircle />}
                    {errors.email ? errors.email : "Valid email"}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* PASSWORD */}

            <div>
              <div className="relative group">
                <FaLock className="absolute left-3 top-3 text-gray-400 group-focus-within:text-black transition transform group-hover:scale-105  group-hover:text-black" />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  onChange={handleChange}
                  className={inputStyle}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-black cursor-pointer"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <AnimatePresence mode="wait">
                {(errors.password || success.password) && (
                  <motion.p
                    key={errors.password ? "error" : "success"}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={
                      errors.password
                        ? { opacity: 0 } // error disappears without slide
                        : { opacity: 0, y: -20 } // success slides up when leaving
                    }
                    transition={{ duration: 0.23, ease: "easeOut" }}
                    className={`text-xs mt-2 ml-1 flex items-center gap-1 ${
                      errors.password ? "text-red-500" : "text-green-600"
                    }`}
                  >
                    {errors.password ? <FaTimesCircle /> : <FaCheckCircle />}
                    {errors.password
                      ? errors.password
                      : "Password length is valid"}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>

          <motion.button
            whileHover={{
              scale: 1.03,
              boxShadow: "0px 12px 30px rgba(0,0,0,0.25)",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogin}
            className=" cursor-pointer w-full bg-black text-white py-2.5 rounded-lg flex items-center justify-center gap-2 mt-4 mb-4"
          >
            <FaSignInAlt />
            Login
          </motion.button>
        </motion.div>
      </div>
      {/* <Toaster containerStyle={{ top: 75 }} position="top-right" /> */}
      <Footer />
    </div>
  );
};

export default Login;
