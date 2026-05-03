import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createProduct,
  editProduct,
  deleteProduct,
  restoreProduct,
} from "../../../api/seller/product";

// 🧠 shared invalidate logic
const useInvalidateProducts = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: ["products"],
  exact: false, });
    queryClient.invalidateQueries({ queryKey: ["categories"],
  exact: false, });
  };
};

// 📦 Create
export const ultrateAddProduct = () => {
  const invalidate = useInvalidateProducts();

  return useMutation({
    mutationFn: createProduct,
    onSuccess: invalidate,
  });
};

// 📦 Edit
export const ultrateEditProduct = () => {
  const invalidate = useInvalidateProducts();

  return useMutation({
    mutationFn: editProduct,
    onSuccess: invalidate,
  });
};

// 📦 Delete
export const ultrateDeleteProduct = () => {
  const invalidate = useInvalidateProducts();

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: invalidate,
  });
};

// 📦 Restore
export const ultrateRestoreProduct = () => {
  const invalidate = useInvalidateProducts();

  return useMutation({
    mutationFn: restoreProduct,
    onSuccess: invalidate,
  });
};