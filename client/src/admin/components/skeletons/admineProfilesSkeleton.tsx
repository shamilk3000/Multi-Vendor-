import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SellerProfilesSkeleton = () => {
  return (
    <div className="min-h-screen bg-white px-4 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <Skeleton height={35} width={250} className="mb-4" />

        {/* Search bar */}
        <Skeleton height={40} className="mb-6" />

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border rounded-2xl p-5 shadow-sm bg-white">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Skeleton circle width={48} height={48} />
                  <div>
                    <Skeleton width={120} height={15} />
                    <Skeleton width={80} height={10} />
                  </div>
                </div>

                <Skeleton width={70} height={20} />
              </div>

              {/* Info */}
              <div className="space-y-3">
                <Skeleton height={12} />
                <Skeleton height={12} />
                <Skeleton height={12} />
                <Skeleton height={12} />

                {/* Wallet */}
                <div className="mt-3 p-3 bg-gray-100 rounded-lg space-y-2">
                  <Skeleton width={120} height={12} />
                  <Skeleton height={10} />
                  <Skeleton height={10} />
                  <Skeleton height={10} />
                </div>

                {/* Banking */}
                <div className="p-3 bg-gray-100 rounded-lg space-y-2">
                  <Skeleton width={120} height={12} />
                  <Skeleton height={10} />
                  <Skeleton height={10} />
                  <Skeleton height={10} />
                </div>
              </div>

              {/* Button */}
              <Skeleton height={40} className="mt-4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SellerProfilesSkeleton;
