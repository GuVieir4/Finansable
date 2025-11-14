import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
});

console.log("🔧 Axios baseURL set to:", API_BASE_URL);

// Add request interceptor to include auth token
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
    const { data } = await api.post("/Usuarios/login", { email, senha });
    console.log("✅ Login success:", data);
    return data;
  } catch (error) {
    console.error("❌ Login error:", error.response?.data || error.message);
    throw error;
  }
};

export const getTransactions = async (userId) => {
  const { data } = await api.get(`/Transacoes/usuario/${userId}`);
  return data;
};

export const getGoals = async (userId) => {
  const { data } = await api.get(`/Poupancas/usuario/${userId}`);
  return data;
};

export const createGoal = async (goalData) => {
  const { data } = await api.post("/Poupancas", goalData);
  return data;
};

export const deleteGoal = async (id) => {
  await api.delete(`/Poupancas/${id}`);
};

export const updateGoal = async (id, goalData) => {
  const { data } = await api.put(`/Poupancas/${id}`, goalData);
  return data;
};

export const createUser = async (userData) => {
  console.log("🔍 Creating user:", userData);
  try {
    const { data } = await api.post("/Usuarios/create", userData);
    console.log("✅ User created:", data);
    return data;
  } catch (error) {
    console.error("❌ Create user error:", error.response?.data || error.message);
    throw error;
  }
};