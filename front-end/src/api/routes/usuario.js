import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const login = async (email, senha) => {
  console.log("🔍 API_BASE_URL:", import.meta.env.VITE_API_BASE_URL);
  console.log("🔍 Login attempt:", { email, senha });
  try {
    const { data } = await api.post("/api/Usuarios/login", { email, senha });
    console.log("✅ Login success:", data);
    return data;
  } catch (error) {
    console.error("❌ Login error:", error.response?.data || error.message);
    throw error;
  }
};

export const createUser = async (userData) => {
  const { data } = await api.post("/api/Usuarios/create", userData);
  return data;
};