import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaHome,
  FaMapMarkerAlt,
  FaCity,
  FaGlobe,
  FaStickyNote,
  FaShoppingCart,
  FaCheckCircle,
  FaTimesCircle,
  FaTruck,
  FaBoxOpen,
} from "react-icons/fa";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useCart } from "../../../hooks/user/cart/useCart";
import { useProductByIdForUser } from "../../../hooks/user/product/useProducts";
import CheckOutSkeleton from "@/user/components/skeletons/checkOut";
import api from "../../../features/axios";

const Checkout: React.FC = () => {
  const user = useSelector((state: any) => state.auth.user);
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("productId");
  const quantity = Number(searchParams.get("quantity"));

  const { sellerId, shopName } = useParams();
  const navigate = useNavigate();
  const isBuyNow = !!productId && !!quantity;

  const { data: product, isLoading: productLoading } = useProductByIdForUser(
    productId || undefined,
  );

  const { data: cartdata, isLoading: cartLoading } = useCart();

  const [existing, setExisting] = useState<any>(null);
useEffect(() => {
  // wait until loading finished
  if (productLoading || cartLoading) return;

  // if no cart data AND no valid buy now params
  if (
    (!cartdata || cartdata.items?.length === 0) &&
    (!productId || !quantity)
  ) {
    navigate(`/${sellerId}/${shopName}`, { replace: true });
  }
}, [
  cartdata,
  productId,
  quantity,
  productLoading,
  cartLoading,
  navigate,
  sellerId,
  shopName,
]);

  useEffect(() => {
    const getAddress = async () => {
      try {
      
        const res = await api.get("/get-user-address");

        setExisting(res.data.address);

        // console.log(res.data.address);
      } catch (error: any) {
        console.log("ADDRESS ERROR 👉", error?.response?.data);
      }
    };

    getAddress();
  }, []);

  let cart: any = {
    items: [],
  };

  if (isBuyNow && product) {
    const qty = Number(quantity);

    const totalMrp = product.mrpPrice * qty;

    const totalSellingPrice = product.sellingPrice * qty;

    const totalDiscount = (product.mrpPrice - product.sellingPrice) * qty;

    cart.items = [
      {
        product,
        quantity: qty,
        _id: "1",
      },
    ];

    cart.totalMrp = totalMrp;
    cart.totalSellingPrice = totalSellingPrice;

    cart.totalDiscount = totalDiscount;

    cart.totalQuantity = qty;
  } else if (cartdata) {
    cart = cartdata;
  }

  useEffect(() => {
  if (cart && cart.items.length === 0 && !isBuyNow) {
    navigate(`/${sellerId}/${shopName}/shop`);
  }
}, [cart, isBuyNow, navigate, sellerId, shopName]);

  const [formData, setFormData] = useState({
    name: user.name,
    phone: "",
    email: user.email,
    flatNoOrVillaNo: "",
    street: "",
    area: "",
    landmark: "",
    city: "",
    emirate: "",
    postalCode: "",
    additionalNotes: "",
  });

  useEffect(() => {
    if (existing) {
      setFormData({
        name: user?.name || "",
        phone: existing.phone || "",
        email: user?.email || "",
        flatNoOrVillaNo: existing.flatNoOrVillaNo || "",
        street: existing.street || "",
        area: existing.area || "",
        landmark: existing.landmark || "",
        city: existing.city || "",
        emirate: existing.emirate || "",
        postalCode: existing.postalCode || "",
        additionalNotes: "",
      });
    }
  }, [existing, user]);

  const [showPhoneSuccess, setShowPhoneSuccess] = useState(false);
  const [showEmailSuccess, setShowEmailSuccess] = useState(false);

  useEffect(() => {
    if (/^(?:\+971|971|0)?5[0-9]{8}$/.test(formData.phone)) {
      setShowPhoneSuccess(true);
      const timer = setTimeout(() => setShowPhoneSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [formData.phone]);

  useEffect(() => {
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setShowEmailSuccess(true);
      const timer = setTimeout(() => setShowEmailSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [formData.email]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const placeOrder = async () => {
    const phone = formData.phone.replace(/\s+/g, "");
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
    const phoneValid = /^(?:\+971|971|0)?5[0-9]{8}$/.test(phone);

    const requiredFields = [
      "name",
      "phone",
      "email",
      "flatNoOrVillaNo",
      "street",
      "area",
      "landmark",
      "city",
      "emirate",
      "postalCode",
    ];

    const emptyField = requiredFields.find(
      (field) => !formData[field as keyof typeof formData],
    );

    if (emptyField) {
      return toast.error("All fields are required", {
        style: {
          background: "#111",
          color: "#fff",
          border: "1px solid #333",
        },
      });
    }

    if (!emailValid) {
      return toast.error("Invalid email", {
        style: {
          background: "#111",
          color: "#fff",
          border: "1px solid #333",
        },
      });
    }

    if (!phoneValid) {
      return toast.error("Invalid phone number", {
        style: {
          background: "#111",
          color: "#fff",
          border: "1px solid #333",
        },
      });
    }
    try {
      const promise = api.post("/create-order", {
        shippingAddress: formData,
        cart,
        isBuyNow,
      });

      const res = await toast.promise(
        promise,
        {
          loading: "Placing order...",
          success: "Order placed successfully 🎉",
          error: "Order failed",
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
      const order = res.data.order;
      
      
      let filteredItems = order.orderItems.filter(
        (item: any) =>
          !(
            item.product?.needAttachment == false &&
            item.product?.needMessage == false
          ),
      );
      const shouldCreatePayment = filteredItems.length === 0;
      
      if (shouldCreatePayment) {
        try {
          const res = await toast.promise(
            api.post("/create-checkout-session", {
              orderId :order._id,
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
          window.location.href = res.data.url;
        } catch (err) {
          console.log("Payment retry error:", err);
        }
      } else {
        navigate(
        `/${sellerId}/${shopName}/customize-product/${order._id}`,
        { replace: true },
      );
      }
      
    } catch (error: any) {
      console.log("ORDER PLACING ERROR 👉", error);
    }
  };

  const inputStyle =
    "w-full border rounded-lg p-2.5 pl-9 text-sm transition-all duration-300 focus:ring-2 focus:ring-black focus:scale-[1.02] hover:border-black hover:scale-[1.01]";

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
  const phoneValid = /^(?:\+971|971|0)?5[0-9]{8}$/.test(formData.phone);
  if (productLoading || cartLoading) {
    return <CheckOutSkeleton />;
  }
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 p-0">
      <Navbar shopName={shopName!} sellerId={sellerId!} />

      <div className="min-h-[calc(100vh-120px)] md:min-h-[calc(100vh-64px)] bg-gray-50 px-4 md:px-5">
        <h1 className="text-2xl md:text-3xl font-bold my-5 flex items-center gap-2 transition-transform duration-300 hover:scale-101 text-black">
          <FaShoppingCart />
          Checkout
        </h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* SHIPPING ADDRESS */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="md:col-span-2 bg-white p-4 rounded-xl shadow-lg hover:shadow-2xl transition"
          >
            <h2 className="group text-xl font-semibold mb-5 mt-2 flex items-center gap-2 transition-all duration-300 hover:scale-[1.02] hover:text-gray-700 cursor-default">
              <FaTruck className="text-gray-800 transition-all duration-300 group-hover:translate-x-2 group-hover:scale-110 group-hover:text-black" />

              <span className="text-gray-800 transition-all duration-200 ps-1 group-hover:-tracking-wider hover:text-black">
                Shipping Address
              </span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Name */}
              <div className="relative group">
                <FaUser className="absolute left-3 top-3 text-gray-400 group-focus-within:text-black transition transform group-hover:scale-105  group-hover:text-black" />
                <input
                  readOnly
                  value={user.name}
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  onChange={handleChange}
                  className={inputStyle}
                />
              </div>

              {/* Phone */}
              <div className="relative group">
                <FaPhone className="rotate-90 absolute left-3 top-3 text-gray-400 group-focus-within:text-black transition transform group-hover:scale-105  group-hover:text-black" />
                <input
                  type="text"
                  value={formData.phone}
                  name="phone"
                  placeholder="Phone Number"
                  onChange={handleChange}
                  className={inputStyle}
                />

                <AnimatePresence mode="wait">
                  {formData.phone.length > 0 &&
                    (!phoneValid || showPhoneSuccess) && (
                      <motion.p
                        key={phoneValid ? "success" : "error"}
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={
                          !phoneValid ? { opacity: 0 } : { opacity: 0, y: -20 }
                        }
                        transition={{ duration: 0.23, ease: "easeOut" }}
                        className={`text-xs mt-2 ml-1 flex items-center gap-1 ${
                          !phoneValid ? "text-red-500" : "text-green-600"
                        }`}
                      >
                        {!phoneValid ? <FaTimesCircle /> : <FaCheckCircle />}
                        {!phoneValid
                          ? "Enter a valid phone number"
                          : "Phone number is valid"}
                      </motion.p>
                    )}
                </AnimatePresence>
              </div>

              {/* Email */}
              <div className="relative group">
                <FaEnvelope className="absolute left-3 top-3 text-gray-400 group-focus-within:text-black transition transform group-hover:scale-105  group-hover:text-black" />
                <input
                  readOnly
                  value={user.email}
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  onChange={handleChange}
                  className={inputStyle}
                />

                <AnimatePresence mode="wait">
                  {formData.email.length > 0 &&
                    (!emailValid || showEmailSuccess) && (
                      <motion.p
                        key={emailValid ? "success" : "error"}
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={
                          !emailValid
                            ? { opacity: 0 } // error fades only
                            : { opacity: 0, y: -20 } // success slides up
                        }
                        transition={{ duration: 0.23, ease: "easeOut" }}
                        className={`text-xs mt-2 ml-1 flex items-center gap-1 ${
                          !emailValid ? "text-red-500" : "text-green-600"
                        }`}
                      >
                        {!emailValid ? <FaTimesCircle /> : <FaCheckCircle />}
                        {!emailValid
                          ? "Enter a valid email address"
                          : "Email is valid"}
                      </motion.p>
                    )}
                </AnimatePresence>
              </div>

              {/* Other fields */}
              <div className="relative group">
                <FaHome className="absolute left-3 top-3 text-gray-400 group-focus-within:text-black transition transform group-hover:scale-105  group-hover:text-black" />
                <input
                  type="text"
                  value={formData.flatNoOrVillaNo}
                  name="flatNoOrVillaNo"
                  placeholder="Flat / Villa No"
                  onChange={handleChange}
                  className={inputStyle}
                />
              </div>

              <div className="relative group">
                <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400 group-focus-within:text-black transition transform group-hover:scale-105  group-hover:text-black" />
                <input
                  type="text"
                  value={formData.street}
                  name="street"
                  placeholder="Street"
                  onChange={handleChange}
                  className={inputStyle}
                />
              </div>

              <div className="relative group">
                <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400 group-focus-within:text-black transition transform group-hover:scale-105  group-hover:text-black" />
                <input
                  value={formData.area}
                  type="text"
                  name="area"
                  placeholder="Area"
                  onChange={handleChange}
                  className={inputStyle}
                />
              </div>

              <div className="relative group">
                <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400 group-focus-within:text-black transition transform group-hover:scale-105  group-hover:text-black" />
                <input
                  value={formData.landmark}
                  type="text"
                  name="landmark"
                  placeholder="Landmark"
                  onChange={handleChange}
                  className={inputStyle}
                />
              </div>

              <div className="relative group">
                <FaCity className="absolute left-3 top-3 text-gray-400 group-focus-within:text-black transition transform group-hover:scale-105  group-hover:text-black" />
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  placeholder="City"
                  onChange={handleChange}
                  className={inputStyle}
                />
              </div>

              <div className="relative group">
                <FaGlobe className=" absolute left-3 top-3 text-gray-400 group-focus-within:text-black transition transform group-hover:scale-105  group-hover:text-black" />
                <select
                  value={formData.emirate}
                  name="emirate"
                  onChange={handleChange}
                  className={`${inputStyle} cursor-pointer`}
                >
                  <option value="">Select Emirate</option>
                  <option>Dubai</option>
                  <option>Abu Dhabi</option>
                  <option>Sharjah</option>
                  <option>Ajman</option>
                  <option>Ras Al Khaimah</option>
                  <option>Fujairah</option>
                  <option>Umm Al Quwain</option>
                </select>
              </div>

              <div className="relative group">
                <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400 group-focus-within:text-black transition transform group-hover:scale-105  group-hover:text-black" />
                <input
                  type="text"
                  value={formData.postalCode}
                  name="postalCode"
                  placeholder="Postal Code"
                  onChange={handleChange}
                  className={inputStyle}
                />
              </div>
            </div>

            <div className="relative mt-4 group">
              <FaStickyNote className="absolute left-3 top-3 text-gray-400 group-focus-within:text-black transition transform group-hover:scale-105  group-hover:text-black" />
              <textarea
                name="additionalNotes"
                placeholder="Additional Notes"
                onChange={handleChange}
                className={inputStyle}
              />
            </div>
          </motion.div>

          {/* ORDER SUMMARY */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white border rounded-xl p-6 shadow-md hover:shadow-2xl transition h-fit mb-6 md:mb-0"
          >
            <h2 className="group text-lg md:text-xl font-semibold mb-4 flex items-center gap-2 transition-all duration-300 hover:scale-[1.03] hover:text-gray-700">
              <FaBoxOpen className="text-black mt-1 transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-0.5 group-hover:text-gray-600" />

              <span className="transition-all duration-300 group-hover:tracking-wide">
                Order Summary
              </span>
            </h2>
            <div className="space-y-3 mb-4">
              {cart.items.map((item: any) => (
                <div
                  key={item._id}
                  className="flex justify-between text-sm hover:text-black transition hover:scale-[1.02]"
                >
                  <span className="transition-transform duration-300 hover:scale-103 hover:text-gray-800">
                    {item.product.name} x {item.quantity}
                  </span>
                  <span className="transition-transform duration-300 hover:scale-103 hover:text-gray-800">
                    ${(item.product.sellingPrice * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between mb-3 transition-transform duration-300 hover:scale-103 hover:text-gray-800">
              <span>Subtotal</span>
              <span>${cart.totalSellingPrice.toFixed(2)}</span>
            </div>

            <div className="flex justify-between mb-3 transition-transform duration-300 hover:scale-103 hover:text-gray-800">
              <span>Shipping</span>
              <span className="text-green-600">Free</span>
            </div>

            <div className="border-t pt-4 flex justify-between font-bold text-lg transition-transform duration-300 hover:scale-103 hover:text-gray-900">
              <span>Total</span>
              <span>${cart.totalSellingPrice.toFixed(2)}</span>
            </div>

            <motion.button
              whileHover={{
                scale: 1.02,
                boxShadow: "0px 12px 30px rgba(0,0,0,0.25)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={placeOrder}
              className="flex flex-row justify-center cursor-pointer w-full mt-5 bg-black text-white py-3 rounded-lg hover:scale-[1.03] hover:bg-gray-900 transition-transform duration-300"
            >
              <div className="inline me-2 my-auto">
                <FaShoppingCart />
              </div>
              Place Order
            </motion.button>
          </motion.div>
        </div>
        {/* TOASTER */}
        {/* <Toaster position="top-right" containerStyle={{ top: 75 }} /> */}
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;
