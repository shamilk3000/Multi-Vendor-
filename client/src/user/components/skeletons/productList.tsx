import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ProductSkeletonGrid = ({ count = 12 }: { count?: number }) => {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
      
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="w-full sm:w-60 lg:w-72 bg-white rounded-xl shadow-md"
        >
          {/* IMAGE SKELETON */}
          <div className="h-48 sm:h-64 lg:h-80 rounded-t-xl overflow-hidden">
            <Skeleton height="100%" />
          </div>

          {/* TEXT SKELETON */}
          <div className="p-3 space-y-2">
            <Skeleton width={80} height={10} />
            <Skeleton width="90%" height={14} />

            <div className="flex gap-2">
              <Skeleton width={60} height={12} />
              <Skeleton width={40} height={12} />
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default ProductSkeletonGrid;