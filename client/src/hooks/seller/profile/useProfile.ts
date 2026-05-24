import { useQuery } from "@tanstack/react-query";
import { getSellerProfile } from "../../../api/seller/profile";

export const useSellerProfile = () => {
  return useQuery({
    queryKey: ["profile","seller"],
    queryFn: () => getSellerProfile(),
     refetchInterval: 5000,
    staleTime: 0,
  });
};