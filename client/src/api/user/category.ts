import api from "../../features/axios";

export const getCategoriesForUser = async ({
  sellerId,
}: {
  sellerId: string;
}) => {
  const res = await api.get( `/${sellerId}/get-all-categories-of-seller`, {
  });
  return res.data;
};
