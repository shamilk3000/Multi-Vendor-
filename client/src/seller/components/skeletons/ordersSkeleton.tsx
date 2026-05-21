import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SellerOrdersSkeleton = () => {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-100 overflow-hidden"
        >
          {/* HEADER */}
          <div className="flex flex-row sm:justify-between sm:items-start gap-4 mb-4">
            <div className="space-y-0 w-full">
              <div className="w-[70%] sm:w-[220px]">
                <Skeleton height={18} />
              </div>

              <div className="w-[55%] sm:w-[180px]">
                <Skeleton height={16} />
              </div>

              <div className="w-[50%] sm:w-[160px]">
                <Skeleton height={16} />
              </div>

              <div className="w-[80%] sm:w-[240px]">
                <Skeleton height={16} />
              </div>
            </div>

            <div className="flex flex-row items-start gap-2 shrink-0">
              <Skeleton width={50} height={20} borderRadius={9999} />
              <Skeleton width={70} height={25} borderRadius={9999} />
            </div>
          </div>

          {/* PRODUCTS */}
          <div className="border-t pt-3 space-y-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-3 bg-gray-100 border border-gray-200 p-3 rounded-lg overflow-hidden"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Skeleton
                    width={56}
                    height={56}
                    borderRadius={8}
                    className="shrink-0"
                  />

                  <div className="flex-1 space-y-2 min-w-0">
                    <div className="w-[80%] sm:w-[220px]">
                      <Skeleton height={16} />
                    </div>

                    <div className="w-[40%] sm:w-[90px]">
                      <Skeleton height={14} />
                    </div>
                  </div>
                </div>

                <div className="shrink-0">
                  <Skeleton width={60} height={18} />
                </div>
              </div>
            ))}
          </div>

          {/* FOOTER */}
          <div className="border-t mt-3 pt-3 flex items-center justify-between gap-3">
            <div className="w-[70px] sm:w-[80px]">
              <Skeleton height={16} />
            </div>

            <div className="w-[100px] sm:w-[120px]">
              <Skeleton height={18} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SellerOrdersSkeleton;