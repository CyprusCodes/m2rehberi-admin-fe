import axios from "axios";
import { getAuthToken } from "@/lib/storage";

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const API_BASE_URL = "http://localhost:3001";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json,text/plain,*/*",
  },
});

apiClient.defaults.baseURL = API_BASE_URL;

apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
