import api from "@/api";

export const getOffers = async (token: string) => {
  const response = await api.get(`/admin/offers`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const addOffer = async (token: string, offer: any) => {
  const response = await api.post(`/admin/offers`, offer, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
};

export const deleteOffers = async (token: string, ids: number[]) => {
  const response = await api.post(
    `/admin/offers/delete`,
    { ids },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
};
