import api from "../../features/axios";
// import type { Product } from "../../types/product";

export const createProduct = async (data: any) => {
  const res = await api.post("/seller/create-product", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const editProduct = async (data: any) => {
  const res = await api.put("/seller/update-product", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const getProducts = async () => {
  const res = await api.get("/seller/get-product-for-seller");
  return res.data;
};

export const getProductById = async (productId: string) => {
  const res = await api.get(`/seller/get-product/${productId}`);
  return res.data;
};

export const deleteProduct = async ({ productId }: { productId: string }) => {
  const res = await api.put(`/seller/delete-product/${productId}`);
  return res.data;
};

export const restoreProduct = async ({ productId }: { productId: string }) => {
  const res = await api.put(`/seller/restore-product/${productId}`);
  return res.data;
};
