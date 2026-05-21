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

export const getAllOrderForUser = async () => {
  const res = await api.get( `/all-orders-of-user`, {
  });
  return res.data;
};

export const getOrderByIdForUser = async ({
  orderId,
}: {
  orderId: string;
}) => {
  const res = await api.get( `/get-order-by-id/${orderId}`);
  return res.data;
};