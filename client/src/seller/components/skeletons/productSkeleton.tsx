import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ProductListSkeleton = () => {
  return (
    <div className="min-h-[calc(100vh-120px)] md:min-h-[calc(110vh)] bg-gray-50 p-4 md:p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center md:ms-0 ms-10 mb-4">
        <div className="flex md:ms-0 ms-1 items-center gap-2">
          <Skeleton circle width={22} height={22} />
          <div className=" w-[120px] md:w-[180px]">
            <Skeleton height={30} />
          </div>
        </div>

        <Skeleton height={35} width={80} />
      </div>

      {/* SEARCH + FILTER */}
      <div className="flex flex-col md:flex-row gap-3 mb-3">
        {/* SEARCH */}
        <div className="flex-1">
          <Skeleton height={40} width="100%" />
        </div>

        {/* FILTER BUTTONS */}
        <div className="flex gap-2">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} height={40} width={80} />
            ))}
        </div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="border border-gray-400 rounded-xl p-3">
              <Skeleton height={240} className="mb-3 rounded-lg" />
              <Skeleton height={20} width="70%" className="mb-2" />
              <Skeleton height={12} width="60%" className="mb-2" />

              <div className="flex justify-between items-center mb-2">
                {/* LEFT SIDE */}
                <div className="flex items-center gap-2">
                  <Skeleton height={20} width={60} />
                  <Skeleton height={15} width={50} />
                  <Skeleton height={15} width={40} />
                </div>

                {/* RIGHT SIDE */}
                <div>
                  <Skeleton height={15} width={50} />
                </div>
              </div>

              <div className="flex justify-between mb-2">
                <Skeleton height={15} width={80} />
                <Skeleton height={15} width={50} />
              </div>

              <div className="flex gap-2">
                {[1, 2].map((_, i) => (
                  <div key={i} className="flex-1">
                    <Skeleton height={34} className="rounded-lg" />
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>

      {/* PAGINATION */}
      {/* <div className="flex justify-center mt-7">
        <Skeleton height={40} width={200} />
      </div> */}
    </div>
  );
};

export default ProductListSkeleton;
