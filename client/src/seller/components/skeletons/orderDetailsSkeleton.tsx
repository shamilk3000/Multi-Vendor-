import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SellerOrderDetailsSkeleton = () => {
  return (
    <div className="min-h-screen bg-white p-4 md:p-6 animate-pulse">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <Skeleton width={220} height={30} />

        <Skeleton width={120} height={40} borderRadius={10} />
      </div>

      {/* ORDER STATUS */}
      <div className="bg-white border rounded-2xl p-5 md:p-6 mb-6 shadow-sm">
        <Skeleton width={160} height={25} className="mb-6" />

        <div className="flex justify-between items-center">
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="flex flex-col items-center flex-1"
            >
              <Skeleton circle width={40} height={40} />
              <Skeleton width={50} height={10} className="mt-2" />
            </div>
          ))}
        </div>
      </div>

      {/* INFO + ADDRESS */}
      <div className="grid gap-5 md:grid-cols-2 mb-6">
        {/* ORDER INFO */}
        <div className="bg-white border rounded-2xl p-5 shadow-sm">
          <Skeleton width={150} height={24} className="mb-5" />

          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((item) => (
              <Skeleton key={item} height={18} />
            ))}
          </div>
        </div>

        {/* ADDRESS */}
        <div className="bg-white border rounded-2xl p-5 shadow-sm">
          <Skeleton width={180} height={24} className="mb-5" />

          <div className="space-y-3">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <Skeleton key={item} height={18} />
            ))}
          </div>
        </div>
      </div>

      {/* PRODUCTS */}
      <div className="bg-white border rounded-2xl p-5 md:p-6 shadow-sm">
        <Skeleton width={120} height={24} className="mb-5" />

        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="flex items-center justify-between border rounded-xl p-4"
            >
              <div className="flex items-center gap-4">
                <Skeleton width={64} height={64} borderRadius={10} />

                <div className="space-y-2">
                  <Skeleton width={140} height={18} />
                  <Skeleton width={80} height={14} />
                  <Skeleton width={60} height={14} />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Skeleton width={100} height={36} borderRadius={8} />
                <Skeleton width={60} height={20} />
              </div>
            </div>
          ))}
        </div>

        {/* TOTAL */}
        <div className="border-t mt-6 pt-4 flex justify-between">
          <Skeleton width={80} height={25} />
          <Skeleton width={100} height={25} />
        </div>
      </div>
    </div>
  );
};

export default SellerOrderDetailsSkeleton;