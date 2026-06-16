import api from "../../features/axios";

export const getProductsForUser = async ({
  sellerId,
  shopName,
  categoryId,
}: {
  sellerId: string;
  shopName: string;
  categoryId: string;
}) => {
  const res = await api.get(
    `/${sellerId}/${shopName}/get-all-products-for-customer`,
    {
      params: categoryId ? { categoryId } : {},
    },
  );

  return res.data;
};

export const getProductByIdForUser = async ({
  productId,
}: {
  productId: string;
}) => {
  const res = await api.get(`/get-product-by-id/${productId}`);
  return res.data;
};

export const getProductsInCategory = async ({
  categoryId,
}: {
  categoryId: string;
}) => {
  const res = await api.get(`/get-products-in-category/${categoryId}`);
  return res.data;
};
