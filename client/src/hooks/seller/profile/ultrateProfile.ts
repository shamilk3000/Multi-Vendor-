import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateProfile,
  deleteBanner,
  updateBanner,
} from "../../../api/seller/profile";

// 🧠 shared invalidate logic
const useInvalidateProfiles = () => {
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

// 📦 Create
export const ultrateUpdateProfile = () => {
  const invalidate = useInvalidateProfiles();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: invalidate,
  });
};

export const ultrateUpdateBanner = () => {
  const invalidate = useInvalidateProfiles();

  return useMutation({
    mutationFn: updateBanner,
    onSuccess: invalidate,
  });
};
export const ultrateDeleteBanner = () => {
  const invalidate = useInvalidateProfiles();

  return useMutation({
    mutationFn: deleteBanner,
    onSuccess: invalidate,
  });
};
