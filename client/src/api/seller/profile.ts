import api from "../../features/axios";

export const getSellerProfile = async () => {
  const res = await api.get(`/seller/get-seller-profile`);
  return res.data;
};

export const updateProfile = async (data: any) => {
  const res = await api.put("/seller/update-seller-profile", data);
  return res.data;
};

export const getSellerDashboard = async () => {
  const res = await api.get(`/seller/get-seller-dashboard`);
  return res.data;
};

export const updateBanner = async (data: any) => {
  const res = await api.put("/seller/update-banner", data);
  return res.data;
};

export const deleteBanner = async (data: any) => {
  const res = await api.put("/seller/delete-banner", data);
  return res.data;
};
