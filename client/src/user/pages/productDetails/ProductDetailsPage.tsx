import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";
import Reviews from "./Reviews";
import WriteReview from "./WriteReview";
import RatingChart from "./RatingChart";
import SuggestedProducts from "./SuggestedProducts";
import Breadcrumbs from "./Breadcrumbs";
import type Product from "./Product";
import Footer from "../footer/Footer";
import Navbar from "../navbar/Navbar";
import { useParams,useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useProductByIdForUser } from "../../../hooks/user/product/useProducts";

// const product: Product = {
//   _id: "66a8f4d9c2b5a91b8a4f1234",
//   name: "Wireless Bluetooth Headphones",
//   description:
//     "High quality over-ear Bluetooth headphones with noise cancellation and long battery life.High quality over-ear Bluetooth headphones with noise cancellation and long battery life.High quality over-ear Bluetooth headphones with noise cancellation and long battery life.",
//   image: [
//     "https://images.unsplash.com/photo-1646753522408-077ef9839300?auto=format&fit=crop&w=500&q=60",
//     "https://images.unsplash.com/photo-1649261191624-ca9f79ca3fc6?auto=format&fit=crop&w=500&q=60",
//     "https://images.unsplash.com/photo-1651950519238-15835722f8bb?auto=format&fit=crop&w=500&q=60",
//     "https://images.unsplash.com/photo-1651950537598-373e4358d320?auto=format&fit=crop&w=500&q=60",
//   ],
//   mrpPrice: 4999,
//   sellingPrice: 3499,
//   discountPercentage: 30,
//   category: "66a8f1b1c2b5a91b8a4c9999",
//   seller: "66a8f0aac2b5a91b8a4a8888",
//   ratingAverage: 3.9,
//   ratingCount: 128,
//   stock: true,
//   needAttachment: false,
//   isActive: true,
//   sale: 245,
//   createdAt: "2026-01-06T07:15:00.000Z",
//   updatedAt: "2026-01-06T07:15:00.000Z",
//   average: 4.5,
//   totalRatings: 1250,
//   breakdown: [
//     { stars: 5, count: 820 },
//     { stars: 4, count: 260 },
//     { stars: 3, count: 110 },
//     { stars: 2, count: 40 },
//     { stars: 1, count: 20 },
//   ],
// };

const ProductPage = () => {
  const { sellerId, shopName,productId } = useParams();
  
  const { data: product, isLoading } = useProductByIdForUser(productId);
  const navigate = useNavigate();
  
  useEffect(() => {
  if (isLoading) return;

  if (product && (!product.isActive || product.stock === 0)) {
    navigate(`/${sellerId}/${shopName}/shop`, { replace: true });
  }
 
}, [product, isLoading, navigate, sellerId, shopName]);
if (isLoading || !product) {
  return <div>Loading...</div>;
}
if (!isLoading){
  console.log(product)
}
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 p-0">
      <Navbar shopName={shopName!} />

      <div className="min-h-[calc(100vh-120px)] md:min-h-[calc(100vh-64px)] bg-gray-100 pt-0 px-0 p-6">
        <div className="mt-4 ms-5 mb-0 pb-0">
          <Breadcrumbs productName={product.name} sellerId={sellerId!} shopName={shopName!}/>
        </div>
        <main className="px-4 md:px-0 py-2 md:py-4 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <ProductGallery product={product} />
          <ProductInfo product={product} />
        </main>

        <section className=" py-0 md:py-1 justify-center">
          <SuggestedProducts />
        </section>

        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* Rating Chart */}
            <div className="w-full py-4 lg:w-1/2 flex justify-center">
              <RatingChart
                average={product.ratingAverage}
                totalRatings={product.ratingCount}
                breakdown={product.breakdown}
              />
            </div>

            {/* Write Review Form */}
            <div className="w-full lg:w-1/2 justify-center">
              <WriteReview productId={product._id} />
            </div>
          </div>
        </div>

        <div className="px-4 md:px-8">
          <Reviews productId={product._id} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductPage;
