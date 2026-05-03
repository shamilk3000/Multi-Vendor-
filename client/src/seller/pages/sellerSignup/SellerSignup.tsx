import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaUser,
  FaUserPlus,
  FaUserShield,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import Navbar from "../sellerNavbar/SellerNavbar";
import Footer from "../sellerFooter/SellerFooter";
import toast from "react-hot-toast";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { logout, setSeller } from "../../../redux/authSlice";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await axios.get("/api/seller/coockie-test", {
          withCredentials: true,
        });

        if (res.data.success == true) {
          dispatch(setSeller(res.data.seller));
          navigate("/seller");
        } else {
          if (res.data?.status == "PENDING_PAYMENT") {
            dispatch(setSeller(res.data.seller));
            navigate("/seller/subscription");
          } else {
            dispatch(logout());
          }
        }
      } catch (err) {
        dispatch(logout());
      }
    };
    checkSession();
  }, []);
  const googleLogin = useGoogleLogin({
    flow: "auth-code", // ✅ keep this
    onSuccess: async (credentialResponse) => {
      try {
        const res = await toast.promise(
          axios.post("/api/seller/google-auth", {
            credential: credentialResponse.code,
          }),
          {
            loading: "Signing in with Google...",
            success: (res) => {
              if (res.data.seller.isComplete == false) {
                return res.data.message;
              }
              if (res.data.seller.accountStatus == "PENDING_PAYMENT") {
                return "Your subscription payment is pending";
              }
              if (res.data.seller.accountStatus == "SUSPENDED") {
                return "Your account is suspended. Please contact the admin";
              }
              return res.data.message;
            },
            error: (err) =>
              err?.response?.data?.message ||
              err?.response?.statusText ||
              "Google signup failed",
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

        if (res.data.seller.isComplete == false) {
          navigate("/seller/details-entry", {
            state: { sellerEmail: res.data.seller.email },
          });
        } else {
          
          if (res.data.seller.accountStatus == "PENDING_PAYMENT") {
            dispatch(setSeller(res.data.seller));
            navigate("/seller/subscription");
          } else if (res.data.seller.accountStatus == "SUSPENDED") {
            navigate("/seller/login");
          } else {
            dispatch(setSeller(res.data.seller));
            navigate("/seller");
          }
        }
      } catch (error: any) {
        console.log("ERROR 👉", error?.response);
      }
    },

    onError: () => {
      toast.error("Google Signup failed", {
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
    },
  });

  const handleGoogleSignup = () => {
    googleLogin(); // 🔥 trigger popup
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [visibleWarnings, setVisibleWarnings] = useState({
    email: true,
    password: true,
    confirmPassword: true,
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // EMAIL VALIDATION
    if (name === "email") {
      setVisibleWarnings((prev) => ({ ...prev, email: true }));

      if (!validateEmail(value)) {
        setErrors((prev) => ({
          ...prev,
          email: "Enter a valid email",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          email: "",
        }));
      }
    }

    // PASSWORD VALIDATION
    if (name === "password") {
      setVisibleWarnings((prev) => ({ ...prev, password: true }));

      if (value.length < 6) {
        setErrors((prev) => ({
          ...prev,
          password: "Password must be at least 6 characters",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          password: "",
        }));
      }

      if (formData.confirmPassword && value !== formData.confirmPassword) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: "Passwords do not match",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: "",
        }));
      }
    }

    // CONFIRM PASSWORD VALIDATION
    if (name === "confirmPassword") {
      setVisibleWarnings((prev) => ({ ...prev, confirmPassword: true }));

      if (value !== formData.password) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: "Passwords do not match",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: "",
        }));
      }
    }
  };

  // AUTO DISAPPEAR AFTER 5 SECONDS
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    (Object.keys(formData) as (keyof typeof formData)[]).forEach((field) => {
      if (formData[field] && (visibleWarnings as any)[field]) {
        const timer = setTimeout(() => {
          setVisibleWarnings((prev) => ({
            ...prev,
            [field]: false,
          }));
        }, 5000);

        timers.push(timer);
      }
    });

    return () => timers.forEach((timer) => clearTimeout(timer));
  }, [formData]);

  const handleSignup = async () => {
    if (
      !formData.name.length ||
      !formData.email.length ||
      !formData.password.length ||
      !formData.confirmPassword.length
    ) {
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

    if (errors.email || errors.password || errors.confirmPassword) {
      return toast.error(
        errors.email || errors.password || errors.confirmPassword,
        {
          icon: <FaExclamationTriangle className="text-red-500" />,
          style: {
            borderRadius: "12px",
            background: "#111",
            color: "#fff",
            border: "1px solid #333",
            boxShadow: "0 0 10px rgba(255,255,255,0.1)",
          },
          duration: 3500,
        },
      );
    } else {
      try {
        const promise = axios.post("/api/seller/start-seller-signup", {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });

        const res = await toast.promise(
          promise,
          {
            loading: "Signing up...",
            success: (res) =>
              res.data.message ||
              "Seller profile completed. Please choose a plan",
            error: (err) => err.response?.data?.message || "Failed to signup",
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

        navigate("/seller/otp-verification", {
          state: { sellerData: res.data.sellerData },
        });
      } catch (error: any) {
        console.log(error.response?.data);
      }
    }
  };

  const inputStyle =
    "w-full border rounded-lg p-2.5 pl-9 text-sm transition-all duration-300 focus:ring-2 focus:ring-black focus:scale-[1.02] hover:border-black hover:scale-[1.01]";

  const wave = {
    hover: {
      transition: {
        staggerChildren: 0.04,
      },
    },
  };

  const letter = {
    initial: { y: 0 },
    hover: {
      y: [-2, -5, 0],
      transition: { duration: 0.35 },
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
    <>
      <div className=" flex flex-col bg-gray-50 p-0">
        <Navbar />

        <div className="md:py-5 flex items-center justify-center bg-gray-50 relative overflow-hidden">
          {/* BACKGROUND BLOBS */}

          <motion.div
            animate={{ x: [0, 70, 0], y: [0, -50, 0] }}
            transition={{ duration: 12, repeat: Infinity }}
            className="absolute w-80 h-80 bg-gray-300 rounded-full blur-3xl opacity-20 top-[-80px] left-[-80px]"
          />

          <motion.div
            animate={{ x: [0, -60, 0], y: [0, 40, 0] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute w-80 h-80 bg-gray-400 rounded-full blur-3xl opacity-20 bottom-[-100px] right-[-100px]"
          />

          {/* SIGNUP CARD */}

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{
              y: -6,
              boxShadow: "0px 20px 50px rgba(0,0,0,0.25)",
            }}
            transition={{ duration: 0.35 }}
            className="bg-white shadow-xl md:rounded-2xl p-7 w-full max-w-md relative z-10"
          >
            {/* HEADER */}

            <div className="flex flex-col items-center mb-5">
              <motion.div
                whileHover={{ rotate: 10, scale: 1.1 }}
                className="bg-black text-white p-2.5 rounded-full mb-2"
              >
                <FaUserShield size={16} />
              </motion.div>

              <WaveText
                text="Create Account"
                className="text-xl font-semibold"
              />

              <WaveText
                text="Join us and start shopping"
                className="text-gray-500 text-xs"
              />
            </div>

            {/* NAME */}

            <div className="relative group mb-2">
              <FaUser className="absolute left-3 top-3 text-gray-400 group-focus-within:text-black transition transform group-hover:scale-105  group-hover:text-black " />

              <input
                type="text"
                name="name"
                placeholder="Full Name"
                onChange={handleChange}
                className={inputStyle}
              />
            </div>

            {/* EMAIL */}

            <div className="relative group mb-2">
              <FaEnvelope className="absolute left-3 top-3 text-gray-400 group-focus-within:text-black transition transform group-hover:scale-105  group-hover:text-black " />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                onChange={handleChange}
                className={inputStyle}
              />
            </div>

            <AnimatePresence mode="wait">
              {(errors.email || (formData.email && visibleWarnings.email)) && (
                <motion.p
                  key={errors.email ? "error" : "success"}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={
                    errors.email
                      ? { opacity: 0 } // error fades only
                      : { opacity: 0, y: -20 } // success slides up
                  }
                  transition={{ duration: 0.23, ease: "easeOut" }}
                  className={`text-xs mb-2 ml-1 flex items-center gap-1 ${errors.email ? "text-red-500" : "text-green-600"}`}
                >
                  {errors.email ? <FaTimesCircle /> : <FaCheckCircle />}
                  {errors.email ? errors.email : "Valid email"}
                </motion.p>
              )}
            </AnimatePresence>

            {/* PASSWORD */}

            <div className="relative group mb-2">
              <FaLock className="absolute left-3 top-3 text-gray-400 group-focus-within:text-black transition transform group-hover:scale-105  group-hover:text-black " />

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
                className="absolute right-3 top-3.5 text-gray-400 cursor-pointer"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <AnimatePresence mode="wait">
              {(errors.password ||
                (formData.password && visibleWarnings.password)) && (
                <motion.p
                  key={errors.password ? "error" : "success"}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={
                    errors.password ? { opacity: 0 } : { opacity: 0, y: -20 }
                  }
                  transition={{ duration: 0.23, ease: "easeOut" }}
                  className={`text-xs mb-2 ml-1 flex items-center gap-1 ${errors.password ? "text-red-500" : "text-green-600"}`}
                >
                  {errors.password ? <FaTimesCircle /> : <FaCheckCircle />}
                  {errors.password
                    ? errors.password
                    : "Password length is valid"}
                </motion.p>
              )}
            </AnimatePresence>

            {/* CONFIRM PASSWORD */}

            <div className="relative group mb-2">
              <FaLock className="absolute left-3 top-3 text-gray-400 group-focus-within:text-black transition transform group-hover:scale-105  group-hover:text-black " />

              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                onChange={handleChange}
                className={inputStyle}
              />

              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-3.5 text-gray-400 cursor-pointer"
              >
                {showConfirm ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <AnimatePresence mode="wait">
              {(errors.confirmPassword ||
                (formData.confirmPassword &&
                  visibleWarnings.confirmPassword)) && (
                <motion.p
                  key={errors.confirmPassword ? "error" : "success"}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={
                    errors.confirmPassword
                      ? { opacity: 0 } // error fades out only
                      : { opacity: 0, y: -20 } // success slides up when leaving
                  }
                  transition={{ duration: 0.23, ease: "easeOut" }}
                  className={`text-xs mb-3 ml-1 flex items-center gap-1 ${errors.confirmPassword ? "text-red-500" : "text-green-600"}`}
                >
                  {errors.confirmPassword ? (
                    <FaTimesCircle />
                  ) : (
                    <FaCheckCircle />
                  )}
                  {errors.confirmPassword
                    ? errors.confirmPassword
                    : "Passwords match"}
                </motion.p>
              )}
            </AnimatePresence>

            {/* SIGNUP BUTTON */}

            <motion.button
              whileHover={{
                scale: 1.04,
                boxShadow: "0px 10px 25px rgba(0,0,0,0.25)",
              }}
              whileTap={{ scale: 0.96 }}
              onClick={handleSignup}
              className=" cursor-pointer w-full bg-black text-white py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm mb-4"
            >
              <FaUserPlus />
              Sign Up
            </motion.button>

            {/* DIVIDER */}

            <div className="flex items-center mb-4">
              <div className="flex-1 h-px bg-gray-300"></div>

              <span className="px-2 text-xs text-gray-500">OR</span>

              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            {/* GOOGLE SIGNUP */}

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleGoogleSignup}
              className=" cursor-pointer relative w-full border py-2.5 rounded-lg flex items-center justify-center gap-3 bg-white hover:bg-gray-50 transition overflow-hidden group shadow-sm hover:shadow-md text-sm"
            >
              <FcGoogle
                size={20}
                className="transition-transform duration-300 group-hover:scale-125"
              />
              Continue with Google
              <span className="absolute -left-full top-0 h-full w-full bg-linear-to-r from-transparent via-white/60 to-transparent group-hover:left-full transition-all duration-700"></span>
            </motion.button>

            {/* LOGIN */}

            <p className="text-center text-xs text-gray-500 mt-4">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/seller/login")}
                className="text-black relative cursor-pointer group "
              >
                Login
                <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-black transition-all duration-300 group-hover:w-full"></span>
              </span>
            </p>
          </motion.div>
          {/* <Toaster containerStyle={{ top: 75 }} position="top-right" /> */}
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Signup;
