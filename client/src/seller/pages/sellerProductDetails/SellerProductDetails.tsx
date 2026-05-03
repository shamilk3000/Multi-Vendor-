import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";
import Reviews from "./Reviews";
import CategoryDetails from "./ProductDetails";
import RatingChart from "./RatingChart";
import type Product from "./Product";

const product: Product = {
  _id: "66a8f4d9c2b5a91b8a4f1234",
  name: "Wireless Bluetooth Headphones",
  description:
    "High quality over-ear Bluetooth headphones with noise cancellation and long battery life.High quality over-ear Bluetooth headphones with noise cancellation and long battery life.High quality over-ear Bluetooth headphones with noise cancellation and long battery life.",
  image: [
    "https://images.unsplash.com/photo-1646753522408-077ef9839300?auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1649261191624-ca9f79ca3fc6?auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1651950519238-15835722f8bb?auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1651950537598-373e4358d320?auto=format&fit=crop&w=500&q=60",
  ],
  mrpPrice: 4999,
  sellingPrice: 3499,
  discountPercentage: 30,
  category: "66a8f1b1c2b5a91b8a4c9999",
  parentCategoryName: "Drings",
  subCategoryName: "Monster",
  seller: "66a8f0aac2b5a91b8a4a8888",
  stock: 5,
  needAttachment: false,
  isActive: true,
  sale: 245,
  createdAt: "2026-01-06T07:15:00.000Z",
  updatedAt: "2026-01-06T07:15:00.000Z",
  average: 3.5,
  totalRatings: 1250,
  breakdown: [
    { stars: 5, count: 820 },
    { stars: 4, count: 260 },
    { stars: 3, count: 110 },
    { stars: 2, count: 40 },
    { stars: 1, count: 20 },
  ],
};

const ProductPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 p-0">
      <div className="min-h-[calc(100vh-120px)] md:min-h-[calc(100vh-64px)] bg-gray-100 pt-0 px-0 p-6">
        <main className="px-4 mt-5 md:px-0 py-2 md:py-4 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <ProductGallery product={product} />
          <ProductInfo product={product} />
        </main>

        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* Rating Chart */}
            <div className="w-full py-4 lg:w-1/2 flex justify-center">
              <RatingChart
                average={product.average}
                totalRatings={product.totalRatings}
                breakdown={product.breakdown}
              />
            </div>

            {/* Write Review Form */}
            <div className="w-full lg:w-1/2 justify-center">
              <CategoryDetails
                product={{
                  parentCategoryName: product.parentCategoryName,
                  subCategoryName: product.subCategoryName, // ⚠️ your Product type doesn’t have this
                  stock: product.stock,
                  sale: product.sale, // ⚠️ it's `sale`, not `sales`
                  ratingAverage: product.average, // ⚠️ correct field
                  needAttachment: product.needAttachment,
                  needMessage: false, // ⚠️ not in Product, so give default
                }}
              />{" "}
            </div>
          </div>
        </div>

        <div className="px-4 md:px-8">
          <Reviews />
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
