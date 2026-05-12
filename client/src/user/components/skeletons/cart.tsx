import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
const CartPageSkeleton = () => {
return (
  <div className="min-h-screen flex flex-col bg-gray-50 p-0">
    

    <div className="min-h-[calc(100vh-120px)] md:min-h-[calc(100vh-64px)] bg-gray-50 p-4 md:p-8">
      {/* Heading Skeleton */}
      <div className="mb-6">
        <Skeleton height={35} width={220} />
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* CART ITEMS SKELETON */}
        <div className="md:col-span-2 space-y-5">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="bg-white border rounded-xl p-4 md:p-5 shadow-sm"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* LEFT */}
                <div className="flex items-center gap-3 flex-1">
                  {/* Image */}
                  <Skeleton
                    className="rounded-lg"
                    height={80}
                    width={80}
                  />

                  {/* Product Details */}
                  <div className="flex flex-col gap-2 w-full">
                    <Skeleton height={18} width={"60%"} />
                    <Skeleton height={15} width={90} />
                    <Skeleton height={15} width={120} />
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-4">
                  {/* Quantity */}
                  <div className="flex items-center gap-2 bg-gray-100 rounded-full px-2 py-1">
                    <Skeleton circle height={32} width={32} />
                    <Skeleton height={20} width={20} />
                    <Skeleton circle height={32} width={32} />
                  </div>

                  {/* Delete */}
                  <Skeleton circle height={28} width={28} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ORDER SUMMARY SKELETON */}
        <div className="bg-white border rounded-xl p-6 shadow-md h-fit">
          <Skeleton height={28} width={180} className="mb-5" />

          <div className="space-y-3 mb-5">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex justify-between items-center"
              >
                <Skeleton height={15} width={120} />
                <Skeleton height={15} width={60} />
              </div>
            ))}
          </div>

          <div className="space-y-4 mb-5">
            <div className="flex justify-between">
              <Skeleton height={18} width={80} />
              <Skeleton height={18} width={70} />
            </div>

            <div className="flex justify-between">
              <Skeleton height={18} width={80} />
              <Skeleton height={18} width={50} />
            </div>
          </div>

          <div className="border-t pt-4 flex justify-between mb-5">
            <Skeleton height={22} width={70} />
            <Skeleton height={22} width={90} />
          </div>

          {/* Checkout Button */}
          <Skeleton height={48} borderRadius={10} />
        </div>
      </div>
    </div>

    {/* Footer Skeleton */}
    
  </div>
);};

export default CartPageSkeleton;
