import { useQuery } from "@tanstack/react-query";
import { getProductsForUser } from "../../../api/user/product";


export const useProducts = (sellerId?: string, shopName?: string) => {
  return useQuery({
    queryKey: ["products", sellerId, shopName],
    queryFn: () => {
      if (!sellerId || !shopName) return Promise.resolve([]);
      return getProductsForUser({ sellerId, shopName });
    },
    enabled: !!sellerId && !!shopName,
  });
};