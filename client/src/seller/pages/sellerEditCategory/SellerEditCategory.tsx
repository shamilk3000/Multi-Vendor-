import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useCategories } from "../../../hooks/seller/category/useCategories";
import { ultrateUpdateCategory } from "../../../hooks/seller/category/ultrateCategories";
import type { Category } from "@/types/category";

import {
  FaFolderOpen,
  FaLayerGroup,
  FaTags,
  FaExclamationTriangle,
  FaTimes,
  FaEdit,
} from "react-icons/fa";

interface Props {
  category: Category;
  setGlobalModalOpen: (val: boolean) => void; // 👈 NEW
}

const EditCategoryModal = ({
  category,
  setGlobalModalOpen, // 👈 ADD THIS
}: Props) => {
  const [open, setOpen] = useState(false);
  const { mutateAsync } = ultrateUpdateCategory();
  const [formData, setFormData] = useState({
    name: "",
    parentCategory: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        parentCategory: category.parentCategory || "",
      });
    }
  }, [category]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      return setError("Category name is required");
    }

    // only validate parent if it's subcategory
    if (category.parentCategory && !formData.parentCategory) {
      return setError("Parent category required");
    }

    const data = {
      name: formData.name,
      parentCategory: category.parentCategory ? formData.parentCategory : null,
    };

    try {
      await toast.promise(
        mutateAsync({ categoryId: category._id, data }),
        {
          loading: "Updating category...",
          success: "Category updated successfully ✏️",
          error: "Failed to update category ❌",
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
      closeModal();
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
      setError("");
    }
  }, [error]);

  const inputStyle =
    "w-full border border-gray-500 rounded-lg p-2.5 pl-9 text-sm transition-all duration-300 focus:ring-2 focus:ring-black focus:scale-[1.02] hover:border-black hover:scale-[1.01]";

  const { data: parentOptions } = useCategories({ onlyActive: true });

  const closeModal = () => {
    setOpen(false);
    setGlobalModalOpen(false); // 👈 IMPORTANT
  };
  return (
    <>
      {/* 🔥 EDIT BUTTON */}
      <button
        onClick={() => {
          setOpen(true);
          setGlobalModalOpen(true); // 👈 ADD THIS
        }}
        className=" cursor-pointer w-[85px] flex items-center justify-center gap-1 py-1.5 text-xs rounded-md bg-black text-white transition-all duration-300 hover:scale-[1.04]"
      >
        <FaEdit /> Edit
      </button>

      {/* 🔥 MODAL */}
      <AnimatePresence>
        {open && (
          <>
            {/* BACKDROP */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={closeModal}
            />

            {/* BOX */}
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-3"
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white p-5 rounded-2xl w-full max-w-md relative"
              >
                {/* CLOSE */}
                <button
                  onClick={closeModal}
                  className="absolute right-3 top-3 cursor-pointer"
                >
                  <FaTimes />
                </button>

                {/* HEADER */}
                <h2 className="text-lg font-bold mb-4 flex gap-2">
                  <FaFolderOpen className="mt-1.5" /> Edit Category
                </h2>

                {/* NAME */}
                <div className="relative mb-4">
                  <FaLayerGroup className="absolute left-3 top-3 text-black" />

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`${inputStyle} peer`}
                  />

                  <label className="absolute left-7 top-[-10px] border border-gray-600 rounded text-xs text-black bg-white px-1 transition-all duration-300 peer-hover:border-black peer-hover:scale-[1.01] peer-focus:border-black peer-focus:scale-[1.02]  md:font-semibold font-extrabold  ">
                    Category Name
                  </label>
                </div>

                {/* ONLY SHOW FOR SUBCATEGORY */}
                {category.parentCategory && (
                  <div className="relative mb-4">
                    <FaTags className="absolute left-3 top-3 text-black" />

                    <select
                      name="parentCategory"
                      value={formData.parentCategory}
                      onChange={handleChange}
                      className={`${inputStyle} cursor-pointer`}
                    >
                      <option value="">Select Parent</option>
                      {parentOptions.map((cat: Category) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>

                    <label className="absolute left-7 top-[-10px] border border-gray-600 rounded text-xs text-black bg-white px-1 transition-all duration-300 peer-hover:border-black peer-hover:scale-[1.01] peer-focus:border-black peer-focus:scale-[1.02]  md:font-semibold font-extrabold  ">
                      Parent Category
                    </label>
                  </div>
                )}

                {/* SUBMIT */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={handleSubmit}
                  className=" cursor-pointer w-full bg-black text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
                >
                  <FaEdit /> Update Category
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default EditCategoryModal;
