// import React, { useState, useEffect } from "react";
import Lottie from "lottie-react";
import seoAnimation1 from "../../../../assets/Banner-1.json";
import seoAnimation2 from "../../../../assets/Banner-2.json";
import seoAnimation3 from "../../../../assets/Banner-3.json";

function Banner() {
  return (
    <div>
      <div>
        <div className="text-center text-white bg-black px-6 md:px-10">
          <h1 className="font-bold text-3xl md:text-4xl pb-3">
            Welcome to Dummy Product Shop
          </h1>
          {/* <h2 className="text-2xl md:text-3xl">My Products</h2> */}
        </div>
      </div>

      {/* <div className="w-full"> */}
      <div className="w-full bg-black h-[100px] md:h-[300px] flex items-center justify-between px-4 md:px-10 gap-4">
        <Lottie animationData={seoAnimation1} loop className="w-1/3 h-full" />

        <Lottie animationData={seoAnimation2} loop className="w-1/3 h-full" />

        <Lottie animationData={seoAnimation3} loop className="w-1/3 h-full" />
      </div>
    </div>
  );
}

export default Banner;
