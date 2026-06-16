import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function CategoryMegaMenuSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
      {/* Parent Categories */}
      <div className="flex items-center gap-3 px-2 py-4 overflow-hidden">
        {Array.from({ length: 12 }).map((_, index) => (
          <Skeleton key={index} width={100} height={40} borderRadius={9999} />
        ))}
      </div>

      {/* Child Categories */}
      {/* <div className="border-t p-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {Array.from({ length: 10 }).map((_, index) => (
            <div
              key={index}
              className="rounded-xl border border-gray-200 p-4"
            >
              <Skeleton height={18} width="70%" />
              <div className="mt-3">
                <Skeleton height={12} width="40%" />
              </div>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
}

export default CategoryMegaMenuSkeleton;
