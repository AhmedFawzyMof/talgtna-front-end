import api from "@/api";

export const getDelivery = async (token: string) => {
  const response = await api.get(`/admin/delivery`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
};

export const addDelivery = async (token: string, delivery: any) => {
  const data = {
    city: delivery.get("city"),
    value: delivery.get("delivery"),
  };

  const response = await api.post(`/admin/delivery`, JSON.stringify(data), {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "Application/json",
    },
  });

  return response;
};

export const editDelivery = async (token: string, delivery: any) => {
  const response = await api.put(`/admin/delivery/${delivery.id}`, delivery, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const deleteDelivery = async (token: string, id: number) => {
  const response = await api.delete(`/admin/delivery/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const hideCity = async (token: string, id: number, hide: number) => {
  const hidden = hide === 1 ? true : false;
  const response = await api.put(
    `/admin/delivery/`,
    { id, hide: hidden },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
};
