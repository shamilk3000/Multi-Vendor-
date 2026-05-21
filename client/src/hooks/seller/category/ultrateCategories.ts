import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  restoreCategory,
} from "../../../api/seller/category";

// 🧠 shared invalidate
const useInvalidateCategories = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({
      queryKey: ["categories"],
   refetchType: "all",
    });
    queryClient.invalidateQueries({
      queryKey: ["products"],
   refetchType: "all",
    });
    queryClient.invalidateQueries({
      queryKey: ["reviews"],
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
    queryClient.invalidateQueries({
      queryKey: ["profile"],
   refetchType: "all",
    });
  };
};

// 📦 Create
export const ultrateAddCategory = () => {
  const invalidate = useInvalidateCategories();

  return useMutation({
    mutationFn: createCategory,
    onSuccess: invalidate,
  });
};

// 📦 Update
export const ultrateUpdateCategory = () => {
  const invalidate = useInvalidateCategories();

  return useMutation({
    mutationFn: updateCategory,
    onSuccess: invalidate,
  });
};

// 📦 Delete
export const ultrateDeleteCategory = () => {
  const invalidate = useInvalidateCategories();

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: invalidate,
  });
};

// 📦 Restore
export const ultrateRestoreCategory = () => {
  const invalidate = useInvalidateCategories();

  return useMutation({
    mutationFn: restoreCategory,
    onSuccess: invalidate,
  });
};