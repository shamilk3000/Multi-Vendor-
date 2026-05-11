import api from "../../features/axios";

export const addReview = async (data: any) => {
  const res = await api.post("/add-rating", data);
  return res.data;
};

export const getReviewForUser = async ({
  productId
}: {
  productId: string;
}) => {
  const res = await api.get(
    `/get-reviews/${productId}`
  );
  return res.data;
};