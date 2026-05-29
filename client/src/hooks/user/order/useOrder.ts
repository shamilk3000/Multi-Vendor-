import { useQuery } from "@tanstack/react-query";
import {
  getOrderForUser,
  getAllOrderForUser,
  getOrderByIdForUser,
} from "../../../api/user/order";

export const useOrderForUser = (orderId: string) => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: () => getOrderForUser({ orderId }),
    refetchInterval: 1000,
    staleTime: 0,
    enabled: !!orderId,
  });
};

export const useAllOrderForUser = () => {
  return useQuery({
    queryKey: ["orders", "all"],
    queryFn: () => getAllOrderForUser(),
    refetchInterval: 1000,
    staleTime: 0,
  });
};

export const useOrderByIdForUser = (orderId: string) => {
  return useQuery({
    queryKey: ["orders", "single", orderId],
    queryFn: () => getOrderByIdForUser({ orderId }),
    refetchInterval: 1000,
    staleTime: 0,
    enabled: !!orderId,
  });
};
