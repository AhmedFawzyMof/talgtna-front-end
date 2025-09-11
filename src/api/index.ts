import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/talgtna/api",
});

export default api;
