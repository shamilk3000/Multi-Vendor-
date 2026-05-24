import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SellerProfileSkeleton = () => {
  const SkeletonRow = () => (
    <div className="py-3 border-b last:border-none">
      {/* Label */}
      <Skeleton height={14} width={90} />

      {/* Value */}
      <div className="mt-2">
        <Skeleton height={18} width="40%" />
      </div>
    </div>
  );

  const SectionSkeleton = () => (
    <div className="border rounded-xl p-5 mb-5 bg-white">
      <div className="mb-4">
        <Skeleton width={150} height={22} />
      </div>

      {Array.from({ length: 8 }).map((_, index) => (
        <SkeletonRow key={index} />
      ))}
    </div>
  );

  return (
    <div className="flex justify-center">
      <div className="w-full border rounded-2xl shadow-md p-6 md:p-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center">
            <Skeleton circle width={80} height={80} />
          </div>

          <div className="mt-4 flex justify-center">
            <Skeleton width={180} height={28} />
          </div>

          <div className="mt-2 flex justify-center">
            <Skeleton width={140} height={16} />
          </div>
        </div>

        {/* Sections */}
        <SectionSkeleton />
        <SectionSkeleton />
        <SectionSkeleton />
        <SectionSkeleton />

        {/* Documents */}
        <div className="border rounded-xl p-5 mt-5 bg-white">
          <Skeleton width={120} height={22} />

          <div className="mt-4">
            <Skeleton height={16} width="35%" />
          </div>

          <div className="mt-3">
            <Skeleton height={16} width="30%" />
          </div>
        </div>

        {/* Button */}
        <div className="mt-6">
          <Skeleton height={45} borderRadius={10} />
        </div>
      </div>
    </div>
  );
};

export default SellerProfileSkeleton;