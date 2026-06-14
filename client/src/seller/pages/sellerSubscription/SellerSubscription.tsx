import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaCheckCircle,
  FaCrown,
  FaFire,
  FaExclamationTriangle,
} from "react-icons/fa";
import Navbar from "../sellerNavbar/SellerNavbar";
import Footer from "../sellerFooter/SellerFooter";
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { logout, setSeller } from "@/redux/authSlice";

const plan = {
  id: "yearly",
  price: "4999/year",
  features: [
    "Unlimited product listings",
    "Advanced analytics dashboard",
    "Priority customer support",
    "Featured product visibility",
    "Full access to seller growth tools",
  ],
};

const SubscriptionPage: React.FC = () => {
  const seller = useSelector((state: any) => state.auth.seller);
  const [searchParams] = useSearchParams();
  const [sellerSubStatus, setSellerSubStatus] = useState(false);
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
            setSellerSubStatus(true);
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
    // check();
  }, []);
  useEffect(() => {
    const statusSub = searchParams.get("statusSub");
    // const statusStripe = searchParams.get("statusStripe");

    if (!statusSub) return;
    // if (!statusStripe) return;
    // if (statusStripe == "false") {
    //   toast.dismiss();
    //   toast.error("Stripe onboarding failed", {
    //     icon: <FaExclamationTriangle className="text-red-500" />,
    //     style: {
    //       borderRadius: "12px",
    //       background: "#111",
    //       color: "#fff",
    //       border: "1px solid #333",
    //       boxShadow: "0 0 10px rgba(255,255,255,0.1)",
    //     },
    //     duration: 3500,
    //   });
    //   retryOnboard();
    // } else if (statusStripe == "true") {
    //   check();
    // }

    if (statusSub === "false" && sellerSubStatus == true) {
      toast.dismiss();
      toast.error("Payment failed. Please try again", {
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
      navigate("/seller/subscription", { replace: true });
    }
  }, [searchParams, sellerSubStatus]);
  // const check = async () => {
  //   try {
  //     const res = await axios.post("/api/seller/stripe-check/", {
  //       sellerId: seller._id,
  //     });
  //     const { isReady } = res.data;
  //     if (!isReady) {
  //       toast.dismiss();
  //       toast.error("Retry onboarding", {
  //         icon: <FaExclamationTriangle className="text-red-500" />,
  //         style: {
  //           borderRadius: "12px",
  //           background: "#111",
  //           color: "#fff",
  //           border: "1px solid #333",
  //           boxShadow: "0 0 10px rgba(255,255,255,0.1)",
  //         },
  //         duration: 3500,
  //       });
  //       retryOnboard();
  //     }
  //   } catch (err: any) {
  //     console.log(err?.response?.data);
  //   }
  // };
  // const retryOnboard = async () => {
  //   try {
  //     const res = await axios.post("/api/seller/stripe-retry-onboarding", {
  //       sellerId: seller._id,
  //     });
  //     window.location.href = res.data.onboardingUrl;
  //   } catch (err: any) {
  //     console.log(err?.response?.data);
  //   }
  // };

  const handleSubscribe = async () => {
    if (!seller) return;
    try {
      const res = await axios.post("/api/seller/subscribe-session", {
        priceId: import.meta.env.VITE_SUBSCRIPTION_PRICE_ID,
        sellerId: seller._id,
        sellerEmail: seller.email,
      });

      window.location.href = res.data.url;
    } catch (err: any) {
      toast.error(err, {
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

  return (
    <div className="min-h-screen bg-linear-to-br from-black via-gray-900 to-gray-800 flex flex-col text-white">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="relative w-full max-w-md rounded-3xl p-[2px] bg-linear-to-r from-gray-500 via-white to-gray-500 shadow-2xl"
        >
          {/* Glow Card */}
          <div className="bg-black rounded-3xl p-6 relative ">
            {/* Glow effect */}
            <div className="absolute inset-0 opacity-20 bg-linear-to-tr from-white via-transparent to-white blur-2xl" />

            {/* Badge */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-black px-4 py-1 rounded-full text-xs flex items-center gap-1 shadow-lg">
              <FaCrown /> Most Popular
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-center mb-2">
              Seller Subscription
            </h1>

            {/* Plan */}
            <div className="text-center mb-5">
              <p className="text-4xl font-bold mt-2 tracking-wide">
                &#1583;&#46;&#1573; {plan.price}
              </p>

              <p className="text-xs text-gray-400 mt-1">Billed yearly</p>
            </div>

            {/* Divider */}
            <div className="h-px bg-linear-to-r from-transparent via-gray-600 to-transparent mb-5" />

            {/* Features */}
            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3 text-sm"
                >
                  <FaCheckCircle className="text-green-400" />
                  {feature}
                </motion.li>
              ))}
            </ul>

            {/* CTA */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubscribe}
              style={{ cursor: "pointer", position: "relative", zIndex: 50 }}
              className={`pointer-events-auto w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 bg-white text-black hover:bg-black hover:text-white`}
            >
              <FaFire />
              "Subscribe Premium"
            </motion.button>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default SubscriptionPage;
