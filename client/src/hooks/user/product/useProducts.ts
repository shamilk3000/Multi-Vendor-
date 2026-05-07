import { useQuery } from "@tanstack/react-query";
import { getProductsForUser, getProductByIdForUser } from "../../../api/user/product";

export const useProductsForUser = (sellerId: string, shopName: string) => {
  return useQuery({
    queryKey: ["products", "allProducts" , sellerId],
    queryFn: () => getProductsForUser({ sellerId, shopName }),
    refetchInterval: 5000,
    staleTime: 0,
    enabled: !!sellerId && !!shopName,
  });
};

export const useProductByIdForUser = (productId?: string) => {
  return useQuery({
        queryKey: ["products", "singleProducts" , "user" , productId ,],
    queryFn: () => {
      return getProductByIdForUser({ productId: productId! });
    },
    enabled: !!productId,
  });
};
