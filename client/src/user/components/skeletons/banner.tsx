// import Skeleton from "react-loading-skeleton";
// import "react-loading-skeleton/dist/skeleton.css";

// function BannerSkeleton() {
//   return (
//     <div>
//       {/* Heading */}
//       <div className="text-center bg-black px-6 md:px-10 py-3">
//         <div className="flex justify-center">
//           <Skeleton width={280} height={35} />
//         </div>
//       </div>

//       {/* Banner */}
//       <div className="w-full bg-black">
//         <Skeleton
//           height={290}
//           className="hidden md:block"
//           baseColor="#1f1f1f"
//           highlightColor="#2d2d2d"
//         />
//       </div>
//     </div>
//   );
// }

// export default BannerSkeleton;

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function BannerSkeleton() {
  return (
    <div>
      {/* Heading */}
      <div className="text-center bg-black px-6 md:px-10 py-3">
        <div className="flex justify-center">
          <Skeleton width={280} height={35} />
        </div>
      </div>

      {/* Mobile Banner */}
      <div className="w-full bg-black md:hidden">
        <Skeleton height={135} baseColor="#1f1f1f" highlightColor="#2d2d2d" />
      </div>

      {/* Desktop Banner */}
      <div className="w-full bg-black hidden md:block">
        <Skeleton height={290} baseColor="#1f1f1f" highlightColor="#2d2d2d" />
      </div>
    </div>
  );
}

export default BannerSkeleton;
