import { useQuery } from "@tanstack/react-query";
import { getProducts, getProductById } from "../../../api/seller/product";

// 📦 Get all products
export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });
};

// 📦 Get single product
export const useProductById = (productId: string) => {
  return useQuery({
    queryKey: ["products", productId],
    queryFn: () => getProductById(productId),
    enabled: !!productId,
  });
};