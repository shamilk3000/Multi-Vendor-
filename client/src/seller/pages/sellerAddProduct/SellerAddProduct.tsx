import { useState, useEffect, type Key } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useCategories } from "../../../hooks/seller/category/useCategories";
import { ultrateAddProduct } from "../../../hooks/seller/product/ultrateProducts";
import type { Category } from "@/types/category";
import {
  FaImage,
  FaTrash,
  FaCube,
  FaBoxOpen,
  FaDollarSign,
  FaLayerGroup,
  FaPaperclip,
  FaImages,
  FaFolderOpen,
  FaExclamationTriangle,
  FaPercent,
  FaStickyNote,
  FaTags,
  FaExclamationCircle,
  FaPlus,
} from "react-icons/fa";
import { Tooltip, Zoom } from "@mui/material";

const AddProduct = () => {
  const { data: categories = [] } = useCategories({ onlyActive: true });
  const { mutateAsync: addProduct } = ultrateAddProduct();
 const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    mrpPrice: "",
    sellingPrice: "",
    category: "",
    subCategory: "",
    stock: "0",
    needAttachment: false,
    needMessage: false,
  });

  const [image, setImage] = useState<File[]>([]);
  const [error, setError] = useState("");
  const [subCategories, setSubCategories] = useState<Category[]>([]);
  const isMobile = window.matchMedia("(pointer: coarse)").matches;

  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;

    // 🔥 category change logic
    if (name === "category") {
      const selected = categories.find((c: Category) => c._id === value);
      const subs = selected ? selected.children : [];

      setSubCategories(subs);

      setFormData({
        ...formData,
        category: value,
        subCategory: subs.length > 0 ? subs[0]._id : "", // ✅ auto select first sub
      });

      return; // ⛔ stop further execution
    }

    // normal update
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files: File[] = Array.from(e.target.files);

    if (image.length + files.length > 4) {
      return setError("Maximum 4 images allowed");
    }

    setImage([...image, ...files]);
    setError("");
  };

  const removeImage = (index: number) => {
    setImage(image.filter((_, i) => i !== index));
  };

  const discount =
    formData.mrpPrice && formData.sellingPrice
      ? Math.round(
          ((Number(formData.mrpPrice) - Number(formData.sellingPrice)) /
            Number(formData.mrpPrice)) *
            100,
        )
      : 0;

  const descriptionArray = formData.description
    .split("\n")
    .map((p) => p.trim())
    .filter(Boolean); // cleaner 😏

  const handleSubmit = async () => {
    if (
      !formData.name ||
      !formData.description ||
      !formData.mrpPrice ||
      !formData.sellingPrice ||
      !formData.category ||
      !formData.subCategory ||
      !formData.stock
    ) {
      return setError("All fields are required");
    }

    if (formData.name.trim().length == 0 || descriptionArray.length == 0) {
      return setError("All fields are required");
    }

    if (image.length < 3) {
      return setError("Minimum 3 images required");
    }

    if (Number(formData.mrpPrice) <= 0) {
      return setError("MRP must be greater than 0");
    }

    if (Number(formData.sellingPrice) <= 0) {
      return setError("Selling price must be greater than 0");
    }

    if (Number(formData.sellingPrice) > Number(formData.mrpPrice)) {
      return setError("Selling price cannot exceed MRP");
    }

    if (Number(formData.stock) < 0) {
      return setError("Stock cannot be negative");
    }

    let stock = Number(formData.stock);
    if (!Number.isInteger(stock)) {
      return setError("Stock must be a whole number");
    }

    const form = new FormData();

    // 🔥 normal fields
    form.append("name", formData.name);
    form.append("mrpPrice", formData.mrpPrice);
    form.append("sellingPrice", formData.sellingPrice);
    form.append("category", formData.category);
    form.append("subCategory", formData.subCategory);
    form.append("stock", formData.stock);
    form.append("needAttachment", String(formData.needAttachment));
    form.append("needMessage", String(formData.needMessage));
    form.append("discountPercentage", String(discount));

    // 🔥 description array
    descriptionArray.forEach((desc, i) => {
      form.append(`description[${i}]`, desc);
    });

    // 🔥 images
    image.forEach((file) => {
      form.append("productImages", file); // 👈 same field name
    });

    try {
      await toast.promise(
        addProduct(form),
        {
          loading: "Adding product...",
          success: "Product added successfully 🚀",
          error: "Failed to add product",
        },
        {
          style: {
            background: "#111",
            color: "#fff",
            border: "1px solid #333",
          },
        },
      );
       // ✅ RESET FORM HERE
  setFormData({
    name: "",
    description: "",
    mrpPrice: "",
    sellingPrice: "",
    category: "",
    subCategory: "",
    stock: "0",
    needAttachment: false,
    needMessage: false,
  });

  setImage([]);
  setSubCategories([]);
   navigate("/seller/products");
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    if (error) {
      toast.error(error, {
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
      setError(""); // 🔥 reset so next error works
    }
  }, [error]);

  const inputStyle =
    "w-full border border-gray-500 rounded-lg p-2.5 pl-9 text-sm transition-all duration-300 focus:ring-2 focus:ring-black focus:scale-[1.02] hover:border-black hover:scale-[1.01] placeholder-gray-400 md:placeholder-gray-500";

  return (
    <div className="md:py-6  bg-gray-50 p-0 md:px-6 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="
  w-full 
  md:max-w-5xl 
  md:mx-auto 
  bg-white 
  p-4 md:p-6 
  md:rounded-2xl 
  md:shadow-2xl 
  md:ring-1 md:ring-gray-300
"
      >
        <h1 className="md:ms-0 ms-11 mt-2 md:mt-0 text-xl md:text-2xl font-bold mb-6 flex items-center gap-2">
          <FaBoxOpen /> Add Product
        </h1>

        {/* NAME + DESCRIPTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
          <div className="relative my-auto">
            <FaCube className="absolute left-3 top-3 text-black" />
            <input
              type="text"
              name="name"
              placeholder="Product Name"
               value={formData.name}
              className={`${inputStyle} peer`}
              onChange={handleChange}
            />
            <label className="absolute left-7 top-[-10px] border border-gray-600 rounded text-xs text-black bg-white px-1 transition-all duration-300 peer-hover:border-black peer-hover:scale-[1.01] peer-focus:border-black peer-focus:scale-[1.02]  md:font-semibold font-extrabold  ">
              Product Name
            </label>
          </div>

          <div className="relative md:mt-0 mt-1">
            <FaLayerGroup className="absolute left-3 top-3 text-black" />
            <textarea
              name="description"
              value={formData.description}
              placeholder="Description : Enter each point on a new line"
              className={`${inputStyle} peer`}
              onChange={handleChange}
            />
            <label className="absolute left-7 top-[-10px] border border-gray-600 rounded text-xs text-black bg-white px-1 transition-all duration-300 peer-hover:border-black peer-hover:scale-[1.01] peer-focus:border-black peer-focus:scale-[1.02]  md:font-semibold font-extrabold  ">
              Description
            </label>
          </div>
        </div>

        {/* PRICES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative md:mt-0 mt-0">
              <FaDollarSign className="absolute left-3 top-3 text-black" />
              <input
                type="number"
                name="mrpPrice"
                placeholder="MRP Price"
                value={formData.mrpPrice}
                className={`${inputStyle} peer`}
                onChange={handleChange}
              />
              <label className="absolute left-7 top-[-10px] border border-gray-600 rounded text-xs text-black bg-white px-1 transition-all duration-300 peer-hover:border-black peer-hover:scale-[1.01] peer-focus:border-black peer-focus:scale-[1.02]  md:font-semibold font-extrabold  ">
                MRP Price
              </label>
            </div>

            <div className="relative md:mt-0 mt-1">
              <FaDollarSign className="absolute left-3 top-3 text-black" />
              <input
                type="number"
                name="sellingPrice"
                placeholder="Selling Price"
                value={formData.sellingPrice}
                className={`${inputStyle} peer`}
                onChange={handleChange}
              />
              <label className="absolute left-7 top-[-10px] border border-gray-600 rounded text-xs text-black bg-white px-1 transition-all duration-300 peer-hover:border-black peer-hover:scale-[1.01] peer-focus:border-black peer-focus:scale-[1.02]  md:font-semibold font-extrabold  ">
                Selling Price
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative md:mt-0 mt-1">
              <FaPercent className="absolute left-3 top-3 text-black" />
              <input
                disabled
                type="text"
                name="discount"
                placeholder="Discount %"
                value={discount > 0 ? `${discount} % ` : ""}
                className={`${inputStyle} peer`}
                onChange={handleChange}
              />
              <label className="absolute left-7 top-[-10px] border border-gray-600 rounded text-xs text-black bg-white px-1 transition-all duration-300 peer-hover:border-black peer-hover:scale-[1.01] peer-focus:border-black peer-focus:scale-[1.02]  md:font-semibold font-extrabold  ">
                Discount
              </label>
            </div>

            <div className="relative md:mt-0 mt-1">
              <FaBoxOpen className="absolute left-3 top-3 text-black" />
              <input
                type="number"
                name="stock"
                placeholder="Stock Quantity"
                value={formData.stock}
                className={`${inputStyle} peer`}
                onChange={handleChange}
                min={0}
              />
              <label className="absolute left-7 top-[-10px] border border-gray-600 rounded text-xs text-black bg-white px-1 transition-all duration-300 peer-hover:border-black peer-hover:scale-[1.01] peer-focus:border-black peer-focus:scale-[1.02]  md:font-semibold font-extrabold  ">
                Stock Quantity
              </label>
            </div>
          </div>
        </div>

        {/* IMAGE + CATEGORY */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* CATEGORY + TOGGLES */}
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:mt-3">
              <div className="relative mt-1 md:mt-0 ">
                <FaFolderOpen className="absolute left-3 top-3 text-black" />
                <select
                  name="category"
                  onChange={handleChange}
                  value={formData.category}
                  className={`${inputStyle} peer cursor-pointer`}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat: Category, i: Key) => (
                    <option key={i} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <label
                  className="absolute left-7 top-[-10px] border border-gray-600 rounded text-xs text-black bg-white px-1 
  transition-all duration-300 
  peer-hover:border-black peer-hover:scale-[1.01] 
  peer-focus:border-black peer-focus:scale-[1.02]  md:font-semibold font-extrabold  "
                >
                  Category
                </label>
              </div>

              <div className="relative md:mt-0 mt-1">
                <FaTags className="absolute left-3 top-3 text-black" />
                <select
                  name="subCategory"
                  onChange={handleChange}
                  value={formData.subCategory}
                  disabled={!subCategories.length}
                  className={`${inputStyle} peer cursor-pointer`}
                >
                  <option value="">Sub Category</option>
                  {subCategories.map((sub, i) => (
                    <option key={i} value={sub._id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
                <label
                  className="absolute left-7 top-[-10px] border border-gray-600 rounded text-xs text-black bg-white px-1 
  transition-all duration-300 
  peer-hover:border-black peer-hover:scale-[1.01] 
  peer-focus:border-black peer-focus:scale-[1.02]  md:font-semibold font-extrabold  "
                >
                  Sub Category
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center justify-between border border-gray-500 px-2 h-10 rounded-lg transition-all duration-300 focus:ring-2 focus:ring-black focus:scale-[1.02] hover:border-black hover:scale-[1.01]">
                <span className="flex items-center text-sm">
                  <FaPaperclip className="me-2" /> Attachment
                </span>
                <div className="flex justify-end">
                  <Tooltip
                    arrow
                    title="Customers can upload images for product customization"
                    open={isMobile ? open : undefined} // 👈 control only on mobile
                    onClose={() => setOpen(false)}
                    disableHoverListener={isMobile} // 👈 disable hover on mobile
                    disableTouchListener={!isMobile}
                    slotProps={{
                      transition: Zoom,
                      popper: {
                        modifiers: [
                          {
                            name: "offset",
                            options: {
                              offset: [0, -8],
                            },
                          },
                        ],
                      },
                    }}
                  >
                    <FaExclamationCircle
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isMobile) setOpen(!open);
                      }}
                      size={15}
                      className="my-auto me-2 text-gray-500 hover:text-black cursor-pointer"
                    />
                  </Tooltip>
                  <button
                    onClick={() =>
                      setFormData({
                        ...formData,
                        needAttachment: !formData.needAttachment,
                      })
                    }
                    className={`w-10 h-5 flex items-center rounded-full p-0.5 transition ${
                      formData.needAttachment
                        ? "bg-black  cursor-pointer"
                        : "bg-gray-300 cursor-pointer"
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full transform transition ${
                        formData.needAttachment ? "translate-x-5" : ""
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between border border-gray-500 px-2 h-10 rounded-lg mb-3 transition-all duration-300 focus:ring-2 focus:ring-black focus:scale-[1.02] hover:border-black hover:scale-[1.01]">
                <span className="flex items-center text-sm">
                  <FaStickyNote className="me-2" /> Message
                </span>
                <div className="flex justify-end">
                  <Tooltip
                    arrow
                    title="Customers can add additional notes or messages"
                    open={isMobile ? open1 : undefined}
                    onClose={() => setOpen1(false)}
                    disableHoverListener={isMobile}
                    disableTouchListener={!isMobile}
                    slotProps={{
                      transition: Zoom,
                      popper: {
                        modifiers: [
                          {
                            name: "offset",
                            options: {
                              offset: [0, -8],
                            },
                          },
                        ],
                      },
                    }}
                  >
                    <FaExclamationCircle
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isMobile) setOpen1(!open1);
                      }}
                      size={15}
                      className="my-auto me-2 text-gray-500 hover:text-black cursor-pointer"
                    />
                  </Tooltip>
                  <button
                    onClick={() =>
                      setFormData({
                        ...formData,
                        needMessage: !formData.needMessage,
                      })
                    }
                    className={`w-10 h-5 flex items-center rounded-full p-0.5 transition ${
                      formData.needMessage
                        ? "bg-black cursor-pointer"
                        : "bg-gray-300 cursor-pointer"
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full transform transition ${
                        formData.needMessage ? "translate-x-5" : ""
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* IMAGE */}
          <div className="mb-4 border border-gray-500 p-2 md:p-3 rounded-lg transition-all duration-300 hover:border-black hover:scale-[1.01]">
            <p className=" mb-2 flex items-center gap-2 text-sm md:text-sm">
              <FaImages className="font-medium" /> Upload Images
            </p>

            <div className="flex gap-2 md:gap-3 flex-wrap">
              {image.map((img, index) => (
                <div
                  key={index}
                  className="relative w-18 h-18 md:w-20 md:h-20 rounded-lg overflow-hidden group  cursor-pointer"
                >
                  <img
                    src={URL.createObjectURL(img)}
                    className="w-full h-full object-cover group-hover:scale-110 transition"
                  />

                  <button
                    onClick={() => removeImage(index)}
                    className=" cursor-pointer absolute top-1 right-1 bg-black text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                  >
                    <FaTrash size={10} />
                  </button>
                </div>
              ))}

              {image.length < 4 && (
                <label className="w-18 h-18 md:w-20 md:h-20 flex flex-col items-center justify-center text-[10px] font-bold cursor-pointer border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-black hover:text-white hover:border-black transition">
                  <FaImage size={16} />
                  <span>Add ({image.length}/4)</span>
                  <span>Min 3 - Max 4</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    hidden
                    onChange={handleImageUpload}
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* ERROR */}
        {/* <>
          <Toaster
            containerStyle={{
              top: 75, // move down
            }}
            position="top-right"
            reverseOrder={false}
          />
        </> */}

        {/* BUTTON */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleSubmit}
          className=" cursor-pointer w-full bg-black text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
        >
          <FaPlus />
          <span>Add Product</span>
        </motion.button>
      </motion.div>
    </div>
  );
};

export default AddProduct;
