import api from "@/api";

export const getCategories = async (token: string, search: string) => {
  const response = await api.get(`/admin/categories?search=${search}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const deleteCategories = async (token: string, ids: number[]) => {
  const response = await api.post(
    `/admin/categories/delete`,
    { ids },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
};

export const addCategory = async (token: string, category: any) => {
  const data: { [key: string]: string } = {};

  for (const pair of category.entries()) {
    data[pair[0]] = pair[1];
  }

  const response = await api.post(`/admin/categories`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "Application/json",
    },
  });

  return response;
};
