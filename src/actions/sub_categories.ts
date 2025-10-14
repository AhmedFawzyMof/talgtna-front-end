import api from "@/api";

export const getSubCategories = async (token: string, search: string) => {
  const response = await api.get(`/admin/sub_categories?search=${search}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const deleteSubCategories = async (token: string, ids: number[]) => {
  const response = await api.post(
    `/admin/sub_categories/delete`,
    { ids },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
};

export const addSubCategories = async (token: string, company: any) => {
  const response = await api.post(`/admin/sub_categories`, company, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
};

export const editSubCategories = async (token: string, company: any) => {
  const response = await api.put(
    `/admin/sub_categories/${company.id}`,
    company,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "Application/json",
      },
    }
  );
  return response;
};
