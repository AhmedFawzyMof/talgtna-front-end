import api from "@/api";

export const getCompanies = async (token: string, search: string) => {
  const response = await api.get(`/admin/companies?search=${search}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const deleteCompanies = async (token: string, ids: number[]) => {
  const response = await api.post(
    `/admin/companies/delete`,
    { ids },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
};

export const addCompanies = async (token: string, company: any) => {
  const response = await api.post(`/admin/companies`, company, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
};

export const editCompanies = async (token: string, company: any) => {
  const response = await api.put(`/admin/companies/${company.id}`, company, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "Application/json",
    },
  });
  return response;
};
