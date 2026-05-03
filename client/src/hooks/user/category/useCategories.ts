import { useQuery } from "@tanstack/react-query";
import { getCategoriesForUser } from "../../../api/user/category";


export const useCategoriesForUser = (sellerId: string) => { 
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategoriesForUser({ sellerId }),
     refetchInterval: 5000,
  staleTime: 0,
    enabled: !!sellerId
  });
};