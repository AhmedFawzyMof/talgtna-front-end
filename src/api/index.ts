import axios from "axios";

const api = axios.create({
  baseURL: "/talgtna/api",
});

export default api;
