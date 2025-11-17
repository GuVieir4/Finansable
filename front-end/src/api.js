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

export const getTransactions = async (userId) => {
  const { data } = await api.get(`/api/Transacoes/usuario/${userId}`);
  return data;
};

export const getDashboardData = async (userId) => {
  const { data } = await api.get(`/api/Transacoes/dashboard/${userId}`);
  return data;
};

export const getGoals = async (userId) => {
  const { data } = await api.get(`/api/Poupancas/usuario/${userId}`);
  return data;
};

export const createGoal = async (goalData) => {
  const { data } = await api.post("/api/Poupancas", goalData);
  return data;
};

export const deleteGoal = async (id) => {
  await api.delete(`/api/Poupancas/${id}`);
};

export const updateGoal = async (id, goalData) => {
  const { data } = await api.put(`/api/Poupancas/${id}`, goalData);
  return data;
};

export const createTransaction = async (transactionData) => {
  const { data } = await api.post("/api/Transacoes", transactionData);
  return data;
};

export const updateTransaction = async (id, transactionData) => {
  const { data } = await api.put(`/api/Transacoes/${id}`, transactionData);
  return data;
};

export const deleteTransaction = async (id) => {
  await api.delete(`/api/Transacoes/${id}`);
};