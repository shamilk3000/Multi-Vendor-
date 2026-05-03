// import React from "react";

function CategoriesCard({ categories }: any) {
  return (
    <div
      className="
        group
        relative
        flex
        w-28 sm:w-32 md:w-36
        flex-col
        items-center
        gap-3
        cursor-pointer
        rounded-xl
        bg-gray-900
        border border-gray-700
        shadow-lg
        transition
        duration-500
        ease-in-out
        hover:scale-105
        hover:-translate-y-1
        hover:shadow-2xl
      "
    >
      {/* IMAGE WRAPPER */}
      <div
        className="
          relative
          w-full
          h-24 sm:h-28 md:h-32
          rounded-xl
          overflow-hidden
          transition-all
          duration-500
          ease-in-out
          group-hover:scale-105
        "
      >
        <img
          src={categories.categoryImage}
          alt={categories.categoryTitle}
          className="
            w-full
            h-full
            object-contain
            transition-transform
            duration-500
            ease-in-out
            group-hover:scale-110
            group-hover:brightness-110
          "
        />

        {/* Glow overlay */}
        <span
          className="
            absolute inset-0 rounded-xl
            bg-white/5
            opacity-0
            group-hover:opacity-30
            transition-opacity
            duration-500
          "
        />
      </div>

      {/* TITLE */}
      <h2
        className="
          text-center
          text-sm sm:text-base md:text-lg
          font-bold
          text-gray-100
          relative
          after:content-['']
          after:block
          after:w-0
          after:h-1
          after:bg-gray-300
          after:rounded
          after:mx-auto
          after:mt-1
          after:transition-all
          after:duration-500
          group-hover:after:w-2/3
          group-hover:text-white
        "
      >
        {categories.categoryTitle}
      </h2>
    </div>
  );
}

export default CategoriesCard;
