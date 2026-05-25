import { useQuery } from "@tanstack/react-query";
import {
  getSellerProfile,
  getSellerDashboard,
} from "../../../api/seller/profile";

export const useSellerProfile = () => {
  return useQuery({
    queryKey: ["profile", "seller"],
    queryFn: () => getSellerProfile(),
    refetchInterval: 5000,
    staleTime: 0,
  });
};

export const useSellerDashboard = () => {
  return useQuery({
    queryKey: ["profile", "dashboard"],
    queryFn: () => getSellerDashboard(),
    refetchInterval: 5000,
    staleTime: 0,
  });
};
