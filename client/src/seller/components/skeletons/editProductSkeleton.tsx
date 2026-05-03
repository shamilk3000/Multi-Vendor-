import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const EditProductSkeleton = () => {
  return (
    <div className="md:py-6 bg-gray-50 p-0 md:px-6 flex items-center justify-center">
      <div className="w-full md:max-w-5xl md:mx-auto bg-white p-4 md:p-6 md:rounded-2xl md:shadow-2xl md:ring-1 md:ring-gray-300">
        {/* HEADER */}
        <div className="mb-3">
          <div className="flex md:ms-0 ms-10 items-center gap-2">
            <Skeleton circle width={22} height={22} />
            <div className=" w-[120px] md:w-[160px]">
              <Skeleton height={24} />
            </div>
          </div>
        </div>

        {/* NAME + DESCRIPTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
          <Skeleton height={45} />
          <Skeleton height={55} />
        </div>

        {/* PRICES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Skeleton height={45} />
            <Skeleton height={45} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Skeleton height={45} />
            <Skeleton height={45} />
          </div>
        </div>

        {/* CATEGORY + TOGGLES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Skeleton height={45} />
              <Skeleton height={45} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Skeleton height={40} />
              <Skeleton height={40} />
            </div>
          </div>

          {/* IMAGE SECTION */}
          <div className="mb-4 border border-gray-300 p-3 rounded-lg">
            <Skeleton height={20} width={120} className="mb-3" />

            <div className="flex gap-2 flex-wrap">
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="w-18 h-18 md:w-20 md:h-20">
                    <Skeleton height="100%" width="100%" borderRadius={10} />
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* BUTTON */}
        <div className="mt-1">
          <Skeleton height={45} borderRadius={8} />
        </div>
      </div>
    </div>
  );
};

export default EditProductSkeleton;
