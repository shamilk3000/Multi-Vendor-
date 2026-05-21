import api from "../../features/axios";

export const getUserProfile = async () => {
  const res = await api.get( `/get-user-profile`);
  return res.data;
};