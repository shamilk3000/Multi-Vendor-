import { useState, } from "react";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { SlidersHorizontal } from "lucide-react";
import { useCategories } from "../../../hooks/seller/category/useCategories";


export type ProductSort =
  | "price_low_high"
  | "price_high_low"
  | "rating"
  | "name_a_z"
  | "stock_low_high"
  | "stock_high_low"
  | "sales_high_low"
  | "date_new_old"; // 🔥 NEW

export interface ProductFilters {
  search: string;
  category?: string;
  subCategory?: string;
  price: [number, number];
  sort?: ProductSort;
  stock?: "out" | "low" | "in";
}

interface Props {
  onApply: (filters: ProductFilters) => void;
}

const INITIAL_FILTERS: ProductFilters = {
  search: "",
  price: [0, 100000],
};

const SellerFilterButton: React.FC<Props> = ({ onApply }) => {
  const { data: categories = [] } = useCategories(false);
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState<ProductFilters>(INITIAL_FILTERS);

  const updateFilters = (updated: ProductFilters) => {
    setFilters(updated);
    onApply(updated); // 🔥 REAL-TIME APPLY
  };

  const handleClear = () => {
    setFilters(INITIAL_FILTERS);
    onApply(INITIAL_FILTERS);
    setOpen(false);
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setOpen((prev) => !prev)}
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
            className="absolute right-0 mt-2 w-[360px] border-black rounded-xl bg-white border shadow-xl p-4 z-50"
          >
            {/* CATEGORY */}
            <h4 className="font-semibold mb-2">Category</h4>
            <div className="flex flex-wrap gap-2 mb-4">
              
              {categories.map((cat: { _id: string; name: string }) => (
    <Badge
      key={cat._id}
      variant={filters.category === cat._id ? "default" : "outline"}
      onClick={() => {
        const updated = {
          ...filters,
          category: filters.category === cat._id ? undefined : cat._id,
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
                 
                   {categories.find((cat: { _id: string; name: string }) => cat._id === filters.category)?.children?.map(
        (sub: { _id: string; name: string }) => (
          <Badge
            key={sub._id}
            variant={
              filters.subCategory === sub._id ? "default" : "outline"
            }
            onClick={() => {
              const updated = {
                ...filters,
                subCategory:
                  filters.subCategory === sub._id ? undefined : sub._id,
              };
              updateFilters(updated);
            }}
            className="cursor-pointer"
          >
            {sub.name}
          </Badge>
        )
      )}
                </div>
              </>
            )}

            {/* STOCK */}
            <h4 className="font-semibold mb-2">Stock</h4>
            <div className="flex flex-wrap gap-2 mb-4">
              {[
                {
                  label: "Out of Stock",
                  value: "out",
                  ClassName: "text-red-500 cursor-pointer",
                },
                {
                  label: "Low Stock",
                  value: "low",
                  ClassName: "text-yellow-500 cursor-pointer",
                },
                {
                  label: "In Stock",
                  value: "in",
                  ClassName: "text-green-500 cursor-pointer",
                },
              ].map((opt) => (
                <Badge
                  key={opt.value}
                  variant={filters.stock === opt.value ? "default" : "outline"}
                  className={opt.ClassName}
                  onClick={() => {
                    const updated = {
                      ...filters,
                      stock:
                        filters.stock === opt.value
                          ? undefined
                          : (opt.value as any), // ✅ toggle
                    };
                    updateFilters(updated);
                  }}
                >
                  {opt.label}
                </Badge>
              ))}
            </div>

            {/* PRICE */}
            <h4 className="font-semibold mb-2">Price range</h4>
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
                  updateFilters({
                    ...filters,
                    price: val as [number, number],
                  })
                }
              />
            </div>

            {/* SORT */}
            <h4 className="font-semibold mb-2">Sort by</h4>
            <div className="flex flex-wrap gap-2 mb-4">
              {[
                { label: "Newest First", value: "date_new_old" }, // 🔥
                { label: "Rating", value: "rating" },
                { label: "Best Selling", value: "sales_high_low" },
                { label: "Name: A → Z", value: "name_a_z" },
                { label: "Price Low → High", value: "price_low_high" },
                { label: "Price High → Low", value: "price_high_low" },
                { label: "Stock Low → High", value: "stock_low_high" },
                { label: "Stock High → Low", value: "stock_high_low" },
              ].map((opt) => (
                <Badge
                  key={opt.value}
                  variant={filters.sort === opt.value ? "default" : "outline"}
                  onClick={() => {
                    const updated = {
                      ...filters,
                      sort:
                        filters.sort === opt.value
                          ? undefined
                          : (opt.value as ProductSort), // ✅ toggle
                    };
                    updateFilters(updated);
                  }}
                  className="cursor-pointer"
                >
                  {opt.label}
                </Badge>
              ))}
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-2 cursor-pointer">
              <Button variant="outline" onClick={handleClear}>
                Clear
              </Button>

              {/* ✅ OK BUTTON */}
              <Button
                className="bg-black text-white cursor-pointer"
                onClick={() => setOpen(false)}
              >
                OK
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SellerFilterButton;
