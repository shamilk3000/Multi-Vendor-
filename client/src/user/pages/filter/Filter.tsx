// import { motion } from "framer-motion";
// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Slider } from "@/components/ui/slider";
// import { Badge } from "@/components/ui/badge";
// import { FiSearch } from "react-icons/fi";

// interface ProductFilterProps {
//   onClose: () => void;
// }

// export type ProductSort = "price_low_high" | "price_high_low" | "rating";

// export interface ProductFilters {
//   search: string;
//   category?: string;
//   subCategory?: string;
//   price: [number, number];
//   sort?: ProductSort;
// }

// const CATEGORIES: Record<string, string[]> = {
//   Electronics: ["Mobiles", "Laptops", "Accessories"],
//   Fashion: ["Men", "Women", "Kids"],
//   Grocery: ["Fruits", "Vegetables", "Snacks"],
// };

// const INITIAL_FILTERS: ProductFilters = {
//   search: "",
//   price: [0, 10000],
// };

// const Filter: React.FC<ProductFilterProps> = ({ onClose }) => {
//   const [filters, setFilters] = useState<ProductFilters>(INITIAL_FILTERS);

//   const handleCancel = (): void => {
//     setFilters(INITIAL_FILTERS);
//     onClose();
//   };


//   return (
//     <motion.div
//       initial={{ opacity: 0, scale: 0.95, y: -10 }}
//       animate={{ opacity: 1, scale: 1, y: 0 }}
//       exit={{ opacity: 0, scale: 0.95, y: -10 }}
//       transition={{ duration: 0.2 }}
//       className="absolute right-0 mt-2 w-[360px] border-black rounded-xl bg-white border shadow-xl p-4 z-50"
//     >
//       {/* 🔍 Search */}

//       {/* <h4 className="font-semibold mb-2">Search product</h4>

//       <div className="relative mb-4">
//         <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 " />

//         <input
//           value={filters.search}
//           onChange={(e) => setFilters({ ...filters, search: e.target.value })}
//           placeholder="Search by name"
//           // className=""
//           className={inputStyle}
//         />
//       </div> */}

//       {/* 🏷 Category */}
//       <h4 className="font-semibold mb-2">Category</h4>
//       <div className="flex flex-wrap gap-2 mb-4">
//         {Object.keys(CATEGORIES).map((cat) => {
//           const active = filters.category === cat;

//           return (
//             <motion.div key={cat} whileTap={{ scale: 0.95 }}>
//               <Badge
//                 variant={active ? "default" : "outline"}
//                 onClick={() =>
//                   setFilters({
//                     ...filters,
//                     category: cat,
//                     subCategory: undefined,
//                   })
//                 }
//                 className="cursor-pointer transition"
//               >
//                 {cat}
//               </Badge>
//             </motion.div>
//           );
//         })}
//       </div>

//       {/* 🧩 Sub Category */}
//       {filters.category && (
//         <>
//           <h4 className="font-semibold mb-2">Sub category</h4>
//           <div className="flex flex-wrap gap-2 mb-4">
//             {CATEGORIES[filters.category].map((sub) => {
//               const active = filters.subCategory === sub;

//               return (
//                 <motion.div key={sub} whileTap={{ scale: 0.95 }}>
//                   <Badge
//                     variant={active ? "default" : "outline"}
//                     onClick={() =>
//                       setFilters({
//                         ...filters,
//                         subCategory: sub,
//                       })
//                     }
//                     className="cursor-pointer transition"
//                   >
//                     {sub}
//                   </Badge>
//                 </motion.div>
//               );
//             })}
//           </div>
//         </>
//       )}

//       {/* 💰 Price */}
//       <h4 className="font-semibold mb-2">Price range</h4>
//       <div className="flex items-center gap-3 mb-4 ">
//         <Badge variant="secondary">
//           ₹{filters.price[0]} - ₹{filters.price[1]}
//         </Badge>
//         <Slider
//           className="cursor-pointer"
//           min={0}
//           max={10000}
//           step={100}
//           value={filters.price}
//           onValueChange={(val) =>
//             setFilters({
//               ...filters,
//               price: val as [number, number],
//             })
//           }
//         />
//       </div>

//       {/* 🔃 Sort */}
//       <h4 className="font-semibold mb-2">Sort by</h4>
//       <div className="flex flex-wrap gap-2 mb-4">
//         {[
//           { label: "Newest", value: "newest" },
//           { label: "Rating", value: "rating" },
//           { label: "Price: Low → High", value: "price_low_high" },
//           { label: "Price: High → Low", value: "price_high_low" },
//           { label: "Alphabetical: A → Z", value: "name_a_z" },
//         ].map((opt) => {
//           const active = filters.sort === opt.value;

//           return (
//             <Badge
//               key={opt.value}
//               variant={active ? "default" : "outline"}
//               onClick={() =>
//                 setFilters({
//                   ...filters,
//                   sort: opt.value as ProductSort,
//                 })
//               }
//               className="cursor-pointer transition"
//             >
//               {opt.label}
//             </Badge>
//           );
//         })}
//       </div>

//       {/* Actions */}
//       <div className="flex justify-end gap-2">
//         <Button
//           className="cursor-pointer"
//           variant="outline"
//           onClick={handleCancel}
//         >
//           Cancel
//         </Button>
//         <Button className="cursor-pointer" onClick={onClose}>
//           Apply
//         </Button>
//       </div>
//     </motion.div>
//   );
// };

// export default Filter;
