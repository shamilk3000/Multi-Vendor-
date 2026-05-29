import { useQuery } from "@tanstack/react-query";
import { getCart } from "../../../api/user/cart";

export const useCart = () => {
  return useQuery({
    queryKey: ["carts"],
    queryFn: () => getCart(),
    refetchInterval: 1000,
    staleTime: 0,
  });
};
