import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAmount } from "../../../api/admin/profile";

const useInvalidateAdmin = () => {
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

export const ultrateAmount = () => {
  const invalidate = useInvalidateAdmin();

  return useMutation({
    mutationFn: updateAmount,
    onSuccess: invalidate,
  });
};
