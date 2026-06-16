import { useState } from "react";
import { useParams } from "react-router-dom";
import { useCategoriesForUser } from "../../../../hooks/user/category/useCategories";
import CategoryMegaMenuSkeleton from "../../../components/skeletons/category";
interface ChildCategory {
  _id: string;
  name: string;
  productCount: number;
}

interface Category {
  _id: string;
  name: string;
  children: ChildCategory[];
}

interface CategoryMenuProps {
  selectedCategory: {
    categoryName: string;
    categoryId: string;
  };

  setSelectedCategory: React.Dispatch<
    React.SetStateAction<{
      categoryName: string;
      categoryId: string;
    }>
  >;
}

function CategoryMegaMenu({
  selectedCategory,
  setSelectedCategory,
}: CategoryMenuProps) {
  const { sellerId } = useParams();

  const { data: categories = [], isLoading } = useCategoriesForUser(sellerId!);

  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [selectedParentId, setSelectedParentId] = useState("");
  const handleChildCategoryClick = (
    parentId: string,
    childName: string,
    childId: string,
  ) => {
    setSelectedParentId(parentId);

    setSelectedCategory({
      categoryName: childName,
      categoryId: childId,
    });

    setActiveCategory(null);
  };

  if (isLoading) {
    return <CategoryMegaMenuSkeleton />;
  }
  if ((categories as Category[]).length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
        <div className="text-lg font-semibold text-gray-700">
          No categories available
        </div>

        <div className="mt-2 text-sm text-gray-500">
          Categories will appear here when they are added.
        </div>
      </div>
    );
  }
  return (
    <div
      className="relative bg-white rounded-2xl shadow-lg border border-gray-200"
      onMouseLeave={() => setActiveCategory(null)}
    >
      {/* Parent Categories */}
      <div className="flex items-center gap-3 px-6 py-4 overflow-x-auto scrollbar-hide">
        {[...(categories as Category[])]
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((category) => {
            const hasSelectedChild = category.children.some(
              (child) => child._id === selectedCategory.categoryId,
            );

            return (
              <button
                key={category._id}
                onMouseEnter={() => setActiveCategory(category)}
                className={`px-5 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors duration-150 cursor-pointer
          ${
            activeCategory?._id === category._id || hasSelectedChild
              ? "bg-black text-white shadow-md"
              : "bg-gray-300 text-gray-700 hover:bg-black hover:text-white"
          }`}
              >
                {category.name}
              </button>
            );
          })}
      </div>

      {/* Child Categories */}
      {activeCategory && (
        <div className="absolute left-0 top-full w-full bg-white rounded-b-2xl shadow-2xl border border-gray-200 z-50">
          {activeCategory.children.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-lg font-semibold text-gray-700">
                No subcategories available
              </div>

              <div className="mt-2 text-sm text-gray-500">
                This category doesn't contain any subcategories.
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 p-6">
              {[...activeCategory.children]
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((child) => (
                  <button
                    key={child._id}
                    onClick={() =>
                      handleChildCategoryClick(
                        activeCategory._id,
                        child.name,
                        child._id,
                      )
                    }
                    className={`group text-left rounded-xl border p-4 transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-lg
              ${
                selectedCategory.categoryId === child._id
                  ? "border-black bg-black text-white shadow-lg"
                  : "border-gray-200 bg-white hover:bg-gray-300"
              }`}
                  >
                    <div
                      className={`font-semibold transition-colors ${
                        selectedCategory.categoryId === child._id
                          ? "text-white"
                          : "text-gray-800 group-hover:text-black"
                      }`}
                    >
                      {child.name}
                    </div>

                    <div
                      className={`mt-2 text-xs ${
                        selectedCategory.categoryId === child._id
                          ? "text-gray-300"
                          : "text-gray-500"
                      }`}
                    >
                      {child.productCount} products
                    </div>
                  </button>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CategoryMegaMenu;
