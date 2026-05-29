import { useQuery } from "@tanstack/react-query";
import {
  getAdminProfile
} from "../../../api/admin/profile";

export const useAdminProfile = (email?: { email?: string } ) => {
  return useQuery({
    queryKey: ["profile", "admin", "all", email ],
    queryFn: () =>   getAdminProfile(email),
    refetchInterval: 1000,
    staleTime: 0,
  });
};