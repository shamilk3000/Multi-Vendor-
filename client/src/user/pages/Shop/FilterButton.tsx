import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { SlidersHorizontal } from "lucide-react";
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
  onApply: (filters: ProductFilters) => void; // ✅ ONLY ADDITION
};

/* ================= DATA ================= */

const INITIAL_FILTERS: ProductFilters = {
  search: "",
  category: undefined,
  subCategory: undefined,
  price: [0, 100000],
  sort: undefined,
};

/* ================= MAIN ================= */

const FilterButton: React.FC<ProductListProps> = ({
  sellerId,
  onApply,
}) => {
  const { data: categories = [] } = useCategoriesForUser(sellerId);

  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState<ProductFilters>(INITIAL_FILTERS);

  /* ✅ CENTRAL UPDATE */
  const updateFilters = (updated: ProductFilters) => {
    setFilters(updated);
    onApply(updated);
  };

  const handleClear = () => {
    setFilters(INITIAL_FILTERS);
    onApply(INITIAL_FILTERS);
    setOpen(false);
  };

  const handleSortClick = (value: ProductSort) => {
  const updated = {
    ...filters,
    sort: filters.sort === value ? undefined : value,
  };

  setFilters(updated);
  updateFilters(updated); // 🔥 THIS is what actually triggers parent
};

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium bg-black text-white border-black cursor-pointer"
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
            {/* CATEGORY */}
<h4 className="font-semibold mb-2">Category</h4>
<div className="flex flex-wrap gap-2 mb-4">
  {categories.map((cat: Category) => (
    <Badge
      key={cat._id}
      variant={
        filters.category === cat._id ? "default" : "outline"
      }
      onClick={() => {
        const updated = {
          ...filters,
          category:
            filters.category === cat._id ? undefined : cat._id,
          subCategory: undefined,
        };
        updateFilters(updated);
      }}
      className="cursor-pointer"
    >
      {cat.name}
    </Badge>
  ))}
</div>

{/* SUB CATEGORY */}
{filters.category && (
  <>
    <h4 className="font-semibold mb-2">Sub category</h4>
    <div className="flex flex-wrap gap-2 mb-4">
      {categories
        .find((c: Category) => c._id === filters.category)
        ?.children?.map((sub: any) => (
          <Badge
            key={sub._id}
            variant={
              filters.subCategory === sub._id
                ? "default"
                : "outline"
            }
            onClick={() => {
              const updated = {
                ...filters,
                subCategory:
                  filters.subCategory === sub._id
                    ? undefined
                    : sub._id,
              };
              updateFilters(updated);
            }}
            className="cursor-pointer"
          >
            {sub.name}
          </Badge>
        ))}
    </div>
  </>
)}

            {/* PRICE */}
            <h4 className="font-semibold mb-2">Price</h4>
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="secondary">
                ₹{filters.price[0]} - ₹{filters.price[1]}
              </Badge>

              <Slider
                min={1}
                max={100000}
                step={100}
                value={filters.price}
                onValueChange={(val) => {
                  const updated = {
                    ...filters,
                    price: val as [number, number],
                  };
                  updateFilters(updated);
                }}
              />
            </div>

            {/* SORT */}
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

            {/* ACTIONS */}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleClear}>
                Clear
              </Button>

              <Button onClick={() => setOpen(false)}>OK</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterButton;