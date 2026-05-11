// import { FaHome, FaShoppingCart, FaUser, FaStore } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Navbar = () => {
  const navigate = useNavigate();
  // const cartItemCount = 3; // Example cart count

  return (
    <>
      <nav className="w-full bg-black text-white relative shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">
          {/* Logo */}
          <motion.div
            onClick={() => navigate("/")}
            whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
            transition={{ type: "spring", stiffness: 300 }}
            className="text-2xl font-bold cursor-pointer mt-2"
          >
            MyShop
          </motion.div>

          {/* Menu Items */}
          <div className="flex items-center gap-10 ">
            {/* Home */}
            {/* <div
              onClick={() => navigate("/")}
              className="group flex flex-col items-center cursor-pointer"
            > */}
            {/* <motion.div
                whileHover={{ y: -4, scale: 1.15 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <FaHome size={20} />
              </motion.div>
              <span className="text-xs mt-1 relative">
                Home
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
              </span>
            </div> */}

            {/* Shop */}
            {/* <div
              onClick={() => navigate("/shop")}
              className="group flex flex-col items-center cursor-pointer"
            >
              <motion.div
                whileHover={{ y: -4, scale: 1.15, rotate: [0, 3, -3, 0] }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <FaStore size={20} />
              </motion.div>
              <span className="text-xs mt-1 relative">
                Shop
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
              </span>
            </div> */}

            {/* Cart */}
            {/* <div
              onClick={() => navigate("/cart")}
              className="group relative flex flex-col items-center cursor-pointer"
            >
              <motion.div
                whileHover={{ y: -4, scale: 1.15, rotate: [0, 3, -3, 0] }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <FaShoppingCart size={20} />
              </motion.div> */}

            {/* Cart Badge */}
            {/* {cartItemCount > 0 && (
                <motion.span
                  className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                >
                  {cartItemCount}
                </motion.span>
              )}

              <span className="text-xs mt-1 relative">
                Cart
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
              </span>
            </div> */}

            {/* Profile */}
            {/* <div
              onClick={() => navigate("/profile")}
              className="group flex flex-col items-center cursor-pointer"
            >
              <motion.div
                whileHover={{ y: -4, scale: 1.15, rotate: [0, -3, 3, 0] }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <FaUser size={20} />
              </motion.div>
              <span className="text-xs mt-1 relative">
                Profile
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
              </span>
            </div> */}
          </div>
        </div>
      </nav>
      {/* <div className="h-10"></div> */}
    </>
  );
};

export default Navbar;
