import api from "../../features/axios";

export const getOrderForUser = async ({
  orderId,
}: {
  orderId: string;
}) => {
  const res = await api.get( `/get-order-by-id/${orderId}`, {
  });
  return res.data;
};
