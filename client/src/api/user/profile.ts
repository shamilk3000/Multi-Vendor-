import api from "../../features/axios";

export const getUserProfile = async () => {
  const res = await api.get( `/get-user-profile`);
  return res.data;
};

export const getFooter = async (sellerId: string) => {
  const res = await api.get( `/get-user-footer/${sellerId}`);
  return res.data;
};