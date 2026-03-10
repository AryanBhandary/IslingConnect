import axios from "axios";
import { APP_API_URI } from "./config";

const api = axios.create({
  baseURL: APP_API_URI,
  headers: {
    "ngrok-skip-browser-warning": "true",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
