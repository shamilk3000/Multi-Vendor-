import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addReview,
} from "../../../api/user/review";

// 🧠 shared invalidate
const useInvalidateReviews = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({
      queryKey: ["reviews"],
   refetchType: "all",
    });
    queryClient.invalidateQueries({
      queryKey: ["products"],
   refetchType: "all",
    });
  };
};

// 📦 Create
export const ultrateAddReview = () => {
  const invalidate = useInvalidateReviews();

  return useMutation({
    mutationFn: addReview,
    onSuccess: invalidate,
  });
};