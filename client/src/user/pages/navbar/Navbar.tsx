import {
  FaHome,
  FaShoppingCart,
  FaUser,
  FaStore,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

type ProductListProps = {
  shopName: string;
  sellerId: string;
};

const Navbar = ({ shopName, sellerId }: ProductListProps) => {
  const navigate = useNavigate();
  const cartItemCount = 0;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    {
      name: "Home",
      icon: <FaHome size={20} />,
      path: `/${sellerId}/${shopName}`,
    },
    {
      name: "Shop",
      icon: <FaStore size={20} />,
      path: `/${sellerId}/${shopName}/shop`,
    },
    {
      name: "Cart",
      icon: <FaShoppingCart size={20} />,
      path: `/${sellerId}/${shopName}/cart`,
    },
    {
      name: "Profile",
      icon: <FaUser size={20} />,
      path: `/${sellerId}/${shopName}/dashboard`,
    },
  ];

  return (
    <>
      <nav className="w-full bg-black text-white relative shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 md:px-6 py-5 md:py-4">
          {/* Logo */}
          <motion.div
            onClick={() => navigate(`/${sellerId}/${shopName}`)}
            whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
            transition={{ type: "spring", stiffness: 300 }}
            className="text-xl md:text-2xl font-bold cursor-pointer"
          >
            {shopName}
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-10">
            {menuItems.map((item) => (
              <div
                key={item.name}
                onClick={() => navigate(item.path)}
                className="group relative flex flex-col items-center cursor-pointer"
              >
                <motion.div
                  whileHover={{
                    y: -4,
                    scale: 1.15,
                    rotate: [0, 3, -3, 0],
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {item.icon}
                </motion.div>

                <span className="text-xs mt-1 relative">
                  {item.name}
                  <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
                </span>
              </div>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white"
          >
            {mobileMenuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="md:hidden bg-black border-t border-gray-800 px-4 py-4"
            >
              <div className="flex flex-col gap-4">
                {menuItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      navigate(item.path);
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 text-white hover:bg-gray-900 transition p-3 rounded-lg"
                  >
                    <div className="relative">{item.icon}</div>

                    <span>{item.name}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

export default Navbar;
