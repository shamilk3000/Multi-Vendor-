import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { SlidersHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Category } from "@/types/category";
import { useCategoriesForUser } from "../../../hooks/user/category/useCategories";

/* ================= TYPES ================= */

export type ProductSort =
  | "price_low_high"
  | "price_high_low"
  | "rating"
  | "newest"
  | "sales_high_low"
  | "name_a_z";

export interface ProductFilters {
  search: string;
  category?: string;
  subCategory?: string;
  price: [number, number];
  sort?: ProductSort;
}

type ProductListProps = {
  sellerId: string;
};

/* ================= DATA ================= */

// const CATEGORIES: Record<string, string[]> = {
//   Electronics: ["Mobiles", "Laptops", "Accessories"],
//   Fashion: ["Men", "Women", "Kids"],
//   Grocery: ["Fruits", "Vegetables", "Snacks"],
// };

const INITIAL_FILTERS: ProductFilters = {
  search: "",
  price: [0, 100000],
  sort: undefined,
};

/* ================= MAIN ================= */

const FilterButton: React.FC<ProductListProps> = ({ sellerId }) => {
  const { data: categories = [], isLoading } = useCategoriesForUser(sellerId);
   
  const [open, setOpen] = useState<boolean>(false);
  const [filters, setFilters] = useState<ProductFilters>(INITIAL_FILTERS);

  const navigate = useNavigate();

  /* 🔥 REALTIME UPDATE */
  const updateURL = (updated: ProductFilters) => {
    const params = new URLSearchParams();

    // if (updated.category) params.set("category", updated.category);
    // if (updated.subCategory) params.set("subCategory", updated.subCategory);

    // if (updated.sort) params.set("sort", updated.sort);

    // params.set("priceMin", String(updated.price[0]));
    // params.set("priceMax", String(updated.price[1]));
    // navigate(`/products?${params.toString()}`);




    console.log("filter:", updated);
  };

  /* ================= HANDLERS ================= */

  const handleClear = () => {
    setFilters(INITIAL_FILTERS);
    navigate("/products");
    setOpen(false);
  };

  const handleOk = () => {
    updateURL(filters);
    setOpen(false);
  };

  const handleSortClick = (value: ProductSort) => {
    setFilters((prev) => {
      const updated = {
        ...prev,
        sort: prev.sort === value ? undefined : value,
      };
      updateURL(updated);
      return updated;
    });
  };

  /* ================= UI (UNCHANGED) ================= */

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setOpen((prev) => !prev)}
        className="flex  items-center gap-2 rounded-full px-5 py-2 text-sm font-medium bg-black text-white border-black cursor-pointer"
      >
        <SlidersHorizontal className="h-4 w-4" />
        <span>Filter</span>
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute border-black right-0 mt-2 w-[360px] rounded-xl bg-white border shadow-xl p-4 z-50"
          >
            <h4 className="font-semibold mb-2">Category</h4>
            <div className="flex flex-wrap gap-2 mb-4">
              {categories.map((cat:Category  ) => (
  <Badge
    key={cat._id}
    variant={filters.category === cat.name ? "default" : "outline"}
    onClick={() =>
      setFilters((prev) => {
        const updated = {
          ...prev,
          category: prev.category === cat.name ? undefined : cat.name,
          subCategory: undefined,
        };
        updateURL(updated);
        return updated;
      })
    }
    className="cursor-pointer"
  >
    {cat.name}
  </Badge>
))}
            </div>

            {filters.category && (
              <>
                <h4 className="font-semibold mb-2">Sub category</h4>
                <div className="flex flex-wrap gap-2 mb-4">
                  {categories
  .find((c:Category  ) => c.name === filters.category)
  ?.children?.map((sub: any) => (
    <Badge
      key={sub._id}
      variant={filters.subCategory === sub.name ? "default" : "outline"}
      onClick={() =>
        setFilters((prev) => {
          const updated = {
            ...prev,
            subCategory:
              prev.subCategory === sub.name ? undefined : sub.name,
          };
          updateURL(updated);
          return updated;
        })
      }
      className="cursor-pointer"
    >
      {sub.name}
    </Badge>
  ))}
                </div>
              </>
            )}

            <h4 className="font-semibold mb-2">Price</h4>
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="secondary">
                ₹{filters.price[0]} - ₹{filters.price[1]}
              </Badge>

              <Slider
                min={1}
                max={100000}
                step={100}
                className="cursor-pointer"
                value={filters.price}
                onValueChange={(val) =>
                  setFilters((prev) => {
                    const updated = {
                      ...prev,
                      price: val as [number, number],
                    };
                    updateURL(updated);
                    return updated;
                  })
                }
              />
            </div>

            <h4 className="font-semibold mb-2">Sort by</h4>
            <div className="flex flex-wrap gap-2 mb-4">
              {[
                { label: "Newest", value: "newest" },
                { label: "Rating", value: "rating" },
                { label: "Best Selling", value: "sales_high_low" },
                { label: "Name: A → Z", value: "name_a_z" },
                { label: "Price: Low → High", value: "price_low_high" },
                { label: "Price: High → Low", value: "price_high_low" },
              ].map((opt) => (
                <Badge
                  key={opt.value}
                  variant={filters.sort === opt.value ? "default" : "outline"}
                  onClick={() => handleSortClick(opt.value as ProductSort)}
                  className="cursor-pointer"
                >
                  {opt.label}
                </Badge>
              ))}
            </div>

            <div className="flex justify-end gap-2">
              <Button
                className="cursor-pointer"
                variant="outline"
                onClick={handleClear}
              >
                Clear
              </Button>

              <Button className="cursor-pointer" onClick={handleOk}>
                OK
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterButton;
