import api from "@/api";

export const getDashboard = async (token: string) => {
  const response = await api.get("/admin/dashboard", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};
