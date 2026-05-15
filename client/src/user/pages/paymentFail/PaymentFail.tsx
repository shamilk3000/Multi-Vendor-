import { motion } from "framer-motion";
import {
  FaTimesCircle,
  FaBox,
  FaHome,
  FaShoppingBag,
  FaRedo,
  FaRegCreditCard,
} from "react-icons/fa";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Footer from "../footer/Footer";
import Navbar from "../navbar/Navbar";
import api from "../../../features/axios";
import toast from "react-hot-toast";

const PaymentFailed = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const { sellerId, shopName } = useParams();

  const retryPayment = async () => {
    try {
      const res = await toast.promise(
        api.post("/create-checkout-session", {
          orderId,
        }),
        {
          loading: "Redirecting to payment...",
          success: "Opening secure payment page 💳",
          error: "Failed to start payment session ❌",
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

      // Redirect to Stripe Checkout
      window.location.href = res.data.url;
    } catch (err) {
      console.log("Payment retry error:", err);
    }
  };

  return (
    <div className="flex flex-col bg-gray-50 p-0 min-h-screen">
      <Navbar shopName={shopName!} sellerId={sellerId!} />

      {/* CENTERED CARD */}
      <div className="md:py-4 grow flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-xl md:rounded-2xl p-10 max-w-md w-full text-center hover:shadow-2xl transition"
        >
          {/* FAILED ICON */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="flex justify-center mb-6"
          >
            <FaTimesCircle className="text-red-500 text-7xl" />
          </motion.div>

          {/* TITLE */}
          <h1 className="text-2xl font-semibold mb-2 transition-all duration-300 hover:-translate-y-0.5 hover:tracking-wide">
            Payment Failed ❌
          </h1>

          {/* DESCRIPTION */}
          <p className="text-gray-500 mb-6 hover:text-gray-700 hover:drop-shadow-sm transition duration-300">
            Your payment could not be completed. Please try again or use a
            different payment method.
          </p>

          {/* ORDER INFO */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left space-y-3">
            <div className="flex items-center justify-between text-sm group hover:-translate-y-0.5 transition">
              <span className="flex items-center gap-2 text-gray-600">
                <FaBox className="text-amber-500 transition hover:text-amber-600 hover:scale-110" />
                Order ID
              </span>

              <span className="font-medium group-hover:text-black transition">
                #{orderId?.slice(-8).toUpperCase()}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm group hover:-translate-y-0.5 transition">
              <span className="flex items-center gap-2 text-gray-600">
                <FaRegCreditCard className="text-red-500 transition hover:text-red-600 hover:scale-110" />
                Payment
              </span>

              <span className="font-medium text-red-500 group-hover:text-red-600 transition">
                Failed
              </span>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="space-y-3">
            {/* TRY AGAIN */}
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 10px 25px rgba(0,0,0,0.2)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={retryPayment}
              className="cursor-pointer w-full bg-black text-white py-3 rounded-lg flex items-center justify-center gap-2"
            >
              <FaRedo />
              Try Again
            </motion.button>

            {/* HOME */}
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 10px 25px rgba(0,0,0,0.15)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                navigate(`/${sellerId}/${shopName}`, {
                  replace: true,
                })
              }
              className="cursor-pointer w-full border py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100 transition"
            >
              <FaHome />
              Go to Home
            </motion.button>

            {/* SHOP */}
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 10px 25px rgba(0,0,0,0.15)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                navigate(`/${sellerId}/${shopName}/shop`, {
                  replace: true,
                })
              }
              className="cursor-pointer w-full border py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100 transition"
            >
              <FaShoppingBag />
              Continue Shopping
            </motion.button>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default PaymentFailed;
