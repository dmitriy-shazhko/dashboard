const BASE_API = process.env.REACT_APP_BASE_API;
const URL = `${BASE_API}/api/orders`;

export const getOrders = async ({ limit, offset }) => {
  const response = await fetch(`${URL}?limit=${limit}&offset=${offset}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};
