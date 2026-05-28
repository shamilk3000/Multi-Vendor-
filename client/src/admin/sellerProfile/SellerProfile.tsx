// import Navbar from "../sellerNavbar/SellerNavbar";
// import Footer from "../sellerFooter/SellerFooter";
// import {
//   FaUserTie,
//   FaEnvelope,
//   FaPhone,
//   FaStore,
//   FaMapMarkerAlt,
// } from "react-icons/fa";

// const dummySellers = [
//   {
//     id: 1,
//     name: "Ayaan Mohammed",
//     email: "ayaan@example.com",
//     phone: "+971 501234567",
//     business: "Ayaan Traders",
//     city: "Dubai",
//   },
//   {
//     id: 2,
//     name: "Nimra Shah",
//     email: "nimra@example.com",
//     phone: "+971 502345678",
//     business: "Shah Boutique",
//     city: "Abu Dhabi",
//   },
//   {
//     id: 3,
//     name: "Rihan Ali",
//     email: "rihan@example.com",
//     phone: "+971 503456789",
//     business: "Ali Electronics",
//     city: "Sharjah",
//   },
//   {
//     id: 4,
//     name: "Meera Nair",
//     email: "meera@example.com",
//     phone: "+971 504567890",
//     business: "Meera Collections",
//     city: "Dubai",
//   },
// ];

// const SellerProfilesPage = () => {
//   return (
//     <>
//       <Navbar />

//       <div className="min-h-screen bg-white px-4 py-10">
//         <div className="max-w-6xl mx-auto">
          
//           {/* Heading */}
//           <h1 className="text-3xl font-bold flex items-center gap-2 mb-8">
//             <FaUserTie />
//             Seller Profiles
//           </h1>

//           {/* Grid */}
//           <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {dummySellers.map((seller) => (
//               <div
//                 key={seller.id}
//                 className="border rounded-2xl p-5 shadow-sm hover:shadow-xl transition bg-white"
//               >
//                 {/* Avatar */}
//                 <div className="w-12 h-12 bg-black text-white flex items-center justify-center rounded-full text-lg mb-3">
//                   {seller.name.charAt(0)}
//                 </div>

//                 {/* Name */}
//                 <h2 className="text-lg font-semibold">{seller.name}</h2>

//                 {/* Details */}
//                 <div className="mt-3 space-y-2 text-sm text-gray-700">
//                   <p className="flex items-center gap-2">
//                     <FaEnvelope className="text-gray-500" />
//                     {seller.email}
//                   </p>

//                   <p className="flex items-center gap-2">
//                     <FaPhone className="text-gray-500" />
//                     {seller.phone}
//                   </p>

//                   <p className="flex items-center gap-2">
//                     <FaStore className="text-gray-500" />
//                     {seller.business}
//                   </p>

//                   <p className="flex items-center gap-2">
//                     <FaMapMarkerAlt className="text-gray-500" />
//                     {seller.city}
//                   </p>
//                 </div>

//                 {/* Button */}
//                 <button className="mt-4 w-full py-2 rounded-lg bg-black text-white hover:bg-white hover:text-black border border-black transition">
//                   View Profile
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       <Footer />
//     </>
//   );
// };

// export default SellerProfilesPage;