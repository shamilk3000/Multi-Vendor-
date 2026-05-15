import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const CategoryPageSkeleton = () => {
  return (
    <div>
    {/* <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="min-h-screen p-0 md:p-3"> */}
        {/* HEADER */}
        {/* <div className="flex justify-between items-center mb-3">
          <div className="flex md:ms-0 ms-10 items-center gap-2">
            <Skeleton circle width={22} height={22} />
            <div className=" w-[120px] md:w-[160px]">
              <Skeleton height={24} />
            </div>
          </div>

          <Skeleton width={120} height={36} borderRadius={8} />
        </div> */}

        {/* SEARCH */}
        {/* <div className="relative mb-5 ">
          <Skeleton height={30} borderRadius={8} />
        </div> */}

        {/* CATEGORY CARDS */}
        <div className="flex flex-col gap-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="border rounded-xl p-4 bg-white border-gray-300"
            >
              {/* TOP */}
              <div className="flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-3">
                    <Skeleton circle width={18} height={18} />

                    <div className="w-[100px] md:w-[180px]">
                      <Skeleton height={20} />
                    </div>
                  </div>

                  <div className="mt-2 w-[120px] md:w-[220px]">
                    <Skeleton height={12} />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Skeleton width={70} height={28} />
                  <Skeleton width={70} height={28} />
                </div>
              </div>

              {/* CHILDREN */}
              <div className="flex flex-col gap-2 mt-4">
                {[1, 2, 3].map((j) => (
                  <div
                    key={j}
                    className="flex justify-between items-center border p-2 rounded-lg bg-gray-100 border-gray-300"
                  >
                    <div>
                      <div className="flex items-center gap-3">
                        <Skeleton circle width={14} height={14} />
                        <Skeleton width={120} height={14} />
                      </div>

                      <div className="mt-1">
                        <Skeleton width={100} height={10} />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Skeleton width={60} height={24} />
                      <Skeleton width={60} height={24} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      {/* </div>
    </div> */}
    </div>
  );
};

export default CategoryPageSkeleton;
