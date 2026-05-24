import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const FooterSkeleton = () => {
  return (
    <footer className="bg-black text-white py-8 overflow-hidden">
      {/* Social Icons Skeleton */}
      <div className="flex justify-center gap-6 mb-12">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="w-12 h-12 rounded-full overflow-hidden"
          >
            <Skeleton
              circle
              width={48}
              height={48}
              baseColor="#222"
              highlightColor="#444"
            />
          </div>
        ))}
      </div>

      {/* Copyright Skeleton */}
      <div className="flex justify-center">
        <Skeleton
          width={140}
          height={14}
          baseColor="#222"
          highlightColor="#444"
        />
      </div>
    </footer>
  );
};

export default FooterSkeleton;