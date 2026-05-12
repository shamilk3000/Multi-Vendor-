import React, { useState, useEffect, useRef } from "react";
import ProductCards from "./ProductCards";
import FilterButton, { type ProductFilters } from "./FilterButton";
import Footer from "../footer/Footer";
import Navbar from "../navbar/Navbar";
import { FaStore, FaSearch } from "react-icons/fa";
import { useLocation, useParams } from "react-router-dom";

function ShopPage() {
  const { sellerId, shopName } = useParams();

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<ProductFilters | null>(null);

  const location = useLocation();
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const desktopInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    if (params.get("focus") === "1") {
      const isMobile = window.innerWidth < 768;

      const id = setTimeout(() => {
        if (isMobile) mobileInputRef.current?.focus();
        else desktopInputRef.current?.focus();
      }, 150);

      return () => clearTimeout(id);
    }
  }, [location.search]);

  return (
    <div>
     <Navbar shopName={shopName!}  sellerId={sellerId!}/>

      {/* HEADER */}
      <div className="relative flex items-center my-2 md:my-4">
        {/* MOBILE */}
        <div className="flex w-full items-center justify-between md:hidden px-2">
          <h1 className="flex items-center gap-2 text-lg font-bold text-black">
            <FaStore />
            SHOP
          </h1>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-white border border-gray-400 rounded-lg px-3 py-2 w-50">
              <FaSearch className="text-black mr-2 text-sm" />
              <input
                ref={mobileInputRef}
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="outline-none text-sm bg-transparent w-full"
              />
            </div>

            {/* 🔥 MOVED FILTER BUTTON HERE */}
            <FilterButton sellerId={sellerId!} onApply={setFilters} />
          </div>
        </div>

        {/* DESKTOP */}
        <h1 className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-3 text-2xl font-bold text-black">
          <FaStore />
          SHOP
        </h1>

        <div className="hidden md:flex ml-auto items-center gap-3 p-4">
          <div className="flex items-center bg-white border border-gray-400 rounded-xl px-4 py-2">
            <FaSearch className="text-black mr-2" />
            <input
              ref={desktopInputRef}
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="outline-none text-sm bg-transparent"
            />
          </div>

          {/* 🔥 MOVED FILTER BUTTON HERE */}
          <FilterButton sellerId={sellerId!} onApply={setFilters} />
        </div>
      </div>

      {/* PRODUCTS */}
      <ProductCards
        hideSearch={true}
        search={search}
        sellerId={sellerId}
        shopName={shopName}
        filters={filters}
      />

      <Footer />
    </div>
  );
}

export default ShopPage;
