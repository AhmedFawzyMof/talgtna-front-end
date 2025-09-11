import api from "@/api";

export const getAdmins = async (token: string) => {
  const response = await api.get(`/admin/admins`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const addAdmins = async (token: string, admin: any) => {
  const data = {
    username: admin.get("username"),
    password: admin.get("password"),
  };

  const response = await api.post(`/admin/admins`, JSON.stringify(data), {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "Application/json",
    },
  });

  return response;
};
