const BASE_API = process.env.REACT_APP_BASE_API;
const URL = `${BASE_API}/api/customers`;

export const getCustomers = async ({ limit, offset }) => {
  const response = await fetch(`${URL}?limit=${limit}&offset=${offset}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};

export const createCustomer = async ({ name, birthDate }) => {
  const response = await fetch(`${URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, birthDate }),
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};

export const deleteCustomer = async (id) => {
  const response = await fetch(`${URL}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};

export const updateCustomer = async ({ id, ...body }) => {
  console.log(id, body);
  const response = await fetch(`${URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};
