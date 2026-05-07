import api from "../../features/axios";

export const getProductsForUser = async ({
  sellerId,
  shopName,
}: {
  sellerId: string;
  shopName: string;
}) => {
  const res = await api.get(
    `/${sellerId}/${shopName}/get-all-products-for-customer`
  );
  return res.data;
};

export const getProductByIdForUser = async ({
  productId
}: {
  productId: string;
}) => {
  const res = await api.get(
    `/get-product-by-id/${productId}`
  );
  return res.data;
};
