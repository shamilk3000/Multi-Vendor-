import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SellerDashboardSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6 animate-pulse">
      {/* Heading */}
      <div className="mb-6">
        <Skeleton height={35} width={240} borderRadius={10} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <Skeleton width={80} height={15} />
              <Skeleton circle width={36} height={36} />
            </div>

            <Skeleton width={70} height={28} />
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-2xl p-5 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-4">
          <Skeleton width={160} height={24} />
        </div>

        <Skeleton height={260} borderRadius={20} />
      </div>

      {/* Top Products + Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-5 shadow-sm">
            <Skeleton width={180} height={24} className="mb-5" />

            <div className="space-y-5">
              {[...Array(5)].map((_, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-2">
                    <Skeleton width={120} height={16} />
                    <Skeleton width={100} height={16} />
                  </div>

                  <Skeleton height={10} borderRadius={999} />

                  {idx === 1 && (
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {[...Array(3)].map((_, j) => (
                        <Skeleton
                          key={j}
                          width={70}
                          height={28}
                          borderRadius={999}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Website URL */}
      <div className="border rounded-xl p-5 mb-5 bg-white mt-6">
        <div className="flex items-center justify-between mb-4">
          <Skeleton width={170} height={24} />
          <Skeleton width={90} height={40} borderRadius={10} />
        </div>

        <div className="border rounded-xl p-4 bg-gray-50 flex items-start gap-3">
          <Skeleton circle width={40} height={40} />

          <div className="flex-1">
            <Skeleton width={120} height={12} className="mb-2" />
            <Skeleton width={"100%"} height={18} />
          </div>
        </div>
      </div>

      {/* Banner Section */}
      <div className="mb-6">
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm">
          {/* Desktop / Tablet */}
          <div className="hidden md:block">
            <Skeleton height={300} />
          </div>

          {/* Mobile */}
          <div className="block md:hidden">
            <Skeleton height={150} />
          </div>
        </div>
      </div>

      {/* QR Section */}
      <div className="mt-6 bg-white rounded-2xl p-5 shadow-sm flex flex-col items-center">
        <Skeleton width={250} height={28} className="mb-6" />

        <div className="w-full max-w-md bg-gray-900 rounded-3xl p-6 flex flex-col items-center">
          <Skeleton width={220} height={30} />

          <Skeleton width={260} height={15} className="mt-3" />

          <div className="bg-white p-4 rounded-2xl mt-5">
            <Skeleton width={240} height={240} />
          </div>

          <Skeleton width={120} height={24} className="mt-5" />

          <Skeleton width={280} height={14} className="mt-3" />

          <Skeleton width={260} height={14} className="mt-2" />
        </div>

        <Skeleton width={180} height={45} borderRadius={12} className="mt-5" />
      </div>
    </div>
  );
};

export default SellerDashboardSkeleton;
