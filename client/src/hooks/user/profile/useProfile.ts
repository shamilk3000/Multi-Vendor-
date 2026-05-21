import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "../../../api/user/profile";

export const useUserProfile = () => {
  return useQuery({
    queryKey: ["profile","user"],
    queryFn: () => getUserProfile(),
     refetchInterval: 5000,
    staleTime: 0,
  });
};