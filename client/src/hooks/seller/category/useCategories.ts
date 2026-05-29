import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../../../api/seller/category";

// 📦 Get all categories
export const useCategories = (params?: { onlyActive?: boolean }) => {
  return useQuery({
    queryKey: ["categories", params], // important for filtering
    queryFn: () => getCategories(params),
     refetchInterval: 1000,
  staleTime: 0,
  });
};


