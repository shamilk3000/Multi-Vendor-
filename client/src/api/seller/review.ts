import api from "../../features/axios";

export const getReviewForSeller = async ({
  productId
}: {
  productId: string;
}) => {
  const res = await api.get(
    `seller/get-reviews/${productId}`
  );
  return res.data;
};