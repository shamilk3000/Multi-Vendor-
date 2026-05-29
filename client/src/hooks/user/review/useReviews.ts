import { useQuery } from "@tanstack/react-query";
import { getReviewForUser } from "../../../api/user/review";

export const useReviewForUser = (productId?: string) => {
  return useQuery({
    queryKey: ["reviews", "user", productId],
    queryFn: () => getReviewForUser({ productId: productId! }),
    refetchInterval: 1000,
    staleTime: 0,
    enabled: !!productId,
  });
};
