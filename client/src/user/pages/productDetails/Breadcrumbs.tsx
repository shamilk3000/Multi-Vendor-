import { useNavigate } from "react-router-dom";

interface BreadcrumbsProps {
  productName: string;
  sellerId: string;
  shopName: string;
}
        



const Breadcrumbs = ({ productName ,sellerId, shopName}: BreadcrumbsProps) => {
  const navigate = useNavigate();
  return (
    <div className="max-w-6xl px-0 mb-1">
      <nav className="ms-5 text-sm text-gray-500 flex items-center gap-2">

<span
  onClick={() => navigate(`/${sellerId}/${shopName}/shop`)}
  className="hover:text-black transition-colors cursor-pointer"
>
  Shop
</span>
        <span>/</span>
        <span className="text-black font-medium truncate">
          {productName}
        </span>
      </nav>
    </div>
  );
};

export default Breadcrumbs;
