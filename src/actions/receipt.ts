import api from "@/api";

export const getReceipt = async (token: string, id: string) => {
  const response = await api.get(`/admin/receipt/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};
