import { motion } from "framer-motion";
import {
  FaCheckCircle,
  FaBox,
  FaHome,
  FaShoppingBag,
  FaRegCreditCard,
} from "react-icons/fa";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Footer from "../footer/Footer";
import Navbar from "../navbar/Navbar";

const PaymentSuccess = () => {
  const navigate = useNavigate();
   const [searchParams] = useSearchParams();
    const orderId = searchParams.get("orderId");
    const products = searchParams.get("products");
  const { sellerId, shopName } = useParams();
  
  return (
    <div className=" flex flex-col bg-gray-50 p-0">
      <Navbar shopName={shopName!} sellerId={sellerId!} />

      {/* CENTERED CARD */}
      <div className="md:py-4 grow flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-xl md:rounded-2xl p-10 max-w-md w-full text-center hover:shadow-2xl transition"
        >
          {/* SUCCESS ICON */}

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="flex justify-center mb-6"
          >
            <FaCheckCircle className="text-green-500 text-7xl" />
          </motion.div>

          {/* TITLE */}

          <h1 className="text-2xl font-semibold mb-2 transition-all duration-300 hover:-translate-y-0.5 hover:tracking-wide">
            Payment Successful 🎉
          </h1>
          {/* DESCRIPTION */}

          <p className="text-gray-500 mb-6 hover:text-gray-700 hover:drop-shadow-sm transition duration-300">
            Your order has been placed successfully. You will receive a
            confirmation email shortly.
          </p>

          {/* ORDER INFO */}

          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left space-y-3">
            <div className="flex items-center justify-between text-sm group hover:-translate-y-0.5 transition">
              <span className="flex items-center gap-2 text-gray-600 ">
                <FaBox className="text-amber-500 transition hover:text-amber-600 hover:scale-110" />{" "}
                Order ID
              </span>

              <span className="font-medium group-hover:text-black transition">
              #ORD-{orderId}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm group hover:-translate-y-0.5 transition">
              <span className="flex items-center gap-2 text-gray-600 ">
                <FaShoppingBag className="text-indigo-500 transition hover:text-indigo-600 hover:scale-110" />
                Items
              </span>

              <span className="font-medium group-hover:text-black transition">
                {products} Products
              </span>
            </div>

            <div className="flex items-center justify-between text-sm group hover:-translate-y-0.5 transition">
              <span className="flex items-center gap-2 text-gray-600 ">
                <FaRegCreditCard className="text-blue-500 transition  hover:text-blue-600 hover:scale-110" />
                Payment
              </span>

              <span className="font-medium group-hover:text-black transition ">
                Success
              </span>
            </div>
          </div>

          {/* BUTTONS */}

          <div className="space-y-3">
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 10px 25px rgba(0,0,0,0.2)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                navigate(`/${sellerId}/${shopName}`, {
                  replace: true,
                })
              }
              className=" cursor-pointer w-full bg-black text-white py-3 rounded-lg flex items-center justify-center gap-2"
            >
              <FaHome />
              <span className="relative group">
                Go to Home
                <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-white "></span>
              </span>
            </motion.button>

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
              className=" cursor-pointer w-full border py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100 transition"
            >
              <FaShoppingBag />
              <span className="relative group">
                Continue Shopping
                <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-black "></span>
              </span>
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* FOOTER */}
     <Footer  sellerId={sellerId!} />
    </div>
  );
};

export default PaymentSuccess;
