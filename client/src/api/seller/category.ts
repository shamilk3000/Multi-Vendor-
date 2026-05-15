import api from "../../features/axios";
import type { Category } from "../../types/category";

export const getCategories = async (params?: { onlyActive?: boolean }) => {
  const res = await api.get("/seller/get-all-categories-of-seller", {
    params,
  });
  return res.data;
};

export const createCategory = async (data: Partial<Category>) => {console.log(data);

  const res = await api.post("/seller/create-category", data);
  return res.data;
};

export const updateCategory = async ({
  categoryId,
  data,
}: {
  categoryId: string;
  data: Partial<Category>;
}) => {
  const res = await api.put(`/seller/update-category/${categoryId}`, data);
  return res.data;
};

export const deleteCategory = async ({
  categoryId,
}: {
  categoryId: string;
}) => {
  const res = await api.put(`/seller/delete-category/${categoryId}`);
  return res.data;
};

export const restoreCategory = async ({
  categoryId,
}: {
  categoryId: string;
}) => {
  const res = await api.put(`/seller/restore-category/${categoryId}`);
  return res.data;
};
