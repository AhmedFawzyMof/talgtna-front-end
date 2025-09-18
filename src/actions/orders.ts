import api from "@/api";

export const getOrders = async (
  token: string,
  limit: number,
  search: string
) => {
  const response = await api.get(
    `/admin/orders?limit=${limit}&search=${search}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
};

export const editOrder = async (token: string, order: any) => {
  console.log(order);
  const response = await api.put(`/admin/orders/${order.id}`, order, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};
