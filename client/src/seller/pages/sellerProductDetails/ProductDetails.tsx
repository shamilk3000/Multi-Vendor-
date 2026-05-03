import {
  FaLayerGroup,
  FaTags,
  FaBoxOpen,
  FaChartLine,
  FaStar,
  FaPaperclip,
  FaEnvelope,
  FaStarHalfAlt,
  FaRegStar,
} from "react-icons/fa";

interface CategoryDetailsProps {
  product: {
    subCategoryName: string;
    parentCategoryName: string;
    stock: number;
    sale: number;
    ratingAverage: number;
    needAttachment: boolean;
    needMessage: boolean;
  };
}

const CategoryDetails: React.FC<CategoryDetailsProps> = ({ product }) => {
  return (
    <div className="flex justify-center px-0.5 md:px-0 md:py-6">
      <div
        className="
          group bg-white px-6 py-5 sm:px-7 sm:py-5 rounded-2xl max-w-md w-full space-y-3 border border-gray-200
          shadow-md shadow-black/10 transition-all duration-300 transform
          hover:scale-105 hover:shadow-2xl hover:shadow-black/30
        "
      >
        {/* Title */}
        <h2
          style={{ animationDelay: "0ms" }}
          className="text-xl sm:text-2xl font-bold text-center text-black group-hover:animate-[wave_0.6s_ease-in-out]"
        >
          Product Details
        </h2>

        <div className="h-px bg-gray-200" />

        {/* Category */}
        <div
          style={{ animationDelay: "80ms" }}
          className="flex items-center justify-between text-xs sm:text-sm group-hover:animate-[wave_0.6s_ease-in-out]"
        >
          <span className="flex items-center gap-1.5 text-black">
            <FaLayerGroup /> Category
          </span>
          <span className="font-medium text-black">
            {product.parentCategoryName}
          </span>
        </div>

        {/* Sub Category */}
        <div
          style={{ animationDelay: "120ms" }}
          className="flex items-center justify-between text-xs sm:text-sm group-hover:animate-[wave_0.6s_ease-in-out]"
        >
          <span className="flex items-center gap-1.5 text-black">
            <FaTags /> Sub Category
          </span>
          <span className="font-medium text-black">
            {product.subCategoryName}
          </span>
        </div>

        {/* Stock */}
        <div
          style={{ animationDelay: "160ms" }}
          className="flex items-center justify-between text-xs sm:text-sm group-hover:animate-[wave_0.6s_ease-in-out]"
        >
          <span className="flex items-center gap-1.5 text-black">
            <FaBoxOpen /> Stock
          </span>
          <span
            className={`font-semibold px-2 py-0.5 rounded ${
              product.stock === 0
                ? "text-red-500 bg-red-100 rounded-lg ring ring-red-800"
                : product.stock < 10
                  ? "text-yellow-600 bg-yellow-100 rounded-lg ring ring-yellow-800"
                  : "text-green-600 bg-green-100 rounded-lg ring ring-green-800"
            }`}
          >
            {product.stock === 0
              ? "Out"
              : product.stock < 10
                ? `Low (${product.stock})`
                : `In (${product.stock})`}
          </span>
        </div>

        {/* Sales */}
        <div
          style={{ animationDelay: "200ms" }}
          className="flex items-center justify-between text-xs sm:text-sm group-hover:animate-[wave_0.6s_ease-in-out]"
        >
          <span className="flex items-center gap-1.5 text-black">
            <FaChartLine /> Sold
          </span>
          <span className="font-medium text-black">{product.sale}</span>
        </div>

        {/* Rating with stars */}
        <div
          style={{ animationDelay: "240ms" }}
          className="flex items-center justify-between text-xs sm:text-sm group-hover:animate-[wave_0.6s_ease-in-out]"
        >
          <span className="flex items-center gap-1.5 text-black">
            <FaStar /> Rating
          </span>

          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => {
              const rating = product.ratingAverage;

              return (
                <span key={star}>
                  {rating >= star ? (
                    <FaStar className="text-yellow-400 text-sm" />
                  ) : rating >= star - 0.5 ? (
                    <FaStarHalfAlt className="text-yellow-400 text-sm" />
                  ) : (
                    <FaRegStar className="text-gray-300 text-sm" />
                  )}
                </span>
              );
            })}

            <span className="ml-1 text-black font-medium">
              {product.ratingAverage}
            </span>
          </div>
        </div>

        <div className="h-px bg-gray-200" />

        {/* Attachment */}
        <div
          style={{ animationDelay: "280ms" }}
          className="flex items-center justify-between text-xs sm:text-sm group-hover:animate-[wave_0.6s_ease-in-out]"
        >
          <span className="flex items-center gap-1.5 text-black">
            <FaPaperclip /> Attachment
          </span>
          <span className="font-medium text-black">
            {product.needAttachment ? "Required" : "No"}
          </span>
        </div>

        {/* Message */}
        <div
          style={{ animationDelay: "320ms" }}
          className="flex items-center justify-between text-xs sm:text-sm group-hover:animate-[wave_0.6s_ease-in-out]"
        >
          <span className="flex items-center gap-1.5 text-black">
            <FaEnvelope /> Message
          </span>
          <span className="font-medium text-black">
            {product.needMessage ? "Required" : "Optional"}
          </span>
        </div>

        {/* Wave animation */}
        <style>
          {`
            @keyframes wave {
              0% { transform: translateY(0); }
              25% { transform: translateY(-3px); }
              50% { transform: translateY(3px); }
              75% { transform: translateY(-2px); }
              100% { transform: translateY(0); }
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default CategoryDetails;
