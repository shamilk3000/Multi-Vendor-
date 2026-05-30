import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  ultrateAddCategory,
  ultrateDeleteCategory,
  ultrateRestoreCategory,
} from "../../../hooks/seller/category/ultrateCategories";
import { useCategories } from "../../../hooks/seller/category/useCategories";
import type { Category } from "@/types/category";
import {
  FaFolder,
  FaFolderOpen,
  FaTrash,
  FaUndo,
  FaLayerGroup,
  FaSearch,
} from "react-icons/fa";
import AddCategoryModal from "../sellerAddCategory/SellerAddCategory";
import EditCategoryModal from "../sellerEditCategory/SellerEditCategory";
import CategoryPageSkeleton from "@/seller/components/skeletons/categorySkeleton";

const CategoryList = () => {
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const { mutateAsync: addCategory } = ultrateAddCategory();
  const { mutateAsync: deleteCategory } = ultrateDeleteCategory();
  const { mutateAsync: restoreCategory } = ultrateRestoreCategory();
  const { data: categories = [], isLoading } = useCategories({
    onlyActive: false,
  });

  // 🔥 ADD CATEGORY
  const handleAdd = async (data: Partial<Category>) => {
    try {
      await toast.promise(
        addCategory(data),
        {
          loading: "Adding category...",
          success: "Category added successfully 🎉",
          error: "Failed to add category ❌",
        },
        {
          style: {
            background: "#111",
            color: "#fff",
            border: "1px solid #333",
          },
        },
      );
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 DELETE WITH TOAST
  const handleDelete = async (id: string) => {
    try {
      await toast.promise(
        deleteCategory({ categoryId: id }),
        {
          loading: "Deleting category...",
          success: "Category deleted 🗑️",
          error: "Delete failed",
        },
        {
          style: {
            background: "#111",
            color: "#fff",
            border: "1px solid #333",
          },
        },
      );
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 RESTORE WITH TOAST
  const handleRestore = async (id: string) => {
    try {
      await toast.promise(
        restoreCategory({ categoryId: id }),
        {
          loading: "Restoring category...",
          success: "Category restored ♻️",
          error: "Restore failed",
        },
        {
          style: {
            background: "#111",
            color: "#fff",
            border: "1px solid #333",
          },
        },
      );
    } catch (err) {
      console.error(err);
    }
  };

  // 🔍 SEARCH (parent + sub)
  const parents = categories
    .map((parent: Category) => {
      const filteredChildren =
        parent.children?.filter((child) =>
          child.name.toLowerCase().includes(search.toLowerCase()),
        ) || [];

      const matchesParent = parent.name
        .toLowerCase()
        .includes(search.toLowerCase());

      if (matchesParent || filteredChildren.length > 0) {
        const childrenToUse = matchesParent
          ? parent.children
          : filteredChildren;

        return {
          ...parent,
          children: childrenToUse?.sort((a, b) => a.name.localeCompare(b.name)), // ✅ SORT CHILDREN HERE
        };
      }

      return null;
    })
    .filter(Boolean)
    .sort((a: Category, b: Category) => a.name.localeCompare(b.name));

  const btn =
    "w-[85px] flex items-center justify-center gap-1 py-1.5 text-xs rounded-md transition-all duration-300 hover:scale-[1.04]";

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2 md:ms-0 ms-11">
          <FaLayerGroup /> Category List
        </h1>

        <AddCategoryModal onAdd={handleAdd} />
      </div>

      {/* LIST */}
      <div className="flex flex-col gap-4">
        {isLoading ? (
          <CategoryPageSkeleton />
        ) : parents.length === 0 ? (
          <>
            {/* SEARCH */}
            <div className="relative mb-2 transition-all duration-300 hover:scale-[1.01]">
              <FaSearch className="absolute left-3 top-3 text-gray-700" />
              <input
                placeholder="Search category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full  rounded-lg pl-9 p-2 text-sm focus:ring-2 focus:ring-black border border-gray-500 "
              />
            </div>
            <div className="flex flex-col items-center justify-center border border-dashed border-gray-400 rounded-xl p-8 bg-white text-center">
              {/* ICON */}
              <div className="bg-gray-100 p-4 rounded-full mb-4">
                <FaLayerGroup className="text-2xl text-gray-600" />
              </div>

              {/* TITLE */}
              <h2 className="text-lg font-semibold mb-1">
                No Categories Found
              </h2>

              {/* SUBTEXT */}
              <p className="text-sm text-gray-500 mb-0">
                Looks like you haven’t added any categories yet.
              </p>

              <p className="text-sm text-gray-500 mb-0">OR</p>

              <p className="text-sm text-gray-500  mb-4">
                Try changing filters or search
              </p>

              {/* BUTTON */}
              <AddCategoryModal onAdd={handleAdd} />
            </div>
          </>
        ) : (
          <>
            {/* SEARCH */}
            <div className="relative mb-2 transition-all duration-300 hover:scale-[1.01]">
              <FaSearch className="absolute left-3 top-3 text-gray-700" />
              <input
                placeholder="Search category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full  rounded-lg pl-9 p-2 text-sm focus:ring-2 focus:ring-black border border-gray-500 "
              />
            </div>
            {parents.map((parent: Category) => {
              return (
                <motion.div
                  key={parent._id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={!modalOpen ? { scale: 1.02 } : {}}
                  className={`border rounded-xl p-4  hover:shadow-lg ${
                    parent.isActive
                      ? "bg-white border-gray-300"
                      : "bg-red-100 border-red-400 opacity-90"
                  }`}
                >
                  <div className="group">
                    {/* PARENT */}
                    <div className="flex justify-between items-center">
                      <div>
                        {/* TITLE */}
                        <div className="flex items-start gap-3">
                          <FaFolderOpen
                            className="text-lg mt-1 shrink-0 group-hover:animate-[wave_0.5s_ease-in-out]"
                            style={{ animationDelay: "0ms" }}
                          />

                          <h2
                            className="font-semibold text-lg flex items-center gap-1 group-hover:animate-[wave_0.5s_ease-in-out]"
                            style={{ animationDelay: "80ms" }}
                          >
                            {parent.name}
                            {!parent.isActive && (
                              <span className="text-xs text-red-500">
                                (Deleted)
                              </span>
                            )}
                          </h2>
                        </div>

                        {/* META */}
                        <p
                          className="text-xs text-gray-500 md:whitespace-nowrap group-hover:animate-[wave_0.5s_ease-in-out]"
                          style={{ animationDelay: "140ms" }}
                        >
                          <span>{parent.childrenCount} subcategories</span>
                          <span className="block md:inline">
                            <span className="hidden md:inline"> • </span>
                            {parent.totalProductCount} products
                          </span>
                        </p>
                      </div>

                      {/* ACTIONS */}
                      <div
                        className="flex flex-nowrap gap-2  "
                        style={{ animationDelay: "200ms" }}
                      >
                        {parent.isActive ? (
                          <>
                            <EditCategoryModal
                              category={parent}
                              setGlobalModalOpen={setModalOpen}
                            />

                            <button
                              onClick={() => handleDelete(parent._id)}
                              className={`${btn} bg-red-500 text-white cursor-pointer`}
                            >
                              <FaTrash /> Delete
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleRestore(parent._id)}
                            className={`${btn} bg-green-700 text-white cursor-pointer`}
                          >
                            <FaUndo /> Restore
                          </button>
                        )}
                      </div>
                    </div>

                    {/* SUB */}
                    <div className="flex flex-col gap-2 mt-3">
                      {parent.children?.map((sub, i) => {
                        return (
                          <div
                            key={sub._id}
                            className={`flex justify-between items-center border p-2 rounded-lg ${
                              sub.isActive
                                ? "bg-gray-100 border-gray-300"
                                : "bg-red-100 border-red-400 opacity-70"
                            }`}
                          >
                            {/* LEFT */}
                            <div>
                              <div className="flex items-center gap-3">
                                <FaFolder
                                  className="group-hover:animate-[wave_0.5s_ease-in-out]"
                                  style={{
                                    animationDelay: `${i * 80 + 260}ms`,
                                  }}
                                />

                                <span
                                  className="text-sm group-hover:animate-[wave_0.5s_ease-in-out]"
                                  style={{
                                    animationDelay: `${i * 80 + 320}ms`,
                                  }}
                                >
                                  {sub.name}
                                </span>
                              </div>

                              <p
                                className="text-xs text-gray-500 group-hover:animate-[wave_0.5s_ease-in-out]"
                                style={{ animationDelay: `${i * 80 + 380}ms` }}
                              >
                                {sub.productCount} products
                              </p>
                            </div>

                            {/* RIGHT */}
                            <div
                              className="flex flex-nowrap gap-2 "
                              style={{ animationDelay: `${i * 80 + 440}ms` }}
                            >
                              {sub.isActive ? (
                                <>
                                  <EditCategoryModal
                                    category={sub}
                                    setGlobalModalOpen={setModalOpen}
                                  />

                                  <button
                                    onClick={() => handleDelete(sub._id)}
                                    className={`${btn} bg-red-500 text-white cursor-pointer`}
                                  >
                                    <FaTrash /> Delete
                                  </button>
                                </>
                              ) : (
                                <button
                                  onClick={() => handleRestore(sub._id)}
                                  className={`${btn} bg-green-700 text-white cursor-pointer`}
                                >
                                  <FaUndo /> Restore
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </>
        )}
      </div>

      <style>
        {`
          @keyframes wave {
            0%   { transform: translateY(0); }
            25%  { transform: translateY(-4px); }
            50%  { transform: translateY(4px); }
            75%  { transform: translateY(-2px); }
            100% { transform: translateY(0); }
          }
            @keyframes fadeIn {
              from {
                opacity: 0;
                transform: translateY(5px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }

            .animate-fadeIn {
              animation: fadeIn 0.2s ease;
            }
        `}
      </style>
    </div>
  );
};

export default CategoryList;
