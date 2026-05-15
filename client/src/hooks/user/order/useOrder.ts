import { useQuery } from "@tanstack/react-query";
import { getOrderForUser } from "../../../api/user/order";


export const useOrderForUser = (orderId: string) => { 
  return useQuery({
    queryKey: ["orders"],
    queryFn: () => getOrderForUser({ orderId }),
     refetchInterval: 5000,
  staleTime: 0,
    enabled: !!orderId
  });
};