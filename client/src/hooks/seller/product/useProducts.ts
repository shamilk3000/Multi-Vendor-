import { useQuery } from "@tanstack/react-query";
import { getProducts, getProductById } from "../../../api/seller/product";

// 📦 Get all products
export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
     refetchInterval: 5000,
  staleTime: 0,
  });
};

// 📦 Get single product
export const useProductById = (productId: string) => {
  return useQuery({
    queryKey: ["products", productId],
    queryFn: () => getProductById(productId),
     refetchInterval: 5000,
  staleTime: 0,
    enabled: !!productId,
  });
};






