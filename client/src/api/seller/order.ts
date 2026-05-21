import api from "../../features/axios";

export const getOrderForSeller = async () => {
  const res = await api.get("/seller/all-orders-of-seller");
  return res.data;
};

export const getOrderByIdForSeller = async ({
  orderId,
}: {
  orderId: string;
}) => {
  const res = await api.get( `seller/get-order-by-id/${orderId}`, {
  });
  return res.data;
};

export const updateOrderStatus = async ({
  orderId,
  status,
}: {
  orderId: string;
  status: string;
}) => {
  const res = await api.put( `seller/update-order-status/${orderId}/${status}`, {
  });
  return res.data;
};
