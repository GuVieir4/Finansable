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

export const getTransactions = async (userId) => {
  const { data } = await api.get(`/api/Transacoes/usuario/${userId}`);
  return data;
};

export const getDashboardData = async (userId) => {
  const { data } = await api.get(`/api/Transacoes/dashboard/${userId}`);
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