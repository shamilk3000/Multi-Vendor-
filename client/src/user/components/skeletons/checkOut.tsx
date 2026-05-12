import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
const CheckOutSkeleton = () => {
 return (
    <div className="min-h-screen flex flex-col bg-gray-50 p-0">
      

      <div className="min-h-[calc(100vh-120px)] md:min-h-[calc(100vh-64px)] bg-gray-50 px-4 md:px-5">
        {/* Heading */}
        <div className="my-5">
          <Skeleton height={35} width={220} />
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* SHIPPING ADDRESS SKELETON */}
          <div className="md:col-span-2 bg-white p-4 rounded-xl shadow-lg">
            <Skeleton height={30} width={220} className="mb-6" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[...Array(10)].map((_, i) => (
                <Skeleton
                  key={i}
                  height={48}
                  borderRadius={10}
                />
              ))}
            </div>

            <div className="mt-4">
              <Skeleton
                height={100}
                borderRadius={10}
              />
            </div>
          </div>

          {/* ORDER SUMMARY SKELETON */}
          <div className="bg-white border rounded-xl p-6 shadow-md h-fit mb-6 md:mb-0">
            <Skeleton
              height={28}
              width={180}
              className="mb-5"
            />

            <div className="space-y-4 mb-5">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="flex justify-between"
                >
                  <Skeleton
                    height={15}
                    width={140}
                  />
                  <Skeleton
                    height={15}
                    width={60}
                  />
                </div>
              ))}
            </div>

            <div className="space-y-4 mb-5">
              <div className="flex justify-between">
                <Skeleton
                  height={18}
                  width={80}
                />
                <Skeleton
                  height={18}
                  width={70}
                />
              </div>

              <div className="flex justify-between">
                <Skeleton
                  height={18}
                  width={80}
                />
                <Skeleton
                  height={18}
                  width={50}
                />
              </div>
            </div>

            <div className="border-t pt-4 flex justify-between mb-5">
              <Skeleton
                height={22}
                width={70}
              />
              <Skeleton
                height={22}
                width={90}
              />
            </div>

            {/* Button Skeleton */}
            <Skeleton
              height={50}
              borderRadius={10}
            />
          </div>
        </div>
      </div>

      
    </div>
  );};

export default CheckOutSkeleton;
