import api from "@/api";

export const userLogin = async (username: string, password: string) => {
  const response = await api.post("/admin/login", { username, password });
  return response;
};
