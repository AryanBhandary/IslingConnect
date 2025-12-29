import axios from "axios";
import { APP_API_URI } from "./config";

const api = axios.create({
  baseURL: APP_API_URI,
  headers: {
    "ngrok-skip-browser-warning": "true",
  },
});

export default api;
