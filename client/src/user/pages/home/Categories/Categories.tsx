import React, { useRef, useEffect } from 'react';
import CategoriesCard from './CategoriesCard';

let categories = [
    {
        id: 1,
        categoryImage: "https://m.media-amazon.com/images/I/616fX5Yh00L._AC_UY218_.jpg",
        categoryTitle: "Laptops",
    },
    {
        id: 2,
        categoryImage: "https://m.media-amazon.com/images/I/616fX5Yh00L._AC_UY218_.jpg",
        categoryTitle: "Smartphones",
    },
    {
        id: 3,
        categoryImage: "https://m.media-amazon.com/images/I/616fX5Yh00L._AC_UY218_.jpg",
        categoryTitle: "Tablets",
    },
    {
        id: 4,
        categoryImage: "https://m.media-amazon.com/images/I/616fX5Yh00L._AC_UY218_.jpg",
        categoryTitle: "Desktops",
    },
    {
        id: 5,
        categoryImage: "https://m.media-amazon.com/images/I/616fX5Yh00L._AC_UY218_.jpg",
        categoryTitle: "Accessories",
    },
    {
        id: 6,
        categoryImage: "https://m.media-amazon.com/images/I/616fX5Yh00L._AC_UY218_.jpg",
        categoryTitle: "Wearables",
    },
    {
        id: 7,
        categoryImage: "https://m.media-amazon.com/images/I/616fX5Yh00L._AC_UY218_.jpg",
        categoryTitle: "Gaming",
    },
    {
        id: 8,
        categoryImage: "https://m.media-amazon.com/images/I/616fX5Yh00L._AC_UY218_.jpg",
        categoryTitle: "Cameras",
    },
    {
        id: 9,
        categoryImage: "https://m.media-amazon.com/images/I/616fX5Yh00L._AC_UY218_.jpg",
        categoryTitle: "Audio",
    },
    {
        id: 10,
        categoryImage: "https://m.media-amazon.com/images/I/616fX5Yh00L._AC_UY218_.jpg",
        categoryTitle: "Printers",
    },
    {
        id: 11,
        categoryImage: "https://m.media-amazon.com/images/I/616fX5Yh00L._AC_UY218_.jpg",
        categoryTitle: "Monitors",
    },
    {
        id: 12,
        categoryImage: "https://m.media-amazon.com/images/I/616fX5Yh00L._AC_UY218_.jpg",
        categoryTitle: "Storage",
    },
];

function Categories() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef<number | null>(null);

  // Speed in pixels per frame (~60fps)
  const speed = 0.5;

  // Start continuous auto-scroll
  const startAutoScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    // Clear previous interval if any
    if (autoScrollRef.current) clearInterval(autoScrollRef.current);

    autoScrollRef.current = window.setInterval(() => {
      if (!el) return;

      el.scrollLeft += speed;

      // Loop scroll back to start when reaching the end
      if (el.scrollLeft + el.offsetWidth >= el.scrollWidth) {
        el.scrollLeft = 0;
      }
    }, 16);
  };

  // Stop auto-scroll
  const stopAutoScroll = () => {
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current);
      autoScrollRef.current = null;
    }
  };

  useEffect(() => {
    startAutoScroll();

    // Cleanup on unmount
    return () => stopAutoScroll();
  }, []);

  const containerClasses = `flex flex-nowrap py-2 px-1 lg:px-10 border-b overflow-x-auto overflow-y-hidden
    gap-x-1 sm:gap-x-6 md:gap-x-8 lg:gap-x-10 scroll-hide
  `;

  return (
    <div
      ref={scrollRef}
      className={containerClasses}
      style={{
        msOverflowStyle: 'none',
        scrollbarWidth: 'none',
      }}
      // Pause auto-scroll when mouse is over container
      onMouseEnter={stopAutoScroll}
      onMouseLeave={startAutoScroll}
    >
      {categories.map((category) => (
        <div
          key={category.id}
          className="shrink-0 w-1/3 sm:w-1/4 md:w-1/5 lg:w-1/6 xl:w-1/12 2xl:w-1/12 flex justify-center"
        >
          <CategoriesCard categories={category} />
        </div>
      ))}
      <style>{`
        /* Hide scrollbar for webkit browsers */
        .scroll-hide::-webkit-scrollbar {
          display: none;
        }
        /* Hide scrollbar for Firefox */
        .scroll-hide {
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

export default Categories;
