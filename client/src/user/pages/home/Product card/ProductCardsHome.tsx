import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import { FaSearch } from "react-icons/fa";

interface Product {
  _id: string;
  name: string;
  description: string[];
  mrpPrice: number;
  sellingPrice: number;
  stock: number;
  category: string;
  subCategory: string;
  images: string[];
  needAttachment: boolean;
  needMessage: boolean;
  rating: number;
  sales: number;
  isActive: boolean;
  date: string;
}

// PRODUCTS
const products: Product[] = [
  {
    _id: "1",
    name: "iPhone 14 first",
    description: ["Good battery", "Fast performance", "Nice design"],
    sellingPrice: 80000,
    mrpPrice: 90000,
    stock: 10,
    category: "Electronics",
    subCategory: "Phone",
    needAttachment: true,
    needMessage: false,
    rating: 3.5,
    sales: 32,
    isActive: true,
    date: new Date().toISOString(),
    images: [
      "https://images.unsplash.com/photo-1649261191606-cb2496e97eee?auto=format&fit=crop&w=500&q=60",
      "https://images.unsplash.com/photo-1646753522408-077ef9839300?auto=format&fit=crop&w=500&q=60",
      "https://images.unsplash.com/photo-1651950519238-15835722f8bb?auto=format&fit=crop&w=500&q=60",
      "https://images.unsplash.com/photo-1651950537598-373e4358d320?auto=format&fit=crop&w=500&q=60",
    ],
  },
  {
    _id: "2",
    name: "Nike Shoes",
    description: ["Comfort fit", "Durable", "Stylish"],
    sellingPrice: 5000,
    mrpPrice: 7000,
    stock: 1,
    category: "Clothing",
    subCategory: "Shoes",
    needAttachment: true,
    needMessage: true,
    rating: 2,
    sales: 28000000000,
    isActive: true,
    date: new Date().toISOString(),
    images: [
      "https://images.unsplash.com/photo-1646753522408-077ef9839300?auto=format&fit=crop&w=500&q=60",
      "https://images.unsplash.com/photo-1651950519238-15835722f8bb?auto=format&fit=crop&w=500&q=60",
      "https://images.unsplash.com/photo-1651950537598-373e4358d320?auto=format&fit=crop&w=500&q=60",
    ],
  },

  // 🔥 AUTO 18 MORE
  ...Array.from({ length: 18 }, (_, i) => {
    const names = [
      "Samsung Galaxy",
      "MacBook Air",
      "Bluetooth Speaker",
      "Smart Watch",
      "Gaming Mouse",
      "Formal Shirt",
      "Casual Pants",
      "Headphones",
    ];

    const categories = ["Electronics", "Clothing"];
    const subCategories = ["Phone", "Laptop", "Accessories", "Shoes"];

    const images = [
      "https://images.unsplash.com/photo-1649261191606-cb2496e97eee?auto=format&fit=crop&w=500&q=60",
      "https://images.unsplash.com/photo-1646753522408-077ef9839300?auto=format&fit=crop&w=500&q=60",
      "https://images.unsplash.com/photo-1651950519238-15835722f8bb?auto=format&fit=crop&w=500&q=60",
      "https://images.unsplash.com/photo-1651950537598-373e4358d320?auto=format&fit=crop&w=500&q=60",
    ];

    return {
      _id: `${i + 3}`,
      name: `${names[i % names.length]} ${i + 1}`,
      description: ["High quality", "Best performance", "Value for money"],
      sellingPrice: 1000 + (i % 8) * 5000,
      mrpPrice: 1500 + (i % 8) * 6000,
      stock: i % 15,
      category: categories[i % categories.length],
      subCategory: subCategories[i % subCategories.length],
      needAttachment: i % 2 === 0,
      needMessage: i % 3 === 0,
      rating: +(Math.random() * 5).toFixed(1),
      sales: Math.floor(Math.random() * 100),
      isActive: i % 5 !== 0, // some deleted 😏
      date: new Date().toISOString(),
      images: [images[i % 4], images[(i + 1) % 4], images[(i + 2) % 4]],
    };
  }),
];

// GRID (UNCHANGED)
const ProductGrid: React.FC<{
  currentPage: number;
  itemsPerPage: number;
  data: Product[];
}> = ({ currentPage, itemsPerPage, data }) => {
  const [imageIndex, setImageIndex] = useState<Record<string, number>>(
    data.reduce((acc, p) => ({ ...acc, [p._id]: 0 }), {}),
  );
  const [pausedIds, setPausedIds] = useState<string[]>([]);

  useEffect(() => {
    const intervals = data.map((product, idx) => {
      const delay = idx * 500;
      return setTimeout(() => {
        const interval = setInterval(() => {
          setImageIndex((prev) => {
            if (pausedIds.includes(product._id)) return prev;
            return {
              ...prev,
              [product._id]: (prev[product._id] + 1) % product.images.length,
            };
          });
        }, 2500);
        (product as any).intervalId = interval;
      }, delay);
    });

    return () => {
      intervals.forEach((timeoutId, idx) => {
        clearTimeout(timeoutId);
        const interval = (data[idx] as any).intervalId;
        if (interval) clearInterval(interval);
      });
    };
  }, [pausedIds, data]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = data.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
      {paginatedProducts.map((product) => {
        const discount =
          product.mrpPrice && product.sellingPrice && product.mrpPrice > 0
            ? Math.round(
                ((product.mrpPrice - product.sellingPrice) / product.mrpPrice) *
                  100,
              )
            : 0;
        const index = imageIndex[product._id] ?? 0;

        return (
          <div
            key={product._id}
            onMouseEnter={() => setPausedIds((prev) => [...prev, product._id])}
            onMouseLeave={() =>
              setPausedIds((prev) => prev.filter((id) => id !== product._id))
            }
            className="cursor-pointer w-40 sm:w-60 lg:w-72 bg-white rounded-xl shadow-md hover:shadow-xl transition-transform duration-300 hover:scale-105"
          >
            <div className="relative h-48 sm:h-64 lg:h-80 overflow-hidden rounded-t-xl">
              {discount > 0 && (
                <span className="absolute top-2 left-2 z-10 bg-red-500 text-white text-xs px-2 py-1 rounded">
                  {discount}% OFF
                </span>
              )}
              {product.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                    i === index ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))}
            </div>
            <div className="p-3">
              <p className="text-xs text-gray-400">
                {product.category}/{product.subCategory}{" "}
              </p>
              <p className="font-bold text-sm truncate">{product.name}</p>
              <div className="flex gap-2">
                <span>${product.sellingPrice}</span>
                <del className="text-gray-400">${product.mrpPrice}</del>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
};

// MAIN
const ProductCardsWithPagination: React.FC<{
   sellerId?: string;
  hideSearch?: boolean;
  search?: string;
}> = ({ hideSearch, search,  sellerId }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openSearch, setOpenSearch] = useState(false);

  const filteredProducts = products
    .filter((p) =>
      (p.name + p.category + p.subCategory)
        .toLowerCase()
        .includes((search || "").toLowerCase()),
    )
    .sort((a, b) => b.sales - a.sales); // 👈 highest sales first

  const query = new URLSearchParams(location.search);
  const page = parseInt(query.get("page") || "1", 10);

  const itemsPerPage = 12;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <>
      {/* ✅ YOUR ORIGINAL SEARCH (VISIBLE ONLY WHEN FALSE) */}
      {!hideSearch && (
        <div className=" ms-auto max-w-12/12 md:max-w-6/12 px-4 md:px-6 lg:px-12 mb-6">
          <div className="md:hidden">
            <div
              onClick={() => navigate("/products")}
              className=" hover:border-black flex items-center bg-white border shadow-xl border-gray-400 rounded-xl px-4 py-3 cursor-pointer"
            >
              <FaSearch className="text-black mr-2" />
              <input
                type="text"
                placeholder="Search products..."
                onFocus={() => navigate("/products")}
                readOnly
                className="w-full outline-none text-sm bg-transparent cursor-pointer"
              />
            </div>
          </div>

          <div className="hidden md:flex justify-end">
            {!openSearch && (
              <button
                onClick={() => setOpenSearch(true)}
                className="cursor-pointer p-3 rounded-full border border-gray-400 text-white bg-black"
              >
                <FaSearch />
              </button>
            )}

            {openSearch && (
              <div className="hover:border-black flex items-center bg-white border border-gray-400 rounded-xl px-4 py-3 ml-2 w-72">
                <FaSearch className="text-black mr-2" />
                <input
                  type="text"
                  placeholder="Search products..."
                  readOnly
                  onClick={() => navigate("/products")}
                  className="w-full outline-none text-sm bg-transparent cursor-pointer"
                />
                <button
                  onClick={() => setOpenSearch(false)}
                  className="cursor-pointer ml-2 text-gray-500"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <ProductGrid
        currentPage={page}
        itemsPerPage={itemsPerPage}
        data={filteredProducts}
      />

      <div className="flex justify-center mt-7 mb-5">
        <Pagination
          page={page}
          count={totalPages}
          renderItem={(item) => (
            <PaginationItem
              component={Link}
              to={`/products${item.page === 1 ? "" : `?page=${item.page}`}`}
              {...item}
            />
          )}
        />
      </div>
    </>
  );
};

export default ProductCardsWithPagination;
