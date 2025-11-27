import axios from "axios";
import { useStatusModalStore } from "../store/modal-store";
import useAuthStore from "../store/auth-store";

const api = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL || "http://localhost:5000",
});

const PUBLIC_PATHS = [
  "/v1/api/auth/register",
  "/v1/api/auth/login",
  "/v1/api/users/admin",
];

// REQUEST
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  const isPublic = PUBLIC_PATHS.includes(config.url);

  if (isPublic) {
    delete config.headers.Authorization;
    return config;
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// RESPONSE
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error.response?.status;
    const { logout } = useAuthStore.getState();
    const { showError } = useStatusModalStore.getState();


    if (status === 401) {
      showError("Sua sessão expirou. Faça login novamente.");
      logout();
      localStorage.removeItem("token");
    }

    return Promise.reject(error);
  }
);

export default api;
