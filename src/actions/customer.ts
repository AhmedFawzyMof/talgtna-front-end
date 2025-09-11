import api from "@/api";

export const getCustomers = async (
  token: string,
  limit: number,
  search: string
) => {
  const response = await api.get(
    `/admin/users?limit=${limit}&search=${search}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
};
