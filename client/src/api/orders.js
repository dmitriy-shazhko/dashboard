import { ApiError } from "utils/ApiError";

const BASE_API = process.env.REACT_APP_BASE_API;
const URL = `${BASE_API}/api/orders`;

export const getOrders = async ({ limit, offset }) => {
  const response = await fetch(`${URL}?limit=${limit}&offset=${offset}`);
  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(data.message, data.errors);
  }

  return data;
};

export const createOrder = async ({ customerId, productName, price, quantity }) => {
  const response = await fetch(`${URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ customerId, productName, price, quantity }),
  });
  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(data.message, data.errors);
  }

  return data;
};

export const deleteOrder = async (id) => {
  const response = await fetch(`${URL}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(data.message, data.errors);
  }

  return data;
};

export const updateOrder = async ({ id, ...body }) => {
  console.log(body);
  const response = await fetch(`${URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(data.message, data.errors);
  }

  return data;
};
