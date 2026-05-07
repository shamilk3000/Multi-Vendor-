import api from "../../features/axios";

export const addReview = async (data: any) => {
  const res = await api.post("/add-rating", data);
  return res.data;
};

// export const getProductByIdForUser = async ({
//   productId
// }: {
//   productId: string;
// }) => {
//   const res = await api.get(
//     `/get-product-by-id/${productId}`
//   );
//   return res.data;
// };