import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateQuantity,
  deleteItem
} from "../../../api/user/cart";

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
     queryClient.invalidateQueries({
      queryKey: ["categories"],
   refetchType: "all",
    });
    queryClient.invalidateQueries({
      queryKey: ["carts"],
   refetchType: "all",
    });
     queryClient.invalidateQueries({
      queryKey: ["orders"],
   refetchType: "all",
    });
  };
  
};

// 📦 Create
export const ultrateQuantity = () => {
  const invalidate = useInvalidateReviews();

  return useMutation({
    mutationFn: updateQuantity,
    onSuccess: invalidate,
  });
};

export const ultrateDeleteItem = () => {
  const invalidate = useInvalidateReviews();

  return useMutation({
    mutationFn: deleteItem,
    onSuccess: invalidate,
  });
};