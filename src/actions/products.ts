import api from "@/api";

export const getProducts = async (
  token: string,
  limit: number,
  search: string
) => {
  const response = await api.get(
    `/admin/products?limit=${limit}&search=${search}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
};

export const editProduct = async (token: string, product: any, id: number) => {
  const formData = new FormData();
  Object.entries(product).forEach((entry) => {
    formData.append(entry[0], entry[1] as any);
  });

  const response = await api.put(`/admin/products/${id}`, product, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const deleteProducts = async (token: string, ids: number[]) => {
  const response = await api.put(
    `/admin/products`,
    { ids },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
};

export const addProduct = async (token: string, product: any) => {
  const response = await api.post(`/admin/products`, product, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
};
