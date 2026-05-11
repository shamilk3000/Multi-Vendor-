import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";
import Reviews from "./Reviews";
import CategoryDetails from "./ProductDetails";
import RatingChart from "./RatingChart";
import type Product from "./Product";
import { useParams, useNavigate } from "react-router-dom";
import { useProductByIdForDetails } from "../../../hooks/seller/product/useProducts";
import { useEffect } from "react";
import ProductPageSkeleton from "../../components/skeletons/productDetails";

const ProductPage = () => {
  const { productId } = useParams();
  const { data: product, isLoading } = useProductByIdForDetails(productId);
  const navigate = useNavigate();
  useEffect(() => {
    if (isLoading) return;

    if (!product) {
      navigate("/seller/products", {
        replace: true,
      });
    }
  }, [product, isLoading, navigate]);

  if (isLoading) {
    return <ProductPageSkeleton />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 p-0">
      <div className="min-h-[calc(100vh-120px)] md:min-h-[calc(100vh-64px)] bg-gray-100 pt-0 px-0 p-6">
        <main className="px-4 mt-5 md:px-0 py-2 md:py-4 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-0">
          <ProductGallery product={product} />
          <ProductInfo product={product} />
        </main>

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
              <CategoryDetails
                product={{
                  parentCategoryName: product.category.name,
                  subCategoryName: product.subCategory.name, // ⚠️ your Product type doesn’t have this
                  stock: product.stock,
                  sale: product.sale, // ⚠️ it's `sale`, not `sales`
                  ratingAverage: product.ratingAverage, // ⚠️ correct field
                  needAttachment: product.needAttachment,
                  needMessage: product.needMessage, // ⚠️ not in Product, so give default
                }}
              />{" "}
            </div>
          </div>
        </div>

        <div className="px-4 md:px-8">
          <Reviews productId={product._id} />
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
