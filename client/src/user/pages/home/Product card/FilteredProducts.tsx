import { useState } from "react";
import ProductCards from "../../Shop/ProductCards";
import FilterButton, { type ProductFilters } from "./FilterButton";
import { FaLayerGroup, FaSearch } from "react-icons/fa";

interface FilteredProductsProps {
  sellerId: string;
  shopName: string;
  categoryId: string;
  categoryName: string;
  setSelectedCategoryId: React.Dispatch<React.SetStateAction<string>>;
}

function FilteredProducts({
  sellerId,
  shopName,
  categoryId,
  categoryName,
  setSelectedCategoryId,
}: FilteredProductsProps) {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<ProductFilters | null>(null);

  return (
    <>
      {/* Header */}
      <div className="relative flex items-center my-4">
        <div className="flex w-full justify-between items-center gap-3 p-4 flex-wrap">
          {/* All Products button on left */}
          <button
            onClick={() => setSelectedCategoryId("")}
            className="px-4 py-2 rounded-xl bg-black text-white hover:bg-gray-800 transition cursor-pointer"
          >
            ← All Products
          </button>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-black group-hover:bg-black transition-all duration-300">
              <FaLayerGroup className="text-white group-hover:text-white text-lg transition-all duration-300" />
            </div>

            {/* TITLE */}
            <h2 className="text-2xl font-bold text-black group-hover:text-black transition-all duration-300 relative">
              {categoryName}

              {/* underline animation */}
              {/* <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-black group-hover:w-full transition-all duration-300"></span> */}
            </h2>
          </div>
          {/* Search + Filter on right */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Search */}
            <div className="flex items-center bg-white border border-gray-400 rounded-xl px-4 py-2">
              <FaSearch className="text-black mr-2" />

              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="outline-none text-sm bg-transparent"
              />
            </div>

            {/* Filter */}
            <FilterButton sellerId={sellerId} onApply={setFilters} />
          </div>
        </div>
      </div>

      {/* Products */}
      <ProductCards
        hideSearch
        search={search}
        sellerId={sellerId}
        shopName={shopName}
        filters={filters}
        categoryId={categoryId}
      />
    </>
  );
}

export default FilteredProducts;
