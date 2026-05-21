import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    updateOrderStatus
} from "../../../api/seller/order";

const useInvalidateOrder = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({
      queryKey: ["products"],
      refetchType: "all",
      exact: false,
    });
    queryClient.invalidateQueries({
      queryKey: ["categories"],
      refetchType: "all",
      exact: false,
    });
    queryClient.invalidateQueries({
      queryKey: ["reviews"],
      refetchType: "all",
      exact: false,
    });
    queryClient.invalidateQueries({
      queryKey: ["carts"],
      refetchType: "all",
      exact: false,
    });
    queryClient.invalidateQueries({
      queryKey: ["orders"],
      refetchType: "all",
    });
    queryClient.invalidateQueries({
      queryKey: ["profile"],
   refetchType: "all",
    });
  };
};

export const ultrateUpdateOrderStatus = () => {
  const invalidate = useInvalidateOrder();

  return useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: invalidate,
  });
};