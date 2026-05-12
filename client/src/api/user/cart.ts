import api from "../../features/axios";

export const getCart = async () => {
  const res = await api.get("/get-user-cart");
  return res.data;
};

export const updateQuantity = async ({
  cartItemId,
  action,
}: {
  cartItemId: string;
  action: string;
}) => {
  const res = await api.put(
    `/update-cart-item-quantity/${cartItemId}/${action}`,
  );
  return res.data;
};

export const deleteItem = async ({ cartItemId }: { cartItemId: string }) => {
  const res = await api.delete(`/delete-cart-item/${cartItemId}`);
  return res.data;
};
