import { useMutation } from "@tanstack/react-query";
import { updateOrder } from "api/orders";
import { deleteOrder } from "api/orders";
import { createOrder } from "api/orders";

export const useCreateOrder = () => {
  return useMutation({
    mutationFn: createOrder,
  });
};

export const useDeleteOrder = () => {
  return useMutation({
    mutationFn: deleteOrder,
  });
};

export const useUpdateOrder = () => {
  return useMutation({
    mutationFn: updateOrder,
  });
};
