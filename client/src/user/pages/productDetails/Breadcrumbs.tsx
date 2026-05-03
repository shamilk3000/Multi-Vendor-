import { Link } from "react-router-dom";

interface BreadcrumbsProps {
  productName: string;
}

const Breadcrumbs = ({ productName }: BreadcrumbsProps) => {
  return (
    <div className="max-w-6xl px-0 mb-1">
      <nav className="ms-5 text-sm text-gray-500 flex items-center gap-2">
        <Link to="/" className="hover:text-black transition-colors">
          Home
        </Link>
        <span>/</span>
        <span className="text-black font-medium truncate">
          {productName}
        </span>
      </nav>
    </div>
  );
};

export default Breadcrumbs;
