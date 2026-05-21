import { useQuery } from "@tanstack/react-query";
import { getOrderForSeller, getOrderByIdForSeller } from "../../../api/seller/order";


export const useOrderForSeller = () => { 
  return useQuery({
    queryKey: ["orders"],
    queryFn: () => getOrderForSeller(),
     refetchInterval: 5000,
  staleTime: 0,
  });
};

export const useOrderByIdForSeller = (orderId: string) => {  
  return useQuery({
    queryKey: ["orders", "single"],
    queryFn: () => getOrderByIdForSeller({ orderId }),
     refetchInterval: 5000,
  staleTime: 0,
  enabled: !!orderId
  });
};

