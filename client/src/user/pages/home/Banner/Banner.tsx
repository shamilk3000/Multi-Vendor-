import Lottie from "lottie-react";
import seoAnimation1 from "../../../../assets/Banner-1.json";
import seoAnimation2 from "../../../../assets/Banner-2.json";
import seoAnimation3 from "../../../../assets/Banner-3.json";
import { useBanner } from "../../../../hooks/user/profile/useProfile";
import BannerSkeleton from "../../../components/skeletons/banner";

const BASE_URL = import.meta.env.VITE_SERVER_IMAGE_TARGET;

type ProductListProps = {
  shopName: string;
  sellerId: string;
};

function Banner({ shopName, sellerId }: ProductListProps) {
  const { data: banner, isLoading } = useBanner(sellerId);
  if (isLoading) return <BannerSkeleton />;

  return (
    <div>
      <div>
        <div className="text-center text-white bg-black px-6 md:px-10">
          <h1 className="font-bold text-3xl md:text-4xl pb-3">
            {`Welcome to ${shopName}`}
          </h1>
        </div>
      </div>

      {banner ? (
        <div className="w-full bg-black">
          <img
            src={`${BASE_URL}${banner}`}
            alt={`${shopName} banner`}
            className="w-full h-[100px] md:h-[300px] object-cover"
          />
        </div>
      ) : (
        <div className="w-full bg-black h-[100px] md:h-[300px] flex items-center justify-between px-4 md:px-10 gap-4">
          <Lottie animationData={seoAnimation1} loop className="w-1/3 h-full" />

          <Lottie animationData={seoAnimation2} loop className="w-1/3 h-full" />

          <Lottie animationData={seoAnimation3} loop className="w-1/3 h-full" />
        </div>
      )}
    </div>
  );
}

export default Banner;
