import api from "../../features/axios";

export const getAdminProfile = async (email?: { email?: string }) => {
  const res = await api.get(`/admin/get-admin-profiles/${email?.email}`);
  return res.data;
};

export const updateAmount = async ({
  sellerId,
  email,
}: {
  sellerId: string;
  email: string;
}) => {
  const res = await api.put(`admin/update-amount/${email}/${sellerId}`, {});
  return res.data;
};
