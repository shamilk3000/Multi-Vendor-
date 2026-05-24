import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SellerEditProfileSkeleton = () => {
  const InputSkeleton = () => (
    <div className="mb-3">
      <Skeleton width={110} height={14} />

      <div className="mt-2">
        <Skeleton height={42} borderRadius={10} />
      </div>
    </div>
  );

  const SectionSkeleton = ({
    titleWidth = 140,
    rows = 5,
  }: {
    titleWidth?: number;
    rows?: number;
  }) => (
    <div className="border p-4 rounded-xl mb-4 bg-white">
      <Skeleton width={titleWidth} height={24} />

      <div className="mt-4">
        {Array.from({ length: rows }).map((_, index) => (
          <InputSkeleton key={index} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="w-full border p-4 md:p-10">
      {/* Header */}
      <div className="flex flex-row gap-3 items-center pb-5">
        <Skeleton circle width={24} height={24} />
        <Skeleton width={180} height={32} />
      </div>

      {/* Personal */}
      <SectionSkeleton rows={3} />

      {/* Address */}
      <SectionSkeleton rows={7} />

      {/* Business */}
      <SectionSkeleton rows={13} />

      {/* Banking */}
      <SectionSkeleton rows={5} />

      {/* Button */}
      <div className="mt-5">
        <Skeleton height={48} borderRadius={10} />
      </div>
    </div>
  );
};

export default SellerEditProfileSkeleton;