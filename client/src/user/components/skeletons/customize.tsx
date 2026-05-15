import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
const customize = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 p-0">
      <div className="min-h-[calc(100vh-120px)] md:min-h-[calc(100vh-64px)] bg-gray-100 pt-0 p-6">
        {/* Heading Skeleton */}
        <div className="flex justify-center mb-8 mt-3">
          <Skeleton width={280} height={35} borderRadius={12} />
        </div>

        {/* Cards Skeleton */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md p-5 flex flex-col gap-4 border"
            >
              {/* Product Name */}
              <Skeleton height={25} width={"70%"} borderRadius={8} />

              {/* Product Image */}
              <Skeleton height={160} borderRadius={16} />

              {/* Upload Label */}
              <Skeleton height={18} width={120} />

              {/* Upload Box */}
              <Skeleton height={55} borderRadius={12} />

              {/* Preview Images */}
              <div className="grid grid-cols-3 gap-2">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} height={70} borderRadius={10} />
                ))}
              </div>

              {/* Message Label */}
              <Skeleton height={18} width={100} />

              {/* Textarea */}
              <Skeleton height={90} borderRadius={12} />
            </div>
          ))}
        </div>

        {/* Button Skeleton */}
        <div className="flex justify-center mt-10">
          <Skeleton width={220} height={50} borderRadius={14} />
        </div>
      </div>
    </div>
  );
};

export default customize;
