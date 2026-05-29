import { useQuery } from "@tanstack/react-query";
import { getReviewForSeller } from "../../../api/seller/review";

export const useReviewForSeller = (productId?: string) => {
  return useQuery({
    queryKey: ["reviews", "seller", productId],
    queryFn: () => getReviewForSeller({ productId: productId! }),
    refetchInterval: 1000,
    staleTime: 0,
    enabled: !!productId,
  });
};
