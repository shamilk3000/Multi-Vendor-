import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ProductPageSkeleton = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 p-0">
      <div className="min-h-[calc(100vh-120px)] md:min-h-[calc(100vh-64px)] bg-gray-100 pt-0 px-0 p-6">
        {/* Breadcrumb */}
        {/* <div className="mt-4 ms-5 mb-0 pb-0">
          <Skeleton width={220} height={20} />
        </div> */}

        {/* Product Section */}
        <main className="px-4 md:px-0 py-2 md:py-4 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-0">
          {/* Gallery Skeleton */}
          <section className="max-w-6xl mx-auto px-4 w-full">
            <div className="space-y-4">
              <Skeleton height={420} className="rounded-2xl" />

              <div className="flex gap-3 justify-center flex-wrap">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} height={64} width={64} borderRadius={12} />
                ))}
              </div>
            </div>
          </section>

          {/* Product Info Skeleton */}
          <div className="space-y-8 px-2 md:px-0">
            {/* Product Name */}
            <Skeleton height={40} width="70%" />

            {/* Price */}
            <div className="space-y-3">
              <div className="flex gap-3 items-center flex-wrap">
                <Skeleton width={120} height={35} />
                <Skeleton width={70} height={20} />
                <Skeleton width={90} height={30} borderRadius={8} />
              </div>

              {/* Rating */}
              <div className="flex gap-2 items-center">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} width={24} height={24} circle />
                ))}

                <Skeleton width={70} height={18} />
                <Skeleton width={50} height={18} />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <Skeleton width={140} height={20} />

              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} height={18} />
              ))}
            </div>

            {/* Quantity */}
            {/* <div className="space-y-2">
              <Skeleton width={90} height={18} />

              <Skeleton width={130} height={45} borderRadius={8} />
            </div> */}

            {/* Buttons */}
            <div className="flex flex-col md:flex-row gap-4 mb-2">
              <Skeleton height={30} width={100} borderRadius={8} />

              <Skeleton height={30} width={100} borderRadius={8} />
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <Skeleton height={30} width={100} borderRadius={8} />

              <Skeleton height={30} width={100} borderRadius={8} />
            </div>
          </div>
        </main>

        {/* Suggested Products */}
        <section className="py-0 md:py-1 justify-center mt-5">
          <Skeleton width={220} height={30} className="mb-5 ms-4" />

          <div className="flex overflow-hidden gap-4 px-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="min-w-[180px] bg-white rounded-lg p-2">
                <Skeleton height={160} borderRadius={10} />

                <div className="mt-3 space-y-2">
                  <Skeleton height={18} />
                  <Skeleton height={12} width="70%" />

                  <div className="flex gap-2">
                    <Skeleton width={60} height={18} />
                    <Skeleton width={50} height={18} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Rating + Review */}
        <div className="max-w-7xl mx-auto px-4 mt-6 ">
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            {/* Rating Chart Skeleton */}
            <div className="w-full py-4 lg:w-1/2 flex justify-center">
              <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-5">
                <div className="flex justify-center w-full">
                  <Skeleton height={35} width={250} />
                </div>
                <div className="flex gap-4 items-center">
                  <Skeleton width={70} height={70} borderRadius={12} />

                  <div className="flex gap-2">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} width={24} height={24} circle />
                    ))}
                  </div>

                  {/* Move to end */}
                  <div className="ml-auto">
                    <Skeleton width={40} height={15} />
                  </div>
                </div>

                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3 w-full">
                    <Skeleton width={20} height={15} />

                    <Skeleton width={17} height={17} circle />

                    {/* Full width skeleton */}
                    <div className="flex-1">
                      <Skeleton height={15} />
                    </div>
                    <Skeleton width={20} height={15} />
                  </div>
                ))}
              </div>
            </div>

            {/* Write Review Skeleton */}
            <div className="w-full lg:w-1/2 flex justify-center">
              <div
                className="
          bg-white px-6 py-5 sm:px-7 sm:py-5 
          rounded-2xl max-w-md w-full 
          space-y-4 border border-gray-200
          shadow-md shadow-black/10
        "
              >
                {/* Title */}
                <div className="flex justify-center">
                  <Skeleton height={30} width={180} />
                </div>

                <div className="h-px bg-gray-200" />

                {/* Rows */}
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    {/* Left side */}
                    <div className="flex items-center gap-2">
                      <Skeleton width={16} height={16} circle />
                      <Skeleton width={90} height={15} />
                    </div>

                    {/* Right side */}
                    <Skeleton width={80} height={22} borderRadius={8} />
                  </div>
                ))}

                {/* Rating Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Skeleton width={16} height={16} circle />
                    <Skeleton width={90} height={15} />
                  </div>

                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} width={14} height={14} circle />
                    ))}

                    <Skeleton width={20} height={15} className="ml-0" />
                  </div>
                </div>

                <div className="h-px bg-gray-200" />

                {/* Bottom rows */}
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Skeleton width={16} height={16} circle />
                      <Skeleton width={95} height={15} />
                    </div>

                    <Skeleton width={70} height={20} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Skeleton */}
        <div className="px-4 md:px-8 mt-8">
          <Skeleton width={200} height={30} className="mb-6" />

          <div className="space-y-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-5 rounded-lg border">
                <Skeleton width="40%" height={20} className="mb-3" />

                <div className="flex gap-2 mb-3">
                  {[...Array(5)].map((_, idx) => (
                    <Skeleton key={idx} width={20} height={20} circle />
                  ))}
                </div>

                <Skeleton count={2} height={16} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPageSkeleton;
