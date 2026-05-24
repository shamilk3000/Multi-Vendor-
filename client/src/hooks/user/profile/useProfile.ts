import { useQuery } from "@tanstack/react-query";
import { getUserProfile,getFooter } from "../../../api/user/profile";

export const useUserProfile = () => {
  return useQuery({
    queryKey: ["profile","user"],
    queryFn: () => getUserProfile(),
     refetchInterval: 5000,
    staleTime: 0,
  });
};

export const useUserFooter = (sellerId?: string) => {
  return useQuery({
    queryKey: ["profile","footer", sellerId],
    queryFn: () => getFooter( sellerId! ),
     refetchInterval: 5000,
    staleTime: 0,   
    enabled: !!sellerId,
  });
};