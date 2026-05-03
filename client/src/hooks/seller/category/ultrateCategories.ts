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
    });
    queryClient.invalidateQueries({
      queryKey: ["products"],
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