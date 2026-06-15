import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useCategories } from "../../../hooks/seller/category/useCategories";
import {
  FaFolderOpen,
  FaPlus,
  FaLayerGroup,
  FaFolder,
  FaTags,
  FaExclamationTriangle,
  FaTimes,
} from "react-icons/fa";

interface Category {
  name: string;
  parentCategory: string | null;
}

interface Props {
  onAdd: (category: Category) => void;
}

const AddCategoryModal = ({ onAdd }: Props) => {
  const { data } = useCategories({ onlyActive: true });
  const [open, setOpen] = useState(false);
  const hasParentCategories = (data?.length ?? 0) > 0;

  const [formData, setFormData] = useState({
    name: "",
    parentCategory: "",
    isSubCategory: false,
  });

  const [error, setError] = useState("");

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      return setError("Category name is required");
    }

    if (formData.isSubCategory && !formData.parentCategory) {
      return setError("Select parent category");
    }

    const data: Category = {
      name: formData.name,
      parentCategory: formData.isSubCategory ? formData.parentCategory : null,
    };
    onAdd(data);
    setOpen(false);

    setFormData({ name: "", parentCategory: "", isSubCategory: false });
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
    "w-full border border-gray-500 rounded-lg p-2.5 pl-9 text-sm transition-all duration-300 focus:ring-2 focus:ring-black focus:scale-[1.02] hover:border-black hover:scale-[1.01] placeholder-gray-400 md:placeholder-gray-500";

  return (
    <>
      {/* BUTTON */}
      <button
        onClick={() => setOpen(true)}
        className=" cursor-pointer bg-black text-white hover:bg-white hover:text-black hover:ring hover:ring-black px-2 text-sm md:px-4 py-2 rounded-lg flex items-center gap-2 hover:scale-[1.03] transition"
      >
        <FaPlus /> Add Category
      </button>

      {/* MODAL */}
      <AnimatePresence>
        {open && (
          <>
            {/* BACKDROP */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setOpen(false)}
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
                <button
                  onClick={() => setOpen(false)}
                  className="absolute right-3 top-3 cursor-pointer"
                >
                  <FaTimes />
                </button>

                <h2 className="text-lg font-bold mb-4 flex gap-2">
                  <FaFolderOpen className="mt-1.5" /> Add Category
                </h2>

                {/* CATEGORY NAME */}
                <div className="relative mb-4">
                  <FaLayerGroup className="absolute left-3 top-3 text-black" />

                  <input
                    type="text"
                    name="name"
                    placeholder="Category Name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`${inputStyle} peer`}
                  />

                  <label className="absolute left-7 top-[-10px] border border-gray-600 rounded text-xs text-black bg-white px-1 transition-all duration-300 peer-hover:border-black peer-hover:scale-[1.01] peer-focus:border-black peer-focus:scale-[1.02]  md:font-semibold font-extrabold  ">
                    Category Name
                  </label>
                </div>

                {/* TOGGLE SUBCATEGORY */}
                <div className="flex items-center justify-between border border-gray-500 transition-all duration-300 focus:ring-2 focus:ring-black focus:scale-[1.02] hover:border-black hover:scale-[1.01] placeholder-gray-400 px-3 h-12 rounded-lg mb-6">
                  <span className="text-sm flex items-center gap-2">
                    <FaFolder /> Sub Category
                  </span>

                  <button
                    disabled={!hasParentCategories}
                    onClick={() =>
                      setFormData({
                        ...formData,
                        isSubCategory: !formData.isSubCategory,
                        parentCategory: "",
                      })
                    }
                    className={`w-10 h-5 flex items-center rounded-full p-0.5 transition ${
                      formData.isSubCategory
                        ? "bg-black cursor-pointer"
                        : "bg-gray-300 cursor-pointer"
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full transform transition ${
                        formData.isSubCategory ? "translate-x-5" : ""
                      }`}
                    />
                  </button>
                </div>

                {/* PARENT CATEGORY */}
                {formData.isSubCategory && (
                  <div className="relative mb-4">
                    <FaTags className="absolute left-3 top-3 text-black" />

                    <select
                      name="parentCategory"
                      value={formData.parentCategory}
                      onChange={handleChange}
                      className={`${inputStyle} peer cursor-pointer`}
                    >
                      <option value="">Select Parent Category</option>
                      {data.map((cat: any) => (
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
                  <FaPlus className="text-sm" />
                  Add Category
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AddCategoryModal;
