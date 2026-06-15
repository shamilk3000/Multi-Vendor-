import { useQuery } from "@tanstack/react-query";
import {
  getUserProfile,
  getFooter,
  getBanner,
} from "../../../api/user/profile";

export const useUserProfile = () => {
  return useQuery({
    queryKey: ["profile", "user"],
    queryFn: () => getUserProfile(),
    refetchInterval: 1000,
    staleTime: 0,
  });
};

export const useUserFooter = (sellerId?: string) => {
  return useQuery({
    queryKey: ["profile", "footer", sellerId],
    queryFn: () => getFooter(sellerId!),
    refetchInterval: 1000,
    staleTime: 0,
    enabled: !!sellerId,
  });
};

export const useBanner = (sellerId?: string) => {
  return useQuery({
    queryKey: ["profile", "banner", sellerId],
    queryFn: () => getBanner(sellerId!),
    refetchInterval: 1000,
    staleTime: 0,
    enabled: !!sellerId,
  });
};
