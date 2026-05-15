import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaUpload,
  FaTrash,
  FaPen,
  FaImages,
  FaPaintBrush,
  FaLock,
  FaExclamationCircle,
  FaStickyNote,
  FaCreditCard,
} from "react-icons/fa";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import { useParams } from "react-router-dom";
import api from "../../../features/axios";
import toast from "react-hot-toast";
import { useOrderForUser } from "../../../hooks/user/order/useOrder";
import Customize from "@/user/components/skeletons/customize";
// import { useNavigate } from "react-router-dom";

const inputStyle =
  "w-full border rounded-lg p-2.5 pl-9 text-sm transition-all duration-300 focus:ring-2 focus:ring-black focus:scale-[1.02] hover:border-black hover:scale-[1.01]";

const CustomizeProducts: React.FC = () => {
  // const navigate = useNavigate();
  // const [clientSecret, setClientSecret] = useState("");
  const [imageWarning, setImageWarning] = useState<Record<number, string>>({});
  const { sellerId, shopName, orderId } = useParams();
  const { data: orderdetails, isLoading } = useOrderForUser(orderId!);
  let order = orderdetails?._doc;
  const filteredItems =
  order?.orderItems?.filter(
    (item: any) =>
      !(
        item.product?.needAttachment == false &&
        item.product?.needMessage == false
      ),
  ) || [];

  
 useEffect(() => {
  const createIntentIfNeeded = async () => {
    if (!order || !order.orderItems) return;
    const shouldCreatePayment = filteredItems.length === 0;
  

    if (shouldCreatePayment && orderId) {
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

        window.location.href = res.data.url;
      } catch (err) {
        console.log("Payment retry error:", err);
      }
    }
  };

  createIntentIfNeeded();
}, [order, orderId, filteredItems]);
  const BASE_URL = import.meta.env.VITE_SERVER_IMAGE_TARGET;

  const [customData, setCustomData] = useState<
    Record<number, { images: File[]; message: string }>
  >({});

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    productId: number,
  ) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);

    setCustomData((prev) => {
      const existingImages = prev[productId]?.images || [];
      const totalImages = existingImages.length + files.length;

      if (totalImages > 3) {
        setImageWarning((prevWarn) => ({
          ...prevWarn,
          [productId]: "Maximum 3 images allowed",
        }));

        // Auto remove warning after 5 seconds
        setTimeout(() => {
          setImageWarning((prevWarn) => ({
            ...prevWarn,
            [productId]: "",
          }));
        }, 5000);
      } else {
        setImageWarning((prevWarn) => ({
          ...prevWarn,
          [productId]: "",
        }));
      }

      const allowedFiles = files.slice(0, 3 - existingImages.length);

      return {
        ...prev,
        [productId]: {
          ...prev[productId],
          images: [...existingImages, ...allowedFiles],
          message: prev[productId]?.message || "",
        },
      };
    });
  };

  const removeImage = (productId: number, index: number) => {
    setCustomData((prev) => {
      const updatedImages = [...(prev[productId]?.images || [])];
      updatedImages.splice(index, 1);

      return {
        ...prev,
        [productId]: {
          ...prev[productId],
          images: updatedImages,
          message: prev[productId]?.message || "",
        },
      };
    });
  };

  const handleMessageChange = (message: string, productId: number) => {
    setCustomData((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        message,
        images: prev[productId]?.images || [],
      },
    }));
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    if (orderId) {
      formData.append("orderId", orderId);
    }
    type CustomItem = {
      message: string;
      images: File[];
    };

    const customDataWithoutImages: Record<string, CustomItem> = {};

    Object.entries(customData).forEach(([productId, value]) => {
      customDataWithoutImages[productId] = {
        message: value.message,
        images: [],
      };

      value.images.forEach((image: File) => {
        formData.append(`images_${productId}`, image);
      });
    });

    formData.append("customData", JSON.stringify(customDataWithoutImages));

    try {
      // 1. Upload customization
      await toast.promise(
        api.post("/customize-order", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }),
        {
          loading: "Uploading customization...",
          success: "Customization added successfully 🎨✨",
          error: "Failed to submit customization ❌",
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

      // 2. Only after success → create payment
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
    } catch (error: any) {
      console.log("ORDER PLACING ERROR 👉", error?.response?.data);
    }
  };
  // console.log(order);

  if (isLoading) {
    return <Customize />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 p-0">
      <Navbar shopName={shopName!} sellerId={sellerId!} />

      <div className="min-h-[calc(100vh-120px)] md:min-h-[calc(100vh-64px)] bg-gray-100 pt-0 p-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-5 mt-3 flex items-center justify-center gap-1 sm:gap-2 hover:scale-105 transition ">
          <FaPaintBrush className="text-gray-800 text-lg sm:text-xl md:text-2xl" />
          Customize Your Products
        </h1>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item: any) => {
            const data = customData[item.product._id] || {
              images: [],
              message: "",
            };

            return (
              <motion.div
                key={item.product._id}
                whileHover={{ y: -8 }}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-5 flex flex-col gap-4 border"
              >
                {/* Product Image */}
                <h2 className="font-semibold text-lg">{item.product.name}</h2>
                <img
                  src={`${BASE_URL}${item.product.image[0]}`}
                  className="rounded-xl h-40 object-contain"
                />

                {/* Upload Image */}
                <label className="text-sm flex items-center gap-2">
                  <FaImages size={12} /> Custom Images
                </label>

                {item.product.needAttachment ? (
                  <>
                    <motion.label
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="flex items-center justify-center gap-2 cursor-pointer 
      border-2 border-dashed border-gray-300 rounded-lg py-2 px-3 text-xs 
      bg-gray-50 hover:bg-black hover:text-white hover:border-black transition w-full"
                    >
                      <FaUpload className="text-sm" />

                      <div className="flex flex-col leading-tight">
                        <span className="font-medium">Click or Drop Image</span>
                        <span className="opacity-70 text-[10px]">
                          PNG / JPG • Max 3 images
                        </span>
                      </div>

                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        hidden
                        onChange={(e) => handleImageChange(e, item.product._id)}
                      />
                    </motion.label>

                    {/* Warning message */}
                    {imageWarning[item.product._id] && (
                      <div className="flex items-center gap-1 text-red-500 text-xs">
                        <FaExclamationCircle size={12} />
                        <span>{imageWarning[item.product._id]}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-center gap-2 bg-gray-100 text-gray-800 border rounded-xl py-2 text-sm cursor-not-allowed">
                    <FaLock size={12} />
                    Upload Not Available
                  </div>
                )}

                {/* Image Preview */}

                {data.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {data.images.map((img, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.08 }}
                        className="relative group overflow-hidden rounded-lg"
                      >
                        <img
                          src={URL.createObjectURL(img)}
                          className="h-20 w-full object-cover transition duration-300 group-hover:scale-125"
                        />

                        <button
                          onClick={() => removeImage(item.product._id, index)}
                          className="absolute top-1 right-1 bg-black text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                        >
                          <FaTrash size={10} />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Message */}

                <div className="flex flex-col gap-1">
                  <label className="text-sm flex items-center gap-2">
                    <FaPen size={12} /> Message
                  </label>

                  {item.product.needMessage ? (
                    <>
                      <div className="relative group">
                        <FaStickyNote className="absolute left-3 top-3 text-gray-500 group-focus-within:text-black transition transform group-hover:scale-105 group-hover:text-black" />
                        <textarea
                          value={data.message}
                          onChange={(e) =>
                            handleMessageChange(
                              e.target.value,
                              item.product._id,
                            )
                          }
                          placeholder="Write your custom message..."
                          rows={3}
                          className={inputStyle}
                        />
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center gap-2 bg-gray-100 text-gray-800 border rounded-lg py-2 text-sm cursor-not-allowed">
                      <FaLock size={12} />
                      Message Not Available
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Submit */}

        <div className="flex justify-center mt-10">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            className="bg-black text-white px-10 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition cursor-pointer flex items-center gap-2"
          >
            <FaCreditCard />
            Proceed to Payment
          </motion.button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CustomizeProducts;
