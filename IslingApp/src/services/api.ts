import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { APP_API_URI } from "../../config";

const api = axios.create({
    baseURL: APP_API_URI,
});

// Request interceptor to add the Bearer token
api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
