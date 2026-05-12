import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";
import Reviews from "./Reviews";
import WriteReview from "./WriteReview";
import RatingChart from "./RatingChart";
import SuggestedProducts from "./SuggestedProducts";
import Breadcrumbs from "./Breadcrumbs";
// import type Product from "./Product";
import Footer from "../footer/Footer";
import Navbar from "../navbar/Navbar";
import { useParams,useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useProductByIdForUser } from "../../../hooks/user/product/useProducts";
import ProductPageSkeleton from "../../components/skeletons/productDetails";


const ProductPage = () => {
  const { sellerId, shopName,productId } = useParams();
  
  const { data: product, isLoading } = useProductByIdForUser(productId);
  const navigate = useNavigate();
  
  useEffect(() => {
  if (isLoading) return;

  if (
  !product ||
  !product.isActive ||
  product.stock === 0
) {
  navigate(`/${sellerId}/${shopName}/shop`, {
    replace: true,
  });
}}, [product, isLoading, navigate, sellerId, shopName]);

if (isLoading) {
  return <ProductPageSkeleton />;
}


  return (
    <div className="min-h-screen flex flex-col bg-gray-50 p-0">
      <Navbar shopName={shopName!}  sellerId={sellerId!}/>

      <div className="min-h-[calc(100vh-120px)] md:min-h-[calc(100vh-64px)] bg-gray-100 pt-0 px-0 p-6">
      
        <div className="mt-4 ms-5 mb-0 pb-0">
          <Breadcrumbs productName={product.name} sellerId={sellerId!} shopName={shopName!}/>
        </div>
        <main className="px-4 md:px-0 py-2 md:py-4 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-0">
          <ProductGallery product={product} />
          <ProductInfo product={product} shopName={shopName!}  sellerId={sellerId!}/>
        </main>

        <section className=" py-0 md:py-1 justify-center">
          <SuggestedProducts category={product.category._id} sellerId={sellerId!} shopName={shopName!} productId={product._id}/>
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
