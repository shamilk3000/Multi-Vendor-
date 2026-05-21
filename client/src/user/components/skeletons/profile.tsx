// ProfileSkeleton.tsx
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ProfileSkeleton = () => {
  return (
    <div className="flex justify-center">
      <div className="w-full rounded-2xl border shadow-md p-6 md:p-10 bg-white">
        {/* HEADER */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Skeleton circle width={80} height={80} />
          </div>

          <Skeleton
            height={30}
            width={220}
            className="mx-auto mb-2"
          />

          <Skeleton
            height={15}
            width={180}
            className="mx-auto"
          />
        </div>

        {/* PERSONAL DETAILS */}
        <div className="border rounded-xl p-5 mb-5 bg-white">
          <Skeleton
            height={25}
            width={180}
            className="mb-5"
          />

          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="flex items-start gap-3 py-3 border-b last:border-none"
            >
              <Skeleton circle width={18} height={18} />

              <div className="flex-1">
                <Skeleton
                  height={10}
                  width={90}
                  className="mb-2"
                />

                <Skeleton height={18} width="70%" />
              </div>
            </div>
          ))}
        </div>

        {/* ADDRESS DETAILS */}
        <div className="border rounded-xl p-5 bg-white">
          <Skeleton
            height={25}
            width={180}
            className="mb-5"
          />

          {[1, 2, 3, 4, 5, 6, 7].map((item) => (
            <div
              key={item}
              className="flex items-start gap-3 py-3 border-b last:border-none"
            >
              <Skeleton circle width={18} height={18} />

              <div className="flex-1">
                <Skeleton
                  height={10}
                  width={100}
                  className="mb-2"
                />

                <Skeleton height={18} width="80%" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;