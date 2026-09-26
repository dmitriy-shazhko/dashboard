import { useMutation, useQuery } from "@tanstack/react-query";
import { getCustomerOptions } from "api/customers";
import { updateCustomer } from "api/customers";
import { deleteCustomer } from "api/customers";
import { createCustomer } from "api/customers";

export const useCustomerOptions = () => {
  return useQuery({
    queryKey: ["customers", "options"],
    queryFn: getCustomerOptions,
  });
};

export const useCreateCustomer = () => {
  return useMutation({
    mutationFn: createCustomer,
  });
};

export const useDeleteCustomer = () => {
  return useMutation({
    mutationFn: deleteCustomer,
  });
};

export const useUpdateCustomer = () => {
  return useMutation({
    mutationFn: updateCustomer,
  });
};
