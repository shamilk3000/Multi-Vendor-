import { useQuery } from "@tanstack/react-query";
import { getProductsForUser } from "../../../api/user/product";


export const useProductsForUser = (sellerId: string, shopName: string) => { 
  return useQuery({
    queryKey: ["products"],
    queryFn: () => getProductsForUser({ sellerId, shopName }),
  refetchInterval: 5000,
  staleTime: 0,
    enabled: !!sellerId && !!shopName,
  });
};