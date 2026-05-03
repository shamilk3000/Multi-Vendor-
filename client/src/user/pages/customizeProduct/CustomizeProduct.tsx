import React, { useState } from "react";
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

interface Product {
  id: number;
  name: string;
  image: string;
  customImage: boolean;
  message: boolean;
}

const products: Product[] = [
  {
    id: 1,
    name: "Custom Mug",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200",
    customImage: true,
    message: false,
  },
  {
    id: 2,
    name: "Photo Frame",
    image:
      "https://images.unsplash.com/photo-1646753522408-077ef9839300?auto=format&fit=crop&w=500&q=60",
    customImage: false,
    message: true,
  },
  {
    id: 3,
    name: "Custom T-Shirt",
    image: "https://via.placeholder.com/300",
    customImage: true,
    message: true,
  },
];

const inputStyle =
  "w-full border rounded-lg p-2.5 pl-9 text-sm transition-all duration-300 focus:ring-2 focus:ring-black focus:scale-[1.02] hover:border-black hover:scale-[1.01]";

const CustomizeProducts: React.FC = () => {
  const [imageWarning, setImageWarning] = useState<Record<number, string>>({});

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

  const handleSubmit = () => {
    console.log(customData);
    alert("Customization saved 🎉");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 p-0">
      <Navbar />

      <div className="min-h-[calc(100vh-120px)] md:min-h-[calc(100vh-64px)] bg-gray-100 pt-0 p-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-5 mt-3 flex items-center justify-center gap-1 sm:gap-2 hover:scale-105 transition ">
          <FaPaintBrush className="text-gray-800 text-lg sm:text-xl md:text-2xl" />
          Customize Your Products
        </h1>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => {
            const data = customData[product.id] || { images: [], message: "" };

            return (
              <motion.div
                key={product.id}
                whileHover={{ y: -8 }}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-5 flex flex-col gap-4 border"
              >
                {/* Product Image */}
                <h2 className="font-semibold text-lg">{product.name}</h2>
                <img
                  src={product.image}
                  className="rounded-xl h-40 object-contain"
                />

                {/* Upload Image */}
                <label className="text-sm flex items-center gap-2">
                  <FaImages size={12} /> Custom Images
                </label>

                {product.customImage ? (
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
                        onChange={(e) => handleImageChange(e, product.id)}
                      />
                    </motion.label>

                    {/* Warning message */}
                    {imageWarning[product.id] && (
                      <div className="flex items-center gap-1 text-red-500 text-xs">
                        <FaExclamationCircle size={12} />
                        <span>{imageWarning[product.id]}</span>
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
                          onClick={() => removeImage(product.id, index)}
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

                  {product.message ? (
                    <>
                      <div className="relative group">
                        <FaStickyNote className="absolute left-3 top-3 text-gray-500 group-focus-within:text-black transition transform group-hover:scale-105 group-hover:text-black" />
                        <textarea
                          value={data.message}
                          onChange={(e) =>
                            handleMessageChange(e.target.value, product.id)
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
