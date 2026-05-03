import React, { useState } from "react";
import ProductCards from "../home/Product card/ProductCards";
import FilterButton from "../filter/FilterButton";
import Footer from "../footer/Footer";
import Navbar from "../navbar/Navbar";
import { FaStore, FaSearch } from "react-icons/fa";

function ShopPage() {
  const [search, setSearch] = useState("");

  return (
    <div>
      <Navbar />

      <div className="relative flex items-center my-2 md:my-4">
        {/* ✅ MOBILE: all in one row */}
        <div className="flex w-full items-center justify-between md:hidden px-2">
          {/* LEFT: Heading */}
          <h1 className="flex items-center gap-2 text-lg font-bold text-black font-[Playfair Display]">
            <FaStore />
            SHOP
          </h1>

          {/* RIGHT: Search + Filter */}
          <div className="flex items-center gap-2">
            <div className=" hover:border-black flex items-center bg-white border border-gray-400 rounded-lg px-3 py-2 w-50">
              <FaSearch className="text-black mr-2 text-sm" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="outline-none text-sm bg-transparent w-full"
              />
            </div>

            <FilterButton />
          </div>
        </div>

        {/* ✅ DESKTOP: YOUR ORIGINAL CODE (UNCHANGED) */}
        <h1
          className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-3 
    text-2xl md:text-3xl font-bold tracking-wide text-black 
    transition-all duration-300 hover:tracking-widest font-[Playfair Display]"
        >
          <FaStore className="text-2xl md:text-3xl" />
          SHOP
        </h1>

        <div className="hidden md:flex ml-auto items-center gap-3 p-4">
          <div className=" hover:border-black flex items-center bg-white border border-gray-400 rounded-xl px-4 py-2">
            <FaSearch className="text-black mr-2" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="outline-none text-sm bg-transparent"
            />
          </div>

          <FilterButton />
        </div>
      </div>

      {/* ✅ PASS SEARCH */}
      <ProductCards hideSearch={true} search={search} />

      <Footer />
    </div>
  );
}

export default ShopPage;
